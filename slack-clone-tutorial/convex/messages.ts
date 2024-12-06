import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  //根据传递的messageId作为parentMessageId查询相关的回复信息
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();
  //没有回复信息的返回值
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }
  //最新的一条回复信息
  const lastMessage = messages[messages.length - 1];
  //查询最新信息发送的用户id
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
    };
  }
  //获取到用户详细信息
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
  //返回消息条数；发送最后一条消息的用户的头像；最后一条信息的发送时间
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};
//查询member信息
const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspcae_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

// 辅助函数：填充消息的详细信息
const populateMessageDetails = async (
  ctx: QueryCtx,
  message: Doc<"messages">
) => {
  const member = await populateMember(ctx, message.memberId);
  const user = member ? await populateUser(ctx, member.userId) : null;

  if (!member || !user) {
    return null;
  }

  // 并行获取 reactions、thread 和 image URL
  const [reactions, thread, image] = await Promise.all([
    populateReactions(ctx, message._id),
    populateThread(ctx, message._id),
    message.image ? ctx.storage.getUrl(message.image) : undefined,
  ]);

  // 计算去重后的反应计数
  const reactionCounts = reactions.reduce(
    (acc, reaction) => {
      //使用 find 方法在 acc 中查找是否已经存在与当前 reaction 相同类型的反应（通过 r.value === reaction.value 判断）。
      const existing = acc.find((r) => r.value === reaction.value);
      //如果 existing 不为 undefined，说明 acc 中已经存在此类型的反应。则将 existing.count 加 1，以更新此类型反应的数量。
      if (existing) {
        existing.count += 1;
        existing.memberIds.push(reaction.memberId);
      } else {
        //如果 existing 为 undefined，说明 acc 中尚不存在此类型的反应。将当前的 reaction 对象扩展为新对象，并增加 count: 1 和 memberIds: [reaction.memberId]。
        acc.push({
          ...reaction,
          count: 1,
          memberIds: [reaction.memberId],
        });
      }
      return acc;
    },
    //初始化累加器 acc
    [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
  );

  // 删除 memberId 属性，返回去重的 reactions 数据
  const dedupedReactions = reactionCounts.map(({ memberId, ...rest }) => rest);

  return {
    ...message,
    image,
    member,
    user,
    reactions: dedupedReactions,
    threadCount: thread.count,
    threadImage: thread.image,
    threadTimestamp: thread.timestamp,
  };
};
//分页查询消息
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator, // 分页查询配置
  },
  handler: async (ctx, args) => {
    // 验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");

    // 处理 conversationId
    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    // 查询消息并分页
    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    // 填充消息详情
    const populatedMessages = await Promise.all(
      results.page.map((message) => populateMessageDetails(ctx, message))
    );

    return {
      ...results,
      page: populatedMessages.filter(
        (msg): msg is NonNullable<typeof msg> => msg !== null
      ),
    };
  },
});

//创建一个message
export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    //验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");
    //验证当前用户id和workspaces是否对应
    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized!");
    }
    //处理conversationId
    let _conversationId = args.conversationId;
    //只有当我们在一对一的对话中才有可能回复信息
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found ");
      }
      _conversationId = parentMessage.conversationId;
    }

    //插入一条数据到messages表
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,

      conversationId: _conversationId,
    });
    return messageId;
  },
});

//更新消息
export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // 验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");
    //根据id查询对应的消息文档
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    //查询member信息是否匹配
    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }
    //更新消息
    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});
//删除消息
export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    // 验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");
    //根据id查询对应的消息文档
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    //查询member信息是否匹配
    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }
    //更新消息
    await ctx.db.delete(args.id);
    return args.id;
  },
});
//根据id查询对应的消息
export const getById = query({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    // 验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    //查询message
    const message = await ctx.db.get(args.id);
    if (!message) {
      return null;
    }
    // 验证当前用户id和workspaces是否对应
    const currentMember = await getMember(ctx, message.workspaceId, userId);
    if (!currentMember) {
      return null;
    }
    //保证该message对应的member和user都存在
    const member = await populateMember(ctx, message.memberId);
    if (!member) {
      return null;
    }
    const user = await populateUser(ctx, member.userId);
    if (!user) {
      return null;
    }
    const reactions = await populateReactions(ctx, message._id);
    // 计算去重后的反应计数
    const reactionCounts = reactions.reduce(
      (acc, reaction) => {
        //使用 find 方法在 acc 中查找是否已经存在与当前 reaction 相同类型的反应（通过 r.value === reaction.value 判断）。
        const existing = acc.find((r) => r.value === reaction.value);
        //如果 existing 不为 undefined，说明 acc 中已经存在此类型的反应。则将 existing.count 加 1，以更新此类型反应的数量。
        if (existing) {
          existing.count += 1;
          existing.memberIds.push(reaction.memberId);
        } else {
          //如果 existing 为 undefined，说明 acc 中尚不存在此类型的反应。将当前的 reaction 对象扩展为新对象，并增加 count: 1 和 memberIds: [reaction.memberId]。
          acc.push({
            ...reaction,
            count: 1,
            memberIds: [reaction.memberId],
          });
        }
        return acc;
      },
      //初始化累加器 acc
      [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
    );
    // 删除 memberId 属性，返回去重的 reactions 数据
    const rectionsWithoutMemberIdProperty = reactionCounts.map(
      ({ memberId, ...rest }) => rest
    );
    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      user,
      member,
      reactions: rectionsWithoutMemberIdProperty,
    };
  },
});

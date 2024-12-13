import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

//根据用户id和workspaceid查询member
export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return null;
    }
    return member;
  },
});
//根据id查询users表
const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};
//根据成员id查表
export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const member = await ctx.db.get(args.id);
    if (!member) {
      return null;
    }
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!currentMember) {
      return null;
    }
    const user = await populateUser(ctx, member.userId);
    if (!user) {
      return null;
    }
    return {
      ...member,
      user,
    };
  },
});
//根据workspaceId查询相关的userId，然后再user表中查询用户的详细信息
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    //检查当前用户id和workspace的id是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return [];
    }
    //在member中查询一个workspace关联的所有用户
    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    const members = [];
    for (const member of data) {
      //用member表获取的userid去user表查询用户的信息
      const user = await populateUser(ctx, member.userId);
      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }
    return members;
  },
});
// 更新成员信息
export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const member = await ctx.db.get(args.id);
    if (!member) {
      throw new Error("Member not found");
    }
    //查找当前成员的信息
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    //当前成员不存在或者当前成员不是管理员角色
    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //更新角色属性
    await ctx.db.patch(args.id, {
      role: args.role,
    });
    return args.id;
  },
});
// 删除成员
export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const member = await ctx.db.get(args.id);
    if (!member) {
      throw new Error("Member not found");
    }
    //查找当前成员的信息
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    //当前成员不存在或者当前成员不是管理员角色
    if (!currentMember) {
      throw new Error("Unauthorized");
    }
    //要删除的成员是管理员是不允许删除的
    if (member.role === "admin") {
      throw new Error("Admin cannot be removed");
    }
    //当前登录的用户是不是参数传递的用户
    if (currentMember._id === args.id && currentMember.role === "admin") {
      throw new Error("Cannot remove self if self is an admin");
    }
    //查询与即将删除成员相关数据并删除
    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);
    //删除相关消息
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    //删除相关对话
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }
    //删除相关反应
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    //删除当前成员
    await ctx.db.delete(args.id);
    return args.id;
  },
});

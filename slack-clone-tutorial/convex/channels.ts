import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
//根据workspaceId查询相关的所有的channel数据
export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    //验证当前用户id和workspaces是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return [];
    }
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    return channels;
  },
});
//创建channel
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //验证当前用户id和workspaces是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    //验证用户的权限
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();
    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });
    return channelId;
  },
});

//根据channelId获取channel信息
export const getById = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    //获取channel信息
    const channel = await ctx.db.get(args.id);
    if (!channel) {
      return null;
    }
    //验证当前用户id和workspaces是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) {
      return null;
    }
    return channel;
  },
});

//根据id更新channel的数据
export const update = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    //验证当前用户id和workspaces是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();
    //验证用户的权限
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //更新用户数据
    await ctx.db.patch(args.channelId, {
      name: args.name,
    });
    return args.channelId;
  },
});

//根据id删除channel的数据
export const remove = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    //验证当前用户id和workspaces是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();
    //验证用户的权限
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //删除相关的message的数据
    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.channelId))
        .collect(),
    ]);
    for (const message of messages) await ctx.db.delete(message._id);
    //删除用户数据
    await ctx.db.delete(args.channelId);
    return args.channelId;
  },
});

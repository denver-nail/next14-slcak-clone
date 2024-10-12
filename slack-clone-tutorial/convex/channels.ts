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

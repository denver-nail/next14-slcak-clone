import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    //验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");
    //当前登录用户和工作区查询成员信息
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    //查询另一个用户
    const otherMember = await ctx.db.get(args.memberId);
    //用户不存在
    if (!currentMember || !otherMember) {
      throw new Error("Member not found!");
    }
    //查询上面两个成员对应的对话数据
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();
    //已经存在对话就返回对话
    if (existingConversation) {
      return existingConversation._id;
    }
    //不存在对话就创建新的对话
    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });

    return conversationId;
  },
});

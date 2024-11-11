/*
 * @Author: LIU
 * @Date: 2024-11-10 19:07:44
 * @Description: 请填写简介
 */
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
//切换状态
export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    // 验证用户权限
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized!");
    //验证消息存在性
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found.");
    }
    //检查当前用户是否是消息所在工作区的成员。
    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized!");
    }
    // /判断当前用户是否已经对某条消息做出了特定的反应
    const exsitingMessageReactionFromUser = await ctx.db
      .query("reactions") // 使用 AND 条件将多个查询条件结合
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId), // 条件 1: messageId 字段等于传入的 messageId
          q.eq(q.field("memberId"), member._id), // 条件 2: memberId 字段等于当前用户（成员）的 ID
          q.eq(q.field("value"), args.value) // 条件 3: value 字段等于传入的反应值
        )
      )
      .first(); // 只获取符合条件的第一条记录
    //如果做出了反应就删除该反应
    if (exsitingMessageReactionFromUser) {
      await ctx.db.delete(exsitingMessageReactionFromUser._id);
      return exsitingMessageReactionFromUser._id;
    } else {
      //如果没有作出反应就添加该反应
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        memberId: member._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });
      return newReactionId;
    }
  },
});

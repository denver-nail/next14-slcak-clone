import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
//查询workspaces表所有数据
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});
//插入一个文档到workspces表
export const create = mutation({
  args: { name: v.string() }, //该接口需要的参数声明
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx); //获取当前用户id
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //TODO: 创建一个方法去生成joinCode字段
    const joinCode = "123456";
    //向数据库中插入一条文档，返回该文档的id
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    /*     //根据返回的id获取对应的workspace的所有字段数据
    const workspace = await ctx.db.get(workspaceId); */
    /*   //返回一个文档
    return workspace; */
    //返回一个id
    return workspaceId;
  },
});
//根据id查询一个workspace
export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    //验证用户权限
    const userId = await getAuthUserId(ctx); //获取当前用户id
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.get(args.id);
  },
});

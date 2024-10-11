import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { useId } from "react";
const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvdxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  return code;
};
//查询登录用户所有所有的workspaces
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!useId) {
      return [];
    }
    //根据当前用户id查询member中该用户对应的文档
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId!))
      .collect();
    //根据查询的members表的数据获取当前用户对应的所有workspace的id
    const worksapceIds = members.map((member) => member.workspaceId);
    const workspaces = [];
    //获取所有的workspace数据
    for (const workspaceId of worksapceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
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
    //创建一个方法去生成joinCode字段
    const joinCode = generateCode();
    //向数据库中插入一条文档，返回该文档的id
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    //向member表插入一条文档
    await ctx.db.insert("members", { userId, workspaceId, role: "admin" });

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
    //检查当前用户id和workspace的id是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) return null;
    return await ctx.db.get(args.id);
  },
});

//根据id更新一个workspace
export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    //验证用户权限
    const userId = await getAuthUserId(ctx); //获取当前用户id
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //检查当前用户id和workspace的id是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //更新name属性
    await ctx.db.patch(args.id, {
      name: args.name,
    });
    return args.id;
  },
});

//根据id删除一个workspace和对应的member中的数据
export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    //验证用户权限
    const userId = await getAuthUserId(ctx); //获取当前用户id
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //检查当前用户id和workspace的id是否对应
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspcae_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //查询相应的member的数据
    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);
    for (const member of members) {
      //删除member
      await ctx.db.delete(member._id);
    }
    //删除workspace
    await ctx.db.delete(args.id);
    return args.id;
  },
});

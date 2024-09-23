import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  //这个是convexAuth框架自动生成的几个表
  ...authTables,
  //自己定义工作区相关数据的表
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
});

export default schema;

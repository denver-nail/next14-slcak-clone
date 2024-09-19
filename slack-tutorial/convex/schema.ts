import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
//1.使用convex提供的定义模式
const schema = defineSchema({
  //定义各个表的字段
  //tasks表字段
  tasks: defineTable({
    completed: v.boolean(), //字段名：类型
  }),
});
//2.导出模式
export default schema;

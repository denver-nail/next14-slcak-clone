import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

const schema = defineSchema({
  //这个是convexAuth框架自动生成的几个表
  ...authTables,
});

export default schema;

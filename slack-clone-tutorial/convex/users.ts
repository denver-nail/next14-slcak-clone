//当前文件的名字与之后的api调用相关
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
//获取当前用户信息的接口
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

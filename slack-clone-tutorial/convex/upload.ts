import { mutation } from "./_generated/server";
//生成上传后的url
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { DataModel } from "./_generated/dataModel";
//自定义密码登录方式验证
const CustomPassword = Password<DataModel>({
  profile(params) {
    //在return前可以做数据校验
    //尝试过使用zod验证但是在抛出一个ConvexError之后在表单位置使用instanceof 判断类型时反映不是ConvexError
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google, CustomPassword],
});

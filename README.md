# Real-Time Slack Clone

技术栈

1. [NextJS14](https://nextjs.org/docs/getting-started/installation)
2. [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
3. [React Icons (react-icons.github.io)](https://react-icons.github.io/react-icons/)
4. [Convex | The fullstack TypeScript development platform](https://www.convex.dev/)
5. [Convex Auth - Convex Auth](https://labs.convex.dev/auth)
6. [Lucide React | Lucide](https://lucide.dev/guide/packages/lucide-react)

搭建环境：

执行命令配置nextjs

```
npx create-next-app@latest
```

执行命令配置shadcnUI

```
npx shadcn@latest init
```

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_10-43-53.png)

## 使用Convex数据库

[Next.js Quickstart | Convex Developer Hub](https://docs.convex.dev/quickstart/nextjs)

执行命令

```
 npm install convex
 npx convex dev
```

创建账户和连接本地后

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-18_20-17-16.png)

向数据库中插入数据

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-18_20-26-48.png)

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-18_20-25-32.png)

启动服务命令

```
 npx convex dev
```

## 使用convexAuth

[Set Up Convex Auth - Convex Auth](https://labs.convex.dev/auth/setup)

使用命令

```
npm install @convex-dev/auth @auth/core
npx @convex-dev/auth
```

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_10-05-45.png)

### 配置服务器端身份认证

[Server-side authentication in Next.js - Convex Auth](https://labs.convex.dev/auth/authz/nextjs)

### 配置用户身份验证

方案一：使用第三方的认证登录如Google或Github等

[OAuth - Convex Auth](https://labs.convex.dev/auth/config/oauth)

**以Github认证为例**

**1.callbak URL**

在convex的仪表盘中找到HTTP Actions URL

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_15-50-20.png)

在github中配置HTTP Actions URL

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_15-57-17.png) 

**2.设置环境变量**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_16-01-37.png)

注册好OAuth应用后获取client ID和client secriets并配置到convex中

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_16-24-39.png)

执行两个命令配置

```
npx convex env set AUTH_GITHUB_ID yourgithubclientid
npx convex env set AUTH_GITHUB_SECRET yourgithubsecret
```

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_16-26-28.png)

**3.Provider 配置**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_17-59-43.png)

**4.绑定登录按钮**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_18-29-57.png)

**绑定登出按钮**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_18-30-52.png)

**Google设置**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_18-42-25.png)

```
 npx convex env set AUTH_GOOGLE_ID=676726185338-madl2a2cqcntndrr1sip8gid96npcnlv.apps.googleusercontent.com
 
 
 npx convex env set AUTH_GOOGLE_SECRET=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
```

**方案二：使用邮箱密码登录**

**1.配置Provider**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_19-49-50.png)

**2.添加注册表单**

```tsx
//注册卡片组件
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
interface SignUpCardProps {
  setState: (state: SignFlow) => void;
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuthActions();
  //第三方平台注册回调
  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  //使用convexAuth提供的方法来注册用户(邮箱密码),作为表单回调
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPasword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    //第一个参数是登录或注册的方式，第二个参数是表单数据，其中要设置flow字段来分辨‘注册’和‘登录’
    signIn("password", { email, password, flow: "signUp" })
      .catch(() => {
        setError("😱Something went wrong!");
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Input
            disabled={pending}
            value={confirmPasword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Confirm Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

```

**登录表单**

```js
//登录卡片组件
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
interface SignInCardProps {
  setState: (state: SignFlow) => void;
}
export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  //使用convexAuth提供的的方法来注册或登录
  const { signIn } = useAuthActions();
  //使用convexAuth提供的的方法来注册用户(第三方平台)
  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  //使用convexAuth提供的方法来注册用户(邮箱密码)
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    //第一个参数是登录或注册的方式，第二个参数是表单数据，其中要设置flow字段来分辨‘注册’和‘登录’
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {//注册卡片组件
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
interface SignUpCardProps {
  setState: (state: SignFlow) => void;
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  //使用convexAuth提供的的方法来注册或登录
  const { signIn } = useAuthActions();
  //第三方平台注册回调
  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  //使用convexAuth提供的方法来注册用户(邮箱密码),作为表单回调
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPasword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    //第一个参数是登录或注册的方式，第二个参数是表单数据，其中要设置flow字段来分辨‘注册’和‘登录’
    signIn("password", { name, email, password, flow: "signUp" })
      .catch((error) => {
        console.log(error instanceof SyntaxError);

        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Name"
            required
          ></Input>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Input
            disabled={pending}
            value={confirmPasword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Confirm Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

        setError("😱Invalid email or password!");
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      {/* 表单部分 */}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

```

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-22_16-20-18.png)

## 数据操作

### 查询用户数据

参考文档：

[server - Convex Auth](https://labs.convex.dev/auth/api_reference/server#getauthuserid)

[Queries | Convex Developer Hub](https://docs.convex.dev/functions/query-functions#caching--reactivity--consistency)

**convex/users.ts**

```ts
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

```

**src\features\auth\hooks\use-current-user.ts**

```js
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
//查询当前用户信息的钩子
//根据当前查询的结果返回对应的用户信息和加载状态
export const useCurrentUser = () => {
  const data = useQuery(api.users.current);
  const isLoading = data === undefined;
  return { data, isLoading };
};

```

**src\features\auth\components\user-button.tsx**

```tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../hooks/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
export const UserButton = () => {
  //使用convexAuth的登出接口函数
  const { signOut } = useAuthActions();
  //调用封装的获取当前用户信息的hook
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!user) {
    return null;
  }
  const { image, name } = user;
  //设置头像图片展示失败后显示的文字内容
  const avatarFallback = name!.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="bg-[#ff9999] text-[#444f5a] font-bold ">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()} className="h-10">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

```


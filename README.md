# Real-Time Slack Clone

技术栈

1. [NextJS14](https://nextjs.org/docs/getting-started/installation)
2. [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
3. [React Icons (react-icons.github.io)](https://react-icons.github.io/react-icons/)
4. [Convex | The fullstack TypeScript development platform](https://www.convex.dev/)
5. [Convex Auth - Convex Auth](https://labs.convex.dev/auth)
6. [Lucide React | Lucide](https://lucide.dev/guide/packages/lucide-react)
7. [jotai - npm (npmjs.com)](https://www.npmjs.com/package/jotai)
8. [react-use - npm (npmjs.com)](https://www.npmjs.com/package/react-use)
9. [react-verification-input - npm (npmjs.com)](https://www.npmjs.com/package/react-verification-input)
10. [quill - npm (npmjs.com)](https://www.npmjs.com/package/quill)
11. [emoji-mart - npm (npmjs.com)](https://www.npmjs.com/package/emoji-mart)
12. [date-fns - npm (npmjs.com)](https://www.npmjs.com/package/date-fns)

    

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

## 创建新的表

参考文档：[Schemas | Convex Developer Hub](https://docs.convex.dev/database/schemas)

**convex\schema.ts**

```ts
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

```

## Quill富文本编辑器使用

`Quill` 是一个轻量、可扩展的开源富文本编辑器。它具有丰富的文本编辑功能，并支持通过模块和 API 扩展实现更多自定义功能。下面介绍 `Quill` 的基础用法、配置、以及常用的 API。

### 1. **安装和引入 Quill**

安装 `Quill`：

```bash
npm install quill
```

引入 `Quill` 及其默认样式：

```javascript
import Quill from "quill";
import "quill/dist/quill.snow.css"; // 或 "quill/dist/quill.bubble.css" 选择其他主题
```

### 2. **初始化 Quill 编辑器**

创建一个 `<div>` 容器，并在其中初始化 `Quill`：

```javascript
const container = document.getElementById("editor"); // 获取编辑器容器
const quill = new Quill(container, {
  theme: "snow", // 指定编辑器主题，可选 "snow"、"bubble"、"core"
  placeholder: "Write something here...", // 占位符
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // 加粗、斜体、下划线、删除线
      ["link", "image", "video"], // 插入链接、图片、视频
      [{ list: "ordered" }, { list: "bullet" }], // 有序列表、无序列表
      [{ header: [1, 2, 3, false] }], // 标题等级
    ],
  },
});
```

### 3. **配置模块（Modules）**

`Quill` 支持多个模块，用于扩展编辑器的功能。常用模块包括 `toolbar`、`keyboard`、`clipboard` 等。

- **Toolbar**：工具栏模块，用于配置编辑器上方的工具按钮，可以自定义布局。
  
  ```javascript
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  }
  ```

- **Keyboard**：键盘绑定模块，可以自定义快捷键行为，例如 `Shift+Enter` 插入换行、`Enter` 提交表单等。

  ```javascript
  modules: {
    keyboard: {
      bindings: {
        enter: {
          key: 13, // Enter键的ASCII码
          handler: function() {
            console.log("Enter was pressed!");
          }
        },
      }
    }
  }
  ```

### 4. **基本 API 操作**

- **获取和设置内容**：

  - `getText()`：获取编辑器的纯文本内容。
  - `getContents()`：获取内容的 `Delta` 格式（Quill 内部表示文本及其格式的格式）。
  - `setText(text)`：设置纯文本内容。
  - `setContents(delta)`：用 `Delta` 对象设置内容。
  
  ```javascript
  const text = quill.getText(); // 获取纯文本
  const delta = quill.getContents(); // 获取 Delta 格式内容
  
  quill.setText("Hello, world!"); // 设置纯文本内容
  quill.setContents([{ insert: "Hello, world!" }]); // 用 Delta 格式设置内容
  ```

- **插入文本或格式**：

  - `insertText(index, text, formats)`：在指定位置插入带格式的文本。
  - `formatText(index, length, format, value)`：格式化文本，例如加粗、斜体等。
  
  ```javascript
  quill.insertText(0, "Hello", { bold: true }); // 在开头插入加粗文本
  quill.formatText(0, 5, "italic", true); // 将前5个字符设为斜体
  ```

- **插入其他内容**：

  - `insertEmbed(index, type, value)`：插入非文本内容，比如图片或视频。
  
  ```javascript
  quill.insertEmbed(10, "image", "https://example.com/image.jpg");
  ```

### 5. **事件监听**

`Quill` 提供了多个事件，用于监听编辑器内容的变化：

- **`text-change`**：监听文本变化事件，通常用于获取输入的最新内容。
  
  ```javascript
  quill.on("text-change", (delta, oldDelta, source) => {
    console.log("Text changed:", quill.getText());
  });
  ```

- **`selection-change`**：监听选区变化事件，例如用户选择了文本时触发。
  
  ```javascript
  quill.on("selection-change", (range, oldRange, source) => {
    if (range) {
      console.log("User selected text");
    } else {
      console.log("User deselected text");
    }
  });
  ```

### 6. **Delta 格式**

`Delta` 是 `Quill` 的内部数据格式，表示内容和格式，能够方便地跟踪文本及其变更。通常在获取内容、设置内容、或进行富文本操作时使用。

示例：

```javascript
const delta = quill.getContents();
console.log(delta); // Delta格式的数据

// 使用 Delta 设置内容
quill.setContents([
  { insert: "Hello ", attributes: { bold: true } },
  { insert: "world!" },
]);
```

### 7. **自定义主题和样式**

`Quill` 提供了 `snow` 和 `bubble` 主题，你也可以通过自定义 CSS 实现样式定制。比如可以定制工具栏或编辑区域的样式：

```css
.ql-toolbar {
  background-color: #f4f4f4;
}
.ql-editor {
  min-height: 200px;
  font-family: Arial, sans-serif;
}
```

### 8. **禁用编辑器**

可以在 `Quill` 初始化时或使用 `disable` 方法来禁用编辑器：

```javascript
quill.disable(); // 禁用编辑器
quill.enable(); // 启用编辑器
```

### 9. **销毁编辑器**

`Quill` 没有自带的销毁方法，但你可以移除 DOM 元素以手动销毁实例，确保不会造成内存泄漏：

```javascript
quill.off("text-change"); // 移除事件监听
document.getElementById("editor").innerHTML = ""; // 清空编辑器容器
```

### 总结

`Quill` 是一个功能强大且灵活的富文本编辑器，提供了全面的 API、事件监听和模块配置选项，可以轻松实现富文本编辑的各种需求，并支持高级的内容管理与定制化。

## 构建工作区workspaces

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\构建workspace工作区流程.png)

**Toolbar部分**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-26_15-18-08.png)

**sideBar部分**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-28_15-24-06.png)

**工作区的sidebar部分**

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-10_11-09-42.png)

实现了preference部分

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-11_10-42-19.png)

实现了workspace的功能区域搭建

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-11_21-20-25.png)

实现邀请码的生成和更新

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-13_15-35-50.png)

实现通过邀请码加入工作区的功能

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-14_15-05-46.png)

实现channelIdPage的头部部分

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-23_19-23-32.png)

实现channelIdPage的编辑区的静态搭建

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-25_14-53-54.png)

实现向编辑区插入emoji功能

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-10-25_16-28-46.png)

实现上传图片和预览+消息列表的**基本**展示

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-11-07_18-51-05.png)

项目中暂存的问题       

1. 在用户第一次登录时存在没有加载任何workspace
2. 登录时加载了其他组件userbutton
3. 

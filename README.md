# Real-Time Slack Clone

技术栈

1. [NextJS14](https://nextjs.org/docs/getting-started/installation)
2. [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
3. [React Icons (react-icons.github.io)](https://react-icons.github.io/react-icons/)
4. [Convex | The fullstack TypeScript development platform](https://www.convex.dev/)
5. [Convex Auth - Convex Auth](https://labs.convex.dev/auth)

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


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

![](..\assert\Snipaste_2024-09-19_10-43-53.png)

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

使用命令

```
npm install @convex-dev/auth @auth/core
npx @convex-dev/auth
```

![](D:\Codes\前端学习\16-全栈项目\real-time-slack-clone\assert\Snipaste_2024-09-19_10-05-45.png)

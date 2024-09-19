import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
//配置 哪些路由需要在 middleware.ts 中进行认证:
const isPublicPage = createRouteMatcher(["/signin"]);
export default convexAuthNextjsMiddleware((request) => {
  //判断当前路由是不是isPublicPage中配置的路由/signin且判断当前的请求是否被验证
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    //当前请求不在public的页面且没有经过权限认证的话就将请求重定向到登录
    return nextjsMiddlewareRedirect(request, "/signin");
  }
  //TODO:重定向登录的用户到指定页面
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

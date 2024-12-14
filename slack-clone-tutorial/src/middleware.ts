import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

//配置 哪些路由需要在 middleware.ts 中进行认证:
const isPublicPage = createRouteMatcher(["/auth"]);
export default convexAuthNextjsMiddleware((request) => {
  //经过/auth和通过验证的用户到重定向到其他页面
  if (isPublicPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  //判断当前路由是不是isPublicPage中配置的路由/auth且判断当前的请求是否被验证
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    //当前请求不在public的页面且没有经过权限认证的话就将请求重定向到/auth
    return nextjsMiddlewareRedirect(request, "/auth");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

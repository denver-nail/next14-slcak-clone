/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 下面这个是开发时使用的域名
      {
        protocol: "https",
        //你的域名
        hostname: "nautical-peacock-147.convex.cloud",
      },
      //下面这个是部署时使用的域名
      {
        protocol: "https",
        //你的域名
        hostname: "outstanding-panther-38.convex.cloud",
      },
    ],
  },
};

export default nextConfig;

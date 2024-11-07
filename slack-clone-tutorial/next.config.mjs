/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        //你的域名
        hostname: "nautical-peacock-147.convex.cloud",
      },
    ],
  },
};

export default nextConfig;

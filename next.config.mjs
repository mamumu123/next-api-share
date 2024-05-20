/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "/",
      "github.githubassets.com",
      "next-api-share.vercel.app",
    ],
  }
};

export default nextConfig;

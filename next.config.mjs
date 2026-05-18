/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "./",
  output: "export",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

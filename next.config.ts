import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static HTML Export (GitHub Pages)
  trailingSlash: true, // emit route/index.html so GitHub Pages serves /contact/ cleanly

  // Pin the workspace root to THIS project. A stray package.json/lockfile in
  // the home directory makes Next infer the wrong root and pull in sibling
  // projects' files (e.g. proxy.ts/middleware). process.cwd() is the project
  // dir both locally and in CI.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),

  images: {
    unoptimized: true, // no image optimization server on static export
  },
};

export default nextConfig;

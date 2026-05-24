import type { NextConfig } from "next";

// Deploy targets:
//   - Vercel (root design-yeh.vercel.app)        → basePath '' (auto via VERCEL=1)
//   - GH Pages (subpath /designyeh/)             → basePath '/designyeh'
//   - Custom root domain                         → set NEXT_PUBLIC_BASE_PATH=''
const explicit = process.env.NEXT_PUBLIC_BASE_PATH;
const isVercel = !!process.env.VERCEL;
const basePath =
  explicit !== undefined ? explicit : isVercel ? "" : "/designyeh";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Bake the computed basePath into client bundles so asset() helper / client
  // code sees the same value (Vercel doesn't expose VERCEL=1 to browser).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  // Local-only escape hatch: stray /Users/grizrider/package.json (home-dir
  // lockfile) makes Turbopack walk up and pull in sibling project files
  // (mybdr/src/proxy.ts). Vercel CI has a clean checkout so this is unneeded
  // and may actually confuse the Vercel build container's path tracing.
  ...(isVercel ? {} : { turbopack: { root: process.cwd() } }),

  images: { unoptimized: true },
};

export default nextConfig;

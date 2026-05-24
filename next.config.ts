import type { NextConfig } from "next";

// Deploy targets:
//   - GH Pages (subpath /designyeh/) → basePath '/designyeh'
//   - Vercel (root design-yeh.vercel.app)   → basePath ''  (auto via VERCEL env)
//   - Custom root domain                    → set NEXT_PUBLIC_BASE_PATH=''
//
// VERCEL=1 is injected automatically by Vercel builds. Override always wins.
const explicit = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath =
  explicit !== undefined ? explicit : process.env.VERCEL ? "" : "/designyeh";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Bake the computed basePath into client bundles so asset() / lib code
  // sees the same value config does (Vercel doesn't pass VERCEL=1 to the
  // browser). NEXT_PUBLIC_* is inlined at build time.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  // Pin Turbopack root so it doesn't walk up to stray home-dir lockfiles.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),

  images: { unoptimized: true },
};

export default nextConfig;

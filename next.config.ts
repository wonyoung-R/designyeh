import type { NextConfig } from "next";

// GH Pages serves at https://wonyoung-r.github.io/designyeh/, a subpath.
// Set basePath explicitly so next/image + next/link + useRouter all prepend it.
// (configure-pages only sets assetPrefix, which covers /_next/ but not <img>.)
// Override with NEXT_PUBLIC_BASE_PATH="" when moving to a custom root domain
// (e.g. designyeh.kr) or Vercel.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/designyeh";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath,
  assetPrefix: basePath || undefined,

  // Pin the workspace root so Next doesn't walk up to a stray home-dir lockfile
  // (was pulling in mybdr's proxy.ts). process.cwd() is the project dir.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),

  images: { unoptimized: true },
};

export default nextConfig;

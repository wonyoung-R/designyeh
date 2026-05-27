import type { NextConfig } from "next";
import { existsSync } from "fs";
import { join } from "path";

// Deploy targets:
//   - Custom domain (e.g. dsgnyeh.art via public/CNAME) → basePath ''  (root)
//   - Vercel (VERCEL=1)                                 → basePath ''  (root)
//   - GH Pages subpath (wonyoung-r.github.io/designyeh/) → basePath '/designyeh'
//   - Explicit override                                  → NEXT_PUBLIC_BASE_PATH
//
// public/CNAME is detected at build time — if present, GH Pages is serving
// at a custom apex domain so paths must be root-relative.
const explicit = process.env.NEXT_PUBLIC_BASE_PATH;
const hasCNAME = existsSync(join(process.cwd(), "public", "CNAME"));
const isVercel = !!process.env.VERCEL;
const basePath =
  explicit !== undefined
    ? explicit
    : hasCNAME || isVercel
    ? ""
    : "/designyeh";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Bake the computed basePath into client bundles so asset() helper / client
  // code sees the same value (build-time NEXT_PUBLIC_ inlining).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  // Local-only escape hatch for stray home-dir lockfile confusing Turbopack.
  ...(isVercel ? {} : { turbopack: { root: process.cwd() } }),

  images: { unoptimized: true },
};

export default nextConfig;

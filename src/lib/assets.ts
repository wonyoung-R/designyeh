// Build-time asset path helper.
//
// next/image with `unoptimized: true` does NOT prepend basePath to the src
// (it skips the optimizer that would). Local <img>/<a href> tags also stay
// root-absolute. Use this helper to prefix any path you control.
//
// NEXT_PUBLIC_BASE_PATH is read at build time. Default '/designyeh' matches
// the GH Pages project subpath. Set `NEXT_PUBLIC_BASE_PATH=""` in CI when
// deploying to a root domain (custom domain on GH Pages, or Vercel).

export const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/designyeh"

export function asset(path: string): string {
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path
  if (!ASSET_BASE) return path.startsWith("/") ? path : "/" + path
  if (path.startsWith(ASSET_BASE + "/") || path === ASSET_BASE) return path
  return `${ASSET_BASE}${path.startsWith("/") ? path : "/" + path}`
}

// works.ts — portfolio data model + fallback data + salon-wall layout presets
//
// The gallery (ROOM 02) renders from Supabase `portfolios`. If the table is
// empty or unreachable, it falls back to FALLBACK_WORKS so the site always
// shows. Adding a row to Supabase automatically hangs a new framed work on the
// wall — frameLayout() assigns each successive work a size/frame/offset slot.

export interface Work {
  id: number | string
  title: string
  meta: string        // museum-label subtitle, e.g. "검진센터 브랜드 랜딩"
  year: string        // e.g. "2024"
  url: string         // full https URL — clicking the frame opens it
  image: string       // /works/{slug}.png (local) or remote URL
  tech?: string[]
  category?: string   // "website" (default) | "logo"
}

// Map a DB row (snake_case-ish, loose) into a Work.
export function toWork(row: Record<string, unknown>, i: number): Work {
  return {
    id: (row.id as number | string) ?? i,
    title: (row.title as string) ?? "Untitled",
    meta: (row.meta as string) ?? (row.description as string) ?? "",
    year: String(row.year ?? (row.created_at ? new Date(row.created_at as string).getFullYear() : "")),
    url: (row.url as string) ?? (row.link as string) ?? "#",
    image: (row.image as string) ?? "",
    tech: (row.tech as string[]) ?? [],
    category: (row.category as string) ?? "website",
  }
}

// ── Salon-wall layout presets ───────────────────────────────────────────────
// 16:10 landscape slots (matches the 1440×900 screenshots), alternating frame
// styles and hanging offsets so the wall reads as hand-hung, not a grid.
const FRAME_SLOTS = [
  { w: 360, h: 225, frame: "frame-walnut", offset: "" },
  { w: 300, h: 188, frame: "frame-thin",   offset: "offset-down" },
  { w: 340, h: 213, frame: "frame-walnut", offset: "offset-up" },
  { w: 300, h: 188, frame: "frame-thin",   offset: "" },
  { w: 360, h: 225, frame: "frame-walnut", offset: "offset-up" },
  { w: 320, h: 200, frame: "frame-thin",   offset: "offset-down" },
] as const

export interface FrameLayout {
  artW: number
  artH: number
  frameClass: string
  offsetClass: string
}

export function frameLayout(index: number): FrameLayout {
  const slot = FRAME_SLOTS[index % FRAME_SLOTS.length]
  return { artW: slot.w, artH: slot.h, frameClass: slot.frame, offsetClass: slot.offset }
}

// ── Fallback data: the 6 live sites ─────────────────────────────────────────
// Shown until the Supabase `portfolios` table is seeded. Edit freely.
export const FALLBACK_WORKS: Work[] = [
  {
    id: "designluka",
    title: "Design LUKA",
    meta: "인테리어 브랜드 사이트 · 문의 자동 분류",
    year: "2024",
    url: "https://designluka.co.kr",
    image: "/works/designluka.png",
    tech: ["Next.js", "Tailwind", "Admin"],
  },
  {
    id: "dcare",
    title: "디케어 건강검진센터",
    meta: "대구 프리미엄 검진센터 브랜드 랜딩",
    year: "2024",
    url: "https://dcarecenter.kr",
    image: "/works/dcare.png",
    tech: ["React", "Tailwind"],
  },
  {
    id: "mavs",
    title: "MAVS.KR",
    meta: "댈러스 매버릭스 팬 커뮤니티 · AI 콘텐츠",
    year: "2025",
    url: "https://mavs.kr",
    image: "/works/mavs.png",
    tech: ["Next.js", "Supabase", "AI"],
  },
  {
    id: "sdngazer",
    title: "이승선 — Curator",
    meta: "큐레이터·도슨트 포트폴리오",
    year: "2025",
    url: "https://sdngazer.art",
    image: "/works/sdngazer.png",
    tech: ["Next.js", "Supabase"],
  },
  {
    id: "mybdr",
    title: "MyBDR",
    meta: "농구 토너먼트 · 라이브 기록 플랫폼",
    year: "2025",
    url: "https://mybdr.kr",
    image: "/works/mybdr.png",
    tech: ["Next.js", "Supabase"],
  },
  {
    id: "hoopnote",
    title: "HoopNote",
    meta: "학원 운영 AI 비서 · SaaS 랜딩",
    year: "2025",
    url: "https://hoopnote.kr",
    image: "/works/hoopnote.png",
    tech: ["Next.js", "AI"],
  },
]

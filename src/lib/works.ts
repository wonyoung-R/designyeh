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
  note?: string       // artist's note — 1~2 sentence intent shown on the label
}

// Map a DB row (snake_case-ish, loose) into a Work.
// If the row has no `note` column yet (older schema), fall back to the
// hardcoded note matched by URL so live data still shows artist's notes.
export function toWork(row: Record<string, unknown>, i: number): Work {
  const url = (row.url as string) ?? (row.link as string) ?? "#"
  const rowNote = (row.note as string) ?? undefined
  const fallbackNote = FALLBACK_NOTE_BY_URL.get(normalizeUrl(url))
  return {
    id: (row.id as number | string) ?? i,
    title: (row.title as string) ?? "Untitled",
    meta: (row.meta as string) ?? (row.description as string) ?? "",
    year: String(row.year ?? (row.created_at ? new Date(row.created_at as string).getFullYear() : "")),
    url,
    image: (row.image as string) ?? "",
    tech: (row.tech as string[]) ?? [],
    category: (row.category as string) ?? "website",
    note: rowNote ?? fallbackNote,
  }
}

function normalizeUrl(u: string): string {
  return u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").toLowerCase()
}

// Built lazily below — populated after FALLBACK_WORKS is declared.
const FALLBACK_NOTE_BY_URL = new Map<string, string>()

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
    note: "공간을 파는 브랜드에는, 공간을 담은 웹이 필요했다.",
  },
  {
    id: "dcare",
    title: "디케어 건강검진센터",
    meta: "대구 프리미엄 검진센터 브랜드 랜딩",
    year: "2024",
    url: "https://dcarecenter.kr",
    image: "/works/dcare.png",
    tech: ["React", "Tailwind"],
    note: "병원이 아닌 인상이 먼저였다. 환자가 아니라 손님으로 맞이하는 첫 화면.",
  },
  {
    id: "mavs",
    title: "MAVS.KR",
    meta: "댈러스 매버릭스 팬 커뮤니티 · AI 콘텐츠",
    year: "2025",
    url: "https://mavs.kr",
    image: "/works/mavs.png",
    tech: ["Next.js", "Supabase", "AI"],
    note: "팬덤은 24시간 깨어 있다. AI가 밤새 쓰고, 사람은 아침에 같이 읽는다.",
  },
  {
    id: "sdngazer",
    title: "이승선 — Curator",
    meta: "큐레이터·도슨트 포트폴리오",
    year: "2025",
    url: "https://sdngazer.art",
    image: "/works/sdngazer.png",
    tech: ["Next.js", "Supabase"],
    note: "큐레이터의 사이트는 작품을 가리키는 손이다. 손이 너무 크면 작품이 가려진다.",
  },
  {
    id: "mybdr",
    title: "MyBDR",
    meta: "농구 토너먼트 · 라이브 기록 플랫폼",
    year: "2025",
    url: "https://mybdr.kr",
    image: "/works/mybdr.png",
    tech: ["Next.js", "Supabase"],
    note: "코트 위의 1초가 데이터로 바뀌는 곳. 기록원이 한 손으로, 한 박자에 누를 수 있어야 했다.",
  },
  {
    id: "hoopnote",
    title: "HoopNote",
    meta: "학원 운영 AI 비서 · SaaS 랜딩",
    year: "2025",
    url: "https://hoopnote.kr",
    image: "/works/hoopnote.png",
    tech: ["Next.js", "AI"],
    note: "원장님의 '응' 한 마디가 학원을 움직인다. AI는 보이지 않고, 결과만 남는다.",
  },
]

// Populate URL→note map so toWork() can supply notes for DB rows that don't
// have a `note` column yet (live Supabase schema is one version behind).
for (const w of FALLBACK_WORKS) {
  if (w.note) FALLBACK_NOTE_BY_URL.set(normalizeUrl(w.url), w.note)
}

// Curated local portfolio content. No network access is needed to render works.
export interface Work {
  id: number | string
  title: string
  meta: string
  year: string
  url: string
  image: string
  tech?: string[]
  category?: string
  note?: string
  solution?: string
  scope?: string[]
  ownership?: string
}

function text(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value !== value.trim() || !/^https:\/\//i.test(value)) return undefined
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return undefined
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) return undefined
    return parsed.href
  } catch {
    return undefined
  }
}

function localImage(value: unknown): string | undefined {
  return typeof value === "string" && /^\/works\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.png$/.test(value) ? value : undefined
}

function normalizeUrl(value: string): string {
  const parsed = new URL(value)
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase()
  return `${host}${parsed.port ? `:${parsed.port}` : ""}${parsed.pathname.replace(/\/$/, "")}${parsed.search}`
}

function safeIndex(index: number): number {
  return Number.isSafeInteger(index) && index >= 0 ? index : 0
}

function workYear(year: unknown, createdAt: unknown): string {
  if (typeof year === "string") return year
  if (typeof year === "number" && Number.isFinite(year)) return String(year)
  if (typeof createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(createdAt)) return ""
  const date = new Date(createdAt)
  return Number.isFinite(date.getTime()) ? String(date.getUTCFullYear()) : ""
}

// Defensive adapter for imported records. Invalid links stay empty; they never
// become a link to an unrelated project. Images always stay on the local site.
export function toWork(value: unknown, i: number): Work {
  const row: Record<string, unknown> = value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const index = safeIndex(i)
  const url = httpsUrl(row.url) ?? httpsUrl(row.link) ?? ""
  const matching = url ? FALLBACK_WORKS.find(work => normalizeUrl(work.url) === normalizeUrl(url)) : undefined
  const fallback = matching ?? FALLBACK_WORKS[index % FALLBACK_WORKS.length]
  const id = typeof row.id === "string" || (typeof row.id === "number" && Number.isFinite(row.id)) ? row.id : index
  return {
    id,
    title: text(row.title) ?? "Untitled",
    meta: text(row.meta) ?? text(row.description) ?? "",
    year: workYear(row.year, row.created_at),
    url,
    image: localImage(row.image) ?? fallback.image,
    tech: Array.isArray(row.tech) ? row.tech.filter((item): item is string => typeof item === "string") : [],
    category: text(row.category) ?? "website",
    note: text(row.note) ?? matching?.note,
    solution: text(row.solution) ?? matching?.solution,
    scope: Array.isArray(row.scope) ? row.scope.filter((item): item is string => typeof item === "string") : matching?.scope?.slice(),
    ownership: text(row.ownership) ?? matching?.ownership,
  }
}

export interface FrameLayout {
  artW: number
  artH: number
  frameClass: string
  offsetClass: string
}

// Uniform 16:10 geometry retained for compatibility with existing imports.
export function frameLayout(index: number): FrameLayout {
  void index
  return { artW: 640, artH: 400, frameClass: "work-surface", offsetClass: "" }
}

export const FALLBACK_WORKS: Work[] = [
  {
    id: "designluka",
    title: "Design LUKA",
    meta: "인테리어 회사 홈페이지 · DB 연동 및 관리",
    year: "2024",
    url: "https://designluka.co.kr",
    image: "/works/designluka.png",
    tech: ["Next.js", "Tailwind", "Admin"],
    note: "인테리어 회사의 홈페이지에, 운영을 위한 관리 기능이 필요했습니다.",
    solution: "사이트에 DB를 연결하고 관리자 페이지를 함께 구축했습니다.",
    scope: ["DB 연결", "관리자 페이지"],
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
    ownership: "자체 운영 프로젝트",
  },
  {
    id: "sdngazer",
    title: "이승선 — Curator",
    meta: "큐레이터·도슨트 포트폴리오",
    year: "2025",
    url: "https://sdngazer.art",
    image: "/works/sdngazer.png",
    tech: ["Next.js", "Supabase"],
    note: "도슨트의 활동을 이미지로 보여주고, 새 기록도 편하게 더할 수 있어야 했습니다.",
    solution: "이미지 중심의 개인 포트폴리오에 기록을 추가하고 관리하는 관리자 페이지를 연결했습니다.",
    scope: ["이미지 중심 포트폴리오", "기록 관리", "관리자 페이지"],
  },
  {
    id: "laf2023",
    title: "LOST and FOUND",
    meta: "의류 판매 페이지 · 인플루언서 협업 채널",
    year: "2025",
    url: "https://laf2023.com",
    image: "/works/laf2023.png",
    tech: ["Next.js", "Tailwind"],
    note: "개인 의류 판매를 위한 페이지와 인플루언서가 함께 작업할 채널이 필요했습니다.",
    solution: "의류 판매 사이트의 페이지를 제작하고, 인플루언서 협업 채널을 구축했습니다.",
    scope: ["의류 판매 페이지", "인플루언서 협업 채널"],
  },
  {
    id: "gritlab",
    title: "GRIT LAB",
    meta: "농구 체육관 홈페이지 · 대회 운영 시스템",
    year: "2025",
    url: "https://grit-lab.kr",
    image: "/works/gritlab.png",
    tech: ["Next.js"],
    note: "작은 체육관에서 홈페이지와 대회 운영, 전광판을 따로 관리하기에는 부담이 컸습니다.",
    solution: "랜딩 페이지와 3:3 대회 운영, 스코어보드·전광판을 하나의 DB와 하나의 사이트로 연결했습니다.",
    scope: ["랜딩 페이지", "3:3 대회 운영", "스코어보드·전광판", "DB 연결"],
  },
  {
    id: "hoopnote",
    title: "HoopNote",
    meta: "농구학원 운영 보조 서비스",
    year: "2026",
    url: "https://hoopnote.kr",
    image: "/works/hoopnote.png",
    tech: ["Next.js", "AI"],
    note: "유소년 농구학원 원장과 코치는 수업 외에도 행정 업무와 학부모 소통을 챙겨야 합니다.",
    solution: "농구학원 운영 보조 서비스를 직접 기획·제작하고, 코칭 외 업무를 돕기 위해 AI를 도입했습니다.",
    scope: ["농구학원 운영 보조 서비스", "AI 도입"],
    ownership: "자체 프로젝트",
  },
]

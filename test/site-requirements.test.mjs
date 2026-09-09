import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const home = read("src/app/page.tsx")
const contact = read("src/app/contact/page.tsx")
const layout = read("src/app/layout.tsx")
const supabase = read("src/lib/supabase.ts")
const works = read("src/lib/works.ts")
const gallery = read("src/app/gallery.css")

const navItems = ["Services", "Approach", "Works", "Process", "FAQ", "Contact"]
const sectionIds = ["services", "approach", "works", "process", "faq", "contact"]

test("home provides the complete conversion path", () => {
  for (const label of navItems) assert.match(home, new RegExp(`[\"'>]${label}[\"'<]`))
  for (const id of sectionIds) {
    assert.match(home, id === "contact" ? /href="\/contact"/ : new RegExp(`#${id}`))
    assert.match(home, new RegExp(`id=["']${id}["']`))
  }
  assert.match(home, /Every homepage is a work of art\./)
  assert.match(home, /웹사이트 제작부터 브랜드 아이덴티티, 문의 이후 운영 자동화까지 한 흐름으로 설계합니다\./)
  assert.match(home, /프로젝트 상담하기/)
  assert.match(home, /제작 사례 보기/)
  assert.match(home, /human approval|사람의 승인/)
  assert.match(home, /fallback|대체 절차/)
})

test("home contains three services, four approaches, six process steps and six FAQs", () => {
  assert.equal((home.match(/className="service-card"/g) ?? []).length, 3)
  assert.equal((home.match(/className="approach-card"/g) ?? []).length, 4)
  assert.equal((home.match(/className="process-item"/g) ?? []).length, 6)
  assert.equal((home.match(/<details className="faq-item"/g) ?? []).length, 6)
})

test("contact qualifies all three services and required preparation", () => {
  for (const phrase of ["웹사이트", "아이덴티티", "운영 자동화", "현재 상황", "목표", "필요한 기능", "일정", "예산", "의사결정자"]) {
    assert.match(contact, new RegExp(phrase))
  }
  assert.match(contact, /mailto:/)
  assert.match(contact, /open\.kakao\.com/)
  assert.doesNotMatch(contact, /보통 하루 안에 회신/)
})

test("global JSON-LD describes the agency without page-specific duplication", () => {
  assert.match(layout, /ProfessionalService/)
  assert.doesNotMatch(layout, /FAQPage/)
  assert.match(layout, /Organization/)
  assert.match(layout, /WebSite/)
  assert.match(layout, /Service/)
  assert.match(layout, /웹사이트/)
  assert.match(layout, /운영 자동화/)
})

test("Supabase is optional and seven fallback works remain", () => {
  assert.match(supabase, /NEXT_PUBLIC_SUPABASE_URL/)
  assert.match(supabase, /null/)
  assert.equal((works.match(/^\s+id: "/gm) ?? []).length, 7)
})

test("unsupported public promises are absent", () => {
  const all = `${home}\n${contact}\n${layout}`
  for (const phrase of ["보통 하루 안에 회신", "무제한 수정", "검색 순위 보장", "성과 보장"]) {
    assert.doesNotMatch(all, new RegExp(phrase))
  }
})


test("agency pages let the browser wrap copy without forced breaks", () => {
  for (const page of [home, contact]) assert.doesNotMatch(page, /<br\b[^>]*>/i)
})

test("Korean copy keeps words intact while addresses and CTA labels wrap safely", () => {
  assert.match(gallery, /body\.gallery\s*\{[^}]*word-break:\s*keep-all\s*;/)
  assert.doesNotMatch(gallery, /word-break:\s*break-all/)
  assert.match(gallery, /\.contact-email\s*\{[^}]*overflow-wrap:\s*anywhere\s*;/)
  assert.match(gallery, /\.lbl-url,\s*\.end-label a\[href\^="mailto:"\]\s*\{[^}]*overflow-wrap:\s*anywhere\s*;/)
  assert.match(gallery, /\.cta,\s*\.contact-submit,\s*\.contact-kakao,\s*\.contact-home\s*\{[^}]*white-space:\s*nowrap\s*;/)
})

const slugs = ["homepage-production", "brand-identity", "operations-automation"]
const serviceData = read("src/lib/services.ts")
const servicePage = read("src/components/service-page.tsx")
const urls = ["https://dsgnyeh.art/", ...slugs.map(slug => `https://dsgnyeh.art/${slug}/`), "https://dsgnyeh.art/contact/", "https://dsgnyeh.art/pricing/"]

test("three static service routes share metadata and visible schema content", () => {
  slugs.forEach((slug, index) => {
    const page = read(`src/app/${slug}/page.tsx`)
    assert.match(page, /export const metadata = serviceMetadata\(service\)/)
    assert.ok(page.includes(`services[${index}]`))
    assert.ok(serviceData.includes(`slug: "${slug}"`))
    assert.ok(home.includes(`href="/${slug}/"`))
    assert.ok(contact.includes(`href="/${slug}/"`))
  })
  for (const type of ["Service", "WebPage", "BreadcrumbList", "FAQPage"]) assert.ok(servicePage.includes(`"@type": "${type}"`))
  assert.equal((servicePage.match(/<h1\b/g) ?? []).length, 1)
  assert.match(serviceData, /alternates: \{ canonical: url \}/)
  assert.match(serviceData, /openGraph:/)
  assert.match(serviceData, /twitter:/)
  assert.match(servicePage, /service\.faq\.map/)
  assert.match(servicePage, /acceptedAnswer/)
  for (const phrase of ["홈페이지 제작", "기업 홈페이지 제작", "반응형 홈페이지 제작", "개인정보", "사람의 승인", "fallback"]) assert.ok(serviceData.includes(phrase))
})

test("sitemap contains exactly six canonical real pages", () => {
  const sitemap = read("public/sitemap.xml")
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), urls)
  assert.doesNotMatch(sitemap, /\/about\/|\/portfolio\/|<lastmod>/)
})

test("public crawler policy and service guide are current", () => {
  const robots = read("public/robots.txt")
  assert.match(robots, /User-agent: \*\s+Allow: \//)
  assert.doesNotMatch(robots, /Disallow:\s*\S/)
  assert.match(robots, /Sitemap: https:\/\/dsgnyeh.art\/sitemap.xml/)
  for (const bot of ["Googlebot", "OAI-SearchBot", "GPTBot", "ClaudeBot", "PerplexityBot"]) assert.ok(robots.includes(bot))
  const llms = read("public/llms.txt")
  for (const url of urls) assert.ok(llms.includes(`(${url})`))
  for (const phrase of ["눈에 남는 브랜드, 손이 덜 가는 운영.", "홈페이지 제작", "브랜드 아이덴티티", "운영 자동화", "사람의 승인", "fallback"]) assert.ok(llms.includes(phrase))
  const workUrls = [...works.matchAll(/^\s+url: "(https:[^"]+)"/gm)].map(match => match[1])
  assert.equal(workUrls.length, 7)
  for (const url of workUrls) assert.ok(llms.includes(`(${url})`))
})

test("new content preserves the approved hook and has no forced breaks or invented guarantees", () => {
  assert.match(home, /눈에 남는 브랜드, <em>손이 덜 가는 운영\.<\/em>/)
  assert.match(layout, /default: "홈페이지 제작/)
  assert.doesNotMatch(layout, /첫인상에서 운영까지/)
  for (const directive of ["max-snippet", "max-image-preview", "max-video-preview"]) assert.ok(layout.includes(directive))
  const all = [home, contact, layout, serviceData, servicePage, read("public/llms.txt")].join("\n")
  assert.doesNotMatch(all, /<br\b[^>]*>/i)
  assert.doesNotMatch(all, /무제한 수정|검색\s*순위\s*보장|성과 보장|매출 보장|리드 보장|상위\s*노출\s*보장|1위 보장|aggregateRating|reviewRating|priceCurrency/)
})

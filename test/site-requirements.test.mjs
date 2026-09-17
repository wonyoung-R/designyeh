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
const navigation = read("src/components/site-nav.tsx")

const normalizeHtmlText = (html) => html
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<br\b[^>]*>/gi, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
  .replace(/\s+/g, " ")
  .trim()
const heroSection = home.match(/<section\b[^>]*className="room room-entry\b[^"]*"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? ""
const heroH1 = heroSection.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? ""
const homeWithoutHeroBreaks = heroH1
  ? home.replace(heroH1, heroH1.replace(/<br\s*\/>/g, " "))
  : home

const navItems = ["Services", "Approach", "Works", "Process", "FAQ", "Contact"]
const sectionIds = ["services", "approach", "works", "process", "faq", "contact"]

test("home provides the complete conversion path", () => {
  for (const label of navItems) assert.ok(navigation.includes(`"${label}"`))
  for (const id of sectionIds) {
    assert.ok(navigation.includes(id === "contact" ? '"/contact/"' : `"/#${id}"`))
    assert.match(home, new RegExp(`id=["']${id}["']`))
  }
  assert.equal(normalizeHtmlText(heroH1), "당신이 쌓아온 일에, 필요한 다음을 만듭니다.")
  assert.match(heroSection, /<HeroBackdrop\s*\/>/)
  const eyebrow = [...heroSection.matchAll(/<(p)\b([^>]*\bclassName="hero-eyebrow"[^>]*)>([^]*?)<\/\1>/g)]
    .find(([, , , content]) => normalizeHtmlText(content) === "designYEH · 디자인과 기술로 만드는 사업의 다음")
  assert.ok(eyebrow, "hero must contain the visible owner-approved eyebrow")
  assert.doesNotMatch(eyebrow[2], /\bhidden\b|aria-hidden\s*=\s*["']true["']|display\s*:\s*["']?none|visibility\s*:\s*["']?hidden/)
  const orderedSections = ["works", "services", "process", "faq", "contact"].map(id => home.search(new RegExp(`<section\\b[^>]*\\bid=["']${id}["']`)))
  assert.ok(orderedSections.every((position, index) => position >= 0 && (index === 0 || position > orderedSections[index - 1])), "section order must be works < services < process < faq < contact")
  assert.match(normalizeHtmlText(heroSection), /사업을 보여주는 모습부터, 매일 일하는 방식까지\. 디자인과 기술로 지금 필요한 것을 함께 만듭니다\./)
  assert.match(heroSection, /우리 사업 이야기 나누기/)
  assert.match(heroSection, /만든 것들 살펴보기/)
  assert.match(home, /홈페이지 제작 문의하기/)
  assert.match(home, /제작 사례 보기/)
  assert.match(home, /human approval|사람의 승인/)
  assert.match(home, /fallback|대체 절차/)
})

test("home contains three production stages, an approach anchor, six process steps and eight FAQs", () => {
  assert.equal((home.match(/className="service-card"/g) ?? []).length, 3)
  const approach = home.match(/<(section|div)\b[^>]*\bid="approach"[^>]*>[^]*?<\/\1>/)?.[0] ?? ""
  assert.ok(approach, "approach anchor must exist")
  assert.match(approach, /<h2\b[^>]*>[^]*?<\/h2>/)
  assert.doesNotMatch(home, /className="[^"]*\bapproach-card\b[^"]*"/)
  assert.equal((home.match(/className="process-item"/g) ?? []).length, 6)
  assert.equal((home.match(/<details className="faq-item"/g) ?? []).length, 8)
})

test("contact qualifies homepage production and required preparation", () => {
  for (const phrase of ["홈페이지 제작", "현재 상황", "목표", "필요한 기능", "일정", "예산", "의사결정자"]) {
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
  assert.match(layout, /소규모 사업자를 위한 홈페이지 제작/)
  assert.doesNotMatch(layout, /아이덴티티|운영 자동화/)
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

test("agency pages allow intentional breaks only inside the homepage hero h1", () => {
  for (const page of [homeWithoutHeroBreaks, contact]) assert.doesNotMatch(page, /<br\b[^>]*>/i)
})

test("Korean copy keeps words intact while addresses and CTA labels wrap safely", () => {
  assert.match(gallery, /body\.gallery\s*\{[^}]*word-break:\s*keep-all\s*;/)
  assert.doesNotMatch(gallery, /word-break:\s*break-all/)
  assert.match(gallery, /\.contact-email\s*\{[^}]*overflow-wrap:\s*anywhere\s*;/)
  assert.match(gallery, /\.lbl-url,\s*\.end-label a\[href\^="mailto:"\]\s*\{[^}]*overflow-wrap:\s*anywhere\s*;/)
  assert.match(gallery, /\.cta,\s*\.contact-submit,\s*\.contact-kakao,\s*\.contact-home\s*\{[^}]*white-space:\s*normal\s*;/)
})

test("studio typography uses local Korean sans fallbacks and accessible emphasis", () => {
  assert.match(gallery, /--g-sans:\s*"Paperlogy",[^;]*"Apple SD Gothic Neo"[^;]*"Malgun Gothic"[^;]*system-ui,\s*sans-serif;/)
  assert.doesNotMatch(gallery, /--g-serif|Instrument Serif|Georgia|font-style:\s*italic|font:\s*italic/)
  for (const selector of ["\\.agency-title", "\\.section-intro h2, \\.final-plaque h2", "\\.contact-intro \\.contact-title, \\.contact-title"]) {
    assert.match(gallery, new RegExp(`${selector}[^\\{]*\\{[^}]*var\\(--g-sans\\)`))
  }
  assert.match(gallery, /\.gallery\s*:where\(h1,\s*h2\)\s*\{[^}]*word-break:\s*keep-all\s*;/)
  const worksSection = home.match(/<section\b[^>]*\bid=["']works["'][^>]*>[\s\S]*?<\/section>/)?.[0] ?? ""
  const worksHeading = worksSection.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? ""
  assert.match(normalizeHtmlText(worksHeading), /[\p{L}\p{N}]/u)
  assert.doesNotMatch(home, /만든 것에서\s*<em>판단의 결<\/em>을 보세요\./)
  assert.match(gallery, /\.works-intro h2\s*\{[^}]*text-wrap:\s*pretty\s*;/)
  const worksEmRule = gallery.match(/\.works-intro h2 em\s*\{[^}]*\}/)?.[0] ?? ""
  assert.match(worksEmRule, /font-family:\s*inherit\s*;/)
  assert.match(worksEmRule, /font-style:\s*normal\s*;/)
  assert.match(worksEmRule, /font-weight:\s*inherit\s*;/)
  assert.match(worksEmRule, /letter-spacing:\s*inherit\s*;/)
  assert.doesNotMatch(worksEmRule, /white-space:\s*nowrap\s*;/)
  assert.match(gallery, /\.gallery :where\(em, i\)\s*\{[^}]*font-style:\s*normal/)
  assert.match(gallery, /\.lbl-note\s*\{[^}]*font-family:\s*var\(--g-sans\)/)
  assert.match(gallery, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--blue\)/)
  assert.match(gallery, /prefers-reduced-motion:\s*reduce/)
  assert.doesNotMatch(homeWithoutHeroBreaks, /<br\b[^>]*>/i)
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
  for (const phrase of ["소규모 사업자를 위한 홈페이지 제작", "홈페이지 제작", "브랜드 아이덴티티", "운영 자동화", "사람의 승인", "fallback"]) assert.ok(llms.includes(phrase))
  const workUrls = [...works.matchAll(/^\s+url: "(https:[^"]+)"/gm)].map(match => match[1])
  assert.equal(workUrls.length, 7)
  for (const url of workUrls) assert.ok(llms.includes(`(${url})`))
})

test("new content preserves service positioning, limits breaks to the hero and has no invented guarantees", () => {
  const homeCopy = [...home
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .matchAll(/<(p|h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/g)]
    .filter(([, , attributes]) => !/\bhidden\b|aria-hidden\s*=\s*["']true["']/.test(attributes))
    .map(([, , , content]) => normalizeHtmlText(content))
    .join(" ")
  assert.match(homeCopy, /디자인과 기술로 지금 필요한 것을 함께 만듭니다\./)
  assert.match(homeCopy, /사업과 서비스를 소개하고 고객 문의를 받을 공식 홈페이지가 필요한 소규모 사업자에게 맞습니다\./)
  assert.match(layout, /default: "소규모 사업자를 위한 홈페이지 제작/)
  assert.doesNotMatch(layout, /첫인상에서 운영까지/)
  for (const directive of ["max-snippet", "max-image-preview", "max-video-preview"]) assert.ok(layout.includes(directive))
  const all = [home, contact, layout, serviceData, servicePage, read("public/llms.txt")].join("\n")
  const copyWithoutHeroBreaks = [homeWithoutHeroBreaks, contact, layout, serviceData, servicePage, read("public/llms.txt")].join("\n")
  assert.doesNotMatch(copyWithoutHeroBreaks, /<br\b[^>]*>/i)
  assert.doesNotMatch(all, /무제한 수정|검색\s*순위\s*보장|성과 보장|매출 보장|리드 보장|상위\s*노출\s*보장|1위 보장|aggregateRating|reviewRating|priceCurrency/)
})

// The approved positioning replaces equal promotion of three services with one website offer.
test("home promotes only homepage production outside the last optional FAQ", () => {
  const hero = heroSection
  const servicesStart = home.indexOf('<section id="services"')
  const cards = home.slice(servicesStart, home.indexOf('</section>', servicesStart) + '</section>'.length)
  assert.doesNotMatch(hero + cards, /AI|자동화|아이덴티티|brand-identity|operations-automation/)
  for (const title of ["기획·정보 정리", "디자인·제작", "검수·인계"]) assert.ok(cards.includes(`<h3>${title}</h3>`))
  const faqs = [...home.matchAll(/<details className="faq-item">([^]*?)<\/details>/g)].map(match => match[1])
  assert.doesNotMatch(faqs.slice(0, -1).join(""), /AI|자동화|아이덴티티/)
  assert.match(faqs.at(-1), /AI·업무 자동화/)
  assert.match(faqs.at(-1), /별도로 상담/)
  assert.doesNotMatch(home.replace(faqs.at(-1), ""), /AI|자동화|아이덴티티/)
  assert.doesNotMatch(home, /href="\/brand-identity\/"/)
  assert.equal((home.match(/홈페이지 제작 문의하기/g) ?? []).length, 1)
  assert.equal((heroSection.match(/우리 사업 이야기 나누기/g) ?? []).length, 1)
  assert.match(heroSection, /className="cta cta-primary" href="\/contact"/)
})

test("contact preserves encoded mailto, chat and privacy guidance without service selection", () => {
  assert.doesNotMatch(contact, /관심 서비스|아이덴티티|자동화|반복 업무/)
  assert.match(contact, /const EMAIL = "creativebyyeh@gmail.com"/)
  assert.match(contact, /const SUBJECT = "designYEH 홈페이지 제작 문의"/)
  assert.ok(contact.includes('`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`'))
  assert.equal((contact.match(/href=\{mailtoHref\}/g) ?? []).length, 2)
  assert.match(contact, /https:\/\/open.kakao.com\/me\/designyeh/)
  for (const text of ["데이터·개인정보, 승인 담당, 오류 시 대체 절차", "개인정보와 권한, 승인·인계·유지관리 기준"]) assert.ok(contact.includes(text))
  assert.match(contact, /href="\/homepage-production\/"/)
})

test("homepage detail and shared related navigation prioritize website production", () => {
  const homepageService = serviceData.slice(0, serviceData.indexOf('slug: "brand-identity"'))
  assert.match(homepageService, /title: "소규모 사업자를 위한 홈페이지 제작"/)
  assert.doesNotMatch(homepageService, /자동화|아이덴티티/)
  assert.match(servicePage, /홈페이지 제작 문의하기/)
  assert.ok(servicePage.includes('item.slug === "homepage-production" && item.slug !== service.slug'))
  assert.match(servicePage, /href="\/pricing\/"/)
  const description = layout.match(/const description = "([^"]+)"/)[1]
  // The approved message hero supersedes the former verbatim metadata copy.
  // Metadata and the dedicated homepage service retain the website offer.
  assert.ok(description.length > 0)
  assert.match(home, /사업과 서비스를 소개하고 고객 문의를 받을 공식 홈페이지가 필요한 소규모 사업자에게 맞습니다\./)
  assert.ok(homepageService.includes(description))
  assert.equal((layout.match(/소규모 사업자를 위한 홈페이지 제작 · designYEH/g) ?? []).length, 3)
  assert.match(layout, /name: "designYEH", url: "https:\/\/dsgnyeh.art\/", description/)
})

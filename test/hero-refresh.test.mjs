import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { runInNewContext } from "node:vm"
import test from "node:test"

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const home = read("src/app/page.tsx")
const css = read("src/app/gallery.css")
const ts = createRequire(import.meta.url)("typescript")
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
}).outputText
const workExports = {}
runInNewContext(compile(read("src/lib/works.ts")), { exports: workExports, URL }, { timeout: 1000 })
const result = {}
const React = {
  Fragment: "fragment",
  createElement(type, attributes, ...children) {
    if (typeof type === "function") return type({ ...attributes, children })
    return { type, attributes: attributes ?? {}, children }
  },
}
const carousel = {}
const navigation = {}
runInNewContext(compile(read("src/components/site-nav.tsx")), {
  exports: navigation, React,
  require(name) {
    if (name === "next/link") return { default: "a" }
    throw new Error(`Unexpected navigation import: ${name}`)
  },
}, { timeout: 1000 })
runInNewContext(compile(read("src/components/project-carousel.tsx")), {
  exports: carousel, React,
  require(name) {
    if (name === "@/lib/assets") return { asset: value => value }
    throw new Error(`Unexpected carousel import: ${name}`)
  },
}, { timeout: 1000 })
runInNewContext(compile(home), {
  exports: result, React,
  require(name) {
    if (name === "next/link") return { default: "a" }
    if (name === "@/lib/works") return workExports
    if (name === "@/components/project-carousel") return carousel
    if (name === "@/components/site-nav") return navigation
    if (name === "@/lib/assets") return { asset: value => value }
    if (name === "@/components/fab-wax") return { FabWax: () => null }
    throw new Error(`Unexpected import: ${name}`)
  },
}, { timeout: 1000 })
const tree = result.default()
function nodes(node, predicate) {
  if (!node || typeof node !== "object") return []
  const children = Array.isArray(node) ? node : node.children ?? []
  return [...(!Array.isArray(node) && predicate(node) ? [node] : []), ...children.flatMap(child => nodes(child, predicate))]
}
function text(node) {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node !== "object") return String(node)
  return (Array.isArray(node) ? node : node.children ?? []).map(text).join("")
}
const normalized = node => text(node).replace(/\s+/g, " ").trim()
const byClass = (node, name) => nodes(node, item => (item.attributes.className ?? "").split(/\s+/).includes(name))
const hero = byClass(tree, "agency-hero")[0]

test("shared menus follow homepage order and keep Pricing last on every page", () => {
  const expected = [
    ["Works", "/#works"], ["Services", "/#services"], ["Approach", "/#approach"],
    ["Process", "/#process"], ["FAQ", "/#faq"], ["Contact", "/contact/"], ["Pricing", "/pricing/"],
  ]
  const sections = nodes(tree, node => node.type === "section").map(node => node.attributes.id)
  const positions = expected.slice(0, 6).map(([, href]) => sections.indexOf(href === "/contact/" ? "contact" : href.split("#")[1]))
  assert.ok(positions.every((position, i) => position >= 0 && (i === 0 || position > positions[i - 1])))
  for (const currentPage of [undefined, "/contact/", "/pricing/"]) {
    const nav = navigation.SiteNav({ currentPage })
    const menus = nodes(nav, node => node.type === "nav")
    assert.equal(menus.length, 2)
    for (const menu of menus) {
      const links = nodes(menu, node => node.type === "a")
      assert.deepEqual(links.map(link => [normalized(link), link.attributes.href]), expected)
      assert.deepEqual(links.filter(link => link.attributes["aria-current"] === "page").map(link => link.attributes.href), currentPage ? [currentPage] : [])
    }
  }
})

test("approved hero renders exact copy and two semantic headline blocks without scripts", () => {
  assert.ok(hero)
  assert.equal(nodes(tree, node => node.type === "h1").length, 1)
  assert.equal(normalized(byClass(hero, "hero-eyebrow")[0]), "designYEH · 디자인과 기술로 만드는 사업의 다음")
  const headline = nodes(hero, node => node.type === "h1")[0]
  assert.equal(headline.attributes.id, "hero-title")
  assert.equal(hero.attributes["aria-labelledby"], "hero-title")
  assert.equal(normalized(headline), "당신이 쌓아온 일에, 필요한 다음을 만듭니다.")
  const clauses = nodes(headline, node => node.type === "span" || node.type === "strong")
  assert.deepEqual(clauses.map(node => [node.type, normalized(node)]), [
    ["span", "당신이 쌓아온 일에,"], ["strong", "필요한 다음을 만듭니다."],
  ])
  const description = byClass(hero, "hero-proposition")[0]
  assert.deepEqual(nodes(description, node => node.type === "span").map(normalized), [
    "사업을 보여주는 모습부터, 매일 일하는 방식까지.",
    "디자인과 기술로 지금 필요한 것을 함께 만듭니다.",
  ])
  assert.equal(nodes(hero, node => ["img", "picture", "br"].includes(node.type)).length, 0)
  assert.equal(byClass(hero, "room-tag").length, 0)
  assert.equal(byClass(hero, "hero-creed").length, 0)
  assert.doesNotMatch(home, /use client|useEffect|useState|IntersectionObserver|dangerouslySetInnerHTML/)
  for (const [className, label, href] of [
    ["cta-primary", "우리 사업 이야기 나누기 ↗", "/contact"],
    ["cta-secondary", "만든 것들 살펴보기 ↓", "#works"],
  ]) {
    const links = byClass(hero, className)
    assert.equal(links.length, 1)
    assert.equal(links[0].type, "a")
    assert.equal(links[0].attributes.href, href)
    assert.equal(normalized(links[0]), label)
    assert.equal(links[0].attributes.target, undefined)
  }
})

test("project logos link to five sites with one accessible set before all seven cases", () => {
  const strip = byClass(tree, "project-strip")[0]
  assert.ok(strip)
  assert.equal(normalized(nodes(strip, node => node.type === "h2")[0]), "프로젝트명")
  const scroll = byClass(strip, "project-strip-scroll")[0]
  assert.equal(scroll.attributes.tabIndex, 0)
  assert.equal(scroll.attributes.role, "region")
  assert.equal(scroll.attributes["aria-labelledby"], "project-strip-title")
  const sets = byClass(strip, "project-logo-list")
  assert.equal(sets.length, 2)
  assert.equal(sets[0].attributes["aria-hidden"], undefined)
  assert.equal(sets[1].attributes["aria-hidden"], true)
  const expected = ["designluka", "dcare", "gritlab", "mavs", "hoopnote"]
  for (const [copy, set] of sets.entries()) {
    const links = nodes(set, node => node.type === "a")
    assert.equal(links.length, expected.length)
    for (const [index, id] of expected.entries()) {
      const work = workExports.FALLBACK_WORKS.find(item => item.id === id)
      assert.equal(links[index].attributes.href, work.url)
      assert.equal(links[index].attributes["aria-label"], `${work.title} 사이트 방문 (새 창)`)
      assert.equal(links[index].attributes.tabIndex, copy === 1 ? -1 : undefined)
      const logo = nodes(links[index], node => node.type === "img")[0]
      assert.ok(logo.attributes.src.startsWith("/logos/"))
      assert.ok(readFileSync(new URL(`../public${logo.attributes.src}`, import.meta.url)).length > 0)
    }
  }
  assert.equal(nodes(strip, node => node.type === "button").length, 0)
  assert.doesNotMatch(normalized(tree), /자체(?: 운영)? 프로젝트/)
  assert.doesNotMatch(normalized(strip), /파트너|파트너십|추천|보증|신뢰|trusted|partner|endorse/i)
  const sections = nodes(tree, node => node.type === "section")
  const works = sections.find(node => node.attributes.id === "works")
  assert.ok(sections.indexOf(hero) < sections.indexOf(strip))
  assert.ok(sections.indexOf(strip) < sections.indexOf(works))
  const cards = byClass(works, "work-card")
  assert.equal(cards.length, 7)
  for (const [index, work] of workExports.FALLBACK_WORKS.entries()) {
    assert.equal(cards[index].attributes.id, `work-${work.id}`)
    for (const value of [work.title, work.meta, work.note, work.solution, work.ownership, ...(work.scope ?? [])].filter(Boolean)) {
      assert.ok(normalized(cards[index]).includes(value), `${work.id}: preserved ${value}`)
    }
    const links = nodes(cards[index], node => node.type === "a")
    for (const link of links) {
      assert.equal(link.attributes.href, work.url)
      assert.equal(link.attributes.target, "_blank")
      assert.equal(link.attributes.rel, "noopener noreferrer")
    }
  }
})

test("hero reserves a viewport and project strip keeps a visible keyboard focus", () => {
  assert.match(css, /\.agency-hero\s*\{[^}]*min-height:\s*calc\(100svh - 80px\)/)
  assert.match(css, /@media \(max-width: 700px\)[^]*?\.agency-hero\s*\{[^}]*min-height:\s*calc\(100svh - 68px\);[^}]*padding-block:\s*72px/)
  assert.match(css, /\.hero-grid\s*\{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/)
  assert.match(css, /\.hero-proposition > span\s*\{\s*display:\s*block;/)
  assert.match(css, /\.project-strip-scroll:focus-visible\s*\{[^}]*outline:/)
})

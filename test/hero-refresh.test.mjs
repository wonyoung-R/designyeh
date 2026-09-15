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
runInNewContext(compile(home), {
  exports: result, React,
  require(name) {
    if (name === "next/link") return { default: "a" }
    if (name === "@/lib/works") return workExports
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

test("curated text projects distinguish client and own work before all seven full cases", () => {
  const strip = byClass(tree, "project-strip")[0]
  assert.ok(strip)
  assert.equal(normalized(nodes(strip, node => node.type === "h2")[0]), "프로젝트명 (텍스트)")
  const scroll = byClass(strip, "project-strip-scroll")[0]
  assert.equal(scroll.attributes.tabIndex, 0)
  assert.equal(scroll.attributes.role, "region")
  assert.equal(scroll.attributes["aria-labelledby"], "project-strip-title")
  const expected = {
    client: ["고객 작업", ["Design LUKA", "디케어 건강검진센터", "GRIT LAB"]],
    own: ["자체 프로젝트", ["MAVS.KR", "HoopNote"]],
  }
  for (const [group, [heading, names]] of Object.entries(expected)) {
    const element = nodes(strip, node => node.attributes["data-project-group"] === group)[0]
    assert.ok(element)
    const title = nodes(element, node => node.type === "h3")[0]
    assert.equal(normalized(title), heading)
    assert.equal(element.attributes["aria-labelledby"], title.attributes.id)
    assert.deepEqual(nodes(element, node => node.type === "li").map(normalized), names)
    for (const name of names) {
      const work = workExports.FALLBACK_WORKS.find(item => item.title === name)
      assert.ok(work, `${name}: existing case`)
      assert.equal(Boolean(work.ownership?.includes("자체")), group === "own")
    }
  }
  assert.equal(nodes(strip, node => ["img", "svg", "a"].includes(node.type)).length, 0)
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

test("hero reserves a viewport and the project strip uses native static scrolling", () => {
  assert.match(css, /\.agency-hero\s*\{[^}]*min-height:\s*calc\(100svh - 80px\)/)
  assert.match(css, /@media \(max-width: 700px\)[^]*?\.agency-hero\s*\{[^}]*min-height:\s*calc\(100svh - 68px\);[^}]*padding-block:\s*72px/)
  assert.match(css, /\.hero-grid\s*\{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/)
  assert.match(css, /\.hero-proposition > span\s*\{\s*display:\s*block;/)
  assert.match(css, /\.project-strip-scroll\s*\{[^}]*overflow-x:\s*auto;[^}]*animation:\s*none;[^}]*transition:\s*none;/)
  assert.match(css, /\.project-strip-scroll:focus-visible\s*\{[^}]*outline:/)
  assert.doesNotMatch(css, /@keyframes/)
})

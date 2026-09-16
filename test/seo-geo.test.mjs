import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const services = read("src/lib/services.ts")
const works = read("src/lib/works.ts")

function work(id) {
  const block = works.match(new RegExp(`\\{\\s*id: "${id}",[\\s\\S]*?\\n  \\}`))
  assert.ok(block, `Missing curated work: ${id}`)
  return block[0]
}

function stringField(source, key) {
  const match = source.match(new RegExp(`\\b${key}:\\s*("(?:[^"\\\\]|\\\\.)*")`))
  assert.ok(match, `Missing string field: ${key}`)
  return JSON.parse(match[1])
}

test("automation context describes the confirmed related work without claiming inquiry classification", () => {
  const automation = services.slice(services.indexOf('slug: "operations-automation"'))
  assert.match(automation, /works: \["designluka", "hoopnote", "mavs"\]/)
  const context = stringField(automation, "worksContext")
  assert.equal(context, "Design LUKA의 DB 연결·관리자 페이지, HoopNote의 농구학원 운영 보조 서비스·AI 도입, MAVS.KR의 AI 콘텐츠 관련 기존 공개 웹 작업입니다. 각 사이트의 소개를 모든 내부 자동화 구축이나 운영 성과의 증거로 해석하지 않습니다.")
  assert.doesNotMatch(context, /문의 자동 분류/)

  assert.equal(stringField(work("designluka"), "meta"), "인테리어 회사 홈페이지 · DB 연동 및 관리")
  assert.equal(stringField(work("designluka"), "solution"), "사이트에 DB를 연결하고 관리자 페이지를 함께 구축했습니다.")
  assert.match(work("designluka"), /scope: \["DB 연결", "관리자 페이지"\]/)
  assert.equal(stringField(work("hoopnote"), "meta"), "농구학원 운영 보조 서비스")
  assert.match(work("hoopnote"), /scope: \["농구학원 운영 보조 서비스", "AI 도입"\]/)
  assert.doesNotMatch(work("hoopnote"), /ownership:/)
  assert.equal(stringField(work("mavs"), "meta"), "댈러스 매버릭스 팬 커뮤니티 · AI 콘텐츠")
  assert.doesNotMatch(work("mavs"), /ownership:/)
})

test("every service portfolio reference resolves to a curated work", () => {
  const references = [...services.matchAll(/\bworks:\s*(\[[^\]]*\])/g)]
  assert.equal(references.length, 3)
  for (const [, list] of references) {
    for (const id of JSON.parse(list)) work(id)
  }
})

test("legacy redirect layouts explicitly disable indexing and allow following links", () => {
  for (const route of ["about", "portfolio"]) {
    const layout = read(`src/app/${route}/layout.tsx`)
    assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*,?\s*\}/)
  }
})

test("robots allows crawling and sitemap lists the supplied public routes", () => {
  const origin = stringField(services.replace('ORIGIN =', 'ORIGIN:'), "ORIGIN")
  assert.equal(origin, "https://dsgnyeh.art")
  const directives = read("public/robots.txt").split(/\r?\n/)
    .map(line => line.replace(/#.*/, "").trim()).filter(Boolean)
  assert.deepEqual(directives, ["User-agent: *", "Allow: /", `Sitemap: ${origin}/sitemap.xml`])

  const sitemap = read("public/sitemap.xml")
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/)
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
  const slugs = [...services.matchAll(/\bslug: "([^"]+)"/g)].map(([, slug]) => slug)
  assert.deepEqual(urls, [`${origin}/`, ...slugs.map(slug => `${origin}/${slug}/`), `${origin}/contact/`, `${origin}/pricing/`])
  for (const route of ["about", "portfolio"]) {
    assert.ok(!urls.includes(`${origin}/${route}/`))
  }
})

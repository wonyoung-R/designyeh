import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { createRequire } from "node:module"
import { runInNewContext } from "node:vm"
import test from "node:test"

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const home = read("src/app/page.tsx")
const css = read("src/app/gallery.css")
const fontCss = read("public/fonts/paperlogy/paperlogy.css")
const pricingCss = read("src/app/pricing/pricing.css")
const layout = read("src/app/layout.tsx")
const contact = read("src/app/contact/page.tsx")
const service = read("src/components/service-page.tsx")
const animate = read("src/components/animate-in-view.tsx")
const fab = read("src/components/fab-wax.tsx")
const navigation = read("src/components/site-nav.tsx")

// Use the project's existing TypeScript compiler in memory; no generated files,
// network, framework runtime, additional packages or credentials are needed.
const require = createRequire(import.meta.url)
const ts = require("typescript")
const compiled = ts.transpileModule(read("src/lib/works.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const exports = {}
runInNewContext(compiled, { exports, URL }, { timeout: 1000 })
const { toWork, FALLBACK_WORKS, frameLayout } = exports

function localImage(image) {
  assert.match(image, /^\/works\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.png$/)
}

test("home is local and server rendered, with work before services", () => {
  assert.doesNotMatch(home, /use client|useEffect|useState|useRef|supabase|\bfetch\s*\(|IntersectionObserver|toWork/)
  assert.match(home, /const works = FALLBACK_WORKS/)
  assert.ok(home.indexOf('id="works"') >= 0 && home.indexOf('id="works"') < home.indexOf('id="services"'))
  const hero = home.slice(home.indexOf('<section className="room room-entry'), home.indexOf('<section id="works"'))
  assert.ok(hero, "hero must exist")
  assert.match(hero, /<HeroBackdrop\s*\/>/)
  assert.match(home, /<section\b[^>]*className="room room-entry\b[^"]*"[^>]*>[^]*?<\/section>\s*<section\b[^>]*className="project-strip"[^>]*>[^]*?<\/section>\s*<section\b[^>]*id="works"/)
  const headline = hero.match(/<h1\b[^>]*\bid="hero-title"[^>]*>([^]*?)<\/h1>/)?.[1] ?? ""
  assert.equal(headline.replace(/<[^>]*>/g, "").replace(/\s+/g, ""), "당신이쌓아온일에,필요한다음을만듭니다.")
  const worksSection = home.match(/<section\b[^>]*id="works"[^>]*>[^]*?<\/section>/)?.[0] ?? ""
  assert.match(worksSection, /works\.map\(\(work, index\) => <WorkCard/)
  const worksHeading = worksSection.match(/<h2\b[^>]*>([^]*?)<\/h2>/)?.[1] ?? ""
  assert.equal(worksHeading.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(), "홈페이지 제작 사례")
  assert.match(home, /className="work-image"[^]*?width=\{1440\} height=\{900\} loading="lazy"/)
})

test("hero clauses use semantic markup and scoped block typography", () => {
  const headline = home.match(/<h1\b[^>]*\bid="hero-title"[^>]*>([^]*?)<\/h1>/)?.[1] ?? ""
  assert.match(headline, /<span\b[^>]*\bclassName="agency-title-intro"[^>]*>\s*당신이 쌓아온 일에,\s*<\/span>/)
  assert.match(headline, /<strong\b[^>]*\bclassName="agency-title-key"[^>]*>\s*필요한 다음을 만듭니다\.\s*<\/strong>/)
  const styles = css.replace(/\/\*[^]*?\*\//g, "")
  for (const [selector, weight] of [[".agency-title .agency-title-intro", "500"], [".agency-title .agency-title-key", "700"]]) {
    const declarations = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(",").some(value => value.trim() === selector))
      .map(([, , body]) => body).join(";")
    assert.ok(declarations, `${selector} must have an exact scoped CSS rule`)
    const lastValue = property => [...declarations.matchAll(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`, "g"))].at(-1)?.[1].trim()
    assert.equal(lastValue("font-weight"), weight, `${selector} must explicitly set font-weight ${weight}`)
    assert.equal(lastValue("display"), "block", `${selector} must display as a block`)
  }
})

test("official local Paperlogy supplies four static whole-site faces and retains hero typography", () => {
  const styles = (fontCss + "\n" + css + "\n" + pricingCss).replace(/\/\*[^]*?\*\//g, "")
  assert.doesNotMatch(css + pricingCss, /@font-face/i)
  const values = (body, property) => [...body.matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "gi"))].map(match => match[1].trim())
  const faces = [...styles.matchAll(/@font-face\s*\{([^{}]*)\}/gi)]
  assert.equal(faces.length, 4, "exactly four local font faces are required")
  for (const [weight, filename] of [["400", "Paperlogy-4Regular.woff2"], ["500", "Paperlogy-5Medium.woff2"], ["600", "Paperlogy-6SemiBold.woff2"], ["700", "Paperlogy-7Bold.woff2"]]) {
    const matching = faces.filter(([, body]) => values(body, "font-weight").join() === weight)
    assert.equal(matching.length, 1, `exactly one static ${weight} face is required`)
    const body = matching[0][1]
    assert.deepEqual(values(body, "font-family"), ['"Paperlogy"'])
    assert.deepEqual(values(body, "font-style"), ["normal"])
    assert.deepEqual(values(body, "font-display"), ["swap"])
    const escaped = filename.replace(/\./g, "\\.")
    const sources = values(body, "src")
    assert.equal(sources.length, 1)
    assert.match(sources[0], new RegExp(`^url\\(\\s*(["']?)\\./${escaped}\\1\\s*\\)\\s+format\\(\\s*(["'])woff2\\2\\s*\\)$`))
    assert.doesNotMatch(body, /unicode-range/i)
    const font = readFileSync(new URL(`../public/fonts/paperlogy/${filename}`, import.meta.url))
    assert.equal(font.toString("ascii", 0, 4), "wOF2", `${filename}: WOFF2 signature`)
    assert.equal(font.readUInt32BE(8), font.length, `${filename}: declared file length`)
    const original = filename.replace(/\.woff2$/, ".ttf")
    assert.ok(existsSync(new URL(`../public/fonts/paperlogy/${original}`, import.meta.url)), `${original}: retain original`)
  }
  assert.ok(existsSync(new URL("../public/fonts/paperlogy/OFL.txt", import.meta.url)), "OFL.txt must exist")
  const rules = [...styles.replace(/@font-face\s*\{[^{}]*\}/gi, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  const titleBodies = rules.filter(([, selectors]) => selectors.split(",").some(selector => selector.trim() === ".agency-title")).map(([, , body]) => body).join(";")
  assert.ok(titleBodies, "an exact .agency-title rule is required")
  assert.equal(values(titleBodies, "font-family").at(-1), '"Paperlogy", var(--g-sans)')
  assert.equal(values(titleBodies, "font-synthesis").at(-1), "none")
  assert.equal(values(titleBodies, "letter-spacing").at(-1), "normal")
  assert.doesNotMatch(styles, /@import\b|url\(\s*["']?(?:https?:)?\/\//i)
  assert.doesNotMatch(layout, /fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|next\/font/)
})

test("whole-site Paperlogy has explicit body defaults and effective role weights", () => {
  const styles = (css + "\n" + pricingCss).replace(/\/\*[^]*?\*\//g, "")
  const rules = [...styles.replace(/@font-face\s*\{[^{}]*\}/gi, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  // Commas and whitespace inside functions or quoted strings are not separators.
  const splitTopLevel = (source, separator = /,/) => {
    const parts = []
    let start = 0, depth = 0, quote = ""
    for (let index = 0; index < source.length; index++) {
      const char = source[index]
      if (char === "\\") { index++; continue }
      if (quote) { if (char === quote) quote = ""; continue }
      if (char === '"' || char === "'") { quote = char; continue }
      if (char === "(" || char === "[") depth++
      else if (char === ")" || char === "]") depth--
      else if (depth === 0 && separator.test(char)) {
        parts.push(source.slice(start, index).trim())
        start = index + 1
      }
    }
    parts.push(source.slice(start).trim())
    return parts.filter(Boolean)
  }
  const normalize = selector => selector.trim().replace(/\s+/g, " ")
  const expandWhere = (selector, erase = false) => {
    const start = selector.indexOf(":where(")
    if (start < 0) return [normalize(selector)]
    let end = start + 7, depth = 1
    for (; end < selector.length && depth; end++) {
      if (selector[end] === "(") depth++
      if (selector[end] === ")") depth--
    }
    assert.equal(depth, 0, "balanced :where selector")
    const branches = erase ? [""] : splitTopLevel(selector.slice(start + 7, end - 1))
    return branches.flatMap(branch => expandWhere(selector.slice(0, start) + branch + selector.slice(end), erase))
  }
  const declarationsFor = selector => rules
    .filter(([, selectors]) => splitTopLevel(selectors).some(value => normalize(value) === selector))
    .map(([, , body]) => body).join(";")
  const lastValue = (body, property) => [...body.matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "gi"))].at(-1)?.[1].trim()
  const normalizeWeight = value => ({ normal: "400", bold: "700" })[value] ?? value
  const shorthandWeight = value => {
    if (/^(?:inherit|initial|unset|revert|revert-layer)$/.test(value)) return value
    const tokens = splitTopLevel(value, /\s/)
    const size = tokens.findIndex(token => /^(?:[\d.]+(?:px|rem|em|%|pt|pc|in|cm|mm|q|vh|vw|vmin|vmax)\b|(?:calc|clamp|min|max)\(|(?:xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger)(?:\/|$))/i.test(token))
    if (size < 0) return `unparsed font: ${value}`
    // Omitting the weight in a font shorthand resets it to normal.
    return normalizeWeight(tokens.slice(0, size).find(token => /^(?:\d+(?:\.\d+)?|bold|bolder|lighter)$/.test(token)) ?? "normal")
  }
  const weightDeclarations = body => splitTopLevel(body, /;/).flatMap(declaration => {
    const match = declaration.match(/^\s*(font-weight|font)\s*:\s*([^]*)$/i)
    if (!match) return []
    const important = /!important\s*$/i.test(match[2])
    const value = match[2].replace(/\s*!important\s*$/i, "").trim()
    return [{ important: Number(important), value: match[1].toLowerCase() === "font" ? shorthandWeight(value) : normalizeWeight(value) }]
  })
  // Preserve :where's zero specificity while matching its individual branches.
  const specificity = selector => {
    const plain = expandWhere(selector, true)[0]
    return [
      (plain.match(/#[\w-]+/g) ?? []).length,
      (plain.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+/g) ?? []).length,
      (plain.match(/(?:^|[\s>+~])(?:[a-z][\w-]*)/gi) ?? []).length,
    ]
  }
  const compare = (left, right) => {
    for (let index = 0; index < left.length; index++) {
      if (left[index] !== right[index]) return left[index] - right[index]
    }
    return 0
  }
  const weightRules = rules.flatMap(([, selectors, body]) => splitTopLevel(selectors).map(selector => ({
    selectors: expandWhere(selector), specificity: specificity(selector), declarations: weightDeclarations(body),
  })))
  // These are source-level role probes, not a general DOM selector engine.
  // Include global element defaults and the exact applicable component rules.
  const effectiveWeight = (selectors, inherited = "400") => {
    const accepted = new Set(selectors.map(normalize))
    let winner
    for (const rule of weightRules) {
      if (!rule.selectors.some(selector => accepted.has(selector))) continue
      for (const declaration of rule.declarations) {
        const rank = [declaration.important, ...rule.specificity]
        if (!winner || compare(rank, winner.rank) >= 0) winner = { ...declaration, rank }
      }
    }
    if (!winner || /^(?:inherit|unset)$/.test(winner.value)) return inherited
    return winner.value === "initial" ? "400" : winner.value
  }
  const globalsFor = tag => [tag, `.gallery ${tag}`, `body.gallery ${tag}`]
  const assertRole = (selector, weight, tag, inherited = "400", aliases = []) => {
    assert.equal(effectiveWeight([...(tag ? globalsFor(tag) : []), selector, ...aliases], inherited), weight, `${selector}: effective role weight`)
  }
  const tokenBodies = rules.filter(([, , body]) => /--g-sans\s*:/.test(body)).map(([, , body]) => body).join(";")
  assert.match(lastValue(tokenBodies, "--g-sans") ?? "", /^(?:"Paperlogy"|'Paperlogy'|Paperlogy)\s*,/)
  const body = declarationsFor("body.gallery")
  for (const [property, expected] of [["font-family", "var(--g-sans)"], ["font-weight", "400"], ["line-height", "1.75"], ["word-break", "keep-all"], ["overflow-wrap", "break-word"], ["font-synthesis", "none"]]) {
    assert.equal(lastValue(body, property), expected, `body.gallery must explicitly set ${property}`)
  }
  for (const tag of ["h1", "h2", "h3", "strong", "b"]) {
    assert.equal(effectiveWeight(globalsFor(tag)), "600", `${tag}: effective global heading or emphasis default`)
  }
  for (const [selector, tag] of [
    [".section-intro h2", "h2"], [".final-plaque h2", "h2"],
    [".lbl-title", "h3"], [".service-card h3", "h3"],
    [".contact-title", "h1"], [".service-detail h1", "h1"],
    [".service-detail h2", "h2"], [".pricing-page h1", "h1"],
    [".pricing-page h2", "h2"], [".pricing-page h3", "h3"],
  ]) assertRole(selector, "600", tag)
  assertRole(".contact-intro .contact-title", "600", "h1", "400", [".contact-title"])
  assertRole(".faq-item summary", "600", "summary")
  assertRole(".cta", "500")
  // A native summary may inherit the header's medium weight or set it itself.
  const headerWeight = effectiveWeight([".docent"])
  const mobileWeight = effectiveWeight([".nav-mobile"], headerWeight)
  assertRole(".nav-mobile summary", "500", "summary", mobileWeight)
  for (const selector of [".room-tag", ".tag-no", ".tag-meta", ".card-no", ".hero-eyebrow", ".section-kicker", ".contact-email-label"]) {
    const inherited = selector === ".tag-no" || selector === ".tag-meta"
      ? effectiveWeight([".room-tag"]) : "400"
    assertRole(selector, "400", undefined, inherited)
  }
  // Form labels and portfolio scope descriptors have a meaningful medium role.
  assertRole(".field-label", "500", "label")
  assertRole("#works .work-scope-label", "500")
})

test("mobile main prose and pricing long text remain readable after typography overrides", () => {
  // Retain exact-selector, last-declaration parsing, but keep media scopes so a
  // mobile fix cannot mask a smaller desktop pricing declaration (or vice versa).
  const parseRules = (source, media = []) => {
    const result = []
    let cursor = 0
    while (cursor < source.length) {
      const open = source.indexOf("{", cursor)
      if (open < 0) break
      const selector = source.slice(cursor, open).trim()
      let end = open + 1
      let depth = 1
      while (end < source.length && depth) {
        if (source[end] === "{") depth++
        if (source[end] === "}") depth--
        end++
      }
      assert.equal(depth, 0, "CSS blocks must be balanced")
      const body = source.slice(open + 1, end - 1)
      if (/^@media\b/i.test(selector)) result.push(...parseRules(body, [...media, selector]))
      else if (/^@(?:supports|layer)\b/i.test(selector)) result.push(...parseRules(body, media))
      else if (!selector.startsWith("@")) result.push({ selectors: selector.split(",").map(value => value.trim()), body, media })
      cursor = end
    }
    return result
  }
  const clean = source => source.replace(/\/\*[^]*?\*\//g, "")
  const galleryRules = parseRules(clean(css))
  const pricingRules = parseRules(clean(pricingCss))
  const rules = [...galleryRules, ...pricingRules]
  const mediaMatches = (query, width) => query.replace(/^@media\s*/i, "").split(",").some(branch => {
    if (/\bprint\b/i.test(branch)) return false
    return [...branch.matchAll(/\((min|max)-width\s*:\s*([\d.]+)(px|em|rem)\s*\)/gi)].every(([, bound, value, unit]) => {
      const breakpoint = Number(value) * (unit.toLowerCase() === "px" ? 1 : 16)
      return bound.toLowerCase() === "min" ? width >= breakpoint : width <= breakpoint
    })
  })
  const lastValue = (selector, property, width) => {
    const declarations = rules.filter(rule => rule.selectors.includes(selector) && rule.media.every(query => mediaMatches(query, width)))
      .map(rule => rule.body).join(";")
    return [...declarations.matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "gi"))].at(-1)?.[1].trim()
  }
  const pixels = value => {
    const match = value?.match(/^([\d.]+)(px|rem)$/)
    return match ? Number(match[1]) * (match[2] === "rem" ? 16 : 1) : NaN
  }
  const widths = new Set([320, 375, 480, 640, 767, 768, 1024, 1440, 1920])
  for (const rule of rules) for (const query of rule.media) {
    for (const [, value, unit] of query.matchAll(/(?:min|max)-width\s*:\s*([\d.]+)(px|em|rem)/gi)) {
      const breakpoint = Number(value) * (unit.toLowerCase() === "px" ? 1 : 16)
      for (const width of [breakpoint - 1, breakpoint, breakpoint + 1]) if (width > 0) widths.add(width)
    }
  }
  for (const width of [...widths].filter(value => value <= 767)) {
    for (const selector of [".faq-item p", ".card-lead", ".contact-lead", ".prep-list li", "#works .work-narrative", ".hero-proposition"]) {
      const size = lastValue(selector, "font-size", width) ?? lastValue("body.gallery", "font-size", width)
      assert.ok(pixels(size) >= 16, `${selector}: final mobile prose size must be at least 16px at ${width}px, got ${size}`)
    }
  }
  const pricingProse = [...new Set(pricingRules.flatMap(rule => rule.selectors))].filter(selector =>
    /(?:^|[\s>])(?:p|li)$|\.pricing-(?:lead|description|desc|intro|copy)$/.test(selector) &&
    !/\.(?:[\w-]*-)?(?:annotation|caption|meta|label|tag)(?:\b|$)/.test(selector)
  )
  assert.ok(pricingProse.length > 0, "pricing long-text selectors must be checked")
  for (const width of widths) for (const selector of pricingProse) {
    const size = lastValue(selector, "font-size", width) ?? lastValue("body.gallery", "font-size", width)
    assert.equal(pixels(size), 16, `${selector}: final pricing long text must be 16px at ${width}px, got ${size}`)
  }
})

test("all seven original local assets and public URLs remain", () => {
  const expected = [
    ["designluka", "https://designluka.co.kr"],
    ["dcare", "https://dcarecenter.kr"],
    ["mavs", "https://mavs.kr"],
    ["sdngazer", "https://sdngazer.art"],
    ["laf2023", "https://laf2023.com"],
    ["gritlab", "https://grit-lab.kr"],
    ["hoopnote", "https://hoopnote.kr"],
  ]
  assert.equal(FALLBACK_WORKS.length, expected.length)
  expected.forEach(([id, url], index) => {
    const work = FALLBACK_WORKS[index]
    assert.equal(work.id, id)
    assert.equal(work.url, url)
    assert.equal(work.image, `/works/${id}.png`)
    assert.ok(existsSync(new URL(`../public${work.image}`, import.meta.url)))
    assert.ok(work.title && work.meta && work.note && work.year)
  })
})

test("all fourteen WebP variants decode, preserve dimensions and reduce PNG bytes", async () => {
  const sharp = require("sharp")
  for (const work of FALLBACK_WORKS) {
    const original = readFileSync(new URL(`../public${work.image}`, import.meta.url))
    assert.equal(original.subarray(0, 8).toString("hex"), "89504e470d0a1a0a")
    const input = await sharp(original).metadata()
    for (const width of [1440, 640]) {
      const filename = `${work.image.slice(0, -4)}${width === 640 ? "-640" : ""}.webp`
      const file = new URL(`../public${filename}`, import.meta.url)
      assert.ok(existsSync(file), `${filename}: run the conversion script before testing/building`)
      const data = readFileSync(file)
      assert.equal(data.toString("ascii", 0, 4), "RIFF", filename)
      assert.equal(data.toString("ascii", 8, 12), "WEBP", filename)
      assert.equal(data.readUInt32LE(4) + 8, data.length, filename)
      const output = await sharp(data).metadata()
      assert.equal(output.format, "webp", filename)
      assert.equal(output.width, width, `${filename}: truthful srcSet width`)
      assert.ok(output.width <= input.width && output.height <= input.height, `${filename}: no enlargement`)
      assert.ok(Math.abs(output.height - input.height * output.width / input.width) <= 1, `${filename}: proportional resize`)
      assert.ok(data.length < original.length, `${filename}: smaller than original`)
      const decoded = await sharp(data).raw().toBuffer({ resolveWithObject: true })
      assert.equal(decoded.info.width, output.width)
      assert.equal(decoded.info.height, output.height)
    }
  }
})

function renderResponsivePortfolio(sourceText, componentName, props, basePath, works = FALLBACK_WORKS) {
  const assetExports = {}
  const assetJavascript = ts.transpileModule(read("src/lib/assets.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  runInNewContext(assetJavascript, {
    exports: assetExports, process: { env: { NEXT_PUBLIC_BASE_PATH: basePath } },
  }, { timeout: 1000 })
  const result = {}
  const React = {
    Fragment: "fragment",
    createElement(type, attributes, ...children) { return { type, attributes: attributes ?? {}, children } },
  }
  const javascript = ts.transpileModule(`${sourceText}\nexports.renderResponsive = ${componentName}`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  }).outputText
  runInNewContext(javascript, {
    exports: result, React,
    require(name) {
      if (name === "next/link") return { default: "a" }
      if (name === "@/lib/assets") return assetExports
      if (name === "@/lib/works") return { FALLBACK_WORKS: works }
      if (name === "@/components/fab-wax") return { FabWax: "fab-wax" }
      if (name === "@/components/project-carousel") return { ProjectCarousel: "project-carousel" }
      if (name === "@/components/hero-backdrop") return { HeroBackdrop: "hero-backdrop" }
      if (name === "@/components/site-nav") return { SiteNav: "site-nav" }
      if (name === "@/lib/services") return { ORIGIN: "https://dsgnyeh.art", services: [props.service] }
      throw new Error(`Unexpected import: ${name}`)
    },
  }, { timeout: 1000 })
  return result.renderResponsive(props)
}

function portfolioElements(node, type) {
  if (!node || typeof node !== "object") return []
  const children = Array.isArray(node) ? node : node.children ?? []
  return [...(node.type === type ? [node] : []), ...children.flatMap(child => portfolioElements(child, type))]
}

function responsiveServiceFixture(works) {
  return {
    slug: "homepage-production", name: "홈페이지 제작", title: "홈페이지 제작",
    description: "설명", definition: "정의", worksContext: "관련 작업",
    audience: [], problems: [], included: [], boundaries: [], steps: [], faq: [],
    works: Array.from(works, work => work.id),
  }
}

test("home and service pictures resolve both WebP candidates and retain original image attributes", () => {
  for (const basePath of ["", "/designyeh"]) {
    const fixture = responsiveServiceFixture(FALLBACK_WORKS)
    const serviceTree = renderResponsivePortfolio(service, "ServicePage", { service: fixture }, basePath)
    const servicePictures = portfolioElements(serviceTree, "picture")
    assert.equal(servicePictures.length, FALLBACK_WORKS.length)
    for (const [index, work] of FALLBACK_WORKS.entries()) {
      const homeTree = renderResponsivePortfolio(home, "WorkCard", { work, index }, basePath)
      const homePictures = portfolioElements(homeTree, "picture")
      assert.equal(homePictures.length, 1)
      for (const [picture, isHome] of [[homePictures[0], true], [servicePictures[index], false]]) {
        assert.equal(picture.attributes.style.display, "block")
        assert.equal(picture.attributes.style.width, "100%")
        const children = picture.children.flat().filter(child => child && typeof child === "object")
        assert.deepEqual(children.map(child => child.type), ["source", "img"])
        const [source, image] = children
        const stem = work.image.slice(0, -4)
        assert.equal(source.attributes.type, "image/webp")
        assert.equal(source.attributes.srcSet, `${basePath}${stem}-640.webp 640w, ${basePath}${stem}.webp 1440w`)
        assert.equal(source.attributes.sizes, "(max-width: 700px) 100vw, 50vw")
        assert.equal(image.attributes.src, `${basePath}${work.image}`)
        assert.equal(image.attributes.alt, `${work.title} 웹사이트 미리보기`)
        assert.equal(image.attributes.width, 1440)
        assert.equal(image.attributes.height, 900)
        assert.equal(image.attributes.loading, "lazy")
        assert.equal(image.attributes.className, isHome ? "work-image" : undefined)
        const urls = [image.attributes.src, ...source.attributes.srcSet.split(", ").map(candidate => candidate.split(" ")[0])]
        for (const url of urls) {
          const local = url.slice(basePath.length)
          assert.match(local, /^\/works\/[a-z0-9-]+\.(?:png|webp)$/)
          assert.ok(existsSync(new URL(`../public${local}`, import.meta.url)), `${url}: no broken image URL`)
        }
      }
    }
  }
})

test("responsive sources use the image path allowlist and leave unknown PNG fallbacks intact", () => {
  const paths = [
    "/works/new_site-2.png", "/works/designluka.png?x=1", "/works/designluka.png#x",
    "/works/../designluka.png", "/works/%2e%2e/designluka.png",
    "https://example.com/works/designluka.png", "//example.com/works/designluka.png",
    "/works/designluka.webp",
  ]
  for (const image of paths) {
    const work = { ...FALLBACK_WORKS[0], image }
    const fixture = responsiveServiceFixture([work])
    for (const tree of [
      renderResponsivePortfolio(home, "WorkCard", { work, index: 0 }, ""),
      renderResponsivePortfolio(service, "ServicePage", { service: fixture }, "", [work]),
    ]) {
      assert.equal(portfolioElements(tree, "source").length, 0, `${image}: do not invent WebP URLs`)
      assert.equal(portfolioElements(tree, "img")[0].attributes.src, image)
    }
  }
  // IDs must not select another case's image; use the validated work.image.
  const work = { ...FALLBACK_WORKS[0], image: "/works/dcare.png" }
  const tree = renderResponsivePortfolio(home, "WorkCard", { work, index: 0 }, "")
  assert.equal(portfolioElements(tree, "source")[0].attributes.srcSet, "/works/dcare-640.webp 640w, /works/dcare.webp 1440w")
})

function portfolioCopy(work) {
  return [work.title, work.meta, work.note, work.solution, ...(work.scope ?? []), work.ownership].filter(value => typeof value === "string").join(" ")
}

function renderPortfolioComponent(name, props = {}) {
  const source = ts.createSourceFile("page.tsx", home, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const declaration = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name)
  assert.ok(declaration, `${name} must exist`)
  const component = declaration.getText(source).replace(/^export\s+default\s+/, "")
  const javascript = ts.transpileModule(`${component}\nexports.render = ${name}`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  }).outputText
  const result = {}
  const React = {
    Fragment: "fragment",
    createElement(type, attributes, ...children) { return { type, attributes: attributes ?? {}, children } },
  }
  runInNewContext(javascript, {
    exports: result, React, asset: value => value, FALLBACK_WORKS,
    Link: "a", SiteNav: "nav", SectionTag: "section-tag", WorkCard: "work-card", FabWax: "fab-wax", ProjectCarousel: "project-carousel", HeroBackdrop: "hero-backdrop",
  }, { timeout: 1000 })
  return result.render(props)
}

function visiblePortfolioText(node) {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(visiblePortfolioText).join(" ")
  const attributes = node.attributes ?? {}
  if (attributes.hidden || attributes["aria-hidden"] === true || attributes["aria-hidden"] === "true" ||
      /(?:^|\s)sr-only(?:\s|$)/.test(attributes.className ?? "") ||
      attributes.style?.display === "none" || attributes.style?.visibility === "hidden") return ""
  return visiblePortfolioText(node.children)
}

function findPortfolioElement(node, predicate) {
  if (!node || typeof node !== "object") return undefined
  if (!Array.isArray(node) && predicate(node)) return node
  for (const child of Array.isArray(node) ? node : node.children ?? []) {
    const found = findPortfolioElement(child, predicate)
    if (found) return found
  }
}

test("exactly five portfolio cases have need, solution and confirmed scope", () => {
  const scopes = {
    designluka: ["DB 연결", "관리자 페이지"],
    sdngazer: ["이미지 중심 포트폴리오", "기록 관리", "관리자 페이지"],
    laf2023: ["의류 판매 페이지", "인플루언서 협업 채널"],
    gritlab: ["랜딩 페이지", "3:3 대회 운영", "스코어보드·전광판", "DB 연결"],
    hoopnote: ["농구학원 운영 보조 서비스", "AI 도입"],
  }
  const structured = FALLBACK_WORKS.filter(work => work.solution !== undefined || work.scope !== undefined)
  assert.deepEqual(Array.from(structured, work => work.id).sort(), Object.keys(scopes).sort())
  for (const work of FALLBACK_WORKS) {
    assert.equal(typeof work.note, "string", `${work.id}: retain the note`)
    assert.ok(work.note.trim(), `${work.id}: retain nonempty need/context`)
    if (work.ownership !== undefined) assert.equal(typeof work.ownership, "string")
    if (Object.hasOwn(scopes, work.id)) {
      assert.equal(typeof work.solution, "string", `${work.id}: solution`)
      assert.ok(work.solution.trim(), `${work.id}: nonempty solution`)
      assert.ok(Array.isArray(work.scope), `${work.id}: scope array`)
      assert.ok(work.scope.every(value => typeof value === "string" && value.trim()))
      assert.deepEqual(Array.from(work.scope).sort(), [...scopes[work.id]].sort(), `${work.id}: confirmed scope only`)
    } else {
      assert.equal(work.solution, undefined, `${work.id}: no fabricated solution`)
      assert.equal(work.scope, undefined, `${work.id}: no fabricated scope`)
    }
  }
})

test("portfolio claims stay within confirmed capabilities and omit ownership labels", () => {
  const byId = Object.fromEntries(FALLBACK_WORKS.map(work => [work.id, work]))
  assert.doesNotMatch(portfolioCopy(byId.designluka), /문의\s*자동\s*분류/)
  assert.doesNotMatch(portfolioCopy(byId.laf2023), /결제|주문|관리자|어드민|payments?|orders?|admin|2,?000/i)
  const grit = portfolioCopy(byId.gritlab)
  assert.equal(byId.gritlab.solution, "3:3 대회운영, 스코어보드 전광판이 하나로 관리되는 사이트 제작")
  assert.match(grit, /(?:소규모|작은)\s*(?:농구\s*)?체육관/)
  assert.match(grit, /부담/)
  const hoopnote = portfolioCopy(byId.hoopnote)
  assert.doesNotMatch(hoopnote, /(?:\d[\d,.]*\s*(?:%|퍼센트|시간|분|초|원)[^.!?\n]{0,40}(?:절감|단축|감소|줄)|(?:절감|단축|감소)[^.!?\n]{0,40}\d)/)
  assert.doesNotMatch(hoopnote, /(?:학부모|부모)[^.!?\n]{0,60}자동[^.!?\n]{0,30}(?:발송|전송|보내)|자동[^.!?\n]{0,60}(?:학부모|부모)[^.!?\n]{0,30}(?:발송|전송|보내)/)
  for (const id of ["mavs", "hoopnote"]) {
    assert.equal(byId[id].ownership, undefined, `${id}: ownership label removed`)
  }
})

test("WorkCard renders narrative and scope while omitting ownership labels", () => {
  for (const [index, work] of FALLBACK_WORKS.entries()) {
    const rendered = visiblePortfolioText(renderPortfolioComponent("WorkCard", { work, index }))
    assert.ok(rendered.includes(work.note), `${work.id}: note stays visible`)
    if (work.solution !== undefined) {
      assert.ok(rendered.includes(work.solution), `${work.id}: solution stays visible`)
      assert.ok(rendered.indexOf(work.note) < rendered.indexOf(work.solution), `${work.id}: need context precedes solution`)
      assert.ok(rendered.includes("제작 범위"), `${work.id}: visible scope label`)
      for (const item of work.scope) assert.ok(rendered.includes(item), `${work.id}: ${item}`)
    }
    assert.doesNotMatch(rendered, /자체(?: 운영)? 프로젝트/)
  }
  const work = {
    ...FALLBACK_WORKS[0], note: "NEED_CONTEXT_SENTINEL", solution: "SOLUTION_SENTINEL",
    scope: ["SCOPE_FIRST_SENTINEL", "SCOPE_SECOND_SENTINEL"], ownership: "OWNERSHIP_SENTINEL",
  }
  const rendered = visiblePortfolioText(renderPortfolioComponent("WorkCard", { work, index: 0 }))
  for (const value of [work.note, work.solution, ...work.scope, "제작 범위"]) {
    assert.ok(rendered.includes(value), `WorkCard must render field content: ${value}`)
  }
  assert.ok(rendered.indexOf(work.note) < rendered.indexOf(work.solution))
  assert.ok(!rendered.includes(work.ownership))
})

test("works introduction visibly distinguishes separate builds from the basic landing package", () => {
  const tree = renderPortfolioComponent("StudioHome")
  const works = findPortfolioElement(tree, node => node.attributes?.id === "works")
  assert.ok(works, "works section must exist")
  const rendered = visiblePortfolioText(works).replace(/\s+/g, " ").trim()
  for (const text of [
    "사업을 소개하는 홈페이지부터, 운영에 필요한 관리 기능까지.",
    "별도 구축 범위",
    "기본 랜딩 패키지에는 포함되지 않습니다.",
  ]) assert.ok(rendered.includes(text), `visible works qualification: ${text}`)
})

test("toWork accepts optional narrative strings and filters scope without coercion", () => {
  const poison = { toString() { throw new Error("must not coerce narrative fields") } }
  const work = toWork({
    url: "https://unrelated.example", note: "필요한 배경", solution: "제작한 해결책",
    scope: ["첫 범위", 3, null, poison, false, "둘째 범위"], ownership: "자체 프로젝트",
  }, 0)
  assert.equal(work.note, "필요한 배경")
  assert.equal(work.solution, "제작한 해결책")
  assert.equal(work.ownership, "자체 프로젝트")
  assert.deepEqual(Array.from(work.scope), ["첫 범위", "둘째 범위"])
  const empty = toWork({ solution: "", scope: [], ownership: "" }, 0)
  assert.equal(empty.solution, "")
  assert.equal(empty.ownership, "")
  assert.deepEqual(Array.from(empty.scope), [])
  for (const value of [undefined, null, true, 42, NaN, Infinity, {}, [], poison]) {
    const invalid = toWork({ url: "https://unrelated.example", solution: value, ownership: value }, 0)
    assert.equal(invalid.solution, undefined)
    assert.equal(invalid.ownership, undefined)
  }
  for (const value of [undefined, null, true, 42, "scope", {}, poison, [3, null, poison]]) {
    const invalid = toWork({ url: "https://unrelated.example", scope: value }, 0)
    assert.ok(invalid.scope === undefined || (Array.isArray(invalid.scope) && invalid.scope.length === 0), "invalid scope must be undefined or an empty array")
  }
})

test("toWork never borrows case narrative fields from an unrelated positional fallback", () => {
  for (let index = 0; index < FALLBACK_WORKS.length; index++) {
    for (const row of [{}, { url: "https://unrelated.example" }, { url: "https://evil.example/designluka.co.kr" }, { url: "javascript:alert(1)" }]) {
      const work = toWork(row, index)
      assert.equal(work.note, undefined)
      assert.equal(work.solution, undefined)
      assert.equal(work.ownership, undefined)
      assert.ok(work.scope === undefined || (Array.isArray(work.scope) && work.scope.length === 0))
    }
    const dcare = toWork({ url: "https://dcarecenter.kr" }, index)
    assert.equal(dcare.solution, undefined)
    assert.equal(dcare.ownership, undefined)
    assert.ok(dcare.scope === undefined || (Array.isArray(dcare.scope) && dcare.scope.length === 0))
  }
})

test("imported works reject unsafe protocols, credentials and malformed URLs", () => {
  const unsafe = ["javascript:alert(1)", "data:text/html,x", "http://example.com", "//example.com", "/contact", "https://", "https://user:pass@example.com", " https://example.com", "https://example.com\n", "https://exa\tmple.com", "https://example.com\\evil", "https://example.com/a b", {}, [], 42, null]
  for (const url of unsafe) assert.equal(toWork({ url }, 0).url, "", String(url))
  assert.equal(toWork({ url: "https://example.com/path?q=1#work" }, 0).url, "https://example.com/path?q=1#work")
  assert.equal(toWork({ url: false, link: "https://example.com" }, 0).url, "https://example.com/")
  assert.equal(toWork({ url: "https://evil.example/designluka.co.kr" }, 0).note, undefined)
})

test("imported image paths cannot escape local PNG assets", () => {
  const invalid = ["https://example.com/a.png", "//example.com/a.png", "/works/../secret.png", "/works/%2e%2e/secret.png", "/works/a.svg", "/works/a.png?x=1", "/works/a.png#x", "/works/sub/a.png", "/works/a\\b.png", "data:image/png,x", {}, null, 42]
  for (const image of invalid) {
    const work = toWork({ image, url: "https://dcarecenter.kr" }, 0)
    assert.equal(work.image, "/works/dcare.png")
    localImage(work.image)
  }
  assert.equal(toWork({ image: "/works/new_site-2.png" }, 0).image, "/works/new_site-2.png")
  assert.equal(toWork({}, 4).image, "/works/laf2023.png")
  assert.equal(toWork({}, -1).image, "/works/designluka.png")
})

test("untrusted scalar fields never reach React as objects or invalid numbers", () => {
  const poison = { toString() { throw new Error("must not coerce objects") } }
  for (const value of [undefined, null, 4, true, "row", [], poison]) {
    const work = toWork(value, NaN)
    assert.equal(typeof work.title, "string")
    assert.equal(typeof work.year, "string")
    localImage(work.image)
  }
  const work = toWork({ id: Infinity, title: poison, meta: [], description: "설명", year: poison, created_at: "invalid", tech: ["Next.js", 3, poison, null], category: false, note: poison, url: poison, image: poison }, 2)
  assert.equal(work.id, 2)
  assert.equal(work.title, "Untitled")
  assert.equal(work.meta, "설명")
  assert.equal(work.year, "")
  assert.equal(work.category, "website")
  assert.equal(work.note, undefined)
  assert.deepEqual(Array.from(work.tech), ["Next.js"])
  assert.equal(toWork({ year: 2025 }, 0).year, "2025")
  assert.equal(toWork({ year: NaN }, 0).year, "")
  assert.equal(toWork({ created_at: "2025-12-31T23:00:00Z" }, 0).year, "2025")
  assert.equal(toWork({ url: "https://www.designluka.co.kr/" }, 0).note, FALLBACK_WORKS[0].note)
  assert.equal(toWork({ note: "", url: "https://designluka.co.kr" }, 0).note, "")
  assert.equal(toWork({ title: "<script>alert(1)</script>" }, 0).title, "<script>alert(1)</script>")
  assert.doesNotMatch(home + contact, /dangerouslySetInnerHTML|innerHTML/)
})

test("substantial side-by-side opening works, immediate content and reduced motion replace entrance gating", () => {
  for (const index of [0, 1, 6, -1, NaN]) {
    const geometry = frameLayout(index)
    assert.equal(geometry.artW / geometry.artH, 1.6)
    assert.equal(geometry.offsetClass, "")
  }
  const desktopCss = css.split(/@media\b/)[0]
  assert.match(desktopCss, /\.salon-grid\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/)
  const placements = [...desktopCss.matchAll(/([^{}]*\.work-card:nth-child\([^)]+\)[^{}]*)\{([^{}]*)\}/g)].flatMap(([, selector, declarations]) => {
    const column = declarations.match(/(?:^|;)\s*grid-column:\s*(\d+)\s*\/\s*(span\s+)?(\d+)\s*;/)
    if (!column) return []
    const start = Number(column[1])
    const width = column[2] ? Number(column[3]) : Number(column[3]) - start
    assert.ok(start >= 1 && width > 0 && start + width <= 13, selector)
    return [{ selector, start, width, declarations }]
  })
  const opening = [1, 2].map(index => placements.filter(item => item.selector.split(",").some(selector => {
    const expression = selector.match(/\.work-card:nth-child\(([^)]+)\)/)?.[1].replace(/\s+/g, "")
    return expression === String(index) || expression === (index === 1 ? "odd" : "even") || expression === (index === 1 ? "2n+1" : "2n")
  })).at(-1))
  assert.ok(opening.every(Boolean), "first two works must have explicit desktop placements")
  const [first, second] = opening
  assert.ok(first.width >= 5 && second.width >= 5, "opening works must each occupy at least five columns")
  assert.ok(first.start + first.width <= second.start || second.start + second.width <= first.start, "opening works must sit side by side")
  const baseDeclarations = [...desktopCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) => selectors.split(",").some(selector => selector.trim() === ".work-card"))
    .map(([, , declarations]) => declarations).join(";")
  const lastValue = (declarations, property) => [...declarations.matchAll(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`, "g"))].at(-1)?.[1].trim()
  const openingDeclarations = opening.map(item => `${baseDeclarations};${item.declarations}`)
  for (const property of ["grid-row", "grid-row-start", "margin-top", "margin-block-start", "top", "translate", "transform", "align-self"]) {
    assert.equal(lastValue(openingDeclarations[0], property), lastValue(openingDeclarations[1], property), `opening works must share their top position: ${property}`)
  }
  assert.match(css, /\.work-image, \.art\s*\{[^}]*aspect-ratio: 16 \/ 10/)
  assert.match(css, /\.work-card, \.frame-link\s*\{[^}]*opacity: 1/)
  assert.doesNotMatch(animate, /motion\.|initial=|useInView|IntersectionObserver|opacity: 0/)
  assert.match(animate, /return <div className=\{className\}>\{children\}<\/div>/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[^]*animation: none !important; transition: none !important/)
  for (const [, selectors, declarations] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (/work-card|salon-grid|section-intro|hero-grid/.test(selectors)) {
      assert.doesNotMatch(declarations, /opacity:\s*0\s*;|visibility:\s*hidden/)
    }
  }
})

test("work placements and responsive resets are scoped to direct salon-grid cards", () => {
  const styles = css.replace(/\/\*[^]*?\*\//g, "")
  const rules = source => [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .flatMap(([, selectors, body]) => selectors.split(",").map(selector => ({ selector: selector.trim(), body })))
  const selectors = Array.from({ length: 7 }, (_, index) => `.salon-grid > .work-card:nth-child(${index + 1})`)
  const placements = rules(styles).filter(rule => /\.work-card\b/.test(rule.selector) && /(?:^|;)\s*grid-column(?:-start|-end)?\s*:/.test(rule.body))
  assert.equal(placements.length, 14, "seven desktop placements and seven responsive resets")
  for (const rule of placements) {
    assert.ok(selectors.includes(rule.selector), `placement must target a direct salon-grid card: ${rule.selector}`)
  }
  const desktop = rules(styles.split(/@media\b/)[0])
  const mobileSource = styles.match(/@media\s*\(max-width:\s*700px\)\s*\{([^]*?)\n\}/)?.[1]
  assert.ok(mobileSource, "700px responsive block must exist")
  const mobile = rules(mobileSource)
  const column = body => body.match(/(?:^|;)\s*grid-column\s*:\s*([^;]+)/)?.[1].trim()
  const expected = ["1 / span 7", "8 / span 5", "1 / span 6", "7 / span 6", "1 / span 7", "8 / span 5", "2 / span 7"]
  selectors.forEach((selector, index) => {
    const original = desktop.filter(rule => rule.selector === selector)
    const reset = mobile.filter(rule => rule.selector === selector)
    assert.equal(original.length, 1, `${selector}: one desktop placement`)
    assert.equal(reset.length, 1, `${selector}: one responsive reset`)
    assert.equal(column(original[0].body), expected[index], `${selector}: retain home placement`)
    assert.equal(column(reset[0].body), "1 / -1", `${selector}: retain home responsive placement`)
    assert.match(reset[0].body, /(?:^|;)\s*margin-top:\s*0\s*;/)
  })
})

test("studio palette and typography include pricing with no external fonts", () => {
  const styles = (css + "\n" + pricingCss).replace(/\/\*[^]*?\*\//g, "")
  assert.match(styles, /#f4f1ea\b/i)
  assert.doesNotMatch(styles, /#1450ff\b/i)
  const ivoryTokens = [...css.matchAll(/(--[\w-]+):\s*#f4f1ea\s*;/gi)].map(match => match[1])
  const bodyBackground = css.match(/body\.gallery\s*\{[^}]*?background(?:-color)?:\s*([^;]+);/)?.[1].trim()
  assert.ok(bodyBackground && (bodyBackground.toLowerCase() === "#f4f1ea" || ivoryTokens.some(token => bodyBackground === `var(${token})`)), "the page background must use ivory")
  assert.match(css, /--g-sans:\s*[^;]*sans-serif\s*;/)
  assert.match(css, /body\.gallery\s*\{[^}]*font-family:\s*var\(--g-sans\)/)
  assert.doesNotMatch(styles, /(?<![\w-])serif\b|Times New Roman|Palatino|Baskerville|Garamond|Bodoni|Didot|Noto Serif/i)
  assert.doesNotMatch(css + pricingCss, /--g-serif|Instrument Serif|Georgia|font-style:\s*italic|font:\s*italic|radial-gradient|walnut|wax/i)
  const fontLink = '<link rel="stylesheet" href={asset("/fonts/paperlogy/paperlogy.css")} />'
  assert.ok(layout.includes(fontLink))
  assert.doesNotMatch(layout.replace(fontLink, ""), /fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|rel="stylesheet"|rel="preconnect"|rel="preload"|next\/font/)
  assert.match(pricingCss, /\.pricing-plaque \.pricing-amount\s*\{[^}]*var\(--g-sans\)/)
  assert.match(pricingCss, /\.pricing-reply \.pricing-clock\s*\{[^}]*var\(--g-sans\)/)
  assert.doesNotMatch(home + contact + service, /ENTRY HALL|PERMANENT COLLECTION|END OF EXHIBIT|SERVICE GALLERY|SELECTED COLLECTION|FRONT DESK|전시로 돌아가기/)
})

test("works are rectangular and unboxed, with text CTAs", () => {
  const desktopCss = css.replace(/\/\*[^]*?\*\//g, "").split(/@media\b/)[0]
  function declarationsFor(selector) {
    return [...desktopCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(",").some(value => value.trim() === selector))
      .map(([, , declarations]) => declarations).join(";")
  }
  function lastValue(declarations, property) {
    return [...declarations.matchAll(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`, "g"))].at(-1)?.[1].trim()
  }
  for (const selector of [".work-card", ".work-image-link", ".work-image"]) {
    const declarations = declarationsFor(selector)
    assert.ok(declarations, `${selector} must retain styling`)
    assert.match(lastValue(declarations, "border-radius") ?? "0", /^0(?:px)?$/, `${selector} must have square corners`)
    assert.match(lastValue(declarations, "box-shadow") ?? "none", /^none$/, `${selector} must have no shadow`)
    assert.match(lastValue(declarations, "border") ?? "0", /^(?:0(?:px)?|none)$/, `${selector} must have no enclosing border`)
  }
  for (const selector of [".work-card", ".cta", ".cta-primary", ".cta-secondary"]) {
    const declarations = declarationsFor(selector)
    assert.match(lastValue(declarations, "background(?:-color)?") ?? "transparent", /^(?:transparent|none)$/, `${selector} must have no filled box`)
  }
  const ctaDeclarations = declarationsFor(".cta")
  assert.match(lastValue(ctaDeclarations, "border") ?? "0", /^(?:0(?:px)?|none)$/, "text CTAs must have no enclosing border")
  assert.match(lastValue(ctaDeclarations, "border-radius") ?? "0", /^0(?:px)?$/, "text CTAs must have no rounded box")
})

test("mobile navigation and FAQ use native controls and focus stays visible", () => {
  for (const page of [home, contact, service]) {
    assert.match(page, /<SiteNav\b/)
    assert.match(page, /className="skip-link"/)
  }
  assert.match(navigation, /<details className="nav-mobile">/)
  assert.match(navigation, /<summary>메뉴/)
  assert.match(home, /<details className="faq-item"><summary>/)
  assert.match(css, /:focus-visible\s*\{[^}]*outline: 3px solid var\(--blue\)/)
  assert.match(css, /\.nav-mobile nav\s*\{[^}]*display: grid/)
  assert.doesNotMatch(css.match(/\.nav-mobile nav\s*\{[^}]*\}/)?.[0] ?? "", /position:\s*(absolute|fixed)/)
  assert.match(navigation, /NAV_ITEMS.map\(\(\[label, href\]\)/)
  assert.match(fab, /className="contact-rail"/)
  assert.match(fab, /제작 문의/)
  assert.doesNotMatch(fab, /fab-wax-coin|fwx-|drip/)
  assert.doesNotMatch(css, /position:\s*fixed/)
})

test("legacy routes replace the full document without adding history and retain fallback links", () => {
  for (const [route, anchor] of [["about", "approach"], ["portfolio", "works"]]) {
    const source = read(`src/app/${route}/page.tsx`)
    assert.match(source, /useEffect\(\(\) => \{\s*window\.location\.replace\(asset\("\/#(?:approach|works)"\)\)\s*\}, \[\]\)/)
    assert.ok(source.includes(`window.location.replace(asset("/#${anchor}"))`))
    assert.ok(source.includes(`href="/#${anchor}"`))
    assert.ok(home.includes(`id="${anchor}"`))
    assert.match(source, /<main[^]*<h1>/)
    assert.doesNotMatch(source, /return null|room-0[25]/)
  }
})

test("legacy redirects and hosted font stylesheet resolve configured base paths", () => {
  const compile = source => ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  }).outputText
  for (const basePath of ["", "/designyeh", "/preview/custom"]) {
    const assetExports = {}
    runInNewContext(compile(read("src/lib/assets.ts")), {
      exports: assetExports, process: { env: { NEXT_PUBLIC_BASE_PATH: basePath } },
    }, { timeout: 1000 })
    const redirects = []
    const render = source => {
      const result = {}
      runInNewContext(compile(source), {
        exports: result, URL,
        React: { createElement(type, attributes, ...children) { return { type, attributes: attributes ?? {}, children } } },
        window: { location: { replace(target) { redirects.push(target) } } },
        require(name) {
          if (name === "@/lib/assets") return assetExports
          if (name === "next/link") return { default: "a" }
          if (name === "react") return { useEffect(effect) { effect() } }
          if (name === "./globals.css") return {}
          throw new Error(`Unexpected import: ${name}`)
        },
      }, { timeout: 1000 })
      return result.default({ children: "CONTENT" })
    }
    for (const [route, anchor] of [["about", "approach"], ["portfolio", "works"]]) {
      render(read(`src/app/${route}/page.tsx`))
      assert.equal(redirects.at(-1), `${basePath}/#${anchor}`)
    }
    const tree = render(layout)
    const links = portfolioElements(tree, "link").filter(link => link.attributes.rel === "stylesheet")
    assert.equal(links.length, 1)
    assert.equal(links[0].attributes.href, `${basePath}/fonts/paperlogy/paperlogy.css`)
    const stylesheet = new URL(links[0].attributes.href, "https://example.test")
    const sources = [...fontCss.matchAll(/url\("(\.\/Paperlogy-[^"]+\.woff2)"\)/g)]
    assert.equal(sources.length, 4)
    for (const [, relative] of sources) {
      const resolved = new URL(relative, stylesheet)
      assert.equal(resolved.origin, stylesheet.origin)
      assert.equal(resolved.pathname, `${basePath}/fonts/paperlogy/${relative.slice(2)}`)
      assert.ok(existsSync(new URL(`../public${resolved.pathname.slice(basePath.length)}`, import.meta.url)))
    }
    assert.equal(portfolioElements(tree, "body")[0].attributes.className, "gallery antialiased")
    assert.equal(portfolioElements(tree, "body")[0].children[0], "CONTENT")
  }
})

test("legacy routes never use a client router redirect", () => {
  for (const route of ["about", "portfolio"]) {
    const source = read(`src/app/${route}/page.tsx`)
    assert.doesNotMatch(source, /next\/(?:navigation|router)|\buseRouter\b|\brouter\b/)
  }
})

test("contact explicitly explains external message handling and prohibits secrets", () => {
  for (const text of ["이 페이지에는 문의 내용을 입력하거나 제출하는 양식이 없습니다", "외부 서비스로 이동", "이메일·채팅 제공업체에서 처리", "비밀번호·API 키·민감한 고객 데이터는 보내지 마세요"]) assert.ok(contact.includes(text))
  assert.doesNotMatch(contact, /<form\b|<input\b|<textarea\b|onSubmit|\bfetch\s*\(/)
  assert.equal((contact.match(/aria-describedby="contact-privacy"/g) ?? []).length, 3)
  assert.match(contact, /id="contact-privacy"/)
  assert.match(contact, /target="_blank" rel="noopener noreferrer"/)
})

test("llms guide matches current positioning and confirmed portfolio scope", () => {
  const guide = read("public/llms.txt")
  assert.match(guide, /소규모 사업자를 위한 홈페이지 제작/)
  assert.doesNotMatch(guide, /서울의|미술관|Every homepage is a work of art|문의 자동 분류|예약\/대관 플랫폼|프리미엄 농구 코트/)
  for (const work of FALLBACK_WORKS) {
    const line = guide.split("\n").find(line => line.includes(`](${work.url.replace(/\/$/, "")})`))
    assert.ok(line, `${work.id}: public case link`)
    for (const scope of work.scope ?? []) assert.ok(line.includes(scope), `${work.id}: ${scope}`)
    if (work.ownership?.includes("자체")) assert.match(line, /자체/)
  }
  assert.match(guide, /기본 랜딩 패키지에는 포함되지 않습니다/)
  assert.match(guide, /검색 순위, 생성형 답변 인용, 문의·매출 결과를 약속하지 않습니다/)
  for (const route of ["homepage-production", "brand-identity", "operations-automation", "contact", "pricing"]) {
    assert.ok(guide.includes(`https://dsgnyeh.art/${route}/`))
  }
})

test("both JSON-LD boundaries escape less-than before script insertion", () => {
  for (const source of [layout, service]) {
    assert.ok(source.includes('JSON.stringify(jsonLd).replace(/</g, "\\\\u003c")'))
  }
  const payload = { description: "</script><script>alert(1)</script>" }
  const serialized = JSON.stringify(payload).replace(/</g, "\\u003c")
  assert.doesNotMatch(serialized, /</)
  assert.deepEqual(JSON.parse(serialized), payload)
})

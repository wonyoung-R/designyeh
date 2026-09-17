import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const page = read("src/app/pricing/page.tsx")
const home = read("src/app/page.tsx")
const navigation = read("src/components/site-nav.tsx")

test("pricing route provides its own canonical and social metadata", () => {
  assert.match(page, /const url = "https:\/\/dsgnyeh.art\/pricing\/"/)
  for (const phrase of ["export const metadata: Metadata", "alternates: { canonical: url }", "openGraph:", "twitter:"]) assert.ok(page.includes(phrase))
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1)
  for (const id of ["landing", "custom", "revisions", "reply", "ai", "terms"]) {
    assert.ok(page.includes(`id="${id}"`))
    assert.ok(page.includes(`href="#${id}"`))
  }
})

test("home exposes pricing in both navigation menus, service area and footer", () => {
  assert.match(home, /<SiteNav\s*\/>/)
  assert.match(navigation, /\["Pricing", "\/pricing\/"\]/)
  assert.equal((navigation.match(/\{links\}/g) ?? []).length, 2)
  assert.match(home, /className="service-link" href="\/pricing\/"/)
  assert.match(home, /<footer[^]*href="\/pricing\/"/)
})

test("landing price and completion-based revision boundaries stay explicit", () => {
  for (const phrase of ["300,000", "VAT 별도 · 도메인 구매 비용 별도", "단일 랜딩페이지 · 최대 9개 섹션", "독립된 웹페이지 9개를 뜻하지 않습니다", "제작 완료 확정일로부터", "30일간 간단한 수정 2회", "한 번에 취합해 전달한 건을 1회", "30일 이내 접수한 요청은 실제 처리 완료가 기간 이후여도 인정", "착수 전에 완료 기준", "1차 납품만으로 자동 완료 처리하지 않습니다", "완료 기준 미충족", "제작 오류는 수정 횟수에서 차감하지 않습니다", "추가 수정 단가는 상담 후 확정"]) assert.ok(page.includes(phrase), phrase)
})

test("24-hour reply is an announced service condition with limited remedy", () => {
  for (const phrase of ["서비스 조건으로 안내합니다", "1차 납품 후 수정 요청 접수 시점부터 24시간", "처리 예정 일정을 회신", "주말·공휴일도 포함", "단순 자동 접수 메시지는 회신으로 보지 않습니다", "24시간 이내 수정 완료 보장은 아닙니다", "기본 수정 2회 외 추가 수정 1회", "제작비 전체 면제·환불을 의미하지 않습니다", "공식 접수 채널", "반복 지연 시 보상 누적 여부", "추가 보상 수정의 사용 기한은 계약 전 협의·확정"]) assert.ok(page.includes(phrase), phrase)
  assert.doesNotMatch(page, /모니터링.*검증|자동화.*구축 완료|내부 검토용|공개 전 확정 필요|체크리스트 제안|배포.*완료했습니다/)
})

test("basic delivery and custom estimates distinguish fixed scope, free consultation and agreed rates", () => {
  for (const phrase of ["12시간 내 완성본", "자료·범위 확정 후 합의한 착수 시점부터 12시간", "관리자·DB·추가 기능의 제작 일정은 별도로", "약 15분 무료 상담", "시간당 75,000원", "시간당 단가를 낮춰 협의", "적용 단가·예상 작업시간·총액을 착수 전에 확정", "범위가 정해진 기능은 합의한 총액", "분석·검증부터 단계별로 견적", "유료 분석·기술 검증이 필요하면 범위와 비용을 먼저 안내하고 동의 후 진행"]) assert.ok(page.includes(phrase), phrase)
  assert.doesNotMatch(page, /상담 접수.*12시간|무제한 수정|<br\b/)
})

test("AI estimates retain human effort and provider usage boundaries", () => {
  for (const phrase of ["업무 분석", "PoC · 기술 검증", "구축 · 연동", "운영 · 유지관리", "단계별 총액과 예산 상한", "사람의 실제 투입시간과 에이전트 실행·대기시간을 구분", "공급사의 실제 과금 기준", "초과 실행 전 승인", "토큰 사용량을 이유로 추가 청구하지 않습니다", "취소·환불", "소스 소유권", "데이터·권한·외부 전송"]) assert.ok(page.includes(phrase), phrase)
  assert.doesNotMatch(page, /사전 상담의 무료 여부|아직 확정되지 않았습니다/)
})

const maintenance = page.slice(page.indexOf('<section id="maintenance"'), page.indexOf('<section id="terms"'))

test("maintenance sits between reply and AI with index, home and contact links", () => {
  assert.ok(page.indexOf('<section id="reply"') < page.indexOf('<section id="maintenance"'))
  assert.ok(maintenance.startsWith('<section id="maintenance"'))
  assert.match(page, /href="#reply"[^]*href="#maintenance">운영·유지관리<[^]*href="#ai"/)
  assert.match(home, /href="\/pricing\/">[^]*?<\/p>\s*<p className="scope-note"><Link className="service-link" href="\/pricing\/#maintenance">운영·유지관리 월 30,000원부터 · 기존 홈페이지도 상담 가능 · 사이트당\/VAT 별도/)
  assert.match(maintenance, /href="\/contact\/">내 홈페이지 관리 상담하기/)
  assert.match(maintenance, /href="#ai"/)
})

test("maintenance pricing is per site with review and optional separate consent", () => {
  for (const phrase of ["기본 월 30,000원부터", "사이트당 · VAT 별도 · 관리 범위에 따라 별도 계약", "현재 운영 중인 홈페이지도 운영·유지관리 상담 대상", "기존 designYEH 제작 사이트", "타사 제작 사이트", "소스·호스팅 접근 가능 여부", "승인 후 진행", "자동 계약이나 과금 시작을 뜻하지는 않습니다", "별도 계약에 동의한 이후부터", "모든 기존 사이트에 월 30,000원이 동일하게 적용되는 것은 아닙니다", "비밀번호·인증키는 문의 내용에 입력하지 마세요"]) assert.ok(maintenance.includes(phrase), phrase)
  assert.equal((maintenance.match(/<details className="faq-item">/g) ?? []).length, 2)
  for (const phrase of ["월 계약 없이 필요한 작업만 건별 의뢰 가능", "유료 서비스 비용", "전액 고객 부담", "월관리비 = 관리 작업비 + 월 구독료 실비", "고객이 직접 결제한 구독료는 중복 청구하지 않습니다", "사용량 예산·상한", "실제 점검 항목·주기는 계약 시 확정", "원인 분석·복구 작업의 포함 범위는 계약 시 확정", "사이트별 관리 범위·점검 주기·응대 기준·비용을 합의해 별도 계약"]) assert.ok(page.includes(phrase), phrase)
})

test("maintenance preserves existing contracts and limits revision and response promises", () => {
  for (const phrase of ["해당 랜딩페이지 상품에 적용되는", "유지관리 가입 여부와 관계없이 제공", "동일 작업을 중복 청구하지 않습니다", "과거 제작 계약의 조건은 기존 계약에 따릅니다", "24시간 회신 약속은 1차 납품 후 수정 요청에 대한 조건", "유료 유지관리의 응대 기준은 사이트별 관리계약에서 별도로 확정"]) assert.ok(maintenance.includes(phrase), phrase)
  assert.doesNotMatch(maintenance, /무조건|복구 보장|무제한|<br\b|<img\b/)
})

test("maintenance item layout stacks on mobile and permits long content and CTA wrapping", () => {
  const css = read("src/app/pricing/pricing.css")
  assert.match(maintenance, /<dl className="pricing-terms maintenance-items">/)
  assert.match(css, /@media \(max-width: 700px\)[^]*?\.pricing-terms > div \{ grid-template-columns: minmax\(0, 1fr\)/)
  assert.match(css, /\.pricing-maintenance \.maintenance-items dd \{[^}]*overflow-wrap: break-word/)
  assert.match(css, /@media \(max-width: 700px\) \{\s*\.pricing-maintenance \.cta \{[^}]*white-space: normal/)
})


test("pricing leads with homepage production and keeps AI estimates collapsed below terms", () => {
  assert.match(page, /const title = "홈페이지 제작 가격 및 이용 안내"/)
  const description = page.match(/const description = "([^"]+)"/)[1]
  assert.doesNotMatch(description, /AI|자동화/)
  const intro = page.slice(page.indexOf('<section className="room room-entry"'), page.indexOf('<article id="landing"'))
  assert.match(intro, /소규모 사업자를 위한 홈페이지 제작/)
  assert.doesNotMatch(intro, /AI·|자동화/)
  const ai = page.slice(page.indexOf('<section id="ai"'), page.indexOf('<section className="room room-final"'))
  assert.match(ai, /<details className="faq-item"><summary>추가 상담: AI·업무 자동화 견적<\/summary>/)
  assert.doesNotMatch(ai, /<details[^>]*\bopen(?:[\s=>])/)
  assert.match(ai, /stages.map/)
  assert.match(ai, /토큰 사용량을 이유로 추가 청구하지 않습니다/)
  assert.ok(page.indexOf('<section id="terms"') < page.indexOf('<section id="ai"'))
})

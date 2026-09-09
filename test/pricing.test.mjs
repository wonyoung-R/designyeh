import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const page = read("src/app/pricing/page.tsx")
const home = read("src/app/page.tsx")

test("pricing route provides its own canonical and social metadata", () => {
  assert.match(page, /const url = "https:\/\/dsgnyeh.art\/pricing\/"/)
  for (const phrase of ["export const metadata: Metadata", "alternates: { canonical: url }", "openGraph:", "twitter:"]) assert.ok(page.includes(phrase))
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1)
  for (const id of ["landing", "revisions", "reply", "ai", "terms"]) {
    assert.ok(page.includes(`id="${id}"`))
    assert.ok(page.includes(`href="#${id}"`))
  }
})

test("home exposes pricing in both navigation menus, service area and footer", () => {
  assert.match(home, /\["가격 안내", "\/pricing\/"\]/)
  assert.equal((home.match(/NAV_ITEMS.map/g) ?? []).length, 2)
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

test("AI estimates separate human time and usage while pending terms remain visible", () => {
  for (const phrase of ["업무 분석", "PoC · 기술 검증", "구축 · 연동", "운영 · 유지관리", "단계별 단가·최소 비용은 협의", "사람의 실제 투입시간과 에이전트 실행·대기시간을 구분", "공급사의 실제 과금 기준", "초과 실행 전 승인", "토큰 사용량을 이유로 추가 청구하지 않습니다", "아직 확정되지 않았습니다", "취소·환불", "소스 소유권", "데이터·권한·외부 전송", "사전 상담의 무료 여부"]) assert.ok(page.includes(phrase), phrase)
  assert.doesNotMatch(page, /<br\b|무제한 수정|시간당\s*[\d,]+원|\d+일.*납품 보장/)
})

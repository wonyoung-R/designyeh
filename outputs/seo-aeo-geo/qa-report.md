# 로컬 개선 및 QA 결과

2026-09-19. **로컬 수정·검증 완료, 운영 미배포.** 이번 코드 변경은 src 5개 파일, 기존 테스트 3개 파일이다. 기존 지속 관리 SEO 문서도 현 상태에 맞췄다. [전후 화면 비교](before-after/compare.html), [URL 진단표](page-inventory.csv), [검색 필드 diff](before-after/search-fields.diff), [변경 패치](changes.patch)를 제공한다.

## 보존한 것

현재 히어로의 H1, 배경 사진, 로고 5개·작품 7개 원본과 기존 WebP, 색감·Paperlogy 서체·CSS·갤러리 순서·여백 규칙을 유지했다. 홈은 홈페이지 제작 중심 소개다. 가격·수정·유지관리 조건, 메뉴, FAQ native details, skip link, mailto·카카오 목적지, 기존 별칭과 noindex 정책, robots/sitemap/llms를 유지했다. 시작 시 dirty 문서·SQL 정리 변경과 마이그레이션 경로는 건드리지 않았다.

## 실제 변경과 고객 이해

- 홈에 홈페이지 기획·디자인·제작·운영 인계 설명 한 문장을 추가했다. 기존 예술적 헤드라인을 지우지 않았다.
- 홈 작품에서 제작 범위·과정으로 돌아가는 내부 링크를 추가했다. 외부 작품 링크는 각각 그대로다.
- 서비스별 CTA와 준비사항을 맞추고 서비스 간 링크를 연결했다. 문의에는 다른 서비스를 첫머리에 적도록 안내하고 기본 홈페이지 가격·일정과 구분했다. 수신 채널이나 서버 처리는 바꾸지 않았다.
- 자동화 가능성을 판단하는 기준과 익명화된 준비 예시를 직접 답변하는 FAQ를 추가했다. 비AI 대안을 유지하고 무인 운영·성과 약속을 만들지 않았다.

## 기술 검색 개선

홈페이지 서비스의 중복 title·description을 고유한 범위/준비 의도로 수정하고 H1과 맞췄다. 6개 대표 페이지 title·description 고유성, canonical, H1, 언어·viewport·robots 수집을 확인했다. 장소 근거가 없는 ProfessionalService 및 추정 지역/사용 언어 속성을 제거하고 Organization ID·WebSite·Service provider 연결을 유지했다. FAQ의 JSON-LD와 HTML은 동일 데이터로 생성된다. 별도 AI 파일·특수 AI 스키마·가짜 Product/Offer/리뷰는 추가하지 않았다.

## 실행한 검사

| 검사 | 결과 / 근거 |
|---|---|
| 저장소 테스트 | `node --test test/*.test.mjs`: **65/65 통과**, [로그](before-after/tests.log) |
| 린트 | `npm run lint`: 종료 코드 0, 오류 0·경고 3(기존 carousel img 2건, 별도 .claude worktree의 font 1건), [로그](before-after/lint.log) |
| 수정 전·후 프로덕션 export | `npm run build -- --webpack`: 양쪽 통과, [전](before-after/before-build.log) / [후](before-after/after-build.log) |
| 기본 빌드 제한 | Turbopack은 CSS 처리 중 내부 포트 생성 권한 오류. 권한 요청 후에도 실패하여 webpack 사용. CI/운영 워크플로 명령 변경 없음. [실패 로그](before-after/turbopack-build.log) |
| 정적 HTML·내부 링크·schema·브라우저 결과 | `python3 outputs/seo-aeo-geo/validate.py`: **483개 검사 통과**, [상세](before-after/validation.json). 이는 자체 의미/참조 검사이며 전체 schema.org 원격 검증기·Google Rich Results Test 통과를 뜻하지 않음 |
| URL 인벤토리 | **62개 기록**: HTTP 점검 20, 앵커 32, 외부 참조 8, 프로토콜/호스트 변형 2. 외부 참조는 href 보존만 확인 |
| HTTP 및 색인 의도 | 대표 6페이지 200, slashless 경로는 301→200, www→apex 301→200. 각 응답의 X-Robots-Tag는 관찰되지 않음. 없는 경로는 실제 404. HTTP apex 200은 운영 승인 항목 |
| 화면 및 DOM | Chrome **153.0.8010.48**, 각 단계 9경로×1440/768/390/360×높이900 = **36개 조합**. live/before/after 각각 수행. 로컬 전후는 같은 export 서버·폰트 대기·스크롤 로딩·reduced-motion 조건 |
| 화면 저장 | 수정 전 60개, 수정 후 60개 PNG: 대표 페이지 6개×4폭의 첫 화면·전체 화면 및 별칭/404 예외. 라이브 30개 전체 화면. 템플릿 대표와 모바일/태블릿 예외를 육안 확인. 모든 캡처를 독립적 전문가 시각 심사했다는 의미는 아님 |
| 레이아웃·자산 | 모든 36개 조합에서 가로 넘침·깨진 img·pageerror 0. 기존 자산 디코드·치수·외부 URL·폰트·색감 회귀 테스트 통과. 추가 본문으로 세로 위치는 일부 바뀌며 픽셀 동일성을 목표로 하지 않음 |
| no-JS / motion | 단계별 JS 없음 9경로 + motion 기본 JS 있음 9경로. 대표 6개 초기 HTML·DOM의 핵심 제목·내용·링크 유지, 별칭은 fallback 링크 존재. no-JS는 전체 기능 동일성 보장이 아님 |
| 실제 UI 진입 | 390폭에서 대표 6페이지의 Tab→skip link→main, 메뉴→Works 이동/닫힘, 서비스 3개의 FAQ 키보드 열기→문의 CTA→원래 이메일/카카오 노출: **24개 동작 통과** |
| 브라우저 오류 상세 | interaction console error 0. 경로 전환 중 HTML URL의 `net::ERR_ABORTED` 36건 기록, 목적지 이동 검증은 통과. 이미지/폰트/스크립트 URL 실패는 기록되지 않음. 모든 네트워크 요청이 성공했다고 주장하지 않음. [원시 결과](before-after/after/audit.json) |
| diff/문서 관리 | `git diff --check`, `python3 scripts/document_inventory.py` 후 `--check`로 최종 확인 |

초기 HTML은 raw 파일로 보존하고 JavaScript 렌더 결과와 별도로 수집했다. 6개 대표 export 본문은 실제 로컬 응답과 같고, 구조화 데이터의 서비스 정의·FAQ 문답은 HTML 본문과 일치한다. 공통 Organization의 이름·이메일은 공개 홈/문의 본문에 존재한다. 주소·지역 사무실·제휴·새 작업 성과를 추정하지 않았다.

문의 구현 목록: `<form>`, `<input>`, `<textarea>` 없음; name/ID 기반 서버 입력·endpoint/method·CSRF/CAPTCHA·서버 검증·동의 저장·알림 전송·관리 화면은 현재 경로에 없음. `contact-privacy` ID와 연결 3개, encoded SUBJECT/BODY mailto 2개, footer 이메일과 카카오 새 창 링크 유지. 페이지는 외부 서비스에서 메시지를 처리한다고 이미 안내한다. 이를 시험 문의 수신 성공으로 바꾸어 보고하지 않는다.

## 성능 및 관측의 한계

수정 후 로컬 홈을 390×900, 새 브라우저 context, reduced-motion, 무제한 localhost 연결로 3회 측정했다. DCL 17.1/35.2/12.1ms, load 77.9/67.4/63.1ms, FCP 64/40/48ms. 원시값은 after audit의 localPerformance에 있다. 이는 로컬 반복 측정이며 운영 속도·실사용 CWV·SEO 점수가 아니다. 같은 방식의 수정 전 성능 기준선은 수집하지 않아 속도 향상을 주장하지 않는다. 이번 변경은 성능 최적화가 목적이 아니며 자산 압축·스택 변경도 하지 않았다.

실기기 Safari/Android, 화면 낭독기, 모든 브라우저, 실제 메일/채팅 전송·알림 수신은 미검증. 테스트 수신처가 없으므로 외부 문의를 보내지 않았다. Search Console/분석 도구의 허용된 연결이 없어 실제 검색어·노출·클릭·문의 전환 기준선은 미확인이다. 새 추적기를 설치하지 않았다. Google 리치결과 실제 노출·검색 색인·순위·AI 인용 실험은 실행하지 않았다.

| AI 검색 표본 관측 | 엔진 | 시점 | 인용 URL | 답변 정확성 |
|---|---|---|---|---|
| 미실행: 자동화 가능 여부 / 홈페이지 준비사항 등의 질문은 후속 표본 후보 | 미선정 | 미실행 | 관측 없음 | 판정 없음 |

## 승인 대기와 배포 여부

HTTP→HTTPS 호스팅 설정, 기존 별칭의 서버 redirect, 404 robots 정리는 별도 운영/크롤러 정책 승인 항목이다. 사례 상세 확장에 필요한 역할·연도 근거는 [콘텐츠 승인표](content-approval.md)에 남겼다. 이번에 확인된 가격이나 11년 실무 경험을 다시 질문하지 않았다.

**커밋·푸시·배포·DNS/TLS/CDN/WAF·인증·DB·크롤러 정책·외부 문의 전송 없음.** 로컬 구현 완료와 운영 반영·검색 성과는 별도다. 복구는 [rollback.md](rollback.md)를 따른다.

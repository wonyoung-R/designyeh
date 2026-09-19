# 이슈 → 실제 변경 → 검증

2026-09-19. 모든 아래 코드 변경은 로컬 적용, 배포 없음. [최소 코드 패치](changes.patch)와 [전후 화면](before-after/)을 함께 검토한다.

| 이슈 | 변경 파일/블록 | 수정 전 → 실제 변경 | 고객에게 달라진 점 | 검증 |
|---|---|---|---|---|
| F01 | `src/app/page.tsx` hero-copy | 추상 소개 → 홈페이지 기획·디자인·제작·운영 인계 설명 한 문장 | 첫 화면에서 맡길 수 있는 작업 파악 | H1·이미지 보존 테스트, 4폭 화면 |
| F02 | `src/lib/services.ts` homepage-production | 홈과 동일 title/description → 서비스 범위·준비·인계 의도 고유 메타와 H1 | 검색/진입 후 해당 상세의 목적 파악 | 6개 대표 URL title/description 고유성, schema 본문 검사 |
| F03 | `src/components/service-page.tsx` inquiry, final; `src/app/contact/page.tsx` intro | 브랜드·자동화에도 홈페이지 전용 CTA → 서비스별 CTA/준비 안내, 문의에 서비스 첫머리 기재 안내 | 홈페이지 가격을 다른 서비스 가격으로 오해하지 않고 같은 채널로 문의 | 3서비스 렌더 회귀 테스트, mailto 2개·외부 채팅·개인정보 안내 보존 |
| F04 | 홈 WorkCard, 서비스 service-related | 외부 작품 링크만 / 홈페이지 링크만 → 각 작품에 범위·과정 링크, 서비스 간 관련 링크 | 작품 감상 후 작업 범위와 진행 과정으로 이동 | 원래 외부 링크 두 개/작품 그대로, 내부 경로·앵커 검증 |
| F05 | `src/app/layout.tsx` Organization | ProfessionalService 병기·추정 지역/언어 → Organization과 확인 가능한 연락처 | 기계 해석에서 근거 없는 장소/역량 정보 축소 | JSON 파싱, 타입·provider ID·본문 이메일 일치 |
| F06 | `src/lib/services.ts` 자동화 FAQ | 판단 절차가 여러 항목에 흩어짐 → 직접 질문/답변 한 개 | 규칙·예외·연동 조건과 익명화 준비물 파악 | 같은 faq 배열로 HTML/JSON-LD 일치 |

기존 테스트의 승인 방향 중 홈 홈페이지 중심 소개는 유지했다. 새 내부 링크, Organization 단독 타입, 상세 고유 제목, 다른 서비스 문의 안내를 반영하도록 기존 예상값을 갱신했다. 기존 외부 링크·폼 부재·개인정보 안내·가격·자산·메뉴·히어로 회귀 검사는 유지하고 서비스별 문의 문구 렌더 검사를 추가했다.

미적용: O01 HTTPS 강제, O02 서버 리다이렉트, O03 robots 정리는 운영/크롤러 정책 승인 경계다. C01 신규 사례 서술은 독립 역할·연도 근거 부족으로 보류했다. 현존 서비스의 새 가격표, Article, 다운로드, llms 확장은 필요성과 근거가 없어 만들지 않았다.

# designYEH SEO · AEO · GEO 점검

확인일: 2026-09-19. 작업 기준: `a5706de2824b1ee842b15765f8e3027d40c99fc0` + 시작 시 dirty 상태. 상태: 로컬 수정·검증, 운영 미배포. 최종 결과와 한계는 [QA 보고서](qa-report.md), 실제 변경은 [구현표](implementation-map.md), URL별 검색 필드는 [전후 diff](before-after/search-fields.diff)를 참조한다.

## 조사 근거와 실제 구조

- Next.js 16.3.5 App Router, React 19.2, `output: export`, `trailingSlash: true`. GitHub Pages 배포 구성과 `public/CNAME`, canonical·사이트맵이 모두 `https://dsgnyeh.art`를 사용한다.
- 홈·서비스 3개·가격·문의가 공개 대표 페이지다. 소개와 포트폴리오는 200 HTML에서 JavaScript로 홈 앵커에 이동하는 기존 별칭이다. 글·가이드·다운로드·사례 상세·검색·관리자·개인 문의 라우트는 소스/사이트맵/실제 링크에서 발견하지 못했다. 임의 페이지를 생성하지 않았다.
- 홈은 `FALLBACK_WORKS` 정적 데이터로 초기 HTML을 생성한다. Supabase 라이브러리는 남아 있지만 현재 페이지에서 가져오지 않는다. 별도 CMS나 서버 폼 처리로 간주하지 않는다.
- 첫 웹 검색 도구 추출은 과거 H1·사례 설명을 반환했다. 같은 날 실제 Chrome HTTP/DOM은 현재 소스와 같은 `당신이 쌓아온 일에, 필요한 다음을 만듭니다.`를 반환했다. 실제 화면과 저장한 raw HTML을 이번 판단의 기준으로 사용했다. 사용자 지시문의 `This must be the studio.`도 현재 DOM이 아니다.
- 과거 테스트에는 홈페이지 제작 중심 소개가 승인 방향으로 명시되어 있다. 홈 제목·히어로·서비스 3단계·갤러리 순서를 유지했다. 브랜드·자동화 상세는 실제 존재하며 서비스 선택/범위 설명만 보완했다.

## 수정 선별

| ID | URL/영역 | 문제 증거 | 처리 | 우선순위 | 위험 | 검증 |
|---|---|---|---|---|---|---|
| F01 | `/` 첫 화면 | 시적인 H1과 설명에 구체적 제작 과정이 없고 가격 줄에서 홈페이지 제공을 유추 | 즉시 수정 | P1 | 낮음: 본문 한 문장으로 높이 변화 | 4개 폭 전후 화면, H1 보존 |
| F02 | `/homepage-production/` | 홈과 title·description 완전 동일 | 즉시 수정 | P1 | 낮음: 검색 스니펫 재평가 가능 | 고유 메타, H1·본문·JSON-LD 검사 |
| F03 | 브랜드·자동화 상세, 문의 | 모든 상세 CTA/준비 문구가 홈페이지 전용, 문의에 다른 서비스 안내 없음 | 즉시 수정 | P1 | 낮음: 같은 연락 채널 유지 | 서비스별 렌더 테스트, 링크·메일 인코딩 보존 |
| F04 | 홈 사례·서비스 하단 | 사례는 외부 링크만, 브랜드 상세로의 내부 진입이 없음 | 즉시 수정 | P2 | 낮음: 작은 텍스트 링크 추가 | 기존 외부 URL 2개/사례 보존, 새 내부 목적지 검사 |
| F05 | 전체 JSON-LD | 주소 근거 없이 LocalBusiness 하위의 폐기된 ProfessionalService 병기, 한국 서비스 지역·영어 사용 능력 근거 없음 | 즉시 수정 | P2 | 낮음: Organization·동일 ID 유지 | 허용 타입·연락처 본문 일치, provider 참조 검사 |
| F06 | 자동화 FAQ | AI 사용 여부 답변은 있으나 가능성 판단을 직접 묻는 답변 없음 | 즉시 수정 | P1 | 낮음: 기존 진단·범위 내용을 답변으로 정리 | 질문·답변과 JSON-LD 동일 데이터 |
| O01 | `http://dsgnyeh.art/` | HEAD 200, HTTPS redirect 없음 | 운영 승인 필요 | P2 | 중간: 호스팅 HTTPS 강제 설정 | 저장된 헤더. 변경 후 HTTP→HTTPS·인증서·기존 링크 재검증 필요 |
| O02 | `/about/`, `/portfolio/` | HTTP 200 뒤 JS 이동, no-JS는 제목·목적지 링크 | 유지 / 서버 redirect 전환은 운영 승인 필요 | P2 | 중간: Pages 라우팅 변경 | JS 이동·no-JS fallback 모두 확인 |
| O03 | `/404.html` | 직접 요청 200, robots에 noindex와 상속 index 공존; 없는 경로는 실제 404 | 운영 승인 필요 | P2 | 낮음~중간: robots 정책 경계 | noindex 존재, 없는 경로 404 기록. 실제 색인 여부 미확인 |
| C01 | 작품 7개 | 소스와 기존 테스트는 범위 보존 근거이나 모든 역할·연도를 독립 검증하는 원자료 아님 | 콘텐츠 확인 후 수정 | P2 | 중간: 고객관계·역할 오인 가능 | 현재 메타/이미지/연도 그대로, 승인표에 세부 근거 격차 기록 |
| M01 | 가격·운영 조건 | 2026-09-17 승인 정책과 현재 가격 문구 존재 | 유지 | — | 변경 불필요 | 기존 가격 테스트 전체 통과 |
| M02 | robots·sitemap·llms.txt | 공개 6개 URL, wildcard allow, 기존 llms 존재 | 유지 | — | 크롤러 정책은 승인 대상 | 원문 전후 동일 검사 |

P0에 해당하는 접근 불가·문의 전송 장애·개인정보 노출·대표 페이지 색인 차단은 이번 범위에서 재현되지 않았다. 검색 색인 상태를 확인했다는 의미는 아니다. URL·목적·행동·상태·title/H1/canonical 등 전체 진단표는 [page-inventory.csv](page-inventory.csv)에 저장했다.

## 공식 자료 재확인

- Google은 AI 검색에도 기본 SEO, 읽을 수 있는 텍스트, 내부 링크, 본문과 구조화 데이터의 일치를 요구하며 별도 AI 파일/특수 스키마를 요구하지 않는다. [Google AI 기능](https://developers.google.com/search/docs/appearance/ai-features), [SEO 시작 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- 본문에 없는 사실·후기·가격 스키마를 만들지 않는다. 문법 유효성, 지원되는 리치결과, 실제 노출은 별도다. [구조화 데이터 정책](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- OAI-SearchBot은 검색용, GPTBot은 모델 학습에 쓰일 수 있는 수집용이다. 두 정책은 독립적이다. 이번에 어느 쪽도 변경하지 않았다. OpenAI Docs 스킬로 [공식 크롤러 문서](https://developers.openai.com/api/docs/bots)를 확인했다. `platform.openai.com/docs/bots`는 이 주소로 이동했다.
- ProfessionalService는 LocalBusiness/Place 계열이며 일반 타입은 폐기되었다. 장소를 확인하지 못한 현재 구조에서는 Organization을 선택했다. [Schema.org ProfessionalService](https://schema.org/ProfessionalService).

자료 확인일은 위 날짜이며 외부 문서의 수정일이나 검색 반영 시점을 뜻하지 않는다. SEO·AEO·GEO를 지역 SEO나 AI 인용 보장으로 해석하지 않는다.

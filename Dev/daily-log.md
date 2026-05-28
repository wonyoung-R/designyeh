# designYEH 작업 로그

## 2026-05-27 — 작품 철학 + 도메인 + 작품벽 갱신 + CSS·schema 함정 다수

### 작품 철학 4지점 박음 ("나는 홈페이지 하나하나를 작품으로 생각한다")
- [x] ROOM 01 Hero 신조(`.es-creed`) 영문 italic + 국문, border-top 인용 (Hero 살리고 그 아래)
- [x] ROOM 02 작가 노트 6→7개, italic serif + curly quote (lbl-note + lbl-note-mark)
- [x] ROOM 03 INTERLUDE → **CREED** 명칭 교체, 모토 "DESIGN WELL…" 폐기, 대형 helvetica 4줄 `EVERY/HOMEPAGE/is a work/OF ART.` + border-left 인용 한글 선언 + mono cite
- [x] ROOM 04 STUDIO 1인칭 서사 3단락 + italic serif 코다 "그 결을 빚는 것이 designYEH의 일입니다" + 영/한 CTA "당신의 브랜드도 작품이 될 수 있습니다."

### 작품벽 7개로 갱신 (사장 결정)
- [x] **MyBDR 폐기**, **LAF2023 (laf2023.com) 추가**, **GRIT LAB (grit-lab.kr) 추가**, HoopNote 유지
- [x] 두 신규 사이트 playwright 캡처(1440×900) → `public/works/{laf2023,gritlab}.png`
- [x] 작가 노트 작성:
  - LAF2023: "잃은 것과 찾은 것 사이의 'and'. 화면도 그 공백을 채우지 않고 그대로 두었다."
  - GRIT LAB: "코트가 잠기면 사람이 자란다. 'BE LOCKED IN' — 한 시간의 약속이 곧 디자인이었다."
- [x] **stale-schema 가드** 추가: Supabase 옛 row에 `mybdr` URL 감지 시 setWorks 호출 안 함 → fallback 7개 유지

### dsgnyeh.art 커스텀 도메인 운영 시작
- [x] 사장 가비아에서 DNS 세팅 (A 레코드 4개 → 185.199.108-111.153, GH Pages IP)
- [x] GH Pages 설정에 cname=dsgnyeh.art 등록, https_certificate=approved
- [x] `public/CNAME` 파일 추가 (push 시 GH Pages CNAME 자동 유지)
- [x] `next.config.ts` basePath 자동 분기: `public/CNAME` 존재 시 `''` (root) / VERCEL=1 시 `''` / default `/designyeh`
- [x] 계산된 basePath를 `env: { NEXT_PUBLIC_BASE_PATH: basePath }`로 client 베이크인 (asset() 헬퍼 동기)

### Contact 페이지 단순화
- [x] 폼 폐기 → 이메일 안내 페이지로 변경 (Make.com 시나리오 의존 제거)
- [x] 이메일 `creativebyyeh@gmail.com` (mailto, 제목·본문 한글 템플릿 자동 채움)
- [x] 카카오 오픈채팅 버튼 `https://open.kakao.com/me/designyeh` (카카오 옐로우 #FEE500, **아이디 grizz 비공개**, URL의 designyeh slug만 노출)

### CSS specificity fix (`:where()`)
- [x] 증상: contact-submit 버튼 검정 배경+검정 텍스트로 보임 ("그냥 까맣게 보임")
- [x] 원인: `body.gallery a { color: inherit }` (specificity 0,1,1) > `.contact-submit { color: cream }` (0,1,0) → 흰 텍스트가 inherit으로 덮임
- [x] fix: `:where(body.gallery) a { ... }` — `:where()`가 specificity를 0으로 깎음 → 클래스 명시 color 모두 자동으로 이김. 미래의 button-style `<a class="...">` 추가에도 안전

### GH Pages source legacy↔workflow 함정 2회
- [x] 1회차: 사장이 "리드미 페이지" 노출 보고 → Jekyll v3.10.0이 README 처리한 옛 화면. `gh api PUT pages -f build_type=workflow` + workflow_dispatch로 복구
- [x] 2회차: 작품 철학 push 후 라이브 검증 시 동일 현상 재발 → 같은 명령으로 1분 복구
- [x] 향후 또 발생 가능 — 복구 명령 메모리에 보존

### 부가 fix
- [x] Supabase row에 note 컬럼 없어도 작가 노트 표시: `FALLBACK_NOTE_BY_URL` 맵 + `toWork()` URL 매칭으로 자동 공급, `normalizeUrl()` 로 https/www/trailing-slash 차이 무시
- [x] supabase_schema.sql 동기화 (사장 SQL editor 재실행 권장, 미실행 시 stale-schema 가드 동작)
- [x] 검증 산출물 정리 + `.gitignore`에 `verify-*` / `.playwright-mcp/` 패턴 추가

### 이번 세션 누적 커밋
| commit | 내용 |
|--------|------|
| `6535cfb` | 작품 철학 4지점 박음 |
| `b46cc91` | Supabase note 없어도 fallback 노트 |
| `64f4dfc` | 검증 산출물 제거 + gitignore |
| `303d404` | dsgnyeh.art 커스텀 도메인 지원 |
| `8cc9959` | contact-submit :where() specificity |
| `27c4c8f` | MyBDR 제거 + LAF2023 + GRIT LAB |
| `49af900` | stale-schema 가드 |

### 라이브 검증 결과
- **메인**: https://dsgnyeh.art/ — 7개 작품 + 작가 노트 + 신조 + CREED + Artist's Note + CTA 모두 정상, mybdr 잔재 0
- **redirect**: wonyoung-r.github.io/designyeh/ → 301 → dsgnyeh.art (자동)
- playwright 데스크탑(1440) + 모바일(iPhone 15 393) 검증 통과

### 잔여
- [ ] Supabase `portfolios` 테이블 SQL editor 재실행 (note 컬럼 + 7개 seed 동기) — 사장 작업, 안 해도 stale-schema 가드로 라이브 정확
- [ ] (선택) 옛 Vercel 계정 GitHub Installations에서 designyeh repo access 제외 — 사장 작업
- [ ] (선택) ROOM 04 로고 부활 — 6개 로고 자료 받으면

---

## 2026-05-24 — 갤러리 포트폴리오 전면 개편 완성

### 배경
- DB 마이그레이션 중 옛 Supabase(`ssdwgzhtzbxgxezkomqz`) 데이터 폐기
- 기존 홈은 "IT SaaS 업체" 느낌이라 디자인 에이전시 아이덴티티에 안 맞음
- 6개 사이트(designluka·dcarecenter·mavs·sdngazer·mybdr·hoopnote) 소개 포트폴리오 필요
- Claude Design 핸드오프(미술관 컨셉) 기반 구현

### 완료
- [x] 신규 Supabase 프로젝트 `stmutjrmoylbmnnxxgfh` 연결 + 새 스키마(`portfolios`: title/meta/year/url/image/tech/category/sort_order) + 6행 seed
- [x] 단일 스크롤 미술관 홈 (ROOM 01 입구 → 02 작품벽 → 03 비닐 문구 → 04 스튜디오)
- [x] 살롱식 액자벽(walnut/thin) + 실제 사이트 스크린샷 6장(playwright 캡처, `public/works/*.png`) + 미술관 라벨
- [x] Wax Seal 플로팅 연락 버튼(DY 모노그램, 밀랍 봉인) → `/contact`
- [x] 연락 페이지 갤러리 무드 재작성 + Make.com 웹훅 직접 POST(정적 export 대응)
- [x] 폰트: Instrument Serif + Pretendard + JetBrains Mono
- [x] 데이터 기반(DB INSERT 시 액자 자동 생성 — `frameLayout(index)` 슬롯 배정)
- [x] 옛/새 Supabase 스키마 모두 견디는 fallback fetch
- [x] basePath 환경 분기 — `VERCEL=1` → `''`(root) / 기본 → `'/designyeh'`(GH Pages 서브경로)
- [x] `asset()` 헬퍼 — next/image `unoptimized:true`가 basePath 미적용 회피
- [x] `next/link` + `useRouter` — 내부 nav basePath 자동
- [x] `trailingSlash: true` — GH Pages 라우팅 안정
- [x] `/about`·`/portfolio` → 홈 hash로 리다이렉트
- [x] `/api/contact` 라우트 제거(정적 export 비호환)
- [x] 모바일 iPhone 15(393×852) 가로 오버플로 0 검증
- [x] 이메일 grizrider@gmail.com 으로 전면 교체
- [x] GH Pages Pages source `legacy`(Jekyll)→`workflow` 전환
- [x] main 7커밋 push: 636237e → 58244e6 → cad7f36 → 0c3841a → 46e3d09 → d55ad30 → 5b06ea9

### 라이브
- **메인**: https://wonyoung-r.github.io/designyeh/ (GH Pages, 정상 동작)
- **Vercel design-yeh.vercel.app**: 옛 다른 Vercel 계정 소유 → 사장 token 접근 불가, 빌드 6연속 실패, 13시간 옛 캐시. 옛 가입 이메일 못 찾음 → **무시 결정**

### 잔여
- [ ] 도메인 연결 (designyeh.kr 등 있으면 `public/CNAME` + DNS A 레코드)
- [ ] Make.com 시나리오 — 폼 → grizrider@gmail.com 메일 발송 + 010-8569-7271 SMS 알림 (사장 Make 대시보드 작업)
- [ ] ROOM 04 로고 부활 (6개 사이트 로고 자료 받으면)
- [ ] (선택) GitHub Settings→Installations→Vercel에서 designyeh repo 제외 — 옛 계정 빌드 시도 알림 차단

### 핵심 함정 메모
- **next/image with `unoptimized:true`는 basePath를 src에 안 붙임** → plain `<img>` + `asset()` 헬퍼 필수
- **configure-pages의 `static_site_generator:next`는 assetPrefix만 설정** → basePath를 못 처리. next.config로 single source
- **GH Pages 기본 source가 `legacy`(Jekyll)** → 우리 Actions 결과 매번 덮어씀. `gh api -X PUT pages -f build_type=workflow` 전환 필수
- **로컬 빌드 시 홈디렉토리(`/Users/grizrider/package.json`)의 떠돌이 lockfile이 Turbopack workspace 루트 오인** → 형제 mybdr의 `src/proxy.ts` 끌어들임. `turbopack: { root: process.cwd() }`로 고정 (Vercel CI엔 미적용)

### 파일 구조
```
src/app/
  page.tsx           # 갤러리 홈 (use client, Supabase fetch + fallback)
  contact/page.tsx   # Make.com 웹훅 직접 POST
  about/page.tsx     # 홈 #room-05 리다이렉트
  portfolio/page.tsx # 홈 #room-02 리다이렉트
  gallery.css        # 핸드오프 styles.css 이식 + 모바일 보강
  globals.css        # tailwind + @import "./gallery.css"
  layout.tsx         # 폰트 link + body.gallery
src/lib/
  works.ts           # Work 타입 + FALLBACK_WORKS 6개 + frameLayout 슬롯
  assets.ts          # asset() basePath prefix 헬퍼
  supabase.ts        # createClient
src/components/
  fab-wax.tsx        # Wax Seal FAB → /contact
public/works/        # 6 사이트 .png (3.6MB)
next.config.ts       # basePath/assetPrefix 환경 분기 + env 베이크
supabase_schema.sql  # drop+recreate, 6 seed
```

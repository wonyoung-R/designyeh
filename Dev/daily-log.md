# designYEH 작업 로그

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

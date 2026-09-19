# 로컬 변경 복구와 운영 경계

2026-09-19. 배포·커밋·푸시·DB 작업 없음. 시작 HEAD는 `a5706de2824b1ee842b15765f8e3027d40c99fc0`.

시작 시 `.gitignore`, `README.md`, 루트 `supabase_schema.sql` 삭제와 `.claude/`, `AGENTS.md`, `CLAUDE.md`, `docs/document-management.md`, `docs/index.md`, `scripts/`, `supabase/` 신규 파일이 있었다. [시작 상태](before-after/pre-existing-status.txt)와 [시작 tracked diff](before-after/pre-existing.patch)를 저장했다. 이 작업은 이 변경·마이그레이션 위치를 수정하지 않았다. untracked 파일 전체의 백업이 있다는 뜻은 아니다.

`changes.patch`는 이번에 바꾼 src/test/기존 SEO 문서만 포함한다. 복구 시 먼저 `git apply --reverse --check outputs/seo-aeo-geo/changes.patch`로 현재 파일과 맞는지 확인한다. 성공하면 같은 명령에서 `--check`를 빼 이번 변경만 되돌릴 수 있다. 이후 다른 편집이 있다면 실패 원인을 검토하고 해당 블록만 수동 복구한다. 전체 `git reset`, `git checkout .`, `git clean`을 사용하지 않는다.

작업 근거는 `outputs/seo-aeo-geo/` 한 폴더에 있다. 문서 목록 `docs/index.md`는 시작부터 untracked였으며 프로젝트 지침에 따라 갱신했다. 복구 후에도 `python3 scripts/document_inventory.py`와 `--check`를 실행해 실제 목록에 맞춘다. 산출물 폴더를 지워도 사이트 런타임에는 영향을 주지 않지만 검증 근거가 사라진다.

로컬 정적 서버는 `out/`만 제공했다. 이번 터미널 세션의 서버만 종료한다. `.next/`와 `out/`는 생성물이며 배포한 것이 아니다. 재빌드 시 `npm run build -- --webpack`을 사용해 이번 환경의 Turbopack 포트 제한과 구분할 수 있다. 운영 워크플로의 빌드 명령은 수정하지 않았다.

운영 승인 후 별도 실행할 일: 최종 diff 재검토, 커밋/푸시/배포, 운영 URL·메일 링크·색인 의도 재점검. HTTP→HTTPS 강제 설정, 서버 리다이렉트, robots/WAF, 개인정보·인증·외부 테스트 전송·추적기·유료 서비스는 각각 승인 범위 확인이 필요하다. 승인 요청을 이유로 이번 로컬 개선을 보류하지 않았다.

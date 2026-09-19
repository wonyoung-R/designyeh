"""Build the URL diagnostic inventory from observed responses, links and routes."""
import csv,json
from pathlib import Path
from urllib.parse import urljoin,urlsplit
ROOT=Path(__file__).resolve().parent
ORIGIN='https://dsgnyeh.art'
live=json.loads((ROOT/'before-after/live/audit.json').read_text())
after=json.loads((ROOT/'before-after/after/audit.json').read_text())
meta={r['route']:r for r in live['modes'] if not r['javascript']}
new={r['route']:r for r in after['modes'] if not r['javascript']}
intent={
 '/':('무엇을 맡길 수 있나?','사례·제작 범위·문의','F01/F04: 추상 첫 화면·외부 사례 링크만','즉시 수정','P1'),
 '/homepage-production/':('어디까지 제작하고 무엇을 준비하나?','범위·과정·FAQ→문의','F02: 홈과 title/description 중복','즉시 수정','P1'),
 '/brand-identity/':('로고·웹을 함께 의뢰할 수 있나?','관련 작업·FAQ→브랜드 상담','F03/F04: 홈페이지 전용 CTA·내부 진입 부족','즉시 수정','P1'),
 '/operations-automation/':('자동화 가능 업무와 비AI 대안은?','판단 기준·준비→자동화 상담','F03/F06: 홈페이지 CTA·판단 질문 부재','즉시 수정','P1'),
 '/pricing/':('비용·수정·유지관리 조건은?','승인 조건 확인→문의','M01: 최신 저장소 승인 가격 근거','유지','—'),
 '/contact/':('무엇을 보내고 어디로 연락하나?','기존 이메일·카카오','F03: 다른 서비스 상담 준비 안내 없음','즉시 수정','P1'),
 '/about/':('스튜디오는 어떻게 일하나?','/#approach','O02: JS redirect stub; no-JS fallback','유지','P2'),
 '/portfolio/':('작업 사례는?','/#works','O02: JS redirect stub; no-JS fallback','유지','P2'),
 '/404.html':('없는 주소에서 어디로 가나?','/','O03: 직접 200; noindex/index 혼재','운영 승인 필요','P2'),
}
rows=[]
for r in live['http']:
 path=r['route']; m=meta.get(path,{}); a=new.get(path,{})
 canonical=path in list(intent)[:6]
 resource=path in ['/robots.txt','/sitemap.xml','/llms.txt']
 alias=path not in intent and not resource and path!='/audit-missing-page/'
 q,action,issue,decision,priority=intent.get(path,('리소스 확인' if resource else '주소 정규화 확인','대표 URL 사용','정책 유지' if resource else '301 한 번 후 slash URL' if alias else '없는 경로 실제 404','유지','—'))
 source='src/app/'+('page.tsx' if path=='/' else 'not-found.tsx' if path=='/404.html' else path.strip('/')+'/page.tsx') if path in intent else 'public'+path if resource else '운영 주소 변형 점검'
 rows.append(dict(URL=ORIGIN+path,종류='대표 페이지' if canonical else '리소스' if resource else 'JS 별칭' if path in ['/about/','/portfolio/'] else 'HTTP 별칭' if alias else '오류 경로',소스=source,방문목적=q,핵심행동=action,운영상태=('301→200 (별도 HEAD 확인)' if alias else r.get('status','미확인')),색인의도='index' if canonical else 'noindex' if path in ['/about/','/portfolio/','/404.html'] else '대표 URL 통합' if alias else '페이지 아님',확인상태='HTTP + 초기 HTML/DOM + 4폭 시각' if path in meta else 'HTTP 확인',title=m.get('title',''),H1=' / '.join(m.get('h1',[])),canonical=m.get('canonical',''),로컬수정후title=a.get('title',''),문제증거=issue,처리=decision,우선순위=priority,변경위험='낮음' if decision=='즉시 수정' else '운영 설정 변경 시 중간' if decision=='운영 승인 필요' else '없음',테스트='before-after/*/audit.json; validation.json; live/redirect-headers.json'))
anchors={}
externals={}
for r in live['screens']:
 if r['width']!=1440:continue
 for link in r['links']:
  href=link['href']; u=urlsplit(urljoin(ORIGIN+r['route'],href))
  if u.netloc=='dsgnyeh.art' and u.fragment:anchors.setdefault(u.path+'#'+u.fragment,set()).add(r['route'])
  elif u.scheme in ['http','https'] and u.netloc!='dsgnyeh.art':externals.setdefault(href,set()).add(r['route'])
for id in meta['/']['ids']:
 if id.startswith('work-') and not id.startswith('work-title-'):anchors.setdefault('/#'+id,set()).add('src/app/page.tsx WorkCard')
for path,sources in sorted(anchors.items()):
 base=path.split('#')[0];m=meta.get(base,{})
 rows.append(dict(URL=ORIGIN+path,종류='앵커',소스='; '.join(sorted(sources)),방문목적='페이지 내 정보/작품 탐색',핵심행동='해당 섹션 읽기',운영상태='부모 문서 200',색인의도='독립 URL 아님',확인상태='DOM id 및 내부 링크 검사',title=m.get('title',''),H1=' / '.join(m.get('h1',[])),canonical=m.get('canonical',''),처리='유지',우선순위='—',테스트='validation.json'))
for url,sources in sorted(externals.items()):
 rows.append(dict(URL=url,종류='외부 참조/연락',소스='; '.join(sorted(sources)),방문목적='기존 작업 감상 또는 문의',핵심행동='외부 서비스 열기',운영상태='외부 목적지 자체 미검증',색인의도='이 사이트의 대표 경로 아님',확인상태='href만 확인; 실제 전송 없음',처리='유지',우선순위='—',테스트='기존 URL 보존 테스트'))
for url,status,issue in [('http://dsgnyeh.art/','HEAD 200','O01: HTTPS 강제 전환 없음'),('https://www.dsgnyeh.art/','HEAD 301→200','apex 대표 호스트로 단일 이동')]:
 rows.append(dict(URL=url,종류='호스트/프로토콜 변형',소스='CNAME 및 canonical 호스트 검증',방문목적='공식 홈 접근',핵심행동='HTTPS apex 홈',운영상태=status,색인의도='대표 URL 통합',확인상태='HEAD 응답 확인',문제증거=issue,처리='운영 승인 필요' if url.startswith('http:') else '유지',우선순위='P2',테스트='live/redirect-headers.json'))
fields=['URL','종류','소스','방문목적','핵심행동','운영상태','색인의도','확인상태','title','H1','canonical','로컬수정후title','문제증거','처리','우선순위','변경위험','테스트']
with (ROOT/'page-inventory.csv').open('w',newline='',encoding='utf-8-sig') as f:
 writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader();writer.writerows(rows)
print(f'{len(rows)} URL records; {len(anchors)} anchors; {len(externals)} external references')

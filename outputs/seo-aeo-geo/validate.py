"""Validate exported HTML and write source/DOM evidence without network access."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, difflib, csv
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]
ORIGIN='https://dsgnyeh.art'
class Document(HTMLParser):
 def __init__(self, source):
  super().__init__(); self.tags=[]; self.text=[]; self.scripts=[]; self.script=None; self.skip=0; self.feed(source)
 def handle_starttag(self, tag, attrs):
  attrs=dict(attrs); self.tags.append((tag,attrs))
  if tag=='script': self.skip+=1; self.script='' if attrs.get('type')=='application/ld+json' else None
  if tag=='style': self.skip+=1
 def handle_endtag(self,tag):
  if tag=='script':
   if self.script is not None: self.scripts.append(json.loads(self.script))
   self.script=None; self.skip-=1
  if tag=='style': self.skip-=1
 def handle_data(self,s):
  if self.script is not None:self.script+=s
  if not self.skip:self.text.append(s)
 @property
 def content(self):return ' '.join(' '.join(self.text).split())
 @property
 def ids(self):return [a['id'] for _,a in self.tags if 'id' in a]

routes=['/','/homepage-production/','/brand-identity/','/operations-automation/','/pricing/','/contact/','/about/','/portfolio/','/404.html']
docs={r:Document((REPO/'out'/('index.html' if r=='/' else r.strip('/') if r.endswith('.html') else r.strip('/')+'/index.html')).read_text()) for r in routes}
checks=[]
def check(condition,label):
 checks.append({'check':label,'passed':bool(condition)})

for route,doc in docs.items():
 check(len(doc.ids)==len(set(doc.ids)),f'{route}: unique ids')
 check(sum(t=='h1' for t,a in doc.tags)==1,f'{route}: one h1')
 for tag,attrs in doc.tags:
  if tag=='img':check('alt' in attrs and 'width' in attrs and 'height' in attrs,f'{route}: image attributes {attrs.get("src")}')
  if tag!='a' or 'href' not in attrs:continue
  url=urlsplit(attrs['href'])
  if url.scheme not in ['', 'http','https'] or (url.netloc and url.netloc!='dsgnyeh.art'):continue
  path=url.path or route
  check(path in docs,f'{route}: internal destination {attrs["href"]}')
  if url.fragment and path in docs:check(unquote(url.fragment) in docs[path].ids,f'{route}: fragment {attrs["href"]}')
 nodes=[n for s in doc.scripts for n in s.get('@graph',[s])]
 for node in nodes:
  kind=node['@type']
  check(kind not in ['ProfessionalService','LocalBusiness','Product','Offer','Review'],f'{route}: factual schema type {kind}')
  if kind=='Organization':check(node['email'] in docs['/contact/'].content and node['name'] in docs['/'].content,f'{route}: shared organization matches public home/contact')
  if kind=='Service':
   check(node['description'] in doc.content,f'{route}: service definition visible')
   check(node['provider']['@id']==ORIGIN+'/#agency',f'{route}: provider reference')
  if kind=='FAQPage':
   for q in node['mainEntity']:
    check(q['name'] in doc.content and q['acceptedAnswer']['text'] in doc.content,f'{route}: FAQ matches HTML: {q["name"]}')
  if kind=='BreadcrumbList':
   check(node['itemListElement'][-1]['item']==ORIGIN+route,f'{route}: breadcrumb destination')
  if kind=='WebPage':check(node['url']==ORIGIN+route,f'{route}: schema URL')

sitemap=[e.text for e in ET.parse(REPO/'public/sitemap.xml').getroot() for e in e]
check(set(sitemap)=={ORIGIN+r for r in routes[:6]},'sitemap equals six canonical marketing pages')
before=json.loads((ROOT/'before-after/before/audit.json').read_text())
after=json.loads((ROOT/'before-after/after/audit.json').read_text())
for mode in after['modes']:
 if mode['route'] in routes[:6]:
  check(mode['forms']==0,f'{mode["route"]}: external inquiry only JS={mode["javascript"]}')
  check(len(mode['h1'])==1 and len(mode['text'])>100,f'{mode["route"]}: content JS={mode["javascript"]}')
for row in after['screens']:
 check(not row['overflow'] and not row['brokenImages'],f'{row["route"]} {row["width"]}: geometry/images')
 if 'keyboardMenuOpen' in row:check(row['keyboardMenuOpen'] and row['focusOutline']!='none',f'{row["route"]}: keyboard menu/focus')
check(not after['errors'],'no browser page errors')
for action in after.get('interaction',{}).get('actions',[]):
 check(action['passed'],f'{action["route"]}: {action["check"]}')
check(not after['interaction']['consoleErrors'],'no console errors during interactions')
check(all(r['failure']=='net::ERR_ABORTED' for r in after['interaction']['failedRequests']),'interaction request failures limited to navigation aborts (retained in audit)')
titles=[r['title'] for r in after['screens'] if r['width']==1440 and r['route'] in routes[:6]]
descs=[r['description'] for r in after['screens'] if r['width']==1440 and r['route'] in routes[:6]]
check(len(set(titles))==6,'six unique titles')
check(len(set(descs))==6,'six unique descriptions')
for route in routes:
 stem=(route.strip('/') or 'home').replace('/','_')
 b=Document((ROOT/f'before-after/before/{stem}.raw').read_text())
 if route in routes[:6]:check(docs[route].content==Document((ROOT/f'before-after/after/{stem}.raw').read_text()).content,f'{route}: export matches served initial HTML')
for resource in ['robots.txt','sitemap.xml','llms.txt']:
 check((ROOT/f'before-after/before/{resource}.raw').read_text()==(ROOT/f'before-after/after/{resource}.raw').read_text(),f'{resource}: policy/resource preserved')
fields=['route','title','description','canonical','robots','h1','headings','jsonld','links','text']
def summary(data):return [{k:r.get(k) for k in fields} for r in data['screens'] if r['width']==1440]
delta=''.join(difflib.unified_diff(json.dumps(summary(before),ensure_ascii=False,indent=2).splitlines(True),json.dumps(summary(after),ensure_ascii=False,indent=2).splitlines(True),fromfile='before',tofile='after'))
(ROOT/'before-after/search-fields.diff').write_text(delta)
(ROOT/'before-after/validation.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print(json.dumps({'checks':len(checks),'failed':[x for x in checks if not x['passed']]},ensure_ascii=False))
if not all(x['passed'] for x in checks):raise SystemExit(1)

"""Read-only browser audit. Never clicks mail/chat or submits external data.
Usage: python capture.py before|after|live [origin]
Requires the existing Playwright Python environment and installed Chrome.
"""
import asyncio, json, sys, re
from pathlib import Path
from datetime import datetime, timezone
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
PHASE = sys.argv[1]
ORIGIN = sys.argv[2] if len(sys.argv) > 2 else 'http://127.0.0.1:8876'
DEST = ROOT / 'before-after' / PHASE
DEST.mkdir(parents=True, exist_ok=True)
ROUTES = ['/', '/homepage-production/', '/brand-identity/', '/operations-automation/', '/pricing/', '/contact/', '/about/', '/portfolio/', '/404.html']
FIELDS = r'''() => ({title:document.title, description:document.querySelector('meta[name="description"]')?.content,
 canonical:document.querySelector('link[rel="canonical"]')?.href, robots:[...document.querySelectorAll('meta[name="robots"],meta[name="googlebot"]')].map(x=>x.content),
 lang:document.documentElement.lang, viewport:document.querySelector('meta[name="viewport"]')?.content,
 h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),
 headings:[...document.querySelectorAll('h2,h3')].map(x=>x.textContent.trim()),
 text:document.body.innerText, links:[...document.querySelectorAll('a[href]')].map(x=>({label:x.textContent.trim(),href:x.getAttribute('href')})),
 ids:[...document.querySelectorAll('[id]')].map(x=>x.id),
 jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)),
 overflow:document.documentElement.scrollWidth>innerWidth,
 brokenImages:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.currentSrc),
 forms:document.querySelectorAll('form,input,textarea').length})'''

async def main():
 async with async_playwright() as p:
  browser = await p.chromium.launch(channel='chrome', headless=True)
  result={'phase':PHASE,'origin':ORIGIN,'timestamp':datetime.now(timezone.utc).isoformat(),'browser':browser.version,'http':[], 'screens':[], 'modes':[]}
  ctx=await browser.new_context(viewport={'width':1440,'height':900}, reduced_motion='reduce')
  page=await ctx.new_page()
  errors=[]
  page.on('pageerror',lambda e: errors.append(str(e)))
  # Raw responses and no-JS DOM are kept separately from rendered navigation.
  for route in ROUTES + ['/robots.txt','/sitemap.xml','/llms.txt','/homepage-production','/brand-identity','/operations-automation','/pricing','/contact','/about','/portfolio','/audit-missing-page/']:
   try:
    r=await ctx.request.get(ORIGIN+route)
    body=await r.text()
    row={'route':route,'status':r.status,'finalUrl':r.url,'xRobotsTag':r.headers.get('x-robots-tag'),'contentType':r.headers.get('content-type')}
    result['http'].append(row)
    if route in ROUTES or route in ['/robots.txt','/sitemap.xml','/llms.txt']:
     (DEST/((route.strip('/') or 'home').replace('/','_')+'.raw')).write_text(body)
   except Exception as e: result['http'].append({'route':route,'error':str(e)})
  for route in ROUTES:
   for width in [1440,768,390,360]:
    await page.set_viewport_size({'width':width,'height':900})
    response=await page.goto(ORIGIN+route,wait_until='networkidle')
    await page.evaluate('document.fonts.ready')
    await page.evaluate('async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}scrollTo(0,0)}')
    await page.wait_for_timeout(150)
    fields=await page.evaluate(FIELDS)
    fields.update(route=route,width=width,status=response.status,url=page.url)
    result['screens'].append(fields)
    if route in ROUTES[:6] or width in [1440,360]:
     await page.screenshot(path=str(DEST/f'{route.strip("/") or "home"}-{width}-viewport.png'))
     await page.screenshot(path=str(DEST/f'{route.strip("/") or "home"}-{width}.png'),full_page=True)
    if width==360 and await page.locator('.nav-mobile summary').count():
     await page.locator('.nav-mobile summary').focus()
     await page.keyboard.press('Enter')
     fields['keyboardMenuOpen']=await page.locator('.nav-mobile').get_attribute('open') is not None
     fields['focusOutline']=await page.locator('.nav-mobile summary').evaluate('e=>getComputedStyle(e).outlineStyle')
  for javascript in [False,True]:
   mode=await browser.new_context(java_script_enabled=javascript,viewport={'width':390,'height':900},reduced_motion='reduce' if not javascript else 'no-preference')
   mp=await mode.new_page()
   for route in ROUTES:
    await mp.goto(ORIGIN+route,wait_until='networkidle')
    fields=await mp.evaluate(FIELDS)
    fields.update(route=route,javascript=javascript,url=mp.url)
    result['modes'].append(fields)
   await mode.close()
  result['errors']=errors
  if PHASE=='after':
   extra=await browser.new_context(viewport={'width':390,'height':900},reduced_motion='reduce')
   ep=await extra.new_page()
   console_errors=[]; failed=[]
   ep.on('console',lambda m: console_errors.append(m.text) if m.type=='error' else None)
   ep.on('requestfailed',lambda r: failed.append({'url':r.url,'failure':r.failure}))
   actions=[]
   for route in ROUTES[:6]:
    await ep.goto(ORIGIN+route,wait_until='networkidle')
    await ep.keyboard.press('Tab')
    actions.append({'route':route,'check':'skip link first','passed':await ep.locator('.skip-link').evaluate('e=>e===document.activeElement')})
    await ep.keyboard.press('Enter')
    actions.append({'route':route,'check':'skip focuses main','passed':await ep.evaluate('document.activeElement.tagName==="MAIN"')})
    menu=ep.locator('.nav-mobile summary')
    await menu.focus(); await ep.keyboard.press('Enter')
    await ep.locator('.nav-mobile nav').get_by_role('link',name='Works',exact=True).click()
    await ep.wait_for_url(ORIGIN+'/#works'); await ep.wait_for_load_state('networkidle')
    actions.append({'route':route,'check':'menu navigates and closes','passed':await ep.locator('.nav-mobile').get_attribute('open') is None})
   for route in ROUTES[1:4]:
    await ep.goto(ORIGIN+route,wait_until='networkidle')
    faq=ep.locator('.faq-item summary').first
    await faq.focus(); await ep.keyboard.press('Enter')
    actions.append({'route':route,'check':'FAQ keyboard opens','passed':await ep.locator('.faq-item').first.get_attribute('open') is not None})
    await ep.locator('.cta-primary').last.click()
    await ep.wait_for_url(ORIGIN+'/contact/');await ep.wait_for_load_state('networkidle')
    actions.append({'route':route,'check':'inquiry reaches contact with original mail/chat','passed':await ep.locator('a[href^="mailto:creativebyyeh@gmail.com?subject="]').count()==2 and await ep.locator('a[href="https://open.kakao.com/me/designyeh"]').count()==1})
   result['interaction']={'actions':actions,'consoleErrors':console_errors,'failedRequests':failed}
   await extra.close()
   samples=[]
   for _ in range(3):
    perf=await browser.new_context(viewport={'width':390,'height':900},reduced_motion='reduce')
    pp=await perf.new_page()
    await pp.goto(ORIGIN,wait_until='networkidle')
    samples.append(await pp.evaluate('''() => { const n=performance.getEntriesByType('navigation')[0]; return {domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferSize:n.transferSize,paints:performance.getEntriesByType('paint').map(x=>({name:x.name,time:x.startTime}))} }'''))
    await perf.close()
   result['localPerformance']={'conditions':'after only, Chrome 390x900, fresh context per sample, reduced motion, localhost, no throttle; not field CWV or a before/after comparison','samples':samples}
  (DEST/'audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
  print(json.dumps({'phase':PHASE,'http':len(result['http']),'screens':len(result['screens']),'modes':len(result['modes']),'errors':errors,'overflow':[(x['route'],x['width']) for x in result['screens'] if x['overflow']]},ensure_ascii=False))
  await browser.close()

asyncio.run(main())

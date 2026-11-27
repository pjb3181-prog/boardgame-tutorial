from playwright.sync_api import sync_playwright
from pathlib import Path
import os
pfile=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.17.0.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1000}); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://**/*',lambda r:r.abort())
 page.set_content(pfile.read_text(),wait_until='domcontentloaded')
 def route(r):
  page.evaluate('(r)=>location.hash=r',r); f=page.frame_locator('#screen');f.locator('.rm-lens').wait_for(timeout=8000);return f
 for game in ['nusfjord','race','roll']:
  f=route(game+'/learn');print(game,'chips',f.locator('.rm-lens-chip').count(),flush=True)
  assert f.locator('.rm-lens-chip').count()>0
  f.locator('.rm-lens-chip').first.click();f.locator('.rm-lens-links button').click();assert f.locator('.rm-lens-dialog').is_visible();f.locator('.rm-lens-dialog>button').click()
  f.locator('#next').click();assert f.locator('.rm-lens-chip').count()>0
  if game=='nusfjord':f.locator('#sidebar button').filter(has_text='공용').first.click()
  elif game=='race':f.locator('#sidebar button').filter(has_text='카드 읽').first.click(timeout=1500) if f.locator('#sidebar button').filter(has_text='카드 읽').count() else None
  else:f.locator('#chapters button').filter(has_text='개인 세팅').first.click();assert f.locator('.rm-roll-mat').count()==1
  page.wait_for_timeout(1000);page.screenshot(path=f'/mnt/data/rulemaster-v0.17.0-{game}.png');print('screenshot',game,flush=True)
  page.set_viewport_size({'width':768,'height':1024});assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth+1'),game
  page.set_viewport_size({'width':1440,'height':1000})
 assert not errors,errors
 print('PASS: component lens, large comparison, current chapter, tablet width')
 b.close()

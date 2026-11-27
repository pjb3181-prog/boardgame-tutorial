from pathlib import Path
from playwright.sync_api import sync_playwright
import os
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.12.0.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1020},reduced_motion='reduce');errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(path.read_text(),wait_until='domcontentloaded')
 page.screenshot(path='/mnt/data/rulemaster-v0.12.0-home.png',full_page=True)
 for id in ['die-macher','raging-robots','euphoria','hadara']:
  page.evaluate('(id)=>location.hash=id+"/learn"',id);f=page.frame_locator('#screen');f.locator('#heading').wait_for();total=f.locator('#chapters button').count();assert total>=12
  for i in range(total):
   f.locator(f'[data-chapter="{i}"]').click();assert f.locator('#scene .piece').count()>0
   while not f.locator('#counter').inner_text().startswith(f.locator('#counter').inner_text().split(' / ')[1].split(' ')[0]+' / '):
    f.locator('#next').click();assert f.locator('#scene .piece').count()>0
  f.locator('#chapters button').nth(min(5,total-1)).click();f.locator('#scene .piece').first.click();assert f.locator('#inspect').is_visible();f.locator('#inspect button.primary').click();page.screenshot(path=f'/mnt/data/rulemaster-v0.12.0-{id}.png')
  if id=='euphoria':
   for v in ['new','old','base']:
    f.locator('#variant').select_option(v);assert f.locator('#chapters button').count()>=(14 if v=='base' else 16)
  page.locator('#practiceBtn').click();f=page.frame_locator('#screen');f.locator('#pheading').wait_for();assert f.locator('#choices button:not(:disabled)').count()>0
  f.locator('#choices button:not(:disabled)').first.click();f.locator('#undo').click();assert f.locator('#undo').is_disabled()
  for i in range(40):
   buttons=f.locator('#choices button:not(:disabled)')
   if not buttons.count():break
   buttons.first.click()
  assert '완료' in f.locator('#pheading').inner_text(),(id,f.locator('#pheading').inner_text());f.locator('#reset').click();assert f.locator('#choices button:not(:disabled)').count()>0
  page.set_viewport_size({'width':390,'height':844});assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth'),id
  page.set_viewport_size({'width':1440,'height':1020});print('PASS',id,total,flush=True)
 assert not errors,errors
 b.close()

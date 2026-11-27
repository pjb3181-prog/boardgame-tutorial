from pathlib import Path
from playwright.sync_api import sync_playwright
import os
root=Path(__file__).resolve().parents[1]
pth=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.16.0.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='no-preference'); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(pth.read_text(),wait_until='domcontentloaded')
 def route(id):
  page.evaluate('(r)=>location.hash=r',id);f=page.frame_locator('#screen');f.locator('#rmMotionSpeed').wait_for();return f
 n=route('nusfjord/learn');n.locator('#sidebar button').filter(has_text='어획').first.click()
 trail=0
 for i in range(10):
  n.locator('#next').click();trail=n.locator('#table .rm-trail').count()
  if trail:break
 assert trail, 'Nusfjord missing path'
 page.wait_for_timeout(400);page.screenshot(path='/mnt/data/rulemaster-v0.16.0-motion.png')
 n.locator('#rmMotionSpeed').select_option('0');assert n.locator('html').get_attribute('data-rm-motion')=='off';n.locator('#next').click();assert n.locator('.rm-trail').count()==0
 r=route('race/learn');assert r.locator('#rmMotionSpeed').input_value()=='0';r.locator('#rmMotionSpeed').select_option('0.6');assert r.locator('html').evaluate('(e)=>getComputedStyle(e).getPropertyValue("--rm-motion-ms")')=='1500ms'
 r.locator('#sidebar button').filter(has_text='개발').first.click();r.locator('#next').click();assert r.locator('#table .piece').count()>0
 f=route('roll/practice');assert f.locator('#rmMotionSpeed').input_value()=='0.6';f.locator('#rmMotionSpeed').select_option('1');f.locator('[data-act=roll]').click();assert '배정' in f.locator('#pheading').inner_text();assert f.locator('#pscene .dice').evaluate_all('(xs)=>xs.some(x=>x.getAnimations().some(a=>a.effect.getKeyframes().some(k=>(k.transform||"").includes("rotate"))))')
 page.wait_for_timeout(350);page.screenshot(path='/mnt/data/rulemaster-v0.16.0-roll.png');f.locator('#undo').click();assert '굴림' in f.locator('#pheading').inner_text()
 for g in ['die-macher','raging-robots','euphoria','hadara']:
  f=route(g+'/learn');f.locator('#next').click();assert f.locator('#scene [data-piece]').count()>0
  f=route(g+'/practice');f.locator('#choices button:not(:disabled)').first.click();assert f.locator('#pscene [data-piece]').count()>0
 f=route('race/practice');f.locator('[data-do=choose][data-id=develop]').click();f.locator('[data-do=advance]').click();f.locator('[data-do=select]').first.click();f.locator('[data-do=keep]').click();f.locator('[data-do=build][data-id=a]').click();f.locator('[data-do=select][data-id=c]').click();f.locator('[data-do=pay]').click();assert '행성 연구소' in f.locator('.tableau').inner_text()
 f=route('nusfjord/practice');f.locator('[data-do=fish][data-id=shares]').click();assert f.locator('#content [data-rm-token]').count()>0
 page.set_viewport_size({'width':768,'height':1024});assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth')
 assert not errors,errors
 print('PASS: SVG path, speed/disable, across-game setting, actual Roll dice rotation, undo, seven games learn/practice routes, Race cost payment, Nusfjord token updates, tablet width')
 b.close()

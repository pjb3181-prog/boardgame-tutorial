"""Verify generated illustrations on both Galaxy lesson and practice routes, with remote assets blocked."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.19.0.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('http**://**/*',lambda r:r.abort())
 page.set_content(path.read_text(),wait_until='domcontentloaded')
 assert page.locator('.version').inner_text()=='v0.20.0'
 def route(r,sel):
  page.evaluate('(r)=>location.hash=r',r);f=page.frame_locator('#screen');f.locator(sel).first.wait_for();return f
 def asset_check(f,sel):
  assert f.locator(sel).count()>0,sel
  assert f.locator(sel).evaluate_all('es=>es.every(e=>e.getAttribute("href").startsWith("data:image/webp;base64,"))')
 f=route('race/learn','#heading'); body=f.locator('body');
 assert body.evaluate('()=>Object.keys(RMGalaxyArt.assets).length')==12
 body.evaluate("()=>jump(chapters.findIndex(c=>c.id==='anatomy'))")
 asset_check(f,'#table [data-rm-galaxy-art]');assert '오프라인' in f.locator('.rm-lens-photo').inner_text();f.locator('.rm-lens-toggle').click();page.screenshot(path='/mnt/data/rulemaster-v0.19.0-race-card.png');f.locator('.rm-lens-toggle').click()
 f.locator('[data-id="zoomworld"]').click();assert f.locator('#inspector').is_visible();asset_check(f,'#inspectSvg [data-rm-galaxy-art]');f.locator('#closeInspector').click()
 body.evaluate("()=>jump(chapters.findIndex(c=>c.id==='actions'))");assert f.locator('#table [data-rm-galaxy-art]').count()==7;page.screenshot(path='/mnt/data/rulemaster-v0.19.0-race-actions.png')
 body.evaluate("()=>jump(chapters.findIndex(c=>c.id==='round'))");asset_check(f,'#table [data-rm-galaxy-art]')
 configs=body.evaluate('''()=>{let n=0;for(let exp=0;exp<=3;exp++)for(let players=2;players<=[4,5,6,6][exp];players++)for(let takeover of (exp>=2?[false,true]:[false]))for(let advanced of(players===2?[false,true]:[false])){let C=makeRaceChapters({exp,n:players,takeover,advanced});for(let c of C)for(let f of c.frames)if(!f.text.trim())throw Error(c.id);n++}return n}''');assert configs==33
 for exp in range(4):
  f.locator('#expansion').select_option(str(exp));
  body.evaluate('()=>{for(let i=0;i<chapters.length;i++){jump(i);while(frame<chapters[i].frames.length-1)forward()}}')
 print('PASS Race 33 data configurations and all lessons in four expansion levels',flush=True)
 f=route('race/practice','#content');asset_check(f,'#content [data-rm-galaxy-art]');page.screenshot(path='/mnt/data/rulemaster-v0.19.0-race-practice.png')
 f=route('roll/learn','#heading');body=f.locator('body');assert f.locator('#count').input_value()=='5';assert f.locator('#expansion').input_value()=='amb'
 f.locator('#chapters button').filter(has_text='개인 세팅:').click();f.locator('#next').click();f.locator('#next').click();asset_check(f,'#scene [data-rm-galaxy-art]');page.screenshot(path='/mnt/data/rulemaster-v0.19.0-roll-setup.png')
 f.locator('#scene [data-tile]').first.click();assert f.locator('#inspect').is_visible();asset_check(f,'#inspectArt [data-rm-galaxy-art]');f.locator('#closeInspect').click()
 f.locator('#chapters button').filter(has_text='새 주사위 두 종류').click();page.screenshot(path='/mnt/data/rulemaster-v0.19.0-roll-dice.png')
 count=body.evaluate('''()=>{let c=0;const $=id=>document.getElementById(id);for(let n=2;n<=5;n++)for(let [a,o] of [['base',false],['amb',false],['amb',true]]){$('count').value=n;$('expansion').value=a;$('goals').checked=o;$('count').dispatchEvent(new Event('change'));for(let i=0;i<rollDebug.lessons.length;i++){$('chapters').querySelector(`[data-ch="${i}"]`).click();let k=rollDebug.lessons[i].steps.length;for(let j=0;j<k;j++){if(!$('scene').querySelector('.zone'))throw Error('empty scene');c++;if(j+1<k)$('next').click()}}}return c}''');assert count==640,count
 f.locator('#count').select_option('5');f.locator('#goals').set_checked(False)
 f=route('roll/practice','#pheading');asset_check(f,'#pscene [data-rm-galaxy-art]');assert f.locator('#pscene .rm-roll-mat').count()==1;f.locator('[data-act=roll]').click();assert f.locator('#pscene .dice').count()>0
 page.screenshot(path='/mnt/data/rulemaster-v0.19.0-roll-practice.png');f.locator('#undo').click();assert '굴림' in f.locator('#pheading').inner_text()
 page.set_viewport_size({'width':768,'height':1024});assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),f.locator('body').evaluate('e=>[e.scrollWidth,innerWidth]')
 page.set_viewport_size({'width':390,'height':844});assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),f.locator('body').evaluate('e=>[e.scrollWidth,innerWidth]')
 f=route('nusfjord/learn','#heading');f.locator('#sidebar button').filter(has_text='공용판 준비').first.click();f.locator('body').evaluate('()=>{while(frame<chapters[chapter].frames.length)forward()}');assert f.locator('#table [data-rm-art]').count()>0
 for name in ['die-macher','raging-robots','euphoria','hadara']:
  f=route(name+'/learn','h1');assert f.locator('h1').first.inner_text().strip()
 assert not errors,errors
 print('PASS Roll',count,'lesson frames; art in lessons/practice and inspectors; roll/undo; tablet/mobile; Nusfjord sprites and remaining games; network blocked',flush=True)
 b.close()

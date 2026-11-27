from pathlib import Path
from playwright.sync_api import sync_playwright
import os
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.13.0.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1060},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(path.read_text(),wait_until='domcontentloaded')
 assert page.locator('.counter b').inner_text()=='7'
 page.locator('a[href="#roll/learn"]').click();f=page.frame_locator('#screen');f.locator('#heading').wait_for();assert f.locator('#count').input_value()=='5';assert f.locator('#expansion').input_value()=='amb';assert not f.locator('#goals').is_checked()
 count=f.locator('body').evaluate('''()=>{let c=0;const $=id=>document.getElementById(id);for(let n=2;n<=5;n++)for(let [a,o] of [['base',false],['amb',false],['amb',true]]){$('count').value=n;$('expansion').value=a;$('goals').checked=o;$('count').dispatchEvent(new Event('change'));let total=rollDebug.lessons.length;if(total<15)throw Error('missing lessons');for(let i=0;i<total;i++){$('chapters').querySelector(`[data-ch="${i}"]`).click();let k=rollDebug.lessons[i].steps.length;for(let j=0;j<k;j++){if(!$('scene').querySelector('.zone'))throw Error('empty scene');c++;if(j+1<k)$('next').click()}}}return c}''')
 print('PASS lesson frame instances',count,flush=True)
 f.locator('#count').select_option('5');f.locator('#goals').set_checked(False)
 f.locator('#chapters button').filter(has_text='개인 세팅:').click();f.locator('#next').click();f.locator('#next').click();page.screenshot(path='/mnt/data/roll-v0.13.0-setup.png')
 f.locator('#chapters button').filter(has_text='새 주사위 두 종류').click();page.screenshot(path='/mnt/data/roll-v0.13.0-ambition.png')
 f.locator('#scene [data-die]').first.click();assert f.locator('#inspect').is_visible();f.locator('#closeInspect').click()
 f.locator('#chapters button').filter(has_text='행동 하나를 직접 선택').click();f.locator('#next').click();page.screenshot(path='/mnt/data/roll-v0.13.0-assign.png')
 f.locator('#count').select_option('4');f.locator('#goals').set_checked(True);f.locator('#mode').click();f=page.frame_locator('#screen');f.locator('#pheading').wait_for();assert f.locator('#count').input_value()=='4';assert f.locator('#goals').is_checked()
 f.locator('#count').select_option('5');f.locator('#goals').set_checked(False)
 f.locator('[data-act=roll]').click();f.locator('[data-pick=w2]').click();f.locator('[data-act=select][data-arg="1"]').click();f.locator('[data-act=reveal]').click();assert '탐사' in f.locator('#pheading').inner_text()
 page.screenshot(path='/mnt/data/roll-v0.13.0-practice.png')
 f.locator('[data-act=next]').click();assert f.locator('#error').is_visible();f.locator('[data-act=stock]').click();assert f.locator('#undo').is_enabled();f.locator('#undo').click();assert '탐사' in f.locator('#pheading').inner_text();f.locator('[data-act=stock]').click()
 turns=f.locator('body').evaluate('''()=>{let $=id=>document.getElementById(id);let click=sel=>{let b=$("choices").querySelector(sel);if(!b)throw Error(sel);b.click()};for(let i=0;i<180;i++){let s=rollDebug.state;if(s.stage==='done')return i;if(s.stage==='roll')click('[data-act=roll]');else if(s.stage==='assign')click(s.selected===null?'[data-act=select]':'[data-act=reveal]');else if(s.stage==='phase')click($('choices').querySelector('button:not([data-act=next]):not(:disabled)')?'button:not([data-act=next]):not(:disabled)':'[data-act=next]');else if(s.stage==='manage')click($('choices').querySelector('[data-act=recruit]:not(:disabled)')?'[data-act=recruit]:not(:disabled)':Object.values(s.loc).includes('cup')?'[data-act=end]':'[data-act=recall]:not(:disabled)');if($('error').textContent)throw Error($('error').textContent)}throw Error('did not finish')}''')
 assert '연습게임 완료' in f.locator('#pheading').inner_text();print('PASS completed scenario',turns,flush=True)
 f.locator('#reset').click();assert '1라운드' in f.locator('#pheading').inner_text()
 page.set_viewport_size({'width':390,'height':844});assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth'),f.locator('body').evaluate('(e)=>[e.scrollWidth,innerWidth]')
 f.locator('#back').click();f=page.frame_locator('#screen');f.locator('#heading').wait_for();assert f.locator('#count').input_value()=='5';assert not f.locator('#goals').is_checked()
 assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth')
 f.locator('#chapters button').filter(has_text='색과 기호').click();f.locator('#next').click();assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth')
 page.locator('#homeBtn').click();page.locator('#home').wait_for(state='visible');page.set_viewport_size({'width':1440,'height':1060});page.screenshot(path='/mnt/data/rulemaster-v0.13.0-home.png',full_page=True)
 assert not errors,errors
 print('PASS hub, settings transfer, full practice, blocked skip, undo/reset, inspect, mobile',flush=True)
 b.close()

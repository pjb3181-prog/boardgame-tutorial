"""Continuous practice must retain exactly the previous round's final state."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
s=(root/'race.html').read_text()
for f in ['games/race.js','app/card-visuals.js','app/card-rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(s)
    counts=page.evaluate('''()=>{let configs=0;for(let exp=0;exp<=3;exp++)for(let n=2;n<=[4,5,6,6][exp];n++)for(let takeover of (exp>=2?[false,true]:[false]))for(let advanced of(n===2?[false,true]:[false])){configs++;const lessons=makeRaceChapters({exp,n,takeover,advanced}).filter(c=>c.id.startsWith('lesson'));if(lessons.length!==4)throw Error('lesson count');const expected=[[3,2,0,0],[2,3,1,0],[4,3,1,0],[5,3,0,2]];for(let i=0;i<4;i++){const c=lessons[i],s=sceneState(c,c.frames.length-1);const [h,t,g,v]=expected[i];const status=s.find(x=>x.id==='status');if(status.name!==`손패 ${h}장`||status.lines[0]!==`제국 ${t}장 · 상품 ${g}`||status.lines[1]!==`VP 칩 ${v}점`)throw Error('stats');if(s.filter(x=>x.type==='card'&&!x.hidden&&x.x>200&&x.y>=375).length!==h)throw Error('actual hand count '+i);if(s.filter(x=>x.type==='card'&&!x.hidden&&x.y===276).length!==t)throw Error('actual tableau count '+i);if(s.filter(x=>x.id.startsWith('good')&&!x.hidden&&x.x>200).length!==g)throw Error('actual goods count '+i);if(s.filter(x=>x.type==='vp'&&!x.hidden).length!==v)throw Error('actual vp count '+i);if(i<3&&JSON.stringify(s)!==JSON.stringify(lessons[i+1].state))throw Error('lost continuity');if(s.filter(x=>x.type==='action'&&!x.hidden).length)throw Error('action cards not retrieved')}}return configs}''')
    assert counts==33,counts
    page.evaluate("jump(chapters.findIndex(c=>c.id==='lesson1'));for(let i=0;i<3;i++)forward()")
    page.locator('#quizOptions button').first.click();assert '다시 확인' in page.locator('#quizFeedback').inner_text();page.locator('#quizOptions button').nth(1).click();assert '맞습니다' in page.locator('#quizFeedback').inner_text()
    assert not errors,errors
    page.evaluate("jump(chapters.findIndex(c=>c.id==='lesson1'));while(frame<chapters[chapter].frames.length-1)forward()")
    page.screenshot(path='/mnt/data/race-v0.10.0-first-round.png',full_page=True)
    page.evaluate("jump(chapters.findIndex(c=>c.id==='lesson2'));while(frame<chapters[chapter].frames.length-1)forward()")
    page.screenshot(path='/mnt/data/race-v0.10.0-production.png',full_page=True)
    page.evaluate("jump(chapters.findIndex(c=>c.id==='lesson4'));for(let i=0;i<4;i++)forward()")
    page.screenshot(path='/mnt/data/race-v0.10.0-consumption.png',full_page=True)
    page.set_viewport_size({'width':390,'height':844});page.screenshot(path='/tmp/race010mobile.png',full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    b.close()
print('PASS: 33 configurations, state continuity, actual card counts, quiz and mobile')

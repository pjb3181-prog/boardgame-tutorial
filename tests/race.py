"""Regression checks: original edition, four cumulative configurations, counts and optional takeover/2p rules."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
root=Path(__file__).resolve().parents[1]
s=(root/'race.html').read_text()
for f in ['games/race.js','app/card-visuals.js','app/card-rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(s)
    assert page.locator('#setupCount').input_value()=='5'
    assert page.locator('#expansion').input_value()=='3'
    def go(id):page.evaluate(f"jump(chapters.findIndex(c=>c.id==='{id}'))")
    def end():page.evaluate('while(frame<chapters[chapter].frames.length-1)forward()')
    def val(expr):return page.evaluate('sceneState(chapters[chapter],frame).'+expr)
    def save(name):
        if os.environ.get('SCREENSHOT_DIR'):page.screenshot(path=str(Path(os.environ['SCREENSHOT_DIR'])/name),full_page=True)
    for exp,maxn in enumerate([4,5,6,6]):
        page.locator('#expansion').select_option(str(exp))
        assert page.locator('#setupCount').input_value()==('4' if exp==0 else '5')
        for n in range(2,maxn+1):
            page.locator('#setupCount').select_option(str(n))
            for take in ([False,True] if exp>=2 else [False]):
                if exp>=2:page.locator('#takeover').set_checked(take)
                for adv in ([False,True] if n==2 else [False]):
                    if n==2:page.locator('#advanced').set_checked(adv)
                    go('setup');end()
                    assert val("filter(p=>p.id.startsWith('act')&&!p.hidden).length")==n
                    assert val("filter(p=>p.id.startsWith('ha')&&!p.hidden&&p.count===4).length")==n
                    assert val("find(p=>p.id==='bank').name")==f'{n*12+(5 if exp==3 else 0)} VP'
                    assert val("filter(p=>p.id.startsWith('pre')&&!p.hidden).length")== (n if exp==3 else 0)
                    assert page.evaluate("chapters.some(c=>c.id==='takeover')")==take
                    assert page.evaluate("chapters.some(c=>c.id==='prestige')")== (exp==3)
                    assert page.evaluate("chapters.some(c=>c.id==='first')")== (exp>=1)
                    assert page.evaluate("chapters.some(c=>c.id==='advanced')")==adv
                    page.evaluate('''for(let i=0;i<chapters.length;i++){jump(i);const c=chapters[i];const ids=new Set(c.state.map(p=>p.id));if(ids.size!==c.state.length)throw Error('duplicate '+c.id);for(const f of c.frames){if(!f.text.trim()||f.patch.some(p=>!ids.has(p.id)))throw Error('invalid patch '+c.id);if(f.drag&&!f.patch.some(p=>p.id===f.drag.id&&p.x===f.drag.x&&p.y===f.drag.y))throw Error('invalid drag '+c.id)}while(frame<c.frames.length-1)forward();if(!sceneState(c,frame).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))throw Error('position '+c.id)}''')
                    assert not errors,errors
    page.locator('#expansion').select_option('1');go('e1setup');end();assert val("filter(p=>p.type==='goal'&&!p.hidden).length")==6
    page.locator('#expansion').select_option('3');page.locator('#takeover').check();go('setup');end();save('race-v0.8.0-setup.png')
    go('e1setup');end();save('race-v0.8.0-goals.png')
    go('takeover');end();assert val("find(p=>p.id==='world').x")==260;save('race-v0.8.0-takeover.png')
    go('e3setup');end();save('race-v0.8.0-prestige.png')
    go('search');end();assert val("find(p=>p.id==='search').hidden");save('race-v0.8.0-search.png')
    go('develop');page.locator('#next').click();page.wait_for_timeout(150);assert val("find(p=>p.id==='dev').x")==470
    go('settle');g=page.locator('[data-id="world"]');r=g.bounding_box();target=page.evaluate('''()=>{const s=document.querySelector('#table');let p=s.createSVGPoint();p.x=490;p.y=160;let v=p.matrixTransform(s.getScreenCTM());return [v.x,v.y]}''');page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(*target,steps=10);page.mouse.up();assert val("find(p=>p.id==='world').x")==490
    go('finish');end();assert val("find(p=>p.id==='total').name")=='38 VP'
    page.set_viewport_size({'width':390,'height':844});go('setup');end();assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    assert not errors,errors
    browser.close()
print('PASS: four cumulative configurations; 2–6p as valid; optional modules; all frames; goals, takeover, search, score, drag and mobile; no JS errors')

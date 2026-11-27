"""Regression: selected multiplayer count stays consistent from setup to scoring."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
root=Path(__file__).resolve().parents[1]
s=(root/'nusfjord.html').read_text()
for f in ['games/nusfjord.js','app/rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(s)
    assert page.locator('#setupCount').input_value()=='5'
    def go(title): page.locator('#sidebar button').filter(has_text=title).click()
    def end(): page.evaluate('while(frame<chapters[chapter].frames.length)forward()')
    def val(expr): return page.evaluate('stateAt(chapters[chapter],frame).'+expr)
    def save(name):
        if os.environ.get('SCREENSHOT_DIR'):
            page.screenshot(path=str(Path(os.environ['SCREENSHOT_DIR'])/name),full_page=True)
    for n,elders,plates,ships,c,aa,bb in [(5,18,4,6,2,5,3),(2,7,1,3,4,0,0),(4,12,3,5,2,4,2),(3,9,2,4,3,3,2),(5,18,4,6,2,5,3)]:
        page.locator('#setupCount').select_option(str(n))
        assert page.evaluate(f'chapters.length===23&&chapters.every(c=>c.players==={n})')
        assert page.evaluate('''chapters.every(c=>{let ids=new Set(c.state.map(p=>p.id));return ids.size===c.state.length&&c.frames.every(f=>f.patch.every(p=>ids.has(p.id))&&(!f.drag||f.patch.some(p=>p.id===f.drag.id&&p.x===f.drag.x&&p.y===f.drag.y)))})''')
        go('공용판 준비');end()
        assert val("filter(x=>x.type==='fish'&&x.x<132).length")==plates
        assert val(f"filter(x=>x.type==='deckStack'&&x.lines[0]==='{ships}개').length")==3
        assert page.locator('[data-setup-capacity="copy"]').count()==(0 if n<4 else 1 if n==4 else 3)
        assert page.locator('[data-setup-capacity="building"]').count()==(2 if n==2 else 1)
        if n==5: save('nusfjord-v0.7.0-setup-5p.png')
        if n==2: save('nusfjord-v0.7.0-setup-2p.png')
        go('원로 카드 세팅');end();assert val("filter(x=>x.type==='setupElder'&&!x.hidden).length")==elders
        go('A·B·C 건물');end();assert val("filter(x=>x.type==='setupBuilding'&&!x.hidden).length")==15
        go('모든 플레이어');end()
        assert val("filter(x=>x.type==='playerKit'&&!x.hidden&&x.lines[0]==='완료').length")==n
        assert val("filter(x=>x.type==='turnTile'&&!x.hidden).length")==n
        assert val("filter(x=>x.type==='turnTile').flatMap(x=>x.lines).map(Number).sort((a,b)=>a-b).join(',')")=='1,2,3,4,5,6,7'
        assert val("find(x=>x.id==='orderShip').hidden")==False
        if n==5: save('nusfjord-v0.7.0-table-5p.png')
        go('일꾼을 보내');assert f'총 {n*3}차례' in page.locator('#narration').inner_text()
        assert page.locator('[data-action-slot="주식 발행"]').count()==(1 if n==2 else 2)
        go('연회에 생선');end()
        assert val("filter(x=>x.type==='fish'&&x.y===628).length")==plates+2
        assert val("filter(x=>x.type==='fish'&&x.x>700&&x.y<300).length")==0
        go('원로를 데려오고');end();assert val("find(x=>x.id==='elder').name")=='7번 원로'
        go('행동칸이 차');end()
        assert page.locator('[data-action-slot="copy"]').count()==(0 if n<4 else 1 if n==4 else 3)
        assert page.locator('[data-action-slot="building"]').count()==(2 if n==2 else 3)
        assert val("find(x=>x.id==='share2').issued")== (n>=4)
        if n>=4: assert val("find(x=>x.id==='worker0').x")==364
        if n==5: save('nusfjord-v0.7.0-copy-5p.png')
        go('라운드 종료');page.evaluate('while(frame<5)forward()')
        assert val("filter(x=>x.type==='miniCard'&&x.name==='A'&&!x.hidden).length")==aa
        assert val("filter(x=>x.type==='miniCard'&&x.name==='C'&&!x.hidden&&x.faceDown).length")==c
        assert f'총 {n*c}장' in page.locator('#narration').inner_text()
        end();assert val("filter(x=>x.type==='miniCard'&&x.name==='B'&&!x.hidden).length")==bb
        assert val("filter(x=>x.type==='miniCard'&&x.name==='C'&&!x.hidden&&!x.faceDown).length")==c
        if n==5:save('nusfjord-v0.7.0-rounds-5p.png')
        # Every frame actually renders for this selected count.
        page.evaluate('''for(let i=0;i<chapters.length;i++){jump(i);while(frame<chapters[chapter].frames.length)forward();if(!document.getElementById('narration').textContent.trim())throw Error('missing narration');if(![...nodes.values()].every(n=>Number.isFinite(+n.dataset.x)&&Number.isFinite(+n.dataset.y)))throw Error('invalid piece position')}''')
        assert page.locator('#setupCount').is_visible()
    page.set_viewport_size({'width':390,'height':844})
    for n in (2,3,4,5):
        page.locator('#setupCount').select_option(str(n));go('모든 플레이어');end();assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    assert not errors,errors
    browser.close()
print('PASS: default 5p; 2/3/4/5/2+ switching; all 23 chapters for every count; setup/card/turn tiles; capacity and imitation; banquet and round reveals; mobile width; no JS errors')

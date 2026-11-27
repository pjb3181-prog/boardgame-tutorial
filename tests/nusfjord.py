from pathlib import Path
from playwright.sync_api import sync_playwright
import os
root=Path(__file__).resolve().parents[1]
s=(root/'nusfjord.html').read_text()
for f in ['games/nusfjord.js','app/rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':980})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(s)
    assert page.locator('#sidebar button').count()==23
    assert '어업 회사' in page.locator('#narration').inner_text()
    assert page.evaluate('frame')==1
    def go(title):
        page.locator('#sidebar button').filter(has_text=title).click()
    def advance(n=1):
        for _ in range(n): page.locator('#next').click()
    def end():
        while page.evaluate('frame<chapters[chapter].frames.length'): advance()
    def val(expr): return page.evaluate('stateAt(chapters[chapter],frame).'+expr)
    def drag_piece(id,x,y):
        page.wait_for_timeout(800)
        pos=page.evaluate('''([id,x,y])=>{let svg=document.getElementById('table'),g=svg.querySelector(`[data-piece="${id}"]`),p=svg.createSVGPoint(),q=svg.createSVGPoint();p.x=Number(g.dataset.x);p.y=Number(g.dataset.y);q.x=x;q.y=y;let m=svg.getScreenCTM();p=p.matrixTransform(m);q=q.matrixTransform(m);return [p.x,p.y,q.x,q.y]}''',[id,x,y]);
        page.mouse.move(pos[0],pos[1]);page.mouse.down();page.mouse.move(pos[2],pos[3],steps=16);page.mouse.up();page.wait_for_timeout(100)
    # Every state patch has a piece and every drag matches its destination.
    assert page.evaluate('''chapters.every(c=>{let ids=new Set(c.state.map(p=>p.id));return ids.size===c.state.length&&c.frames.every(f=>f.patch.every(p=>ids.has(p.id))&&(!f.drag||f.patch.some(p=>p.id===f.drag.id&&p.x===f.drag.x&&p.y===f.drag.y)))})''')
    # Exact setup by player count. Real board arrangement and all remaining piles.
    for n,num,plates,ships,c in [(2,7,1,3,4),(3,9,2,4,3),(4,12,3,5,2),(5,18,4,6,2)]:
        go('공용판 준비');page.locator('#setupCount').select_option(str(n));end()
        assert val("filter(x=>x.type==='fish'&&x.x<132).length")==plates
        assert val("filter(x=>x.type==='deckStack').every(x=>x.lines[0]==='"+str(ships)+"개')")
        go('원로 카드 세팅');assert page.locator('#setupCount').input_value()==str(n);end()
        assert val("filter(x=>x.type==='setupElder'&&!x.hidden).length")==num
        assert val("filter(x=>x.type==='setupElder'&&!x.hidden&&x.faceDown).length")== (6 if n==5 else 0)
        assert val("filter(x=>x.type==='setupElder'&&!x.hidden&&x.x>316).length")==num
        assert val("filter(x=>x.type==='setupElder'&&!x.hidden&&!x.faceDown).length")==min(12,num)
        for k in range(1, min(num,12)+1):
            expected=423+((k-1)%3)*205+(10 if k>6 else 0)
            assert val(f"find(x=>x.id==='elderSetup{k}').x")==expected
        if n==5 and os.environ.get('ELDER_SCREENSHOT'):
            page.wait_for_timeout(800);page.screenshot(path=os.environ['ELDER_SCREENSHOT'],full_page=True)
        go('A·B·C 건물');end()
        assert val("filter(x=>x.type==='setupBuilding'&&!x.hidden&&x.name==='A'&&!x.faceDown).length")==9
        assert val("filter(x=>x.type==='setupBuilding'&&!x.hidden&&x.name==='B'&&!x.faceDown).length")==6
        assert val("find(x=>x.id==='deckA').lines[0]")=='9장 · 뒷면'
        assert val("find(x=>x.id==='deckB').lines[0]")=='6장 · 뒷면'
        assert val("find(x=>x.id==='deckC').lines[0]")=='14장 · 뒷면'
        assert bool(val("find(x=>x.id==='deckA').hidden"))== (n==2)
        assert bool(val("find(x=>x.id==='deckB').hidden"))== (n==2)
        assert str(c)+'장씩' in page.locator('#narration').inner_text()
        if n==3 and os.environ.get('BUILDING_SCREENSHOT'):
            page.wait_for_timeout(800);page.screenshot(path=os.environ['BUILDING_SCREENSHOT'],full_page=True)
    page.locator('#setupCount').select_option('3')
    go('내 앞에 무엇');end()
    assert val("filter(x=>x.type==='forest').length")==4
    assert val("filter(x=>x.type==='share'&&x.issued).length")==2
    go('첫 라운드: 물고기');advance(3)
    drag_piece('fish2',290,195)
    assert page.evaluate('frame')==5
    end()
    assert val("filter(x=>x.type==='fish'&&x.x>700).length")==2
    assert val("find(x=>x.id==='fish2').x")==290
    page.locator('#replay').click();page.wait_for_timeout(950);assert page.evaluate('frame')==6
    go('일꾼을 보내');end();assert val("filter(x=>x.type==='wood'&&x.x>700).length")==4
    go('숲은 어떻게');end();assert val("filter(x=>x.type==='forest'&&x.x>400).length")==3
    assert val("filter(x=>x.type==='wood'&&x.x>700).length")==5
    go('예비고 옮기기');end();assert val("filter(x=>x.type==='fish'&&x.x>700).length")==3
    assert val("filter(x=>x.type==='wood'&&x.x>700).length")==2
    go('재조림으로');end();assert val("filter(x=>x.type==='forest'&&x.x>400&&x.y<400).length")==5
    go('선박을 건조');end();assert val("find(x=>x.id==='schooner').y")==492
    assert val("filter(x=>x.type==='coin'&&x.x>700).length")==0
    go('연회에 생선');end();assert val("filter(x=>x.type==='fish'&&x.y===628).length")==4
    assert val("filter(x=>x.type==='coin'&&x.x>700).length")==2
    assert val("filter(x=>x.type==='fish'&&x.x>700&&x.y<300).length")==0
    page.wait_for_timeout(750)
    if os.environ.get('SCREENSHOT'): page.screenshot(path=os.environ['SCREENSHOT'],full_page=True)
    go('원로를 데려오고');end();assert val("find(x=>x.id==='elder').x")==294
    assert val("filter(x=>x.type==='wood'&&x.x>700&&x.y<300).length")==2
    go('원로 위 생선');end();assert val("filter(x=>x.type==='fish'&&x.x>700).length")==1
    go('건물을 지어');end();assert val("find(x=>x.id==='fishStand').y")==194
    assert val("filter(x=>x.type==='fish'&&x.x>700).length")==4
    go('주식 발행은');end();assert val("find(x=>x.id==='share2').issued")
    assert val("filter(x=>x.type==='coin'&&x.x>700).length")==2
    go('주식 시장의');end();assert val("filter(x=>x.type==='share'&&x.issued&&x.x>700).length")==4
    go('중반 어획');end();assert val("filter(x=>x.type==='fish'&&x.x>700&&x.y<300).length")==4
    assert val("filter(x=>x.type==='fish'&&x.x>=250&&x.x<356&&x.y>=156&&x.y<233).length")==8
    go('행동칸이 차');end();assert not val("find(x=>x.id==='share2').issued");assert val("filter(x=>x.type==='coin'&&x.x>700).length")==1
    go('라운드 종료');end();assert val("find(x=>x.id==='firstShip').x")==937
    go('마지막 점수');end();assert '12점' in val("find(x=>x.id==='score').lines[0]")
    # Check every explanation step, labels, full forward/back transitions.
    for i in range(23):
        page.locator('#sidebar button').nth(i).click();end()
        assert page.locator('#narration').inner_text().strip()
        assert page.evaluate('Number.isFinite(frame)&&frame===chapters[chapter].frames.length')
        assert page.evaluate('''[...nodes.values()].every(n=>Number.isFinite(+n.dataset.x)&&Number.isFinite(+n.dataset.y))''')
    assert page.locator('#next').is_disabled()
    page.locator('#back').click();assert page.evaluate('frame===chapters[chapter].frames.length-1')
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    assert not errors,errors
    browser.close()
print('PASS: 23 chapters and every explanation, validated patch/drag IDs, pointer drag, all base action examples, fishing/elders/rounds/scoring state, mobile width, no JS errors')

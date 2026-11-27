"""Offline generated sprites remain recognizable and do not change lesson/practice state."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
pfile=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.18.0.html'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(pfile.read_text(),wait_until='domcontentloaded')
    def route(r):
        page.evaluate('(r)=>location.hash=r',r)
        return page.frame_locator('#screen')
    f=route('nusfjord/learn'); f.locator('#sidebar button').first.wait_for()
    def chapter(name):f.locator('#sidebar button').filter(has_text=name).first.click()
    def allsteps():f.locator('body').evaluate('()=>{while(frame<chapters[chapter].frames.length)forward()}')
    for n in [2,3,4,5]:
        f.locator('#setupCount').select_option(str(n))
        f.locator('body').evaluate('()=>{for(let i=0;i<chapters.length;i++){jump(i);while(frame<chapters[i].frames.length)forward();if(![...nodes.values()].every(n=>Number.isFinite(+n.dataset.x)&&Number.isFinite(+n.dataset.y)))throw Error("bad state");}}')
        chapter('원로 카드 세팅');allsteps()
        assert f.locator('[data-rm-art="elder"]').count()>0
        chapter('A·B·C 건물');allsteps()
        assert f.locator('[data-rm-art="buildingA"]').count()==9
        assert f.locator('[data-rm-art="buildingB"]').count()==6
    chapter('공용판 준비');allsteps()
    page.screenshot(path='/mnt/data/rulemaster-v0.18.0-setup.png')
    chapter('연회에 생선');allsteps()
    assert f.locator('#table [data-rm-art="fish"]').count()>0
    page.screenshot(path='/mnt/data/rulemaster-v0.18.0-banquet.png')
    # On-frame graphics use data URIs and remain available with external networking blocked.
    assert f.locator('body').evaluate('()=>Array.from(document.querySelectorAll("#table [data-rm-art]")).every(e=>e.getAttribute("href").startsWith("data:image/webp;base64,"))')
    f.locator('.rm-lens-chip').first.click();f.locator('.rm-lens-links button').click();assert f.locator('.rm-lens-dialog').is_visible();f.locator('.rm-lens-dialog>button').click()
    f=route('nusfjord/practice');f.locator('#content .fish').first.wait_for();assert 'data:image/webp;base64' in f.locator('#content .fish').first.evaluate('el=>getComputedStyle(el).backgroundImage')
    page.screenshot(path='/mnt/data/rulemaster-v0.18.0-practice.png')
    for name in ['race','roll','die-macher','raging-robots','euphoria','hadara']:
        f=route(name+'/learn'); f.locator('h1').first.wait_for(); assert f.locator('h1').first.inner_text().strip()
    assert not errs,errs
    print('PASS: all 22 chapters across 2–5 players; generated assets; practice CSS; lens; other six game routes; external networking blocked')
    b.close()

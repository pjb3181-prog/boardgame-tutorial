"""Verify authored teaching sequences use stable layout and real piece transitions."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(Path(os.environ['RULEMASTER_HTML']).read_text(),wait_until='domcontentloaded')
    def route(g):
        page.evaluate('(g)=>location.hash=g+"/learn"',g)
        f=page.frame_locator('#screen')
        f.locator('#rmMotionSpeed').wait_for()
        f.locator('#rmMotionSpeed').select_option('1')
        return f
    cases=[
      ('die-macher','언론 마커 구매','pay','0:0','1:0'),
      ('raging-robots','조립: 에너지와 자원을 지불','r','0:0','1:0'),
      ('euphoria','내 차례의 두 가지 기본 선택','d0','0:0','1:0'),
      ('hadara','두 장 뽑고, 하나 버리고','b','0:1','1:0'),
      ('roll','행동 하나를 직접 선택','B','0:0','1:0')
    ]
    for g,topic,piece,src,dst in cases:
        f=route(g)
        f.locator('#chapters button').filter(has_text=topic).first.click()
        board=f.locator('#scene')
        assert board.evaluate('e=>e.classList.contains("rm-fixed-teaching")')
        def positions():
            return board.evaluate('e=>[...e.querySelectorAll("[data-slot]")].map(s=>{const r=s.getBoundingClientRect(),b=e.getBoundingClientRect();return [s.dataset.slot,Math.round(r.x-b.x),Math.round(r.y-b.y),Math.round(r.width),Math.round(r.height)]})')
        before=positions()
        node=board.locator('[data-teach-id="'+piece+'"]')
        assert node.evaluate('e=>e.closest("[data-slot]").dataset.slot')==src
        if g=='raging-robots':
            f.locator('#next').click()
            assert positions()==before
        f.locator('#next').click()
        assert node.evaluate('e=>e.closest("[data-slot]").dataset.slot')==dst
        assert positions()==before
        assert node.evaluate('e=>e.getAnimations().some(a=>a.effect.getKeyframes().some(k=>(k.transform||"").includes("translate")))')
        assert board.locator('.rm-lm-overlay').count()==0
        f.locator('#next').wait_for(state='visible')
        f.locator('#replay').click()
        node.wait_for()
        page.wait_for_timeout(150)
        assert positions()==before
        f.locator('#rmMotionSpeed').select_option('0')
        # After any running motion, going back and forward must remain possible.
        f.locator('#prev').click()
        f.locator('#next').click()
        assert node.evaluate('e=>e.getAnimations().length')==0
        for width in [768,390]:
            page.set_viewport_size({'width':width,'height':900})
            assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),(g,width)
        page.set_viewport_size({'width':1440,'height':1000})
        print('PASS fixed lesson',g,flush=True)
    for g in ['nusfjord','race']:
        f=route(g)
        f.locator('#sidebar button').filter(has_text='어획' if g=='nusfjord' else '개발').first.click()
        f.locator('#next').click()
        assert f.locator('#table .piece').count()>0
        assert f.locator('.rm-lm-overlay').count()==0
        print('PASS original SVG lesson',g,flush=True)
    assert not errors,errors
    b.close()

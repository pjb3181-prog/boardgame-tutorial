"""Check real staged lesson transitions on all seven packed routes."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1280,'height':900},reduced_motion='no-preference')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(Path(os.environ['RULEMASTER_HTML']).read_text(),wait_until='domcontentloaded')
    def route(g):
        page.evaluate('(g)=>location.hash=g+"/learn"',g)
        f=page.frame_locator('#screen')
        f.locator('.rm-lesson-motion').wait_for()
        return f
    topics={'nusfjord':'어획','race':'개발','roll':'행동 하나를 직접 선택','die-macher':'언론 마커 구매','raging-robots':'로봇을 만들어','euphoria':'일꾼','hadara':'A 단계'}
    for g,topic in topics.items():
        f=route(g)
        f.locator('#rmMotionSpeed').select_option('1')
        candidates=f.locator('#sidebar button,#chapters button').filter(has_text=topic)
        if candidates.count():candidates.first.click()
        board=f.locator('#table' if g in ['nusfjord','race'] else '#scene')
        found=False
        for _ in range(20):
            if not f.locator('#next').is_enabled():break
            f.locator('#next').click()
            if board.get_attribute('data-rm-lesson-stage')=='before':
                found=True
                assert f.locator('.rm-lm-skip').is_visible()
                assert not f.locator('#next').is_enabled()
                assert board.locator('.rm-lm-overlay').count()==1
                f.locator('.rm-lm-status').filter(has_text='시연 1 /').wait_for(timeout=4000)
                assert f.locator('.rm-lm-changes span').count()>0
                f.locator('.rm-lm-skip').click()
                assert board.get_attribute('data-rm-lesson-stage')=='done'
                assert board.locator('.rm-lm-overlay').count()==0
                if f.locator('#replay').is_enabled():
                    f.locator('#replay').click()
                    board.locator('.rm-lm-overlay').wait_for(state='attached',timeout=4000)
                    f.locator('.rm-lm-skip').click()
                f.locator('#rmMotionSpeed').select_option('0')
                if f.locator('#next').is_enabled():f.locator('#next').click()
                assert board.locator('.rm-lm-overlay').count()==0
                break
        assert found,(g,topic,f.locator('#heading').inner_text())
        print('PASS lesson motion',g,flush=True)
    assert not errors,errors
    b.close()

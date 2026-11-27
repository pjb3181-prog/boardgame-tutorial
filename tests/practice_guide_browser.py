"""Practice guides must point to actual enabled controls, not inspection-only components."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
path=Path(os.environ['RULEMASTER_HTML'])
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(path.read_text(),wait_until='domcontentloaded')
    def route(game):
        page.evaluate('(g)=>location.hash=g+"/practice"',game)
        f=page.frame_locator('#screen')
        f.locator('#rmPracticeGuide').wait_for()
        assert f.locator('.rm-guide-action').count()>0
        assert f.locator('.rm-guide-action:disabled').count()==0
        return f
    f=route('nusfjord')
    assert f.locator('.rm-guide-action[data-do="fish"]').count()==1
    assert f.locator('.rm-guide-action').get_attribute('data-id')=='shares'
    f.locator('.rm-guide-action').click()
    assert f.locator('.rm-guide-action').get_attribute('data-id')=='shares'
    f.locator('.rm-guide-action').click()
    assert f.locator('.rm-guide-action').get_attribute('data-id')=='reserve'
    f.locator('.rm-guide-action').click()
    assert f.locator('.rm-guide-action[data-do="nact"]').count()>0
    f=route('race')
    assert f.locator('.rm-guide-action[data-do="choose"]').count()==7
    f.locator('.rm-guide-action[data-id="explore2"]').click()
    f.locator('.rm-guide-action[data-do="advance"]').click()
    assert f.locator('.rm-guide-action[data-do="select"]').count()>0
    f.locator('.rm-guide-action[data-do="select"]').first.click()
    assert '1/2' in f.locator('.rm-guide-message').inner_text()
    f=route('roll')
    assert f.locator('.rm-guide-action[data-act="roll"]').count()==1
    f.locator('.rm-guide-action[data-act="roll"]').click()
    assert f.locator('.rm-guide-target[data-pick]').count()>0
    assert f.locator('.rm-guide-action[data-act="select"]').count()==5
    for game in ['die-macher','raging-robots','euphoria','hadara']:
        f=route(game)
        assert f.locator('#choices .rm-guide-action').count()>0
        assert f.locator('#choices').evaluate('e=>e.getBoundingClientRect().top < document.querySelector("#pscene").getBoundingClientRect().top')
        if game=='euphoria':
            die=f.locator('#pscene [data-piece="a"]')
            die.click()
            assert f.locator('#choices .rm-guide-linked[data-action^="place:a:"]').count()==3
            assert f.locator('.rm-guide-selection').is_visible()
            f.locator('#choices .rm-guide-linked').first.click()
        elif game=='hadara':
            f.locator('#pscene [data-piece="h0-0"]').click()
            assert f.locator('#choices .rm-guide-linked[data-action="buy0"]').count()==1
            assert f.locator('#choices .rm-guide-linked[data-action="sell0"]').count()==1
            f.locator('#choices .rm-guide-linked').first.click()
        else:
            f.locator('#choices .rm-guide-action').first.click()
        assert f.locator('#choices .rm-guide-action:disabled').count()==0
        f.locator('#undo').click()
        assert f.locator('#choices .rm-guide-action').count()>0
        for width in [768,390]:
            page.set_viewport_size({'width':width,'height':900})
            assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),(game,width)
        page.set_viewport_size({'width':1280,'height':900})
        print('PASS',game,flush=True)
    assert not errors,errors
    b.close()

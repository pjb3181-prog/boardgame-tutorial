"""Test focused physical setup in packed app without network."""
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
    for game in ['die-macher','raging-robots','euphoria','hadara']:
        page.evaluate('(g)=>location.hash=g+"/learn"',game)
        f=page.frame_locator('#screen')
        f.locator('.rm-setup-tools').wait_for()
        assert f.locator('#scene>.zone:visible').count()==6
        f.locator('.rm-setup-tabs [data-zone="3"]').click()
        assert f.locator('#scene>.zone:visible').count()==1
        assert f.locator('.rm-setup-items li').count()>0
        f.locator('.rm-setup-actions button').first.click()
        assert '1 / 6' in f.locator('.rm-setup-progress').inner_text()
        f.locator('.rm-setup-tabs [data-zone="0"]').click()
        if game=='euphoria':
            assert f.locator('#scene>.zone:visible .star').count()==10
        if game=='hadara':
            assert f.locator('#scene>.zone:visible .rm-setup-quantity').count()>=2
        for width in [768,390]:
            page.set_viewport_size({'width':width,'height':900})
            assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),(game,width)
        page.set_viewport_size({'width':1280,'height':900})
        f.locator('.rm-setup-tabs [data-zone="-1"]').click()
        assert f.locator('#scene>.zone:visible').count()==6
        f.locator('#next').click()
        assert not f.locator('.rm-setup-tools').is_visible()
        f.locator('#prev').click()
        assert '1 / 6' in f.locator('.rm-setup-progress').inner_text()
        if game=='euphoria':
            f.locator('#variant').select_option('new')
            assert '0 / 6' in f.locator('.rm-setup-progress').inner_text()
        print('PASS',game,flush=True)
    assert not errors,errors
    b.close()

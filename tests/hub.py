from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess, tempfile, os
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as tmp:
    outfile=Path(tmp)/'rulemaster.html'
    subprocess.run(['python',str(root/'scripts/build_standalone.py'),str(outfile)],check=True)
    content=outfile.read_text()
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce')
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(content,wait_until='domcontentloaded')
        assert page.get_by_role('heading',name='오늘 어떤 게임을 배울까?').is_visible()
        def save(name):
            if os.getenv('SCREENSHOT_DIR'):page.screenshot(path=str(Path(os.environ['SCREENSHOT_DIR'])/name))
        save('rulemaster-v0.11.0-home.png')
        def openroute(route):
            page.evaluate('(r)=>location.hash=r',route)
            page.locator('#workspace').wait_for(state='visible')
            return page.frame_locator('#screen')
        n=openroute('nusfjord/learn');n.locator('#heading').wait_for();assert n.locator('#setupCount').input_value()=='5'
        n.locator('a[data-hub="nusfjord/practice"]').click();n.locator('#title').wait_for();assert '누스피요르드' in n.locator('#title').inner_text()
        n.locator('[data-do=fish][data-id=reserve]').click();assert n.locator('.error').is_visible()
        n.locator('[data-do=fish][data-id=shares]').click();n.locator('[data-do=fish][data-id=shares]').click();n.locator('[data-do=fish][data-id=reserve]').click()
        save('rulemaster-v0.11.0-nusfjord.png')
        n.locator('[data-do=nact][data-id=thin]').click();n.locator('[data-do=nact][data-id=ship]').click();n.locator('[data-do=nconfirm][data-id=sloop]').click();assert '다음 어획 5' in n.locator('#log').inner_text()
        n.locator('[data-do=nact][data-id=issue]').click();n.locator('[data-do=return]').click();assert '2라운드' in n.locator('.intro h2').inner_text();assert '5마리' in n.locator('.intro p').first.inner_text()
        n.locator('#undo').click();assert '귀환' in n.locator('.intro h2').inner_text()
        n.locator('#count').select_option('2');assert '3마리' in n.locator('.intro p').first.inner_text();n.locator('#count').select_option('5')
        page.locator('#gameSelect').select_option('race');r=page.frame_locator('#screen');r.locator('#title').wait_for();assert '레이스' in r.locator('#title').inner_text()
        r.locator('[data-do=choose][data-id=develop]').click();r.locator('[data-do=advance]').click();r.locator('[data-do=select]').first.click();r.locator('[data-do=keep]').click();r.locator('[data-do=build][data-id=a]').click();r.locator('[data-do=select][data-id=c]').click();save('rulemaster-v0.11.0-race.png');r.locator('[data-do=pay]').click();assert '행성 연구소' in r.locator('.tableau').inner_text()
        r.locator('[data-do=build][data-id=b]').click();r.locator('[data-do=select]').filter(has_text='외곽 광산').click();r.locator('[data-do=pay]').click();r.locator('[data-do=advance]').click();assert '2라운드' in r.locator('.intro h2').inner_text()
        page.locator('#learnBtn').click();r.locator('#heading').wait_for();assert r.locator('#expansion').input_value()=='3'
        page.locator('#homeBtn').click();page.locator('#home').wait_for(state='visible')
        page.set_viewport_size({'width':390,'height':844});r=openroute('race/practice');r.locator('#title').wait_for();assert '2라운드' in r.locator('.intro h2').inner_text();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert r.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth');r.locator('[data-do=choose][data-id=produce]').click();assert r.locator('.reveal').is_visible()
        n=openroute('nusfjord/practice');n.locator('#title').wait_for();assert n.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth')
        page.locator('#homeBtn').click();page.get_by_role('heading',name='오늘 어떤 게임을 배울까?').wait_for()
        assert not errors,errors
        b.close()
print('PASS: standalone hub routes, lesson -> practice, game switching, fish/ship/share, pay/build, undo/reset and mobile width')

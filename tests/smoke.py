from pathlib import Path
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
    executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
    browser=p.chromium.launch(executable_path=executable,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1280,'height':800})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(f'http://127.0.0.1:{server.server_port}/die-macher.html')
    assert '선거판' in page.locator('#headline').inner_text()
    assert page.locator('#illustration svg').count()==1
    page.locator('#next').click()
    assert '아직' in page.locator('#skipNotice').inner_text()
    for item in page.locator('#checks input').all(): item.check()
    page.locator('#next').click()
    assert '누가' in page.locator('#headline').inner_text()
    page.locator('#phases button').nth(8).click()
    assert page.locator('#calculator').is_visible()
    assert page.locator('#votes').inner_text()=='+12표'
    page.locator('#rallies').fill('0')
    assert page.locator('#votes').inner_text()=='+0표'
    page.locator('#mode').click()
    assert not page.locator('#checks').is_visible()
    page.reload()
    assert not page.locator('#checks').is_visible()
    for _ in range(60):
        if page.locator('#next').is_disabled(): break
        page.locator('#next').click()
    assert '최종 승자' in page.locator('#headline').inner_text()
    page.on('dialog',lambda d:d.accept())
    page.locator('#reset').click()
    assert '선거판' in page.locator('#headline').inner_text()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    assert not errors,errors
    browser.close()
print('PASS: local server launch, illustration, check/advance, calculation UI, quick mode, reload, complete path, reset, mobile width; no JS errors')

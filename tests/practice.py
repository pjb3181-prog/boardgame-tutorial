from pathlib import Path
import os
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
    browser=p.chromium.launch(executable_path=executable,args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1280,'height':800})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content((root/'practice.html').read_text(encoding='utf-8'))
    assert page.locator('#next').is_disabled()
    page.locator('[data-region="1"][data-slot="0"]').click()
    assert page.locator('.feedback.bad').count()==1
    page.locator('[data-region="0"][data-slot="3"]').click()
    assert '€10,000' in page.locator('.statusline').first.inner_text()
    if os.environ.get('PRACTICE_SCREENSHOTS'): page.screenshot(path=str(Path(os.environ['PRACTICE_SCREENSHOTS'])/'boardgame-practice-preview.png'),full_page=True)
    page.locator('#next').click()
    page.locator('[data-answer="R"]').click()
    assert page.locator('#next').is_disabled()
    page.locator('[data-answer="B"]').click()
    page.locator('#next').click()
    for i,n in [(0,3),(1,2)]:
        for _ in range(n): page.locator(f'[data-i="{i}"][data-n="1"]').click()
    assert page.locator('[data-i="0"][data-n="1"]').is_disabled()
    assert '€5,000' in page.locator('.statusline').last.inner_text()
    if os.environ.get('PRACTICE_SCREENSHOTS'): page.screenshot(path=str(Path(os.environ['PRACTICE_SCREENSHOTS'])/'boardgame-practice-rally.png'),full_page=True)
    page.locator('#buy').click()
    assert '€5,000' in page.locator('.statusline').first.inner_text()
    page.locator('#next').click()
    assert '연습 완료' in page.locator('.completion').inner_text()
    page.locator('#again').click()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    assert not errors,errors
    browser.close()
print('PASS: practice click flow, wrong-answer feedback, payment, capacity, reset, mobile width, no JS errors')

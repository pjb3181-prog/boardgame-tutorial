from pathlib import Path
import os
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
s=(root/'race.html').read_text()
for f in ['games/race.js','app/card-visuals.js','app/card-rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_default_timeout(4500);page.set_content(s)
    assert page.locator('#setupCount').input_value()=='5'
    def go(id):page.evaluate(f"jump(chapters.findIndex(c=>c.id==='{id}'))")
    def end():page.evaluate('while(frame<chapters[chapter].frames.length-1)forward()')
    def save(name):
        if os.environ.get('SCREENSHOT_DIR'):page.screenshot(path=str(Path(os.environ['SCREENSHOT_DIR'])/('race-v0.9.0-'+name+'.png')),full_page=True)
    go('components');save('components');go('anatomy');page.locator('#next').click();save('anatomy');page.locator('[data-id="zoomworld"]').click();assert page.locator('#inspector').is_visible();assert '3장' in page.locator('#inspectDetails').inner_text();save('inspect');page.locator('#closeInspector').click();assert not page.locator('#inspector').is_visible()
    go('symbols');save('symbols');go('goodsColors');save('goods');go('actions');save('actions');go('setup');end();save('setup');go('e1setup');end();save('goals');go('e3setup');end();save('prestige')
    print('screenshots OK',flush=True);go('settle');g=page.locator('[data-id="world"]');g.scroll_into_view_if_needed();r=g.bounding_box();target=page.evaluate('''()=>{const s=document.querySelector('#table');let p=s.createSVGPoint();p.x=490;p.y=160;let v=p.matrixTransform(s.getScreenCTM());return [v.x,v.y]}''');page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(*target,steps=10);page.mouse.up();assert page.evaluate("sceneState(chapters[chapter],frame).find(p=>p.id==='world').x")==490
    print('drag OK',flush=True);assert not page.locator('#inspector').is_visible();go('anatomy');page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth');page.locator('#inspectList button').first.click(timeout=4500);assert page.locator('#inspector').is_visible();assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth');page.locator('#closeInspector').click();assert not errors,errors;b.close()
print('PASS: new components and card anatomy, clickable and keyboard-focusable cards, inspect dialog, drag, mobile, no JS errors')

"""Offline, edition-aware artwork smoke and interaction checks for the four expanded games."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.21.0.html'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':1080},reduced_motion='reduce');errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(path.read_text(),wait_until='domcontentloaded')
    assert page.locator('.version').inner_text()=='v0.21.0'
    counts={}
    for id,key in [('die-macher','region'),('raging-robots','robotMat'),('euphoria','city'),('hadara','hadaraWheel')]:
        page.evaluate('(id)=>location.hash=id+"/learn"',id);f=page.frame_locator('#screen');f.locator('#heading').wait_for();assert '전체 테이블' in f.locator('#heading').inner_text()
        assert f.locator('#scene.rm-table-overview .zone').count()==6
        assert f.locator(f'[data-rm-board="{key}"]').count()>=1
        if id=='die-macher':assert f.locator('.rm-region-group .piece').count()==4
        if id=='raging-robots':assert f.locator('[data-rm-board="robotMat"]').count()==5
        if id=='euphoria':assert f.locator('.rm-city-wrap [data-piece^=ovmarket]').count()==6;assert f.locator('#scene .star').count()==50
        if id=='hadara':assert f.locator('.rm-hadara-ring .back').count()==5
        f.locator('[data-rm-board="'+key+'"]').first.evaluate("e=>e.click()");assert f.locator('#inspect').is_visible();assert f.locator('#inspectPiece .rm-redrawn').count()==1;f.locator('#inspect button.primary').click()
        page.screenshot(path=f'/mnt/data/rulemaster-v0.21.0-{id}.png',full_page=True)
        frames=f.locator('body').evaluate("""()=>{let count=0;for(const btn of document.querySelectorAll('#chapters button')){btn.click();const n=+document.getElementById('counter').textContent.split('/')[1].trim().split(' ')[0];for(let j=0;j<n;j++){if(!document.querySelector('#scene .piece'))throw Error('no pieces');if([...document.querySelectorAll('#scene img')].some(x=>!x.src.startsWith('data:image/')))throw Error('nonembedded illustration');count++;if(j+1<n)document.getElementById('next').click();}}return count}""")
        if id=='euphoria':
            for v in ['new','old','base']:
                f.locator('#variant').select_option(v);assert f.locator('#scene .rm-city-wrap').count()==1
                assert f.locator('[data-piece="ovbazaar"]').count()==(1 if v=='new' else 0)
        page.locator('#practiceBtn').click();f=page.frame_locator('#screen');f.locator('#pheading').wait_for()
        assert f.locator('#choices button:not(:disabled)').count()>0
        f.locator('#choices button:not(:disabled)').first.click();f.locator('#undo').click();assert f.locator('#undo').is_disabled()
        for i in range(40):
            btns=f.locator('#choices button:not(:disabled)')
            if not btns.count():break
            btns.first.click()
        assert '완료' in f.locator('#pheading').inner_text(),id
        f.locator('#reset').click()
        assert f.locator('#pscene [data-rm-art-game]').count()>0
        counts[id]=frames
        page.evaluate('(id)=>location.hash=id+"/learn"',id);f=page.frame_locator('#screen');f.locator('#heading').wait_for()
        for w in (768,390):
            page.set_viewport_size({'width':w,'height':1024});assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),(id,w)
        page.set_viewport_size({'width':1440,'height':1080});print('PASS',id,frames,flush=True)
    assert not errors,errors
    print('PASS',counts,flush=True);b.close()

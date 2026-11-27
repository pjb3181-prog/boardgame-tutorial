from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import tempfile, io, json, os, subprocess, base64, threading
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
root=Path(__file__).resolve().parents[1]
standalone=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.15.0.html'))
mock=io.BytesIO();Image.new('RGB',(240,140),'#8aa894').save(mock,format='PNG');png=mock.getvalue()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    c=b.new_context(viewport={'width':1100,'height':800},accept_downloads=True)
    page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    # Sandbox blocks browser navigation and localStorage. Use real DOM with
    # a shared Storage-shaped in-memory substitute, explicitly NOT a persistence test.
    storage_js="""<script>window.__testStorage={};let mem=window.__testStorage;Object.defineProperty(window,'localStorage',{value:{get length(){return Object.keys(mem).length},key:i=>Object.keys(mem)[i],getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}}});</script>"""
    content=standalone.read_text().replace('<body>','<body>'+storage_js,1)
    page.set_content(content,wait_until='domcontentloaded');page.locator('#editionBtn').click();d=page.locator('#editionDialog');assert d.is_visible()
    assert d.locator('figure').count()==3;d.locator('figure img').first.evaluate('(im,data)=>{im.src=data}', 'data:image/png;base64,'+base64.b64encode(png).decode());d.locator('figure img').first.wait_for(state='visible')
    for id in ['race','roll','die-macher','raging-robots','euphoria','hadara','nusfjord']:
        d.locator('select').select_option(id);assert d.locator('.rm-meta').count()>=2;assert d.locator('.rm-links a').count()>=1
    d.locator('button').filter(has_text='닫기').first.click()
    page.evaluate('location.hash="nusfjord/quick"');f=page.frame_locator('#screen');f.locator('#title').wait_for();f.get_by_role('combobox',name='인원').select_option('4');f.locator('.entry input').first.check();page.wait_for_timeout(150)
    page.locator('#deviceBtn').click();d=page.locator('#deviceDialog');assert '저장 쓰기 검사 성공' in d.inner_text()
    with page.expect_download() as dl:d.get_by_role('button',name='전체 설정·사진 백업').click()
    saved=json.loads(Path(dl.value.path()).read_text());assert saved['records']['rm.hub.settings']['nusfjord']['n']==4;assert any(k.startswith('rm.check.nusfjord') and v==[0] for k,v in saved['records'].items());d.get_by_role('button',name='닫기').click()
    assert json.loads(page.evaluate('localStorage.getItem("rm.hub.settings")'))['nusfjord']['n']==4;assert page.evaluate('Object.keys(window.rmChecks).length')>=1
    # restore with different settings and sample personal photo
    saved['records']['rm.hub.settings']['nusfjord']={'n':2};saved['records']['rm.quick.nusfjord']={'n':2};saved['records']['rm.photos.nusfjord']={'fish':'data:image/png;base64,'+base64.b64encode(png).decode()};saved['records']['rm.check.nusfjord{"n":2}']=[0,1]
    page.locator('#deviceBtn').click();page.once('dialog',lambda x:x.accept());d=page.locator('#deviceDialog');d.locator('input[type=file]').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(saved).encode()});d.locator('.rm-import-result').get_by_text('복원 완료',exact=False).wait_for();d.get_by_role('button',name='닫기').click();f=page.frame_locator('#screen');f.locator('#title').wait_for();assert f.get_by_role('combobox',name='인원').input_value()=='2';assert f.locator('.entry.done').count()==2
    assert page.evaluate('Object.keys(window.rmPhotos.nusfjord).length')==1
    # Invalid backup image URIs cannot be inserted.
    assert page.evaluate("RMDevice.cleanBackup({format:'rulemaster-device-v1',records:{'rm.photos.nusfjord':{fish:'javascript:alert(1)'}}})['rm.photos.nusfjord'].fish===undefined")
    page.set_viewport_size({'width':390,'height':844});page.locator('#editionBtn').click();d=page.locator('#editionDialog');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert d.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1');d.get_by_role('button',name='닫기').click();page.locator('#deviceBtn').click();d=page.locator('#deviceDialog');assert d.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1');page.screenshot(path='/mnt/data/rulemaster-v0.15.0-tablet-storage.png');d.get_by_role('button',name='닫기').click()
    page.set_viewport_size({'width':1100,'height':800});page.locator('#editionBtn').click();page.locator('#editionDialog select').select_option('race');page.screenshot(path='/tmp/edition-layout-mock.png');assert not errors,errors
    print('PASS: 7 edition pages, mock image rendering, photo-safe backup export, import, simulated storage writes, mobile dialogs; real online image loads and browser restart persistence not tested')
    b.close()

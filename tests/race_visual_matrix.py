"""Check all data combinations and every visible scene in representative configurations."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
s=(root/'race.html').read_text()
for f in ['games/race.js','app/card-visuals.js','app/card-rulemaster.js']:
    s=s.replace(f'<script src="{f}"></script>', '<script>\n'+(root/f).read_text()+'\n</script>')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(s)
    counts=page.evaluate('''()=>{let configs=0,scenes=0,frames=0;for(let exp=0;exp<=3;exp++)for(let n=2;n<=[4,5,6,6][exp];n++)for(let takeover of (exp>=2?[false,true]:[false]))for(let advanced of(n===2?[false,true]:[false])){configs++;let C=makeRaceChapters({exp,n,takeover,advanced});for(const c of C){scenes++;const ids=new Set(c.state.map(p=>p.id));if(ids.size!==c.state.length)throw Error('duplicate '+c.id);for(let i=0;i<c.frames.length;i++){let f=c.frames[i];frames++;if(!f.text.trim()||f.patch.some(p=>!ids.has(p.id)))throw Error('invalid patch '+c.id);if(f.drag&&!f.patch.some(p=>p.id===f.drag.id&&p.x===f.drag.x&&p.y===f.drag.y))throw Error('drag '+c.id);if(!sceneState(c,i).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))throw Error('position '+c.id)}}let setup=C.find(c=>c.id==='setup'),s=sceneState(setup,setup.frames.length-1);if(s.filter(p=>p.id.startsWith('st')&&p.id!=='start'&&p.face).length!==n||s.find(p=>p.id==='bank').name!==`${n*12+(exp===3?5:0)} VP`)throw Error('setup '+exp+' '+n)}return {configs,scenes,frames}}''')
    print('All data configurations:',counts,flush=True)
    for exp in range(4):
        page.locator('#expansion').select_option(str(exp))
        if exp>=2:page.locator('#takeover').check()
        page.evaluate('''()=>{for(let i=0;i<chapters.length;i++){jump(i);let c=chapters[i];while(frame<c.frames.length-1)forward();if(!document.querySelector('#table g'))throw Error(c.id)}}''')
        assert not errors,errors
        print('Rendered all topics in configuration',exp,flush=True)
    page.locator('#takeover').uncheck();page.locator('#setupCount').select_option('2');page.locator('#advanced').check();page.evaluate("jump(chapters.findIndex(c=>c.id==='advanced'));while(frame<chapters[chapter].frames.length-1)forward()")
    assert not errors,errors;b.close()
print('PASS: data matrix and representative browser scenes')

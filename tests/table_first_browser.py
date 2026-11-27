"""Regression: first learn screen is a player-count-specific table, not a mechanics lesson."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.20.0.html'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':1040},reduced_motion='reduce')
    errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('http**://**/*',lambda r:r.abort())
    page.set_content(path.read_text(),wait_until='domcontentloaded')
    assert page.locator('.version').inner_text()=='v0.20.0'
    def route(r):
        page.evaluate('(r)=>location.hash=r',r)
        f=page.frame_locator('#screen'); f.locator('#heading').wait_for();return f
    f=route('nusfjord/learn');assert '전체 테이블 배치' in f.locator('#heading').inner_text();body=f.locator('body')
    for n in [2,3,4,5]:
        f.locator('#setupCount').select_option(str(n));body.evaluate('()=>jump(0)')
        assert body.evaluate('()=>chapters[0].state.filter(p=>p.type==="playerKit").length')==n
        assert body.evaluate('()=>chapters[0].state.filter(p=>p.type==="overviewPlate"&&p.lines[0]==="filled").length')==n-1
        assert f.locator('#table [data-rm-art]').count()>=24
        assert body.evaluate('()=>chapters[1].title.includes("공용판 준비")')
    page.screenshot(path='/mnt/data/rulemaster-v0.20.0-nusfjord-table.png',full_page=True)
    f=route('race/learn');assert '전체 테이블 배치' in f.locator('#heading').inner_text();body=f.locator('body')
    count=body.evaluate('''()=>{let total=0;for(let exp=0;exp<=3;exp++)for(let n=2;n<=[4,5,6,6][exp];n++)for(let takeover of(exp>=2?[false,true]:[false]))for(let advanced of(n===2?[false,true]:[false])){let C=makeRaceChapters({exp,n,takeover,advanced}),v=C[0];if(v.id!=='tableOverview'||v.state.filter(p=>p.id.startsWith('mapWorld')).length!==n||v.state.filter(p=>p.id.startsWith('mapHand')).length!==n||v.state.find(p=>p.id==='mapVP').name!==`${n*12+(exp===3?5:0)} VP`||v.state.filter(p=>p.type==='goal').length!==(exp?6:0)||C.findIndex(c=>c.id==='setup')>C.findIndex(c=>c.id==='anatomy'))throw Error('invalid table '+[exp,n,takeover,advanced]);total++}return total}''');assert count==33
    assert f.locator('#table [data-rm-galaxy-art]').count()>0
    page.screenshot(path='/mnt/data/rulemaster-v0.20.0-race-table.png',full_page=True)
    f=route('roll/learn');assert '전체 테이블 배치' in f.locator('#heading').inner_text()
    for n in range(2,6):
        for exp,goal in [('base',False),('amb',False),('amb',True)]:
            f.locator('#count').select_option(str(n));f.locator('#expansion').select_option(exp)
            if exp=='amb':f.locator('#goals').set_checked(goal)
            assert f.locator('.rm-overview-seat').count()==n
            assert f.locator('.rm-ov-goal').count()==(6 if goal else 0)
            assert f.locator('.rm-overview-seat .rm-ov-cup .dice').count()==n*3
            assert f.locator('.rm-overview-seat .rm-ov-mat .dice').count()==n*2
            assert f.locator('.rm-overview-seat [data-tile]').count()==n*5
            assert f.locator('body').evaluate('()=>rollDebug.lessons[1].group')=='게임 준비'
    f.locator('#goals').set_checked(False);page.screenshot(path='/mnt/data/rulemaster-v0.20.0-roll-table.png',full_page=True)
    for name in ['die-macher','raging-robots','euphoria','hadara']:
        f=route(name+'/learn');assert '전체 테이블 배치' in f.locator('#heading').inner_text(),name
        assert f.locator('#scene.rm-table-overview .zone').count()==6
        assert '테이블 중앙' in f.locator('#scene .zone').nth(3).inner_text()
        page.screenshot(path=f'/mnt/data/rulemaster-v0.20.0-{name}-table.png',full_page=True)
        f.locator('#next').click();assert f.locator('#scene.rm-table-overview').count()==0
    page.set_viewport_size({'width':768,'height':1024})
    for name in ['nusfjord','race','roll','die-macher','raging-robots','euphoria','hadara']:
        f=route(name+'/learn');assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),name
    assert not errors,errors
    print('PASS 7 first table routes; 4 Nusfjord counts, 33 Race configurations, 12 Roll configurations; offline illustrations; tablet width; no JS errors',flush=True)
    b.close()

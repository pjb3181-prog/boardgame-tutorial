"""Browser regression: authored board geometry, real motion, responsive containment and all practice routes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
HTML=Path(os.environ['RULEMASTER_HTML'])
shots=Path(os.getenv('QA_SHOTS','/tmp/rulemaster-quality'));shots.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.getenv('CHROMIUM') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='no-preference');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('http**://**/*',lambda r:r.abort());page.set_content(HTML.read_text(),wait_until='domcontentloaded')
 def route(g,mode='learn'):
  page.evaluate('r=>location.hash=r',g+'/'+mode);f=page.frame_locator('#screen');f.locator('#rmMotionSpeed').wait_for();return f
 def topic(f,t):f.locator('#chapters button').filter(has_text=t).first.click()
 def coords(board):return board.evaluate('e=>[...e.querySelectorAll("[data-slot]")].map(s=>{const r=s.getBoundingClientRect(),b=e.getBoundingClientRect();return [s.dataset.slot,Math.round(r.x-b.x),Math.round(r.y-b.y),Math.round(r.width),Math.round(r.height)]})')
 def check_layout(f,g,t):
  assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth'),(g,t,'horizontal overflow')
  bad=f.locator('#scene').evaluate('e=>[...e.querySelectorAll("[data-teach-id]")].filter(x=>{const a=x.getBoundingClientRect(),b=x.closest("[data-slot]").getBoundingClientRect();return a.left<b.left-4||a.right>b.right+4||a.top<b.top-4||a.bottom>b.bottom+4}).map(x=>[x.dataset.teachId,x.textContent.slice(0,35)])')
  assert not bad,(g,t,'piece overflow',bad)
 cases={'die-macher':['언론 마커 구매','유세를 지역별로 구매','언론으로 여론 변경','유세를 표로 전환'],'raging-robots':['조립: 에너지와 자원을 지불','설계·제작·재활용: 엔진 실행','업그레이드: 잠금 해제'],'euphoria':['내 차례의 두 가지 기본 선택','일꾼을 밀어내는 칸과 공유 칸','회수와 사기','지식 검사: 합계 16','시장 건설: 함께 비용'],'hadara':['두 장 뽑고, 하나 버리고','수입·식민지·조각상 후 식량 확인','수입 받기와 식민지 선택'],'roll':['행동 하나를 직접 선택','II 개발: 공사 중인 주사위','III 정착: 새 행성과 주사위','IV 생산: 주사위가 상품','제국 관리: 모집과 회수']}
 total=0
 for g,topics in cases.items():
  f=route(g);f.locator('#rmMotionSpeed').select_option('0')
  for i,t in enumerate(topics):
   topic(f,t);board=f.locator('#scene');assert board.evaluate('e=>e.classList.contains("rm-fixed-teaching")'),(g,t)
   original=coords(board);n=int(f.locator('#counter').inner_text().split('/')[1].split()[0]);assert n>=2
   for j in range(n):
    assert coords(board)==original,(g,t,j,'slot changed')
    ids=board.locator('[data-teach-id]').evaluate_all('xs=>xs.map(x=>x.dataset.teachId)');assert len(ids)==len(set(ids)),(g,t,j,'duplicate piece')
    assert f.locator('.rm-teach-guide').is_visible()
    check_layout(f,g,t)
    if j==0 and i==0:page.screenshot(path=str(shots/(g+'-desktop.png')))
    if j+1<n:f.locator('#next').click()
   total+=n
   page.set_viewport_size({'width':390,'height':844});topic(f,t);page.wait_for_timeout(50)
   for j in range(n):
    check_layout(f,g,t)
    if j==0 and i==0:page.screenshot(path=str(shots/(g+'-mobile.png')))
    if j+1<n:f.locator('#next').click()
   page.set_viewport_size({'width':1440,'height':1000});print('PASS',g,t,n,flush=True)
  topic(f,topics[0]);f.locator('#rmMotionSpeed').select_option('0.6');b0=f.locator('#scene');firstpos=coords(b0)
  piece={'die-macher':'pay','raging-robots':'r','euphoria':'d0','hadara':'b','roll':'B'}[g]
  if g=='raging-robots':f.locator('#next').click();f.locator('.rm-teach-finish').click()
  e=b0.locator('[data-teach-id="'+piece+'"]');src=e.evaluate('e=>e.closest("[data-slot]").dataset.slot');e.evaluate('e=>window.__testPiece=e');f.locator('#next').click()
  assert not f.locator('#next').is_enabled(),g
  assert e.evaluate('e=>e===window.__testPiece'),(g,'identity')
  assert e.evaluate('e=>e.closest("[data-slot]").dataset.slot')==src,(g,'early reparent')
  assert e.evaluate('e=>e.getAnimations().some(a=>a.effect.getKeyframes().some(k=>(k.transform||"").includes("translate")))'),g
  page.wait_for_timeout(400);page.screenshot(path=str(shots/(g+'-moving.png')))
  f.locator('.rm-teach-finish').click();assert f.locator('#next').is_enabled();assert e.evaluate('e=>e.closest("[data-slot]").dataset.slot')!=src
  assert coords(b0)==firstpos
  f.locator('#replay').click();f.locator('.rm-teach-finish').wait_for();f.locator('.rm-teach-finish').click();print('PASS real motion and replay',g,flush=True)
 for g in ['nusfjord','race']:
  f=route(g);f.locator('#rmMotionSpeed').select_option('0.6');f.locator('#sidebar button').filter(has_text='어획' if g=='nusfjord' else '개발').first.click();found=False
  for i in range(10):
   if not f.locator('#next').is_enabled():break
   f.locator('#next').click()
   if f.locator('.rm-svg-guide button').is_visible():found=True;assert not f.locator('#next').is_enabled();f.locator('.rm-svg-guide button').click();break
  assert found,g;assert f.locator('#table .piece').count()>0;print('PASS SVG guard',g,flush=True)
 for g in [*cases,'nusfjord','race']:
  f=route(g,'practice');f.locator('#rmPracticeGuide').wait_for();assert f.locator('.rm-guide-action:not(:disabled)').count()>0,g;print('PASS practice',g,flush=True)
 assert not errors,errors
 assert total==82,total
 print('TOTAL curated steps',total,'overflow instances 0',flush=True)
 b.close()

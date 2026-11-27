from pathlib import Path
from playwright.sync_api import sync_playwright
import os, base64, io
from PIL import Image
img=io.BytesIO();Image.new("RGBA",(24,24),(31,130,220,255)).save(img,format="PNG")
path=Path(os.getenv('RULEMASTER_HTML','/mnt/data/boardgame-rulemaster-v0.14.0.html'))
ids=['nusfjord','race','die-macher','raging-robots','euphoria','hadara','roll']
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];misses=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda msg:misses.append(msg.text) if 'topic not found' in msg.text else None)
 # Sandbox blocks file:// navigation; exercise exact packed HTML via set_content.
 page.set_content(path.read_text(),wait_until='domcontentloaded')
 def route(s):
  page.evaluate('(s)=>location.hash=s',s);page.wait_for_function('s=>location.hash==="#"+s',arg=s);page.wait_for_timeout(120)
  return page.frame_locator('#screen')
 def tab(f,t):f.get_by_role('button',name=t,exact=True).click()
 page.screenshot(path='/mnt/data/rulemaster-v0.14.0-home.png')
 count=0
 for g in ids:
  f=route(g+'/quick');f.locator('#title').wait_for();assert f.locator('.entry').count()>=3
  for t in ['진행 순서','자주 헷갈리는 룰','종료·점수','세팅']:
   tab(f,t);assert f.locator('.entry').count()>0
  f.locator('.entry input').first.check();assert f.locator('.entry.done').count()==1
  f.locator('#search').fill('a_fake_unknown_word');assert f.locator('.empty').is_visible();f.locator('#search').fill('')
  if g=='nusfjord':
   f.get_by_role('combobox',name='인원').select_option('3');assert '9장' in f.locator('#stats').inner_text();assert '2마리' in f.locator('#stats').inner_text();f.get_by_role('combobox',name='인원').select_option('5');assert f.locator('.entry').count()==6
   page.screenshot(path='/mnt/data/rulemaster-v0.14.0-nusfjord-quick.png')
  if g=='race':
   f.get_by_role('combobox',name='구성').select_option('0');assert f.get_by_role('combobox',name='인원').input_value()=='4';assert '48점' in f.locator('#stats').inner_text();f.get_by_role('combobox',name='구성').select_option('3');f.get_by_role('combobox',name='인원').select_option('5');assert '65점' in f.locator('#stats').inner_text();tab(f,'진행 순서');page.screenshot(path='/mnt/data/rulemaster-v0.14.0-race-quick.png');tab(f,'세팅')
  if g=='roll':
   f.get_by_role('combobox',name='구성').select_option('false');assert '55장' in f.locator('#stats').inner_text();f.get_by_role('combobox',name='구성').select_option('true');f.get_by_role('checkbox',name='목표 타일 사용').check();assert '목표 20 중 6장' in f.locator('#content').inner_text()
  if g=='euphoria':f.get_by_role('combobox',name='구성').select_option('new');assert '바자르' in f.locator('#content').inner_text()
  # Every default reminder topic must lead to a real tutorial chapter (not just start at the beginning).
  data=f.locator('body').evaluate('()=>quickDebug.data')
  for section in ['setup','flow','rules','end']:
   for i,row in enumerate(data[section]):
    if os.getenv('QUICK_SMOKE') and i>0:continue
    f=route(g+'/quick');f.locator('#title').wait_for();tab(f,{'setup':'세팅','flow':'진행 순서','rules':'자주 헷갈리는 룰','end':'종료·점수'}[section]);f.locator('.entry').nth(i).get_by_role('button',name='기물 시연 →').click();page.wait_for_timeout(150)
    l=page.frame_locator('#screen');l.locator('#heading').wait_for();heading=l.locator('#heading').inner_text();
    if row['topic'] not in heading:misses.append(f'{g}: {row["topic"]} -> {heading}')
    count+=1
  print('PASS quick routes',g,flush=True)
 # settings roundtrip and photo override, mobile layout
 f=route('nusfjord/quick');f.get_by_role('combobox',name='인원').select_option('4');f.locator('.entry').first.get_by_role('button',name='기물 시연 →').click();page.wait_for_timeout(200);l=page.frame_locator('#screen');assert l.locator('#setupCount').input_value()=='4';l.locator('#setupCount').select_option('2');f=route('nusfjord/quick');assert f.get_by_role('combobox',name='인원').input_value()=='2';f.get_by_role('combobox',name='인원').select_option('5');tab(f,'실물 사진');
 f.locator('select').last.select_option('fish');f.locator('input[type=file]').first.set_input_files({'name':'test-fish.png','mimeType':'image/png','buffer':img.getvalue()});page.wait_for_timeout(500);print('photo status',f.locator('#photoStatus').inner_text(),flush=True)
 f=route('nusfjord/learn');f.locator('#sidebar button').filter(has_text='첫 라운드: 물고기').click();page.wait_for_timeout(150);assert f.locator('g[data-piece] image').count()>0,'photo override missing';
 f=route('nusfjord/quick');tab(f,'실물 사진');f.get_by_role('button',name='삭제',exact=True).first.click();f=route('nusfjord/learn');f.locator('#sidebar button').filter(has_text='공용판 준비하기').click();page.wait_for_timeout(150);f.locator('#next').click();page.screenshot(path='/mnt/data/rulemaster-v0.14.0-nusfjord-setup.png');
 page.set_viewport_size({'width':390,'height':844});f=route('roll/quick');f.locator('#title').wait_for();assert f.locator('body').evaluate('(e)=>e.scrollWidth<=innerWidth');page.screenshot(path='/mnt/data/rulemaster-v0.14.0-mobile.png');
 print('topics',count,'misses',misses,'errors',errors,flush=True)
 assert not misses and not errors,(misses,errors)
 b.close()

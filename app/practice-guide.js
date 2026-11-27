/* Practice guidance only. All actions continue through the existing validated reducers. */
(function(root){
'use strict';
const q=(el,sel)=>[...el.querySelectorAll(sel)];
const enabled=xs=>xs.filter(b=>!b.disabled&&!b.hidden);
const label=b=>b.getAttribute('aria-label')||b.textContent.trim().replace(/\s+/g,' ');
function jump(el){if(!el)return;el.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});if(el.matches('button'))el.focus({preventScroll:true});}
function show(anchor,options){
  const d=anchor.ownerDocument;
  const container=options.container||anchor.parentElement;
  q(container,'.rm-guide-action,.rm-guide-required,.rm-guide-target,.rm-guide-linked').forEach(e=>e.classList.remove('rm-guide-action','rm-guide-required','rm-guide-target','rm-guide-linked'));
  let box=d.getElementById('rmPracticeGuide');
  if(!box){
    box=d.createElement('section');box.id='rmPracticeGuide';box.className='rm-practice-guide';
    box.innerHTML='<div class="rm-guide-main"><div><strong class="rm-guide-title">지금 할 일</strong><div class="rm-guide-message" aria-live="polite"></div></div><button type="button" class="rm-guide-jump">누를 곳으로 이동 ↓</button></div><div class="rm-guide-meta"></div><div class="rm-guide-result" aria-live="polite"></div><div class="rm-guide-selection" hidden></div>';
    anchor.before(box);
  }
  const buttons=enabled(options.buttons||[]);
  const targets=(options.targets||[]).filter(Boolean);
  buttons.forEach(b=>b.classList.add('rm-guide-action'));
  if(buttons.length===1)buttons[0].classList.add('rm-guide-required');
  targets.forEach(b=>b.classList.add('rm-guide-target'));
  box.querySelector('.rm-guide-title').textContent=options.done?'연습 결과':'지금 할 일';
  box.querySelector('.rm-guide-message').textContent=options.message;
  const meta=box.querySelector('.rm-guide-meta');
  meta.textContent=options.done?'':buttons.length===1?'노란 테두리 버튼을 누르세요: '+label(buttons[0]):buttons.length?'노란 테두리 '+buttons.length+'개 중 선택하세요. 다른 기물은 확인용입니다.':'';
  if(targets.length&&!options.done)meta.textContent+=' 파란 테두리는 이번 행동과 관련된 기물/구역입니다.';
  if(options.extra)meta.textContent+=' '+options.extra;
  const result=box.querySelector('.rm-guide-result');
  result.textContent=options.last?'최근 진행: '+options.last:'';
  result.hidden=!options.last;
  const selection=box.querySelector('.rm-guide-selection');selection.hidden=true;selection.replaceChildren();
  const go=box.querySelector('.rm-guide-jump');
  go.hidden=!buttons.length;go.onclick=()=>jump(buttons[0]);
  return {box,link(piece,actions){
    const choices=enabled(actions);
    if(!piece||!choices.length)return;
    piece.classList.add('rm-guide-target');
    const original=piece.onclick;
    piece.title='관련 선택지 강조 · '+label(piece);
    piece.onclick=()=>{
      q(container,'.rm-guide-linked').forEach(e=>e.classList.remove('rm-guide-linked'));
      piece.classList.add('rm-guide-linked');choices.forEach(b=>b.classList.add('rm-guide-linked'));
      selection.hidden=false;selection.replaceChildren();
      const description=d.createElement('span');description.textContent='선택: '+label(piece)+' — 강조된 행동 버튼을 눌러 실행하세요.';selection.append(description);
      if(original){const inspect=d.createElement('button');inspect.type='button';inspect.textContent='기물 확대';inspect.onclick=()=>original.call(piece);selection.append(inspect);}
      jump(choices[0]);
    };
  }};
}
function expanded(state,view,board,choices){
 const bs=enabled(q(choices,'button[data-action]'));
 const by=id=>bs.filter(b=>b.dataset.action===id);
 const targets=[],links=[];
 const pieces=q(board,'[data-piece]');
 const piece=id=>pieces.find(b=>b.dataset.piece===id);
 const zone=i=>board.querySelectorAll('.zone')[i];
 const add=(id,acts)=>{const p=piece(id);if(p&&acts.length){targets.push(p);links.push([p,acts]);}};
 let msg='';
 if(state.done)msg='연습이 끝났습니다. 결과를 확인하거나 처음부터 다시 시작하세요.';
 else if(state.id==='die-macher'){
   const msgs=['언론을 추가할지 패스할지 선택하세요.','추가할 유세 수량을 고르세요.','교통 여론을 변경하거나 넘어가세요.','여론조사 낙찰 및 공개 여부를 선택하세요.','득표 정산 버튼을 눌러 결과를 확인하세요.'];
   msg=msgs[state.step];
   if([0,1,2,4].includes(state.step))targets.push(zone({0:0,1:1,2:2,4:3}[state.step]));
   if(state.step===2)add('traffic',by('shift'));
 }else if(state.id==='raging-robots'){
   msg=['에너지 카드 A와 B를 조립·설계에 배정하세요.','조립에 추가할 배터리 수를 선택하세요.','로봇 조립 비용을 고르거나 건너뛰세요.','설계에 추가할 배터리 수를 선택하세요.','설계 로봇 A의 실행 여부를 선택하세요.','설계 로봇 B의 실행 여부를 선택하세요.'][state.step];
   if(state.step===0){add('a',by('a'));add('b',by('b'));}
   if(state.step===1||state.step===3)targets.push(zone(1));
   if(state.step===2)add('rob',bs.filter(b=>['cheap','exp'].includes(b.dataset.action)));
   if(state.step===4)add('ra',by('use'));
   if(state.step===5)add('rb',by('use'));
 }else if(state.id==='euphoria'){
   msg=state.available.length?'사용할 파란 주사위와 배치할 상품칸을 선택하세요. 또는 판 위의 일꾼을 회수하세요.':'판 위 일꾼을 회수하세요. 사용할 수 있는 회수 방법 중 하나를 고르세요.';
   for(const x of state.available)add(x.id,bs.filter(b=>b.dataset.action.startsWith('place:'+x.id+':')));
   for(let i=0;i<3;i++)if(bs.some(b=>b.dataset.action.startsWith('place:')&&b.dataset.action.endsWith(':'+i)))targets.push(zone(i+1));
   if(!state.available.length)for(const x of state.placed)add(x.id,bs.filter(b=>['retrieve','paid'].includes(b.dataset.action)));
 }else if(state.id==='hadara'){
   msg=({a:'두 카드 중 하나를 고른 뒤 구매 또는 판매 버튼을 누르세요.',b:'공개 더미에서 원하는 색 카드를 고른 뒤 구매 또는 판매하세요.',incomeA:'수입 받기를 눌러 동전을 추가하세요.',incomeB:'수입 받기를 눌러 동전을 추가하세요.',feed:'식량을 확인하고 부족하면 제거할 카드를 고르세요.',medal:'구매할 메달을 선택하거나 시대 I 연습을 종료하세요.'})[state.stage];
   if(state.stage==='a')for(let j=0;j<2;j++)add('h'+state.a+'-'+j,[...by('buy'+j),...by('sell'+j)]);
   if(state.stage==='b')state.piles.forEach((p,i)=>{if(p.length)add(p[p.length-1].id,[...by('buy'+i),...by('sell'+i)]);});
   if(state.stage==='feed')for(const x of state.owned)add(x.id,by('remove:'+x.id));
 }
 const g=show(choices,{container:choices.parentElement,buttons:bs,targets,message:msg||view.prompt,done:state.done,extra:links.length?'파란 테두리 기물을 눌러 관련 행동만 강조할 수도 있습니다.':'',last:state.log.at(-1)});
 for(const [p,a] of links)g.link(p,a);
}
function scenario(s,isRace,selected,pending,engine,content,hasHistory){
 const all=q(content,'button[data-do]:not([disabled])').filter(b=>b.dataset.do!=='view');
 let bs=all,msg='',extra='';
 if(!isRace){
   if(s.phase==='fish'){
     const next=engine.nfishTarget(s);bs=all.filter(b=>b.dataset.do==='fish'&&b.dataset.id===next);
     msg='생선 '+s.catch+'마리 남음. 표시된 목적지에 한 마리씩 배분하세요.';
     extra='다른 목적지는 이후 순서에 사용합니다.';
   }else if(s.phase==='work'&&pending){bs=all.filter(b=>b.dataset.do==='nconfirm'||b.dataset.do==='cancel');msg='선택한 행동의 세부 옵션을 확정하세요. 취소도 가능합니다.';}
   else if(s.phase==='work'){bs=all.filter(b=>b.dataset.do==='nact');msg='공용 행동판에서 노란 테두리 행동칸 하나를 누르면 내 일꾼을 배치합니다.';}
   else if(s.phase==='return')msg='일꾼 회수 버튼을 눌러 라운드를 마무리하세요.';
 }else{
   msg=({choose:'노란 테두리 행동 카드 중 하나를 직접 누르세요.',reveal:'첫 단계 진행 버튼을 누르세요.',explore:'가져갈 카드 '+selected.length+'/'+(s.pending?.count||0)+'장 선택 후 유지 버튼을 누르세요.',build:'건설 가능한 카드 하나를 직접 누르거나 건설을 건너뛰세요.',pay:'비용 카드 '+selected.length+'/'+(s.pending?.count||0)+'장을 골라 비용 지불을 누르세요.',trade:'상품이 있는 행성 카드 중 판매할 카드를 직접 누르세요.',consume:'소비할 상품이 있는 행성 카드를 직접 누르세요.',produce:'생산 진행 버튼을 누르세요.',windfall:'추가 생산할 일회성 행성 카드를 누르세요.',limit:'버릴 카드 '+selected.length+'/'+(s.pending?.count||0)+'장을 골라 정리 완료를 누르세요.',roundEnd:'다음 라운드로 진행하세요.'})[s.phase]||'';
   if(['explore','pay','limit'].includes(s.phase)&&selected.length===s.pending.count){
     bs=all.filter(b=>b.dataset.do!=='select'||selected.includes(b.dataset.id));
     extra='선택 수량을 채웠습니다. 확정하거나 기존 선택 카드를 다시 눌러 취소할 수 있습니다.';
   }
 }
 const done=s.phase==='done';
 if(done)msg='연습 완료. 다시 연습하거나 전체 룰 설명으로 돌아갈 수 있습니다.';
 const anchor=content.querySelector('.summary-stats')||content.firstElementChild;
 show(anchor,{container:content,buttons:bs,message:msg||'강조된 행동을 선택하세요.',extra,done,last:hasHistory?s.log[0]:''});
}
function roll(s,current,selected,scene,choices,hasHistory){
 const bs=enabled(q(choices,'button[data-act]'));
 const ps=q(scene,'[data-piece]');
 const piece=id=>ps.find(x=>x.dataset.piece===id);
 let targets=[],msg='';
 if(s.stage==='roll'){msg='주사위 굴리기 버튼을 누르세요. 컵에 있는 주사위가 굴러갑니다.';targets.push(scene.querySelector('.cup')?.closest('.zone'));}
 if(s.stage==='assign'){
   msg=s.selected===null?'행동 띠의 주사위를 선택한 뒤, 실행할 행동 하나를 선택하세요.':'필요하면 주사위를 추가 배정하거나 명령을 사용한 뒤 모두 공개를 누르세요.';
   targets=ps.filter(e=>e.hasAttribute('data-pick')&&s.loc[e.dataset.piece]==='assigned'&&e.dataset.piece!==s.selector);
   if(selected)targets.push(piece(selected.id));
 }
 if(s.stage==='phase'){
   msg=current?'현재 행동을 수행할 주사위와 작업 선택지를 확인하세요.':'현재 행동 종료 / 다음 행동 버튼을 누르세요.';
   if(current)targets.push(piece(current.id));
   for(const b of bs){let arg;try{arg=JSON.parse(b.dataset.arg)}catch{}if(['produce','trade','consume'].includes(b.dataset.act))targets.push(piece(arg));if(b.dataset.act==='build')targets.push(piece(s[s.current===1?'dev':'world'][0]?.id));}
 }
 if(s.stage==='manage'){
   msg='시민 구역의 주사위를 모집하고, 필요한 경우 공사·상품 주사위를 회수한 뒤 관리 완료를 누르세요.';
   for(const b of bs)if(['recruit','recall'].includes(b.dataset.act))targets.push(piece(b.dataset.id));
 }
 if(s.stage==='done')msg='연습이 끝났습니다. 결과를 확인하거나 다시 연습하세요.';
 show(choices,{container:choices.parentElement,buttons:bs,targets,message:msg||'강조된 행동을 선택하세요.',extra:s.stage==='assign'?'파란 테두리 주사위는 직접 선택할 수 있습니다.':'',done:s.stage==='done',last:hasHistory?s.log.at(-1):''});
}
root.RMPracticeGuide={show,expanded,scenario,roll};
})(window);

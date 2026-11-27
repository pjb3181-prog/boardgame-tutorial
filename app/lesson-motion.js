/* Lesson-only before/after demonstrations. Never changes the authored rule states.
   Visual groups describe differences, not a newly inferred rules/action order. */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg',sessions=new WeakMap();
const short=s=>String(s??'').replace(/\s+/g,' ').trim();
const title=s=>short(s).slice(0,88);
const timing=n=>RMMotion.ms(n);
const typeNames={fish:'물고기',wood:'목재',coin:'금화',worker:'일꾼',turnShip:'선 플레이어 배',forest:'숲',share:'주식',elder:'원로',building:'건물',ship:'선박',card:'카드',action:'행동 카드',stack:'카드 더미',vp:'승점 칩',prestige:'명성 칩',goal:'목표 타일',leader:'선두 타일'};
function panel(target){
 let p=target.parentNode.querySelector(':scope > .rm-lesson-motion');
 if(!p){
   p=document.createElement('section');p.className='rm-lesson-motion';p.setAttribute('aria-label','기물 변화 시연');
   p.innerHTML='<div class="rm-lm-header"><div><small class="rm-lm-overline">기물 변화 시연</small><strong class="rm-lm-status" aria-live="polite"></strong></div><button type="button" class="rm-lm-skip" hidden>시연 건너뛰기 ↠</button></div><div class="rm-lm-text"></div><div class="rm-lm-progress" aria-hidden="true"><i></i></div><div class="rm-lm-changes"></div>';
   target.before(p);
 }
 return p;
}
function finish(target,completed=true){
 const s=sessions.get(target);if(!s)return;
 sessions.delete(target);for(const t of s.timers)clearTimeout(t);
 for(const a of s.animations)try{a.cancel()}catch{}
 for(const x of s.overlays)x.remove();
 for(const x of s.changed)x.classList.remove('rm-lm-changing');
 if(s.next)s.next.disabled=s.disabled;
 target.classList.remove('rm-lm-running');target.dataset.rmLessonStage=completed?'done':'idle';
 if(s.p){s.p.querySelector('.rm-lm-skip').hidden=true;s.p.querySelector('.rm-lm-status').textContent='시연 완료 · 결과 확인';s.p.querySelector('.rm-lm-text').textContent='아래 보드는 이번 설명의 결과입니다. 다시 시연을 누르면 과정을 한 번 더 볼 수 있습니다.';s.p.querySelector('.rm-lm-progress i').style.width='100%';}
}
function label(p){return title(p.name||typeNames[p.type]||'기물');}
function svgZone(p,areas){
 return title([...areas].reverse().find(a=>p.x>=a.x&&p.x<=a.x+a.w&&p.y>=a.y&&p.y<=a.y+a.h)?.title||'보드');
}
function tagSVG(g,p,areas){
 g.dataset.rmLessonLabel=label(p);g.dataset.rmLessonZone=svgZone(p,areas);
 g.dataset.rmLessonValue=title([p.name,p.value,p.count!==undefined?p.count+'장':'',p.back||p.faceDown?'뒷면':'',p.type==='share'?(p.issued?'발행':'미발행'):''].filter(v=>v!==undefined&&v!==null&&v!=='').join(' · '));
}
function zoneHTML(e){
 const column=e.closest('.column'),mat=e.closest('.rm-mat-slot'),tile=e.closest('.tilewrap'),zone=e.closest('.zone');
 if(column)return title(column.querySelector('.phase')?.textContent||'행동 띠');
 if(mat)return title(mat.querySelector('b')?.textContent||'개인판');
 if(tile&&e.matches('.dice'))return title((tile.querySelector('.tname')?.textContent||'타일')+' · '+(e.closest('.goods')?'상품':'공사'));
 return title(zone?.querySelector('h3')?.childNodes[0]?.textContent||zone?.querySelector('h3')?.textContent||'보드');
}
function infoHTML(e){
 let t;try{t=JSON.parse(e.dataset.tile||'null')}catch{}
 return {label:title(t?.name||e.querySelector('.caption,.tname')?.textContent||e.getAttribute('aria-label')||e.textContent)||'기물',value:title(e.getAttribute('aria-label')||e.textContent),sig:e.dataset.die||e.dataset.tile||e.getAttribute('aria-label')||short(e.textContent)};
}
function snapshot(target,nodes){
 const result=new Map(),svg=!!nodes,base=target.getBoundingClientRect();
 for(const [id,e] of svg?[...nodes]:[...target.querySelectorAll('[data-piece]')].map(e=>[e.dataset.piece,e])){
   if(!id||result.has(id)||e.closest('.rm-lm-overlay')||e.getAttribute('aria-hidden')==='true'||e.style.opacity==='0')continue;
   let r=e.getBoundingClientRect();if(!r.width||!r.height||!Number.isFinite(r.left))continue;
   let info=svg?{label:e.dataset.rmLessonLabel||'기물',value:e.dataset.rmLessonValue||'',sig:e.dataset.kind||e.dataset.shape||''}:infoHTML(e);
   result.set(id,{id,e,clone:e.cloneNode(true),x:svg?+e.dataset.x:r.left-base.left,y:svg?+e.dataset.y:r.top-base.top,w:r.width,h:r.height,zone:svg?e.dataset.rmLessonZone||'보드':zoneHTML(e),...info});
 }
 return result;
}
function before(target,nodes){finish(target,false);panel(target);return snapshot(target,nodes);}
function describe(kind,a,b){
 if(kind==='move')return (a.zone===b.zone?a.zone:a.zone+' → '+b.zone)+' · '+b.label+(a.sig!==b.sig&&a.value!==b.value?' ('+a.value+' → '+b.value+')':'');
 if(kind==='change')return b.label+(a.value&&b.value&&a.value!==b.value?' · '+a.value+' → '+b.value:' · 표시/면 변경');
 if(kind==='add')return b.zone+' · '+b.label+' 나타남';
 return a.zone+' · '+a.label+' 사라짐';
}
function plan(old,fresh,svg){
 const moves=[],changes=[],adds=[],removes=[];
 for(const [id,b] of fresh){
   const a=old.get(id);
   if(!a){adds.push({kind:'add',b});continue}
   const distance=Math.hypot(a.x-b.x,a.y-b.y),changed=a.sig!==b.sig;
   if((svg&&distance>10)||(!svg&&a.zone!==b.zone&&distance>8))moves.push({kind:'move',a,b});
   else if(changed)changes.push({kind:'change',a,b});
 }
 for(const [id,a] of old)if(!fresh.has(id))removes.push({kind:'remove',a});
 // Group actual moves by source/destination; use at most three movement groups,
 // keeping remaining changes in a comparison group, not asserting game order.
 const by=new Map();for(const e of moves){const k=e.a.zone+'→'+e.b.zone;if(!by.has(k))by.set(k,[]);by.get(k).push(e)}
 const groups=[...by.values()];
 if(groups.length>3)groups.splice(2,groups.length-2,groups.slice(2).flat());
 const out=groups.map(events=>({name:'기물 이동',events}));
 if(changes.length)out.push({name:'카드 면·자원·표시 변화',events:changes});
 if(removes.length)out.push({name:'사용·제거된 기물 확인',events:removes});
 if(adds.length)out.push({name:'새로 나타난 기물 확인',events:adds});
 return out;
}
function summary(group){
 const counts=new Map();
 for(const e of group.events){const k=describe(e.kind,e.a,e.b);counts.set(k,(counts.get(k)||0)+1)}
 return [...counts].map(([s,n])=>s+(n>1?' × '+n:''));
}
function cleanClone(e){
 e.removeAttribute('id');e.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
 e.setAttribute('aria-hidden','true');e.setAttribute('inert','');e.classList.remove('movable','inspectable','rm-lm-changing');
 e.style.transition='none';e.style.pointerEvents='none';return e;
}
function run(target,old,{nodes=null,animate=true,next=null,heading=''}={}){
 const p=panel(target),status=p.querySelector('.rm-lm-status'),txt=p.querySelector('.rm-lm-text'),list=p.querySelector('.rm-lm-changes'),bar=p.querySelector('.rm-lm-progress i'),skip=p.querySelector('.rm-lm-skip');
 const fresh=snapshot(target,nodes),groups=animate&&old.size?plan(old,fresh,!!nodes):[];
 const showStatic=()=>{
   target.dataset.rmLessonStage='idle';skip.hidden=true;bar.style.width='100%';list.replaceChildren();
   status.textContent=groups.length?'시연 결과 · 애니메이션 끔':animate?'현재 기물 상태':'시연 전 · 배치 확인';
   txt.textContent=groups.length?'설정 또는 접근성 환경에 따라 결과를 바로 표시합니다.':animate?'이 설명은 기물의 이동 없이 현재 상태를 설명하거나 같은 배치를 사용합니다.':'다음 설명을 누르면 기물 변화가 있는 단계에서 시연이 시작됩니다.';
   if(groups.length)for(const g of groups)appendSummary(list,g);
 };
 if(!groups.length||!RMMotion.on()){showStatic();return}
 const s={p,next,disabled:next?.disabled,animations:[],timers:[],overlays:[],changed:new Set()};
 sessions.set(target,s);target.dataset.rmLessonStage='before';target.classList.add('rm-lm-running');if(next)next.disabled=true;
 skip.hidden=false;skip.onclick=()=>finish(target);
 const schedule=(fn,t)=>s.timers.push(setTimeout(()=>{if(sessions.get(target)===s)fn()},t));
 const animation=(e,frames,delay,duration)=>{try{const a=e.animate(frames,{delay,duration,fill:'both',easing:'cubic-bezier(.25,.7,.25,1)'});s.animations.push(a)}catch{}};
 const svg=!!nodes,layer=svg?document.createElementNS(NS,'g'):document.createElement('div');layer.setAttribute('class','rm-lm-overlay');layer.setAttribute('aria-hidden','true');layer.setAttribute('inert','');target.append(layer);s.overlays.push(layer);
 const oldPosition=(ghost,a)=>{
   if(svg){ghost.style.transform='translate('+a.x+'px,'+a.y+'px)';ghost.style.opacity='1';}
   else{ghost.style.cssText+=';position:absolute;left:'+a.x+'px;top:'+a.y+'px;width:'+a.w+'px;height:'+a.h+'px;max-width:none;min-width:0;margin:0;pointer-events:none;opacity:1;';}
 };
 const highlight=e=>{e.classList.add('rm-lm-changing');s.changed.add(e)};
 const start=timing(750),duration=timing(1450),gap=timing(300),end=start+groups.length*(duration+gap);
 status.textContent='① 이동 전 상태';txt.textContent='변화할 기물이 원래 있던 모습을 잠시 확인하세요. 아래 시연은 기존 예시의 화면 변화를 순서대로 보여줍니다.';bar.style.width='5%';list.replaceChildren();
 for(let i=0;i<groups.length;i++){
   const g=groups[i],at=start+i*(duration+gap);
   schedule(()=>{target.dataset.rmLessonStage='group-'+(i+1);status.textContent='시연 '+(i+1)+' / '+groups.length+' · '+g.name;txt.textContent=summary(g).slice(0,2).join(' / ');bar.style.width=(10+85*(i+1)/groups.length)+'%';list.replaceChildren();appendSummary(list,g);},at);
   for(const event of g.events){
     const {kind,a,b}=event;
     if(b){highlight(b.e);animation(b.e,[{opacity:0,offset:0},{opacity:0,offset:.75},{opacity:1,offset:1}],at,duration)}
     if(a){
       const ghost=cleanClone(a.clone);ghost.classList.add('rm-lm-ghost');oldPosition(ghost,a);layer.append(ghost);
       const from=svg?'translate('+a.x+'px,'+a.y+'px)':'translate(0px,0px)';
       const to=kind==='move'?(svg?'translate('+b.x+'px,'+b.y+'px)':'translate('+(b.x-a.x)+'px,'+(b.y-a.y)+'px)'):from;
       if(kind==='move'){
         animation(ghost,[{opacity:1,transform:from},{opacity:1,transform:to,offset:.78},{opacity:0,transform:to}],at,duration);
         if(svg){
           const line=document.createElementNS(NS,'path');line.setAttribute('class','rm-trail rm-lm-path');line.setAttribute('d','M'+a.x+' '+a.y+' L'+b.x+' '+b.y);line.setAttribute('fill','none');line.setAttribute('stroke','#e9b53f');line.setAttribute('stroke-width','3');line.setAttribute('stroke-dasharray','7 7');layer.insertBefore(line,ghost);animation(line,[{opacity:0},{opacity:.9,offset:.2},{opacity:.9,offset:.8},{opacity:0}],at,duration);
         }
       }else animation(ghost,[{opacity:1,transform:from},{opacity:1,transform:from,offset:.35},{opacity:0,transform:from}],at,duration);
     }
   }
 }
 schedule(()=>finish(target),end+timing(350));
}
function appendSummary(list,g){
 const items=summary(g);for(const label of items.slice(0,3)){let x=document.createElement('span');x.textContent=label;list.append(x)}
 if(items.length>3){let x=document.createElement('span');x.textContent='외 '+(items.length-3)+'가지 변화';list.append(x)}
}
function active(target){return sessions.has(target)}
function duration(target){return active(target)?timing(12000):0}
document.addEventListener('change',e=>{if(e.target.id==='rmMotionSpeed')for(const t of document.querySelectorAll('.rm-lm-running'))finish(t)});
window.addEventListener('message',e=>{if(e.source===parent&&['rulemaster-pause','rm-motion-speed'].includes(e.data?.kind))for(const t of document.querySelectorAll('.rm-lm-running'))finish(t)});
window.RMLessonMotion={before,run,finish,tagSVG,active,duration,plan};
})();

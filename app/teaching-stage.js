/* Explicitly authored teaching frames, never infer actions from layout diffs. */
(function(){
'use strict';
function create(target,makePiece,next){
 let key='',animations=[],busy=false,previous=null,previousIndex=-1,lock=null;
 const cancel=()=>{for(const a of animations)try{a.cancel()}catch{}animations=[];target.classList.remove('rm-teaching-playing');if(lock!==null){next.disabled=lock;lock=null;}busy=false;};
 function clear(){cancel();key='';previous=null;previousIndex=-1;target.classList.remove('rm-fixed-teaching');}
 function coords(){const base=target.getBoundingClientRect(),out=new Map();for(const e of target.querySelectorAll('[data-teach-id]')){const r=e.getBoundingClientRect();out.set(e.dataset.teachId,{x:r.left-base.left,y:r.top-base.top});}return out;}
 function render(topic,index,frame,{animate=true}={}){
   cancel();
   const same=key===topic,old=same?coords():new Map();
   const forward=same&&index===previousIndex+1;
   key=topic;previous=frame;previousIndex=index;
   target.classList.add('rm-fixed-teaching');target.replaceChildren();
   for(let z=0;z<frame.layout.length;z++){
     const cfg=frame.layout[z],zone=document.createElement('section');zone.className='zone rm-teach-zone '+(cfg.size||'token');
     const h=document.createElement('h3');h.textContent=cfg.name;zone.append(h);
     const slots=document.createElement('div');slots.className='rm-teach-slots';
     for(let i=0;i<cfg.slots.length;i++){
       const slot=document.createElement('div');slot.className='rm-teach-slot';slot.dataset.slot=z+':'+i;
       const cap=document.createElement('small');cap.className='rm-teach-slot-label';cap.textContent=cfg.slots[i];
       const holder=document.createElement('div');holder.className='rm-teach-holder';
       const p=frame.slots[z][i];
       if(p){const e=makePiece(p);e.dataset.teachId=p.id;holder.append(e);}
       else{const empty=document.createElement('span');empty.className='rm-teach-empty';empty.textContent='빈 자리';holder.append(empty);}
       slot.append(cap,holder);slots.append(slot);
     }
     zone.append(slots);target.append(zone);
   }
   const ids=new Set([...(frame.move||[]),...(frame.pulse||[])]);
   const nodes=[...target.querySelectorAll('[data-teach-id]')];
   for(const e of nodes)if(ids.has(e.dataset.teachId))e.classList.add('rm-teach-changed');
   if(!forward||!animate||!RMMotion.on())return;
   const now=coords(),ms=RMMotion.ms(1350);
   for(const e of nodes){
     const id=e.dataset.teachId,a=old.get(id),b=now.get(id);
     if(frame.move?.includes(id)&&a&&b){
       const dx=a.x-b.x,dy=a.y-b.y;
       if(Math.abs(dx)+Math.abs(dy)>2){
         e.classList.add('rm-teach-moving');const motion=e.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:ms,easing:'cubic-bezier(.2,.6,.25,1)',fill:'none'});animations.push(motion);motion.finished.catch(()=>{}).finally(()=>e.classList.remove('rm-teach-moving'));continue;
       }
     }
     if(frame.pulse?.includes(id)){const motion=e.animate([{filter:'brightness(1)'},{filter:'brightness(1.18)'},{filter:'brightness(1)'}],{duration:ms});animations.push(motion);}
   }
   if(animations.length){busy=true;target.classList.add('rm-teaching-playing');lock=next.disabled;next.disabled=true;const batch=animations;Promise.allSettled(batch.map(a=>a.finished)).then(()=>{if(animations===batch)cancel();});}
 }
 return {render,clear,cancel,get busy(){return busy}};
}
window.RMTeachingStage={create};
})();

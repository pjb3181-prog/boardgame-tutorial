/* Table overview only: visual grouping and physical setup confirmation.
 * Never changes rule data, practice state, or piece identities. */
(function(root){
'use strict';
const quantity=p=>{
  for(const s of [p.name,p.value]){
    const m=String(s??'').match(/(?:^|\s)(\d+)\s*(장|개)$/u);
    if(m&&+m[1]>1)return {count:+m[1],unit:m[2]};
  }
  return null;
};
function inventory(pieces){
  const groups=new Map();
  for(const p of pieces){
    const key=JSON.stringify([p.type,p.name,p.value,p.color]);
    const g=groups.get(key);
    if(g)g.instances++;
    else groups.set(key,{name:p.name,value:String(p.value??''),instances:1,quantity:quantity(p)});
  }
  return [...groups.values()];
}
function create(board){
  const d=board.ownerDocument;
  const make=(tag,cls,label)=>{
    const n=d.createElement(tag);if(cls)n.className=cls;
    if(label!==undefined)n.textContent=label;return n;
  };
  const panel=make('section','rm-setup-tools');
  panel.hidden=true;panel.setAttribute('aria-label','테이블 세팅 도우미');
  const title=make('div','rm-setup-title');
  const heading=make('strong','','테이블 세팅 도우미');
  const progress=make('span','rm-setup-progress');
  progress.setAttribute('aria-live','polite');title.append(heading,progress);
  const tabs=make('div','rm-setup-tabs');
  const detail=make('div','rm-setup-detail');
  const description=make('p','rm-setup-description');
  const items=make('ul','rm-setup-items');
  const actions=make('div','rm-setup-actions');
  const finish=make('button','','이 구역 준비 완료');
  const next=make('button','','다음 구역 →');
  const clear=make('button','','확인 초기화');
  for(const b of [finish,next,clear])b.type='button';
  actions.append(finish,next,clear);detail.append(description,items,actions);
  panel.append(title,tabs,detail);board.before(panel);
  let zones=[],order=[],key=null,active=-1,checks=new Set();
  function render(){
    panel.hidden=!zones.length;
    const isFocused=zones.length>0&&active>=0;
    board.classList.toggle('rm-setup-focused',isFocused);
    for(const [i,z] of [...board.children].entries()){
      if(!z.classList.contains('zone'))continue;
      z.hidden=isFocused&&i!==active;
      z.classList.toggle('rm-setup-checked',zones.length>0&&checks.has(i));
    }
    if(!zones.length)return;
    progress.textContent=checks.size+' / '+zones.length+' 구역 확인';
    tabs.replaceChildren();
    for(const i of [-1,...order]){
      const b=make('button','',i===-1?'전체 테이블':(checks.has(i)?'✓ ':'')+(i===3?'공용 구성품':zones[i].name));
      b.type='button';b.dataset.zone=String(i);b.setAttribute('aria-pressed',String(active===i));
      b.onclick=()=>{active=i;render();};tabs.append(b);
    }
    items.replaceChildren();
    if(!isFocused){
      description.textContent='공용 구성품부터 확인하거나 원하는 좌석을 선택하세요. 수량이 적힌 카드·기물은 한 묶음으로 표시됩니다. 그림은 세팅 위치를 설명하는 예시입니다.';
      items.hidden=true;finish.hidden=true;next.textContent='공용 구성품부터 →';
    }else{
      description.textContent=zones[active].name+' — 그림과 아래 목록을 실제 기물과 대조하세요.';
      items.hidden=false;finish.hidden=false;next.textContent=order.indexOf(active)===order.length-1?'전체 테이블로 →':'다음 구역 →';
      for(const g of inventory(zones[active].pieces)){
        const row=make('li','rm-setup-item');
        row.append(make('strong','',g.name));
        const value=[g.value,g.instances>1?'동일 표시 '+g.instances+'개':''].filter(Boolean).join(' · ');
        if(value)row.append(make('span','',value));
        items.append(row);
      }
      finish.textContent=checks.has(active)?'준비 완료 취소':'이 구역 준비 완료';
      finish.setAttribute('aria-pressed',String(checks.has(active)));
    }
    clear.disabled=!checks.size;
  }
  finish.onclick=()=>{if(active<0)return;if(checks.has(active))checks.delete(active);else checks.add(active);render();};
  next.onclick=()=>{active=active===-1?order[0]:order[order.indexOf(active)+1]??-1;render();};
  clear.onclick=()=>{checks.clear();render();};
  function update(newZones,configuration){
    if(key!==configuration){checks.clear();active=-1;key=configuration;}
    zones=newZones||[];
    order=zones.length?[...zones.keys()].sort((a,b)=>(a===3?-1:a)-(b===3?-1:b)):[];
    if(!zones.length||active>=zones.length)active=-1;
    if(zones.length){
      [...board.children].forEach((z,i)=>{
        const h=z.querySelector('h3 small');
        if(h)h.textContent='표시 '+zones[i].pieces.length+'항목';
        const map=new Map(zones[i].pieces.map(p=>[p.id,p]));
        for(const b of z.querySelectorAll('[data-piece]')){
          const p=map.get(b.dataset.piece),q=p&&quantity(p);
          if(!q||b.querySelector('.rm-setup-quantity'))continue;
          const badge=make('span','rm-setup-quantity',q.count+q.unit);
          badge.setAttribute('aria-hidden','true');b.append(badge);
          if(p.type==='back'||p.type==='robot')b.classList.add('rm-setup-stack');
        }
      });
    }
    render();
  }
  return {update};
}
const api={quantity,inventory,create};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RMSetupFocus=api;
})(typeof globalThis!=='undefined'?globalThis:this);

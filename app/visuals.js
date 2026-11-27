'use strict';
/* Original symbolic diagrams, not artwork or replicas of game components. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs, text) => {
    const n=document.createElementNS(NS,tag);
    for(const [k,v] of Object.entries(attrs||{})) n.setAttribute(k,v);
    if(text!==undefined)n.textContent=text;
    return n;
  };
  const colors=['#f5c879','#82d4af','#88b5ed','#e28c8c','#c8a6f0'];
  const diagrams={
    'setup': {label:'공용 지역과 개인 정당 준비',left:'공용 지역판',right:'개인 구성품',kind:'setup'},
    '0': {label:'입찰 기록지는 비공개로 유지',left:'각자 입찰',right:'동시 공개',kind:'cards'},
    '1': {label:'지역 여론과 정당 정책 비교',left:'지역 여론',right:'정당 정책',kind:'cards'},
    '2': {label:'비용을 내고 지역의 빈 칸에 마커 놓기',left:'비용 지불',right:'언론 칸',kind:'tokens'},
    '3': {label:'지역에 유세 큐브 배치',left:'큐브 준비',right:'지역별 배치',kind:'tokens'},
    '4': {label:'정치인 카드를 뒷면으로 배치',left:'개인 카드',right:'지역에 배치',kind:'cards'},
    '5': {label:'정치인 카드 공개 후 효과 확인',left:'카드 공개',right:'효과 해결',kind:'cards'},
    '6': {label:'언론 마커 수를 비교',left:'정당별 마커',right:'여론 변경',kind:'tokens'},
    '7': {label:'경매 후 조사 결과 처리',left:'조사 카드',right:'공개 / 비공개',kind:'cards'},
    '8': {label:'유세 큐브를 득표로 전환',left:'유세 큐브',right:'득표 트랙',kind:'votes'},
    '9': {label:'지역 선거 결과 기록',left:'득표 비교',right:'승점 기록',kind:'votes'},
    '10': {label:'개인별 자금 정산',left:'선거 성과',right:'자금·기부',kind:'cards'},
    '11': {label:'완료 지역 정리 후 다음 지역으로',left:'완료한 지역',right:'남은 지역',kind:'setup'},
    'end': {label:'점수 기록지를 합산',left:'항목별 점수',right:'최종 승점',kind:'votes'}
  };
  window.renderIllustration=(target,step)=>{
    const d=diagrams[step.r===0?'setup':step.r===5?'end':String(step.p)];
    target.replaceChildren(); if(!d)return;
    const svg=node('svg',{viewBox:'0 0 360 154',role:'img','aria-label':d.label});
    svg.append(node('title',{},d.label));
    function rect(x,y,w,h,fill='#22343e',stroke='#526873',rx=8){svg.append(node('rect',{x,y,width:w,height:h,rx,fill,stroke,'stroke-width':1.3}))}
    function label(x,y,t,size=13,fill='#e7eef0'){svg.append(node('text',{x,y,'text-anchor':'middle','font-size':size,'font-weight':'650',fill},t))}
    function token(x,y,c){rect(x,y,15,15,c,c,3)}
    rect(8,8,148,124,'#14212a');rect(204,8,148,124,'#14212a');
    label(82,29,d.left);label(278,29,d.right);
    svg.append(node('path',{d:'M165 70 H194 M186 62 L195 70 L186 78',fill:'none',stroke:'#f5c879','stroke-width':2.5,'stroke-linecap':'round','stroke-linejoin':'round'}));
    if(d.kind==='cards'){
      for(let i=0;i<3;i++){rect(29+i*35,47,28,50,colors[i],'none',4);label(43+i*35,76,'?',16,'#14212a')}
      for(let i=0;i<2;i++){rect(232+i*55,47,38,50,'#354954','#83959d',4);label(251+i*55,77,i===0?'A':'B',17)}
    }else if(d.kind==='tokens'||d.kind==='votes'){
      for(let i=0;i<5;i++)token(32+(i%3)*30,47+Math.floor(i/3)*23,colors[i]);
      if(d.kind==='tokens'){for(let i=0;i<5;i++)rect(216+i*25,60,21,21,i===1?colors[1]:'#263943','#6f8189',3)}
      else{for(let i=0;i<5;i++){const h=[22,38,15,54,30][i];rect(219+i*25,101-h,16,h,colors[i],'none',2)} svg.append(node('path',{d:'M216 103 H340',stroke:'#71848b','stroke-width':1.4}))}
    }else{
      for(let i=0;i<4;i++)rect(28+(i%2)*53,43+Math.floor(i/2)*31,45,24,'#30434e','#81939d',3);
      for(let i=0;i<5;i++)token(218+(i%3)*31,47+Math.floor(i/3)*23,colors[i]);
    }
    label(180,149,'설명용 도식 · 실제 배치와 다를 수 있음',11,'#a9bac0');target.append(svg);
  };
})();

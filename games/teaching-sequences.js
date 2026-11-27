/* Fixed teaching boards. Each state is written for the specific rule example.
   Slots are positional; null means a visibly empty space. No generated rule sequence. */
(function(root){
'use strict';
const zone=(name,slots,size='token')=>({name,slots,size});
const frame=(text,slots,move=[],pulse=[])=>({text,slots,move,pulse});
function assign(l,layout,frames){
 l.stable=true;
 l.frames=frames.map(f=>({...f,stable:{...f,layout},zones:layout.map((z,i)=>({name:z.name,pieces:f.slots[i].filter(Boolean)}))}));
}
function expanded(id,lessons){
 const E=root.Expanded,{P,card,back,tile,track,coin,bill,cube,die,star,robot,many}=E;
 const get=needle=>lessons.find(l=>l.title.includes(needle));
 const add=(needle,layout,build)=>{const l=get(needle);if(!l)return;assign(l,layout,build(l.frames.map(f=>f.text)));};
 if(id==='die-macher'){
   const money=bill(5000,'pay'),m=P('marker','내 언론','◆','blue','m'),red=P('marker','상대 언론','◆','red','r1'),blue=P('marker','내 언론','◆','blue','b1');
   add('언론 마커 구매',[
     zone('내 보유',['지불할 돈','추가할 언론']),zone('은행',['받은 돈']),
     zone('현재 선거 지역 · 언론 칸',['상대','나','빈 칸','빈 칸','빈 칸']),zone('지역 언론 비교',['파랑 : 빨강'])
   ],t=>[
     frame(t[0],[[money,m],[null],[red,blue,null,null,null],[track('언론 수','1 : 1','gray','count')]]),
     frame('먼저 €5,000을 은행에 지불합니다. 아직 지역의 언론 마커는 1 대 1입니다.',[[null,m],[money],[red,blue,null,null,null],[track('언론 수','1 : 1','gray','count')]],['pay']),
     frame('내 파란 언론 마커를 비어 있는 지역 언론 칸에 놓습니다.',[[null,null],[money],[red,blue,m,null,null],[track('언론 수','1 : 1','gray','count')]],['m']),
     frame(t[1],[[null,null],[money],[red,blue,m,null,null],[track('언론 수','2 : 1','blue','count')]],[],['count'])
   ]);
   const money2=bill(2000,'pay2'),r=many(6,i=>cube('유세','blue','r'+i));
   add('유세를 지역별로 구매',[
     zone('내 지불 자금',['A 지역','B 지역']),zone('은행',['A 지역 비용','B 지역 비용']),
     zone('내 유세 큐브',many(6,i=>'큐브 '+(i+1))),zone('A 지역',many(4,i=>'유세 '+(i+1))),zone('B 지역',['유세 1','유세 2']),zone('지불 합계',['계산'])
   ],t=>[
     frame(t[0],[[money,money2],[null,null],r,[null,null,null,null],[null,null],[track('총 비용','€7,000','gray','sum')]]),
     frame('이 예시에서는 A 지역 4개에 €5,000, B 지역 2개에 €2,000을 지불합니다.',[[null,null],[money,money2],r,[null,null,null,null],[null,null],[track('총 비용','€7,000','gray','sum')]],['pay','pay2']),
     frame('A 지역에 유세 큐브 네 개를 놓습니다.',[[null,null],[money,money2],[null,null,null,null,r[4],r[5]],r.slice(0,4),[null,null],[track('총 비용','€7,000','gray','sum')]],r.slice(0,4).map(x=>x.id)),
     frame(t[1],[[null,null],[money,money2],many(6,()=>null),r.slice(0,4),r.slice(4),[track('총 비용','€7,000','gray','sum')]],['r4','r5'])
   ]);
   const o=card('교통','반대','green','o'),n=card('교통','찬성','green','n'),safe=card('교육','찬성 ×2','green','safe');
   add('언론으로 여론 변경',[zone('지역 여론',['교통','교육 · 보호'],'card'),zone('여론판',['교체할 카드'],'card'),zone('버린 카드',['교체된 여론'],'card'),zone('언론 비교',['파랑 : 빨강'])],t=>[
     frame(t[0],[[o,safe],[n],[null],[track('언론 수','2 : 1','blue','c')]]),
     frame('기존 교통 반대 카드를 지역에서 제거합니다. 두 배 마커가 놓인 교육 카드는 건드리지 않습니다.',[[null,safe],[n],[o],[track('언론 수','2 : 1','blue','c')]],['o']),
     frame(t[1],[[n,safe],[null],[o],[track('언론 수','2 : 1','blue','c')]],['n'])
   ]);
 }
 if(id==='raging-robots'){
   const rob=robot('연습용 로봇','⚡2+기어2 / ⚡4+기어1','orange','r');
   const en=n=>track('조립 에너지',n,'gold','energy'),gear=n=>track('기어',n,'gray','gear');
   add('조립: 에너지와 자원을 지불',[zone('손패',['조립할 로봇'],'card'),zone('제작 행',['첫 번째 빈 칸'],'card'),zone('내 자원',['에너지','기어']),zone('선택한 비용',['두 비용 중 하나'])],t=>[
     frame(t[0],[[rob],[null],[en(5),gear(2)],[tile('선택 비용','⚡4 + 기어 1','gray','cost')]]),
     frame('두 비용 중 에너지 4와 기어 1을 지불하는 조합을 선택했습니다. 에너지는 5에서 1, 기어는 2에서 1로 줄어듭니다.',[[rob],[null],[en(1),gear(1)],[tile('지불 완료','⚡4 + 기어 1','gray','cost')]],[],['energy','gear','cost']),
     frame(t[1],[[null],[{...rob,value:'조립 완료'}],[en(1),gear(1)],[tile('지불 완료','⚡4 + 기어 1','gray','cost')]],['r'])
   ]);
   const a=robot('로봇 A','⚡2 이상','purple','ra'),b=robot('로봇 B','⚡4 이상','purple','rb'),c=robot('로봇 C','⚡5 이상','purple','rc'),energy=track('총 에너지',4,'gold','en');
   add('설계·제작·재활용: 엔진 실행',[zone('설계 단계',['총 에너지']),zone('로봇 행 · 왼쪽부터',['로봇 A','로봇 B','로봇 C'],'card')],t=>[
     frame(t[0],[[energy],[a,b,c]]),
     frame('로봇 A는 에너지 2 이상이면 실행할 수 있습니다. A의 능력을 사용합니다. 총 에너지 4는 줄지 않습니다.',[[energy],[{...a,value:'⚡2 · 사용 완료'},b,c]],[],['ra']),
     frame('그 다음 로봇 B도 총 에너지 4로 실행합니다. A를 먼저 사용했어도 에너지는 그대로입니다.',[[energy],[{...a,value:'⚡2 · 사용 완료'},{...b,value:'⚡4 · 사용 완료'},c]],[],['rb']),
     frame(t[1],[[energy],[{...a,value:'⚡2 · 사용 완료'},{...b,value:'⚡4 · 사용 완료'},{...c,value:'⚡5 · 조건 미달'}]],[],['rc'])
   ]);
 }
 if(id==='euphoria'){
   const d0=die(2,'blue','d0'),d1=die(4,'blue','d1'),water=cube('물','blue','water');
   add('내 차례의 두 가지 기본 선택',[zone('내 사용 가능 일꾼',['일꾼 1','일꾼 2']),zone('물 공급 행동칸',['놓을 자리']),zone('공용 상품 공급',['물']),zone('내 상품',['획득한 물'])],t=>[
     frame(t[0],[[d0,d1],[null],[water],[null]]),
     frame('내 눈 2인 파란 주사위를 물 공급 행동칸에 놓습니다. 눈 4인 일꾼은 그대로 남습니다.',[[null,d1],[d0],[water],[null]],['d0']),
     frame(t[1],[[null,d1],[d0],[null],[water]],['water'])
   ]);
   const rd=die(3,'red','red'),rd5=die(5,'red','red'),r1=die(4,'red','r1'),b1=die(2,'blue','b1');
   add('일꾼을 밀어내는 칸과 공유 칸',[zone('내 사용 가능',['파란 일꾼']),zone('임시 단일 행동칸',['일꾼 자리']),zone('빨강 사용 가능',['돌아온 일꾼']),zone('공유 상품칸 · 별도 예시',['빨강 일꾼','파랑 일꾼'])],t=>[
     frame(t[0],[[d0],[rd],[null],[null,null]]),
     frame('내 파란 2를 임시 행동칸에 놓으면 기존 빨강 3이 그 주인의 사용 가능 구역으로 돌아갑니다.',[[null],[d0],[rd],[null,null]],['d0','red']),
     frame(t[1],[[null],[d0],[rd5],[null,null]],[],['red']),
     frame(t[2],[[null],[d0],[rd5],[r1,b1]],[],['r1','b1'])
   ]);
   const food=cube('식량','orange','food'),morale=n=>track('사기',n,'green','morale');
   add('회수와 사기',[zone('판 위 내 일꾼',['일꾼 1','일꾼 2']),zone('내 사용 가능',['회수할 자리 1','회수할 자리 2']),zone('내 상품',['지불할 식량']),zone('공용 공급',['지불한 식량']),zone('개인 트랙',['사기','지식'])],t=>[
     frame(t[0],[[d0,d1],[null,null],[food],[null],[morale(2),track('지식',3,'gray','know')]]),
     frame('유료 회수를 선택해 식량 하나를 공용 공급처에 지불합니다. 사기는 2에서 4로 올라갑니다.',[[d0,d1],[null,null],[null],[food],[morale(4),track('지식',3,'gray','know')]],['food'],['morale']),
     frame('두 일꾼을 사용 가능 구역으로 회수합니다. 다음은 새 주사위 눈을 굴리는 과정입니다.',[[null,null],[d0,d1],[null],[food],[morale(4),track('지식',3,'gray','know')]],['d0','d1']),
     frame(t[1],[[null,null],[die(3,'blue','d0'),die(5,'blue','d1')],[null],[food],[morale(4),track('지식',3,'gray','know')]],[],['d0','d1'])
   ]);
   const d6=die(6,'blue','d0'),d5=die(5,'blue','d1'),d2=die(2,'blue','d2'),on=die(4,'blue','d3');
   add('지식 검사: 합계 16',[zone('내 사용 가능',['눈 6','눈 5','눈 2']),zone('판 위 · 검사 제외',['일꾼']),zone('미사용 공급',['잃은 일꾼']),zone('지식 검사',['지식','합계'])],t=>[
     frame(t[0],[[d6,d5,d2],[on],[null],[track('지식',3,'gray','know'),track('눈+지식',16,'gold','sum')]]),
     frame('사용 가능 일꾼들의 눈 6+5+2에 지식 3을 더하면 16입니다. 판 위의 눈 4는 합산하지 않습니다.',[[d6,d5,d2],[on],[null],[track('지식',3,'gray','know'),track('눈+지식',16,'gold','sum')]],[],['sum']),
     frame(t[1],[[null,d5,d2],[on],[d6],[track('지식',3,'gray','know'),track('현재 검사','완료','gray','sum')]],['d0'])
   ]);
 }
 if(id==='hadara'){
   const a=card('수입 카드','비용 3 · 수입 +2','gold','a'),b=card('수입 카드','비용 5 · 수입 +3','gold','b'),coins=many(3,i=>coin(1,'coin'+i)),income=n=>track('수입',n,'gold','income');
   add('두 장 뽑고, 하나 버리고',[zone('내가 뽑은 두 장',['구매 후보','버릴 후보'],'card'),zone('색별 공개 버림',['앞면 버림'],'card'),zone('내 카드',['구매 완료'],'card'),zone('내 지불 동전',['1','1','1']),zone('공용 은행',['지불한 동전 1','2','3']),zone('내 수입 트랙',['현재 수입'])],t=>[
     frame(t[0],[[a,b],[null],[null],coins,[null,null,null],[income(2)]]),
     frame('비용 5 카드를 해당 색 공개 버림 더미에 앞면으로 놓습니다. 남은 비용 3 카드만 구매하거나 판매할 수 있습니다.',[[a,null],[b],[null],coins,[null,null,null],[income(2)]],['b']),
     frame('이번 예시에서는 비용 3 카드를 구매합니다. 동전 3개를 은행에 지불합니다.',[[a,null],[b],[null],[null,null,null],coins,[income(2)]],coins.map(x=>x.id)),
     frame('구매한 수입 카드를 내 카드 구역에 놓습니다.',[[null,null],[b],[a],[null,null,null],coins,[income(2)]],['a']),
     frame(t[1],[[null,null],[b],[a],[null,null,null],coins,[income(4)]],[],['income'])
   ]);
   const cs=many(6,i=>card(['수입','군사','문화','식량','특수'][i%5]+' 카드','보유',['gold','red','blue','green','purple'][i%5],'c'+i));
   add('수입·식민지·조각상 후 식량 확인',[zone('내 카드',many(6,i=>'카드 '+(i+1)),'card'),zone('버림',['제거한 카드'],'card'),zone('개인판',['식량','색 카드 수'])],t=>[
     frame(t[0],[cs,[null],[track('식량',5,'green','food'),track('색 카드 수',6,'gray','count')]]),
     frame('색 카드가 6장인데 식량은 5입니다. 카드를 최소 한 장 제거해야 합니다. 이 예시는 노란 수입 카드를 제거합니다.',[cs,[null],[track('식량',5,'green','food'),track('색 카드 수',6,'gray','count')]],[],['food','count']),
     frame('수입 카드 한 장을 버림 구역으로 옮깁니다. 그 카드가 올렸던 수입도 감소하고 구매 비용은 환불되지 않습니다.',[[...cs.slice(0,5),null],[cs[5]],[track('식량',5,'green','food'),track('색 카드 수',5,'gray','count')]],['c5'],['count']),
     frame(t[1],[[...cs.slice(0,5),null],[cs[5]],[track('식량',5,'green','food'),track('색 카드 수',5,'gray','count')]],[],['food','count'])
   ]);
 }
 return lessons;
}
function roll(lessons,{d,dev,world,gray,mine}){
 const die=x=>({id:x.id,kind:'die',x}),tile=x=>({id:x.id,kind:'tile',x}),value=(id,text)=>({id,kind:'text',text});
 const add=(needle,layout,build)=>{const l=lessons.find(x=>x.title.includes(needle));if(!l)return;const texts=l.steps.map(s=>s.text);l.stable=true;l.steps=build(texts).map(f=>({...f,stable:{...f,layout}}));};
 const b=die(d('B','white',1)),e=die(d('E','red',1)),p=die(d('P','cyan',3)),devtile=tile(dev),worldtile=tile(world);
 add('행동 하나를 직접 선택',[zone('II 개발',['개발 칸 아래']),zone('III 정착',['행동 선택 칸 위']),zone('주사위 면',['현재 면'])],t=>[
   frame(t[0],[[b],[null],[value('face','◇ 개발 면')]]),
   frame(t[1],[[null],[b],[value('face','◇ 개발 면 · 그대로')]],['B'],['face'])
 ]);
 add('II 개발: 공사 중인 주사위',[zone('개발 행동',['대기 노동자']),zone('개발 건설 구역',['공사 중 타일','첫 노동자','두 번째 노동자'],'card'),zone('완성 제국',['기존 행성','새 개발 타일'],'card'),zone('시민 구역',['첫 노동자','두 번째 노동자']),zone('건설 진행',['필요 노동자 2'])],t=>[
   frame(t[0],[[e],[devtile,b,null],[worldtile,null],[null,null],[value('progress','1 / 2')]]),
   frame('개발 면 빨간 주사위를 비용 2인 개발 타일의 두 번째 노동자 자리로 옮깁니다. 이제 필요한 노동자 2개를 채웠습니다.',[[null],[devtile,b,e],[worldtile,null],[null,null],[value('progress','2 / 2')]],['E'],['progress']),
   frame(t[1],[[null],[null,null,null],[worldtile,devtile],[b,e],[value('progress','완성')]], [dev.id,'B','E'],['progress']),
   frame(t[2],[[null],[null,null,null],[worldtile,devtile],[b,e],[value('progress','완성')]],[],[dev.id])
 ]);
 add('IV 생산: 주사위가 상품',[zone('생산 행동',['생산 노동자']),zone('완성된 하늘색 행성',['행성 타일','상품 자리'],'card'),zone('회색 행성',['생산 불가'],'card')],t=>[
   frame(t[0],[[p],[worldtile,null],[tile(gray)]]),
   frame(t[1],[[null],[worldtile,p],[tile(gray)]],['P'])
 ]);
 return lessons;
}
const api={expanded,roll};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RMTeachingSequences=api;
})(typeof globalThis!=='undefined'?globalThis:this);

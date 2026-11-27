/* Nusfjord Big Box (2024), base-game teaching examples; independent diagrams.
   Source: publisher rules pp. 5–15. Each chapter has an explicit initial state. */
const NUS_RULES='https://www.lookout-spiele.de/upload/en_nusfjordbigbox.html_Nusfjord_BigBox_169_Rules_EN_WEB_240109_compressed.pdf';
const P=(id,type,x,y,extra={})=>({id,type,x,y,...extra});
const move=(id,x,y,extra={})=>({id,x,y,...extra});
const base=()=>[
  ...[0,1,2].map(i=>P('worker'+i,'worker',52+i*43,509)),
  P('forest0','forest',574,178),P('forest1','forest',568,171),P('forest2','forest',574,260),P('forest3','forest',574,349),
  ...[0,1,2,3,4].map(i=>P('share'+i,'share',757+(i%2)*100,347+Math.floor(i/2)*54,{issued:i<2})),
];
const supplyFish=(n)=>Array.from({length:n},(_,i)=>P('fish'+i,'fish',48+(i%5)*35,82+Math.floor(i/5)*28));
const handFish=(n)=>Array.from({length:n},(_,i)=>P('fish'+i,'fish',46+(i%5)*35,398+Math.floor(i/5)*30));
const coin=(i,x,y)=>P('coin'+i,'coin',x,y);
const wood=(i,x,y)=>P('wood'+i,'wood',x,y);
const step=(text,patch=[],focus=[],drag=null)=>({text,patch,focus,drag});
const chapters=[
 {title:'어떤 게임인가요?',sub:'게임의 목적과 큰 흐름',page:'1, 6, 15',state:base(),frames:[
  step('여러분은 어업 회사를 운영합니다. 항구를 발전시키고 배를 늘려 물고기를 잡고, 목재와 돈으로 건물을 지어 점수를 얻는 게임입니다.',[],['harbor','fleet']),
  step('총 7라운드입니다. 매 라운드에는 어획, 행동, 귀환의 세 단계가 있습니다. 우선 물고기를 배분하고, 그다음 일꾼 3명을 한 명씩 보내 행동합니다.',[],['rounds','workers','actions']),
  step('마지막에 건물과 선박의 점수, 보유한 발행 주식과 금을 더합니다. 비어 있는 건설칸과 미발행 주식은 감점입니다. 이제 개인판부터 볼게요.',[],['harbor','shares','personal'])]},
 {title:'내 앞에 무엇을 놓나요?',sub:'개인판과 시작 구성품',page:'5',state:base().map(p=>p.type==='forest'?{...p,x:125+Number(p.id.slice(-1))*2,y:65+Number(p.id.slice(-1))*4}:p.type==='share'?{...p,issued:false}:p),frames:[
  step('항구판 위에는 원로 의회, 옆에는 원형 개인 공급처를 놓습니다. 개인 공급처의 자원만 일반 행동 비용으로 사용할 수 있어요.',[],['council','personal','reserve']),
  step('숲 타일은 총 네 개입니다. 오른쪽 맨 위 두 칸에 두 개를 겹쳐 놓고, 중간과 아래에는 하나씩 놓습니다.',[move('forest0',574,178),move('forest1',568,171),move('forest2',574,260),move('forest3',574,349)],['harbor']),
  step('주식은 5개 중 2개만 발행 면으로 뒤집어 놓고, 나머지 3개는 미발행 상태로 둡니다. 일꾼은 3명, 원로는 아직 없습니다.',[move('share0',757,347,{issued:true}),move('share1',857,347,{issued:true})],['shares','workers','council']),
  step('항구판 아래 바다의 첫 번째 노출 숫자는 3입니다. 시작 배로는 한 라운드에 물고기 세 마리를 잡습니다.',[],['fleet'])]},
 {title:'첫 라운드: 물고기 잡기',sub:'어획 단계 · 첫 3마리',page:'6',state:[...base(),...supplyFish(3)],frames:[
  step('모든 사람이 동시에 자기 어획량만큼 물고기를 가져옵니다. 시작 어획량은 3마리예요.',[],['fleet','supply']),
  step('공용 공급처에서 물고기 세 마리를 이번 어획으로 가져옵니다.',[move('fish0',46,398),move('fish1',81,398),move('fish2',116,398)],['fleet','catch']),
  step('배분 순서가 중요합니다. 원로, 외부에 있는 내 주식, 내가 보유한 내 발행 주식, 예비고, 공용 공급처 순서입니다. 첫 라운드에는 원로와 외부 주식이 없으니 앞 두 단계는 건너뜁니다. 새로 잡은 생선만 이 순서대로 배분합니다.',[],['council','market','shares']),
  step('내가 보유한 발행 주식 두 개에 물고기 한 마리씩 올립니다. 미발행 주식에는 올리지 않습니다.',[move('fish0',787,333),move('fish1',887,333)],['shares']),
  step('남은 한 마리는 항구판 왼쪽 위 예비고로 옮깁니다. 예비고의 물고기는 일반 행동 비용으로 바로 쓸 수 없어요.',[move('fish2',290,195)],['reserve'],{id:'fish2',x:290,y:195}),
  step('모든 플레이어의 배분이 끝나면 보유 주식 위에 놓인 물고기를 개인 공급처로 옮깁니다. 결국 이번 어획으로 바로 쓸 수 있는 물고기는 2마리, 예비고는 1마리입니다.',[move('fish0',790,169),move('fish1',829,169)],['personal','reserve'])]},
 {title:'일꾼을 보내 행동하기',sub:'행동 단계 · 3인 예시',page:'8, 12',state:[...base(),...handFish(3).map((p,i)=>({...p,x:i===2?290:790+i*39,y:i===2?195:169})),...Array.from({length:4},(_,i)=>wood(i,48+i*35,110))],frames:[
  step('선 플레이어부터 시계 방향으로 일꾼 하나씩 보냅니다. 자기 차례에 3명을 한꺼번에 쓰는 것이 아닙니다.',[],['actions','workers']),
  step('예를 들어 솎아베기 칸에 일꾼 하나를 놓아 보겠습니다. 칸의 숫자는 그 라운드에 들어갈 수 있는 일꾼 수입니다. 이 칸은 1명뿐입니다.',[move('worker0',144,241)],['actions'],{id:'worker0',x:144,y:241}),
  step('숲 타일 한 개당 목재 하나를 받습니다. 위쪽에 겹친 숲도 각각 세므로 목재 4개를 가져옵니다. 숲 자체는 제거하지 않습니다.',[...Array.from({length:4},(_,i)=>move('wood'+i,773+i*35,211))],['harbor','personal']),
  step('이제 다른 사람의 차례입니다. 다시 내 차례가 돌아오면 남은 일꾼을 사용할 수 있습니다. 개인 공급처에는 목재를 최대 12개까지 보관합니다.',[],['workers','actions'])]},
 {title:'숲은 어떻게 활용하나요?',sub:'별도 예시 · 벌목과 솎아베기',page:'12',state:[...base(),...Array.from({length:5},(_,i)=>wood(i,48+i*35,110))],frames:[
  step('솎아베기는 숲을 그대로 두고 목재를 받는 행동이고, 벌목은 숲 한 개를 없애 목재 5개를 받는 행동입니다. 이번에는 벌목을 시연합니다.',[],['harbor','actions']),
  step('벌목 행동칸에 일꾼을 놓습니다. 숲 네 개 중 맨 아래 숲 하나를 제거하겠습니다.',[move('worker0',144,204)],['actions'],{id:'worker0',x:144,y:204}),
  step('숲 타일을 공용 공급처로 돌려보냅니다. 아래의 두 건설칸이 드러납니다. 위의 겹친 숲에서 하나만 제거했다면 건설칸은 열리지 않습니다.',[move('forest3',125,72)],['harbor'],{id:'forest3',x:125,y:72}),
  step('목재 5개를 개인 공급처로 가져옵니다. 목재가 이미 12개라면 숲만 제거할 수 있습니다.',[...Array.from({length:5},(_,i)=>move('wood'+i,765+i*29,211))],['personal'])]},
 {title:'주식 발행은 왜 하나요?',sub:'별도 예시 · 주식과 배당',page:'6, 11',state:[...base(),coin(0,48,112),coin(1,85,112)],frames:[
  step('시작할 때는 미발행 주식이 3개 있습니다. 자금이 필요할 때 주식을 발행해 금을 얻을 수 있습니다.',[],['shares','market']),
  step('주식 발행 행동칸에 일꾼을 배치합니다.',[move('worker0',145,167)],['actions'],{id:'worker0',x:145,y:167}),
  step('미발행 주식 하나를 발행 면으로 뒤집어 행동판의 주식 시장에 놓습니다. 공용 공급처에서 금 2개를 받습니다.',[move('share2',97,340,{issued:true}),move('coin0',778,254),move('coin1',814,254)],['market','personal']),
  step('다음 어획 때 이 주식에도 내 물고기를 배분해야 합니다. 시장에 남은 주식의 물고기는 공용 공급처로 돌아갑니다. 다른 플레이어가 이 주식을 사면 그 사람이 배당을 받습니다.',[],['market']),
  step('주식 매수 행동은 시장의 주식 전부를 한 번에 삽니다. 1~3라운드는 주당 금 1개, 4~5라운드는 총액 1개 할인, 6~7라운드는 총액 2개 할인입니다.',[],['market','actions'])]},
 {title:'선박과 원로, 그리고 이후 라운드',sub:'후속 설명의 범위 · 개요',page:'9, 10–15',state:base(),frames:[
  step('선박을 건조하면 어획량이 늘어납니다. 원로를 데려오면 별도의 행동이 열립니다. 건물을 지으면 특수 효과나 점수를 얻습니다. 이 행동들은 다음 개발 단계에서 각각 시연할 예정입니다.',[],['fleet','council','harbor']),
  step('모든 플레이어가 일꾼 행동 3번을 끝내면 귀환 단계에 들어갑니다. 일꾼을 회수하고 선 플레이어 표식을 다음 라운드로 이동합니다.',[],['rounds','workers']),
  step('이 시제품은 설명과 기물 이동 방식을 검증하기 위한 범위입니다. 실제 게임을 시작하기 전에는 공용판 세팅, 선박, 원로, 연회, 건물, 라운드별 추가 카드, 모방 행동까지 설명해야 합니다.',[],[])]}
];
// Additional independent demonstrations. Official Big Box base rules pp. 4–15.
// All art and explanations are independently drawn/written. Examples are independent; count-dependent chapters are generated from the selected player count.
const S=(title,sub,page,state,frames,scene)=>({title,sub,page,state,frames,scene});
const D=(title,labels=[],slots=[])=>({title,labels,slots});
const worker=(id,x,y,color='#426f9a')=>P(id,'worker',x,y,{color});
const sh=(id,x,y,color='#b54c41',issued=true)=>P(id,'share',x,y,{color,issued});
const card=(id,type,x,y,name,lines,extra={})=>P(id,type,x,y,{name,lines,...extra});
const xf=(id,x,y)=>P(id,'fish',x,y);
const many=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
const ws=(i,x,y)=>move('worker'+i,x,y);
const A={reserve:[164,617],serve:[164,655],building:[164,693],buy:[364,617],reforest:[364,655],ship:[364,693],elder:[164,731],copy:[364,731]};
const use=(id)=>ws(0,...A[id]);
const dragW=(id)=>({id:'worker0',x:A[id][0],y:A[id][1]});
const ownFish=(n)=>many(n,i=>xf('fish'+i,765+(i%5)*33,159+Math.floor(i/5)*26));
const ownWood=(n)=>many(n,i=>wood(i,766+(i%6)*28,210+Math.floor(i/6)*23));
const ownGold=(n)=>many(n,i=>coin(i,766+(i%5)*34,260+Math.floor(i/5)*24));
const bank=(id,i)=>move(id,44+(i%5)*37,75+Math.floor(i/5)*31);
const addCoin=(id,x,y)=>P(id,'coin',x,y);
const actionIntro=(text,id)=>step(text,[use(id)],['extraActions'],dragW(id));
const extraChapters=[];
// Start with the common board, before personal setup.
// Dedicated setup close-ups. Counts follow the ordinary 2024 Big Box base rules.
const NUS_SETUP_COUNTS={2:{elders:7,plates:1,ships:3,c:4,addA:0,addB:0},3:{elders:9,plates:2,ships:4,c:3,addA:3,addB:2},4:{elders:12,plates:3,ships:5,c:2,addA:4,addB:2},5:{elders:18,plates:4,ships:6,c:2,addA:5,addB:3}};
const setupPanel=(id,x,y,w,h,title,fill)=>({id,x,y,w,h,title,fill});
const setupSlot=(x,y,w,h,text)=>({x,y,w,h,text});
const setupText=(x,y,text,size=14)=>({x,y,text,size});
const setupChapter=(key,title,sub,state,frames,panels,slots,labels)=>({setupKey:key,title,sub,page:'4–5',state,frames,setup:{panels,slots,labels}});
function makeCommonSetup(n){
 const count=NUS_SETUP_COUNTS[n],plates=many(7,i=>[76,80+i*66]),costs=[2,2,3,3,4,4,5],shipPos=i=>584+i*158;
 const c=setupChapter('common','공용판 준비하기',`게임 준비 · ${n}인`,[
 ...many(count.plates,i=>xf('setupFish'+i,177+i*35,483)),
 ...many(3,i=>card('ship'+i,'deckStack',shipPos(i),485,['소형선','중형선','대형선'][i],[`${count.ships}개`],{width:140,height:57})),
 P('setupFirstShip','turnShip',365,488)
 ],[
 step(`먼저 ${n}인에 맞는 행동판을 펼칩니다. ${n===2?'1~2인 면을 사용합니다.':'3+ 면을 사용합니다.'} ${n===4?'아래에 4인용 모방 타일(1칸)을 붙입니다.':n===5?'아래에 5인용 모방 타일(3칸)을 붙입니다.':'모방 타일은 사용하지 않습니다.'}`,[],['setupAction']),
 step(`행동판 왼쪽에 연회판, 오른쪽에 선박·원로 공급판을 둡니다. 연회의 작은 접시부터 ${count.plates}개에 물고기를 한 마리씩 올립니다. 총 ${count.plates}마리입니다.`,many(count.plates,i=>move('setupFish'+i,...plates[i])),['setupBanquet','setupBank']),
 step(`선박은 세 종류를 각각 ${count.ships}개씩 준비합니다. 인원수보다 하나씩 많습니다. ${n===5?'대형선이 7개 있어도 일반 공급판에는 6개만 둡니다.':'남은 선박 타일은 일반 공급에서 제외합니다.'}`,many(3,i=>move('ship'+i,shipPos(i),100)),['setupShips']),
 step('목재·물고기·금·숲을 공용 공급처에 둡니다. 선 플레이어 배는 인원수에 맞는 순서 타일에 나중에 배치합니다.',[],['setupBank']),
 step('선박·원로 공급판 오른쪽에 A/B 건물 공급판 두 개를 나란히 둡니다. 다음 주제에서는 원로와 건물 카드를 각각 확대해서 세팅합니다.',[],['setupShips'])
 ],[setupPanel('setupBanquet',18,20,114,525,'공용 연회판','#eadbc1'),setupPanel('setupAction',144,20,352,398,`행동판 · ${n===2?'1–2인':'3+'} 면`,'#b7c79e'),setupPanel('setupShips',508,20,474,398,'선박·원로 공급판','#c0d8d8'),setupPanel('setupBank',144,430,838,115,'공용 공급처 및 아직 배치하지 않은 기물','#f0e5cd')],
 [...plates.map(([x,y],i)=>setupSlot(x-22,y-22,44,44,String(costs[i]))),...many(3,i=>setupSlot(shipPos(i)-71,65,142,70,'')),...many(6,i=>setupSlot(531+(i%3)*150,173+Math.floor(i/3)*112,130,94,`원로 ${i+1} / ${i+7}`))],
 [setupText(532,411,'오른쪽에 A·B 건물 공급판 배치',12),setupText(160,529,'목재 · 금 · 숲 · 물고기',12),setupText(335,529,'선 플레이어 배',12)]);
 c.setup.actionGrid=true;return c;
}
function makeElderSetup(n){const count=NUS_SETUP_COUNTS[n];const num=count.elders;const pos=i=>[423+(i%3)*205,168+Math.floor(i/3)*227];const src=k=>[62+((k-1)%3)*83,98+Math.floor((k-1)/3)*73];const piece=k=>card('elderSetup'+k,'setupElder',...src(k),String(k),[],{width:66,height:54,faceDown:false});
 const state=[...many(6,i=>piece(i+13)),...many(6,i=>piece(i+1)),...many(6,i=>piece(i+7))];
 const lower=many(6,i=>{const [x,y]=pos(i);return move('elderSetup'+(i+1),x,y,{width:132,height:126})});
 const upper=many(Math.min(6,num-6),i=>{const [x,y]=pos(i);return move('elderSetup'+(i+7),x+10,y+20,{width:132,height:126})});
 const randomOrder=[16,13,18,14,17,15];const bottom=many(6,i=>{const [x,y]=pos(i);return move('elderSetup'+randomOrder[i],x-10,y-22,{width:132,height:126,faceDown:true})});
 const remove=many(18-num,i=>move('elderSetup'+(num+1+i),...src(num+1+i),{hidden:true}));
 return setupChapter('elders','원로 카드 세팅하기',`게임 준비 · ${n}인 · ${num}장 사용`,state,[
 step(`원로 카드에는 번호와 인원수 표시가 있습니다. 기본 게임에서는 ${n}인일 때 1~${num}번을 사용합니다. ${num<18?'그 밖의 번호와 선택·프로모 원로는 상자에 넣어 둡니다.':'선택·프로모 원로는 제외합니다.'} 개별 원로의 효과는 플레이 중 카드에서 확인하면 됩니다.`,[],['setupElderSource']),
 ...(num<18?[step(`1~${num}번만 남기고 나머지 번호는 상자에 돌려놓습니다.`,remove,['setupElderSource'])]:[step('5인 게임에서는 13~18번 여섯 장을 따로 섞습니다. 번호가 보이지 않게 뒤집어 각 칸 맨 아래에 무작위로 한 장씩 넣습니다. 화면의 배치는 예시입니다.',bottom,['setupElderBoard'])]),
 step('공용 원로 공급판에는 여섯 칸이 있습니다. 1·2·3번은 윗줄 왼쪽부터, 4·5·6번은 아랫줄 왼쪽부터 앞면으로 놓습니다.',lower,['setupElderBoard'],null),
 step(`${n}인 게임에서는 ${n===2?'7번만 1번 위에':n===3?'7·8·9번을 1·2·3번 위에':'7~12번을 각각 1~6번 위에'} 앞면으로 겹쳐 놓습니다. 아래 카드가 가려져도 정상입니다.`,upper,['setupElderBoard']),
 step(`완성: 여섯 더미, 총 ${num}장입니다. 원로 영입 시 각 더미의 맨 위 카드만 선택할 수 있습니다. ${n===5?'13~18번은 아직 뒷면으로 숨겨 둡니다.':'아래 카드도 위 카드가 제거되어야 선택할 수 있습니다.'}`,[],['setupElderBoard'])
 ],[setupPanel('setupElderSource',18,20,282,525,'원로 카드 · 번호 확인','#eee3cc'),setupPanel('setupElderBoard',316,20,666,525,'선박·원로 공급판 · 원로 6칸 확대','#b5c8a0')],many(6,i=>{const[x,y]=pos(i);return setupSlot(x-82,y-82,164,174,`${i+1}번 / ${i+7}번 자리`)}),[setupText(34,519,'선택·프로모 카드 제외',13),setupText(333,529,`기본 원로 ${num}장 · 위 카드부터 선택`,15)]);
}
function makeBuildingSetup(n){const count=NUS_SETUP_COUNTS[n];const Apos=i=>[344+(i%3)*126,130+Math.floor(i/3)*110],Bpos=i=>[770+(i%2)*126,130+Math.floor(i/2)*110];const source={A:[121,132],B:[121,273],C:[121,414]};const deck=(letter,total)=>card('deck'+letter,'deckStack',...source[letter],letter,[`${total}장 · 뒷면`],{width:158,height:83});const state=[deck('A',18),deck('B',12),deck('C',14),...many(9,i=>card('openA'+i,'setupBuilding',...source.A,'A',[],{width:104,height:74,faceDown:true,hidden:true})),...many(6,i=>card('openB'+i,'setupBuilding',...source.B,'B',[],{width:104,height:74,faceDown:true,hidden:true}))];
 const openA=many(9,i=>move('openA'+i,...Apos(i),{hidden:false,faceDown:false})),openB=many(6,i=>move('openB'+i,...Bpos(i),{hidden:false,faceDown:false}));
 return setupChapter('buildings','A·B·C 건물 카드 세팅하기',`게임 준비 · ${n}인 · 한 가지 덱만`,state,[
 step('빅박스에는 여러 건물 덱이 있습니다. 뒷면의 물고기 등 그림을 보고 한 가지 덱만 선택합니다. 첫 게임은 청어 덱(101~154번)을 권장합니다. 나머지 덱은 상자에 넣습니다.',[],['setupDecks']),
 step('선택한 덱의 카드를 A 18장, B 12장, C 14장으로 나누고 세 더미를 각각 섞습니다. 모두 뒷면으로 둡니다. 다른 덱끼리 섞지 않습니다.',[],['setupDecks']),
 step('A 더미에서 9장을 뽑아 A 건물 공급판의 3×3 칸에 한 장씩 앞면으로 공개합니다. 화면의 카드 그림은 배치용 예시입니다.',[...openA,move('deckA',...source.A,{lines:['9장 · 뒷면']})],['setupA','setupDecks']),
 step('B 더미에서 6장을 뽑아 B 건물 공급판의 2×3 칸에 한 장씩 앞면으로 공개합니다.',[...openB,move('deckB',...source.B,{lines:['6장 · 뒷면']})],['setupB','setupDecks']),
 step(n===2?'남은 A 9장과 B 6장은 상자에 넣습니다. 2인 게임은 3·5라운드 추가 공개가 없습니다. C 14장은 뒷면으로 따로 준비합니다.':'남은 A 9장·B 6장은 추가 공개용으로 뒷면으로 보관합니다. C 14장도 뒷면으로 따로 준비하고 시작할 때는 한 장도 공개하거나 나누지 않습니다.',n===2?[move('deckA',...source.A,{hidden:true}),move('deckB',...source.B,{hidden:true})]:[],['setupDecks']),
 step(`이제 A 9장, B 6장이 공개된 상태로 시작합니다. ${n===2?'3·5라운드에는 추가 공개가 없습니다.':`3라운드에는 A 최대 ${count.addA}장, 5라운드에는 B 최대 ${count.addB}장을 빈 칸에만 보충합니다.`} 4라운드에는 C를 각자 ${count.c}장씩 비공개로 받고, 6라운드에는 손에 남은 C를 모두 공개합니다.`,[],['setupA','setupB','setupDecks'])
 ],[setupPanel('setupDecks',18,20,207,525,'선택한 덱 · 44장','#eee3cc'),setupPanel('setupA',238,20,414,410,'A 건물판 · 9칸','#b4d5de'),setupPanel('setupB',665,20,317,410,'B 건물판 · 6칸','#b4d5de'),setupPanel('setupSchedule',238,443,744,102,'라운드별 공개 규칙','#e4e8d9')],
 [...many(9,i=>{const[x,y]=Apos(i);return setupSlot(x-57,y-42,114,84,'A')}),...many(6,i=>{const[x,y]=Bpos(i);return setupSlot(x-57,y-42,114,84,'B')})],
 [setupText(32,504,'C는 별도 공급판 없음',12),setupText(254,488,`3R A ${n===2?'없음':`최대 ${count.addA}장`}   ·   4R C 각 ${count.c}장(비공개)`,15),setupText(254,517,`5R B ${n===2?'없음':`최대 ${count.addB}장`}   ·   6R 남은 C 공개`,15)]);
}


extraChapters.push(S('금 1개와 예비고 옮기기','행동 · 자원 확보','10',[
 ...base(),...many(3,i=>xf('fish'+i,270+i*29,193)),wood(0,270,216),wood(1,298,216),coin(0,48,82)
 ],[
 step('금을 얻는 가장 간단한 행동은 금 1개 칸입니다. 비용 없이 금을 한 개 가져옵니다.',[],['actions','supply']),
 step('일꾼을 금 칸에 놓고 금 1개를 개인 공급처에 넣습니다.',[ws(0,144,278),move('coin0',778,254)],['actions','personal'],{id:'worker0',x:144,y:278}),
 step('예비고는 비용으로 바로 사용할 수 없는 창고입니다. 이 예시에는 물고기 3마리와 목재 2개가 있습니다. 자원이 하나라도 있을 때 예비고 이동 행동을 선택할 수 있습니다.',[],['reserve','personal']),
 step('예비고 이동 칸에 두 번째 일꾼을 놓습니다. 그곳에 있는 모든 자원을 가져와야 합니다.',[ws(1,...A.reserve)],['extraActions'],{id:'worker1',x:A.reserve[0],y:A.reserve[1]}),
 step('모든 물고기와 목재를 개인 공급처로 옮깁니다. 목재 12개 한도를 넘은 부분은 공용 공급처로 돌려보냅니다. 물고기와 금은 보관 한도가 없습니다.',[...many(3,i=>move('fish'+i,770+i*35,169)),move('wood0',778,211),move('wood1',814,211)],['reserve','personal'])
 ],D('예비고 → 개인 공급처',[[474,606,'예비고 자원을 전부 이전'],[474,650,'목재 한도 12개'],[474,690,'물고기·금 보관 한도 없음']])));
extraChapters.push(S('재조림으로 숲 늘리기','행동 · 숲 2개 쌓기','12',[
 ...base().filter(p=>p.id!=='forest3'),P('forestNew0','forest',570,635),P('forestNew1','forest',564,628)
 ],[
 step('재조림을 하면 숲 두 개를 공용 공급처에서 가져옵니다. 항구판에 정해진 가로 두 칸짜리 구역이 통째로 비어 있어야 합니다.',[],['harbor','context']),
 actionIntro('재조림 행동에 일꾼을 놓습니다.', 'reforest'),
 step('빈 가로 두 칸에 숲 두 개를 겹쳐 놓습니다. 세로로 이어진 칸에 놓거나 기존 숲 위에 추가할 수 없습니다.',[move('forestNew0',574,349),move('forestNew1',568,342)],['harbor'],{id:'forestNew1',x:568,y:342}),
 step('이제 숲이 5개가 되었습니다. 이후 솎아베기를 하면 목재를 최대 5개 받을 수 있습니다. 숲은 허용된 행동이나 카드 효과 없이 임의로 옮길 수 없습니다.',[],['harbor','personal'])
 ],D('재조림용 숲 타일',[[474,707,'같은 빈 가로 2칸에 겹쳐 놓기']])));
extraChapters.push(S('선박을 건조하는 방법','행동 · 배를 늘려 어획 증가','12–13',[
 ...base(),...ownGold(4),
 card('sloop','ship',511,617,'소형선',['목재 2 · 생선 2','1점 · 2칸'],{width:108}),
 card('cutter','ship',677,617,'중형선',['목재 6 · 금 1','2점 · 3칸'],{width:145}),
 card('schooner','ship',852,617,'대형선',['목재 8+생선 8','또는 금 4 · 4점'],{width:176}),
 P('haul','metric',472,714,{name:'현재 어획량',lines:['3마리']})
 ],[
 step('선박은 세 종류입니다. 소형선은 2칸, 중형선은 3칸, 대형선은 4칸을 덮습니다. 타일에 표시된 비용을 내고 그 배의 점수를 얻습니다.',[],['context','fleet']),
 actionIntro('선박 건조 칸에 일꾼을 놓습니다. 한 번에 한 척만 만들 수 있습니다. 이번에는 금 4개로 대형선을 건조합니다.','ship'),
 step('개인 공급처의 금 4개를 공용 공급처에 지불합니다. 대형선은 목재 8개와 물고기 8개를 내는 방법도 있습니다.',many(4,i=>bank('coin'+i,i)),['personal','supply']),
 step('배 타일을 시작 배 오른쪽의 가장 왼쪽 빈 자리부터 놓습니다. 첫 칸은 2칸으로 계산합니다. 이 예시에서는 어획량이 3에서 6으로 늘어납니다.',[move('schooner',348,492,{width:97,height:72,lines:['4점']}),move('haul',472,714,{lines:['6마리 · 다음 어획부터']})],['fleet','context'],{id:'schooner',x:348,y:492}),
 step('어획량은 왼쪽부터 처음 드러난 숫자입니다. 트랙 밖으로 배가 조금이라도 나가면 건조할 수 없고, 어획량 12가 되면 더 이상 배를 추가할 수 없습니다.',[],['fleet'])
 ],D('선박 공급판 · 비용과 크기',[[474,665,'대형선은 두 가지 지불 방법'],[474,747,'이미 지나간 어획 단계에 소급하지 않음']])));
extraChapters.push(S('연회에 생선 제공하기','행동 · 생선으로 금 획득','10, 13–14',[
 ...base(),...ownFish(6),xf('filled0',472,628),xf('filled1',542,628),addCoin('gain0',48,82),addCoin('gain1',85,82)
 ],[
 step('연회판은 모든 사람이 같이 사용합니다. 접시 위 생선은 금을 얻고 원로를 활용하는 데 연결됩니다. 예시는 가장 작은 두 접시가 이미 채워진 상태입니다.',[],['context']),
 actionIntro('연회 제공 칸에 일꾼을 놓습니다. 비어 있는 접시 중 가장 작은 것부터, 원하는 만큼 연속으로 채웁니다. 최소 한 접시는 채워야 합니다.','serve'),
 step('다음 빈 접시는 비용 3입니다. 개인 공급처에서 물고기 세 마리를 내고 그중 한 마리만 접시에 올리며 나머지 두 마리는 공용 공급처로 돌려보냅니다. 금 1개를 받습니다.',[move('fish0',612,628),bank('fish1',0),bank('fish2',1),move('gain0',778,254)],['context','personal','supply'],{id:'fish0',x:612,y:628}),
 step('다음 빈 접시는 비용 3입니다. 물고기 3마리 중 1마리를 접시에 올리고 2마리를 공용으로 되돌립니다. 금 1개를 더 받습니다. 이번 행동은 생선 6마리를 써서 금 2개를 얻었습니다.',[move('fish3',682,628),bank('fish4',2),bank('fish5',3),move('gain1',814,254)],['context','personal','supply']),
 step('접시가 전부 차 있거나 첫 빈 접시 비용을 낼 수 없다면 이 행동을 선택할 수 없습니다. 이 접시의 생선은 이후 원로 행동을 할 때 사용합니다.',[],['context'])
 ],D('공용 연회판 · 접시의 생선은 1마리씩',[[474,688,'빈 접시를 낮은 비용부터 채우기'],[474,724,'채운 접시 하나당 금 1개']],[[472,628,'2'],[542,628,'2'],[612,628,'3'],[682,628,'3'],[752,628,'4'],[822,628,'4'],[892,628,'5']])));
// Seven plates, costs 2, 2, 3, 3, 4, 4, 5 (rulebook pp.10, 14).
extraChapters.push(S('원로를 데려오고 사용하기','행동 · 연회와 원로의 연결','13–14, 18–19',[
 ...base(),card('elder','elder',490,654,'양식업자',['생선 3 + 원로 수'],{width:82}),
 xf('p0',660,628),xf('p1',725,628),...many(8,i=>xf('new'+i,44+(i%5)*36,73+Math.floor(i/5)*29))
 ],[
 step('원로는 개인 의회의 새로운 행동칸이 됩니다. 공용 원로 더미의 맨 위에 공개된 카드만 가져올 수 있고, 최대 5명까지 고용하며 버릴 수 없습니다.',[],['context','council']),
 actionIntro('원로 영입 칸에 일꾼을 놓고 원로 한 명을 선택합니다. 이 예시는 양식업자 효과로 설명합니다.','elder'),
 step('원로 카드를 비어 있는 개인 의회 자리에 옮깁니다. 지금 바로 사용할 수 있지만 반드시 사용할 필요는 없습니다.',[move('elder',294,76,{width:68})],['context','council'],{id:'elder',x:294,y:76}),
 step('즉시 사용을 선택했다면 일꾼은 추가로 놓지 않습니다. 연회에서 생선이 놓인 가장 큰 번호의 접시의 생선 한 마리를 원로 카드에 올립니다. 개인 공급처 생선으로 대신할 수 없습니다.',[move('p1',312,52)],['context','council']),
 step('그다음 원로 효과를 실행합니다. 이 양식업자는 생선 3마리에 보유 원로 수 1을 더해 총 4마리를 개인 공급처로 가져옵니다.',many(4,i=>move('new'+i,765+i*37,169)),['council','personal']),
 step('나중에 같은 라운드에 이 원로 위에 일꾼 한 명을 직접 놓아 한 번 더 사용할 수 있습니다. 이번에도 연회의 가장 큰 남은 접시에서 생선 한 마리를 가져옵니다.',[ws(1,294,95),move('p0',294,52)],['context','council'],{id:'worker1',x:294,y:95}),
 step('원로의 효과를 다시 처리합니다. 연회가 비어 있으면 원로 행동은 불가능합니다. 한 라운드에 원로 카드 한 장에는 일꾼을 한 명만 놓을 수 있습니다.',many(4,i=>move('new'+(i+4),765+i*37,199)),['personal','council'])
 ],D('원로 공급처와 연회 · 별도 예시',[[474,715,'원로 카드 상단에 생선 3칸'],[650,679,'가장 큰 채워진 접시부터 사용']],[[660,628,'2'],[725,628,'2']])));
extraChapters.push(S('원로 위 생선이 3마리가 되면','어획 및 원로 행동 · 즉시 정산','6, 13',[
 ...base(),card('elder','elder',294,76,'원로',['효과 별도'],{width:68}),xf('elder0',275,52),xf('elder1',294,52),xf('elder2',58,398)
 ],[
 step('원로 카드 위 생선이 2마리인 상황입니다. 어획 배분이나 연회에서 가져온 생선이 이 카드에 추가될 수 있습니다.',[],['council','catch']),
 step('세 번째 생선이 카드 위에 올라갑니다.',[move('elder2',313,52)],['council'],{id:'elder2',x:313,y:52}),
 step('즉시 생선 한 마리는 내 개인 공급처로, 나머지 두 마리는 공용 공급처로 돌아갑니다. 원로 카드는 그대로 남아 있어요.',[move('elder2',790,169),bank('elder0',0),bank('elder1',1)],['council','personal','supply'])
 ],null));
extraChapters.push(S('건물을 지어 항구 발전시키기','행동 · 건설 비용과 카드 효과','11',[
 ...base(),...ownWood(1),...many(4,i=>xf('reward'+i,48+i*38,82)),card('fishStand','building',530,641,'생선 가판대',['목재 1 · 0점','즉시 생선 +4'],{width:120}),card('bExample','building',698,641,'B 건물',['효과·비용 확인'],{width:120}),card('cExample','building',866,641,'C 건물',['4라운드부터'],{width:120})
 ],[
 step('건물은 비용, 점수, 효과를 먼저 확인합니다. A는 초반 자원과 효과, B는 대체로 더 비싸고 유용한 효과, C는 후반 점수에 도움이 되는 건물입니다.',[],['context']),
 actionIntro('건물 건설 칸에 일꾼을 놓습니다. 한 번에 건물 한 장만 건설할 수 있습니다. 예시 카드의 비용은 목재 1개입니다.','building'),
 step('목재 1개를 공용 공급처에 지불합니다.',[bank('wood0',0)],['personal','supply']),
 step('건물 카드를 항구판의 비어 있는 건설칸에 놓습니다. 숲이 덮인 칸 또는 이미 건물이 있는 칸에는 놓을 수 없고, 지은 뒤에는 마음대로 옮기거나 제거할 수 없습니다.',[move('fishStand',415,194,{width:94,lines:['0점 · +4 생선']})],['context','harbor'],{id:'fishStand',x:415,y:194}),
 step('이 건물의 즉시 효과를 실행하여 생선 4마리를 개인 공급처로 가져옵니다. 건물별 조건과 효과는 카드마다 다릅니다.',many(4,i=>move('reward'+i,765+i*37,169)),['harbor','personal']),
 step('4라운드부터는 손에 든 C 건물을 지을 수 있습니다. 6라운드부터는 남아 있는 C가 공개되어 누구나 선택할 수 있습니다. 비용과 빈 칸을 만족해야 합니다.',[],['context','harbor'])
 ],D('공개 건물 예시 · A / B / C',[[474,712,'비용 지불 → 빈 칸에 배치 → 카드 효과 처리']])));
extraChapters.push(S('주식 시장의 주식 전부 매수하기','행동 · 배당과 점수','11',[
 ...base(),sh('marketRed',68,339),sh('marketBlue',170,339,'#426f9a'),...ownGold(2)
 ],[
 step('시장에 빨간색과 파란색 발행 주식이 하나씩 있습니다. 주식을 매수할 때는 색깔을 가리지 않고 시장에 있는 주식을 전부 가져와야 합니다.',[],['market']),
 actionIntro('주식 매수 칸에 일꾼을 놓습니다. 1~3라운드는 주식당 금 1개입니다. 이번에는 두 개라 금 2개입니다.','buy'),
 step('금 2개를 공용 공급처에 지불하고 두 주식을 개인 공급처 옆으로 가져옵니다. 내 주식도 다시 사 올 수 있습니다.',[bank('coin0',0),bank('coin1',1),move('marketRed',845,455),move('marketBlue',933,455)],['market','personal','shares'],{id:'marketBlue',x:933,y:455}),
 step('4~5라운드는 전체 가격에서 금 1개를 빼고, 6~7라운드는 금 2개를 뺍니다. 최저 가격은 0입니다. 전부 살 돈이 없으면 일부만 매수할 수 없습니다.',[],['extraActions','shares']),
 step('이제 두 회사의 발행 주식을 보유하므로 향후 해당 회사가 배당하면 그 물고기를 받습니다. 최종 점수도 발행 주식 하나당 1점입니다.',[],['shares','personal'])
 ],D('주식 매수 비용 · 두 주식 예시',[[474,618,'1~3라운드 : 2금'],[474,659,'4~5라운드 : 1금'],[474,700,'6~7라운드 : 0금']])));
extraChapters.push(S('중반 어획과 배당 전체 흐름','어획 · 외부 주식과 예비고 상한','6–7',[
 ...base().filter(p=>!['share2','share3'].includes(p.id)),sh('marketRed',97,339),sh('foreignRed',807,654),sh('ownBlue',857,401,'#426f9a'),card('elder','elder',294,76,'원로',['효과 별도'],{width:68}),xf('oldE0',275,52),xf('oldE1',294,52),...many(7,i=>xf('reserve'+i,267+(i%3)*29,182+Math.floor(i/3)*20)),...many(8,i=>xf('catch'+i,45+(i%5)*35,397+Math.floor(i/5)*30)),xf('blueDividend',920,620)
 ],[
 step('후반 예시입니다. 이번에 새로 잡은 생선은 8마리이고 내 원로 1명, 시장과 상대에게 내 주식 1개씩, 내가 보유한 내 발행 주식 2개, 예비고 생선 7마리가 있습니다. 예시에서는 파란 회사 주식도 보유하고 있습니다.',[],['catch','council','market','shares','reserve','context']),
 step('먼저 원로에게 한 마리를 줍니다. 원로 위에 세 마리가 되었으므로 즉시 한 마리는 개인 공급처로, 두 마리는 공용 공급처로 이동합니다.',[move('catch0',313,52)],['council']),
 step('세 마리 중 한 마리를 개인 공급처로 옮기고 두 마리는 공용으로 되돌립니다.',[move('catch0',765,159),bank('oldE0',0),bank('oldE1',1)],['council','personal','supply']),
 step('그다음 외부에 있는 내 회사 주식에 한 마리씩 배분합니다. 시장 주식이 우선이고 그다음 다른 플레이어가 가진 주식입니다.',[move('catch1',97,324),move('catch2',807,637)],['market','context']),
 step('내가 보유한 내 회사 발행 주식 두 개에도 한 마리씩 놓습니다. 파란 회사 주식에는 내가 잡은 생선을 놓지 않습니다.',[move('catch3',787,333),move('catch4',887,333)],['shares']),
 step('예비고에는 어획 배분으로 8마리까지만 넣을 수 있으므로 한 마리만 추가합니다. 이번에 남은 생선 두 마리는 공용 공급처로 돌려보냅니다. 카드 효과로 이미 8마리 이상 있다면 줄일 필요는 없습니다.',[move('catch5',325,222),bank('catch6',2),bank('catch7',3)],['reserve','supply']),
 step('모두의 배분이 끝난 뒤 시장 위 생선은 공용으로 버리고, 소유한 모든 발행 주식 위 생선은 각 소유자의 개인 공급처로 옮깁니다. 파란 회사가 준 한 마리도 내 개인 공급처로 들어옵니다.',[bank('catch1',4),move('catch2',909,699),move('catch3',800,159),move('catch4',835,159),move('blueDividend',870,159)],['market','context','shares','personal']),
 step('새로 잡은 생선만 배분합니다. 부족하더라도 기존 보유 생선을 쓰지 않습니다. 원로 또는 외부 주식 단계에서 부족하면 어디에 배분할지 선택할 수 있지만 시장 주식이 다른 외부 주식보다 우선입니다.',[],['catch','council','market'])
 ],D('외부 플레이어의 주식과 배당',[[474,613,'노란 플레이어 공급처'],[474,655,'내 회사 주식 → 상대가 수령'],[474,703,'상대 수령 위치'],[827,593,'파란 회사가 준 배당']])));
extraChapters.push(S('행동칸이 차 있으면 어떻게 하나요?','인원수 차이 · 4~5인 모방','8, 14',[
 ...base(),worker('other1',144,167),worker('other2',179,167,'#d9af35'),...ownGold(0),coin(0,48,82),coin(1,85,82)
 ],[
 step('행동칸의 수용량이 꽉 차면 그 라운드에 더 놓을 수 없습니다. 3~5인 판의 주식 발행은 2명, 벌목·선박·원로 영입도 각각 2명, 건물 건설은 3명입니다. 같은 사람의 일꾼도 빈 자리를 이용할 수 있습니다.',[],['actions','extraActions']),
 step('이 예시는 4인 게임입니다. 두 명이 이미 주식 발행 칸을 사용했습니다. 4인 게임의 공용 모방 칸은 1명만 사용할 수 있고, 이미 꽉 찬 행동을 선택해 따라 할 수 있습니다.',[],['actions','extraActions']),
 actionIntro('모방 칸에 내 일꾼을 놓고, 꽉 찬 주식 발행 행동을 선택합니다.','copy'),
 step('주식 하나를 발행하고 금 두 개를 받습니다. 모방은 사용 조건과 비용까지 그대로 적용합니다.',[move('share2',97,340,{issued:true}),move('coin0',778,254),move('coin1',814,254)],['market','personal']),
 step('5인 게임은 행동판 세 열에 대응하는 모방 칸이 각각 하나씩 있습니다. 아직 빈자리가 있는 행동이나 원로 카드의 행동은 모방할 수 없습니다. 2인·3인에는 공용 모방 타일이 없습니다.',[],['extraActions']),
 step('2인 판은 발행·벌목·선박·원로 영입 칸의 수용량이 각 1명이고, 건물 건설 칸 두 개에 각각 한 명씩 놓습니다. 행동을 선택하면 실제 효과를 처리해야 합니다. 아무것도 바뀌지 않는 행동은 할 수 없습니다. 패스하면 그 차례를 잃습니다.',[],['actions','extraActions'])
 ],D('인원수에 따른 행동칸',[[474,615,'3~5인: 발행·벌목·선박·원로 2명'],[474,657,'건물 3명 / 그 외 대부분 1명'],[474,699,'4인: 모방 1칸 · 5인: 열별 3칸']])));
extraChapters.push(S('라운드 종료와 새 건물 공개','귀환 · 라운드별 준비','9',[
 ...base().map(p=>p.type==='worker'?{...p,x:144,y:167+Number(p.id.slice(-1))*37}:p),P('firstShip','turnShip',481,623),...many(3,i=>card('newA'+i,'miniCard',486+i*58,719,'A',[])),...many(2,i=>card('newB'+i,'miniCard',664+i*58,719,'B',[])),...many(3,i=>card('newC'+i,'miniCard',824+i*46,719,'C',[]))
 ],[
 step('모든 사람이 각자 세 차례를 마치면 귀환 단계입니다. 공용 행동판과 원로 위 일꾼을 전부 회수합니다.',[],['workers','actions','council']),
 step('이번 라운드에 사용한 일꾼 세 명을 되돌려 놓습니다.',many(3,i=>ws(i,52+i*43,509)),['workers','actions','council']),
 step('선 플레이어 배를 다음 라운드 번호로 옮깁니다. 배는 반시계 방향으로 이동하여 현재 선 플레이어의 오른쪽 사람이 다음 선 플레이어가 됩니다.',[move('firstShip',557,623)],['context','rounds'],{id:'firstShip',x:557,y:623}),
 step('3라운드 시작: 3~5인 게임은 A 건물을 인원수만큼 추가합니다. 3인 예시에서는 최대 3장, 빈 칸만 채울 수 있습니다.',[move('firstShip',633,623),...many(3,i=>move('newA'+i,500+i*55,674))],['context']),
 step('4라운드 시작: 각 플레이어에게 C 건물을 비공개로 나눕니다. 2인 4장, 3인 3장, 4~5인 2장씩입니다. 이때부터 자신의 손에 든 C를 건설할 수 있습니다.',[move('firstShip',709,623),...many(3,i=>move('newC'+i,827+i*46,674))],['context']),
 step('5라운드 시작: 3~4인은 B 건물 2장, 5인은 3장을 빈 칸만큼 추가합니다.',[move('firstShip',785,623),...many(2,i=>move('newB'+i,671+i*55,674))],['context']),
 step('6라운드 시작: 모두 손에 남은 C 건물을 공개합니다. 누구든 공개된 C를 지을 수 있습니다.',[move('firstShip',861,623),...many(3,i=>move('newC'+i,827+i*46,719,{name:'C 공개'}))],['context']),
 step('7라운드까지 마치면 게임을 종료합니다. 2인 게임에서는 3·5라운드 추가 A/B 공개가 없다는 점에 주의하세요.',[move('firstShip',937,623)],['rounds','context'])
 ],D('라운드 진행표 · 3인 예시',[[474,658,'A 공개'],[650,658,'B 공개'],[813,658,'C 손패 / 공개']],many(7,i=>[481+i*76,623,String(i+1)]))));
extraChapters.push(S('마지막 점수 계산하기','7라운드 종료 · 점수 예시','15',[
 ...base().filter(p=>['forest0','forest1','forest2','share0','share1','share2','share3','share4'].includes(p.id)),sh('otherShare',857,455,'#426f9a'),...ownGold(3),card('scoreShip','ship',348,492,'대형선',['4점'],{width:97,height:72}),card('scoreBuildA','building',415,194,'건물 A',['2점'],{width:94}),card('scoreBuildB','building',304,277,'건물 B',['3점'],{width:94}),card('scoreBuildC','building',415,277,'조건 건물',['조건 충족 4점'],{width:94}),P('score','metric',475,692,{name:'합계',lines:['0점']})
 ],[
 step('7라운드가 끝나면 최종 점수를 계산합니다. 이 예시에는 선박 4점, 건물 2점·3점·조건부 4점이 있습니다. 조건부 점수는 카드가 요구하는 조건을 실제로 확인합니다.',[],['fleet','harbor','context']),
 step('선박과 건물의 점수를 더합니다. 합계는 13점입니다.',[move('score',475,692,{lines:['4 + 2 + 3 + 4 = 13점']})],['fleet','harbor','context']),
 step('보유한 발행 주식은 색과 관계없이 한 개당 1점입니다. 이 예시는 3개라서 3점을 더합니다.',[move('score',475,692,{lines:['13 + 3 = 16점']})],['shares','context']),
 step('개인 공급처 금은 1개당 1점입니다. 예비고 금과 일반 목재·생선은 카드 효과가 없는 한 기본 점수가 아닙니다. 금 3개를 더합니다.',[move('score',475,692,{lines:['16 + 3 = 19점']})],['personal','context']),
 step('숲이나 건물로 덮이지 않은 빈 건설칸마다 1점을 뺍니다. 예시에서는 건설칸 11개 중 숲이 4칸, 건물이 3칸을 덮으므로 빈 4칸입니다.',[move('score',475,692,{lines:['19 − 4 = 15점']})],['harbor','context']),
 step('미발행 주식 3개에 대해 3점을 빼면 총 12점입니다. 가장 점수가 높은 사람이 승리하며 동점이면 공동 승리입니다.',[move('score',475,692,{lines:['15 − 3 = 12점']})],['shares','context'])
 ],D('최종 점수 합산',[[474,613,'선박·건물 + 발행 주식 + 금'],[474,648,'빈 건설칸·미발행 주식 감점']])));
// Preserve old demonstrations and replace incomplete outline with real chapters, in teaching order.
const old=chapters.splice(0);
old[1].frames[0].text='항구판 위에는 원로 의회를, 옆에는 원형 개인 공급처를 놓습니다. 일반 행동 비용은 개인 공급처에서 지불합니다. 시작 자원은 없고, 어획 단계부터 생선이 들어옵니다.';
old[1].frames[1].text='숲 타일은 총 네 개입니다. 오른쪽 맨 위 가로 두 칸에 두 개를 겹쳐 놓고, 중간과 아래에는 하나씩 놓습니다.';
old[3].frames[3].text='이제 다른 사람의 차례입니다. 다시 내 차례가 돌아오면 다음 일꾼을 사용할 수 있습니다. 같은 행동에 빈 자리가 있다면 내 일꾼을 또 놓을 수 있습니다. 개인 공급처 목재는 최대 12개입니다.';
old[4].frames[3].text='목재 5개를 개인 공급처로 가져옵니다. 12개 한도를 넘지 않게 받고, 이미 목재가 12개라도 벌목은 가능합니다. 반대로 숲이 없거나 목재가 12개라면 솎아베기는 할 수 없습니다.';
old[5].frames[3].text='다음 어획 때 이 주식에도 내 물고기를 먼저 배분합니다. 시장에 남은 주식의 물고기는 공용으로 돌아갑니다. 다른 플레이어가 이 주식을 사면 그 사람이 배당을 받습니다. 주식 발행은 게임 전체에 최대 세 번입니다.';

// v0.7 — the same selected count applies to every lesson. The setup chapters
// are regenerated, not patched from a previously selected player count.
const NUS_COLORS=['#c44b42','#437ba8','#c7a336','#529361','#a5a5a0'];
const NUS_COLOR_NAMES=['빨강','파랑','노랑','초록','회색'];
const NUS_CAPS=n=>({issue:n===2?1:2,deforest:n===2?1:2,ship:n===2?1:2,elder:n===2?1:2,building:n===2?2:3,copy:n<4?0:n===4?1:3});
const turnRounds=(n,i)=>many(7,j=>j+1).filter(round=>(round-1)%n===i);
const seatPos=(n,i)=>[Math.round(500+340*Math.sin(i*2*Math.PI/n)),Math.round(282+174*Math.cos(i*2*Math.PI/n))];
function makeTableSetup(n){
 const pos=many(n,i=>seatPos(n,i));
 const kits=pos.map(([x,y],i)=>P('kit'+i,'playerKit',500+(i-2)*35,270,{color:NUS_COLORS[i],name:NUS_COLOR_NAMES[i],lines:['미배치'],hidden:true}));
 const tiles=pos.map(([x,y],i)=>P('order'+i,'turnTile',500+(i-2)*35,300,{color:NUS_COLORS[i],name:String(n),lines:turnRounds(n,i).map(String),hidden:true}));
 const first=[pos[0][0]+80,pos[0][1]+27];
 return setupChapter('table','모든 플레이어의 세팅과 순서 타일',`게임 준비 · ${n}인 전체 테이블`,[...kits,...tiles,P('orderShip','turnShip',500,284,{hidden:true})],[
  step(`${n}명이 각각 원하는 색을 고릅니다. 예시 색상은 ${NUS_COLOR_NAMES.slice(0,n).join('·')}입니다. 항구판, 원로 의회, 개인 공급처를 색별로 하나씩 꺼냅니다.`,[],['setupTable']),
  step(`${n}명 모두에게 같은 색 일꾼 3개, 주식 5개, 숲 4개를 지급합니다. 각각 항구판 위에 원로 의회, 오른쪽에 개인 공급처를 놓습니다.`,pos.map(([x,y],i)=>move('kit'+i,x,y,{hidden:false,lines:['기본 배치']})),['setupTable']),
  step(`전체 준비량: 일꾼 ${3*n}개, 주식 ${5*n}개, 숲 ${4*n}개입니다. 각자 주식 2개를 발행 면, 3개를 미발행 면으로 두며 초기 자원은 없습니다. 숲 배치와 주식 뒤집기는 다음 주제에서 확대하여 설명합니다.`,pos.map(([x,y],i)=>move('kit'+i,x,y,{lines:['완료']})),['setupTable']),
  step(`${n}인용 순서 타일 ${n}개를 찾습니다. ${n===2?'직사각형':n===3?'삼각형':n===4?'정사각형':'오각형'} 타일입니다. 첫 플레이어를 무작위로 정하고 1번 라운드가 있는 타일을 줍니다. 타일 가장자리 번호에 맞춰 나머지 타일을 배분하고 자기 번호가 자기 쪽을 향하도록 돌립니다.`,pos.map(([x,y],i)=>move('order'+i,x+80,y+27,{hidden:false})),['setupTable']),
  step(`첫 플레이어의 1라운드 칸에 배를 놓습니다. 행동은 시계 방향, 다음 라운드 선 플레이어는 오른쪽 사람(반시계 방향)입니다. 화면의 각 순서 타일에는 그 사람이 선이 되는 라운드 번호가 적혀 있습니다.`,[move('orderShip',...first,{hidden:false})],['setupTable'],null)
 ],[setupPanel('setupTable',18,20,964,525,`${n}인 테이블 · 예시 좌석 배치`,'#e3e9d7')],[],[
  setupText(500-77,254,'공용 구성품 중앙',15),setupText(500-124,280,`${n}명 × 동일한 개인 세팅`,14),setupText(500-122,309,`일꾼 ${3*n} · 주식 ${5*n} · 숲 ${4*n}`,15),setupText(500-118,335,'선 플레이어는 오른쪽으로',13)
 ]);
}
function makeBanquet(n){
 const initial=n-1,costs=[2,2,3,3,4,4,5],total=costs[initial]+costs[initial+1],pos=i=>472+i*70;
 const frames=[step(`연회판은 공용입니다. ${n}인 게임 시작 시 ${initial}개 접시가 채워져 있습니다. 이번 예시는 그 시작 상태에서 빈 접시 두 개를 추가로 채웁니다.`,[],['context']),actionIntro('연회 제공 칸에 일꾼을 놓습니다. 비어 있는 접시 중 가장 작은 것부터 원하는 만큼 연속으로 채웁니다. 최소 한 접시는 채워야 합니다.','serve')];
 let fish=0,returned=0;
 for(let j=0;j<2;j++){let idx=initial+j,cost=costs[idx],start=fish;frames.push(step(`다음 빈 접시 비용은 ${cost}마리입니다. 그중 한 마리를 접시에 올리고 ${cost-1}마리를 공용 공급처로 돌려보냅니다. 금 1개를 받습니다.${j===1?` 총 ${total}마리로 금 2개를 얻었습니다.`:''}`,[move('fish'+start,pos(idx),628),...many(cost-1,i=>bank('fish'+(start+1+i),returned+i)),move('gain'+j,778+j*36,254)],['context','personal','supply'],j===0?{id:'fish'+start,x:pos(idx),y:628}:null));fish+=cost;returned+=cost-1;}
 frames.push(step('모든 접시가 차 있거나 다음 접시 비용을 내지 못하면 이 행동은 불가능합니다. 채워진 접시의 생선은 이후 원로 행동에 사용됩니다.',[],['context']));
 return S('연회에 생선 제공하기',`행동 · ${n}인 시작 접시 기준`,'4, 10, 13–14',[...base(),...ownFish(total),...many(initial,i=>xf('filled'+i,pos(i),628)),addCoin('gain0',48,82),addCoin('gain1',85,82)],frames,D('공용 연회판 · 접시의 생선은 1마리씩',[[474,688,'빈 접시를 낮은 비용부터 채우기'],[474,724,'채운 접시 하나당 금 1개']],many(7,i=>[pos(i),628,String(costs[i])])));
}
function makeElderUse(n){
 // #7 Builder is available in every 2–5 player game. Illustrate common use,
 // not the higher-count-only #12 Pisciculturist from the old example.
 const initial=Math.max(2,n-1),costs=[2,2,3,3,4,4,5],pos=i=>650+i*70;
 return S('원로를 데려오고 사용하기',`행동 · ${n}인 · 연회와 원로의 연결`,'13–14, 18',[
  ...base(),card('elder','elder',490,654,'7번 원로',['숲 1 제거 · 목재 1'],{width:82}),...many(initial,i=>xf('p'+i,pos(i),628)),wood(0,48,82),wood(1,85,82)
 ],[
  step(`원로는 개인 의회의 새로운 행동칸입니다. 최대 5명까지 고용할 수 있으며 맨 위 공개 카드만 가져옵니다. ${n===2?'2인에서는 연회에 생선이 추가로 제공되어 두 접시가 채워진 상황을 예로 듭니다.':'이 예시는 연회판에 시작 생선이 남아 있는 상황입니다.'}`,[],['context','council']),
  actionIntro('원로 영입 칸에 일꾼을 놓고 공개 원로를 한 명 선택합니다. 모든 인원에서 사용하는 7번 원로를 예로 듭니다.','elder'),
  step('원로 카드를 개인 의회에 놓습니다. 바로 사용할 수 있지만 의무는 아닙니다. 아래 숨겨진 카드가 드러나면 공개하여 공급을 유지합니다.',[move('elder',294,76,{width:68})],['context','council'],{id:'elder',x:294,y:76}),
  step('즉시 사용한다면 추가 일꾼은 필요 없습니다. 연회에서 채워진 가장 큰 접시의 생선 한 마리를 원로 위에 올립니다.',[move('p'+(initial-1),312,52)],['context','council']),
  step('카드에 적힌 조건과 효과를 처리합니다. 이 예시는 숲 한 개를 제거하고 목재 한 개를 얻은 뒤 선택적으로 건물을 지을 수 있는 원로입니다. 여기서는 건설을 생략합니다.',[move('forest3',125,72),move('wood0',778,211)],['harbor','personal']),
  step('같은 라운드에도 원로 위에 일꾼 한 명을 직접 놓아 다시 사용할 수 있습니다. 다시 가장 큰 남은 접시에서 생선을 가져옵니다.',[ws(1,294,95),move('p'+(initial-2),294,52)],['context','council'],{id:'worker1',x:294,y:95}),
  step('원로 효과를 다시 실행합니다. 연회가 비어 있으면 원로 행동을 할 수 없고, 한 라운드에 원로 한 장에는 일꾼 하나만 놓을 수 있습니다.',[move('forest2',125,94),move('wood1',814,211)],['harbor','personal','council'])
 ],D('원로 공급처와 연회 · 대표 예시',[[474,715,'원로 카드 상단에 생선 3칸'],[620,679,'가장 큰 채워진 접시부터 사용']],many(initial,i=>[pos(i),628,String(costs[i])])));
}
function makeOccupancy(n){
 const cap=NUS_CAPS(n),s=[...base(),...many(cap.issue,i=>worker('other'+(i+1),144+i*35,167,NUS_COLORS[1+i])),coin(0,48,82),coin(1,85,82)];
 const frames=[step(n===2?'2인용 행동판에서는 각 행동칸에 일꾼 한 명만 놓습니다. 건물 건설은 별도 칸 두 개로 나뉩니다.':`3+ 행동판은 주식 발행·벌목·선박·원로 영입은 2명, 건물 건설은 3명까지 가능합니다. 칸이 가득 차면 더 놓지 못합니다.`,[],['actions','extraActions']),step(`${n}인 예시: 주식 발행 칸에 이미 ${cap.issue}명이 있습니다. ${n<4?'모방 타일이 없으므로 이 라운드에는 이 행동을 더 할 수 없습니다.':n===4?'4인 공용 모방 칸이 비어 있다면 막힌 행동을 하나 따라 할 수 있습니다.':'5인 모방 타일의 세 칸은 각각 행동판 왼쪽·가운데·오른쪽 열에 대응합니다. 주식 발행은 가운데 열입니다.'}`,[],['actions','extraActions'])];
 if(n<4){frames.push(step('막힌 칸 대신 비어 있는 금 1개 행동을 선택합니다.',[ws(0,144,278),move('coin0',778,254)],['actions','personal'],{id:'worker0',x:144,y:278}));}
 else{frames.push(actionIntro(`${n===4?'공용':'가운데 열'} 모방 칸에 내 일꾼을 놓고 막힌 주식 발행 행동을 선택합니다.`,'copy'),step('미발행 주식 하나를 뒤집어 시장에 놓고 금 두 개를 받습니다. 원래 행동의 조건과 비용도 지켜야 합니다.',[move('share2',97,340,{issued:true}),move('coin0',778,254),move('coin1',814,254)],['market','personal']),step('아직 빈 자리가 남은 행동과 원로 카드 위 행동은 모방할 수 없습니다. 자신이 막아 놓은 행동도 모방할 수 있습니다.',[],['extraActions']));}
 frames.push(step('효과가 전혀 없는 행동을 선택할 수 없습니다. 패스도 가능하지만 그 차례는 소모됩니다. 한 라운드에 각자 최대 세 차례입니다.',[],['actions','extraActions']));
 return S('행동칸이 차 있으면 어떻게 하나요?',`인원수 차이 · ${n}인`,'8, 14',s,frames,D(`${n}인 행동칸 · ${n<4?'모방 없음':n===4?'공용 모방 1칸':'열별 모방 3칸'}`,[[474,615,`발행·벌목·선박·원로 ${cap.issue}명씩`],[474,657,n===2?'건설 1명씩 · 별도 칸 2개':'건설 한 칸 최대 3명'],[474,699,n===5?'주식 발행 → 가운데 모방 칸':n===4?'막힌 행동 → 공용 모방 칸':'다른 빈 행동 선택']]));
}
function makeRoundChanges(n){
 const count=NUS_SETUP_COUNTS[n],c=count.c,ac=count.addA,bc=count.addB;
 const ax=i=>475+i*34,bx=i=>660+i*35,cx=i=>792+i*43;
 const st=[...base().map(p=>p.type==='worker'?{...p,x:144,y:167+Number(p.id.slice(-1))*37}:p),P('firstShip','turnShip',481,623),...many(ac,i=>card('newA'+i,'miniCard',ax(i),719,'A',[],{hidden:true})),...many(bc,i=>card('newB'+i,'miniCard',bx(i),719,'B',[],{hidden:true})),...many(c,i=>card('newC'+i,'miniCard',cx(i),719,'C',[],{hidden:true,faceDown:true}))];
 return S('라운드 종료와 새 건물 공개',`귀환 · ${n}인 카드 공개 일정`,'9',st,[
 step(`모든 ${n}명이 각자 세 차례를 마치면 귀환 단계입니다. 모든 일꾼을 회수합니다.`,[],['workers','actions','council']),
 step('이번 라운드에 사용한 일꾼을 되돌려 놓습니다. 화면에서는 내 일꾼 세 명을 보여 줍니다.',many(3,i=>ws(i,52+i*43,509)),['workers','actions','council']),
 step('선 플레이어 배를 다음 라운드 번호로 옮깁니다. 배는 반시계 방향으로 이동하여 현재 선 플레이어의 오른쪽 사람이 다음 선 플레이어가 됩니다.',[move('firstShip',557,623)],['context','rounds'],{id:'firstShip',x:557,y:623}),
 step(n===2?'3라운드 시작: 2인 게임은 A 카드를 추가하지 않습니다.':`3라운드 시작: A 건물 최대 ${ac}장을 추가합니다. 빈 칸보다 많이 놓지 않습니다. 화면은 빈 칸이 충분한 예시입니다.`,[move('firstShip',633,623),...many(ac,i=>move('newA'+i,ax(i),697,{hidden:false}))],['context']),
 step(`4라운드 시작: 각자 C 건물 ${c}장씩, 총 ${n*c}장을 비공개로 나눕니다. 화면은 내 손패 ${c}장만 보여 줍니다. 자기 손패를 지을 수 있습니다.`,[move('firstShip',709,623),...many(c,i=>move('newC'+i,cx(i),697,{hidden:false,faceDown:true}))],['context']),
 step(n===2?'5라운드 시작: 2인 게임은 B 카드도 추가하지 않습니다.':`5라운드 시작: B 건물 최대 ${bc}장을 빈 칸에 추가합니다.`,[move('firstShip',785,623),...many(bc,i=>move('newB'+i,bx(i),697,{hidden:false}))],['context']),
 step('6라운드 시작: 각자 손에 남은 모든 C 건물을 공급판 옆에 공개합니다. 누구든 공개된 C를 지을 수 있습니다. 예시에서는 내 손패가 모두 남았습니다.',[move('firstShip',861,623),...many(c,i=>move('newC'+i,cx(i),733,{faceDown:false}))],['context']),
 step('7라운드까지 마치면 게임을 종료합니다.',[move('firstShip',937,623)],['rounds','context'])
 ],D(`라운드 진행표 · ${n}인`,[[474,677,`A ${ac||'없음'}`],[650,677,`B ${bc||'없음'}`],[790,677,`내 C ${c}장`]],many(7,i=>[481+i*76,623,String(i+1)])));
}
const NUS_DEFAULT_PLAYERS=5;
function makeNusOverview(n){
 const top=Math.ceil(n/2),bottom=n-top,seat=i=>{const upper=i<top,j=upper?i:i-top,k=upper?top:bottom;return [Math.round(500+(j-(k-1)/2)*300),upper?95:473]};const pos=many(n,seat),num=NUS_SETUP_COUNTS[n].elders;
 const kits=pos.map(([x,y],i)=>P('ovKit'+i,'playerKit',x,y,{color:NUS_COLORS[i],name:NUS_COLOR_NAMES[i],lines:['완료']}));
 const order=pos.map(([x,y],i)=>P('ovOrder'+i,'turnTile',x+120,y+20,{color:NUS_COLORS[i],name:String(n),lines:turnRounds(n,i).map(String)}));
 const cards=[...many(6,i=>card('ovElder'+i,'setupElder',441+(i%3)*72,286+Math.floor(i/3)*44,String(i<num-6?i+7:i+1),[],{width:50,height:36})),...many(9,i=>card('ovA'+i,'setupBuilding',678+(i%3)*49,242+Math.floor(i/3)*42,'A',[],{width:43,height:34})),...many(6,i=>card('ovB'+i,'setupBuilding',844+(i%2)*55,242+Math.floor(i/2)*42,'B',[],{width:46,height:34})),...many(3,i=>card('ovShip'+i,'ship',441+i*72,233,['소형','중형','대형'][i],[`${n+1}개`],{width:65,height:43})),...many(7,i=>P('ovPlate'+i,'overviewPlate',69,209+i*21,{name:String(i+1),lines:[i<n-1?'filled':'empty']}))];
 const names=['금 1개','예비고','연회','건물','주식 발행','주식 매수','벌목','솎아베기','재조림','선박','원로'];
 const slots=[...many(4,i=>setupSlot(129,211+i*35,73,21,names[i])),...many(5,i=>setupSlot(207,211+i*28,76,16,names[4+i])),...many(2,i=>setupSlot(288,218+i*63,83,41,names[9+i]))];
 const state=[...kits,...order,P('ovBoat','turnShip',pos[0][0]+120,pos[0][1]-12),...cards,P('ovSupplyFish','fish',134,366),P('ovSupplyWood','wood',198,366),P('ovSupplyCoin','coin',257,366),P('ovSupplyForest','overviewForest',343,366)];
 const panels=[setupPanel('setupOverviewBanquet',18,168,104,190,'연회판','#eadbc1'),setupPanel('setupOverviewAction',125,168,255,190,`행동판 · ${n===2?'1–2인':'3+'} 면`,'#b7c79e'),setupPanel('setupOverviewShips',383,168,252,190,'선박·원로판','#c0d8d8'),setupPanel('setupOverviewA',638,168,165,190,'A 건물 9장','#b4d5de'),setupPanel('setupOverviewB',806,168,176,190,'B 건물 6장','#b4d5de'),setupPanel('setupOverviewSupply',18,360,964,38,'공용 공급처','#f0e5cd')];
 return setupChapter('overview','전체 테이블 배치부터 보기',`테이블 세팅 · ${n}인`,state,[step(`${n}명이 어업 회사를 운영해 건물·선박·주식 등으로 승점을 얻는 게임입니다. 먼저 공용판을 중앙에 펼치세요. 왼쪽부터 연회판, 행동판, 선박·원로판, A·B 건물판 순서입니다. ${n===5?'5인 모방 타일 3칸':n===4?'4인 모방 타일 1칸':'모방 타일 없음'}을 확인합니다.`,[],panels.slice(0,5).map(p=>p.id)),step(`각자 항구판, 원로 의회, 개인 공급처, 일꾼 3개와 주식 5개, 숲 4개를 준비합니다. 중앙에는 연회 물고기 ${n-1}마리, 선박 종류별 ${n+1}개, 원로 ${num}장(6더미), 공개 A 9장·B 6장을 둡니다. 좌석 배치는 예시입니다. 다음 설명에서 실제 준비 순서를 자세히 따라갑니다.`,[],['setupOverviewSupply'])],panels,slots,[setupText(410,386,'C 건물과 남은 A/B는 준비 규칙에 따라 따로 보관',12)]);
}
function makeNusfjordChapters(n){
 const work=structuredClone(old[3]);work.sub=`행동 단계 · ${n}인 예시`;work.frames[0].text=`${n}인 게임입니다. 선 플레이어부터 시계 방향으로 일꾼 하나씩 보냅니다. 각자 세 차례, 총 ${3*n}차례입니다. 자기 차례에 3명을 한꺼번에 쓰지 않습니다.`;
 const intro=structuredClone(old[0]);intro.frames[2].text='마지막에 건물·선박·보유한 발행 주식과 금을 점수로 더합니다. 비어 있는 건설칸과 미발행 주식은 감점입니다. 준비가 끝났다면 첫 어획부터 진행하겠습니다.';
 const personal=structuredClone(old[1]);personal.sub=`게임 준비 · ${n}인 중 한 명의 개인판`;
 const middle=structuredClone(extraChapters[8]);middle.scene.labels[0][2]=n===2?'파란 플레이어 공급처':'노란 플레이어 공급처';if(n===2)middle.frames[0].text+=' 2인 예시에서는 외부 주식의 상대도 파란 회사입니다.';
 const common=makeCommonSetup(n);common.frames[0].text+=` 주식 발행·벌목·선박·원로 영입은 ${NUS_CAPS(n).issue}명씩, ${n===2?'건물 건설은 별도 1인 칸 두 개입니다.':'건물 건설은 최대 3명입니다.'}`;
 return [makeNusOverview(n),common,makeElderSetup(n),makeBuildingSetup(n),makeTableSetup(n),personal,intro,old[2],work,extraChapters[0],old[4],extraChapters[1],extraChapters[2],makeBanquet(n),makeElderUse(n),extraChapters[5],extraChapters[6],old[5],extraChapters[7],middle,makeOccupancy(n),makeRoundChanges(n),extraChapters[11]].map(c=>({...c,players:n}));
}
chapters.push(...makeNusfjordChapters(NUS_DEFAULT_PLAYERS));

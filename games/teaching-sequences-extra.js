/* Additional authored examples. Extend the curated set, preserving other rule text and settings. */
(function(root){'use strict';
const api=root.RMTeachingSequences,oldExpanded=api.expanded,oldRoll=api.roll;
const Z=(name,slots,size='token')=>({name,slots,size}),F=(text,slots,move=[],pulse=[])=>({text,slots,move,pulse});
function install(lessons,needle,layout,build,roll=false){const l=lessons.find(x=>x.title.includes(needle));if(!l)return;const key=roll?'steps':'frames',source=l[key],texts=source.map(f=>f.text);l.stable=true;l[key]=build(texts).map(f=>({...f,stable:{...f,layout},...(roll?{}:{zones:layout.map((z,i)=>({name:z.name,pieces:f.slots[i].filter(Boolean)}))})}));}
api.expanded=function(id,lessons){oldExpanded(id,lessons);const E=root.Expanded,{P,card,back,tile,track,coin,bill,cube,die,star,robot,many}=E;
 const add=(needle,layout,build)=>install(lessons,needle,layout,build);
 if(id==='die-macher'){
  const rs=many(4,i=>cube('유세','blue','r'+i)),op=[...many(3,i=>tile('일치','+1','green','y'+i)),tile('반대','-1','red','no')],sum=n=>track('여론 합계',n,'green','sum'),votes=n=>track('누적 득표',n,'blue','votes'),formula=x=>track('계산',x,'gold','calc');
  add('유세를 표로 전환',[Z('현재 지역 유세',['1','2','3','4']),Z('추세',['현재 추세']),Z('여론 비교',['일치','일치','일치','반대']),Z('내 공급',['회수 1','2','3','4']),Z('득표 계산',['여론 합계','새 표 계산']),Z('득표 트랙',['누적'])],t=>[
   F(t[0],[rs,[track('추세','+2','blue','trend')],op,[null,null,null,null],[sum('?'),formula('?')],[votes(6)]]),
   F('일치 세 개와 반대 한 개를 합산하면 여론 합계는 3−1=2입니다.',[rs,[track('추세','+2','blue','trend')],op,[null,null,null,null],[sum(2),formula('?')],[votes(6)]],[],['sum']),
   F('유세 4개에 추세 +2를 더한 6에 여론 합계 2를 곱합니다. 새 득표는 12입니다.',[rs,[track('추세','+2','blue','trend')],op,[null,null,null,null],[sum(2),formula('6 × 2 = 12')],[votes(6)]],[],['calc']),
   F('기존 6표에 새 12표를 더해 누적 18표를 기록합니다.',[rs,[track('추세','+2','blue','trend')],op,[null,null,null,null],[sum(2),formula('6 × 2 = 12')],[votes(18)]],[],['votes']),
   F(t[1],[[null,null,null,null],[track('추세','+2','blue','trend')],op,rs,[sum(2),formula('6 × 2 = 12')],[votes(18)]],rs.map(x=>x.id))
  ]);
 }
 if(id==='raging-robots'){
  const u=tile('속도 토큰','잠김','blue','u'),en=n=>track('에너지',n,'gold','en'),pr=n=>track('프로그램',n,'purple','pr'),r=robot('속도형 로봇','기본 능력','orange','r'),inspire=tile('영감','보상 선택','gold','inspire');
  add('업그레이드: 잠금 해제',[Z('개인판 자원',['에너지','프로그램']),Z('개인판 잠금칸',['속도 토큰']),Z('보유칸',['해제 토큰']),Z('로봇 카드',['대응 기호','장착 자리'],'card'),Z('개인판 혜택',['열린 보상'])],t=>[
   F(t[0],[[en(5),pr(3)],[u],[null],[r,null],[null]]),
   F('이번 예시에서는 에너지 3과 프로그램 3을 지불합니다. 에너지는 2, 프로그램은 0이 됩니다.',[[en(2),pr(0)],[u],[null],[r,null],[null]],[],['en','pr']),
   F('잠긴 속도 토큰을 개인판에서 보유칸으로 옮겨 해제합니다.',[[en(2),pr(0)],[null],[{...u,value:'해제'}],[r,null],[null]],['u']),
   F(t[1],[[en(2),pr(0)],[null],[{...u,value:'해제'}],[r,null],[inspire]],[],['inspire']),
   F(t[2],[[en(2),pr(0)],[null],[null],[{...r,value:'강화 능력 사용 가능'},{...u,value:'장착'}],[inspire]],['u'],['r'])
  ]);
 }
 if(id==='euphoria'){
  const ds=[die(3,'red','a'),die(2,'green','b'),die(5,'purple','c'),die(4,'blue','d')],cost=cube('지정 자원','gold','cost'),stars=['red','green','purple','blue'].map((c,i)=>star(c,'s'+i)),market=back('시장','gray','market'),face=card('시장','공개 페널티','gray','market'),rolled=[die(2,'red','a'),die(3,'green','b'),die(2,'purple','c'),die(5,'blue','d')];
  add('시장 건설: 함께 비용',[Z('시장 건설칸',['1','2','3','마지막 칸']),Z('내 사용 가능 일꾼',['파란 4']),Z('내 자원',['지정 비용']),Z('공용 공급처',['지불한 자원']),Z('시장 타일',['건설 완료 시 공개'],'card'),Z('참여자의 권위 별',['빨강','초록','보라','파랑']),Z('시장 권위 별',['빨강','초록','보라','파랑']),Z('회수 일꾼',['빨강','초록','보라','파랑'])],t=>[
   F(t[0],[[...ds.slice(0,3),null],[ds[3]],[cost],[null],[market],stars,[null,null,null,null],[null,null,null,null]]),
   F('내 일꾼을 마지막 빈 건설칸에 놓고 지정된 자원을 지불합니다.',[ds,[null],[null],[cost],[market],stars,[null,null,null,null],[null,null,null,null]],['d','cost']),
   F('네 건설칸이 모두 채워졌으므로 시장 타일을 공개합니다. 비참여자에게 적용될 페널티가 드러납니다.',[ds,[null],[null],[cost],[face],stars,[null,null,null,null],[null,null,null,null]],[],['market']),
   F('건설에 참여한 네 사람이 각각 자기 권위 별 하나를 시장에 놓습니다.',[ds,[null],[null],[cost],[face],[null,null,null,null],stars,[null,null,null,null]],stars.map(x=>x.id)),
   F('건설에 참여했던 네 일꾼을 각각 주인의 사용 가능 구역으로 돌려보냅니다.',[[null,null,null,null],[null],[null],[cost],[face],[null,null,null,null],stars,ds],ds.map(x=>x.id)),
   F(t[1],[[null,null,null,null],[null],[null],[cost],[face],[null,null,null,null],stars,rolled],[],rolled.map(x=>x.id))
  ]);
 }
 if(id==='hadara'){
  const c5=coin(5,'c5'),c1=coin(1,'c1'),cols=[tile('군사 3','획득 가능','red','col3'),tile('군사 9','획득 가능','red','col9'),tile('군사 15','불가','gray','col15')],mil=track('군사',9,'red','mil'),inc=track('수입',6,'gold','inc');
  add('수입 받기와 식민지 선택',[Z('개인판',['수입','군사']),Z('은행',['5','1']),Z('내 동전',['받은 5','받은 1']),Z('가능 식민지',['군사 3','군사 9','군사 15']),Z('획득한 식민지',['한 장만 선택']),Z('획득 후 선택',['약탈 또는 통합'])],t=>[
   F(t[0],[[inc,mil],[c5,c1],[null,null],cols,[null],[null]]),
   F('수입 트랙이 6이므로 은행에서 5+1동전을 받아 개인 공급처에 넣습니다.',[[inc,mil],[null,null],[c5,c1],cols,[null],[null]],['c5','c1']),
   F('군사력이 9이므로 아직 획득하지 않은 군사 3 또는 군사 9 식민지 중 하나를 선택할 수 있습니다. 이 예에서는 9를 택합니다.',[[inc,mil],[null,null],[c5,c1],[cols[0],null,cols[2]],[cols[1]],[null]],['col9']),
   F(t[1],[[inc,mil],[null,null],[c5,c1],[cols[0],null,cols[2]],[cols[1]],[tile('약탈 / 통합','실제 식민지 인쇄 보상·비용 확인','gray','decision')]],[],['decision'])
  ]);
 }
 return lessons;
};
api.roll=function(lessons,ctx){oldRoll(lessons,ctx);const {d,dev,world,mine}=ctx;const D=x=>({id:x.id,kind:'die',x}),T=x=>({id:x.id,kind:'tile',x}),V=(id,text)=>({id,kind:'text',text});const add=(needle,layout,build)=>install(lessons,needle,layout,build,true);
 const settler=D(d('B','white',2)),reward=D(d('reward','brown',1)),mw=T(mine),w=T(world);
 add('III 정착: 새 행성과 주사위',[Z('정착 행동',['대기 일꾼']),Z('행성 건설 구역',['건설 타일','일꾼 자리'],'card'),Z('완성 제국',['기존 행성','새 행성'],'card'),Z('시민 구역',['돌아온 노동자','새 보상 주사위']),Z('공용 주사위 공급',['보상']),Z('정착 진행',['비용 1'])],t=>[
  F(t[0],[[settler],[mw,null],[w,null],[null,null],[reward],[V('progress','0 / 1')]]),
  F('정착 노동자 한 개를 비용 1인 광산 타일에 놓습니다. 건설 조건을 채웠습니다.',[[null],[mw,settler],[w,null],[null,null],[reward],[V('progress','1 / 1')]],['B'],['progress']),
  F('완성된 광산 타일을 내 제국에 놓습니다.',[[null],[null,settler],[w,mw],[null,null],[reward],[V('progress','완성')]], [mine.id],['progress']),
  F('정착을 끝낸 일꾼은 시민 구역으로 보냅니다.',[[null],[null,null],[w,mw],[settler,null],[reward],[V('progress','완성')]],['B']),
  F(t[1],[[null],[null,null],[w,mw],[settler,reward],[null],[V('progress','완성')]],['reward'])
 ]);
 const a=D(d('A','white',0)),b=D(d('B','white',1)),e=D(d('E','red',1)),dd=D(d('D','cyan',4)),f=D(d('F','yellow','*')),dt=T(dev),cash=x=>V('cash','$'+x);
 add('제국 관리: 모집과 회수',[Z('시민 구역',['A','B','E','D']),Z('다음 굴림 컵',['1','2','3','4']),Z('은하 크레딧',['잔액']),Z('건설 중 타일',['개발 타일','공사 주사위'],'card'),Z('라운드 확인',['다음 굴림'])],t=>[
  F(t[0],[[a,b,e,dd],[null,null,null,null],[cash(3)],[dt,f],[V('phase','관리 중')]]),
  F('$1을 지불해 A를 모집합니다.',[[null,b,e,dd],[a,null,null,null],[cash(2)],[dt,f],[V('phase','관리 중')]],['A'],['cash']),
  F('$1을 지불해 B를 모집합니다.',[[null,null,e,dd],[a,b,null,null],[cash(1)],[dt,f],[V('phase','관리 중')]],['B'],['cash']),
  F('마지막 $1을 지불해 E를 모집합니다. 시민 D는 아직 컵에 들어갈 수 없습니다.',[[null,null,null,dd],[a,b,e,null],[cash(0)],[dt,f],[V('phase','관리 중')]],['E'],['cash']),
  F('모집이 끝나 잔액이 0이므로 $1로 복원합니다.',[[null,null,null,dd],[a,b,e,null],[cash(1)],[dt,f],[V('phase','모집 완료')]],[],['cash','phase']),
  F(t[1]+' 이 예에서는 공사 중인 F를 무료로 회수합니다.',[[null,null,null,dd],[a,b,e,f],[cash(1)],[dt,null],[V('phase','회수 완료')]],['F'],['phase']),
  F(t[2],[[null,null,null,dd],[a,b,e,f],[cash(1)],[dt,null],[V('phase','다음 굴림 준비')]],[],['phase'])
 ]);
 // Split the existing development example into physical tile completion and worker return.
 const l=lessons.find(x=>x.title.includes('II 개발: 공사 중인 주사위'));
 if(l?.stable&&l.steps.length===4){const old=l.steps[2],pre=l.steps[1].stable,post=old.stable,layout=post.layout;const stages=[F('비용 2를 채운 개발 타일을 완성 제국으로 옮깁니다.',[[null],[null,pre.slots[1][1],pre.slots[1][2]],post.slots[2],[null,null],[V('progress','완성')]], [dev.id],['progress']),F(old.text,post.slots,['B','E'])];l.steps.splice(2,1,...stages.map(x=>({...x,stable:{...x,layout}})));}
 return lessons;
};
})(window);

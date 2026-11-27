/* Shared scene playback: deterministic snapshots, visible tokens, optional drag-to-demonstrate. */
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const el=(tag,attrs={},parent=null)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));parent?.append(n);return n};
const label=(parent,x,y,t,size=14,fill='#18332e',attrs={})=>{let n=el('text',{x,y,fill,'font-size':size,'font-weight':650,...attrs},parent);n.textContent=t;return n};
const rect=(p,x,y,w,h,fill,stroke='#b5ad90',r=6,attrs={})=>el('rect',{x,y,width:w,height:h,rx:r,fill,stroke,...attrs},p);
const svg=$('table'),defs=el('defs',{},svg),bg=el('g',{},svg),pieces=el('g',{},svg);const highlights={};
// Original component-inspired textures, based on the 2024 Big Box component photo.
// No publisher images are embedded. Coordinate geometry and legal move states stay unchanged.
function texture(id,w,h,base,draw){const p=el('pattern',{id,width:w,height:h,patternUnits:'userSpaceOnUse'},defs);el('rect',{width:w,height:h,fill:base},p);draw(p);}
texture('nusForest',73,56,'#255b35',p=>{for(let i=0;i<46;i++){let x=(i*37+7)%73,y=(i*19+3)%56,r=3+(i*7%7);el('circle',{cx:x,cy:y,r,fill:['#173e28','#33633a','#477b40','#71954e','#96ad65'][i%5],stroke:'#1d442a','stroke-width':.5},p);el('circle',{cx:x-1,cy:y-1,r:r*.37,fill:'#aec181',opacity:.4},p)}});
texture('nusGrass',37,29,'#9ba955',p=>{for(let i=0;i<23;i++)el('ellipse',{cx:(i*13)%37,cy:(i*11)%29,rx:1+i%4,ry:1,fill:['#718c42','#b4bd72','#c4bd76','#8da052'][i%4],opacity:.6},p)});
texture('nusWood',95,60,'#d5bb8c',p=>{for(let i=0;i<11;i++)el('path',{d:`M0 ${i*6} Q30 ${i*6+2} 52 ${i*6-1} T95 ${i*6}`,fill:'none',stroke:i%3===0?'#a88c64':'#e6d2a7','stroke-width':i%3===0?.9:.6,opacity:.6},p)});
texture('nusCloth',12,12,'#ede0cf',p=>{for(let i=0;i<2;i++){el('path',{d:`M${i*6} 0 v12 M0 ${i*6} h12`,stroke:'#b85650','stroke-width':2,opacity:.55},p)}});
const sea=el('linearGradient',{id:'nusSea',x1:0,y1:0,x2:0,y2:1},defs);el('stop',{offset:'0%','stop-color':'#54acd0'},sea);el('stop',{offset:'100%','stop-color':'#17628a'},sea);
function plate(g,cx,cy,r){el('circle',{cx,cy,r,fill:'#e9e7dc',stroke:'#555a55','stroke-width':2},g);el('circle',{cx,cy,r:r*.83,fill:'#f6f4e8',stroke:'#95938a','stroke-width':2},g);for(let i=0;i<16;i++){const a=i*Math.PI/8;el('circle',{cx:cx+Math.cos(a)*r*.92,cy:cy+Math.sin(a)*r*.92,r:1.3,fill:'#77776e'},g)}}

function area(id,x,y,w,h,name,fill){const g=el('g',{},bg);rect(g,x,y,w,h,fill,'#b9aa88',8);label(g,x+12,y+23,name,15);const hlt=rect(g,x+1,y+1,w-2,h-2,'none','#f7cf55',8,{'stroke-width':4,opacity:0,'pointer-events':'none'});hlt.dataset.rmLessonZone=name;highlights[id]=hlt;return g}
// Layout is a new schematic, not a scan or digital replica of the artwork.
const supply=area('supply',18,18,215,103,'공용 공급처','#f4e9cf');
const actions=area('actions',18,126,215,166,'행동판 · 주요 행동','#e4ddc6');
const actionContents=el('g',{},actions);
function renderMainActions(n){actionContents.replaceChildren();const cap=NUS_CAPS(n);[['주식 발행',167,cap.issue],['벌목',204,cap.deforest],['솎아베기',241,1],['금 1개',278,1]].forEach(([t,y,count])=>{rect(actionContents,29,y-17,194,29,'#fff5dc','#b9a77c',4);label(actionContents,37,y+2,t,12);for(let i=0;i<count;i++)el('circle',{cx:144+i*35,cy:y,r:12,fill:'#e8d8b6',stroke:'#907e53','stroke-width':1.5,'data-action-slot':t},actionContents)});}

area('market',18,297,215,65,'주식 시장','#d1e6e6');area('catch',18,367,215,91,'새로 잡은 물고기','#e1eef3');area('workers',18,463,215,84,'내 일꾼','#f2e5cf');
const council=area('council',244,18,457,98,'원로 의회 · 최대 5명','url(#nusSea)');for(let i=0;i<5;i++)rect(council,255+i*88,50,78,54,'#eff4ee','#9daab0',4,{'stroke-dasharray':'5 4'});
const harbor=area('harbor',244,126,457,308,'내 항구판','url(#nusGrass)');
for(let r=0;r<3;r++)for(let c=0;c<4;c++){let x=252+c*111,y=156+r*83;rect(harbor,x,y,104,77,c===0&&r===0?'#c2c88e':'#a5b16b','#e5e8af',4,{'stroke-width':2});if(!(c===0&&r===0))label(harbor,x+92,y+67,'−1',10,'#607550',{'text-anchor':'end'});}
const reserve=el('g',{},harbor);label(reserve,263,174,'예비고',11);label(reserve,263,226,'어획 배분 시 8마리',9);highlights.reserve=rect(reserve,252,156,104,77,'none','#f7cf55',4,{'stroke-width':4,opacity:0,'pointer-events':'none'});
const fleet=area('fleet',244,409,457,138,'어획 트랙 · 첫 노출 숫자가 어획량','url(#nusSea)');
// Distances and labels are a teaching schematic, not a physical-scale reproduction.
rect(fleet,257,452,431,77,'url(#nusSea)','#87c5c4',5);
label(fleet,279,474,'시작 배',11,'#fff',{'text-anchor':'middle'});el('path',{d:'M269 501 L289 501 L295 494 L265 494 Z M280 473 L280 493 L292 493 Z',fill:'#ead2a1',stroke:'#4d5a53'},fleet);
// First printed 3 space is double-width. A schooner covers it and two more spaces.
const track=[['3',60],['5',30],['5',30],['6',30],['6',30],['7',30],['8',30],['8',30],['9',30],['10',30],['10',30],['11',30],['11',30],['12',30],['12',30]];
let tx=299; const scale=389/track.reduce((sum,[,w])=>sum+w,0);
track.forEach(([n,w])=>{let ww=w*scale;el('line',{x1:tx,y1:452,x2:tx,y2:529,stroke:'#a5cdd0',opacity:.5},fleet);label(fleet,tx+ww/2,519,n,12,'#fff',{'text-anchor':'middle'});tx+=ww});
const personal=area('personal',711,18,271,265,'개인 공급처 · 목재 최대 12','#eee3ca');el('circle',{cx:845,cy:158,r:111,fill:'url(#nusWood)',stroke:'#ab5d48','stroke-width':7},personal);label(personal,845,103,'사용할 수 있는 자원',14,'#70442e',{'text-anchor':'middle'});label(personal,740,143,'물고기',12);label(personal,740,192,'목재',12);label(personal,740,236,'금',12);
area('shares',711,292,271,195,'주식 · 발행 / 미발행','#efe8d7');const rounds=area('rounds',711,494,271,53,'7라운드','#f4ead2');label(rounds,828,527,'어획 → 행동 → 귀환',11,'#385a50');
const detail=el('g',{},bg);let currentScene=null;
function addPanel(id,x,y,w,h,title,fill){const g=el('g',{},detail);rect(g,x,y,w,h,fill,'#b9aa88',8);label(g,x+12,y+22,title,15);highlights[id]=rect(g,x+1,y+1,w-2,h-2,'none','#f7cf55',8,{'stroke-width':4,opacity:0,'pointer-events':'none'});highlights[id].dataset.rmLessonZone=title;return g}
function renderDetail(c){if(currentScene===c)return;currentScene=c;renderMainActions(c.players);detail.replaceChildren();for(const key of Object.keys(highlights))if(key.startsWith('setup')||key==='extraActions'||key==='context')delete highlights[key];
 for(const g of bg.children)if(g!==detail)g.style.display=c.setup?'none':'';
 svg.setAttribute('viewBox',c.scene?'0 0 1000 770':'0 0 1000 565');svg.classList.toggle('extended',!!c.scene);
 if(c.setup){
  for(const p of c.setup.panels){const fill=p.id==='setupBanquet'?'url(#nusCloth)':p.id==='setupAction'?'url(#nusGrass)':p.id==='setupShips'?'url(#nusGrass)':p.fill;addPanel(p.id,p.x,p.y,p.w,p.h,p.title,fill);}
  for(const p of c.setup.slots){
   if(p.w===p.h&&(p.w===60||p.w===44)){const z=p.w/2;plate(detail,p.x+z,p.y+z,z);label(detail,p.x+z,p.y+p.h+12,p.text,12,'#675742',{'text-anchor':'middle'})}
   else {rect(detail,p.x,p.y,p.w,p.h,'#ffffff38','#7c968b',6,{'stroke-width':1.5,'stroke-dasharray':'6 4'});label(detail,p.x+p.w/2,p.y+p.h+15,p.text,12,'#314b36',{'text-anchor':'middle'})}
  }
  for(const p of c.setup.labels)label(detail,p.x,p.y,p.text,p.size,p.x>500&&p.y<400?'#fff5e6':'#385449');
  if(c.setup.actionGrid){
   const n=c.players,cap=NUS_CAPS(n),draw=(x,y,w,h,t,num,id)=>{rect(detail,x,y,w,h,id==='ship'||id==='elder'?'url(#nusSea)':id==='serve'?'url(#nusCloth)':'url(#nusGrass)','#537c5d',5,{'stroke-width':2});const cy=y+Math.min(h-10,32);if(id==='serve'){plate(detail,x+w*.55,cy,12)}else if(id==='ship'||id==='elder'){el('path',{d:`M${x+4} ${y+h-8} L${x+w*.35} ${y+h*.49} L${x+w*.52} ${y+h*.72} L${x+w*.84} ${y+h*.39} L${x+w-4} ${y+h-8}Z`,fill:'#91aa86',opacity:.75},detail);if(id==='ship')el('path',{d:`M${x+18} ${cy+24} h${w-36} l-12 9 h${36-w+24} Z M${x+w*.5} ${cy-3} v25 l23 -4 Z`,fill:'#e5d5b0',stroke:'#795b40'},detail)}else if(['gold','issue','buy'].includes(id)){for(let j=0;j<(id==='issue'?2:1);j++){el('ellipse',{cx:x+w*.5+j*14,cy,rx:12,ry:7,fill:'#efd277',stroke:'#936a31'},detail)}}else if(id==='reserve'||id==='deforest'||id==='thin'||id==='reforest'){for(let j=0;j<3;j++)el('path',{d:`M${x+w*.5-18+j*17} ${cy-9} l-9 19 h18 Z`,fill:'#345d37',stroke:'#24452d'},detail)}else if(id==='building'){el('path',{d:`M${x+w*.25} ${y+h*.8} v-19 l${w*.25} -18 ${w*.25} 18 v19 Z`,fill:'#b29a67',stroke:'#705a39'},detail)}rect(detail,x+3,y+2,w-6,19,'#fff2d4','#bd9e77',4);el('circle',{cx:x+12,cy:y+12,r:9,fill:'#fff9e8',stroke:'#9c885e','data-setup-capacity':id},detail);label(detail,x+12,y+16,String(num),11,'#655638',{'text-anchor':'middle'});label(detail,x+w/2+6,y+15,t,11,'#3d3627',{'text-anchor':'middle'});};
   draw(155,56,103,47,'금 1개',1,'gold');draw(155,108,103,60,'예비고 이동',1,'reserve');draw(155,173,103,60,'연회 제공',1,'serve');
   if(n===2){draw(155,238,103,54,'건물 건설',1,'building');draw(155,297,103,54,'건물 건설',1,'building');}else draw(155,238,103,113,'건물 건설',3,'building');
   draw(264,56,103,86,'주식 발행',cap.issue,'issue');draw(264,147,103,48,'주식 매수',1,'buy');draw(264,200,103,47,'벌목',cap.deforest,'deforest');draw(264,252,103,47,'솎아베기',1,'thin');draw(264,304,103,47,'재조림',1,'reforest');
   draw(373,56,112,95,'선박 건조',cap.ship,'ship');draw(373,156,112,195,'원로 영입',cap.elder,'elder');
   if(cap.copy===1)draw(155,364,330,42,'공용 모방',1,'copy');else if(cap.copy===3){['좌측 모방','중앙 모방','우측 모방'].forEach((v,i)=>draw(155+i*109,364,103,42,v,1,'copy'));}else label(detail,164,385,'모방 타일 없음',13,'#61715e');
  }
  return;
 }
 if(!c.scene)return;
 const n=c.players,cap=NUS_CAPS(n);
 const a=addPanel('extraActions',18,556,420,196,`행동판 · 나머지 행동 (${n===2?'1–2인':'3+인'} 면)`,'#e4ddc6');
 const slot=(x,y,id)=>el('circle',{cx:x,cy:y,r:10,fill:'#e8d8b6',stroke:'#907e53','stroke-width':1.5,'data-action-slot':id},a);
 [['reserve','예비고 이동',1],['serve','연회 제공',1],['building','건물 건설',cap.building],['elder','원로 영입',cap.elder],['buy','주식 전부 매수',1],['reforest','재조림',1],['ship','선박 건조',cap.ship]].forEach(([id,name,count])=>{const [x,y]=A[id];let lx=x-135;rect(a,lx,y-16,194,30,'#fff5dc','#b9a77c',4);label(a,lx+7,y+4,name,12);if(id==='building'&&n===2){rect(a,x-12,y-14,25,27,'#f1e2be','#b9a77c',3);rect(a,x+18,y-14,25,27,'#f1e2be','#b9a77c',3);slot(x,y,'building');slot(x+30,y,'building');}else for(let i=0;i<count;i++)slot(x+i*19,y,id)});
 const [copyX,copyY]=A.copy;
 if(cap.copy){rect(a,229,copyY-16,194,30,'#fff5dc','#b9a77c',4);label(a,236,copyY+4,cap.copy===1?'공용 모방':'모방',12);if(cap.copy===1)slot(copyX,copyY,'copy');else [313,364,407].forEach((x,i)=>{slot(x,copyY,'copy');label(a,x,copyY+4,['좌','중','우'][i],10,'#675742',{'text-anchor':'middle','pointer-events':'none'})});}
 else label(a,236,copyY+4,'모방 타일 없음',12,'#758174');
 const ctx=addPanel('context',449,556,533,196,c.scene.title,'#e7e9d9');
 for(const [x,y,t] of c.scene.labels)label(ctx,x,y,t,13,'#385449');
 for(const [x,y,t] of c.scene.slots){plate(ctx,x,y,22);label(ctx,x,y+31,t,12,'#5f5c45',{'text-anchor':'middle'})}
}
let chapter=0,frame=0,nodes=new Map(),auto=null,drag=null,voice=false,dragOrigin=null;
// Use only crops of the verified 2024 Big Box official gallery (not a different edition).
// These are photo textures, not clean original production assets; the underlying teaching
// shape and all game state stay unchanged. Never bake example resources into a board.
const nusTextureSources={forest:{url:'https://www.lookout-spiele.de/upload/en_nusfjordbigbox.html_GalleryImage.png',full:[1000,684],crop:[48,373,255,61]},coin:{url:'https://www.lookout-spiele.de/upload/en_nusfjordbigbox.html_GalleryImage.jpeg',full:[563,1000],crop:[66,82,111,113]}};
const photoReady=new Set(),textureButton=$('originalTexture');let useOriginalTexture=false,textureGeneration=0;
function refreshTexture(){for(const g of nodes.values())g.dataset.kind='';render(true)}
function cropTexture(key,g){if(!useOriginalTexture||!photoReady.has(key))return;const p=nusTextureSources[key],coin=key==='coin';const box=coin?[-13,-13,26,26]:[-97,-20,194,54];let holder=el('g',{'pointer-events':'none','data-original-texture':key},g);if(coin){if(!$('nusPhotoCoinClip')){let clip=el('clipPath',{id:'nusPhotoCoinClip'},defs);el('circle',{cx:0,cy:0,r:13},clip)}holder.setAttribute('clip-path','url(#nusPhotoCoinClip)')}let child=el('svg',{x:box[0],y:box[1],width:box[2],height:box[3],viewBox:p.crop.join(' '),preserveAspectRatio:'none',overflow:'hidden'},holder);let im=el('image',{href:p.url,width:p.full[0],height:p.full[1],preserveAspectRatio:'none'},child);im.addEventListener('error',()=>holder.remove(),{once:true});}
function toggleOriginalTexture(){useOriginalTexture=!useOriginalTexture;let gen=++textureGeneration;textureButton.setAttribute('aria-pressed',String(useOriginalTexture));textureButton.textContent=useOriginalTexture?'실물 질감 해제':'실물 질감 적용';if(!useOriginalTexture){$('textureStatus').textContent='설명용 그림을 사용합니다.';refreshTexture();return}let pending=Object.entries(nusTextureSources).length;photoReady.clear();$('textureStatus').textContent='빅박스 공식 사진을 불러오는 중…';const complete=(key,ok)=>{if(gen!==textureGeneration)return;if(ok)photoReady.add(key);pending--;refreshTexture();if(!pending)$('textureStatus').textContent=photoReady.size?'공식 사진 질감 '+photoReady.size+'/2종 적용 · 불러오지 못한 기물은 설명용 그림 유지. 출처: Lookout Spiele 2024 Big Box.':'원본 사진 접근 불가 · 기존 설명용 그림을 유지합니다.';};for(const [key,p] of Object.entries(nusTextureSources)){let img=new Image(),done=false;const finish=ok=>{if(done)return;done=true;complete(key,ok)};img.onload=()=>finish(Math.abs(img.naturalWidth/img.naturalHeight-p.full[0]/p.full[1])<.025);img.onerror=()=>finish(false);img.referrerPolicy='no-referrer';img.src=p.url;setTimeout(()=>finish(false),7000)}}
if(textureButton)textureButton.onclick=toggleOriginalTexture;
function shape(t,g){
 if(t.type==='overviewPlate'){plate(g,0,0,10);if(t.lines?.[0]==='filled'){const q=el('g',{transform:'scale(.47)'},g);shape({type:'fish'},q);}return;}
 if(t.type==='overviewForest'){const q=el('g',{transform:'scale(.23)'},g);shape({type:'forest'},q);return;}

 // Uploaded, cropped real-component pictures can replace selected moving shapes.
 const key=t.type==='share'&&!t.issued?'share-unissued':t.type;
 const bounds={fish:[38,24],wood:[28,28],coin:[30,30],forest:[202,62],'share-unissued':[86,38]};
 const src=window.rmNusPhotos?.[key];
 if(bounds[key]&&typeof src==='string'&&/^data:image\/(webp|png|jpeg);base64,/.test(src)){const [w,h]=bounds[key];el('image',{href:src,x:-w/2,y:key==='forest'?-24:-h/2,width:w,height:h,preserveAspectRatio:'xMidYMid meet'},g);return;}
 // AI-created, individually movable components. Preserve dynamic text and legal state.
 const art=window.RMNusArt;
 if(art){const draw=(k,x,y,w,h,fit)=>art.sprite(g,k,x,y,w,h,fit);
  const cap=(x,y,w,h,text,size=11,fill='#493e2b')=>{rect(g,x,y,w,h,'#fff0d9','#ac9066',3);label(g,x+w/2,y+h*.73,text,size,fill,{'text-anchor':'middle'})};
  if(t.type==='fish'){draw('fish',-19,-12,38,24);return;}
  if(t.type==='wood'){draw('wood',-14,-15,28,30);return;}
  if(t.type==='worker'){draw(art.workerKey(t.color),-16,-16,32,34);return;}
  if(t.type==='turnShip'){draw('boat',-22,-15,44,30);return;}
  if(t.type==='coin'&&!(useOriginalTexture&&photoReady.has('coin'))){draw('coin',-16,-16,32,32);label(g,0,5,'1',14,'#533914',{'text-anchor':'middle'});return;}
  if(t.type==='forest'&&!(useOriginalTexture&&photoReady.has('forest'))){draw('forest',-101,-24,202,62,'none');label(g,0,11,'숲',12,'#fffbe7',{'text-anchor':'middle','paint-order':'stroke',stroke:'#304f29','stroke-width':3});return;}
  if(t.type==='share'){draw(t.issued?'share':'unissued',-45,-20,90,40,'none');if(t.issued)el('ellipse',{rx:41,ry:16,fill:'none',stroke:t.color||'#b54c41','stroke-width':3.8},g);label(g,0,4,t.issued?'발행':'미발행',12,'#5a4730',{'text-anchor':'middle'});return;}
  if(t.type==='setupElder'&&!t.faceDown){const w=t.width,h=t.height;draw('elder',-w/2,-h/2,w,h,'none');cap(-w/2+3,-h/2+3,Math.max(23,w*.35),Math.min(18,h*.3),'#'+t.name,w>100?14:11);return;}
  if(t.type==='setupBuilding'&&!t.faceDown){const w=t.width,h=t.height;draw(t.name==='A'?'buildingA':'buildingB',-w/2,-h/2,w,h,'none');cap(-w/2+3,-h/2+3,w-6,15,t.name+' 건물',11);return;}
  if(t.type==='ship'){const w=t.width||108,h=t.height||48;draw('ship',-w/2,-h/2,w,h,'none');const lines=t.lines||[];cap(-w/2+3,h/2-Math.max(16,lines.length*10+13)-2,w-6,Math.max(16,lines.length*10+13),'',10);label(g,0,h/2-lines.length*10-7,t.name,11,'#493e2b',{'text-anchor':'middle'});lines.forEach((v,i)=>label(g,0,h/2-lines.length*10+4+i*10,v,9,'#493e2b',{'text-anchor':'middle'}));return;}
  // Card illustrations remain independent and illustrative: do not imply exact named-card art.
  if(t.type==='building'){const w=t.width||110,h=w<100?61:70;draw('buildingA',-w/2,-h/2,w,h,'none');cap(-w/2+3,-h/2+3,w-6,16,t.name,11);const lines=t.lines||[];if(lines.length){rect(g,-w/2+4,-h/2+23,w-8,h-27,'#fff0dc','#b09269',3,{opacity:.95});lines.forEach((v,i)=>label(g,0,-h/2+35+i*14,v,w<100?9:11,'#493e2b',{'text-anchor':'middle'}));}return;}
  if(t.type==='elder'||t.type==='elderMini'){const w=t.width||82,h=w<75?57:82;draw('elder',-w/2,-h/2,w,h,'none');for(let i=0;i<3;i++)el('ellipse',{cx:(i-1)*w/3.5,cy:-h/2+7,rx:8,ry:4,fill:'#f0f5f3',stroke:'#7d9b9c'},g);cap(-w/2+3,-h/2+14,w-6,14,t.name,10);const lines=t.lines||[];if(lines.length){rect(g,-w/2+4,-h/2+30,w-8,Math.min(h-34,lines.length*10+5),'#fff0dc','#b09269',3,{opacity:.94});lines.forEach((v,i)=>label(g,0,-h/2+39+i*10,v,w<75?8:9,'#493e2b',{'text-anchor':'middle'}));}return;}
 }
 if(t.type==='fish'){el('path',{d:'M-17 -1 Q-11 -10 0 -8 Q8 -8 12 -4 L17 -8 L18 -2 L15 2 L18 6 L12 6 Q2 11 -9 6 Q-15 5 -17 -1 Z',fill:'#168fb7',stroke:'#166783','stroke-width':1.4},g);el('path',{d:'M-14 1 Q-7 8 3 7 L12 3 L17 6 L15 9 L10 8 Q-2 14 -13 7Z',fill:'#156581',opacity:.8},g);el('path',{d:'M-12 -2 Q-6 -7 6 -4',fill:'none',stroke:'#78c6db','stroke-width':1.5},g)}
 else if(t.type==='wood'){el('path',{d:'M-8 12 L-9 4 L-12 1 L-10 -4 L-6 -4 L-4 -11 L2 -12 L6 -9 L6 -5 L11 -4 L10 2 L5 5 L4 12 Z',fill:'#8b5235',stroke:'#63412c','stroke-width':1.5},g);el('path',{d:'M-8 4 L-6 11 L4 11 L5 5 L10 2 L9 5 L5 9 L5 14 L-8 14 L-11 6 Z',fill:'#603d2a',opacity:.8},g);el('path',{d:'M-5 6 L-2 -5 M2 7 L5 -3',stroke:'#bc936e','stroke-width':1,opacity:.7},g);}
 else if(t.type==='worker'){el('circle',{r:15,cy:3,fill:t.color||'#9a382e',stroke:'#5c4c43','stroke-width':2},g);el('circle',{r:15,fill:t.color||'#cf4f40',stroke:'#5c4c43','stroke-width':2},g);el('ellipse',{cx:-4,cy:-5,rx:8,ry:4,fill:'#e7836c',opacity:.6},g)}
 else if(t.type==='coin'){el('circle',{r:14,fill:'#e8c756',stroke:'#4c3926','stroke-width':2},g);el('circle',{r:10,fill:'none',stroke:'#4c3926','stroke-width':1.4},g);for(let i=0;i<20;i++){let a=i*Math.PI/10;el('line',{x1:Math.cos(a)*11,y1:Math.sin(a)*11,x2:Math.cos(a)*13,y2:Math.sin(a)*13,stroke:'#4c3926','stroke-width':1},g)}label(g,0,5,'1',14,'#3d3021',{'text-anchor':'middle'});cropTexture('coin',g)}
 else if(t.type==='share'){el('ellipse',{rx:43,ry:19,fill:'#faf1d9',stroke:t.issued?(t.color||'#b54c41'):'#b7a685','stroke-width':4},g);label(g,0,4,t.issued?'발행':'미발행',12,t.issued?(t.color||'#8d352c'):'#655a44',{'text-anchor':'middle'})}
 else if(t.type==='ship'){const w=t.width||108;const h=t.height||48;rect(g,-w/2,-h/2,w,h,'#fae7c2','#3d8295',5,{'stroke-width':3});el('path',{d:`M${-w/2+6} 12 h23 l-5 7 h-14 Z m11 -30 v23 l13 -7 z`,fill:'#b37c40',stroke:'#795737','stroke-width':.8},g);label(g,8,-9,t.name,11,'#59452c',{'text-anchor':'middle'});(t.lines||[]).forEach((v,i)=>label(g,10,6+i*12,v,10,'#59452c',{'text-anchor':'middle'}))}
 else if(t.type==='setupElder'){
  const w=t.width,h=t.height;rect(g,-w/2,-h/2,w,h,t.faceDown?'#657d73':'#f9edcf','#8f8266',5,{'stroke-width':2});
  if(t.faceDown){rect(g,-w/2+5,-h/2+5,w-10,h-10,'none','#d5e2d4',3);label(g,0,7,'?',28,'#f0f3e9',{'text-anchor':'middle'});}
  else {const large=w>100;label(g,-w/2+9,-h/2+18,`#${t.name}`,large?16:12,'#645138');if(large){for(let i=0;i<3;i++)el('ellipse',{cx:(i-1)*32,cy:-h/2+34,rx:13,ry:6,fill:'#d2e4e8',stroke:'#a1b8b7'},g);el('circle',{cx:0,cy:5,r:19,fill:'#cba984',stroke:'#9d7b5b'},g);el('path',{d:'M-29 43 Q-28 14 0 19 Q28 14 29 43 Z',fill:'#596f61'},g);el('path',{d:'M-21 0 Q-17 -21 4 -16 Q17 -17 22 0 Z',fill:'#68584b'},g);label(g,0,h/2-8,'원로',12,'#544d39',{'text-anchor':'middle'})}else{el('circle',{cx:0,cy:4,r:10,fill:'#cba984'},g);el('path',{d:'M-14 24 Q-13 8 0 10 Q13 8 14 24 Z',fill:'#596f61'},g)}}
 }
 else if(t.type==='setupBuilding'){
  const w=t.width,h=t.height;const tint=t.name==='A'?'#d4c08e':'#a9c7c8';rect(g,-w/2,-h/2,w,h,t.faceDown?tint:'#f9edd2','#9e825c',5,{'stroke-width':2});
  if(t.faceDown){label(g,0,5,t.name,22,'#5c715e',{'text-anchor':'middle'})}else{rect(g,-w/2+5,-h/2+5,w-10,16,tint,'none',2);label(g,-w/2+10,-h/2+17,t.name+' 건물',12,'#384b3e');el('path',{d:'M-18 2 L0 -13 L18 2 V20 H-18 Z M-7 20 V6 H7 V20 Z',fill:'#9d9274',stroke:'#756a51'},g);label(g,0,h/2-5,'공개',10,'#5b6f60',{'text-anchor':'middle'})}
 }
 else if(t.type==='deckStack'){
  const w=t.width||120,h=t.height||65;const tint=t.name==='A'?'#dcc99d':t.name==='B'?'#b8d2d2':t.name==='C'?'#d7b59f':'#dfd4b6';
  for(let i=2;i>=0;i--)rect(g,-w/2+2*i,-h/2-5*i,w,h,tint,'#a48e6e',5,{'stroke-width':1.4});
  if(['A','B','C'].includes(t.name)){label(g,-w/2+13,-h/2+22,t.name,22,'#4e6357');el('path',{d:'M-16 -7 Q-2 -19 15 -8 L26 -15 L26 0 L15 -6 Q-2 7 -16 -7 Z',fill:'#6e8b8a',stroke:'#587475'},g);label(g,0,15,t.lines?.[0]||'',16,'#4d5141',{'text-anchor':'middle'})}
  else{el('path',{d:'M-27 7 H5 L-3 14 H-20 Z M-11 -17 V7 L2 0 Z',fill:'#8e754e',stroke:'#66553d'},g);label(g,24,-5,t.name,14,'#594c35',{'text-anchor':'middle'});label(g,24,16,t.lines?.[0]||'',14,'#594c35',{'text-anchor':'middle'})}
 }
 else if(t.type==='elder'||t.type==='elderMini'){const w=t.width||82,h=w<75?57:82;rect(g,-w/2,-h/2,w,h,'#f9edcf','#9f9472',5,{'stroke-width':2});for(let i=0;i<3;i++)el('ellipse',{cx:(i-1)*w/3.5,cy:-h/2+7,rx:8,ry:4,fill:'#d2e4e8',stroke:'#a1b8b7'},g);label(g,0,-h/2+22,t.name,10,'#3d4839',{'text-anchor':'middle'});(t.lines||[]).forEach((v,i)=>label(g,0,-h/2+35+i*10,v,w<75?8:10,'#625539',{'text-anchor':'middle'}));if(h>60){el('circle',{cx:0,cy:17,r:10,fill:'#c5a382'},g);el('path',{d:'M-15 17 Q0 -2 15 17 Z',fill:'#756449'},g)}}
 else if(t.type==='building'){const w=t.width||110,h=w<100?61:70;rect(g,-w/2,-h/2,w,h,'#fff0d4','#aa7f4e',5,{'stroke-width':2});rect(g,-w/2+4,-h/2+4,w-8,17,'#d4b07d','#b58a55',3);label(g,0,-h/2+16,t.name,11,'#4e412a',{'text-anchor':'middle'});(t.lines||[]).forEach((v,i)=>label(g,0,-h/2+32+i*14,v,w<100?9:11,'#4e412a',{'text-anchor':'middle'}))}
 else if(t.type==='miniCard'){rect(g,-15,-12,30,24,t.faceDown?'#6b897c':t.name.startsWith('A')?'#e3d6a7':t.name.startsWith('B')?'#c8dddf':'#e7c9b1','#aa9775',3);label(g,0,4,t.faceDown?'C 뒷':t.name,10,t.faceDown?'#fff':'#344e45',{'text-anchor':'middle'})}
 else if(t.type==='playerKit'){
  rect(g,-97,-62,194,124,'#fff9e8',t.color,9,{'stroke-width':3});label(g,-86,-42,t.name+' 플레이어',13,t.color);rect(g,-86,-31,114,15,'#b6d8e1','#87a9ac',3);label(g,-29,-21,'원로 의회',9,'#375c60',{'text-anchor':'middle'});rect(g,-86,-14,114,54,'#bdd09d','#91aa83',4);for(let i=0;i<3;i++)for(let j=0;j<4;j++)rect(g,-82+j*26,-10+i*15,23,12,'#a6bc88','#e6ecd2',2);if(t.lines?.[0]==='완료'){for(let i=0;i<3;i++)rect(g,-30,-10+i*15,49,12,'#467641','#345c34',2);rect(g,-33,-13,49,12,'#58874e','#345c34',2);}rect(g,-86,36,114,14,'#64a1b6','#4b8795',2);label(g,-29,46,'시작 어획 3',9,'#fff',{'text-anchor':'middle'});el('circle',{cx:60,cy:-10,r:23,fill:'#e4cc9e',stroke:t.color,'stroke-width':3},g);label(g,60,-7,'공급처',9,'#63533d',{'text-anchor':'middle'});for(let i=0;i<3;i++)el('circle',{cx:-75+i*17,cy:53,r:6,fill:t.color,stroke:'#695d50'},g);for(let i=0;i<5;i++)el('ellipse',{cx:-20+i*12,cy:53,rx:6,ry:4,fill:'#faf1d9',stroke:t.lines?.[0]==='완료'&&i<2?t.color:'#a99a7c','stroke-width':1.7},g);
 }
 else if(t.type==='turnTile'){const n=Number(t.name),radius=23;if(n===2)rect(g,-24,-15,48,30,'#ead9a9',t.color,4,{'stroke-width':2});else{const points=many(n,i=>{let a=-Math.PI/2+i*2*Math.PI/n;return `${Math.cos(a)*radius},${Math.sin(a)*radius}`}).join(' ');el('polygon',{points,fill:'#ead9a9',stroke:t.color,'stroke-width':2},g)}label(g,0,4,t.lines.join('/'),10,'#554a36',{'text-anchor':'middle'});}

 else if(t.type==='turnShip'){el('path',{d:'M-19 4 L-16 -4 L-7 -5 L-7 -11 L3 -11 L3 -3 L13 -3 L19 3 L13 11 H-12 Z',fill:'#d2b180',stroke:'#997951','stroke-width':2},g)}
 else if(t.type==='metric'){rect(g,0,-19,480,58,'#fff9e9','#c7b584',8);label(g,12,0,t.name,13,'#567364');label(g,12,24,t.lines?.[0]||'',21,'#315f50')}
 else if(t.type==='forest'){rect(g,-101,-24,202,62,'url(#nusForest)','#254a30',7,{'stroke-width':2.6});rect(g,-97,-20,194,54,'none','#88a263',5,{'stroke-width':1,opacity:.55});el('path',{d:'M-96 29 Q-70 9 -47 23 T3 19 T57 11 T96 15',fill:'none',stroke:'#84905e','stroke-width':4,opacity:.65},g);cropTexture('forest',g);label(g,0,11,'숲',12,'#f5f8df',{'text-anchor':'middle','paint-order':'stroke',stroke:'#375d39','stroke-width':3})}
}
function stateAt(c,f){let m=new Map(c.state.map(t=>[t.id,{...t}]));for(let i=0;i<f;i++)for(const p of c.frames[i].patch)m.set(p.id,{...m.get(p.id),...p});return [...m.values()]}
function render(instant=false){const rmOld=RMLessonMotion.before(svg,nodes),same=svg.dataset.rmLessonChapter===String(chapter);svg.dataset.rmLessonChapter=String(chapter);const c=chapters[chapter],s=stateAt(c,frame);renderDetail(c);const ids=new Set(s.map(t=>t.id));for(const [id,g] of nodes)if(!ids.has(id)){g.remove();nodes.delete(id)}
 for(const t of s){let g=nodes.get(t.id);if(!g){g=el('g',{'data-piece':t.id,class:'piece',tabindex:0},pieces);nodes.set(t.id,g);g.dataset.kind='';g.setAttribute('role','img')}const kind=JSON.stringify([t.type,t.issued,t.color,t.name,t.width,t.height,t.lines,t.faceDown]);if(g.dataset.kind!==kind){g.replaceChildren();shape(t,g);g.dataset.kind=kind;g.setAttribute('aria-label',`${t.type} ${t.id}`)}g.style.transition='none';g.style.transform=`translate(${t.x}px,${t.y}px)`;g.dataset.x=t.x;g.dataset.y=t.y;g.style.opacity=t.hidden?'0':'1';g.style.pointerEvents=t.hidden?'none':'';g.setAttribute('aria-hidden',t.hidden?'true':'false');}
 for(const t of s)if(['fish','coin','wood','worker','turnShip'].includes(t.type))pieces.append(nodes.get(t.id));
 const active=c.frames[Math.max(0,frame-1)];for(const [k,v] of Object.entries(highlights))v.setAttribute('opacity',active.focus.includes(k)?'1':'0');
 $('setupCountWrap').hidden=false;$('chapter').textContent=`${chapter+1} / ${chapters.length} · ${c.sub}`;$('heading').textContent=c.title;$('narration').textContent=frame?active.text:'시연 전 상태입니다. 아래 기물의 배치를 확인한 뒤 시연을 시작하세요.';$('source').textContent=`빅박스 기본 규칙서 p. ${c.page}`;$('source').href=NUS_RULES+'#page='+parseInt(c.page,10);
 $('counter').textContent=`설명 ${frame} / ${c.frames.length}`;$('next').textContent=frame===c.frames.length?'다음 주제 →':frame===0?'시연 시작 →':'다음 설명 · 시연 →';$('next').disabled=chapter===chapters.length-1&&frame===c.frames.length;$('back').disabled=chapter===0&&frame<=1;
 $('progress').style.width=`${(chapter+(frame/c.frames.length))/chapters.length*100}%`;$('sidebar').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('current',i===chapter));
 const d=c.frames[frame]?.drag;$('dragHint').textContent=d?'직접 조작: 강조된 기물을 목적지에 끌어 놓거나 다음 설명을 누르세요.':'';
 for(const g of nodes.values())g.classList.toggle('movable',g.dataset.piece===d?.id);
 const prev=$('target');if(prev)prev.remove();if(d)el('circle',{id:'target',cx:d.x,cy:d.y,r:24,fill:'none',stroke:'#efb931','stroke-width':3,'stroke-dasharray':'6 4','pointer-events':'none'},svg);
 const lmAreas=Object.values(highlights).map(x=>({x:+x.getAttribute('x'),y:+x.getAttribute('y'),w:+x.getAttribute('width'),h:+x.getAttribute('height'),title:x.dataset.rmLessonZone||'보드'}));for(const t of s)RMLessonMotion.tagSVG(nodes.get(t.id),t,lmAreas);RMLessonMotion.run(svg,rmOld,{nodes,animate:same&&!instant,next:$('next')});
 RMComponentLens.nus(svg.closest('.board'),s,nodes,shape,c.title);
 if(voice&&frame&&!instant)speak(active.text)
}
function speak(text){try{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=1;speechSynthesis.speak(u)}catch{}}
function stop(){if(auto){clearTimeout(auto);auto=null}$('play').textContent='▶ 연속 시연'}
function forward(){const c=chapters[chapter];if(frame<c.frames.length){frame++;render()}else if(chapter<chapters.length-1){jump(chapter+1);}}
function jump(i){stop();chapter=i;frame=chapters[i].frames[0].patch.length===0?1:0;pieces.replaceChildren();nodes.clear();render(true);if(voice&&frame){speak(chapters[i].frames[0].text)}}
function backward(){stop();if(frame>1||(frame===1&&chapters[chapter].frames[0].patch.length)){frame--;render()}else if(chapter>0){jump(chapter-1);frame=chapters[chapter].frames.length;render(true)}}
function play(){if(auto){stop();return}const c=chapters[chapter];if(frame===c.frames.length){frame=0;render(true)}$('play').textContent='■ 정지';const go=()=>{if(frame===chapters[chapter].frames.length){stop();return}forward();auto=setTimeout(go,Math.max(3000,chapters[chapter].frames[frame-1].text.length*105,RMLessonMotion.duration(svg)+500))};go()}
function coords(e){const q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(svg.getScreenCTM().inverse())}
svg.addEventListener('pointerdown',e=>{const g=e.target.closest('.piece.movable');if(!g)return;stop();drag=g;dragOrigin=coords(e);g.setPointerCapture(e.pointerId);g.style.transition='none';e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(!drag)return;const p=coords(e);drag.style.transform=`translate(${Number(drag.dataset.x)+p.x-dragOrigin.x}px,${Number(drag.dataset.y)+p.y-dragOrigin.y}px)`});
svg.addEventListener('pointerup',e=>{if(!drag)return;const p=coords(e),d=chapters[chapter].frames[frame]?.drag;const x=Number(drag.dataset.x)+p.x-dragOrigin.x,y=Number(drag.dataset.y)+p.y-dragOrigin.y;drag.style.transition='';drag=null;dragOrigin=null;if(d&&Math.hypot(x-d.x,y-d.y)<35){forward();$('dragHint').textContent='좋아요. 규칙에 맞게 기물을 옮겼습니다.'}else{render();$('dragHint').textContent='노란 점선으로 표시된 목적지에 놓아 보세요.'}});
svg.addEventListener('pointercancel',()=>{if(drag){drag.style.transition='';drag=null;render()}});
let setupPlayers=NUS_DEFAULT_PLAYERS;
try{const saved=Number(localStorage.getItem('nusfjord.playerCount'));if(NUS_SETUP_COUNTS[saved])setupPlayers=saved;}catch{}
chapters.splice(0,chapters.length,...makeNusfjordChapters(setupPlayers));
$('setupCount').value=String(setupPlayers);
$('setupCount').onchange=()=>{const n=Number($('setupCount').value);if(!NUS_SETUP_COUNTS[n])return;setupPlayers=n;try{localStorage.setItem('nusfjord.playerCount',String(n))}catch{};chapters.splice(0,chapters.length,...makeNusfjordChapters(n));currentScene=null;jump(chapter);};
chapters.forEach((c,i)=>{let b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')}  ${c.title}`;b.onclick=()=>jump(i);$('sidebar').append(b)});
$('next').onclick=()=>{stop();forward()};$('back').onclick=backward;$('replay').onclick=()=>{stop();if(frame){frame--;render(true);requestAnimationFrame(()=>requestAnimationFrame(forward))}};$('play').onclick=play;$('voice').onclick=()=>{voice=!voice;$('voice').textContent=`음성 ${voice?'ON':'OFF'}`;$('voice').setAttribute('aria-pressed',voice);if(!voice&&window.speechSynthesis)speechSynthesis.cancel();else if(voice&&frame)speak(chapters[chapter].frames[frame-1].text)};$('restart').onclick=()=>jump(chapter);$('source').href=NUS_RULES;jump(0);

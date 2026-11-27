const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ids=new Map();
function element(){return {children:[],dataset:{},style:{},classList:{toggle(){}},textContent:'',value:'',append(...x){this.children.push(...x)},replaceChildren(){this.children=[]},setAttribute(){},addEventListener(type,fn){this[type]=fn},click(){this.onclick?.()}}}
const document={getElementById(id){if(!ids.has(id))ids.set(id,element());return ids.get(id)},createElement:element,createElementNS:element,body:element(),addEventListener(){}};
const window={};const store=new Map();const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const ctx=vm.createContext({document,window,localStorage,console,confirm:()=>true,alert(){}});
for(const f of ['games/die-macher.js','app/visuals.js','app/engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('deck.length'),48);assert.equal(run('state.index'),0);
assert.equal(run('voteResult(4,2,2,true)'),12);assert.equal(run('voteResult(0,2,2,true)'),0);assert.equal(run('voteResult(3,2,2,false)'),null);
assert.equal(run('voteResult(9,2,2,true)'),null);
ids.get('next').click();assert.equal(run('state.index'),0);ids.get('next').click();assert.equal(run('state.index'),1);
ids.get('mode').click();assert.equal(run('state.quick'),true);
for(let i=0;i<60;i++)ids.get('next').click();assert.equal(run('state.index'),47);
assert.equal(run('deck[state.index].r'),5);ids.get('reset').click();assert.equal(run('state.index'),0);
assert.ok(store.size);console.log('PASS: core flow, vote calculation examples, skip reminder, quick mode, completion, reset, persistence writes (mock DOM)');

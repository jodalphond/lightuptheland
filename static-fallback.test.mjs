import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('./index.html',import.meta.url),'utf8').split('<script>')[1].split('</script>')[0];
function game(fetch){const elements=new Map();function el(id){if(!elements.has(id))elements.set(id,{style:{},classList:{toggle(){}},getContext:()=>({}),addEventListener(){},querySelector:()=>({})});return elements.get(id);}const env=vm.createContext({document:{getElementById:el,querySelector:()=>el('label')},location:{href:'https://example.netlify.app/',protocol:'https:'},crypto:{randomUUID:()=> 'test'},URL,matchMedia:()=>({matches:false}),performance:{now:()=>1000},requestAnimationFrame(){},setInterval(){},setTimeout(){},navigator:{},fetch,AbortSignal});vm.runInContext(source,env);return env;}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
for(const [name,status,type] of [['missing API',404,'text/html'],['HTML rewrite',200,'text/html']])test(`static hosting with ${name} lights up after 2, 5, 10 baskets`,async()=>{const env=game(async()=>({status,ok:status===200,headers:{get:()=>type}}));vm.runInContext('score()',env);await settle();assert.equal(vm.runInContext('offline',env),true);assert.equal(vm.runInContext('state.score',env),1);vm.runInContext('for(let i=1;i<10;i++)score()',env);assert.equal(vm.runInContext('state.score',env),10);assert.equal(vm.runInContext('lastLevel',env),3);assert.equal(vm.runInContext('pending.length',env),0);assert.equal(vm.runInContext('celebrateUntil',env),3400);});
test('working shared API keeps shared scoring',async()=>{let score=0;const env=game(async(_url,options)=>({status:200,ok:true,headers:{get:()=> 'application/json'},json:async()=>({score:options.method==='POST'?++score:score,thresholds:[2,5,10],players:2})}));await settle();vm.runInContext('score()',env);await settle();assert.equal(vm.runInContext('shared && everShared && !offline',env),true);assert.equal(vm.runInContext('state.score',env),1);});
test('temporary server error does not switch a shared room to solo',async()=>{let failing=false;const env=game(async()=>failing?{status:503,ok:false,headers:{get:()=> 'application/json'}}:{status:200,ok:true,headers:{get:()=> 'application/json'},json:async()=>({score:4,thresholds:[2,5,10],players:2})});await settle();failing=true;vm.runInContext('score()',env);await settle();assert.equal(vm.runInContext('offline',env),false);assert.equal(vm.runInContext('pending.length',env),1);assert.equal(vm.runInContext('state.score',env),4);});

test('extended milestones unlock every stage and 40 uses American flag colors',async()=>{
 const env=game(async()=>({status:404,ok:false,headers:{get:()=> 'text/html'}}));await settle();
 for(const [score,level] of [[2,1],[5,2],[10,3],[20,4],[25,5],[30,6],[35,7],[40,8],[45,9]]){
  vm.runInContext(`adopt({...state,score:${score}})`,env);
  assert.equal(vm.runInContext('lightingMode()',env),level);
 }
 assert.equal(vm.runInContext('lightPattern({x:50,y:160,shirt:0,phase:0},1000,8).color',env),'#2450d8');
 assert.equal(vm.runInContext('lightPattern({x:400,y:142,shirt:0,phase:0},1000,8).color',env),'#ff354f');
 assert.equal(vm.runInContext('lightPattern({x:400,y:163,shirt:0,phase:0},1000,8).color',env),'#ffffff');
 vm.runInContext('reduce=true',env);
 assert.equal(vm.runInContext('lightPattern({x:400,y:163,shirt:0,phase:0},1000,8).brightness',env),1);
});

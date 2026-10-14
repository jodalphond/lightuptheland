import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {server} from './server.mjs';
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
after(()=>server.close());
async function call(path,body){const r=await fetch(origin+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
test('Render health and game are served from the same app',async()=>{
 assert.equal((await call('/health')).data.ok,true);
 const page=await fetch(origin+'/');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);assert.match(await page.text(),/SHARED ARENA/);
 assert.equal((await fetch(origin+'/server.mjs')).status,404);
});
test('two players share a score; retrying the same shot does not double count',async()=>{
 const a=await call('/api/score?room=test&player=a',{id:'a-1'});assert.equal(a.data.score,1);
 const b=await call('/api/score?room=test&player=b',{id:'b-1'});assert.equal(b.data.score,2);assert.equal(b.data.players,2);
 assert.equal((await call('/api/score?room=test',{id:'b-1'})).data.score,2);
 assert.equal((await call('/api/state?room=separate')).data.score,0);
});
test('milestones are adjustable and invalid ordering is rejected',async()=>{
 assert.deepEqual((await call('/api/settings?room=settings',{thresholds:[2,4,6]})).data.thresholds,[2,4,6]);
 assert.deepEqual((await call('/api/state?room=settings')).data.thresholds,[2,4,6]);
 assert.equal((await call('/api/settings?room=settings',{thresholds:[10,5,20]})).status,400);
});
test('20 simultaneous baskets are accumulated without lost updates',async()=>{
 await Promise.all(Array.from({length:20},(_,i)=>call('/api/score?room=concurrent',{id:'shot-'+i})));
 assert.equal((await call('/api/state?room=concurrent')).data.score,20);
});

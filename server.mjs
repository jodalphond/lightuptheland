import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export const rooms=new Map();
const defaults=[2,5,10,20,25,30,35,40,45];
export function roomFor(id){if(!rooms.has(id))rooms.set(id,{score:0,thresholds:[...defaults],seen:new Set(),players:new Map()});return rooms.get(id);}
export function snapshot(r){const now=Date.now();for(const [id,time] of r.players)if(now-time>15000)r.players.delete(id);return {score:r.score,thresholds:r.thresholds,players:r.players.size,serverTime:now};}
export const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(url.pathname==='/health'&&req.method==='GET')return json(200,{ok:true});
 if(url.pathname.startsWith('/api/')){
  const id=url.searchParams.get('room')||'cavs';if(!/^[a-z0-9-]{1,32}$/.test(id))return json(400,{error:'Invalid room'});
  const r=roomFor(id),player=url.searchParams.get('player');if(player&&player.length<100)r.players.set(player,Date.now());
  if(req.method==='GET'&&url.pathname==='/api/state')return json(200,snapshot(r));
  if(req.method!=='POST')return json(405,{error:'Method not allowed'});
  if(req.headers.origin&&req.headers.origin!==url.origin.replace('localhost',req.headers.host)){
   const origin=new URL(req.headers.origin);if(origin.host!==req.headers.host)return json(403,{error:'Origin rejected'});
  }
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return json(413,{error:'Request too large'});}const body=JSON.parse(raw||'{}');
  if(url.pathname==='/api/score'){
   if(typeof body.id!=='string'||body.id.length>100)return json(400,{error:'Shot ID required'});
   if(!r.seen.has(body.id)){r.seen.add(body.id);r.score++;}return json(200,snapshot(r));
  }
  if(url.pathname==='/api/settings'){
   const t=body.thresholds;if(!Array.isArray(t)||![3,9].includes(t.length)||!t.every((x,i)=>Number.isInteger(x)&&x>0&&x<=1000000&&(i===0||x>t[i-1])))return json(400,{error:'Use three or nine increasing positive whole numbers.'});
   const expanded=t.slice();if(t.length===3)for(const factor of [2,2.5,3,3.5,4,4.5])expanded.push(Math.max(expanded.at(-1)+1,Math.round(t[2]*factor)));if(expanded.at(-1)>1000000)return json(400,{error:'Milestones must be at most 1000000.'});r.thresholds=expanded;return json(200,snapshot(r));
  }
  return json(404,{error:'Unknown endpoint'});
 }
 if(url.pathname!=='/'&&url.pathname!=='/index.html'){res.writeHead(404);return res.end('Not found');}
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});res.end(await readFile(new URL('./index.html',import.meta.url)));
 }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Invalid request'}));}});
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT)||3000;server.listen(port,'0.0.0.0',()=>console.log(`Light Up the Land listening on port ${port}`));}

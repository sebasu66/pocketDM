import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import gateway from '../api/simulation-status.mjs';
import internal from '../simulation/api/status.mjs';
const config=JSON.parse(readFileSync(new URL('../../vercel.json',import.meta.url),'utf8'));
function response(){return {code:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(body){this.body=body;return this}}}
test('only PocketDM receives public ingress; simulation is bound internally',()=>{
 assert.deepEqual(config.rewrites,[{source:'/(.*)',destination:{service:'pocketdm'}}]);
 assert.deepEqual(config.services.pocketdm.bindings,[{type:'service',service:'simulation',format:'url',env:'SIMULATION_URL'}]);
 assert.equal(config.services.pocketdm.root,'vault-site');
 assert.equal(config.services.simulation.root,'vault-site/simulation');
 assert.equal(config.services.pocketdm.outputDirectory,'public');
});
test('private status imports existing simulation and projection without revealing state',()=>{
 const res=response();internal({method:'GET'},res);assert.equal(res.code,200);
 assert.deepEqual(Object.keys(res.body).sort(),['campaignContract','campaignTransport','narrationContract','ok']);
 assert.equal(res.body.campaignTransport,false);
 const bad=response();internal({method:'POST'},bad);assert.equal(bad.code,405);
});
test('runtime gateway calls only the bound service and fails closed',async()=>{
 const original=process.env.SIMULATION_URL;
 let path='';
 const server=createServer((req,res)=>{path=req.url;const reply=response();internal(req,reply);res.writeHead(reply.code,{'Content-Type':'application/json'});res.end(JSON.stringify(reply.body))});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  delete process.env.SIMULATION_URL;
  const missing=response();await gateway({method:'GET'},missing);assert.equal(missing.code,503);
  process.env.SIMULATION_URL='http://127.0.0.1:'+server.address().port;
  const good=response();await gateway({method:'GET'},good);assert.equal(good.code,200);assert.equal(path,'/api/status');assert.equal(good.body.campaignTransport,false);
  const method=response();await gateway({method:'POST'},method);assert.equal(method.code,405);
 }finally{
  if(original===undefined)delete process.env.SIMULATION_URL;else process.env.SIMULATION_URL=original;
  await new Promise(resolve=>server.close(resolve));
 }
});

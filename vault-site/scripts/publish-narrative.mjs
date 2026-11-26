import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdtempSync,rmSync,openSync,closeSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const vault=resolve(dirname(fileURLToPath(import.meta.url)),'..'),repo=resolve(vault,'..');
const branch='feature/narrative-coordination-20261124',project='lore-weaver-rt9pc',site='pocketdm-prototipos',url='https://'+site+'.web.app',channel='narrative-auto';
const auto=process.argv.includes('--auto'),check=process.argv.includes('--check');
const git=(...a)=>execFileSync('git',['-C',repo,...a],{encoding:'utf8',timeout:120000}).trim();
function run(cmd,args,cwd=vault){const r=spawnSync(cmd,args,{cwd,stdio:'inherit',timeout:300000});if(r.status!==0)throw Error(cmd+' failed: '+(r.error?.message??r.status));}
function firebase(args,cwd=vault,json=false){const opts={cwd,encoding:'utf8',timeout:300000,stdio:json?['ignore','pipe','pipe']:'inherit'};const all=[...args,'--project',project,'--non-interactive'];if(json)all.push('--json');const r=process.platform==='win32'?spawnSync('cmd.exe',['/d','/s','/c','firebase.cmd '+all.join(' ')],opts):spawnSync('firebase',all,opts);if(r.status!==0)throw Error('Firebase '+args[0]+' failed: '+(r.error?.message??r.stderr??r.status));return json?JSON.parse(r.stdout):null;}
function channels(){const out=firebase(['hosting:channel:list','--site',site],vault,true);if(!Array.isArray(out.result?.channels))throw Error('No Hosting channel list');return out.result.channels;}
const live=()=>{const c=channels().find(x=>x.name.endsWith('/live'));if(!c?.release?.name)throw Error('No live release ID');return c;};
async function release(base){const r=await fetch(base+'/data/pwa-release.json?check='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Release HTTP '+r.status);return r.json();}
function ancestor(a,b){try{git('merge-base','--is-ancestor',a,b);return true}catch{return false}}
function remoteHead(){const line=git('ls-remote','--heads','origin','refs/heads/'+branch);if(!line)throw Error('Missing remote branch');return line.split(/\s+/)[0]}
const publicContent=p=>p==='vault-site/scripts/publish-narrative.mjs'||/^vault-site\/public\/(?:libro\/|laboratorio\/dialogo\/|docs\/art-references\/|data\/(?:stormkeep-[^/]+\.json|narrative\/))/.test(p);
async function main(){
 if(git('branch','--show-current')!==branch){if(auto)return;throw Error('Only the coordinated narrative branch can deploy');}
 const sha=git('rev-parse','HEAD'),changes=git('diff','--name-only','HEAD^','HEAD').split('\n');
 if(auto&&!changes.some(publicContent))return;
 if(git('status','--porcelain','--untracked-files=no'))throw Error('Tracked changes pending; commit the intended release first');
 const lock=resolve(repo,git('rev-parse','--git-common-dir'),'pdm-narrative-deploy.lock');
 let fd;try{fd=openSync(lock,'wx')}catch{throw Error('Another narrative deployment is active, or a stale lock needs review')}
 let tmp;
 try{
  const remote=remoteHead();if(!ancestor(remote,sha))throw Error('Remote branch newer or divergent; synchronize first');
  const initial=live(),served=await release(url),base=JSON.parse(git('show','HEAD:vault-site/public/data/pwa-release.json'));
  if(served.sourceCommit){if(!/^[0-9a-f]{40}$/.test(served.sourceCommit)||!ancestor(served.sourceCommit,sha))throw Error('Live source is not an ancestor; reconcile before deployment')}
  else if(served.version!==base.version)throw Error('Live version differs from committed baseline; reconcile before deployment');
  if(served.sourceCommit===sha&&!check){console.log('Already published '+sha);return}
  tmp=mkdtempSync(join(tmpdir(),'pdm-release-'));const tar=join(tmp,'source.tar');
  run('git',['-C',repo,'archive','--format=tar','--output='+tar,sha,'vault-site/public','vault-site/scripts','vault-site/updates','vault-site/firebase.json','vault-site/.firebaserc'],repo);
  run('tar',['-xf','source.tar'],tmp);rmSync(tar);
  const staged=join(tmp,'vault-site'),pub=join(staged,'public'),version='narrative-'+sha.slice(0,12);
  run(process.execPath,['scripts/build-activity.mjs'],staged);run(process.execPath,['scripts/validate.mjs'],staged);
  for(const p of changes.filter(p=>p.startsWith('vault-site/public/')&&/\.(mjs|js)$/.test(p))){const f=join(tmp,p);if(existsSync(f))run(process.execPath,['--check',f],staged)}
  const manifest={version,title:'Narrativa de PocketDM actualizada',description:'Contenido integrado y validado del libro de campaña.',sourceCommit:sha};
  writeFileSync(join(pub,'data/pwa-release.json'),JSON.stringify(manifest)+'\n');
  const pwa=join(pub,'libro/pwa.mjs'),old=readFileSync(pwa,'utf8');if(!/const BUILD='[^']+'/.test(old))throw Error('PWA BUILD marker missing');writeFileSync(pwa,old.replace(/const BUILD='[^']+'/, "const BUILD='"+version+"'"));
  const sw=join(pub,'sw-pocketdm.js');writeFileSync(sw,readFileSync(sw,'utf8')+'\n// Automatic narrative release '+version+'\n');
  run(process.execPath,['--check',pwa],staged);
  if(check){console.log('CHECK PASS; no push or deploy: '+sha);return}
  git('push','origin',sha+':refs/heads/'+branch);if(remoteHead()!==sha)throw Error('Remote changed after push');
  firebase(['hosting:channel:deploy',channel,'--only','prototipos','--expires','1d','--no-authorized-domains'],staged);
  const candidate=channels().find(c=>c.name.endsWith('/'+channel));if(!candidate?.url||!candidate.release?.version?.name)throw Error('Preview release not found');
  const preview=await release(candidate.url);if(preview.sourceCommit!==sha||preview.version!==version)throw Error('Preview release verification failed');
  for(const p of ['/app/','/libro/','/libro/pwa.mjs','/sw-pocketdm.js']){const r=await fetch(candidate.url+p+'?verify='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Preview '+p+' HTTP '+r.status);if(p.endsWith('pwa.mjs')&&!(await r.text()).includes(version))throw Error('PWA build mismatch')}
  if(live().release.name!==initial.release.name||remoteHead()!==sha)throw Error('Concurrent release detected. Preview retained; live NOT changed');
  firebase(['hosting:clone',site+':'+channel,site+':live'],staged);
  let result;for(let i=0;i<5;i++){result=await release(url);if(result.sourceCommit===sha)break;await new Promise(r=>setTimeout(r,1500))}
  if(result.sourceCommit!==sha||result.version!==version)throw Error('Live verification failed; inspect Firebase before retry');
  console.log('LIVE verified: '+url+'/app/ '+version);
 }finally{if(tmp)rmSync(tmp,{recursive:true,force:true,maxRetries:3});closeSync(fd);rmSync(lock,{force:true})}
}
main().catch(e=>{console.error('NARRATIVE DEPLOY BLOCKED: '+e.message);process.exitCode=1});

// Portable public build: no Firebase CLI, credentials or private campaign data.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),pub=join(root,'public');
const expected='feature/narrative-coordination-20261124';
if(process.env.VERCEL_GIT_COMMIT_REF&&process.env.VERCEL_GIT_COMMIT_REF!==expected)throw Error('Wrong PocketDM branch');
const sha=process.env.VERCEL_GIT_COMMIT_SHA||execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/.test(sha))throw Error('Invalid source revision');
for(const script of ['build-activity.mjs','validate.mjs'])execFileSync(process.execPath,[join(root,'scripts',script)],{cwd:root,stdio:'inherit'});
for(const path of ['app/index.html','libro/index.html','app.webmanifest','sw-pocketdm.js','libro/pwa.mjs'])if(!existsSync(join(pub,path)))throw Error('Missing '+path);
const version='portable-'+sha.slice(0,12);
writeFileSync(join(pub,'data/pwa-release.json'),JSON.stringify({version,title:'PocketDM V2 actualizada',description:'Publicación alternativa del libro y la bóveda.',sourceCommit:sha})+'\n');
const pwa=join(pub,'libro/pwa.mjs'),source=readFileSync(pwa,'utf8');
if(!/const BUILD='[^']+'/.test(source))throw Error('Missing PWA build marker');
writeFileSync(pwa,source.replace(/const BUILD='[^']+'/, "const BUILD='"+version+"'"));
const sw=join(pub,'sw-pocketdm.js');writeFileSync(sw,readFileSync(sw,'utf8')+'\n// Portable build '+version+'\n');
console.log('Portable public build ready: '+sha);

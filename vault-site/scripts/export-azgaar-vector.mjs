// Export only public geographic facts from the isolated Azgaar trial.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(process.argv[2]??'C:/DEV/PocketDM_Azgaar/pocketdm-trial'),dest=resolve('public/azgaar');
const svg=readFileSync(join(root,'exports/pocketdm-vector.svg'),'utf8');
if(!/^<\?xml/.test(svg)||!svg.includes('id="fantasyMap"')||/<(?:script|foreignObject|iframe|object|embed|style)\b/i.test(svg)||/\son[a-z]+\s*=/i.test(svg)||/<!DOCTYPE|<!ENTITY/i.test(svg))throw Error('Unexpected SVG export');
for(const [,href] of svg.matchAll(/(?:xlink:)?href\s*=\s*"([^"]*)"/gi))if(href&&!href.startsWith('#'))throw Error('External SVG reference');
writeFileSync(join(dest,'geography.svg'),svg);
const data=JSON.parse(readFileSync(join(root,'burgs-renamed.json'),'utf8'));
const rows=data.rows.filter(b=>Number.isInteger(b.id)&&Number.isFinite(b.x)&&Number.isFinite(b.y)&&b.x>=0&&b.x<=1600&&b.y>=0&&b.y<=1000).map(b=>({id:b.id,name:b.name,x:b.x,y:b.y,capital:!!b.capital,population:b.population,port:!!b.port,walls:!!b.walls,group:b.group}));
if(rows.length!==772||!rows.some(b=>b.id===389&&b.name==='Stormkeep'))throw Error('Unexpected settlement export');
writeFileSync(join(dest,'settlements.json'),JSON.stringify({seed:'pocketdm-stormkeep-v1',width:1600,height:1000,settlements:rows}));
console.log('Azgaar SVG and '+rows.length+' actual settlement coordinates');

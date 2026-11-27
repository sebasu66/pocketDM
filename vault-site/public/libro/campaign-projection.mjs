// One read-only player projection, bound to the same confirmed revision as the book.
import {validateSheet} from '../laboratorio/character-sheet.mjs';
const need=(v,m)=>{if(!v)throw Error(m)};
const record=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const fields=s=>s.split(' ');
const scalar=v=>v===null||typeof v==='string'||typeof v==='boolean'||Number.isFinite(v);
const flat=(v,k)=>record(v,fields(k))&&Object.values(v).every(scalar);
const id=v=>typeof v==='string'&&v.length>0;
const list=(a,f)=>Array.isArray(a)&&a.every(f);
const keys=fields('schemaVersion campaignId actorId revision locationId elapsedSeconds sheet nodes routes');
export function readCampaignProjection(p,scope){
 need(record(p,keys)&&keys.every(k=>Object.hasOwn(p,k))&&p.schemaVersion===1&&p.campaignId===scope.campaignId&&p.actorId===scope.actorId&&p.revision===scope.revision&&Number.isSafeInteger(p.revision)&&p.revision>=0&&Number.isSafeInteger(p.elapsedSeconds)&&p.elapsedSeconds>=0,'Invalid campaign projection scope');
 const s=p.sheet;
 const nested=fields('attributes skills style damageModifier locations inventory state abilities pendingAbilities');
 need(record(s,fields('schemaVersion id name kind speciesId profession rank source baseMove magicPoints equippedWeaponId '+nested.join(' ')))&&s.id===p.actorId&&Object.entries(s).every(([k,v])=>nested.includes(k)||scalar(v)),'Invalid sheet projection');
 need(flat(s.attributes,'STR CON SIZ DEX INT INS POW CHA')&&flat(s.skills,'combat athletics brawn endurance evade perception stealth willpower influence track firstAid')&&flat(s.damageModifier,'count sides sign')&&record(s.style,fields('id name weaponIds'))&&id(s.style.id)&&id(s.style.name)&&list(s.style.weaponIds,id),'Invalid sheet fields');
 for(const k of ['abilities','pendingAbilities'])need(s[k]===undefined||list(s[k],id),'Invalid abilities');
 need(list(s.locations,l=>flat(l,'id name from to maxHp hp naturalAP vital limb disabled'))&&list(s.inventory,i=>record(i,fields('id kind name enc quantity carried size reach hands ap maxHp hp natural coverage worn damage'))&&Object.entries(i).every(([k,v])=>k==='coverage'?list(v,id):k==='damage'?flat(v,'count sides bonus'):scalar(v))),'Invalid inventory or locations');
 need(record(s.state,fields('fatigue bleeding prone stunTurns incapacitated unconscious fear cold extraLoad light dead wounds'))&&Object.entries(s.state).every(([k,v])=>k==='wounds'?list(v,w=>flat(w,'id locationId location severity netDamage bleeding treated stabilized remainingSeconds effect partialFunction stunTurns unconsciousSeconds')):scalar(v)),'Invalid state fields');
 validateSheet(s);
 need(list(p.nodes,n=>flat(n,'id name kind generation q r terrain parentId')&&id(n.id)&&id(n.name))&&new Set(p.nodes.map(n=>n.id)).size===p.nodes.length,'Invalid map nodes');
 const ids=new Set(p.nodes.map(n=>n.id));
 need(ids.has(p.locationId)&&p.nodes.every(n=>n.parentId===undefined||ids.has(n.parentId))&&list(p.routes,r=>flat(r,'id a b status minutes')&&id(r.id)&&ids.has(r.a)&&ids.has(r.b)&&['open','blocked','potential'].includes(r.status)&&Number.isFinite(r.minutes)&&r.minutes>=0),'Invalid visible routes');
 return structuredClone(p);
}
export function makeCampaignProjection(view){return readCampaignProjection(Object.fromEntries(keys.map(k=>[k,view[k]])),view)}

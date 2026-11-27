// Server-only. Never import from public/ or serialize a seed, provider or future address.
import {die,newSeed} from './engine.mjs';
export {newSeed};
export const RNG_VERSION='pocketdm-addressed-v1';
export const LEGACY_CAMPAIGN_VERSION='addressed-d100-v1';
export const LEGACY_COMBAT_VERSION='master-rules-v1';
const require=(ok,message)=>{if(!ok)throw new Error(message)};
const id=(value)=>typeof value==='string'&&value.length>0&&value.length<=512&&value.trim()===value;
function validateSeed(seed){require(typeof seed==='string'&&seed.length>0,'Private seed required')}
function validateOrdinal(n){require(Number.isSafeInteger(n)&&n>=0,'Invalid ordinal')}
function validateAddress(address){
 require(address&&typeof address==='object'&&!Array.isArray(address),'Invalid RNG address');
 const {moduleId,branchId,eventId,purpose,ordinal,actorId=null}=address;
 require([moduleId,branchId,eventId,purpose].every(id)&&(actorId===null||id(actorId)),'Stable RNG identifiers required');
 require(Object.keys(address).every(k=>['moduleId','branchId','eventId','purpose','ordinal','actorId'].includes(k)),'Unknown RNG address field');
 validateOrdinal(ordinal);
 return [moduleId,branchId,eventId,purpose,ordinal,actorId];
}
export function addressedRoll({seed,address,sides,version=RNG_VERSION}){
 validateSeed(seed);
 require(version===RNG_VERSION,'Unsupported RNG version');
 require(Number.isSafeInteger(sides)&&sides>=2&&sides<=1000000,'Invalid die');
 return die(seed,[version,'simulation',...validateAddress(address),sides],sides);
}
// Separate namespace and API: editorial selection must not affect a mechanical roll.
export function editorialIndex({seed,address,count}){
 validateSeed(seed);
 const parts=validateAddress(address);
 require(Number.isSafeInteger(count)&&count>=1&&count<=1000000,'Invalid editorial count');
 return count===1?0:die(seed,[RNG_VERSION,'editorial',...parts,count],count)-1;
}
// Matches the candidate master-rules roller's (sides,purpose,ordinal) signature.
// Explicit ordinal required; no implicit counter or Math.random fallback.
export function createCombatRoller({seed,moduleId,branchId,eventId,actorId=null,version=RNG_VERSION}){
 validateSeed(seed);
 require(version===RNG_VERSION,'Unsupported RNG version');
 validateAddress({moduleId,branchId,eventId,purpose:'validation',ordinal:0,actorId});
 return (sides,purpose,ordinal)=>addressedRoll({seed,version,sides,address:{moduleId,branchId,eventId,purpose,ordinal,actorId}});
}
// Exact candidate compatibility mode; preserve historical HMAC input, including no sides in address.
// Only use for replay of previously prepared master-rules-v1 events.
export function createLegacyCombatRoller({seed,address}){
 validateSeed(seed);
 require(id(address),'Legacy encounter address required');
 return (sides,purpose,ordinal=0)=>{
  require(id(purpose),'Unaddressed combat draw');
  validateOrdinal(ordinal);
  return die(seed,[LEGACY_COMBAT_VERSION,address,purpose,ordinal],sides);
 };
}

// QA-01 compatibility: preserve the exact persisted campaign address tuple.
// These signatures permit existing campaign-state consumers to re-export the
// shared implementation after coordinated review, without changing a draw.
export function legacyCampaignRoll(seed,address,sides){
 validateSeed(seed);
 require(Array.isArray(address)&&address.length>0&&address.every(x=>typeof x==='string'||Number.isSafeInteger(x)),'Invalid roll address');
 return die(seed,[LEGACY_CAMPAIGN_VERSION,...address],sides);
}
export function createLegacyCampaignRoller(seed,scope){
 validateSeed(seed);
 require(Array.isArray(scope)&&scope.length>0&&scope.every(x=>typeof x==='string'||Number.isSafeInteger(x)),'Invalid combat scope');
 const stableScope=[...scope];
 return (sides,purpose,ordinal=0)=>{
  require(typeof purpose==='string'&&purpose.length>0,'Missing combat draw purpose');
  validateOrdinal(ordinal);
  return legacyCampaignRoll(seed,[...stableScope,purpose,ordinal],sides);
 };
}

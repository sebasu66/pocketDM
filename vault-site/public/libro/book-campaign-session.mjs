// Presentation-only bridge to PocketDMEdition. No endpoint, state authority or local rolls.
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(k=>keys.includes(k));
export function createBookCampaignSession({reader,readEdition,transport,scope,makeCommandId=()=>globalThis.crypto.randomUUID()}){
 assert(typeof reader?.load==='function'&&typeof reader?.bindTransport==='function'&&typeof readEdition==='function'&&typeof transport?.resume==='function'&&typeof transport?.confirm==='function','Transporte de campaña no disponible');
 assert(exact(scope,['campaignId','actorId'])&&typeof scope.campaignId==='string'&&typeof scope.actorId==='string','Ámbito inválido');
 const identity=Object.freeze({...scope});
 let current=null,pending=null,busy=false,closed=false;
 function accept(raw,minRevision=0){
  const next=readEdition(raw);
  assert(next.campaignId===identity.campaignId&&next.actorId===identity.actorId&&next.revision>=minRevision,'Respuesta de campaña fuera de ámbito o desactualizada');
  for(const page of next.pages)for(const event of page.events)assert(event.presentation.phase!=='module-intent'||event.presentationStatus==='approved','Error de preparación: falta narración aprobada');
  return next;
 }
 function publish(next){assert(!closed,'Sesión cerrada');reader.load(structuredClone(next));current=next;return structuredClone(next)}
 async function resume(){
  assert(!closed&&!busy,'Sesión ocupada o cerrada');busy=true;
  try{
   const next=accept(await transport.resume({...identity}),current?.revision??0);
   const result=publish(next);if(pending&&next.revision>pending.expectedRevision)pending=null;
   reader.bindTransport(confirm);return result;
  }finally{busy=false}
 }
 async function confirm(request){
  assert(!closed&&!busy&&current,'Sesión no disponible');
  assert(exact(request,['campaignId','actorId','expectedRevision','pageId','choiceId'])&&request.campaignId===identity.campaignId&&request.actorId===identity.actorId&&request.expectedRevision===current.revision,'Elección de otra revisión o campaña');
  const page=current.pages.at(-1);
  assert(page.id===request.pageId&&page.choices.some(c=>c.id===request.choiceId),'Opción no autorizada por la edición');
  if(pending)assert(pending.pageId===request.pageId&&pending.choiceId===request.choiceId&&pending.expectedRevision===request.expectedRevision,'Confirmación pendiente: reintentar la misma acción o reanudar');
  else pending=Object.freeze({...request,commandId:makeCommandId()});
  busy=true;
  try{
   const next=accept(await transport.confirm({...pending}),pending.expectedRevision+1);
   assert(next.revision===pending.expectedRevision+1,'Respuesta de confirmación no consecutiva; reanudar campaña');
   const result=publish(next);pending=null;return result;
  }finally{busy=false}
 }
 function close(){closed=true;current=null;pending=null;reader.bindTransport(null)}
 return Object.freeze({resume,confirm,close});
}

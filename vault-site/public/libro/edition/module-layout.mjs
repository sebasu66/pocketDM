// One adapter shared by player editions and the DM's private authoring preview.
import '/dm/libro/editorial/editorial-page.mjs?v=15';
import '/dm/libro/editorial/dialogue-page.mjs?v=16';
import '/dm/libro/editorial/module-pages.mjs?v=1';
import {readLocal} from '/dm/libro/editorial/library.mjs?v=15';
export const pageKinds=Object.freeze({cover:'cover',location:'scene',dialogue:'dialogue',exploration:'exploration',combat:'combat',climax:'climax',resolution:'resolution'});
export function makeModuleLayout(page,{title='',allowChoices=false,onChoice=()=>{},previewView}={}){
 const kind=pageKinds[page.type];if(!kind)throw Error('Tipo de página no admitido');
 const node=document.createElement('book-editorial-'+kind);node.style.display='block';node.style.width='100%';
 node.setAttribute('preview-view',previewView||(matchMedia('(max-width: 800px), (max-height: 660px), (any-pointer: coarse)').matches?'mobile':'desktop'));if(node.getAttribute('preview-view')==='mobile')node.setAttribute('reading-flow','');
 const content={title:page.title,kicker:title,paragraphs:[...page.text],image:page.image||'',alt:page.title,folio:page.id,camera:{},moduleRows:page.details??[]};
 if(kind==='dialogue'){
  content.dialogue={people:[{name:page.speaker||'Escena',role:page.speakerRole||'',image:page.portrait||'',emotion:'neutral',emotions:{}}],line:page.line||page.text.join('\n\n'),history:page.history??[],choices:allowChoices?page.choices:[]};
  content.paragraphs=page.line?page.text:[];
  node.addEventListener('dialogue-choice',e=>onChoice(e.detail));
 }
 node.content=content;return node;
}
export async function loadModuleLayout(node,ref){
 const kind=node.localName.replace('book-editorial-','');
 const id=ref?.id??'forja';
 if(!/^(?:forja|plaza|local-[a-zA-Z0-9-]+|cloud:[a-zA-Z0-9_-]+)$/.test(id))throw Error('Referencia de diseño inválida');
 if(ref?.revision!==undefined&&!Number.isSafeInteger(ref.revision))throw Error('Revisión de diseño inválida');
 if(ref){
  const cached=await readLocal(kind+'-'+id);
  if(cached?.settings&&(ref.revision===undefined||cached.cloudRevision===ref.revision)){node.applySettings(cached.settings);return 'Diseño guardado'}
  if(ref.revision!==undefined)throw Error('No está disponible la revisión solicitada del diseño');
 }
 if(!['forja','plaza'].includes(id))throw Error('Abrí el diseño guardado en el editor de esta instalación');
 await node.loadSettingsFromURL('/dm/libro/editorial/designs/'+kind+'-'+id+'.json');return 'Diseño base';
}

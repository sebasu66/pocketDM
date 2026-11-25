import examples from './prepared-skill-example-data.mjs';
import {selectedPreset} from './stormkeep-roster.mjs';
import {presetIds,presetInfo} from '../laboratorio/stormkeep-presets.mjs';
const make=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e};
class PreparedSkillExample extends HTMLElement{
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  const title=make('h2','El caballo desbocado'),note=make('p','Ejemplo no canónico: resultados calculados previamente con las tres fichas iniciales. No modifica una campaña.');
  note.className='sample';
  const prompt=make('p','Un caballo sin jinete irrumpe en el camino. ¿Qué hacés?');
  const select=make('select');select.setAttribute('aria-label','Personaje del ejemplo');
  for(const id of presetIds){const o=make('option',presetInfo(id).name);o.value=id;select.append(o)}
  select.value=selectedPreset()??presetIds[0];
  const action=make('div');action.className='folio-module';
  const result=make('div');result.setAttribute('aria-live','polite');
  const buttons=[];
  for(const [id,label] of [['catch','Intentar sujetarlo'],['dodge','Apartarme del camino']]){
   const b=make('button',label);b.type='button';b.className='roster-select';b.dataset.skillChoice=id;
   b.onclick=()=>{const envelope=examples[select.value][id];const e=make('book-narrative-event');e.setConfirmedNarration(envelope,{campaignId:envelope.campaignId,actorId:envelope.actorId,revision:envelope.revision});result.replaceChildren(e);for(const other of buttons)other.disabled=true;select.disabled=true};
   buttons.push(b);action.append(b);
  }
  const again=make('button','Probar otro personaje o acción');again.type='button';again.className='roster-select';
  again.onclick=()=>{select.disabled=false;for(const b of buttons)b.disabled=false;result.replaceChildren()};
  this.replaceChildren(title,note,select,prompt,action,result,again);
 }
}
if(!customElements.get('prepared-skill-example'))customElements.define('prepared-skill-example',PreparedSkillExample);

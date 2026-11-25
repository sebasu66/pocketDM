import {presetIds,presetInfo,stormkeepSheet} from '../laboratorio/stormkeep-presets.mjs';
import {sheetView} from '../laboratorio/character-sheet-view.mjs';
import {conditionProfile} from '../laboratorio/conditions.mjs';
const KEY='pocketdm.stormkeep.startingPreset.v1';
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
export function selectedPreset(){try{const id=localStorage.getItem(KEY);return presetIds.includes(id)?id:null}catch{return null}}
class StormkeepRoster extends HTMLElement{
 connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';this.selected=selectedPreset();this.render()}
 render(){
 const heading=el('h2','','Elegí tu personaje'),intro=el('p','','Tres personajes predefinidos para la primera aventura. Consultá su ficha y equipo antes de elegir.');
 const cards=el('div','roster-cards');
 const info=el('section','actor-folio folio-module roster-detail');info.setAttribute('aria-live','polite');
 const status=el('p','roster-status');
 const pick=id=>{this.selected=id;const data=presetInfo(id),sheet=stormkeepSheet(id);info.replaceChildren();info.innerHTML=sheetView(sheet,{portrait:data.portrait});for(const d of info.querySelectorAll('details'))d.open=true;const heading=el('h3','','Habilidades profesionales y rasgos');info.append(heading);for(const sk of data.professional)info.append(el('p','',sk.name+' · '+sk.value+'% · pendiente de reglas'));info.append(el('p','muted',data.notes));const btn=el('button','roster-select','Confirmar personaje');btn.type='button';btn.onclick=()=>{try{localStorage.setItem(KEY,id);status.textContent='Elegiste '+data.name+'. Selección guardada en este dispositivo; aún no se creó una campaña.'}catch{status.textContent='No se pudo guardar en este dispositivo.'}};info.append(btn,status);for(const b of cards.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.preset===id));};
 for(const id of presetIds){const data=presetInfo(id),p=conditionProfile(stormkeepSheet(id));const button=el('button','roster-card');button.type='button';button.dataset.preset=id;button.setAttribute('aria-pressed','false');const im=el('img');im.src=data.portrait;im.alt=data.name;button.append(im,el('strong','',data.name),el('span','',data.role),el('small','',p.ap+' PA · Combate '+p.target+'%'));button.onclick=()=>pick(id);cards.append(button)}
 this.replaceChildren(heading,intro,cards,info);pick(this.selected||presetIds[0]);if(selectedPreset())status.textContent='Selección guardada: '+presetInfo(selectedPreset()).name;
 }
}
if(!customElements.get('stormkeep-roster'))customElements.define('stormkeep-roster',StormkeepRoster);

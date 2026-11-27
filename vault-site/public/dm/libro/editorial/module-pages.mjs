import {BookEditorialScene,BookEditorialIntro} from './editorial-page.mjs?v=15';
const captionFields={
 modulePanel:{group:'Módulo',label:'Mostrar panel de contexto',type:'boolean',default:true},
 modulePanelInk:{group:'Módulo',label:'Tinta del panel',type:'color',default:'#fff8ed'},
 modulePanelPaper:{group:'Módulo',label:'Papel del panel',type:'color',default:'#252b32'},
 modulePanelSize:{group:'Módulo',label:'Tamaño del texto del panel',type:'number',default:16,min:12,max:26,step:1}
};
const element=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const modulePage=Base=>class extends Base{
 static editableProperties=Object.freeze({...Base.editableProperties,...captionFields});
 constructor(){super();const style=element('style',':host{display:block}.module-context{padding:12px 18px;border-top:1px solid #a2948055;display:grid;gap:6px}.module-context[hidden]{display:none}.module-context h3{margin:0;font:600 1em Georgia}.module-context dl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin:0}.module-context dt{opacity:.75}.module-context dd{margin:0;overflow-wrap:anywhere}');this.panel=element('section');this.panel.className='module-context';this.panel.setAttribute('aria-label','Contexto de la escena');this.shadowRoot.append(style);this.pageTail.prepend(this.panel)}
 get content(){return super.content}
 set content(v){if(v.moduleRows!==undefined&&(!Array.isArray(v.moduleRows)||v.moduleRows.length>40||v.moduleRows.some(r=>typeof r?.label!=='string'||typeof r?.value!=='string')))throw TypeError('Contexto editorial inválido');super.content=v}
 render(){super.render();const s=this.effective,rows=this._content.moduleRows??[];this.panel.hidden=!s.modulePanel||!rows.length;this.panel.style.color=s.modulePanelInk;this.panel.style.background=s.modulePanelPaper;this.panel.style.fontSize=s.modulePanelSize+'px';this.panel.replaceChildren();if(rows.length){this.panel.append(element('h3',this.constructor.panelTitle));const dl=element('dl');for(const r of rows)dl.append(element('dt',r.label),element('dd',r.value));this.panel.append(dl)}}
};
export class BookEditorialCover extends modulePage(BookEditorialIntro){static componentType='book-editorial-cover';static panelTitle='Aventura'}
export class BookEditorialExploration extends modulePage(BookEditorialScene){static componentType='book-editorial-exploration';static panelTitle='Observaciones'}
export class BookEditorialCombat extends modulePage(BookEditorialScene){static componentType='book-editorial-combat';static panelTitle='Encuentro'}
export class BookEditorialClimax extends modulePage(BookEditorialScene){static componentType='book-editorial-climax';static panelTitle='Situación decisiva'}
export class BookEditorialResolution extends modulePage(BookEditorialScene){static componentType='book-editorial-resolution';static panelTitle='Consecuencias confirmadas'}
for(const C of [BookEditorialCover,BookEditorialExploration,BookEditorialCombat,BookEditorialClimax,BookEditorialResolution])if(!customElements.get(C.componentType))customElements.define(C.componentType,C);

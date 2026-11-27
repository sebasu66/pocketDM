// Presentation only. No actions, checks, rolls or state changes.
class EditorialPanel extends HTMLElement{
 set model(value){this._model=value;if(this.isConnected)this.render()}
 connectedCallback(){this.render()} disconnectedCallback(){this._observer?.disconnect()}
 render(){const m=this._model;if(!m)return;this._observer?.disconnect();this.replaceChildren();const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
 if(m.type==='opening'){const img=make('img','scene');img.src=m.image;img.alt=m.alt;const wash=make('div','wash');const c=make('section','chapter');c.append(make('div','kicker',m.kicker),make('h1','',m.title),make('div','subtitle',m.subtitle));this.append(img,wash,c);return}
 const isReveal=m.type==='reveal',isPlate=m.type==='plate';const section=make('section',isPlate?'art-plate':isReveal?'reveal':'flow');const copy=isReveal||isPlate?make('div','copy'):section;
 if(isPlate){const img=make('img','plate-image');img.src=m.image;img.alt=m.alt;section.append(img,copy)} if(isReveal){const visual=make('div','visual');const img=make('img');img.src=m.image;img.alt=m.alt;visual.append(img);section.append(visual,copy)}
 const header=make('header');const heading=make('div');heading.append(make('div','kicker',m.kicker),make('h2','',m.title));const expand=make('button','expand',isPlate?'↗':'Ampliar ↗');expand.title='Ampliar lectura';expand.setAttribute('aria-label','Ampliar lectura');expand.type='button';expand.setAttribute('aria-haspopup','dialog');header.append(heading,expand);copy.append(header);
 const reading=make('div','reading');reading.tabIndex=0;reading.setAttribute('role','region');reading.setAttribute('aria-label','Texto narrativo desplazable');const prose=make('div','prose');
 if(!isReveal&&!isPlate&&m.image){const img=make('img','cutout');img.src=m.image;img.alt=m.alt;img.style.shapeOutside='url('+JSON.stringify(new URL(m.mask||m.image,location.href).href)+')';prose.append(img)}
 for(const text of m.paragraphs||[])prose.append(make('p','',text));reading.append(prose);copy.append(reading);
 const foot=make('footer');const status=make('span','','Texto completo disponible');foot.append(status,make('span','','Ficción de prueba'));copy.append(foot);
 const dialog=make('dialog','full-read');dialog.setAttribute('aria-label',m.title);const dh=make('header');const close=make('button','close','×');close.type='button';close.setAttribute('aria-label','Cerrar lectura ampliada');dh.append(make('h2','',m.title),close);const full=make('div','full-body');full.tabIndex=0;dialog.append(dh,full);this.append(section,dialog);
 let oldScroll=0;expand.onclick=()=>{oldScroll=reading.scrollTop;full.append(prose);dialog.showModal();full.scrollTop=0;close.focus()};close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{reading.append(prose);reading.scrollTop=oldScroll;expand.focus({preventScroll:true});update()});const update=()=>{if(!dialog.open)status.textContent=reading.scrollHeight>reading.clientHeight+2?'Deslizá para continuar ↓':'Texto completo visible'};this._observer=new ResizeObserver(update);this._observer.observe(reading);prose.querySelector('img')?.addEventListener('load',update);document.fonts.ready.then(update);update();
 }
}
if(!customElements.get('book-editorial-panel'))customElements.define('book-editorial-panel',EditorialPanel);

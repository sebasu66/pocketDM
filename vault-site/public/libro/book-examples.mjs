// Miniaventura editorial local: nunca envía comandos ni cambia el estado de campaña.
import {renderBookFolio} from './book-example-folio.mjs';
import {demoCheck} from './check-contract.mjs';
import {combatSample} from './book-examples-combat.mjs';
const forest='/libro/assets/bosque.png',plaza='/docs/art-references/plaza-cuervo-gris.png',forge='/docs/art-references/herreria.png';
const item=(id,label,type,title,text,extra={})=>({id,label,type,title,text,events:[],choices:[],...extra});
const check=(id,skillId,skillName,base,roll,reason,action,consequence)=>demoCheck({id:'example.'+id,actorId:'galahad',actorName:'Galahad',skillId,skillName,base,roll,difficulty:'Difícil',reason,action,consequence});
const samples=[
 item('cover','Portada','cover','El farol del paso',['Miniaventura de muestra. Una noche, un encargo y tres desenlaces.'],{image:'/libro/edition/assets/cover.webp',details:[{label:'Edición',value:'Demostración independiente de Stormkeep'}]}),
 item('location','Localización','location','Una plaza al anochecer',['Galahad llega a la plaza cuando empieza a nevar. Un farol apagado marca la entrada a la forja.'],{image:plaza,details:[{label:'Hora',value:'Atardecer'},{label:'Clima',value:'Nevada'}]}),
 item('dialogue','Diálogo con NPC','dialogue','El encargo del herrero',['El herrero deja el martillo sobre el yunque.'],{speaker:'Herrero de muestra',speakerRole:'Artesano',portrait:'/docs/art-references/herrero-retrato.png',line:'El farol del refugio está apagado. ¿Podrías llevar esta lámpara hasta allí?',choices:[{id:'accept',label:'Acepto el encargo'},{id:'ask',label:'¿Hay otro camino?'}],responses:{accept:'«Gracias. No te apartes del sendero si podés evitarlo». Te entrega la lámpara.',ask:'«Hay un sendero largo, menos expuesto». Te entrega la lámpara y te señala la salida.'}}),
 item('exploration','Exploración','exploration','Huellas en la nieve',['Con la lámpara en la mano, Galahad se interna en el bosque. La nieve cubre casi todo el camino.'],{image:forest,details:[{label:'Objetivo',value:'Llegar al refugio'}]}),
 item('perception','Skill check 1 · Percepción','exploration','Un rastro entre los pinos',['Galahad distingue huellas recientes junto al sendero. Hay un animal cerca.'],{image:forest,check:check('perception','perception','Percepción',56,28,'La nevada dificulta ver las huellas.','Detectar el rastro','Detecta las huellas antes de acercarse al animal.')}),
 item('athletics','Skill check 2 · Atletismo','exploration','La piedra cubierta de hielo',['Intenta cruzar una zanja por una piedra helada. Resbala y pierde tiempo; la lámpara sigue intacta.'],{image:forest,check:check('athletics','athletics','Atletismo',48,63,'La superficie helada dificulta el equilibrio.','Cruzar la zanja','Pierde tiempo y debe buscar otro paso.')}),
 item('decision','Elección argumental · Clímax','climax','Tres caminos bajo la tormenta',['Un lobo bloquea el paso más corto. El sendero largo bordea el bosque; volver a la plaza sigue siendo posible. ¿Qué hace Galahad?'],{image:forest,choices:[{id:'fight',label:'Enfrentar al lobo'},{id:'detour',label:'Tomar el sendero largo'},{id:'return',label:'Regresar a la plaza'}],targets:{fight:8,detour:10,return:11}}),
 item('combat','Combate','combat','Acero frente a colmillos',['Galahad enfrenta al lobo. El resultado precalculado del encuentro deja al animal incapacitado y a Galahad como vencedor.'],{image:forest,events:[combatSample.envelope],details:[{label:'Motor',value:'Simulación de prueba; tiradas ya resueltas'},{label:'Resultado',value:'Victoria de Galahad'}]}),
 item('victory','Final A · El farol encendido','resolution','El farol encendido',['Tras superar al lobo, Galahad alcanza el refugio y enciende su farol antes de que la tormenta cierre el paso.'],{image:forge,details:[{label:'Desenlace',value:'Éxito por combate'},{label:'Encargo',value:'Completado'}]}),
 item('detour','Final B · La ruta segura','resolution','La ruta segura',['Galahad evita al animal. El desvío retrasa su llegada, pero finalmente enciende la lámpara del refugio.'],{image:forest,details:[{label:'Desenlace',value:'Éxito sin combate'},{label:'Encargo',value:'Completado con demora'}]}),
 item('return','Final C · La luz pendiente','resolution','La luz pendiente',['Galahad regresa a la plaza con la lámpara. El encargo queda pendiente; podrá intentarlo cuando amaine la nevada.'],{image:plaza,details:[{label:'Desenlace',value:'Retirada'},{label:'Encargo',value:'Sin completar'}]})
];
const el=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;return n};
function jump(n,node){node.dispatchEvent(new CustomEvent('book-example-jump',{detail:n,bubbles:true}))}
export function exampleNext(n){return n<7?n+1:n===8?9:null}
export function examplePrev(n){return n===0?null:n>=10?7:n-1}
let dialogueResponse='';
class ExamplePage extends HTMLElement{
 connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const n=Number(this.getAttribute('index')),p=samples[n-1];const head=el('section');head.className='folio-module book-example-header';
 const note=el('p','MINIAVENTURA DE MUESTRA · SIN PROGRESO DE CAMPAÑA');note.className='eyebrow';head.append(note);
 const label=el('label','Revisar página: '),select=el('select');select.setAttribute('aria-label','Tipo de página');for(const [i,title] of ['Índice',...samples.map(s=>s.label)].entries()){const o=el('option',title);o.value=String(i);select.append(o)}select.value=String(n);select.onchange=()=>jump(Number(select.value),this);label.append(select);head.append(label);
 if(!p){head.append(el('h2','El farol del paso'),el('p','Una miniaventura con un diálogo, dos chequeos fuera de combate y tres finales. Jugá desde el comienzo o abrí cualquier página para revisar su diseño.'));const grid=el('div');grid.className='decision';for(const [i,s] of samples.entries()){const b=el('button',String(i+1).padStart(2,'0')+' · '+s.label);b.type='button';b.onclick=()=>{if(i===0)dialogueResponse='';jump(i+1,this)};grid.append(b)}head.append(grid);this.replaceChildren(head);return}
 head.append(el('h2',p.label));const context={title:'El farol del paso',campaignId:combatSample.scope.campaignId,actorId:combatSample.scope.actorId,revision:combatSample.scope.revision};
 const folio=renderBookFolio(p,context,{demo:true,onDemoChoice:id=>{if(p.targets){jump(p.targets[id],this);return ''}dialogueResponse=p.responses[id];return dialogueResponse}});
 if(p.check){const annotation=el('book-skill-check');annotation.check=p.check;folio.append(annotation)}
 if(n===3&&dialogueResponse){const status=folio.querySelector('.decision + .sample');if(status)status.textContent=dialogueResponse}
 const next=exampleNext(n);if(next!==null){const b=el('button','Continuar');b.type='button';b.className='book-example-continue';b.onclick=()=>jump(next,this);folio.append(b)}
 if(n>=9){const b=el('button','Volver a jugar');b.type='button';b.onclick=()=>{dialogueResponse='';jump(1,this)};folio.append(b)}
 this.replaceChildren(head,folio);
 }
}
if(!customElements.get('book-example-page'))customElements.define('book-example-page',ExamplePage);
export const examplePages=Object.freeze(Array.from({length:samples.length+1},(_,i)=>'<book-example-page index="'+i+'"></book-example-page>'));

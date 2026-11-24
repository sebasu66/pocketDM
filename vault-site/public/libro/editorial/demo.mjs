import './panel.mjs';
const sample=[
'El viento del norte golpeaba las piedras del camino. A cada paso, los viajeros dejaban atrás las últimas huellas de un mundo familiar. En la distancia, una sombra azul se recortaba contra el cielo de óxido.',
'Galahad se detuvo al escuchar un crujido entre los árboles. No era el ruido de una rama que cedía al peso de la nieve. Algo se movía lentamente, como si conociera el terreno mejor que él.',
'La luz desapareció detrás de los troncos. El silencio que siguió fue más inquietante que cualquier amenaza pronunciada en voz alta. El viajero examinó las marcas del suelo y guardó sus conclusiones para sí.',
'Más allá del sendero, las piedras de un antiguo muro emergían de la nieve. Los símbolos grabados apenas podían distinguirse. La escarcha había cubierto casi todo, excepto una estrecha franja cerca de la base.',
'El norte no perdona las distracciones. Todavía quedaba camino por recorrer y las preguntas eran más numerosas que las respuestas. El viajero se tomó un momento antes de continuar.',
'El relato puede extenderse sin alterar el encuadre, sin reducir la letra y sin cortar información. Esta última sección es una prueba del lector, no un evento de campaña.'
];
const models=[
{type:'plate',kicker:'STORMKEEP  /  I',title:'Hacia Stormkeep',image:'stormkeep-art.webp',alt:'Retrato de una exploradora pelirroja, pinceladas de óxido y fortaleza azul sobre papel marfil',paragraphs:sample},
{type:'opening',kicker:'PocketDM · Laboratorio editorial',title:'STORMKEEP',subtitle:'La última llama del norte · Dirección artística provisional',image:'../assets/bosque.png',alt:'Bosque invernal ilustrado'},
{type:'flow',kicker:'I · Narración fluida',title:'El camino del norte',image:'galahad-cutout.webp',alt:'Ilustración de Galahad',paragraphs:sample},
{type:'reveal',kicker:'II · Descubrimiento',title:'Más allá del bosque',image:'../assets/bosque.png',alt:'Paisaje nevado',paragraphs:sample.slice(2)}
];let index=0,long=true;const root=document.querySelector('#edition');const el=document.createElement('book-editorial-panel');root.append(el);const prev=document.querySelector('#prev'),next=document.querySelector('#next'),variant=document.querySelector('#variant');function render(){const m=models[index];el.model={...m,paragraphs:long?m.paragraphs:m.paragraphs?.slice(0,1)};document.querySelector('#count').textContent=(index+1)+' / '+models.length;prev.disabled=index===0;next.disabled=index===models.length-1;variant.disabled=m.type==='opening';variant.setAttribute('aria-pressed',String(long))}prev.onclick=()=>{if(index>0){index--;render()}};next.onclick=()=>{if(index<models.length-1){index++;render()}};variant.onclick=()=>{long=!long;render()};render();

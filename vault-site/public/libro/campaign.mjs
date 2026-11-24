// Datos de presentación del libro V2. Ejemplo editorial, NO estado autorizado del servidor.
export const campaign = Object.freeze({
 id: "winter-demo",
 title: "Crónica del invierno",
 chapter: "Los colmillos del invierno",
 mode: "demo",
 characters: [
  {id:"galahad",name:"Galahad",role:"Guerrero errante",portrait:"./assets/galahad.png",
   fields:[["Arma","Espada larga"],["Fatiga inicial","20"],["Fatiga al cierre","28"],["Heridas propias","0"]]},
  {id:"zhalan",name:"Zhalan Driz’thar",role:"Explorador · Elfo oscuro",portrait:"./assets/zhalan.png",
   fields:[["Arma","Arco"],["Flechas restantes","11"],["Situación","En el bosque nevado"],["Acción","Observación y disparo"]]}
 ],
 actions: {"winter_next":[{"id":"defend","label":"Proteger al compañero","help":"Interponerse para cubrir a Galahad o Zhalan."},{"id":"observe","label":"Observar","help":"Evaluar las posiciones antes de actuar."},{"id":"withdraw","label":"Retirarse","help":"Intentar romper el contacto y buscar refugio."}]},
 journal:[
  {title:"El sendero desaparece",text:"Los viajeros avanzan bajo la nieve. La visibilidad y el terreno dificultan la marcha.",type:"Escena"},
  {title:"Presencias entre los pinos",text:"Zhalan distingue dos siluetas. La crónica incluye comprobaciones de percepción y visión nocturna.",type:"Encuentro"},
  {title:"El primer intercambio",text:"Una flecha abre la confrontación. Galahad mantiene la espada en guardia.",type:"Combate"},
  {title:"Balance provisional",text:"El animal herido retrocede. Queda una decisión táctica pendiente para el próximo intercambio.",type:"Estado"}
 ],
 map:{
  title:"Sendero del bosque nevado",
  subtitle:"Esquema narrativo provisional, no mapa geográfico canónico.",
  points:[{id:"path",x:14,y:68,name:"Sendero nevado",kind:"Ruta"},
   {id:"sight",x:49,y:43,name:"Siluetas entre los pinos",kind:"Observación"},
   {id:"encounter",x:81,y:63,name:"Encuentro con lobos",kind:"Escena"}]
 }
});

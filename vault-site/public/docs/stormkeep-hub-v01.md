# Stormkeep · N02 · Dossier de la ciudad v0.1
25/11/2026. Propuesta original de hub para revisión, basada en N01 y MOD-01. No es canon aprobado, ni mapa materializado ni sesión jugable. Los IDs draft.* son propuestas; los del fixture se conservan. Este documento es público: omite secretos, intenciones ocultas y resultados de aventuras.
## 1. La ciudad que espera el deshielo
Stormkeep (stormkeep) es un puerto fortificado de Las Marcas (marches). En la ladera, los tejados están sujetos con piedras para resistir el viento; en los muelles, las campanas anuncian que un barco ha vuelto. El comercio marítimo y el camino oriental mantienen comunicada la ciudad con comunidades del interior. A medida que cambia el invierno, esa relación se vuelve más frágil.
Propuesta distintiva: en el puerto hay una costumbre llamada la Mesa del Regreso. Cuando un barco tarda más de lo previsto, sus allegados dejan una taza boca abajo en las posadas. No es magia confirmada ni prueba de muerte; es una forma de hacer visible la ausencia. La gente de Stormkeep tiene razones para quedarse, trabajar, celebrar y discutir, no sólo para sobrevivir.
La ciudad puede recibir grupos sin vínculo previo con Galahad ni SoulFrost. N01 sigue abierto en cuanto a especies, panteón, magia, calendario y gobierno definitivo. No importar estos elementos de otros mundos.
## 2. Espacio y dependencias
La posición de costa, puerto y murallas se respeta. El atlas modular y Azgaar son borradores cartográficos; Azgaar propone burg 389, no población ni bioma definitivos. No se aprueban coordenadas, escala ni fronteras a partir de estos dibujos.
| ID de trabajo | Lugar | Familiar / funcional / fantástico | Dependencias |
|---|---|---|---|
| draft.stormkeep.east-gate | Puerta Oriental | Muralla y guardia / tránsito hacia el corredor / placas de hierro que tintinean con la escarcha | stormkeep, hex.0.0; acceso a camino a validar |
| draft.stormkeep.harbor | Muelles del Regreso | Embarcaderos y lonja / carga, pesca y rescate / postes tallados con nombres de barcos ausentes | stormkeep; acceso al mar a materializar |
| draft.stormkeep.market | Mercado de las Balanzas | Puestos y depósitos / alimento, remedios, combustible / pesos de piedra grabados con marcas de antiguas familias | muelles, depósitos, camino |
| draft.stormkeep.inn | El Cuervo Gris | Posada / camas, comida, contactos / techo con cientos de cucharas de viajeros que prometieron regresar | mercado, acceso público |
| draft.stormkeep.smithy | Forja del Ancla | Herrería / reparar herramientas, clavos, armas autorizadas / silueta de un ancla antigua incrustada en la pared | mercado, hierro y combustible |
| draft.stormkeep.hospice | Hospicio del Umbral | Enfermería / cuidar enfermos y administrar remedios / una pared cubierta de pequeños nombres escritos en cera | mercado, agua, suministros, acceso de pacientes |
| draft.stormkeep.shrine | Casa de las Lámparas | Santuario / memoria, duelo y acogida / lámparas en nichos para personas cuyo regreso se espera | viviendas, artesanos, aceite |
| draft.stormkeep.fort | Bastión de la Guardia | Fortaleza / seguridad, archivo de tránsito y coordinación / un antiguo reloj de mareas en el patio | puerta, muelles, suministros |
Las relaciones espaciales son funcionales: puerta→camino; puerto→mercado; mercado→posada/forja/hospicio; bastión→puerta/puerto. No fijan rutas transitables, distancia, propiedad ni ubicación exacta. Solicitar al simulador asignar IDs consolidados y materializar sólo lugares requeridos por el módulo.
## 3. Elenco y vínculos públicos propuestos
Corvin e Isveld son nombres del material narrativo anterior. El README confirma también a Gideon, cuya ficha no se pudo recuperar. Los nombres y papeles siguientes no sustituyen los secretos previos.
| ID de trabajo | NPC y función | Identidad y voz | Objetivo público / límite |
|---|---|---|---|
| draft.npc.corvin | Corvin, funcionario de tránsito | Formal, minucioso, interpreta compromisos literalmente | Mantener orden y responsabilidad documentada en accesos; depende de guardias y registros |
| draft.npc.isveld | Isveld, curandera del hospicio | Trato amable, preguntas concretas, evita sermones | Atender a quienes llegan; depende de medicinas, agua, personal y espacio |
| draft.npc.vesna | Vesna Rauk, posadera del Cuervo Gris | Humor seco, memoriza encargos y nombres | Mantener abierta la posada y cobrar deudas sin perder clientes; tiene habitaciones finitas |
| draft.npc.toren | Toren Brasa, herrero | Habla mediante comparaciones de oficio, detesta promesas imprecisas | Cumplir reparaciones y sostener a sus aprendices; combustible y hierro limitados |
| draft.npc.aldra | Aldra Neral, encargada de lonja | Negociadora tranquila, anota cada entrega | Equilibrar necesidades de muelles, mercado y comunidades; no controla por sí sola todo el comercio |
| draft.npc.senn | Senn, custodio de las Lámparas | Voz pausada, recuerda nombres y testimonios | Conservar memoria y ayudar a localizar ausentes; no tiene conocimiento sobrenatural garantizado |
Los tres actores existentes del corredor, pilot.mara, pilot.ivo y pilot.neris, conservan sus IDs y ubicaciones del fixture. Mara no reside automáticamente en Stormkeep; puede estar allí sólo si su posición autorizada lo permite. Su vínculo funcional candidato con Isveld es el abastecimiento sanitario. Ivo no se convierte automáticamente en subordinado de Corvin. Neris no recibe afiliación ni género por inferencia.
Gideon: referencia reservada, no se crea un nuevo actor ni se asigna ocupación o posición hasta recuperar su ficha. Corwin es una variante de nombre de trabajo que requiere verificar equivalencia, no un segundo NPC.
## 4. Relaciones semánticas candidatas
| Origen | Relación candidata | Destino | Motivo |
|---|---|---|---|
| draft.npc.corvin | works-at | draft.stormkeep.east-gate | Registro de tránsito |
| draft.npc.isveld | works-at | draft.stormkeep.hospice | Atención sanitaria |
| draft.npc.vesna | works-at | draft.stormkeep.inn | Posada |
| draft.npc.toren | works-at | draft.stormkeep.smithy | Reparaciones |
| draft.npc.aldra | works-at | draft.stormkeep.harbor | Cargas |
| draft.npc.senn | works-at | draft.stormkeep.shrine | Custodia |
| draft.npc.vesna | related-to | draft.npc.aldra | Provisiones y alojamiento de viajeros |
| draft.npc.toren | related-to | draft.npc.aldra | Herramientas y carga de hierro |
| draft.npc.isveld | related-to | pilot.mara | Abastecimiento de medicinas, relación candidata a validar |
| draft.npc.corvin | related-to | draft.npc.aldra | Registro y tránsito de cargamentos |
No inferir amistad, subordinación, propiedad, conocimiento ni ubicación a partir de estos enlaces. El motor valida dirección, tipo e IDs. Las instituciones N01 (Consejo del Puerto, Custodios de los Caminos, Pacto de los Hogares) son candidatas y no tienen miembros declarados.
## 5. Escenas de llegada activas (ejemplos, no eventos)
Corvin: mientras compara un sello con su registro, levanta la vista. «El paso es público. La responsabilidad, no. ¿Quién responde por ustedes?» Ofrece acreditar propósito, pedir información o tratar el acceso por otra vía legal. La reacción concreta depende de la conversación y el estado.
Isveld: está preparando vendas cuando recibe una solicitud de ayuda. «No necesito promesas. Necesito manos y algo que pueda administrar a mis pacientes». El visitante puede preguntar por suministros, ofrecer ayuda o marcharse si es legal.
Vesna: aparta una taza boca abajo al limpiar el mostrador. «No la dé vuelta. Todavía hay gente que espera». El gesto permite preguntar por una ausencia o por noticias del camino, sin convertirlo en una pista verdadera por sí solo.
Aldra: sostiene dos documentos de entrega. «El mismo carro no puede servir a dos pueblos a la vez. ¿Qué propone?» El conflicto concreto depende de la carga y las necesidades confirmadas.
Las frases son muestras de voz, no diálogo canónico obligatorio. Las opciones definitivas provienen del motor; no se escriben tiradas ni resultados.
## 6. Situaciones reutilizables
A. Última llama del norte (MOD-01): solicitud de medicinas, corredor oriental, disputa por el cargamento. Hospicio/mercado/puerta son dependencias candidatas; el módulo debe seguir admitiendo una apertura fuera de la ciudad.
B. Las tazas del regreso: un barco demora y diferentes hogares discuten qué hacer. Puede originar investigación, rescate, comercio o espera. No declarar que ocurrió ni dónde está el barco.
C. El hierro que falta: una herramienta esencial se rompe mientras varias instituciones reclaman la misma reserva. Puede generar reparación, abastecimiento o acuerdos. No declarar escasez efectiva sin estado autorizado.
D. El nombre borrado: un registro de tránsito y un testimonio parecen discrepar. Puede abrir una investigación sobre la ciudad. No revelar responsables ni vincularlo automáticamente al arco antiguo.
Estas situaciones no son módulos compilados, ni hechos históricos. Se generan sólo cuando el host las selecciona y el motor confirma dependencias y condiciones.
## 7. Ripple: ejemplos de consecuencias sin decidir reacciones
Entrega retrasada → afecta potencialmente hospicio, aldea y comerciantes dependientes. El analista del grafo identifica actores; no los informa automáticamente. Sólo actores con recibos válidos de conocimiento reciben un trabajo de roleplay; el LLM interpreta su perspectiva y propone intención. El motor valida capacidades, viaje, costes y efectos. No forzar reacción ni mutación por una tabla.
Daño a un depósito → evaluar propietario y recursos confirmados, personas que dependen de la carga, testigos y rutas de comunicación. La reputación no cambia por omnisciencia; puede aparecer una reclamación, propuesta de ayuda o una decisión de no actuar si se justifica.
## 8. Plan visual y entrega al atlas
Arte prioritario tras aprobación de entidades: panorámica de ciudad costera con puerta y puerto (no PJ reconocible), Cuervo Gris, hospicio, mercado y retratos de Corvin/Isveld, luego otros personajes según aparición. Un retrato de Mara sólo cuando se acuerde su identidad visual. Cada imagen lleva IDs de entidades, lugar, versión y requisitos de visibilidad. Composición móvil por capas, sin obligar a ilustrar cada variante.
Para el editor cartográfico: ocho sitios candidatos con dependencias y jerarquía stormkeep; separar imagen de cartografía efectiva. Reutilizar assets y marcadores existentes donde encajen; no asumir que un edificio decorativo ya es una entidad.
## 9. Fuentes y límites
GDD PocketDM (decisiones de 22–23 nov), README PocketDM del paquete anterior, world-bible-v01.md, stormkeep-module-proposal.md, simulation/world-pilot.mjs, ripple-narrative-impact.md, atlas-modular.md, azgaar-trial.md, skills storyteller/npcs.md, worldbuilding.md y adventures.md. El README referencia pnj-stormkeep.md, pero el original no apareció en las carpetas consultadas ni en Drive. Se recuperaron resúmenes históricos parciales, no texto exacto. El contenido nuevo se distingue como propuesta; los perfiles privados se conservan fuera de Hosting y Git. No se define población, facciones reales, economía cuantitativa, rutas, stats, inventarios o secretos de juego en este dossier.

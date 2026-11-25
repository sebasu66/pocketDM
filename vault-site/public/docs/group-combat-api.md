# Combate de varios participantes · tactical-group-v1
25/11/2026. Ampliación de [API de encuentros](encounter-rules-api.md).

## Funcionamiento
Iniciativa individual D10 + bonificación efectiva, incluyendo sorpresa y armadura. Cada ronda repone AP según la ficha y sus condiciones. En cada ciclo se recorre el orden de iniciativa y cada actor realiza como máximo una acción proactiva; las reacciones consumen AP del defensor inmediatamente. Se omiten actores sin AP o incapacitados. Se repite el ciclo mientras quedan AP. Una baja no termina el combate si quedan bandos activos. Cada actor conserva HP localizado, heridas, fatiga, equipo y estado independientes. Se reutilizan exchange, continueGrip, changeRange y struggle; no hay un segundo resolvedor de daño.

## API
resolveCombatEncounter admite, además de la firma anterior 1v1:
```js
resolveCombatEncounter({
 id: "encounter-01", seed: privateSeed, maxRounds: 12,
 initialRange: "short", surprisedIds: [], limbLifeThreat: false,
 participants: [
  {character: heroSheet, side: "heroes",
   difficulty: {attack: "standard", defense: "standard"},
   defense: "auto", targetPriority: ["wolf-1", "wolf-2"]},
  {character: wolfSheet1, side: "wolves",
   difficulty: {attack: "standard", defense: "standard"},
   defense: "auto", targetPriority: ["galahad"]},
  {character: wolfSheet2, side: "wolves",
   difficulty: {attack: "standard", defense: "standard"},
   defense: "auto", targetPriority: ["galahad"]}
 ]
})
```
participants: 2–20 fichas con IDs distintos; side etiqueta de bando no vacía; al menos dos bandos. difficulty: grados explícitos para ataque y defensa de cada actor, según máster; defense: auto/parry/evade/none. targetPriority: IDs enemigos ordenados, sin aliados ni duplicados; [] usa enemigo activo de mayor iniciativa (política provisional). initialRange: short/long para pares enemigos; surprisedIds identifica sorprendidos; limbLifeThreat declara tipo de trauma grave de extremidad; seed privada, id estable, maxRounds 1–100. Todos estos campos son obligatorios. Un agarre limita las acciones pertinentes y no se acumula otro agarre sobre la víctima. Devuelve actores, actorIds, sides, initiative, initiativeDice, order, events con actorId/targetId/AP restantes, engagements, winningSide, winner individual cuando hay uno, outcome victory/draw/unresolved/withdrawal-pending. Un actor que intenta huir requiere resolver retirada; no se inventa escape.

## Campaña
createState(...,{encounters:[{id,locationId,maxRounds,initialRange,surprisedIds,limbLifeThreat,participants:[{actorId,side,difficulty,defense,targetPriority},...]}]}) usa las fichas efectivas comunes; maxRounds 1–12 en campaña. No duplicar fichas dentro del encuentro. Participantes co-localizados y visibles para ofrecer la elección de combate. La acción existente duel acepta el ID del encuentro, sin cambios de cliente. prepareWindow genera el combate y conserva una transición privada; confirmCommand requiere esa transición para encuentros grupales, y FirestoreCampaignStore la recupera del registro privado. La confirmación no vuelve a calcular el combate. Todos los participantes actualizan su ficha en una sola revisión. El evento confirmado incluye checks v1, combat.actorIds, sides, initiative, order, turnTrace, apTrace, winningSide y withdrawalRequested. Narrador utiliza estos datos en el mismo libro, no otro sistema.

## Límites explícitos
El desempate de iniciativa usa ID estable, no acciones simultáneas de Mythras. El alcance inicial es común y después por pareja, no un mapa de posiciones/obstáculos. La política provisional elige objetivo por prioridad, no optimización táctica; sin IA narrativa de moral, sin resolución automática de persecución ni fin por retirada. Si un actor pide huir, devuelve withdrawal-pending; el máster resuelve la retirada y continuación. Las acciones no ofensivas avanzadas y el ataque a varios objetivos siguen pendientes. El duelo anterior 1v1 conserva compatibilidad, incluyendo su política histórica de AP. La prueba grupal se hace con fichas de ejemplo, no declara canon ni una aventura jugable completa.

La accion de campana confirma un tramo preparado una sola vez, incluso si queda unresolved o withdrawal-pending; el master debe preparar la continuacion. No se reabre automaticamente con iniciativa nueva.

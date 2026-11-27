# API de reglas del máster · master-rules-v1

**Actualizacion:** [API de encuentros y consecuencias](encounter-rules-api.md) amplia las operaciones con sorpresa, miedo, heridas, retirada, primeros auxilios y potenciacion. Los parametros de combate de la extension son obligatorios y sustituyen los del cuadro v1 inicial.
Fecha: 25/11/2026. Autoridad: simulación. Consumidor: narrador/máster durante la preparación de caminos narrativos. Alcance: operaciones implementadas para la primera aventura, no certificación completa de Mythras.

## Principio
El máster elige la acción, habilidad, dificultad base y circunstancias del entorno. Simulación recibe una ficha efectiva del personaje en ese instante, interpreta sus condiciones pertinentes y resuelve la prueba usando el D100 obtenido por la semilla de la rama. No conoce el argumento, intentos anteriores ni cronología. No altera las fichas suministradas ni decide el desenlace narrativo. El narrador usa el resultado para preparar la continuación; el libro solo muestra el registro confirmado. Conversar, preguntar o realizar una acción rutinaria no exige chequeo.

## Entrada ejecutable
Desde vault-site, en Node/servidor privado:
```js
import {callMasterRules} from './simulation/master-rules.mjs';
const r=callMasterRules('checkSkill',{
 id:'escena-01.prueba-02',
 character:effectiveCharacterSheet,
 skill:'ride',
 difficulty:'hard',
 reason:'Montura asustada y terreno irregular',
 modifiers:[],
 requirements:{functionalHands:1},
 roll:42
});
```
No es todavía un endpoint HTTP/MCP publicado. Es una API de funciones JS con dispatcher JSON, sin dependencias de estado ni escritura; el host del narrador puede invocarla. Nunca recibir valores de dados, fichas o semilla desde una solicitud de jugador no confiable.

## Parámetros compartidos (SkillInput)
- character: ficha efectiva schemaVersion 1 validada por character-sheet.mjs. Debe contener valor numérico de la habilidad solicitada. El API no inventa entrenamiento de una habilidad que falte.
- skill: ID de habilidad existente en SKILL_METADATA (combat, athletics, brawn, endurance, evade, perception, stealth, willpower, influence, track, firstAid, ride, drive, deceit, insight, commerce, conceal, boating, customs, dance, locale, nativeTongue, sleight, oratory). Los IDs adicionales deben existir en la ficha; completar las tres fichas iniciales con valores de autoría.
- difficulty (obligatorio): automatic, very-easy, easy, standard, hard, formidable, herculean, hopeless. El máster fija la dificultad de situación; no se presupone Standard si falta.
- reason: justificación breve del máster (1–300 caracteres).
- modifiers?: lista de {targetDelta,reason}, modificadores porcentuales explícitos ya autorizados. No convertir toda circunstancia en puntos porcentuales; por defecto usar grados Mythras.
- requirements?: {functionalHands?:0|1|2,mobility?:boolean,confrontFear?:boolean}. Requisitos de la acción concreta, no deducidos de la prosa. Un brazo inutilizado no impide una prueba mental.
- roll: entero 1–100 pregenerado, requerido para pruebas resueltas; no se requiere si solo consulta perfil o la prueba es automática/imposible.
- id: ID estable del chequeo o concurso (excepto checkProfile); lo asigna preparación. No es contador de intentos ni dato de historia.

## Operaciones disponibles
| Operación | Parámetros | Resultado |
|---|---|---|
| checkProfile | SkillInput sin roll/id | base, dificultad base/efectiva, target, legal, blocked, modifiers, warnings |
| checkSkill | {id,...SkillInput} | status resolved/automatic/blocked, outcome cuando aplica, checks[] |
| checkOpposed | {id,actor:SkillInput,opponent:SkillInput} | ambos checks, winner actor/opponent/null, unresolved, oppositionPenalty |
| checkDifferential | mismos que opposed | ambos checks, advantage:{side:attacker/defender/null,count}, oppositionPenalty |
| checkResistance | {id,actor:SkillInput,potency:0..300,potencyRoll:1..100,sourceName} | oposición resistencia/potencia, winner resistance/hazard/null, checks |
| checkLift | {id,character,difficulty,reason,modifiers?,requirements?,roll?,mode:'lift'/'drag',weightSIZ} | capacity, status, checks; followUp injury/endurance-to-avoid-injury cuando aplica, no daño automático |
| checkGroup | {id,members:SkillInput[],mode:'team'/'reverse-team'/'sorting',roll} | checks y resultados por actor; team usa mayor target, reverse-team menor, sorting mismo dado contra cada valor |
| resolveCombatExchange | {id,seed,attacker,defender,defense:'auto'/'parry'/'evade'/'none',defenseAvailable?,context?} | dos fichas resultantes, checks, ataque/defensa, coste AP, daño, heridas, efectos, alcance/agarre si hay contexto |
| resolveCombatEncounter | {id,seed,attacker,defender,maxRounds,initialRange?} | resultado de duelo táctico existente, fichas resultantes, tiempo, eventos, trazas y ganador si existe; no incluye semilla |

Semillas y direcciones de combate son suministradas por el preparador, y sus tiradas se direccionan por propósito/ordinal. En los chequeos simples, el dado se suministra directamente. No se tira al abrir el libro.

## Social y física: ejemplos
- Hablar normalmente: sin llamada.
- Mentir con intención de ocultar la verdad: Deceit contra Insight.
- Detectar una mentira: Insight contra Deceit. Si la situación es una observación sin oposición activa, checkSkill Insight, con dificultad del máster.
- Persuadir, intimidar o presionar: el máster selecciona Influence y una oposición apropiada, por ejemplo Willpower; no toda conversación o amenaza requiere la misma prueba.
- Esconderse: Stealth contra Perception o Track según contexto.
- Regatear: Commerce contra Commerce o Influence contra Commerce.
- Controlar una montura: Ride; la dificultad depende de la montura y del entorno.
- Proezas de fuerza: Brawn (STR+SIZ), Athletics (STR+DEX) o prueba de capacidad directa según la tarea. El manual no justifica importar una regla general D&D de tirar D20 contra un atributo. Brawn enfrentado puede exigir ajustes por diferencia del modificador de daño; el máster debe suministrar el grado correspondiente hasta automatizar ese caso.

## Reglas y límites
Manual completo local Mythras (Nash/Whitaker), pp.38–44, 51–53, 78–80: grados, críticos/pifias, Brawn, Deceit, Influence, Insight, Ride, oposición, diferencial, grupos, carga y fatiga. En oposición, comparar primero grado de éxito; empate de grado exitoso se resuelve por el mayor dado exitoso, empate exacto o ambos fallos queda sin ganador. Si target mayor supera 100, restar exceso a ambos después de otros ajustes. Diferencial mide niveles, no compara el valor del dado cuando los grados coinciden. No forzar reintento. Brawn calcula capacidad ordinaria de levantar STR+floor(Brawn/10) SIZ y máximo breve 2×STR+floor(Brawn/10). Arrastre de referencia usa doble capacidad ordinaria; interpretación provisional del bonus, revisar si se necesita.
Las condiciones reutilizan fatigue/ENC del modelo común. La carga aumenta uno/dos grados desde la dificultad base para habilidades de STR/DEX; prevalece la condición más severa. La ficha puede bloquear manos/movilidad cuando la tarea lo requiere, e incapacidad/inconsciencia. El miedo en huida bloquea confrontación explícita; aturdimiento, heridas parcialmente funcionales y hemorragia se señalan para interpretación y no inventan una penalización universal. Luz/frío heredan hipótesis experimentales del laboratorio. No afirmar cobertura total de estados: faltan reglas específicas de heridas graves, condiciones de veneno/enfermedad, magia, pasiones, augmenting, habilidades profesionales restantes, casos especiales de movilidad y resistencia; el motor de duelo aún no cubre combate de grupos ni todos los efectos. No aplicar una penalización general de puntos de acción a chequeos narrativos.
El registro D100 de checks[] conserva check-contract v1 (id, actorId, actorName, skillId, skillName, base, target, difficulty, reason, dice, roll, outcome, visibility, source, formula) y añade baseDifficulty/modifiers/warnings. El libro ya acepta los campos v1. Los resultados son privados para el máster hasta que se autorice la proyección al jugador; en particular potencia o habilidades ocultas no deben publicarse automáticamente. Los status automatic/blocked no fabrican un registro D100.
Ejemplo no canónico, datos de prueba: Ride 65, dificultad Hard, dado 42 => target 43, éxito; con carga burdened pasa a Formidable, target 33, fallo. Mentir y resistir son operaciones mecánicas, no obligan al NPC a una decisión específica. Las futuras opciones argumentales se seleccionan fuera de esta API.

# Coordinación: mundo, combate y libro

Base: rama feature/boveda-mvp-20261124, commit ab988b5. Esta rama feature/combat-checks-v2 es una propuesta de integración; no despliega sobre el canal del agente mundo.

## División
- Mundo: generación narrativa y de mundo, exploración, escenas, aplicación y usuario.
- Combate: resolución de enfrentamientos, estrategias, eventos verificables y pruebas.
- Compartido: personaje y estado de campaña, libro, vocabulario y contrato de chequeos.

## Uso del componente
`import './book-skill-check.mjs';`
```js
const el = document.createElement('book-skill-check');
el.check = resolvedCheck; // validar con validateCheck de check-contract.mjs
paragraph.append(el);
```
El objeto v1 contiene id único, actorId, actorName, skillId, skillName, dice, roll, base, target, difficulty, outcome, reason, visibility=player y, opcionalmente, action, consequence, source. El motor determina el resultado; la presentación NO tira dados. No enviar tiradas secretas. Referenciar un check una sola vez por bloque. Factores como visión nocturna no son tiradas.

`book-narrative-event` y `combat-phase` comparten presentación; ambos consumen los mismos registros resueltos. Actualmente events.mjs contiene solo fixtures.

## Estado compartido: propuesta para acordar
Un actorId estable, un único servicio de estado de campaña (Firestore operativo; Git snapshots/esquemas). Comandos idempotentes con campaignId, commandId, actorId, expectedRevision. Motores devuelven eventos y efectos; servicio aplica una vez, en transacción, y publica vistas para libro/personaje/diario. No modificar la ficha desde la UI ni duplicar estado por motor. No implementado todavía.

## Bóveda
Nodos doc_0901 y doc_0902 propuestos para evitar colisión con numeración activa. Integrar por PR a la rama de la bóveda; confirmar con el otro agente antes de desplegar su canal. Las reglas exactas y licencia siguen pendientes (doc_0018).

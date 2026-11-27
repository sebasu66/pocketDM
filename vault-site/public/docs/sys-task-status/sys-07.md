# SYS-07 · Libro y proyección de partida
Fecha: 27/11/2026. Agente: SYS-07. Estado: en revisión parcial / bloqueado para integración real.
Base development: ebe06f9f5aac2968b7f3f74b2f627ebe062faa92. Rama: [feature/sys-07-libro](https://github.com/sebasu66/pocketDM/tree/feature/sys-07-libro).
Alcance: QA-02/09 · MOD-07. No validado, no H01, no producción.

## Fuentes y coordinación
Plan SYS-07, QA-02/08 narrative-contract-qa02, module-runtime-qa07, QA/H01. Actividad: act-20261127-dm-system-001, act-20261127-dialogue-scene-context-002 y act-20261127-vercel-services-candidate-001. Maestro editorial heredado fdc45fa. PR #5 runtime, #6 chequeos/reader/proyección y #7 ramas revisados por archivos; comentario de coordinación #6 (7221534468). No se modifican reader.mjs, index.html, narrative-projection.mjs, motor, editor, ni tablero de SYS-09. Se propone adaptador separado hasta reconciliar #6; no es una segunda implementación de reglas ni otro lector.

## Entrega
- simulation/approved-module-narration.mjs: entrada server-only para module-intent confirmado (playerState, recibo, digest canónico de evento visible, callback privado de fragmento aprobado). Checks del evento, no del texto. Faltantes, versión de evento incompatible y ámbito incorrecto bloquean presentación. Reutiliza el envelope narrative-confirmed-v1 y el validador actual.
- public/libro/confirmed-narration.mjs: permite estado approved además de fallback histórico; rechaza texto aprobado vacío, tokens no admitidos y checks duplicados.
- public/libro/book-campaign-session.mjs: puente al PocketDMEdition existente, resume y confirm inyectados; solo elección de última página, revisión/actor/campaña; commandId estable al reintentar, bloqueo de clic concurrente y respuesta obsoleta; exige approved para module-intent. No endpoint simulado en producción ni persistencia local de estado.
- public/libro/player-edition.mjs: export connectPlayerCampaign(transport,scope,reader) para integración autenticada; unicidad global de checks, error de preparación; componentes/layouts existentes.
- simulation/test-book-campaign-session.mjs y simulation/test-approved-module-narration.mjs.
- Decisiones propuestas, pendientes de acuerdo: approved en envelope v1, digest de evento visible (no sustituye hash de contexto/branchId SYS-05), transport.resume({campaignId,actorId}) y transport.confirm({campaignId,actorId,expectedRevision,pageId,choiceId,commandId}) devuelven edición autorizada. Backend debe mapear choiceId a intención, construir identidad, autorizar y confirmar transacción; cliente no provee resultado. La revisión consecutiva es hipótesis del contrato actual, no acordada. Sin garantías de semántica narrativa ni ACL HTTP por validación de estructura.

## Evidencia y criterios
Node v22.16.0, entorno Linux aislado. El checkout por git falló por DNS (github.com no resolvía); se ejecutaron copias textuales de archivos obtenidos por conector, con git hash-object idéntico a blobs remotos:
- book-campaign-session.mjs d246b7b7391cac7a454b7aa2989dac76893a82a4
- confirmed-narration.mjs 36408221fcedd0ab67aef21eb94a96dccfe5e4c4
- check-contract.mjs a532f3e73d2309774b5195a497739597e46871e9
- test-book-campaign-session.mjs 8e9ddf4e325244101de3b791ac2377e4f4757109
Comando desde vault-site: node --test simulation/test-book-campaign-session.mjs.
Primera corrida FAIL 1/4: fixture extranjero inconsistente era rechazado antes por scope interno; ajustado para comprobar rechazo de edición extranjera internamente válida (0899abe). Segunda corrida PASS 4/4, FAIL 0, SKIP 0 de esa suite aislada: check único, privacidad de forma, elección ilegal, retry idempotente del cliente, preparación faltante, scope/revisión y concurrencia/reanudación sintética.
SKIP: test-approved-module-narration.mjs (incluye motor fixture real, falta checkout); suite completa, build/validate, navegador, PWA/Android físico, integración backend/fragmentos, recorrido app→libro→diálogo→encuentro, sincronización ficha/journal/mapa y persistencia real. No inferir aprobación de pruebas de otros commits. Las pruebas locales no certifican transacciones del servidor ni render DOM.

## Bloqueos y entrega SYS-09
SYS-05: interfaz de búsqueda por branchId/contexto/idioma/revisión y validación de hechos. SYS-06: transporte autorizado, respuesta atómica de edición + proyección de ficha/diario/mapa, errores y reanudación; commandId durable ante recarga requiere acuerdo. PR #6: reconciliar narrativa/reader y conservar navegación a última página (load actual vuelve a primera página), retornar a app y habilitar hoja/journal/mapa del estado común; no modificar archivos solapados sin acuerdo. No hay botón conectado a servicio real; no se certifica aceptación de SYS-07.
Siguiente: SYS-09 revisar candidato/PR de esta rama, acordar contratos, integrar con #6 tras revisión, ejecutar pruebas Node/navegador/Android y recorrido H01 sobre motor/backend reales. No merge ni deploy de producción. PR se abre como borrador para hacer explícito alcance incompleto.

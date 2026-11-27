# SYS-06 · Backend, transporte y persistencia
27/11/2026 · Agente SYS-06 · Estado: en curso / candidato parcial, no validado.
- Base acordada por solicitud: development, `ebe06f9f5aac2968b7f3f74b2f627ebe062faa92`.
- Rama: `feature/sys-06-backend-persistencia`. PR hacia development, entrega de revisión a SYS-09.
- Prioridad P0 · QA-03/08 · MOD-05/06.
## Fuentes revisadas y coordinación
Plan SYS-06, QA-03, QA-02, QA-07, campaign-state, firestore-campaign-store, pruebas QA-03, configuración Vercel y actividad individual de 25/27 noviembre (persistencia, ventana, capacidades, Services, portal, módulo y lector). PRs abiertos #2, #3, #5, #6, #7. No modificar contratos compartidos sin acuerdo. PR #5 es candidato, no equivale a integración aprobada. Las 7/7 y 108/108 del informe anterior son históricas, no resultados de esta rama.
## Entrega candidata
- simulation/campaign-http.mjs: frontera Fetch API no montada. Verificación de token inyectada (revocación), lookup de grant server-side, ámbito player y campos estrictos. No acepta actor, rol, seed, resultados, hashes o definiciones del cliente. Respuestas sin caché, errores estables. Sin fallback a confirmCommand para no resolver de nuevo. El puerto confirmPrepared es obligatorio; sin él responde 503.
- simulation/private-preparation-store.mjs: repositorio privado versionado por campaña/kind/key/version (edition/branch/fragment), transacción create inmutable, hash y límite de tamaño. Admin app/SDK inyectados; sólo staging explícito con proyecto aislado autorizado. El scope worker procede de autoridad privada, nunca de HTTP de jugador. No instalar SDK ni conectar credenciales de producción.
- simulation/test-sys06-transport.mjs: pruebas sintéticas de frontera y repositorio con falso SDK, no emulador.
No se tocan campaign-state, firestore-campaign-store, motor, reglas, UI ni gateway de diagnóstico.
## Contrato propuesto a SYS-01/04/05/07 (pendiente acuerdo)
GET /api/campaigns/campaign-a -> playerState confirmado, revisión y journal. GET /api/campaigns/campaign-a/options -> {campaignId,actorId,revision,actions}. POST /api/campaigns/campaign-a/start sin body, asignación previa en servidor, inicio idempotente requerido al implementar puerto. POST /api/campaigns/campaign-a/commands con Authorization: Bearer <token>, JSON {"commandId":"cmd-1","expectedRevision":0,"action":"module-intent","intentId":"talk"}; respuesta 200 {"duplicate":false,"receipt":{"commandId":"cmd-1","revision":1,"event":{...}},"view":{...}}. Acciones existentes consume-ration, travel/targetId, duel/encounterId, module-intent/intentId. 400 INVALID_COMMAND; 401 UNAUTHENTICATED; 404 NOT_FOUND (incluye falta de autorización); 409 REVISION_CONFLICT/COMMAND_ID_REUSED; 422 ACTION_NOT_ALLOWED; 503 PREPARATION_UNAVAILABLE. Puerto debe traducir errores a esos códigos y preservar recibos. No enviar payload privado. El allowlist superior no sustituye revisión semántica de los campos anidados de playerState.
## Criterios y bloqueos
- SYS-04: acordar transición preparada atómica y compatible con estado/recibo. El almacén QA-03 actual usa confirmCommand que vuelve a resolver determinísticamente; no certificarlo como confirmación sin nueva tirada. CAS, recuperación de respuesta y replay deben verificarse con el puerto real.
- SYS-01/02: versión de reglas, contrato de estado y RNG. SYS-05: metadata/validación de fragmentos, acceso privado y selección aprobada. SYS-07: acordar proyección y gateway sin exposición de futuro.
- No hay autorización/credenciales de staging, identidad real ni SDK instalado en esta entrega; no escribir en nube. Falta adapter Admin de estado/recibos, ACL/IAM, worker autenticado, inicio desde edición aprobada, aplicación Ripple sólo confirmada y gateway real. No montar rutas públicas hasta completar. No declarar QA-03/08, MOD ni H01 cerrados.
## Evidencia / pruebas
Ejecutar desde vault-site: `node --test simulation/test-sys06-transport.mjs`; `node --test simulation/test-*.mjs`; emulador aislado según /docs/campaign-persistence-qa03.md. En esta entrega: SKIP (no ejecución comprobada de Node/CI/emulador/staging al registrar). No convertir pruebas redactadas en PASS. SYS-09 debe revisar integración, concurrencia, reinicio, aislamiento y datos privados en respuestas/errores.
No despliegue ni merge autorizado. Siguiente: acuerdo de puertos con SYS-04/05/07 y habilitación explícita de staging; validar los tests y revisar PR.

## Handoff SYS-09 · PR #11
[PR #11 (borrador)](https://github.com/sebasu66/pocketDM/pull/11), commit inicial 28ae4e41894246f71631ef017b0441a30ed91a62. Se añade verificación de commandId del recibo y prueba de errores inesperados. Intento de acceso Git desde contenedor: FAIL de infraestructura (DNS de github.com no resolvió); pruebas Node del repositorio, emulador y staging: SKIP. No se confirmó ejecución CI asociada al commit inicial. No hay aprobación ni integración final; evidencia queda en este PR para revisión independiente.

## Validación posterior · 27/11/2026 13:03 ART
Se recuperó acceso operativo a Git y Node mediante el equipo autorizado SEBASU (Windows), con clon temporal independiente del SHA `12ee28ae909a4a4f4a3dafa93796a0b7eab61699`; no se alteró el checkout de otros agentes. Este resultado reemplaza el SKIP anterior para las pruebas locales y de emulador.

| Verificación | Resultado |
|---|---|
| Git ls-remote y clon de rama | PASS |
| node --test simulation/test-sys06-transport.mjs | PASS 5/5, 0 fallos, 0 omitidas |
| node --test simulation/test-*.mjs sin emulador | PASS 109, FAIL 0, SKIP 8 (117 total) |
| firebase emulators:exec --only firestore --project demo-pocketdm-qa03 --config firebase.qa03.json 'node --test simulation/test-*.mjs' | PASS 117/117, FAIL 0, SKIP 0, exit 0 |
| Staging real, identidad real y Admin SDK de campaña | SKIP, sin autorización/configuración |

Entorno: Git 2.51.1.windows.1; Node 24.14.1; Firebase CLI 15.27.0; Java JBR 21.0.8; Firestore emulator 1.22.0. Puerto local 18083, proyecto demo aislado. El emulador se detuvo al finalizar. Las pruebas de recuperación, concurrencia distinta/idéntica, pérdida de respuesta, aislamiento, denegación directa y recuperación de módulo aprobaron. El repositorio privado nuevo se prueba con SDK falso; no equivale a integración Admin SDK en nube. Sigue pendiente confirmPrepared atómico sobre ramas reales SYS-04 y el gateway autenticado. No cerrar H01 ni promover el PR aún.

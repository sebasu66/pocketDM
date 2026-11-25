# QA-03: persistencia transaccional de campaña (Firestore emulado)
25/11/2026 · Simulación. Candidato parcial, pendiente de validador. No despliega ni escribe en Firestore de producción.

## Implementación
simulation/firestore-campaign-store.mjs es un adaptador server-only para el emulador Firestore de la suite Firebase. Rechaza hosts no locales y proyectos distintos de demo-pocketdm-qa03. Conserva snapshot inmutable, overlay/estado confirmado, semilla privada, diario y recibos en un documento de campaña. Reconstruye y valida identidad del snapshot al recuperar.
- La creación exige precondición exists:false, no sobrescribe campañas.
- Confirmación: lee revisión y updateTime, verifica propietario/actor, resuelve con confirmCommand, y usa commit de Firestore con precondición currentDocument.updateTime. Estado, diario y recibo se escriben en la misma operación atómica. Si otro cliente ganó la carrera, se relee: comando distinto con revisión obsoleta se rechaza, el mismo commandId devuelve recibo. Reintentos de conflicto acotados.
- El servidor debe construir principal {uid,campaignId,actorId,role} tras autenticación; no es un token ni se acepta directamente de HTTP. Solo el worker recibe preview privado. El método confirm retorna vista pública y recibo sin fingerprint ni semilla. Reglas aisladas de prueba niegan toda lectura y escritura directa desde cliente.
- Un documento por campaña es una simplificación del hito; límite preventivo 950000 bytes de campos serializados. No es un diseño definitivo para historiales largos. Antes de producción separar snapshots inmutables, comandos/eventos y checkpoints, definir retención y política de reintentos/transacciones. No usar Bearer owner fuera del emulador; falta adaptador Admin SDK, verificación de identidad y reglas/IAM del entorno real.

## Evidencia reproducible
Windows, Node 24.14.1, Java 21.0.8 (Android Studio JBR), Firebase CLI 15.27.0, Firestore emulator 1.22.0, proyecto demo-pocketdm-qa03, puerto 18083. Desde vault-site:
1. firebase emulators:start --only firestore --project demo-pocketdm-qa03 --config firebase.qa03.json
2. FIRESTORE_EMULATOR_HOST=127.0.0.1:18083 node --test simulation/test-firestore-campaign-store.mjs
3. Con esa variable, node --test simulation/test-*.mjs
En PowerShell asignar $env:FIRESTORE_EMULATOR_HOST='127.0.0.1:18083'. Sin variable, 6 pruebas de integración se omiten explícitamente (no cuentan como aprobadas). No enviar registros/semillas de test a Hosting.

7/7 pruebas QA-03 aprobadas: entorno local obligatorio; reanudación desde proceso Node independiente con ubicación, inventario, diario y opciones idénticos; concurrencia de comandos distintos y del mismo ID; fallo antes de commit y pérdida de respuesta después de commit; preview/duelo y aislamiento por propietario/campaña; denegación directa por reglas. Suite completa con emulador: 96/96. No prueba reinicio del servidor sin exportación, datos de campaña real, autenticación HTTP, Firestore de nube ni integración con lector. QA-03 pendiente de revisión y prueba en entorno de backend aprobado; QA-08 parcial.

## Siguiente
Contrato QA-02 con narrador (evento confirmado, proyección, opciones); integrar módulo original y compilador sin copiar estado legacy. El validador debe revisar el PR #5 y los resultados del emulador antes de promover. No cerrar H01 ni cambiar live.

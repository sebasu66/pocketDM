# SYS-04 · Compilador de ramas

27/11/2026 · Agente SYS-04 · Estado: en curso.

- Base: development @ `ebe06f9f5aac2968b7f3f74b2f627ebe062faa92`.
- Rama: `feature/sys-04-compilador-ramas`. PR pendiente.
- Plan: `/dm/sistema/#sys-04`; MOD-01/02/03/04, QA-07.
- Dependencias: SYS-01 reglas, SYS-02 azar, SYS-03 contexto, SYS-08 bindings autorizados; coordinación de confirmación con SYS-06 y slots con SYS-05.
- Zona: `simulation/adventure-compiler.mjs`, módulos de compilación y tests propios. No editar motor compartido, canon, persistencia ni libro unilateralmente.
- Auditoría inicial: el piloto vuelve a resolver al confirmar; `module-runtime` solo acepta fixture y `campaign-state` tiene ventana anticipada, no compilación finita publicada.
- Actividad: PRs activos de cola narrativa, checks pregenerados y candidato H01; pendiente inspección de registro generado (ausente en Git de development).
- Pruebas: pendientes (SKIP, no PASS).
- Próximo paso: conservar transición preparada, preparar contrato y pruebas sintéticas. No certificar módulo real ni H01.

## 27/11/2026 · Entrega parcial en revisión (bloqueada para integración real)
- Base confirmada: `ebe06f9f5aac2968b7f3f74b2f627ebe062faa92`. PR destino development, borrador deliberado. SYS-09 coordina en PR #8.
- Actividad reciente contrastada en PRs activos: #5 candidato H01, #7 registro de ramas narrativas, #8 coordinación, #9 reglas, #10 contexto. El índice de actividad generado no está versionado en esta base; /actividad/ y /data/activity.json no fueron accesibles desde el navegador de consulta. No afirmar revisión completa del índice.
- `simulation/adventure-compiler.mjs`: conserva estado y evento preparados en cada transición, branchId estable y hash de integridad; confirmChoice ya no ejecuta resolve. Distingue finales significativos de unresolved (fixture).
- `simulation/bound-adventure-compiler.mjs`: contrato provisional privado para bindings de worker, no otro motor. Enumera decisiones ligadas a intentIds; prepara evento, checks, hechos, contexto, estado antes (huella) y después (snapshot), branchId y slot narrativo. Rechaza referencias rotas, decisiones duplicadas, dead ends, finales inválidos/inaccesibles y límites de profundidad/aristas. No deduplica rutas sin demostrar equivalencia exacta. Confirmación selecciona resultado preparado, valida revisión, integridad, idempotencia local. Proyección mínima de elecciones; no entrega árbol, estado privado, contexto ni jobs. publicationReady=false siempre; admite únicamente mechanical-fixture, sin canon.
- `simulation/test-bound-adventure-compiler.mjs`: 4 tests de Node escritos (rutas, replay, cobertura negativa, adulteración y regresión piloto). No ejecutados en entorno Node con dependencias.
- `updates/coordinacion/sys-04-compilador-20261127.json`: actividad propia, no tocar índice generado.
- PASS: lectura plan y auditoría de contratos, rama propia y commits. PASS parcial: 17 aserciones sintéticas ejecutadas en V8 sobre fuente recuperada del branch (blob 9dd6d3cc916424a2235b9bcae8d053c855f58635), imports sustituidos por hash simulado, clon JSON y validador que rechaza checks no vacíos. Dos rutas, confirmación sin reejecutar preparador, idempotencia, revisión, privacidad de marcador, límite, referencias, finales y adulteración. No acredita SHA-256 real, checks reales, regresiones del piloto ni suite Node.
- FAIL entorno: git ls-remote no resuelve github.com; equipo remoto offline. SKIP: `cd vault-site && node --test simulation/test-bound-adventure-compiler.mjs simulation/test-adventure-compiler.mjs`; `node --test simulation/test-*.mjs`; `node scripts/build-activity.mjs && node scripts/validate.mjs`. Sin CI certificada.
- Bloqueos: integrar SYS-01/02/03 con module-runtime/campaign-state y bindings privados aprobados SYS-08. La interfaz existente previewCommand devuelve estado especulativo y confirmCommand vuelve a resolver: acordar con SYS-06 el consumo transaccional del snapshot y recibo confirmado, ACL, revisión de mundo, proyección y efectos Ripple. SYS-05 debe revisar slots/contexto y validar cobertura editorial; la proyección mínima no es contrato final del libro. No cambiar archivos ajenos sin acuerdo. El manifest privado es serializable para servidor; no exponerlo al navegador. No certificar equivalencia semántica, cierre real, publicación ni H01.
- Próximo paso: SYS-09 revisar PR y ejecutar suite completa; revisar acuerdos SYS-01/02/03/05/06/08, adaptar el módulo real autorizado y certificar sin truncamiento ni tiradas al confirmar. No merge ni despliegue.

## PR y entrega
PR de borrador [#12](https://github.com/sebasu66/pocketDM/pull/12) abierto hacia development, cinco archivos propios. Evidencia a SYS-09 vía conversación del PR #8. Estado: en revisión parcial, integración bloqueada. No merge ni despliegue.

## 27/11/2026 · Validación real y coordinación
- Equipo autorizado Windows, Node 24.14.1, Git 2.51.1; checkout temporal independiente del SHA `179c642ce975d9805cf8f5748aca0f6adbef2803`. Se supera el bloqueo de acceso anterior.
- PASS 15/15 tests propios y piloto: `node --test simulation/test-bound-adventure-compiler.mjs simulation/test-adventure-compiler.mjs` (exit 0).
- PASS suite Node sin emulador: 108 PASS/0 FAIL/8 SKIP, 116 total, exit 0.
- PASS suite completa con Firestore local: `firebase emulators:exec --only firestore --project demo-pocketdm-qa03 --config firebase.qa03.json 'node --test simulation/test-*.mjs'`, Java JBR de Android Studio, puerto 18083, 116 PASS/0 FAIL/0 SKIP, exit 0; emulador detenido. Estos tests de persistencia existentes NO acreditan confirmPrepared transaccional de SYS-04.
- PASS `node scripts/build-activity.mjs` y `node scripts/validate.mjs`: 108 entradas, 42 nodos, 146 relaciones, integridad y componentes OK.
- Revisión privada SYS-08 v0.1 autorizada por usuario: preflight ejecutado sobre JSON original sin copiarlo a Git ni máquina remota. 14 páginas, 21 intenciones, 0 referencias de destino o ruta rotas. 21 intenciones bloqueadas hasta aprobación, 8 páginas sin ubicación, 4 conflictos de actores, 5 actores sin ID candidato, 3 habilidades sin ID, 2 encuentros sin plantilla, 3 finales sin aprobación. Estado proposal / canonGate user-approval-required / realModeSupported false / publicationReady false. Resultado: PASS estructural, compilación mecánica real BLOQUEADA (0 intenciones autorizadas); no sustituir con fixture. No publicar contenidos privados.
- SYS-06: [propuesta transaccional enviada al PR #11](https://github.com/sebasu66/pocketDM/pull/11#issuecomment-7225000313). CAS revisión/nodo, recibo idempotente antes de CAS, lectura de rama inmutable y comprobación de scope/integridad, snapshot posterior + recibo + puntero atómicos, sin resolve/RNG; proyección autorizada y fragmento fijado. Revisado campaign-http y private-preparation-store; puerto confirmPrepared aún no implementado. Espera ratificación de SYS-06; no editar campaign-state ni store ajeno.
- SYS-05/02: [respuesta de coordinación](https://github.com/sebasu66/pocketDM/pull/12#issuecomment-7225000856). Jobs 1:1, proyección explícita de audiencia, slots por índice del check, referencia inmutable de fragmento y RNG versionado sólo en preparación.
- Decisión: mantener PR #12 draft y no promover a modo real sin canon y bindings. No merge ni despliegue. SYS-09 debe revisar la combinación de PRs y repetir suite del candidato integrado.

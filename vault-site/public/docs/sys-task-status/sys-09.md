# SYS-09 · Validación cruzada y coordinación
27/11/2026 · Agente: SYS-09 (validador independiente) · P0 · Estado: en curso; ejecución integral bloqueada.
Base fijada: development @ ebe06f9f5aac2968b7f3f74b2f627ebe062faa92. Rama: feature/sys-09-validacion-coordinacion. PR: consultar [comparación con development](https://github.com/sebasu66/pocketDM/compare/development...feature/sys-09-validacion-coordinacion); PR de arranque en borrador, no aprobación de H01.

## Alcance y fuentes revisadas
- [Plan SYS-09](https://github.com/sebasu66/pocketDM/blob/ebe06f9f5aac2968b7f3f74b2f627ebe062faa92/vault-site/public/dm/sistema/index.html#L45), [H01 y QA-01–10](/docs/qa-playable-stormkeep.md), [compilador](/docs/finite-adventure-compiler.md), [contrato narrativo](/docs/narrative-contract-qa02.md), [módulo seleccionado](/docs/stormkeep-module-01-reference.md), COORDINACION.md, scripts de actividad/validación/build y metadatos GitHub.
- Actividad: se leyó el visor y su contrato de generación desde updates/. El índice generado no existe en el SHA base (API 404) y no pudo recuperarse por web; no se afirma haber leído toda la actividad publicada. Se contrastaron el commit del tablero, PR históricos y últimos commits del repositorio. Los commits recientes de Services (dffbd96, 3bf54aa, d1f7fac) son candidatos de otro frente, no evidencia de esta base.
- Se comprobó que campaign-state, firestore-campaign-store, adventure-compiler y narrative-projection existen en base; master-rules.mjs no se recuperó en base (404), sí consta en el candidato de reglas según el plan y la comparación. La mera existencia no demuestra funcionamiento.
- PR #1 y #4 constan fusionados; #2, #3, #5, #6 y #7 abiertos en sus bases históricas, no son entregas SYS sobre development. PR #5 (head b512e0385def9e782acf49ecb148bd188da238c8) apunta a feature/qa-playable-stormkeep-20261125. Comparación development-base vs candidato: diverged, 7 ahead / 91 behind; 31 archivos reportados, entre ellos campaign-state, firestore-campaign-store, module-runtime, reglas y laboratorio. No fusionar en bloque. La cifra histórica 108/108 del cuerpo de PR #5 corresponde a 65ab268, no al head actual ni al SHA base de SYS-09. PR #6 y #7 son antecedentes de chequeos y registro de ramas, no cierres.
- En la consulta inicial no se encontraron PRs con base development ni informes SYS-01–08 en el SHA base (404 para cada ruta); la búsqueda de ramas feature/sys devolvió solo SYS-09 en la página consultada. Esto no equivale a inactividad de los agentes. Reconsultar antes de revisión.

## Matriz de coordinación / puertas de integración
| SYS | Entrega necesaria y propietario | Dependencia / prueba de aceptación | Estado de evidencia al arranque |
|---|---|---|---|
| 01 | API de reglas, laboratorio | 15 operaciones, entradas inválidas, 1v1/grupo, heridas/retirada; coordinar estado con 06, RNG con 02 | Pendiente de PR; SKIP |
| 02 | RNG común server-only | Vectores fijos, direcciones/versión/caras, replay, privacidad; acordar 01/04 | Pendiente de PR; SKIP |
| 03 | Contexto y reacción NPC | Guardias con percepciones distintas, conversación sin dado, pruebas pertinentes, trazabilidad y canon | Pendiente de PR; SKIP |
| 04 | Compilador y bindings | Tras 01/02/03/08; dos rutas, cobertura, finales, replay preparado sin nueva tirada | Pendiente de PR; SKIP |
| 05 | Narración previa y repositorio | Tras 03/04/06; aprobación, hash contexto, invalidación, faltantes bloquean publicación, sin LLM en partida | Pendiente de PR; SKIP |
| 06 | Backend y persistencia | Contratos 01/04/05/07; identidad server-side, CAS, idempotencia, aislamiento, emulador y staging | Pendiente de PR; SKIP |
| 07 | Libro/proyección | Tras 05/06; lector único, chequeos únicos, hoja/diario/mapa, reanudación y móvil | Pendiente de PR; SKIP |
| 08 | Módulo 01 autorizado | Canon y fuente privada; reconciliación de IDs, rutas/cierres, bindings privados a 04/05 | Pendiente de PR; SKIP |
| 09 | Validación y coordinación | Cierre tras 01–08, QA-05/08/09/10 y H01 real | En curso; no validado |

Orden: 01/02/03 y acuerdos 06/08 en paralelo; 04/05/07 solo fixtures explícitos mientras esperan contratos; integrar reglas/azar/contexto, bindings/compilador, narración/persistencia, libro y finalmente H01. No editar contratos compartidos unilateralmente; 01/06 coordinan campaign-state, 04/06 confirmación, 05/07 envelope de narración, 06/07 transporte. SYS-09 revisa diffs por propiedad antes de aceptar.

## Resultados observados (no extrapolar)
| Caso | Resultado | Evidencia y límite |
|---|---|---|
| Identidad de base y rama aislada | PASS | GitHub compare development...development; create_branch fijado al SHA completo |
| Inventario de PRs históricos y comparación de candidato | PASS | API GitHub: PR #5 y compare SHA; divergencia, no validación mecánica |
| Inventario de los informes SYS-01–08 en base | PASS (inventario) | Ocho 404; faltantes, no resultado de ejecución de agentes |
| Acceso al índice de actividad publicado | FAIL (acceso) | 404 del índice generado en GitHub; web no recuperó /data/activity.json; revisión parcial |
| Obtención del repositorio para ejecución | FAIL (entorno) | git ls-remote a GitHub: Could not resolve host; dispositivo Desktop Commander offline |
| Estado de CI base/candidato | SKIP (suite) | API de runs PR devolvió listas vacías para ambos SHA; Vercel status success en base, no test suite |
| Suite Node / regresiones reglas / catálogo / actividad / PWA | SKIP | No checkout ejecutable; Node local v22.16.0, Java 21.0.12.1, Firebase CLI no encontrada; no versiones del motor certificadas |
| Persistencia real / emulador | SKIP | Sin checkout/emulador autorizado |
| QA-05 Azgaar | SKIP | Fallo histórico viewBox Región documentado; no se reejecutó. Atlas alternativo permitido si cumple persistencia |
| QA-08 privacidad, transporte, caché y hosting | SKIP | Contrato revisado, no prueba dinámica ni auditoría completa de artefactos |
| QA-09 Android físico | SKIP | Sin dispositivo físico disponible ni capturas; emulación no sustituye |
| QA-10 preview y rollback | SKIP | build-portable-pwa.mjs solo permite refs enumerados; la nueva rama SYS no está incluida. Coordinar excepción de preview sin ampliar producción. No cambiar el build compartido unilateralmente |
| H01 E2E real | SKIP | Dependencias 01–08 y canon/edición aprobada pendientes |

### Reproducción requerida (entorno autorizado, no ejecutada)
Desde checkout aislado de SHA de integración y directorio vault-site:
```sh
git rev-parse HEAD
node --version
java -version
firebase --version
node scripts/build-activity.mjs
node scripts/validate.mjs
node --test simulation/test-*.mjs
node scripts/build-portable-pwa.mjs
```
Revisar scripts de navegador presentes antes de ejecutarlos: test-narrative-browser.mjs, test-checks-browser.mjs, test-edition-browser.mjs y test-azgaar-view-browser.mjs (según contratos históricos). Verificar URL y SHA de preview autorizado; si falta rama permitida, coordinar con infraestructura. Para persistencia, ejecutar emulador de prueba según configuración y contrato de SYS-06 (antecedente QA-03: demo-pocketdm-qa03, puerto 18083) y repetir suite con FIRESTORE_EMULATOR_HOST. Reportar PASSED/FAILED/SKIPPED y salida; ningún skip es aprobado. Registrar versiones y entorno reales; logs/capturas solo datos sintéticos o autorizados, nunca secretos. No ejecutar deploy live.

### Aceptación H01 (todos pendientes, SKIP)
- Inicio desde app; crear/recuperar ficha efectiva única; Stormkeep con mapa persistente y NPC del grafo.
- Aceptar módulo 01 aprobado; opciones legales y fragmentos preaprobados por rama, diálogo diferenciado según contexto, no improvisar prosa al jugar.
- Elección confirma una sola transición preparada, encuentro real emite checks únicos e historia fiel, hoja y diario actualizados.
- Ripple solo sobre evento confirmado; cambios y conocimiento autorizados; cierre/reapertura mantiene revisión, ficha, posición, diario y opciones.
- Rutas reales de éxito y fracaso; abandono/muerte cuando aplican por reglas y canon; no declarar truncamientos como finales.
- Negativos: acción/revisión inválida, comando repetido y comando distinto concurrente, acceso cruzado, rol forjado, rama/semilla/futuro/agenda privada en HTTP/archivos/cache/URL, prosa no aprobada, check duplicado y referencia rota.
- Escritorio/apaisado y Android físico cuando disponible: navegación, táctil, rotación, legibilidad, scroll, retorno y posición, movimiento reducido.
- Evidencia por caso: ID, SHA integración, entorno/URL, versiones módulo/reglas, pasos, esperado/observado, PASS/FAIL/SKIP, log/captura saneada, dueño y revisor. Sin evidencia real no cerrar H01.

## Entregables y siguiente paso
Informe SYS-09, enlace y estado de tablero en zona propia, registro individual de actividad (no editar historial ni índice generado). PR en borrador hacia development; auto-preview no solicitado, producción prohibida. Entrega a SYS-09 por este informe; cada agente remitirá PR/SHA base y head, archivos, contratos versionados, comandos, logs saneados y bloqueos, declarando si utilizó fixture. No fusionar PRs ajenos. Actualizar matriz al recibir evidencia, repetir pruebas sobre SHA integrado y solicitar autorización antes de cualquier promoción. Este arranque no es certificación ni cierre.

# SYS-09 · Validación cruzada y coordinación
27/11/2026 · Agente: SYS-09 (validador independiente) · P0 · Estado: en curso; ejecución integral bloqueada.
Base fijada: development @ ebe06f9f5aac2968b7f3f74b2f627ebe062faa92. Rama: feature/sys-09-validacion-coordinacion. PR: [#8 hacia development](https://github.com/sebasu66/pocketDM/pull/8), abierto en borrador; no aprobación de H01.

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

## 27/11/2026 — toma de coordinación e integración (SYS-01 a SYS-08)

El titular delegó la continuación de los ocho frentes a SYS-09. Se trabajó en un clon temporal aislado de SEBASU, sin cambiar ramas de los agentes ni development. PR consolidado [#18](https://github.com/sebasu66/pocketDM/pull/18), rama feature/sys-integration-20261127, base c3b21f6024c899ca1c45934b75a7665a31757eb9. Borrador, no promoción. Los PR originales permanecen abiertos para trazabilidad. Se incorporó el informe de #8 y su actividad individual, no su versión antigua del tablero (preservar SYS-10).

### Revisiones incorporadas

| Frente | PR | Head fijado |
|---|---:|---|
| SYS-01 | 9 | e5831cb19ea9b720aeb55292505ec65aef047783 |
| SYS-02 | 14 | 2f24dde1a0cf6584a0b6c590b97ed2cae15237d9 |
| SYS-03 | 10 | 9442c4b8c239451e1996ed2442f662e83eac7f6e |
| SYS-04 | 12 | 0bf52ca7423c38c6ccf855563b11c867dbceaf86 |
| SYS-05 | 13 | fd4c6eeb5656b0c24876ba15b723be8f51b28737 |
| SYS-06 | 11 | e7e734f4b0e592f5bec2324db1f73a1ecb601247 |
| SYS-07 | 15 | 1108f870945cf2a721fb2ec62cf9ea634550610e |
| SYS-08 | 17 | 84e641b21cd7672a31d6aab96f714b643605aca5 |

Ocho merges locales sin conflictos, SHA combinado c4476d80ea8f0215b844369ad0f0674628756f9a. Correcciones de integración 517171c20c2ed05bf0647cdc7789a7b8eebb5f47 y 330859ededbe1231b59e41146793d34a14076ca4. No se afirma que cambios posteriores de los agentes estén incluidos.

| Frente | Cambio y evidencia | Estado |
|---|---|---|
| SYS-01 | Encuentros grupales, acciones legales, heridas, muerte, replay y persistencia de transición privada preparada. Se activó test previamente omitido. | PASS integrado sintético |
| SYS-02 | Proveedor común de azar, versiones históricas preservadas, dirección semántica explícita en master API nueva; prueba con motor real. | PASS integrado sintético |
| SYS-03 | Chequeos sociales opuestos con API real de reglas y RNG, rutina sin tiradas, sin consentimiento automático. | PASS integrado sintético |
| SYS-04 | Compilación finita, elecciones preparadas y consumo del snapshot sin resolver otra vez en el recorrido de prueba. | PASS fixture; edición real pendiente |
| SYS-05 | Manifiesto único, slots canónicos, contexto visible explícito, fragmento inmutable referenciado y validación de aprobación. Sin generación en juego. | PASS fixture; narración real no aprobada |
| SYS-06 | Persistencia emulada, CAS, concurrencia, reintento, mismo recibo, reapertura y proyección; HTTP de prueba con identidad y grant inyectados. | PASS fixture; identidad y servicio real pendientes |
| SYS-07 | Libro existente muestra último folio, ficha efectiva, diario y lugares/rutas visibles desde una sola revisión; proyección estricta, rechaza campos privados y revisión ajena. | PASS navegador de prueba; atlas completo pendiente |
| SYS-08 | Manifiesto privado v0.1 revisado como propuesta; no publicar ni convertir a fixture real. Conservada entrega estructural de 14 páginas y 21 intenciones. | BLOQUEADO por canon, bindings y bestiario |

### Matriz de ejecución

Entorno Windows autorizado, Node 24.14.1, Git 2.51.1, Firebase CLI 15.27.0, JBR Java 21.0.8; Firestore Emulator, proyecto exclusivamente local demo-pocketdm-qa03. Config temporal con puertos libres en loopback para evitar colisiones; emulador detenido al finalizar. Ejecutar desde vault-site con JDK 21 y firebase.qa03.json (o copia de config con puertos locales libres) mediante firebase emulators:exec --only firestore --project demo-pocketdm-qa03 --config firebase.qa03.json "node --test simulation/test-*.mjs scripts/test-sys05-cross-agent.mjs".

| Evidencia | SHA/entorno | Resultado |
|---|---|---|
| Suite inicial combinada con emulador | c4476d80 | 164 PASS / 1 SKIP (grupal) / 0 FAIL |
| Suite final, incluidos tests de proyección privada y revisión | 330859e | 168 PASS / 0 FAIL / 0 SKIP, exit 0 |
| scripts/test-narrative-browser.mjs | integración, Edge headless | PASS: 3 checks únicos, tirada exacta |
| scripts/test-sys09-book-browser.mjs | 330859e, Edge headless | PASS: último folio, ficha, diario, mapa conocido y revisión común |
| scripts/test-edition-browser.mjs | 330859e, Edge headless | PASS 6 tamaños de viewport, entrada desde home |
| scripts/test-checks-browser.mjs | integración y base c3b21f6 | FAIL idéntico en línea 9: espera dos páginas en una ruta que ahora muestra una; no se rebajó el test para ocultarlo |
| scripts/test-azgaar-view-browser.mjs | 330859e | FAIL: el viewBox no cambia como se espera al cambiar vista; problema histórico de QA-05 no cerrado |
| scripts/build-activity.mjs y scripts/validate.mjs | 330859e | PASS: 116 entregas, 42 nodos, 146 relaciones, 10 áreas |
| H01 real, servicios de nube/autenticación real, Android físico, rollback y preview | no autorizado/no disponible | SKIP / pendiente |

### Decisiones y límites

Se conservaron las versiones RNG y acciones de duelo antiguas; el nuevo combate grupal exige una transición preparada de autoridad privada. No se permite semilla del jugador. Se eligió un único adaptador narrativo para persistencia de fragmentos y una proyección atómica para las vistas del lector (lista de lugares/rutas reales visibles, sin inventar coordenadas ni declarar el atlas Azgaar aprobado). El adaptador de ejecución y sus identidades/revisores son de fixture; no se activó publicación real. No se ha validado H01. El manifiesto privado de SYS-08 exige aprobación de canon; no se copió a Git ni se divulgaron datos privados. Faltan decisiones de roles/identidades, portada, localizaciones, costes/tiempos/recompensas, habilidades, criaturas y cierres; SYS-10 debe aportar perfiles trazables. PR #16 de auditoría de fuentes no se fusionó (fuera del alcance 01–08 y no es un bestiario completo). No inventar estadísticas ni aprobar canon unilateralmente.

El PR #18 es el punto de revisión consolidado; no fusionar los ocho por separado. Los cambios de infraestructura o publicación requieren autorización. Los fallos de navegador históricos siguen visibles y no cuentan como PASS; se requiere verificación en staging real y Android físico, además del recorrido real con Ripple y cierres válidos antes de aprobar.

### Miniaventura editorial solicitada por el titular — El farol del paso

En el mismo lector, enlace Ejemplos (`/libro/?view=examples`), accesible desde la navegación y biblioteca. Índice + 11 folios: portada, lugar, un diálogo con dos respuestas, exploración, dos chequeos narrativos (Percepción: éxito 28; Atletismo: fallo 63), decisión argumental/clímax, combate y tres resoluciones (éxito por combate, éxito por desvío y retirada). Se reutiliza renderBookFolio y el editor existente; la elección final navega al desenlace correcto y no permite continuar accidentalmente al siguiente final. El combate es proyección pública de fixture precalculado por el motor; tiene tres tiradas propias además de los dos chequeos narrativos de muestra. El índice permite inspección directa de cualquier página. No hay persistencia, API de campaña, generación en runtime ni aprobación de canon. Arte existente reutilizado. Pruebas `node scripts/test-book-examples-browser.mjs` PASS en 1280x900 y 844x390, todas las páginas y ramas, diálogo, chequeos y dados; `test-sys09-book-browser.mjs` y `test-narrative-browser.mjs` PASS; actividad/validate PASS. No se ha probado Android físico ni desplegado.

### Publicación y entrada oficial de la bóveda

El titular autorizó publicar la miniaventura por separado: commit f7987fc35dcf3e728e37095acddebeaa62992e3b en main; Vercel READY, dominio público comprobado, navegador PASS en 1280×900 y 844×390. No se publicó el motor candidato. La entrada oficial de documentación es https://pocketdm.vercel.app/dm/; el portal de Sistema incluye el tablero actualizado y referencias de los diez frentes.

### Revisión del lector móvil y componente editorial padre — 27/11/2026

Por indicación del titular, la PWA declara orientación portrait-primary. La escena activa conserva una sola superficie editorial compartida: la composición móvil crece según su contenido, y paneles, chequeos, combate y navegación se proyectan en slots del componente padre BookEditorialPage. El lector de campaña y la miniaventura reutilizan renderBookFolio y makeModuleLayout. Las transiciones de la miniaventura se resuelven por destino explícito; no por orden de folio. Los gestos de desplazamiento, teclas y controles de siguiente/anterior no cambian escenas de campaña o miniaventura. Los finales ofrecen reinicio explícito; los archivos de demostración y el atlas no son ramas de campaña. La portada oficial usa el mismo componente. Pruebas en escritorio, 844x390, 390x844 y 360x640; 30 párrafos largos, navegación por decisiones, 3 cierres y editor móvil con 25 párrafos: PASS. Android físico no verificado; la campaña real y el backend candidato siguen sin publicarse.

### Compositor editorial universal v0.1 — candidato independiente

Se construyó book-universal-page con contrato de plantilla, composición, contenido y catálogo; instrucciones raíz y por capa como metadatos de autoría, variantes de escritorio/móvil, imágenes superpuestas, símbolos, título gráfico, panel único de interacción y slots de mecánica. El laboratorio de autoría /dm/libro/universal/ reutiliza los 11 folios del farol. Pruebas de contrato y navegador (1280×900, 390×844 y 360×640): PASS. Sin migrar lector publicado, sin desplegar, sin ejecutar IA ni redactar todavía la skill. Referencia: /docs/editorial-universal-v01.md.

### Editor universal y cámara — continuación de PR #19

Modificada la misma entrada editorial Libro → UI; editor anterior preservado para diseños históricos. Capas, inspector contextual, dos previsualizaciones, revisiones locales inmutables y prompts. Cámara por imagen con dos encuadres, paneo/zoom, easing, duración, previsualización y arrastre del contenido, reutilizando el motor de cámara anterior. PASS contrato, navegador editor y regresión del lector/archivo. Pendiente sincronización compartida, subida de recursos, migración de diseños históricos y aprobación visual. No desplegado.

### Panel universal con historial y 9-slice

Candidato PR #19: pieles configurables 9-slice para marco y estados de opción; historial confirmado, resultados CSS/SVG y símbolo de habilidad antes de elegir (incluye celdas de grilla, fallback dado). Pruebas de contrato, 11 escenas en tres viewports, texto multilínea y 24 entradas desplazables, inspector y revisiones PASS. Pendientes grilla/arte definitivo, integración PWA y publicación autorizada.

### Biblioteca gráfica y tipos semánticos

PR #19 incorpora /dm/arte/#assets y navegación desde todo el portal, catálogo de 93 recursos existentes (38 NPC, 45 fondos/localizaciones, 10 otros), búsqueda, filtros y códigos categoría/nombre. Se preservan fuentes y aprobaciones históricas. Contrato de contentType/tags y referencias BKG/nombre, selector del editor integrado. Pruebas de catálogo, contrato y navegadores PASS. Subida privada candidata mediante Firebase; reglas propuestas, sin despliegue ni prueba autenticada en el bucket real. No hay grilla de símbolos ni red_sky verificados en el repo.

### Publicación autorizada de interfaz editorial

Se libera únicamente la UI universal, el laboratorio y catálogo estático; sin cambios en simulación ni reglas Firebase. El lector vigente se conserva. Subida compartida deshabilitada mientras se valida. Los tres nuevos PNG quedan pendientes de transferencia.

### Perfiles de pantalla y arte de usuario

Integración editorial: 129 recursos en catálogo, 24 iconos y seis barras grunge, tres estados de selección 9-slice, logo y cielos cuadrados. Editor con perfiles Fold cerrado/abierto, teléfonos y desktop hasta ultrawide/4K, tirador de capas libres y siluetas de autoría. Contrato y pruebas de editor, biblioteca y once escenas en ocho viewports PASS. No se cambia simulación ni persistencia Firebase. Pendientes pruebas en hardware físico, cinco máscaras extra y sincronización compartida.

### Prueba del nuevo libro en PWA

Ruta /libro/prueba/ accesible desde inicio y navegación del libro. Miniaventura de muestra reutiliza el compositor universal y los nuevos recursos, sin modificar estado de campañas ni backend. Prueba de entrada, continuidad de diálogo al cambiar ancho y recargar, tres desenlaces y seis tamaños CSS PASS.

### Recuperación de acabado artístico del editor universal

Se recuperan formato tipográfico, papel coloreado, contorno y sombra, borde configurable y máscaras geométricas con quemado del laboratorio original. El fondo de título se elimina por defecto; se permite transparencia en cada capa y se amplían rangos de transformación. Se preservan los perfiles y los 129 recursos. Evidencia: prueba de contrato e inspector, pruebas de lector y laboratorio. Pendiente paridad de flujo alrededor de siluetas y máscaras adicionales.

### Registro del mundo en la bóveda

Sección /dm/mundo/#registros: 84 registros de autoría y pruebas, 192 relaciones, 55 fichas ilustradas, vínculos bidireccionales con la biblioteca y fuentes originales. Generador e índice JSON para agentes. Sin modificaciones del motor, sin publicación de dossiers privados, sin aprobación implícita del canon. Pruebas de integridad y navegador PASS.

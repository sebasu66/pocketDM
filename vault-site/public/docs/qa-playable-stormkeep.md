# QA: primer hito jugable de Stormkeep
25/11/2026. Backlog de aceptación aprobado por el usuario tras la auditoría. Estado inicial: pendiente; no implica que las tareas estén implementadas. Responsable por rol, no por cuenta de GitHub. Leer actividad y coordinar contratos antes de tocar archivos compartidos.

## Decisión de producto del 25/11/2026 — corte vertical en orden de juego

Esta decisión del usuario sustituye el orden de ejecución anterior, no sus criterios de seguridad ni las pruebas ya realizadas. H01 sigue abierto. El objetivo es una aventura RPG completa, visible y jugable en el libro existente desde el primer paso; no completar sistemas genéricos por separado.

- Stormkeep es el hogar estable: inicio, rumores, conversaciones, preparación y regreso. La primera expedición ocurre en un lugar vecino, materializado sólo hasta donde la aventura lo necesita. No se presupone un conflicto dentro de la ciudad.
- Tres personajes pregenerados con fichas, capacidades, personalidades y comportamientos por defecto definidos por narrativa y traducidos a números por simulación. Personalización limitada posterior; no creador libre ni catálogo exhaustivo en H01.
- Simular sólo situaciones relevantes para la aventura (hazañas, peligros, decisiones, progreso, consecuencias). Abstraer provisiones y necesidades ordinarias; activarlas cuando sean relevantes, sin calorías, resfriados ni economía/logística cotidiana. No ampliar custodia, transporte de mercancías u obligaciones salvo necesidad explícita de una escena aprobada.
- Preparar las rutas argumentales compatibles con los tres personajes y sus elecciones, con precondiciones, resultados mecánicos y desenlaces; compartir fragmentos y ramas compatibles. El DM mediante MCP compara estado y perfil real con la base y las variantes aprobadas; genera sólo diferencias necesarias. La caché compartida almacena posibilidades reutilizables versionadas y validadas, nunca el historial privado ni tiradas confirmadas de otro jugador.

### Secuencia prioritaria (cada fase visible en el mismo libro)

| Hito | Experiencia del jugador | Soporte técnico mínimo y criterio de salida |
| --- | --- | --- |
| VS-01 | Seleccionar personaje y abrir la aventura en Stormkeep | Tres fichas predefinidas, snapshot de campaña, localización inicial y primera página en lector canónico; seleccionar, guardar, reabrir, ver la misma ficha. QA-01/03/06/08. |
| VS-02 | Hablar con NPC, descubrir y elegir un encargo, prepararse | Sólo NPC, lugares, diálogo, información, equipo y compras relevantes de apertura. Opción legal resuelta en servidor y reflejada en libro, ficha y diario. QA-02/06/07. |
| VS-03 | Salir a la localización vecina | Ruta persistente, paso del tiempo abstracto, descubrimientos y peligros definidos para la expedición. No generar territorios innecesarios. QA-04/05/06/07. |
| VS-04 | Explorar y superar obstáculos, encuentros o combate | Chequeos Mythras, habilidades, magia si requerida, heridas y combate real con los 3–4 enemigos como máximo que exija la aventura (cantidad orientativa, no canon). Alternativas y resultados reales, sin imponer combate. QA-02/04/07. |
| VS-05 | Resolver la aventura y regresar | Desenlaces, consecuencias Ripple pertinentes, recompensas y progresión del personaje conforme a reglas aprobadas, persistencia del regreso. QA-02/03/07. |
| VS-06 | Rejugar y aprovechar variantes | Compilar las rutas alcanzables de los tres perfiles base, validar cada transición, replay y convergencia sólo con equivalencia de estado relevante; demostrar reutilización y generación incremental ante una variante. QA-02/07/08/10. |

La anticipación y el caché comienzan en VS-02 y se amplían con cada nueva escena, no se dejan para el final. QA-08/10 son transversales. Cada fase entrega una interacción de principio a fin en el libro, con pruebas y revisión del validador. El siguiente trabajo de simulación es VS-01, no ampliar las capacidades del cargamento. Reutilizar el motor y la persistencia existentes; adaptar al lector canónico sin mantener una copia divergente. Narrador define personajes, escenas y opciones; simulación asigna reglas, valida y confirma estado; validador revisa. El canon y la premisa MOD-01 siguen sujetos a aprobación; esta decisión no los aprueba ni elige automáticamente una historia de transporte.

Después de completar H01, ampliar catálogo de monstruos/NPC, reglas y mundo genéricos, creación de personajes y personalización avanzada según evidencia de juego. No declarar H01 cerrado sin ejecución real.


## Hito H01 — aventura completa en Stormkeep
El objetivo es una experiencia real de extremo a extremo, sin sustituir los componentes centrales por fixtures ni duplicar el lector. En un entorno de prueba autorizado, demostrar:

- [ ] Iniciar una campaña desde la aplicación.
- [ ] Crear o recuperar una ficha de personaje común.
- [ ] Llegar a Stormkeep y consultar su mapa persistente.
- [ ] Interactuar con un NPC perteneciente al grafo.
- [ ] Aceptar una aventura original aprobada.
- [ ] Preparar ramas y fragmentos narrativos.
- [ ] Resolver un encuentro con el simulador real.
- [ ] Mostrar resultados y chequeos en el libro ilustrado.
- [ ] Aplicar consecuencias mediante Ripple.
- [ ] Actualizar diario, personaje y estado del mundo.
- [ ] Cerrar y reabrir, recuperando el mismo estado.

Evidencia obligatoria: SHA, URL/entorno, versión de reglas y módulo, pruebas y logs reproducibles, capturas del lector, resultado y limitaciones. La semilla y datos privados no se publican. H01 no equivale a aprobación para producción. QA-05 y QA-09 pueden avanzar en paralelo; Azgaar no es dependencia obligatoria si el atlas alternativo cumple. QA-10 debe iniciarse desde el primer cambio.

## Orden de trabajo
1. QA-01, QA-04, QA-08 y contrato QA-02; QA-10 desde el inicio.
2. QA-06 con canon aprobado y QA-03 sobre modelo común.
3. QA-07 e integración QA-02 sobre datos reales; QA-05/09 en paralelo.
4. Prueba H01 con QA-03, QA-08 y QA-10, revisión cruzada y cierre únicamente con evidencia.

P0: crítico para integración; P1: alto; P2: validación y calidad. Las tareas amplían y vinculan ADV-C/N/MOD existentes: no reemplazan sus criterios ni autorizan alcance adicional.

## QA-01 — Ficha única y estado efectivo
- Prioridad: P0. Estado: pendiente.
- Responsable: Simulación. Área: World Engine / Grafo.
- Referencias: ADV-C02/C11; MOD-02.
- Dependencias: —.
- Entrega: Unificar actor, ficha, recursos, heridas, equipo y overlay; adaptador de lectura para el libro. Eliminar doble autoridad de datos, no duplicar fichas.
- **Criterio de aceptación:** Un mismo actorId y revisión alimentan laboratorio, motor, hoja y diario; cambio confirmado de HP/PA/inventario visible en los consumidores; prueba de aislamiento entre campañas y de rechazo de revisión obsoleta.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-02 — Integración de mundo, combate, compilador y narrador
- Prioridad: P0. Estado: pendiente.
- Responsable: Simulación + narrador/presentación. Área: Coordinación.
- Referencias: ADV-C12; N04/N06; MOD-03.
- Dependencias: QA-01, QA-04, QA-06; coordinación temprana con QA-07.
- Entrega: Definir contrato versionado de comandos, eventos confirmados, chequeos, cambios y proyección visible. Adaptador del lector existente; narrador sin autoridad mecánica. Integrar un encuentro real y sus consecuencias Ripple.
- **Criterio de aceptación:** Un encuentro Galahad/Zhalan vs lobos u otro equivalente aprobado emite eventos reales con IDs de chequeo, se presenta una sola vez en el libro, actualiza ficha/diario y consecuencias al confirmar; opciones ilegales rechazadas; sin fixture manual ni segundo lector.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-03 — Persistencia y confirmación transaccional
- Prioridad: P0. Estado: pendiente.
- Responsable: Simulación. Área: Infraestructura / Firebase.
- Referencias: ADV-C11; doc_0007.
- Dependencias: QA-01, QA-08; contrato QA-02.
- Entrega: Implementar almacenamiento persistente de campaña, snapshot/overlay, revisión esperada, comandos idempotentes y transacciones; separar entorno de prueba y datos públicos.
- **Criterio de aceptación:** Cerrar y reabrir recupera estado, ubicación, diario y elecciones; dos comandos concurrentes con misma revisión no duplican efectos; reintento devuelve recibo; campañas aisladas y recuperación tras fallo. Prueba contra entorno autorizado, no solo memoria.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-04 — Servicio de azar determinista común
- Prioridad: P1. Estado: pendiente.
- Responsable: Simulación. Área: Combate / Simulador V2.
- Referencias: ADV-C06/C10.
- Dependencias: —.
- Entrega: Sustituir o encapsular generador secuencial del laboratorio con servicio común direccionado y versionado; semilla privada, propósito/actor/encuentro/ordinal estables.
- **Criterio de aceptación:** Misma semilla, versión y decisiones reproduce trazas; insertar una tirada ajena no altera las demás; comparar políticas con semillas emparejadas; no filtrar semilla en vista jugador; regresiones del laboratorio y piloto aprobadas.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-05 — Regresión de navegación Azgaar
- Prioridad: P1. Estado: pendiente.
- Responsable: Simulación. Área: World Engine / Grafo.
- Referencias: doc_0908; doc_0914.
- Dependencias: —.
- Entrega: Investigar fallo de línea 12 de test-azgaar-view-browser.mjs en Firebase: botón Región no modificó viewBox en la ejecución de auditoría; distinguir defecto real de sincronización de prueba.
- **Criterio de aceptación:** Prueba repetida en preview y luego live tras autorización: mundo→región, selección Stormkeep, rueda y arrastre; viewBox cambia donde corresponde; sin errores de consola; documentar causa y comprobar táctil. No bloquear MOD-01 si un mapa persistente alternativo cumple el contrato.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-06 — Validar y materializar Stormkeep
- Prioridad: P1. Estado: pendiente.
- Responsable: Simulación + narrador/presentación. Área: World Engine / Grafo.
- Referencias: N01/N02; doc_0908/0909.
- Dependencias: Acuerdo de canon del usuario; QA-08.
- Entrega: Revisar población v0.2 (30 residentes, 17 sitios, 77 relaciones) y fundamentos; validar IDs y referencias, marcar propuestas vs canon, materializar solo dependencias aprobadas. Atlas jugador con hotspots autorizados.
- **Criterio de aceptación:** Importador valida duplicados, destinos y relaciones; mapa persistente vinculado a IDs, no regenera zona; rutas legales; al menos un NPC y un sitio de MOD-01 operativos; proyección sin perfiles secretos.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-07 — Primera aventura original compilada y jugable
- Prioridad: P1. Estado: pendiente.
- Responsable: Simulación + narrador/presentación. Área: Narrativa / Contenido.
- Referencias: N09/N05/N06; MOD-01/MOD-04.
- Dependencias: QA-01, QA-04, QA-06; contrato QA-02; aprobación de premisa.
- Entrega: Reemplazar fixture corredor por módulo original aprobado (La última llama del norte es candidata); definir precondiciones, alternativas, cierres y fragmentos/arte reutilizables. Completar cobertura mediante narrador autorizado y caché compatible.
- **Criterio de aceptación:** Al menos dos rutas con consecuencias distintas y cierres coherentes; compilación y replay de ramas válidas; opciones reales, fragmentos autorizados con clave de contexto/idioma/versiones y fallback explícito; lectura en libro único; no resultados preescritos como hechos.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-08 — Separación DM/jugador y seguridad de datos
- Prioridad: P1. Estado: pendiente.
- Responsable: Simulación + narrador/presentación. Área: Coordinación.
- Referencias: N04/N05; ADV-C11/C12; doc_0019.
- Dependencias: —; transversal desde el inicio.
- Entrega: Definir visibilidad por hecho y proyecciones autorizadas, separar semilla, agendas privadas, resultados futuros y secretos del Hosting público y caché compartida; validar acceso del backend.
- **Criterio de aceptación:** Tests negativos: jugador no recibe secretos, ramas futuras ni semillas por API, archivos públicos, caché o URL; campañas aisladas; narrador solo recibe contexto autorizado; revisar reglas de acceso y no publicar material de fuentes sin permiso.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-09 — Aceptación del lector en Android físico
- Prioridad: P2. Estado: pendiente.
- Responsable: Narrador/presentación. Área: Interfaz / Libro.
- Referencias: N07; doc_0903/0904.
- Dependencias: Lector candidato; repetir tras QA-02/07.
- Entrega: Probar PWA instalada, apaisado, scroll, composición editorial, navegación al mapa/diario/ficha, retorno a aplicación y reanudación; respetar movimiento reducido.
- **Criterio de aceptación:** Registrar modelo/dispositivo/versión, capturas y resultados; texto legible sin desbordes, rotación y retorno correctos, interacción táctil, regreso a campaña sin perder posición; distinguir emulación de equipo físico.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## QA-10 — Regresiones de integración y publicación trazable
- Prioridad: P2. Estado: pendiente.
- Responsable: Simulación + narrador/presentación. Área: Coordinación.
- Referencias: doc_0022/0025.
- Dependencias: Comenzar ya; consolidar con QA-02/03/07/08.
- Entrega: Automatizar validación del catálogo, motor, navegador y recorrido jugable, y publicación por revisión Git; revisar ramas activas antes de deploy, no sobreescribir trabajo de otros.
- **Criterio de aceptación:** CI o procedimiento repetible registra SHA, ambiente, casos, logs, fallos y resultado; prueba de extremo a extremo contra preview; validación de actividad; rollback documentado; promoción live solo tras aprobación y revisión de cambios.
- Evidencia de cierre: PR/SHA, prueba reproducible, resultado, limitaciones y revisión cruzada. Registrar nueva entrada de actividad sin alterar registros históricos.

## Evidencia de partida de la auditoría
- 80/80 pruebas Node ejecutadas sobre el workspace de simulación; pruebas de navegador del laboratorio y atlas modular aprobadas contra Firebase.
- La prueba del visor Azgaar falló al verificar cambio de viewBox regional; causa no establecida.
- Se verificaron documentos de canon y población, pero no integración de campaña real ni conformidad completa Mythras. El lector Android físico no se verificó.
- Fuentes: [actividad](https://pocketdm-prototipos.web.app/actividad/), [especificación de combate](https://pocketdm-prototipos.web.app/docs/advanced-combat-spec.md), [backlog narrativo](https://pocketdm-prototipos.web.app/docs/narrator-backlog.md).

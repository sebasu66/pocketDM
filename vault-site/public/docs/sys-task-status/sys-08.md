# SYS-08 · Adaptación de aventura
27/11/2026 · Agente SYS-08 (autoría/adaptación) · **En revisión parcial / bloqueado para integración real**. QA-06/07 · MOD-01/02. No es una edición jugable ni aprobación de canon.

## Referencia y alcance
- Base: `development` en `c3b21f6024c899ca1c45934b75a7665a31757eb9`. Rama: `feature/sys-08-adventure-adaptation`. PR hacia development.
- Leídos plan SYS, actividad versionada de 27/11, referencia de módulo, QA H01, población v0.2, inventarios de arte, API del máster candidata b512e03, module-runtime y compilador. PRs activos #8–#16; en particular SYS-04 #12, SYS-05 #13 y SYS-10 #16.
- Original v1.0.0: acceso de lectura autorizado comprobado en Drive; no se cambió el original ni sus permisos. La propuesta histórica no se usa como trama vigente.
- Únicos cambios Git: este informe y una entrada de actividad individual. No se modifican catálogo, reglas, compilador, libro, backend ni informes ajenos.

## Entregable privado
Manifiesto declarativo candidato v0.1, 14 páginas y 21 intenciones, con referencias al original, mapeo de operaciones existentes, condiciones y costes pendientes, dependencias de actores y arte, alternativas de canon y tres recorridos hipotéticos. No incluye prosa original. Guardado en biblioteca personal del usuario con el nombre `PocketDM-SYS-08-private-adaptation-v0.1.json`, fuera de Git y Hosting. SHA-256 del manifiesto: `b09ca1c73bf30ff427dc8f4acaf3dbf53ac933693d0fdfac7de9a69e1ae8dffa`. No se publican IDs de ramas privadas, finales, flags, texto, semilla, URL privada o fichas. El usuario deberá autorizar su acceso a los consumidores si la biblioteca no está disponible en sus sesiones.

## Evidencia 27/11
| Comprobación | Resultado |
|---|---|
| Original legible, JSON válido y versión de referencia | PASS |
| Cobertura de páginas/intenciones y destinos existentes | PASS 14/14, 21/21 |
| Cobertura de referencias de escena y habilidades | PASS 10/10, 8/8 |
| Tres familias de cierre y tres recorridos estructuralmente conectados | PASS estructural; no replay mecánico |
| IDs candidatos en población (4 actores distintos y 4 sitios) | PASS existencia; catálogo sigue proposal |
| Rutas de archivos de arte candidato en árbol Git base | PASS 8/8 existencia; no aprobación visual |
| Habilidades con ID documentado en API candidata | 5/8; otras 3 sin ID verificado |
| Fichas de criaturas y encuentros reales | SKIP / bloqueado SYS-10; no stats inventados |
| Compilación real, replay, fragmentos aprobados, integración libro/backend | SKIP / bloqueado; no resultados confirmados |
| Suite Node, emulador, build/validación integral de actividad | SKIP; sin checkout autorizado de la suite en esta ejecución |

Validación estructural ejecutada en Python sobre el original y manifiesto privado: igualdad de conjuntos de IDs de páginas, intenciones, actores y habilidades; destinos internos existentes, terminales identificados, comprobación de cada transición de los tres recorridos contra el grafo fuente; verificación de no publicación y ausencia de costes/stats supuestos. Catálogo y archivos comprobados con lectura de GitHub en SHA base. Estos PASS no validan mecánica, canon ni derechos sobre el arte.

## Bloqueos / decisiones requeridas
- Conflictos de roles/identidades (Bram/Toren, Vance/Hald, aprendiz, guardia), posada y localizaciones; no sustituir identificadores sin aprobación. Acordar portada colectiva frente a viajero individual y distinguir entrada/salida de Puerta Oriental.
- Acordar materialización, topología, agendas, tiempos, costes, recompensas, requisitos de conocimiento, condiciones de cierre y tratamiento de muerte/incapacidad/abandono. No imputar heridas por una elección editorial ni asumir consentimiento por un chequeo exitoso.
- SYS-01: verificar habilidades y operación/parametrización; SYS-03: percepción y reacción; SYS-10: criaturas con procedencia y fichas efectivas aprobadas; no emplear lobos/guardias de fixture como equivalentes.
- SYS-04: PR #12, revisión `179c642ce975d9805cf8f5748aca0f6adbef2803`, expone enumerate/prepare/ending pero restringe compileBoundEdition a mechanical-fixture. El manifiesto propone referencias para bindings de servidor, no ejecuta ni autoriza el original. Acordar cobertura de intenciones y resultados adicionales antes de compilar.
- SYS-05: preparar slots por branchId emitido por SYS-04, contexto de la rama, hechos/chequeos confirmables y audiencia; no prosa en runtime. SYS-06/07: aplicar únicamente proyección autorizada. Falta verificar el contrato de persistencia y aplicación tipada de efectos.
- SYS-09: revisar evidencia, propiedad de archivos y bloqueo del hito H01. Siguiente paso: aprobación editorial/canon, acceso privado coordinado y perfiles de SYS-10; después implementar bindings confiables con SYS-04/05 y ejecutar pruebas del módulo real. Mantener production intacta.

Estado de entrega: candidata documental/estructural; criterios de aceptación integrales pendientes. No merge ni despliegue autorizado.

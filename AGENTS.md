# Pocket DM · Instrucciones de coordinación para colaboradores y agentes de código

Estas indicaciones se aplican a **todo nuevo trabajo en el repositorio Pocket DM**, incluyendo desarrollo de combate V2, World Engine, narración, interfaz, Firebase y documentación.

## Obligatorio antes de empezar

1. **Leer las últimas novedades de la bóveda**, incluso al continuar una tarea empezada antes: https://pocketdm-prototipos--boveda-mvp-20261124-2wn8b31j.web.app/actividad/
2. Leer el protocolo versionado en `vault-site/COORDINACION.md` (rama `feature/boveda-mvp-20261124` mientras esté en revisión). Los avances fuente se guardan uno por archivo en `vault-site/updates/<area>/<id>.json`.
3. Ejecutar `git fetch origin`, revisar el historial de `origin/main`, la rama de la bóveda y los PRs más recientes. Si `vault-site/` está disponible, ejecutar `node vault-site/scripts/preflight.mjs`. Comprobar que el trabajo no entra en conflicto con cambios remotos.
4. Antes de editar archivos compartidos, identificar **qué equipo es dueño del sistema**, su interfaz y sus contratos; coordinar cambios que afecten otro subsistema. No duplicar la fuente de verdad del simulador V2, libro, personaje ni grafo.
5. No sobrescribir cambios sin seguimiento ni usar `git push --force`. Integrar o resolver diferencias de forma explícita.

## Obligatorio antes de cerrar

- Registrar una entrega nueva en `vault-site/updates/<area>/<id>.json`: área, fecha, responsable/equipo, hechos implementados, archivos modificados, estado (desarrollo/preview/live), vínculo al commit/PR y siguiente paso. El equipo de combate debe reportar resultados de reglas/motor, no sólo pantallas.
- Si cambió un contrato, decisión o ID, actualizar la ficha documental vinculada.
- Compilar el índice con `node vault-site/scripts/build-activity.mjs` y validar con `node vault-site/scripts/validate.mjs` cuando se trabaje sobre la bóveda.
- El tablero público es **de lectura**: tras registrar cambios en Git es necesario desplegar un preview para que aparezcan allí.
- Mantener los secretos, archivos privados y datos de usuarios fuera de la documentación pública.

**Límites vigentes:** `main/v2/` conserva el desarrollo principal del simulador narrativo V2; `vault-site/public/libro/` es una adaptación experimental de integración. No continuar ambas implementaciones de manera independiente sin acordar la consolidación. El combate de tres carriles está descartado. La publicación Firebase live no se modifica sin revisión y rollback.

**Nota operativa:** Este archivo se incorpora mediante PR. Hasta su fusión en `main`, sólo los colaboradores que lean la rama/PR tendrán estas indicaciones dentro de su checkout.

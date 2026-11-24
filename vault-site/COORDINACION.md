# Pocket DM · Protocolo compartido de desarrollo

**Vigente desde el 24/11/2026.** Antes de comenzar cualquier nueva tarea, los equipos de **Combate / V2**, **World Engine** y **Bóveda** deben consultar el estado reciente de las otras áreas. Este protocolo también rige cuando se retoma una conversación previa.

**Lugar de lectura:** [Actividad de la bóveda](https://pocketdm-prototipos--boveda-mvp-20261124-2wn8b31j.web.app/actividad/) · [Documentos y grafo](https://pocketdm-prototipos--boveda-mvp-20261124-2wn8b31j.web.app/boveda/).

**Fuente editable/versionada:** **un archivo JSON nuevo por entrega**, bajo `vault-site/updates/<area>/<id>.json`. El índice web `public/data/activity.json` es **generado** y no debe editarse a mano. El sitio Firebase es un visor de lectura; no es una wiki editable en tiempo real.

## Regla de oro: leer → coordinar → desarrollar → informar

1. **Leer últimas novedades de todas las áreas** antes de modificar algo. Consultar `/actividad/` y los PR/commits de GitHub publicados después de la última tarea. No dar por cierto un avance sólo por recordarlo de una conversación anterior.
2. **Sincronizar Git:** ejecutar `node scripts/preflight.mjs` desde `vault-site/`, o `git fetch origin` y examinar los commits nuevos de `origin/main` y de la rama de bóveda. Si hay diferencias en un archivo o contrato compartido, inspeccionarlas e integrarlas primero. No sobrescribir ni usar `push --force`.
3. **Declarar alcance y responsable:** anotar en la tarea o PR qué área se toca, qué carpetas y qué contratos de datos cambia. Si se solapa con otro equipo, acordar quién modifica la fuente única y quién integra.
4. **Desarrollar en una rama y probar**, sin alterar `main` ni la publicación live como efecto lateral. Antes de publicar, volver a comprobar los commits y PRs nuevos si el trabajo duró varias iteraciones.
5. **Registrar la entrega:** crear un archivo único en `updates/<area>/<id>.json`. Debe incluir: ID, fecha, área, equipo responsable, estado, hechos verificados, archivos y nodos afectados, enlace al commit/PR/preview, riesgos y próximo paso. Si hay una decisión técnica, actualizar también la ficha correspondiente en `public/data/catalog.json`.
6. **Generar y publicar índice:** ejecutar `node scripts/build-activity.mjs` y luego `node scripts/validate.mjs`. Subir los archivos de entrega a GitHub mediante un commit/PR, y desplegar un preview de la bóveda cuando corresponda para que otros vean el nuevo registro.

## Responsabilidad por área

- **Combate / Simulador V2:** implementa reglas, acciones, tiradas, estados, resolución y su motor. Registra sus avances y cualquier cambio de contratos, datos o componentes que afecte al libro.
- **Documentación / Bóveda:** mantiene el catálogo, enlaces, fichas, buscador, visor documental, grafo de documentación, actividad y publicación de la bóveda.
- **Interfaz / Libro:** componentes y contrato de escena **compartidos** entre ambos. El equipo de combate es responsable de la implementación canónica del lector V2, y la bóveda mantiene una adaptación de integración en su preview. No extender las dos copias independientemente sin acordar un esquema único.
- **World Engine / Grafo:** documenta nodos de mundo, enlaces, Ripple/consecuencias y API en sus propios cambios, y avisa si modifica un contrato consumido por combate o por el libro.
- Otras áreas (narrativa, arte, administración, infraestructura) siguen el mismo registro sin inventar responsables ni avances.

## Formato de una entrega

Cada equipo crea **un archivo nuevo**: por ejemplo `updates/combate/act-AAAAMMDD-combat-001.json`:

```json
{
  "id": "act-AAAAMMDD-combat-001",
  "date": "2026-11-24",
  "area": "Combate / Simulador V2",
  "owner": "Equipo de combate",
  "status": "en-revision",
  "title": "Descripción breve del trabajo terminado",
  "summary": "Qué se ha comprobado, qué es sólo prototipo y qué ha cambiado.",
  "changed": ["v2/ruta/real-del-archivo.mjs"],
  "next": "Pendiente o tarea que afecta a otro equipo.",
  "source": "https://github.com/OWNER/REPO/pull/NUM",
  "nodeIds": ["doc_0010"]
}
```

Este es **sólo un ejemplo**, no un reporte real. Usar fecha, ruta y enlaces verdaderos. Evitar editar archivos de otro equipo; cada entrega nueva tiene su propio JSON para minimizar conflictos de Git.

El compilador recoge todos los JSON de `updates/` y genera el índice ordenado que consume `/actividad/`. **No modificar ni comitear `public/data/activity.json`**: es un artefacto generado. Después de fusionar avances de varias ramas, ejecutar de nuevo el compilador y validar.

## Antes de iniciar una tarea técnica

```sh
git fetch origin
cd vault-site
node scripts/preflight.mjs
```

El preflight muestra los commits recientes de `main` y de la rama de la bóveda, entradas de actividad por área, cambios locales y posibles divergencias. **No es un bloqueo automático ni prueba definitiva de que nadie esté editando algo**. Si la red falla, `--offline` sólo comprueba información local.

## Para terminar una tarea

```sh
# crear un JSON nuevo dentro de updates/<area>/
node scripts/build-activity.mjs
node scripts/validate.mjs
git add vault-site/updates vault-site/public/data/catalog.json
# abrir PR y revisar cambios; publicar el preview sólo cuando corresponda
```

No registrar credenciales, contratos privados, datos de usuarios ni material externo sin autorización. Las entradas deben indicar si la funcionalidad está en **desarrollo**, **preview** o **producción**, sin confundirlas.

**Limitación actual:** Firebase Hosting sirve un tablero estático. No implementa permisos de edición, colaboración en vivo, bloqueos automáticos ni avisos push. La coordinación depende de GitHub, el registro de entregas y el compromiso de leerlo antes de tocar código.

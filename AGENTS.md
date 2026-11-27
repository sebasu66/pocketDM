# PocketDM V2 · Coordinación

La base activa está en `main/vault-site/`. La V1 y el prototipo histórico del lector están archivados en `archive/pocketdm-v1-20261127`. No volver a introducir aplicaciones Next.js antiguas ni duplicar el lector.

Antes de cualquier tarea, consultar [protocolo](vault-site/COORDINACION.md), [actividad](vault-site/updates/), PRs y ramas remotas. Ejecutar `node vault-site/scripts/preflight.mjs` cuando se disponga de checkout. Trabajar en ramas y conciliar avances de todos los equipos antes de integrar en main. No sobrescribir cambios ni forzar refs.

El libro canónico de integración es `vault-site/public/libro/`; `vault-site/simulation/` conserva el motor del servidor. La simulación es autoridad sobre estado, legalidad y resultados; el narrador prepara contenido y el libro renderiza vistas autorizadas. No publicar semillas, ramas futuras, datos privados ni credenciales. No generar prosa durante la partida.

Registrar cada entrega en `vault-site/updates/<area>/<id>.json`, reconstruir actividad y validar mediante `node vault-site/scripts/build-portable-pwa.mjs`. Distinguir código, preview y producción. No publicar en Firebase o Vercel sin verificar objetivo y estado. Las ramas de otros equipos no se consideran integradas por esta reorganización.

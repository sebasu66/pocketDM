# PocketDM V2

Única base activa de la aplicación: `vault-site/`. La PWA, el libro, el editor y la bóveda comparten `vault-site/public/`. El motor de simulación está en `vault-site/simulation/` y no forma parte del directorio público.

- [Coordinación](vault-site/COORDINACION.md) y [registro de actividad](vault-site/updates/).
- [Guía del Dungeon Master](vault-site/public/docs/dm-guide.md).
- [Módulo vigente](vault-site/public/docs/stormkeep-module-01-reference.md), con el original privado en Drive.
- [Archivo V1 y prototipo histórico](https://github.com/sebasu66/pocketDM/tree/archive/pocketdm-v1-20261127).

## Preparación

Desde la raíz: `node vault-site/scripts/build-portable-pwa.mjs`. El script valida el catálogo, genera la actividad y actualiza la revisión PWA. El resultado público es `vault-site/public/`. No necesita Firebase CLI ni claves para preparar ese resultado. Firestore y autenticación siguen siendo dependencias donde se utilizan.

Para probar el estado y el motor: `cd vault-site && node --test simulation/test-*.mjs`. Las pruebas con emulador requieren su configuración aislada; no apuntar a producción.

## Estado de integración

La base seleccionada corresponde a la revisión narrativa d12744ade8b875ac4669874a53d1e55ee71cb6f7. La V1 y el lector inicial de `main/v2/` se conservan en la rama de archivo, no en el árbol activo. No se declaran fusionados ni verificados los desarrollos que permanecen en ramas de otros equipos. Revisar las diferencias antes de integrar. La configuración Vercel Services se evalúa en `feature/pocketdm-vercel-services-20261127`; no se ha publicado. No se cambia Firebase Hosting mediante esta reorganización.

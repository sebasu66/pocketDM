> **Actualización verificada el 24/11/2026:** el MVP de bóveda y libro narrativo V2 ya fue publicado en un **canal de preview**, no en live. URL: https://pocketdm-prototipos--boveda-mvp-20261124-2wn8b31j.web.app. El catálogo actual contiene 24 nodos y 64 relaciones. La demo obsoleta de carriles fue retirada únicamente de la vista previa; `/combate/` redirige al libro. La publicación live anterior no fue tocada.
>
> **Coordinación de código:** `vault-site/public/libro/` es una adaptación de prueba del lector del canal V2. El desarrollo principal de V2 y del simulador sigue separado; la integración definitiva debe evitar dos fuentes de verdad. Las notas de traspaso a continuación se conservan como registro de su estado anterior y sus pendientes técnicos.

---

# Pocket DM · Integración de bóveda y visor de grafos

**Estado al 24-11-2026:** PENDIENTE DE INTEGRACIÓN Y DE DEPLOY EN FIREBASE.  
**Rama de trabajo:** `feature/boveda-mvp-20261124`  
**Directorio:** `vault-site/`  
**Alcance:** portal documental y visualización del grafo del World Engine. No implementar aquí el combate.

## Decisiones acordadas

1. Reutilizar la implementación existente de bóveda y visor SVG de grafos, derivada del concepto del visor original `grafo-json-git/viewer/index.html` del paquete `PocketDM-paquete-2026-11-23.zip`. No iniciar otro visor desde cero.
2. Unificar navegación por **temas/documentos**, **relaciones/nodos del grafo** y, más adelante, **ubicaciones del atlas**. Estas son vistas complementarias de la misma información, no bases incompatibles.
3. Dar al explorador navegación por vecindario, áreas, profundidad/zoom, búsqueda y acceso a la ficha asociada. Mantener el grafo legible sin mostrar todo simultáneamente.
4. Documentar por separado: grafo del mundo; Ripple y consecuencias; generación argumental; atlas geográfico; cronología; JEV/MCP/API para varias IA; administración/plan de desarrollo; referencias; decisiones y pendientes.
5. Los personajes usan una sola hoja compartida. El detalle mecánico y el inventario quedan a cargo de la otra instancia (simulador V2). Integrar lectura/escritura solamente cuando el World Engine realmente lo necesite; no duplicar modelos anticipadamente.
6. La simulación de combate narrativo V2 está en `main/v2/`, gestionada por otra instancia. El combate HTML de tres carriles es un **prototipo descartado**: mantener archivos existentes intactos hasta decidir su retiro, pero no presentarlo como sistema vigente ni basar el World Engine en él.
7. Primero documentar y construir un flujo pequeño de eventos, cambios de grafo y Ripple; después ampliar las herramientas de mundo. No agregar ahora un subsistema separado de «relevancia narrativa».
8. En esta fase no implementar permisos diferenciados de usuarios, pero **no publicar datos secretos o sensibles** en una web pública.

## Material existente confirmado

- `vault-site/public/index.html`: acceso al portal.
- `vault-site/public/site.js` y `site.css`: navegación de bóveda y grafo SVG.
- `vault-site/public/data/catalog.json`: fichas indexadas y enlaces.
- `vault-site/README.md`: instrucciones del MVP, comprobaciones y Firebase preview.
- Archivo de origen en Google Drive: `PocketDM-paquete-2026-11-23.zip`. Según la auditoría previa del README, contiene el visor original recuperado.
- `main/v2/`: simulador narrativo de combate independiente.

## Pendiente para la instancia que sí tenga acceso operativo a Firebase

1. Leer este documento y `vault-site/README.md`; comprobar cambios posteriores de la rama antes de trabajar.
2. Inspeccionar `vault-site/firebase.json` y `.firebaserc`, y verificar contra el proyecto y sitio reales. La auditoría del README identifica proyecto `lore-weaver-rt9pc` y sitio Hosting `pocketdm-prototipos`; volver a comprobarlos antes de desplegar.
3. Ejecutar desde `vault-site/` las validaciones descritas en README: `node --check public/site.js` y `node scripts/validate.mjs`. Revisar enlaces, carga de `catalog.json`, gráficos y navegación.
4. Probar la raíz `/`, `/boveda/`, `/grafo/` y cualquier otra ruta incorporada. Evitar enlaces rotos.
5. Generar **primero una vista previa** mediante el comando `firebase hosting:channel:deploy` del README, con el proyecto y target confirmados. Verificar funcionamiento antes de considerar producción.
6. **No sustituir el sitio live ni borrar el prototipo alojado actualmente** sin comprobar previamente las rutas, preparar rollback y recibir aprobación específica para el cambio de la raíz. La configuración actual de la bóveda asume un portal en `/`, mientras que el prototipo anterior ocupaba esa ruta.
7. Mantener fuera de la vista pública contratos, credenciales, datos privados y material ajeno no autorizado.
8. Una vez realizado el deploy, registrar URL real, fecha, revisión/commit y qué fue probado. No afirmar que Firebase está publicado mientras no se verifique.

## Estado operativo de este traspaso

- Código de la bóveda/grafo: **ya existe en esta rama**, aún experimental.
- Adaptaciones a futuras especificaciones: **pendientes**.
- Integración con World Engine / Ripple / MCP: **pendiente**.
- Despliegue en Firebase: **pendiente, no realizado por este traspaso**.
- Cambios en código de combate: **ninguno solicitado**.

Este documento deja continuidad entre conversaciones y no constituye una aprobación para un despliegue live.

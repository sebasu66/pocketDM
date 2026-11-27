# Pocket DM · Libro de campaña + bóveda de proyecto

**Estado:** prototipo integrado, sin publicación live. El libro narrativo V2 es la interfaz del jugador; la bóveda y el grafo son herramientas separadas de documentación.

## Rutas

| Ruta | Función |
| --- | --- |
| `/libro/` | Historia / crónica del invierno, ilustraciones y fases de combate |
| `/libro/?view=character` | Hojas de personaje |
| `/libro/?view=journal` | Diario de eventos y decisiones |
| `/libro/?view=map` | Mapa narrativo demostrativo |
| `/app/` | Inicio de aplicación y selector de campaña (MVP) |
| `/app/?view=profile` | Usuario / perfil (sin autenticación aún) |
| `/combate/` | Acceso histórico redirigido a un encuentro en el libro |
| `/boveda/` y `/grafo/` | Documentación administrativa y técnica |
| `/` | Portal de documentación del proyecto |

## Arquitectura de presentación

Se reutilizan el HTML, CSS, el registro `events.mjs` y los Web Components del lector original **Crónica del invierno** del canal Firebase `v2` de `pocketdm-prototipos` (`/v2/cronica/`). Se amplían con:

- `book-page`, `book-title`, `book-portrait`, `book-inset`, `combat-phase`: componentes originales, conservados.
- `book-sheet`, `book-journal`, `book-map`, `book-home`, `book-profile`, `book-link`: componentes nuevos.
- `book-actions`: opciones finitas derivadas de `campaign.mjs`, registradas solo durante la sesión de demostración.
- `reader.mjs`: un único motor de páginas/zoom, navegación por vista con historial y enlaces cruzados. Mismo estilo editorial en escenas y módulos.

`public/libro/campaign.mjs` es el contrato temporal de datos del ejemplo. Más adelante un adaptador deberá cargar escena, actores, opciones, mapa y diario desde el backend, sin rehacer los componentes visuales.

**Límite actual:** el combate, las tiradas y los cambios de estado del lector V2 original son ilustrativos. La selección de opciones no ejecuta todavía un motor de reglas, ni sincroniza con Firestore o cuentas reales. No presentar este ejemplo como una simulación completa o un perfil auténtico.

## Origen y versión

- Fuente verificada: `https://pocketdm-prototipos--v2-zxrxtosa.web.app/v2/cronica/`.
- Código base recuperado en `index.html`, `book.css`, `reader.mjs`, `components.mjs`, `events.mjs` y sus cinco assets. La ampliación respeta la estructura de libro.
- La demo anterior de tres columnas/carriles queda **obsoleta** y sus assets fueron retirados de este nuevo despliegue. La ruta `/combate/` es solo un enlace de compatibilidad.
- El sitio **live** de prototipos no se modifica con este trabajo.

## Pruebas y despliegue

Desde `vault-site/`, ejecutar:

```sh
node --check public/site.js
node --check public/libro/reader.mjs
node --check public/libro/navigation.mjs
node scripts/validate.mjs
firebase hosting:channel:deploy boveda-mvp-20261124 --project lore-weaver-rt9pc --expires 7d --no-authorized-domains
```

Antes de promover a live: validar navegación móvil, componentes, accesibilidad, vínculos, derechos de los assets y retorno desde libro a aplicación. Guardar copia de la release anterior para rollback.

## Próxima etapa de integración real

1. Definir esquema de vista genérico: escenas/cartas, bloques narrativos, componentes, imágenes y opciones.
2. Motor de reglas de servidor: acciones cerradas, tiradas auditables, efectos e historial.
3. Sincronización del cliente con campañas, estado del personaje, diario y localizaciones; navegación por IDs estables.
4. Autenticación y perfil; diferenciar los datos de usuario de la documentación pública.
5. Publicación del juego en un canal/entorno independiente de la bóveda de administración.

Documentación fuente: GDD PocketDM y README del paquete del 23/11/2026 disponibles en Google Drive. No incluir secretos, exportaciones con usuarios ni texto extenso licenciado de Hellfrost.

## Coordinación entre equipos

**Regla obligatoria:** antes de cualquier desarrollo, leer `/actividad/`, ejecutar `node scripts/preflight.mjs` y revisar los commits/PRs nuevos de `main` y del equipo de la bóveda. No editar archivos o contratos compartidos sin integrar los cambios y acordar responsable. Ver `COORDINACION.md`.

**Un JSON por entrega para reducir conflictos de Git:** cada equipo agrega `updates/<area>/<id>.json` con fecha, área, equipo, estado real, resumen, archivos afectados, fuente PR/commit y próximo paso. Nunca sobrescribir el archivo de otro equipo. No inventar avances ajenos.

El índice de `public/data/activity.json` se genera y no se versiona. Para preparar una nueva vista previa:

```sh
node scripts/build-activity.mjs
node scripts/validate.mjs
firebase hosting:channel:deploy boveda-mvp-20261124 --project lore-weaver-rt9pc --expires 7d --no-authorized-domains
```

**Importante:** registrar sólo en Git no actualiza la web; desplegar preview cuando los demás deban ver la entrada. El visor es de lectura, no una wiki editable en vivo. El combate canónico V2 tiene su propietario y la bóveda no modifica su motor por su cuenta.

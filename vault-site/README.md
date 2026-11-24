# Pocket DM · Bóveda documental (MVP)

Estado: implementación experimental, separada de la aplicación Next.js principal.

## Contiene

- Portal en /, catálogo en /boveda/, grafo en /grafo/ y copia del combate en /combate/.
- Un catálogo estático versionable en public/data/catalog.json.
- Documentos vinculados por ID estable; enlaces externos a GDD, README y GitHub.
- Grafo SVG interactivo con áreas, vecindario, vista completa, búsqueda, zoom y arrastre.
- La demo de combate HTML y assets publicados se copian sin modificación, verificando su SHA-256.

## Auditoría (2026-11-24)

- Repositorio: sebasu66/pocketDM, rama main, proyecto Firebase lore-weaver-rt9pc.
- Dos sitios Firebase verificados: lore-weaver-rt9pc y pocketdm-prototipos.
- La publicación anterior de prototipos servía el combate en / (no existía /combate/).
- El SHA-256 del HTML en producción coincide con el index.html del paquete Drive: 697635b637eeaf6edc8c6b21b4743730e574cbe56c10a8fd5228231e8550fa68.
- Se recuperó el visor original grafo-json-git/viewer/index.html del paquete PocketDM-paquete-2026-11-23.zip.
- La nueva interfaz documental conserva la estructura de nodos y enlaces y adapta la representación SVG. El histórico de ramas/commits del visor original no se incorporó a este MVP.
- Hay un archivo local sin seguimiento en src/components/wiki/WikiLayout.tsx del repositorio principal: no fue alterado.

## Desarrollo y pruebas

En vault-site/: 

1. Editar public/data/catalog.json, conservando los IDs.
2. Ejecutar node --check public/site.js y node scripts/validate.mjs.
3. Servir public con un servidor HTTP. El fetch del JSON no funciona abriendo index.html como file://.
4. Verificar /, /boveda/?doc=doc_0005, /grafo/?node=doc_0005 y /combate/.
5. Vista previa Firebase (desde este directorio):

   firebase hosting:channel:deploy boveda-mvp-20261124 --only hosting:prototipos --project lore-weaver-rt9pc --expires 7d

No ejecutar firebase deploy --only hosting:prototipos (live) hasta cerrar la revisión de contenido y rutas.

## Contenido y privacidad

La vista previa de Firebase es una URL pública por enlace: no hay roles ni protección de secretos. Los resúmenes administrativos aquí incluidos son no sensibles. No publicar credenciales, exportaciones de usuarios, contratos ni texto extenso licenciado de Hellfrost. El material original de campañas y el visor histórico permanecen en sus fuentes para revisión de permisos/licencia.

## Pendientes

- Inspeccionar el HTML original de la bóveda si se recupera su archivo.
- Incorporar visor histórico ramas/commits como una segunda vista cuando se apruebe la fuente.
- Migrar documentos y recursos con un pipeline de validación automático.
- Revisar reglas de Firestore antes de habilitar cualquier edición en línea.
- Evaluar el cambio de la raíz pública de combate a portal en un despliegue live separado, con rollback listo.

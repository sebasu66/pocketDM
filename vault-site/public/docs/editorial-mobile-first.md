# Paneles editoriales mobile-first (prototipo)
Decisión del usuario: el móvil apaisado es el dispositivo principal de lectura e input. El escritorio/TV puede convertirse en vista complementaria de campaña, mapa multiescala, timeline y posiciones conocidas de compañeros/actores. No se implementa ese overview todavía ni se sustituye el lector existente.
## Componentes
- book-editorial-panel: opening (hero con título vivo), flow (imagen alfa y texto fluido), reveal (imagen dominante y texto vivo).
- Laboratorio /libro/editorial/: tres muestras, controles a la derecha en apaisado, Aa alterna longitud, scroll interno y diálogo ampliado con el mismo DOM y restauración de posición. En vertical, navegación inferior.
- El flujo usa float + shape-outside: url() + shape-image-threshold; PNG/WebP alfa o máscara independiente. No ajusta texto a huecos internos ni garantiza contornos complejos. El recorte alfa de Galahad es un ensayo automático derivado de arte existente, no un asset nuevo aprobado. La paleta óxido/azul es preliminar, aún no reproduce todas las referencias cromáticas del usuario.
- El texto no tiene límite artificial de caracteres ni se achica para encajar; el área tiene overflow:auto. Títulos largos requieren prueba específica. No se cambian acciones, reglas, contratos ni datos de campaña. Muestras ficticias. No se implementó loop de vídeo.
## Verificación
Edge headless: 844x390, 1396x547, 390x844, 1280x900. Carga de WebP alfa, shape-outside, overflow, overlay, restauración de scroll, cambio de longitud y navegación; sin excepciones JS. Pendiente aprobación visual y prueba Android físico, integración en libro V2 con contrato de edición acordado.

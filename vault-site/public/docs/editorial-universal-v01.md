# Compositor editorial universal · v0.1 (candidato)

## Propósito

Una página = una composición guardada, no una clase por tipo de escena. Las imágenes pueden ser fondos, títulos, logos, separadores, símbolos o adornos, incluso dentro de un panel. El contenido narrativo y sus elecciones proceden de la edición confirmada. Ningún prompt se ejecuta en la PWA.

## Contrato

- **Plantilla**: ID, revisión, nombre, instrucciones raíz y por vista, elementos con ID estable, nombre, instrucciones particulares, binding o valor fijo, condición de presencia, layout base y excepciones escritorio/móvil. Tipos: group, image, text, interaction, slot. Los grupos y el panel permiten hijos superpuestos. El panel de interacción obligatorio pertenece al flujo.
- **Composición**: ID, ID/revisión exacta de plantilla, overrides visuales por elemento y selección de recursos de imagen por ID. No puede sobrescribir el contenido ni introducir elecciones. Una IA editorial puede producir esta parte más adelante.
- **Contenido**: pageId, bindings planos por nombre, interaction con título, texto, opciones autorizadas, estado terminal y estado textual. Las opciones tienen ID, etiqueta y símbolo opcional. El destino y la resolución se conservan fuera del renderer, en el anfitrión de confianza.
- **Catálogo**: IDs de recursos, rutas locales de imágenes y texto alternativo. No se permiten URL externas, HTML arbitrario, estilos CSS libres, eval ni instrucciones ejecutables.
- **Componente**: book-universal-page, setPage({template,composition,content,assets}), confirmPage para una instantánea confirmada, setChoiceHandler para integración de confianza. Emite book-page-choice cuando no tiene handler. El panel solo envía pageId/choiceId; los controles se bloquean durante una solicitud. Las ranuras nombradas se reservan para componentes de mecánica existentes.

## Layout y presentación

Elementos en flujo o en capa libre dentro de un contenedor, proporción del lienzo, posición X/Y y tamaño porcentual, z, escala, rotación, opacidad, color, fondo, borde, radio, encuadre, tipografía básica, fundido de recursos y duración. El binding ausente oculta la capa; existe fallback opcional. El texto en flujo crece; el móvil no tiene paginación automática. Una plantilla debe resolver exactamente un panel visible para cada vista. Las decoraciones no son opciones ni ejecutan acciones.

## Ensayo manual

El laboratorio /dm/libro/universal/ carga los 11 folios existentes de El farol del paso, con composiciones manuales y el mismo componente para todas las situaciones. Se reutilizan ilustraciones y chequeos de muestra existentes. No es una migración de la PWA ni un nuevo módulo canónico. Las imágenes de título, cielo separado, adornos y símbolos deberán recibir recursos reales aprobados: el contrato los soporta y las pruebas usan recursos existentes, sin afirmar que son aprobados para esos usos.

Las futuras herramientas de autoría podrán editar y versionar este contrato; los primeros ejemplos deben ser corregidos por el titular antes de escribir la skill. No se ha entrenado ni ejecutado un modelo de IA. No se publica el motor de campaña. La revisión de contenido, persistencia compartida, biblioteca de arte, integración de editor y migración del lector quedan fuera de este primer componente.

## Evidencia de la primera revisión

Prueba de contrato: PASS (revisión, ID, binding, asset, propiedades visuales, título gráfico, símbolos y panel obligatorio). Prueba Edge CDP: PASS en 1280×900, 390×844 y 360×640; 11 escenas, diálogo que continúa en la misma página, tres cierres, valores de chequeo exactos, scroll de 30 párrafos, título gráfico, adorno superpuesto y fundido de imagen. Los recursos usados para los ensayos de adorno y título gráfico son sustitutos del catálogo existente, no diseños nuevos aprobados. No hay prueba en Android físico. Se mantienen intactos el lector de producción y el editor existente.

Decisiones técnicas a revisar durante la primera maquetación real: un panel obligatorio en flujo raíz; capas porcentuales dentro de lienzos y paneles; texto y componentes mecánicos en flujo; una composición no cambia las opciones. Falta acordar biblioteca de recursos gráficos de capas separadas y el editor visual persistente. El ensayo manual actual no sustituye todavía la composición definitiva de cada escena.

## Editor integrado y cámara (segunda revisión)

La entrada oficial de Libro → UI mantiene el mismo iframe y ruta stormkeep_laboratorio_editorial_v11.html. Se reemplaza su interfaz por el inspector universal; la versión anterior queda accesible como editorial-legacy.html, sin migrar ni borrar diseños históricos. Jerarquía de capas con selección, visibilidad, creación, duplicación, orden y eliminación; panel contextual de diseño, contenido, prompt y cámara solo para imágenes; propiedades comunes/excepciones por dispositivo, arrastre directo y deshacer/rehacer. Dos mesas de trabajo con escalado a su panel, selección de escena y controles para ver ambas o una sola. Se conserva readLocal/writeLocal de la biblioteca existente; versiones inmutables en un registro nuevo y comprobadas después de recargar. La biblioteca compartida aún no está conectada en esta revisión: guardados locales claramente identificados. Los recursos proceden del catálogo disponible, sin subida nueva ni publicación. No migra aún el lector de campaña.

Cámara por imagen: cameraEnabled, cameraStartX/Y/Zoom, cameraEndX/Y/Zoom, cameraDuration (segundos) y cameraEasing. Heredan base con excepciones móvil/escritorio. Reutiliza cropRect y EditorialCamera del editor anterior para encuadre, interpolación y respeto de reduced motion. El componente reproduce al entrar, y el editor permite Inicio/Final/Reproducir; arrastrar en Cámara mueve el encuadre, no la capa, y en Diseño mueve la capa. Las imágenes se recortan dentro del marco. El cambio de recurso conserva el fundido independiente. No es generación por IA durante la partida.

Evidencia: contrato PASS, pruebas de las 11 escenas en tres viewports PASS, editor CDP PASS (selección de imagen, controles contextuales, cámara inicial/final/reproducción, arrastre de encuadre, excepción móvil, deshacer/rehacer, alta/duplicado/eliminación, prompts, recuperación de v1/v2 tras recarga y viewport estrecho), regresión de lector publicado y editor anterior PASS. Inspección de captura de escritorio. Se corrigió aliasado de objetos entre revisiones guardadas. No hay validación humana definitiva ni prueba Android físico.

## Panel de interacción: historial y pieles 9-slice

El panel usa un marco gráfico continuo y crece en flujo con su historial, resultados y opciones. Los recursos de marco y de opción normal/hover/seleccionada se definen por ID de catálogo con slice:{top,right,bottom,left,width}; cortes porcentuales de origen y grosor visual fijo en px. CSS border-image-slice fill conserva las esquinas y estira bordes y centro según el tamaño real del texto. El inspector del panel permite elegir recursos, ajustar cortes, altura mínima y colores de texto, con las excepciones de dispositivo existentes. Una composición puede indicar optionSkins por ID de opción autorizado; el inspector por ahora edita la apariencia común. Los resultados son texto y SVG con un detalle desplegable del chequeo confirmado; no se requieren imágenes de resultado. Historial ordenado con speech, choice, narration, check, attack. Las opciones admiten skill:{id,label}; el mapa skillSymbols del panel vincula habilidades con IDs de imágenes o celdas de spritesheet (cell:{columns,rows,column,row}, índices desde cero). Si no existe símbolo asignado se usa un dado SVG. El catálogo no contiene aún la grilla artística real. Los cuatro SVG de piel son recursos de prueba, no arte definitivo. El componente no genera ni recalcula resultados.

Pruebas Edge CDP en 1280×900, 390×844, 360×640: 11 escenas, historial de selección, resultados exactos, opciones con chequeo anticipado, opción multilínea con ancho constante y altura creciente, grosor de borde fijo, 24 entradas de historial y scroll hasta la opción, más regresión de cámara, editor y biblioteca de versiones: PASS. No se desplegó a producción.

## Biblioteca gráfica y clasificación semántica

La sección Dirección artística → Biblioteca (/dm/arte/#assets) reúne 93 recursos existentes: 38 NPC, 45 fondos/localizaciones, 4 PC, 1 título, 1 cosmético y 4 UI provisionales. Se catalogan las 59 imágenes del manifiesto histórico de Stormkeep más variantes y referencias. Los códigos estables usan categoría/nombre_snake_case; se conservan los archivos y estados originales. LOGO, MONSTER, OBJ e ICON se reservan para recursos aún no encontrados. El contrato distingue contentType/tags del tipo gráfico y acepta códigos como BKG/red_sky solo si están catalogados. El editor filtra por tipo; los diseños históricos conservan sus referencias. La subida compartida es un flujo candidato de borrador privado con propietario editorial Google, Firestore editorial_assets y Storage editorial-assets/CATEGORIA/nombre.ext. No se han desplegado las reglas ni probado el acceso autenticado real; requiere revisar política actual del bucket, CORS, dominio de autenticación y permisos de consulta Firestore desde Storage. Las imágenes nuevas quedan en borrador; el editor solo consume el catálogo publicado hasta integrar publicación/preview privada. No se exponen tokens de descarga ni se permite sobrescribir códigos.

## Publicación de interfaz

Publicación autorizada del editor y catálogo estático de 93 recursos. No incluye cambios del motor, reglas Firebase, ni activación de subida. Los tres originales de logo y cielos están pendientes de transferencia al repositorio. Para cielos cuadrados: mantener sol o luna visibles, encuadrar con margen de recorte en ambos dispositivos y conservar el lienzo cubierto sin bordes expuestos durante el paneo. Los placeholders semánticos aún son una propuesta.

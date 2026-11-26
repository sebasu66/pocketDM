# Componente editorial de PocketDM

El [laboratorio del portal](/dm/libro/#ui) muestra un mismo diseño en dos instancias independientes de 960 y 360 píxeles. El inspector vive en la segunda columna del portal. La ruta del laboratorio también funciona por separado.

## Uso en una página de la bóveda

```html
<book-editorial-scene id="pagina"></book-editorial-scene>
<script type="module">
  import '/dm/libro/editorial/editorial-page.mjs';
  const pagina = document.querySelector('#pagina');
  pagina.content = {
    kicker: 'Stormkeep / Cuaderno de viaje',
    title: 'Una voz entre la niebla',
    paragraphs: ['La niebla cubre el pozo.', 'Una figura se detiene.'],
    image: '/dm/libro/editorial/assets/plaza.webp',
    alt: 'La plaza al caer la tarde'
  };
  await pagina.loadSettingsFromURL('/dm/libro/editorial/designs/scene-plaza.json');
  const copia = pagina.getSettings();
  copia.base.titleSize = 48;
  await pagina.loadSettings(copia);
  pagina.playCamera();
</script>
```

El padre autónomo `BookEditorialPage` se registra como `book-editorial-base`. Los hijos `book-editorial-scene` y `book-editorial-intro` extienden el esquema mediante `static editableProperties`. Una subclase declara un `componentType` propio, combina el esquema heredado con sus campos y puede especializar `render()`. El inspector consulta el esquema del tipo seleccionado. Las fuentes decorativas del laboratorio se cargan desde Google Fonts, con familias de reserva para uso sin conexión.

## Diseño y contenido

Cada archivo de `/dm/libro/editorial/designs/` representa una pareja de componente y diseño. El formato incluye `schemaVersion: 1`, `component`, `base` y `responsive`. Se admiten objetos, texto JSON y URL con `loadSettings()`, y URL con `loadSettingsFromURL()`. Los datos incompatibles se rechazan antes de reemplazar el diseño activo. `getSettings()` devuelve una copia independiente.

Hasta 600 px de ancho del componente se aplican las excepciones `mobile`, y por encima de ese ancho las de `desktop`. Ausencia de un campo significa heredar de `base`. **Heredar** elimina la excepción. El título narrativo, los párrafos, el recurso gráfico, su descripción y el folio pertenecen a `content`. La presentación admite una panorámica distinta de la escena.

## Cámara

El mapa representa la imagen completa. La línea continua identifica el encuadre inicial y la discontinua, el final. Seleccioná uno para mover su centro sobre el mapa o ajustá los campos de centro y zoom con el teclado. Los centros se expresan como porcentajes del ancho y alto originales, y el recorte se limita a los bordes de la imagen. La forma de cada rectángulo coincide con la ventana de ilustración de la vista seleccionada. En ajustes comunes, el mapa toma la vista de escritorio.

La cámara del diseño admite duración en segundos, zoom de ambos extremos y aceleración. La opción **Excepción de esta imagen** guarda sólo los campos específicos en `content.camera`, por encima de los ajustes responsive. Al reproducir, cada instancia mantiene su último encuadre. Con reducción de movimiento activa se aplica el encuadre final inmediatamente.

## Guardar y cargar

El inspector guarda cada pareja de componente y diseño en IndexedDB, con almacenamiento local de respaldo. **Descargar diseño JSON** exporta sólo el estilo y la cámara reutilizable. **Descargar proyecto con contenido** incluye el diseño, la narración, las imágenes importadas y sus excepciones. El importador también admite archivos de proyecto V11. **Recargar diseño de la bóveda** vuelve a leer el diseño publicado y conserva el contenido en edición.

Firebase Hosting sirve los archivos versionados en modo de lectura. Para compartir cambios, se exporta el JSON y se incorpora al repositorio mediante el protocolo de la bóveda. El guardado del navegador pertenece al origen y dispositivo actuales.

## Página de diálogo

El selector del laboratorio incluye «Página de diálogo». La muestra usa la imagen de Hald disponible en el catálogo de arte candidato. En «Personaje del diálogo» se puede cargar la imagen principal completa, escribir el nombre de una emoción y asociarle una imagen. Si la emoción indicada no tiene imagen o no se puede cargar, se muestra la imagen principal. Los controles de posición y zoom del grupo «Retratos» se aplican a todas las emociones y admiten excepciones por ancho. El diseño y el proyecto se guardan localmente. Para trasladar imágenes y emociones hay que descargar el proyecto con contenido.

El componente emite el evento `dialogue-choice` con la respuesta seleccionada. El sistema que lo integre debe proveer el siguiente contenido de conversación. La muestra no decide resultados de campaña. El laboratorio original de diálogo presenta el resultado sin regresar a la lista de opciones.

La vista móvil tiene un campo de ancho en su encabezado. Este valor se conserva en el navegador y sólo afecta la previsualización. El editor mantiene aplicadas las excepciones móviles aunque el ancho elegido supere 600 px. Fuera del editor, el componente usa el ancho de su contenedor para resolverlas. Para previsualizaciones se puede fijar el atributo preview-view a mobile o desktop.


## Biblioteca de diseños

El selector de tipo de página ofrece los componentes implementados. La lista muestra los diseños versionados de la bóveda y las copias guardadas en el navegador. Para crear una copia, escribí un nombre y usá «Crear copia del diseño actual». Los cambios se guardan automáticamente en la copia seleccionada. Los diseños publicados admiten borradores locales y restauración desde la bóveda. La base compartida requiere configurar acceso autorizado y todavía no está conectada. Para trasladar contenido e imágenes se puede descargar el proyecto completo.

Las proporciones 9:19,5 y 19,5:9 aproximan pantallas modernas como Galaxy S23 e iPhone 16. No representan zonas recortadas ni barras del sistema. Los proyectos guardados conservan su proporción anterior.

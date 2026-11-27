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

# West Marches: generación progresiva del mundo · v0.1
Decisión de diseño 24/11/2026. Contrato propuesto; no implementación del atlas ni del backend.

## Canon y geografía
El canon inicial define época, límites físicos/mágicos, culturas, religiones, política, facciones, especies, amenazas, historia y tono. Stormkeep es el hub canónico (doc_0020). Mantener hechos, rumores y propuestas separados. Un NPC, reliquia o criatura legendaria puede existir como entidad con ID estable antes de tener ubicación concreta. No inventar una posición precisa si solo se conoce una región o no se conoce ninguna.

La geografía preliminar contiene regiones, terreno general, relaciones espaciales y conexiones potenciales. Propuesta técnica: hexágonos axiales q,r en coordenadas de un mundo ficticio; tamaño fijado por escala de campaña, no por latitud terrestre. Nodos para regiones, hexágonos, asentamientos, sitios, interiores; edges tipados para pertenencia, acceso, caminos y distancia. Relaciones espaciales verificables; rutas sin materializar no se presentan como rutas transitables confirmadas.

## Estados independientes
Generación: referencia (entidad conceptual), esqueleto (ubicación aproximada, bioma, enlaces potenciales), visitable (rutas y elementos necesarios validados), detallado (subescenarios específicos). No exigir completar todo un territorio. Cada hecho consolidado conserva ID, procedencia, versión y dependencias. Ampliar sin contradecir hechos establecidos.
Conocimiento: desconocido, rumor, descubierto, visitado. Es por campaña/personaje o grupo según reglas. No confundir con grado de generación.
Tiempo: posición y estado de actores/objetos son temporales. Una leyenda no fija la posición actual de su protagonista.

## Solicitud de aventura
1. Leer snapshot, reglas de canon, estado vivo, ubicación y perfil del grupo, hilos y conocimiento.
2. Elegir conflicto compatible y anclarlo en regiones existentes o en referencias aún sin ubicación precisa.
3. Calcular cierre de dependencias: corredor de viaje y alternativas relevantes, hexágonos, clima, accesos, aldeas, NPC con agendas, recursos, peligros, pistas, tesoros, encuentros y condiciones de avance.
4. Reutilizar entidades existentes y completar vacíos; proponer entidades nuevas con IDs estables. No regenerar datos consolidados ni colocar dos veces un objeto único. Generar solo hasta el detalle que el recorrido necesita.
5. Validar conectividad, distancias, biomas, recursos, cronología, coherencia de motivaciones y accesibilidad de las alternativas. Confirmar cambios de generación de forma atómica antes de que se puedan visitar.
6. Simular opciones y consecuencias con horizonte limitado y semilla privada; preparar narración de eventos visibles. Acciones imprevistas generan dependencias faltantes bajo demanda. Ramas hipotéticas no cambian la campaña.

## Snapshot y ramas
Snapshot inicial versionado e inmutable: canon, hub, geografía preliminar, entidades, contenido validado y referencias a versiones de reglas/generadores. Cada nueva campaña fija baseSnapshotId y hereda ese mundo. Estado de campaña como overlay de cambios, nuevos nodos, tombstones y eventos (Firestore operativo; Git para snapshots y esquemas). Sin copia completa por jugador. Las decisiones de una campaña nunca modifican otra. Nueva versión de mundo base solo mediante promoción explícita de contenido canónico, sin importar efectos particulares; campañas existentes quedan fijadas salvo migración acordada.
Caché heredable: datos estáticos compatibles y fragmentos narrativos aprobados, con clave basada en hechos relevantes, contexto autorizado, idioma, versión de narrador y reglas. Un mismo lugar no garantiza misma narración. Las tiradas y efectos se calculan para cada rama de campaña, no se heredan como hechos ni se comparten secretos. Separar identidad de plantilla de identidad de instancia.

## Atlas como proyección
Una vista de datos del grafo, no un segundo editor de verdad. Zoom regional (biomas y regiones), hexágono (terreno, caminos), localidad (edificios y puntos de interés), sitio (interiores si existen). Teselas/capas vectoriales por nivel; cargar solo región visible. DM autorizado: NPC, jugadores, tesoros, monstruos, hilos, estado de generación y posiciones conocidas por el servidor. Jugador: mapa filtrado por conocimiento y permisos antes de enviar al cliente; niebla de exploración. Sin coordenadas inventadas para referencias abstractas. El zoom no genera contenido automáticamente. Crear una aventura o solicitar exploración dispara generación según presupuesto.
MVP: mapa vectorial de Stormkeep y corredor a una región vecina, zoom/pan y filtros de DM/jugador; imágenes detalladas y teselas raster más adelante.

## Referencias
Forbidden Lands Gamemaster's Guide combina setting, encuentros y sitios modulares; el manual del jugador local remite a sus herramientas de generación. Hellfrost Gazetteer describe Rassilon, útil como estructura regional, no como generador ni canon a copiar. Referencias editoriales: https://freeleaguepublishing.com/shop/forbidden-lands/core-boxed-set/ y https://studio2publishing.com/products/hellfrost-gazetteer. No se revisó un ejemplar local del Gazetteer ni del GM Guide en esta entrega.

## Entrega siguiente
Simulación: contrato world snapshot y materializeAdventureRegion, validaciones de rutas y consistencia, generación de aventura piloto en el corredor de Stormkeep. Narrador: propuestas de lore y NPC y fragmentos a partir de resultados. Atlas después de estabilizar contratos; no crear un mapa gigante ni dos fuentes de estado.

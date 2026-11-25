# QA-06 / QA-07 · La última llama del norte · propuesta v0.2
25/11/2026. Entrega de autoría para revisión. No equivale a aprobación de canon ni a aventura ejecutable. Se conserva la premisa del módulo candidato y se la vincula al asentamiento de N02 v0.2.
## Sinopsis para aprobación
Un envío de remedios destinado a la Aldea del Hielo queda retenido en el Puente del Vado. Las obligaciones de abastecimiento de Stormkeep y la escasez del invierno ponen a varias personas en desacuerdo. El jugador puede aceptar un encargo, averiguar qué ocurre y buscar una solución. No presupone Galahad, clase, género o facción; no determina un combate obligatorio.
La aventura nace del comercio, los créditos y la Carta del Muelle, no de una amenaza que aparece porque el jugador llegó.
## QA-06: selección mínima de materialización
Canon confirmado: nombre Stormkeep y marco de fantasía medieval propio. Propuestas a aprobar explícitamente: fundamentos v0.2, escala de asentamiento, nombres y perfiles locales, premisa, corredor y actores piloto. El catálogo de 30 residentes y 17 sitios queda como reserva de autoría, no se carga todo de oficio.
| Dependencia | ID de referencia | Estado |
|---|---|---|
| Stormkeep | stormkeep | ID existente |
| Hospicio | draft.stormkeep.hospice | propuesta |
| Mercado | draft.stormkeep.market | propuesta |
| Puerta Oriental | draft.stormkeep.east-gate | propuesta |
| Isveld, Aldra, Runa, Nils | draft.npc.isveld, draft.npc.aldra, draft.npc.runa, draft.npc.nils | propuesta; no canon privilegiado para Isveld |
| Camino oriental y corredor | hex.0.0, hex.1.0, hex.2.0 | IDs del fixture, no geografía definitiva |
| Aldea y puente | pilot.village, pilot.bridge | IDs del fixture, sujetos a aprobación |
| Mara, Ivo, Neris | pilot.mara, pilot.ivo, pilot.neris | actores del fixture; identidad narrativa propuesta |
El Cuervo Gris y Vesna son opcionales. No materializar lugares ni actores sin aprobación ni asignar coordenadas desde la ilustración. Simulación conserva IDs consolidados, legalidad, rutas, snapshot y proyecciones. Los hotspots del jugador requieren autorización y descubrimiento.
## QA-07: entrega de autoría
Se preparó un dossier privado versionado con 8 escenas, 7 personajes funcionales, 20 intenciones candidatas, 2 rutas argumentales y 5 condiciones de cierre, además de 9 briefs de ilustración. La resolución de esas rutas no está escrita como hecho. El contenido privado (alternativas, textos de aparición, condiciones terminales, agenda y arte dependiente) está fuera de Hosting y Git, en el directorio local privado del narrador. El validador y simulación pueden acceder por canal privado autorizado. No copiarlo al cliente ni publicarlo en URLs.
## Contrato solicitado a simulación
El estado común actual dispone de viaje, raciones y duelo. No requiere un segundo motor. Para convertir el módulo en jugable se necesitan capacidades versionadas de diálogo/proyección de conocimiento, aceptación/rechazo de contrato, observación de evidencia, negociación, transferencia de recursos/cargamento con conservación de cantidades, informe de hechos y cierre de módulo idempotente. Los nombres del dossier son intenciones de autoría, no comandos legales existentes. El motor debe definir argumentos, costes, precondiciones, efectos, comprobaciones y permisos. El cargamento necesita identidad, custodia, propiedad, cantidades y obligaciones comprobables. No se fijan valores ni plazos arbitrarios.
El compilador nuevo prepareWindow puede preparar alternativas mecánicas privadas y mantener opciones diferidas. El módulo finito requiere incorporar condiciones de cierre y dependencias narrativas antes de afirmar cobertura. Narrador recibe trabajos autorizados, no semilla, ni estado privado, ni alternativas de otras ramas. La prosa y el arte deben corresponder a los hechos observados y confirmados. Las entradas del dossier no son un guion que impone resultados.
## Dirección artística
Usar prioritariamente el grupo A de la galería: escena con personaje, retrato NPC, plaza y entrada fortificada. Referencias de textura, luz y composición, no identidad ni arquitectura canónica. La portada representa un puerto pequeño, no metrópolis. Las estampas y retratos serán assets separados de los textos y de la moldura lateral, con composición adaptable y borde derecho extensible. No generar retratos antes de aprobar su identidad. No incorporar imágenes de heridas o enfrentamientos sin un evento que las justifique.
## Revisión y evidencia
Documento de entrada: fundamentos y población v0.2, módulo v0.1, skill adventures.md, illustrated-adventure-modules.md, QA-playable-stormkeep.md, campaign-anticipation-qa02.md y campaign-state-qa01.md. La estructura se apoya en preparación modular, elecciones significativas y consecuencias, no en copiar argumentos de los manuales.
Verificador local: node scripts/validate-authored-module.mjs <ruta-privada-del-dossier> . Comprueba referencias, cobertura de escenas/intenciones, IDs, política de privacidad, familias terminales y referencias artísticas, no legalidad ni ejecución mecánica. QA-06 y QA-07 permanecen en revisión, sujetos a aprobación del usuario, contrato de simulación y prueba H01. No se cambió la PWA ni se generó arte definitivo.

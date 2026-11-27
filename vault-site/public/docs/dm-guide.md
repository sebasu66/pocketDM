# PocketDM | Guía de acceso a la información para el Dungeon Master

PocketDM dispone de una bóveda centralizada de conocimiento, documentación, recursos gráficos, personajes y sistemas de simulación. Su propósito es proporcionar al Dungeon Master asistido por IA el contexto necesario para diseñar, preparar y narrar aventuras coherentes dentro de un mundo persistente.

Actualización: 27/11/2026. La referencia principal de la primera aventura es ahora el módulo 01 v1.0.0, La Última Llama del Norte.

## 1. Acceso general
- [Portal del Dungeon Master](https://pocketdm-prototipos.web.app/dm/): herramientas administrativas y de desarrollo.
- [Bóveda](https://pocketdm-prototipos.web.app/boveda/): documentación, arquitectura, decisiones y referencias.
- [Grafo](https://pocketdm-prototipos.web.app/grafo/): documentos y relaciones.
- [Actividad](https://pocketdm-prototipos.web.app/actividad/): avances de los equipos.
- [GitHub](https://github.com/sebasu66/pocketDM): código, datos y versiones.
- [Game Design Document](https://docs.google.com/document/d/13cKvD6hb_-rVodySOk0U9_Xp9YsoQJ1XpVhZOQ5z9Xg/edit): visión del juego.

## 2. Skills e instrucciones
Consultar las skills antes de desarrollar una aventura.
- [Skill principal](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/SKILL.md).
- [Construcción de mundos](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/worldbuilding.md).
- [NPC](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/npcs.md).
- [Diseño de aventuras](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/adventures.md).
- [Narración y calidad literaria](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/narration.md).
- [Acontecimientos emergentes](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/emergence.md).
- [Exploración y supervivencia](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/exploration.md).
- [West Marches](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/west-marches.md).
- [Fuentes bibliográficas](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/sources.md).
- [Skill del sistema](https://pocketdm-prototipos.web.app/skills/pocketdm-system/SKILL.md).
Las skills son metodología; no sustituyen el contexto específico del mundo.

## 3. El mundo
Fantasía medieval original, frío progresivo en el norte, diversas regiones y ecosistemas, con Stormkeep como asentamiento inicial.
- [Biblia del mundo](https://pocketdm-prototipos.web.app/docs/world-bible-v01.md).
- [Fundamentos de Stormkeep](https://pocketdm-prototipos.web.app/docs/stormkeep-foundation-v02.md).
Contienen geografía, historia, clima, política, tradiciones, economía, recursos, instituciones y principios de magia. Distinguir canon confirmado, propuestas, rumores y creencias.

## 4. Sociedad, economía y acontecimientos
Los [fundamentos sociales y económicos](https://pocketdm-prototipos.web.app/docs/stormkeep-foundation-v02.md) describen fundación, producción, comercio, recursos, autoridades, familias, obligaciones, tradiciones y sucesos históricos. La biblia del mundo establece causalidad social y económica. El nuevo módulo aporta amenazas y conflictos activos de aventura; el resto del catálogo de acontecimientos extraordinarios todavía debe ampliarse. La economía da credibilidad, no sustituye el misterio y el peligro.

## 5. Personajes no jugadores
30 residentes individualizados, 17 lugares candidatos y 77 relaciones públicas. Identidad, profesión, historia, motivación, voz, apariencia y rutinas.
- [Catálogo narrativo](https://pocketdm-prototipos.web.app/docs/stormkeep-population-v02.md).
- [NPC, sitios y relaciones en JSON](https://pocketdm-prototipos.web.app/data/stormkeep-population-v02.json).
- [Reparto anterior de primera sesión, referencia a revisar](https://pocketdm-prototipos.web.app/docs/stormkeep-first-session.md).
- [Galería](https://pocketdm-prototipos.web.app/docs/art-references/stormkeep-work-20261125/).
- [Manifiesto gráfico](https://pocketdm-prototipos.web.app/docs/art-references/stormkeep-work-20261125/manifest.json).
Los NPC actúan según sus intereses, conocimientos y circunstancias; no son solo dispensadores de misiones. Agendas privadas y secretos requieren acceso autorizado.

## 6. Personajes jugadores
Tres personajes predefinidos: paladín (protección, resistencia, combate frontal), elfo oscuro (sigilo, percepción, movilidad), maga (conocimiento, voluntad, hechicería). Tienen atributos, habilidades, inventario, equipo y arte.
- [Selección y fichas](https://pocketdm-prototipos.web.app/libro/?view=character).
- [Definiciones estructuradas](https://pocketdm-prototipos.web.app/laboratorio/stormkeep-presets.mjs).
Preparar ramas según apariencia, raza, profesión, equipo, capacidades y reacción social. Magia, habilidades raciales y profesionales aún tienen limitaciones mecánicas.

## 7. Criaturas, monstruos y reglas
Mythras: habilidades, oposición, combate individual/grupal, sorpresa, miedo, heridas, retirada y primeros auxilios.
- [Reglas](https://pocketdm-prototipos.web.app/dm/sistema/#reglas).
- [Estado](https://pocketdm-prototipos.web.app/dm/sistema/#estado).
- [API](https://pocketdm-prototipos.web.app/dm/sistema/#api).
- [API del máster](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/master-rules-api.md).
- [Encuentros y consecuencias](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/encounter-rules-api.md).
- [Combate grupal](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/group-combat-api.md).
- [Código y datos mecánicos](https://github.com/sebasu66/pocketDM/tree/feature/simulation-qa01-state-20261125/vault-site/simulation).
Completar el bestiario con hábitat, comportamiento, origen y vínculos. Las funciones JavaScript documentadas no equivalen a un endpoint HTTP/MCP disponible ni a Mythras completo.

## 8. Tipo de campaña y primera aventura
West Marches, mundo persistente, exploración progresiva y módulos finitos interconectados cuyas consecuencias condicionan los siguientes.
- [West Marches](https://pocketdm-prototipos.web.app/skills/pocketdm-storyteller/west-marches.md).
- [Arquitectura de aventuras ilustradas](https://pocketdm-prototipos.web.app/docs/illustrated-adventure-modules.md).
- **[Registro del módulo vigente v1.0.0](./stormkeep-module-01-reference.md)**.
- **[Original JSON del máster: La Última Llama del Norte](https://drive.google.com/file/d/1O75MUG6O-tTa8rCoNrh3WCQcIECzAeF0/view?usp=drivesdk)** (Drive privado, requiere autorización).
- [Propuesta histórica QA-07 v0.2](https://pocketdm-prototipos.web.app/docs/stormkeep-module-qa07-v02.md).
- [Plan anterior de primera sesión](https://pocketdm-prototipos.web.app/docs/stormkeep-first-session.md) (en revisión para adaptación).

El módulo 01 seleccionado se centra en la Escarcha Lenta, contiene 14 páginas interconectadas y tres familias de desenlace. Reemplaza la premisa anterior como referencia argumental, no declara automáticamente canon, legalidad ni ejecución. Conservar el mundo ya construido; conciliar NPC, lugares, habilidades y condiciones con sus IDs y reglas reales. El original contiene información reservada al máster: no distribuirlo al jugador. No modificar los permisos de Drive.

## 9. Ramificación y preparación
No generar narraciones en tiempo real durante la partida. Preparar situaciones, decisiones, resultados y continuaciones, asociados a IDs de rama y revisión de contexto.
- [Registro de ramas](https://github.com/sebasu66/pocketDM/blob/feature/stormkeep-narrative-branch-registry/vault-site/public/docs/narrative-branch-registry.md).
- [Preparación anticipada](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/campaign-anticipation-qa02.md).
- [Estado común](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/campaign-state-qa01.md).
- [Replay de combate](https://github.com/sebasu66/pocketDM/blob/feature/simulation-qa01-state-20261125/vault-site/public/docs/combat-replay.md).
El registro de autoría stormkeep-puerta-oriental.json (biblioteca Pocket DM) contiene las primeras once ramas redactadas, en revisión. Reutilizar únicamente con contexto compatible.

## 10. Arte y presentación
Libro ilustrado interactivo; imágenes, personajes, textos y layouts separados.
- [Estilos](https://pocketdm-prototipos.web.app/dm/arte/#estilos).
- [Referencias](https://pocketdm-prototipos.web.app/dm/arte/#referencias).
- [Prompts](https://pocketdm-prototipos.web.app/dm/arte/#prompts).
- [Editor de layouts](https://pocketdm-prototipos.web.app/dm/libro/#ui).
- [Escenarios originales](https://pocketdm-prototipos.web.app/docs/art-references/escenarios-20261125.html).
- [Producción artística](https://pocketdm-prototipos.web.app/docs/art-references/stormkeep-work-20261125/).
Los demos y el lector deben consumir los mismos componentes y configuraciones del editor.

## 11. Aplicación y demostraciones
- [PWA](https://pocketdm-prototipos.web.app/app/).
- [Libro](https://pocketdm-prototipos.web.app/libro/).
- [Demo de diálogo](https://pocketdm-prototipos.web.app/laboratorio/dialogo/).
- [Localizaciones](https://pocketdm-prototipos.web.app/libro/?view=locations).
- [Personaje](https://pocketdm-prototipos.web.app/libro/?view=character).
- [Mapa](https://pocketdm-prototipos.web.app/libro/?view=map).
- [Diario](https://pocketdm-prototipos.web.app/libro/?view=journal).
Los demos no prueban que el nuevo módulo esté integrado.

## 12. Instrucciones operativas
1. Leer skills y actividad reciente.
2. Recuperar contexto del mundo, región, localizaciones, NPC.
3. Consultar fichas de jugadores.
4. Identificar acontecimientos, amenazas, misterios y conflictos.
5. Diseñar alternativas coherentes sin forzar caminos.
6. Resolver mediante el simulador las acciones que requieren mecánica.
7. Redactar las continuaciones según resultados autorizados.
8. Asociar textos, ramas, arte y componentes editoriales.
9. Validar continuidad, cobertura y privacidad; registrar la entrega.
10. Integrar en el lector único, validar y publicar con el mecanismo existente.

Construir aventuras variadas, emocionantes y coherentes, no sistemas paralelos. El mundo debe estar al servicio de la aventura. Mantener el misterio, descubrimiento, peligro y consecuencias significativas.

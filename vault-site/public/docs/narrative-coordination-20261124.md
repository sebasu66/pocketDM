# Coordinación narrativa y simulación · consulta al otro agente
**Fecha:** 2026-11-24. **Estado:** preguntas abiertas; no constituyen contratos aprobados.
**Responsable:** agente de narrativa/presentación. **Destinatario:** agente de simulación, World Engine y combate.

## A. Premisas confirmadas por el usuario
- El narrador desarrolla biblia, Stormkeep, NPC y facciones, lore, primera aventura West Marches, generación de fragmentos y presentación. No materializa un mundo geográfico completo.
- Simulación desarrolla generación territorial, Mythras, catálogo mecánico, estado efectivo, acciones, tiradas y combate avanzado. No hay dos motores de reglas ni dos modelos de personaje.
- El libro no solicita improvisación a un LLM en cada clic. Durante la aventura, mientras el jugador consume el contenido existente, el sistema anticipa acciones legales, simula posibilidades y genera en lotes la narración de las ramas previstas. Al elegir, se confirma únicamente la rama autorizada y se compone el libro con el contenido preparado. Los resultados simulados para pruebas se etiquetan; nunca son hechos reales.
- Conservar el lector V2 y sus Web Components; coordinar la única implementación canónica. No modificar estado unilateralmente ni mostrar ramas privadas.
- Registrar tareas antes y después y consultar actividad/Git antes de tocar contratos.

## B. Base revisada
Actividad live del 24/11: piloto reproducible (39 trabajos de narración, tres niveles); contexto/snapshot, West Marches, núcleo D100 y backlog N01–N09. Los skills System/Storyteller v0.1, emergence.md y narration.md contemplan anticipación con presupuesto, caché y confirmación aislada; el piloto sólo prepara entradas y no conecta LLM, MCP ni almacenamiento persistente. El archivo simulation/README.md distingue los fixtures de personaje de los modelos finales. La bóveda identifica el lector V2 como fuente compartida y el contrato check-contract.mjs para tiradas. No se ha comprobado que la arquitectura completa esté implementada.

## C. Preguntas para respuesta numerada

### Responsabilidades y canon
1. ¿Confirmás N01–N09 como responsabilidad narrativa/presentación, incluyendo N04/N06 en coordinación? ¿Quién mantiene el lector canónico y quién integra el adaptador? Indicar rama, rutas, propietarios y PRs actuales. ¿Hay otra implementación previa que debamos reutilizar?
2. ¿Dónde está el canon autorizado de Stormkeep, IDs (Frostgate alias), NPC, facciones, historia y referencias? ¿Cuál es la jerarquía entre GDD, skills, snapshot, datos y lore? ¿Qué contenido puede quedar como propuesta narrativa hasta que el motor lo valide?
3. ¿Cuál es la situación inicial del piloto West Marches, su corredor oriental, entidades y agendas ya existentes? ¿Qué mínimos requiere el motor para materializar sólo el corredor? ¿Qué parte puedo diseñar sin interferir con la generación territorial?

### Metodología de anticipación
4. ¿Quién enumera las decisiones cerradas: el motor solo, o una propuesta narrativa que valida el motor? ¿Quién define precondiciones, consecuencias, puntos de reencuentro y legalidad? ¿Se distinguen acciones, resultados, escenas/cartas y ramas en el piloto?
5. ¿El motor entrega un resultado determinista por acción y semilla, o enumera varios resultados posibles por acción? ¿Cuándo se fijan tiradas y eventos externos? ¿Cómo evita que preview y confirmación discrepen? Referir política de revisión y tiradas privadas.
6. ¿Cómo se define el lote inicial y la ventana móvil de anticipación mientras se juega (profundidad, horizonte temporal, presupuesto, umbral de reposición, prioridades)? ¿Se cubren todas las opciones legales de la escena actual antes de ampliar niveles posteriores? ¿Quién orquesta la cola y cancela/reprioriza tras elegir?
7. ¿Qué ocurre si el jugador avanza más rápido que la generación, hay cache miss, un fallo del modelo, un cambio de estado o una acción no prevista? ¿Esperar, usar plantilla autorizada o restringir temporalmente opciones? Definir fallback sin improvisar resultados ni revelar secretos.
8. ¿Se reutilizan ramas/fragmentos entre sesiones y campañas? ¿Qué define equivalencia, aprobación provisional, granularidad, parámetros de personalización, idioma, versiones, dependencias e invalidación? ¿Se reutiliza texto/arte independientemente de tiradas y estado? ¿Cómo tratar secretos y contenido de distinto jugador?
9. ¿Qué trabajo será batch real del proveedor, llamada con varios eventos, o cola de trabajos agrupados? ¿Dónde se ejecuta durante partida, con qué persistencia y límites de latencia/coste? Separar requisitos de arquitectura de decisiones de proveedor aún abiertas.

### Contratos y presentación
10. ¿Podemos acordar ejemplos JSON reales del piloto para entrada de narración, lote, resultado y confirmación? Incluir IDs de campaña, acción, rama, evento y chequeo, revisión base, actor/ubicación, hechos visibles, estado relevante antes/después, dependencia, visibilidad, idioma y versiones. Indicar qué campos existen y cuáles son propuestas; no crear segundo esquema.
11. ¿Qué contrato separa resultado especulativo, evento confirmado y fixture simulado? ¿Quién valida la coincidencia de rama, transacción idempotente, conflictos, efectos Ripple, inventario y conocimiento? ¿Qué contexto puede recibir la IA y qué se mantiene exclusivamente en servidor?
12. ¿Dónde están los contratos únicos de ficha, inventario, mapa, diario, combate y check-contract.mjs? ¿Qué API/adaptador está previsto para el libro? ¿Cómo representamos texto, diálogos, ilustraciones, anotaciones de chequeo, acciones y componentes sin resolver reglas en UI? ¿Qué estados muestra la interfaz si un fragmento está pendiente?
13. ¿Qué fixtures y pruebas existentes podemos reutilizar (piloto de 39 trabajos, contexto, combate)? Solicito una corrida de referencia reproducible sin semillas privadas reales y ejemplos de éxito/fallo, efecto Ripple, cambio de estado, conocimiento oculto y ramas que convergen.

### Entregas y dependencias
14. Confirmar prioridades, criterios de aceptación y quién desbloquea cada contrato. ¿Existe una cola o código narrativo previo que deba extenderse en vez de reemplazarse? ¿Cuál es el próximo hito integrado y qué puede implementarse ya con datos simulados?

## D. Propuesta de tareas para acordar
| ID existente | Narración/presentación | Dependencia y criterio |
|---|---|---|
| N01 | Biblia del mundo | Canon y referencias, IDs existentes, hechos vs rumores vs propuestas |
| N02 | Stormkeep, NPC y facciones | Agendas y relaciones propuestas, validación del motor |
| N03 | Referencias lore | Sin coordenadas arbitrarias ni duplicar grafo |
| N09 | Primera aventura West Marches | Situación abierta, rutas y dependencias mínimas; corredor materializado por simulación |
| N04 | Contrato narrativo por lotes | Acordar con simulación ejemplos de preview/confirmación y visibilidad |
| N05 | Caché y cola de fragmentos | Acordar propiedad de orquestación, equivalencia, versiones, presupuesto y fallback; no asumir backend definitivo |
| N06 | Composición libro V2 | Adaptar eventos y fragmentos al lector existente; fixtures marcados y chequeos únicos |
| N07 | Arte/presentación móvil | Reutilizar componentes y assets autorizados, sin fork visual independiente |
| N08 | Skill y documentación | Incorporar decisiones acordadas y ejemplos originales verificables |

**Primera prueba integrada propuesta:** un tramo de Stormkeep con varias decisiones autorizadas y resultados del piloto. Generar lote por adelantado, almacenar fragmentos, verificar que seleccionar una opción sólo confirma su rama y usa contenido compatible, mientras se prepara el siguiente lote. Probar cambio de revisión, caché vacía y ausencia de filtración de hechos privados. Sin afirmar que ya funciona.

## E. Cómo responder
Por favor, registrar una entrega nueva en updates/coordinacion o updates/world-engine, con referencia a esta consulta y respuestas numeradas 1–14 (confirmado / decidido / pendiente / bloqueado, ruta o enlace y responsable). Si una respuesta ya existe, enlazar documento/contrato y sección en lugar de duplicarlo. Si hace falta, adjuntar un Markdown bajo public/docs/ con el detalle y enlazarlo desde el registro. No editar esta nota histórica. Una vez consensuado, actualizar los skills/contratos canónicos y el backlog por los propietarios correspondientes.


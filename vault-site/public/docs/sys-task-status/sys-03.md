# SYS-03 · Contexto y reacción NPC

- Agente: SYS-03.
- Estado: en revisión (candidato sintético, no validado).
- SHA base: ebe06f9f5aac2968b7f3f74b2f627ebe062faa92.
- Rama: feature/sys-03-npc-context.
- PR: se abrirá contra development; ver rama/PR asociado.
- Dependencias: SYS-01 API real master-rules-v1 (no está en la base), SYS-02 proveedor RNG, SYS-04 compilador, SYS-05 narrador, SYS-08 canon y SYS-09 revisión.

## Entregables y contrato candidato (privado)
`simulation/branch-npc-context.mjs`, `branch-npc-fixture.mjs`, `test-branch-npc-context.mjs`. Nuevos archivos solamente. El consumidor debe resolver el mundo efectivo con world-context.effective(base,delta) y construir entradas desde autoridad server-side, nunca desde UI. El constructor valida actores co-localizados, referencias, revisión, perfil, intención, percepciones explícitas y conocimiento con evidencia. Un valor null significa desconocido; listas vacías significan observado sin elementos. No se infiere raza, clase, género, prejuicio ni conocimiento global. Los hechos verdaderos se conservan por separado de creencias, que pueden ser erróneas. El estado relevante es un mapa escalar acotado por el preparador, no una nueva ficha; snapshotId/worldRevision son referencias a verificar en SYS-04/06. El preparador es responsable de verificar procedencia de observaciones, perfil, evidencias y autorización; este módulo no es ACL. No almacenar contexto en Hosting.

buildBranchContext(input) → contexto privado versionado; contextKey(context) → JSON canónico privado (SYS-05 puede hashearlo, no publicarlo). evaluateReaction(context,policy,{production}) → postura, IDs de opciones legales filtradas por política de autoría, traza de predicados y versión de política. Reglas en orden de prioridad explícito, primera coincidencia; desconocido no coincide; fallback explícito de incertidumbre. El módulo propone postura y opciones, no redacta ni toma decisiones por el narrador, no confirma transición. No contiene sesgos predefinidos. El modo production requiere política aprobada por caller; aprobación efectiva debe verificarse en backend.

prepareSocialCheck(context,{authorization,world,callMasterRules,rollD100}) solo en preparación privada, no en confirmación. Conversación rutinaria sin llamada ni dado. Autorización explícita por rama, revisión, intención y evento; dificultad y razón obligatorias. Engaño vs Perspicacia / Influencia vs Voluntad, sobre fichas efectivas existentes. checkProfile previo a tiradas; checkOpposed conserva resultado sin interpretarlo como consentimiento ni cambiar mundo. El caller conserva resultado preparado; no llamar nuevamente en replay. RNG recibe dirección estructurada sin semilla. La política nunca otorga paso/consentimiento. SYS-04 verifica opciones y transición; SYS-05 recibe contexto por branchId/revisión, selecciona sólo hechos autorizados para audiencia; SYS-06 garantiza privacidad y autoridad. Compatibilidad conceptual con PR #7 (requiredBranches/narrationByBranch); no modificarlo. No conectar hasta acuerdo cruzado.

## Pruebas y criterios
- PASS: 31 aserciones sintéticas ejecutadas sobre las mismas funciones JavaScript que se serializan al módulo/test: guardia neutral/hostil/alertado, conocimiento oculto, creencia falsa, incertidumbre, reproducibilidad, opciones y traza, política no aprobada, conversación sin dado, oposición autorizada y bloqueada, habilidades correctas y ausencia de consentimiento. Adaptador mock explícito, no ejecución de Mythras.
- SKIP: Node --test simulation/test-branch-npc-context.mjs, suite completa, preflight, build-activity y validate: sin checkout por DNS del entorno. Ejecución reproducible: cd vault-site && node --test simulation/test-branch-npc-context.mjs.
- SKIP: API real y RNG común; integrar después de SYS-01/02. Fixtures no son canon de Stormkeep. Criterio de entradas válidas a API real pendiente: perfiles mock no son fichas Mythras completas.
- No validar H01 ni promover a producción.

## Coordinación
Leídos AGENTS, COORDINACION, plan SYS-03, commits/PRs activos, actualizaciones de contexto de diálogo y módulo 01, contrato QA-02 y compilador. npc-decisions.mjs es obsoleto; no reutilizado. No editar libro, resolvedores, world-context, catálogo/índice generado ni original privado. SYS-09: revisar contrato, ejecutar tests Node y suite, acordar integración con SYS-01/02/04/05/06/08; consolidar actividad/tablero. No se ha desplegado.

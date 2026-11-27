# SYS-02 · Servicio común de azar determinista
Fecha: 27/11/2026. Agente: SYS-02 (Simulación). Estado: en revisión parcial; integración bloqueada por coordinación de consumidores. No validado.
Base: development, ebe06f9f5aac2968b7f3f74b2f627ebe062faa92. Rama: feature/sys-02-deterministic-rng. PR: [#14 (borrador hacia development)](https://github.com/sebasu66/pocketDM/pull/14).
Prioridad P0 del plan SYS; QA-04 (P1 histórico), ADV-C06/C10.

## Fuentes y coordinación
Leídos dm/sistema/index.html (SYS-02/01/04/06/09), qa-playable-stormkeep.md (QA-04), advanced-combat-spec.md, finite-adventure-compiler.md, actividad versionada updates/coordinacion/act-20261127-dm-system-001.json, act-20261127-vercel-services-candidate-001.json y act-20261125-qa-04-001.json. El índice generado public/data/activity.json no está versionado en la base; se consultaron sus fuentes. PRs abiertos #2, #3, #5, #6, #7; candidato b512e0385def9e782acf49ecb148bd188da238c8. En development, engine.mjs ya contiene newSeed/die HMAC con rechazo de sesgo de módulo. duel.mjs tiene labRoller secuencial. master-rules.mjs candidato contiene roller(x) direccionado con die, no se encontró export addressedRoll en la base/candidato inspeccionado. No se modifican resolvedores, compilador, UI, API ni estado compartido.

## Entrega y contrato propuesto para SYS-01/04/06
- vault-site/simulation/rng.mjs: export newSeed (existente), addressedRoll, createCombatRoller, createLegacyCombatRoller y editorialIndex.
- vault-site/simulation/test-rng.mjs: 6 casos automatizados.
- Este informe. No editar índice/actividad compartidos; SYS-09 puede consolidar esta entrega.
- Código: 510725d4072ebafaee98f045f221f23acb566c0b; tests: de395d698b4bbceb79bdb6c1c65537061f3ce354.
- Importar exclusivamente en servidor. Semilla privada generada/recuperada por autoridad, nunca del jugador. No serializar proveedor, semilla, direcciones futuras ni edición privada. El módulo no sustituye autenticación/validación HTTP de SYS-06.
- addressedRoll({seed,address:{moduleId,branchId,eventId,purpose,ordinal,actorId?},sides,version:'pocketdm-addressed-v1'}) devuelve entero 1..sides, 2..1000000 caras; ordinal entero no negativo explícito; IDs no vacíos. Versión desconocida rechazada. HMAC existente, dominio simulation y tuple canónica con caras. Sin contador global.
- createCombatRoller({seed,moduleId,branchId,eventId,actorId?}) devuelve (sides,purpose,ordinal) => entero; propósito estable del resolvedor (incluye actor/acción cuando proceda), ordinal explícito. Usar identidad semántica estable, no índice de una lista mutable. Para comparación de políticas, conservar dirección de draws homólogos y semillas emparejadas. No promete igualdad de todos los eventos si las decisiones divergen.
- createLegacyCombatRoller({seed,address:encounterId}) conserva exactamente la fórmula del candidato master-rules-v1 para propósitos/ordinales válidos; no cambiar ediciones existentes a la nueva versión. El piloto conserva die y RULES sin cambios; el laboratorio secuencial histórico conserva labRoller. No simular independencia mediante contador secuencial.
- editorialIndex({seed,address,count}) devuelve índice base cero con dominio editorial independiente; usar semilla editorial privada separada y nunca sus elecciones como dados mecánicos. Guardar versión con preparación; confirmación/reintento usa resultados preparados sin tirar otra vez.
- Ejemplo sintético: address={moduleId:'mod',branchId:'branch',eventId:'event',purpose:'attack',ordinal:0,actorId:'hero'}; semilla sintética sys02-public-test-fixture; D2/D6/D20/D100/D1000000 => 1/5/8/3/458257. No semillas de partida.

## Evidencia
Ambiente local Node v22.16.0; git remoto inaccesible desde contenedor (DNS). Ejecutado node --test test-rng.mjs con copias exactas de rng.mjs y test-rng.mjs (blob SHA verificados con git hash-object y GitHub: 6f70479ae6f879e83251e68d103515f6e5277f5c y aaaea941c8bcf085ea38e9ce044c5810dbb697c5) y extracto exacto de die/newSeed/RULES de engine.mjs de la base. No equivale a checkout ni CI.
| Caso | Resultado |
|---|---|
| Vectores fijos y versión | PASS local |
| Replay de draws, orden, diagnóstico y dominio editorial; 64 semillas emparejadas sintéticas | PASS local |
| Validación de caras/dirección/versión/ordinal | PASS local |
| Compatibilidad candidato, 27 combinaciones y vector fijo | PASS local |
| Distribución D6 y D100, 12.000 draws por dado, chi-cuadrado de humo | PASS local |
| Semilla nueva y salida numérica del proveedor, no serialización de closure | PASS local |
| Regresión completa del piloto y laboratorio, replay de encuentros reales y políticas reales | SKIP: checkout/CI no ejecutado aquí |
| Privacidad extremo a extremo API/Hosting/proyección | SKIP: SYS-06/09; no afirmar seguridad por prueba unitaria |
6 PASS, 0 FAIL en el módulo aislado. Los SKIP externos no cuentan como aprobados.
Reproducción desde checkout de la rama: cd vault-site && node --test simulation/test-rng.mjs; luego node --test simulation/test-*.mjs.

## Bloqueos y siguiente paso para SYS-09
1. SYS-01 debe confirmar adopción del adaptador y auditar estabilidad de propósitos/ordinales; el duel.mjs de development llama roll(sides) sin dirección, por lo que no puede migrarse sin cambiar resolvedor. Candidato permite roll(sides,purpose,ordinal). No hubo acuerdo explícito con otros agentes en esta conversación.
2. SYS-04 debe confirmar IDs semánticos y versión persistida para preparación/replay, SYS-06 autoridad de entrada y proyección. Entregar contrato mediante este informe y PR; sin afirmar que otros agentes lo leyeron.
3. SYS-09 ejecutar suite sobre SHA del PR, revisar privacidad y regresiones del laboratorio/piloto, comparar políticas de combate reales, verificar integración y consolidar actividad; no marcar validado antes de ello.
4. No se hizo merge ni despliegue a producción.

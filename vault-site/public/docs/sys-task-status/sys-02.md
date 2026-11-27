# SYS-02 · Servicio común de azar determinista
Fecha: 27/11/2026. Agente: SYS-02 (Simulación). Estado: en revisión parcial; integración bloqueada por coordinación de consumidores. No validado.
Base: development, ebe06f9f5aac2968b7f3f74b2f627ebe062faa92. Rama: feature/sys-02-deterministic-rng. PR: [#14 (borrador hacia development)](https://github.com/sebasu66/pocketDM/pull/14).
Prioridad P0 del plan SYS; QA-04 (P1 histórico), ADV-C06/C10.

## Fuentes y coordinación
Leídos dm/sistema/index.html (SYS-02/01/04/06/09), qa-playable-stormkeep.md (QA-04), advanced-combat-spec.md, finite-adventure-compiler.md, actividad versionada updates/coordinacion/act-20261127-dm-system-001.json, act-20261127-vercel-services-candidate-001.json y act-20261125-qa-04-001.json. El índice generado public/data/activity.json no está versionado en la base; se consultaron sus fuentes. PRs abiertos #2, #3, #5, #6, #7; candidato b512e0385def9e782acf49ecb148bd188da238c8. En development, engine.mjs ya contiene newSeed/die HMAC con rechazo de sesgo de módulo. duel.mjs conserva labRoller secuencial para diagnóstico; la suite de campaign-state confirma un camino de duelo direccionado existente. master-rules.mjs candidato contiene roller(x) direccionado con die, la revisión del checkout completo confirmó además addressedRoll(seed,address,sides) y combatRoller(seed,scope) en campaign-state.mjs, versión addressed-d100-v1. Corrección al inventario inicial: este proveedor existe y debe conservarse; no editar campaign-state sin SYS-06. No se modifican resolvedores, compilador, UI, API ni estado compartido.

## Entrega y contrato propuesto para SYS-01/04/06
- vault-site/simulation/rng.mjs: export newSeed (existente), addressedRoll, createCombatRoller, createLegacyCombatRoller y editorialIndex.
- vault-site/simulation/test-rng.mjs: 6 casos automatizados.
- Este informe y registro individual nuevo vault-site/updates/combate/act-20261127-sys02-rng-001.json. No se editó índice ni actividad compartida; SYS-09 puede consolidar esta entrega.
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

## Nueva evidencia: checkout completo en equipo autorizado
27/11/2026. El bloqueo de acceso al checkout fue superado en equipo Windows autorizado, Git 2.51.1.windows.1, Node v24.14.1. Clone aislado de feature/sys-02-deterministic-rng, SHA exacto 796fa98350233ec2e66ca9671f122f97d37a83cf; git status limpio. No se modificó el checkout de trabajo de otros agentes.
- cd vault-site && node --test simulation/test-rng.mjs: 6 PASS, 0 FAIL, 0 SKIP, exit 0.
- node --test simulation/test-*.mjs: 118 tests, 110 PASS, 0 FAIL, 8 SKIP, exit 0. Duración reportada 797.7578 ms.
- PASS incluidos: replay de todas las transiciones del piloto, replay del duelo direccionado existente, propósitos únicos, tiradas ajenas, políticas emparejadas, regresiones del laboratorio, proyección del jugador sin secretos/futuros, chequeos de libro.
- SKIP: siete pruebas de Firestore aislado y recuperación de módulo desde Firestore (ocho en total). Sin emulador ni pruebas HTTP del sistema integrado.
- Inventario corregido: campaign-state.mjs exporta RNG_VERSION='addressed-d100-v1', addressedRoll(seed,address,sides) = die(seed,[RNG_VERSION,...address],sides) y combatRoller(seed,scope). La versión propuesta pocketdm-addressed-v1 no sustituye automáticamente esa versión histórica ni master-rules-v1. SYS-06/01/04 deben acordar extracción/reexportación del proveedor existente hacia el módulo común y preservar vectores de ambas versiones históricas antes de integrar. No se modifica el contrato compartido unilateralmente.
- Estos resultados sustituyen los SKIP de regresiones base anotados arriba; no acreditan la combinación de PRs SYS ni una nueva migración de laboratorio/HTTP.

## Bloqueos y siguiente paso para SYS-09
1. SYS-01 debe confirmar adopción del adaptador y auditar estabilidad de propósitos/ordinales; el laboratorio conserva proveedor secuencial histórico y campaign-state tiene un proveedor direccionado que pasa regresiones; distinguir ambas rutas y acordar migración con SYS-01/06. Candidato permite roll(sides,purpose,ordinal). No hubo acuerdo explícito con otros agentes en esta conversación.
2. SYS-04 debe confirmar IDs semánticos y versión persistida para preparación/replay, SYS-06 autoridad de entrada y proyección. Entregar contrato mediante este informe y PR; sin afirmar que otros agentes lo leyeron.
3. SYS-09 ejecutar suite sobre SHA del PR, revisar privacidad y regresiones del laboratorio/piloto, comparar políticas de combate reales, verificar integración y consolidar actividad; no marcar validado antes de ello.
4. No se hizo merge ni despliegue a producción.

## Iteración 3: compatibilidad QA-01 y regresión completa con emulador
- Código probado: 52ac471c8ae555839be8ac31990bdf0257cd057d, rama SYS-02. Se agregaron LEGACY_CAMPAIGN_VERSION, legacyCampaignRoll(seed,address,sides), createLegacyCampaignRoller(seed,scope), sin modificar archivos de consumidores.
- Coincidencia exacta del adaptador con addressedRoll y combatRoller reales de campaign-state para 27 combinaciones de propósito/ordinal/caras; copia defensiva de scope y validación de semilla/dirección. La validación rechaza entradas inválidas de forma anticipada; no cambia draws válidos.
- Prueba nueva: simulateDuel real Galahad/lobo con createCombatRoller, replay completo, propósito/ordinal únicos, diagnóstico ajeno y draws homólogos con políticas tácticas/no tácticas emparejadas. El campo seed del laboratorio recibe únicamente el marcador privado, no la semilla. No se modifica el proveedor secuencial por defecto de la UI.
- SYS-04 confirmó direcciones semánticas persistentes y RNG versionado en preparación, ninguna tirada al confirmar (PR #12 comentario 7225000856). Ratificación SYS-01/06 sobre reexportación todavía pendiente.
- Propuesta para SYS-06: reexportar legacyCampaignRoll como addressedRoll, createLegacyCampaignRoller como combatRoller y LEGACY_CAMPAIGN_VERSION como RNG_VERSION al integrar, conservando firma y versión. SYS-01: usar createLegacyCombatRoller para ediciones antiguas; new provider para nuevas preparaciones, según versión persistida. No hacer esos cambios compartidos sin acuerdo.
- Windows, Node 24.14.1, Java Temurin 21.0.9, Firestore emulator 1.22.0, proyecto exclusivamente demo-pocketdm-qa03, 127.0.0.1:18382, reglas simulation/firestore-qa.rules. Se verificó puerto libre, se inició el emulador propio, se detuvo al finalizar. No se conectó a nube.
| Prueba | Resultado |
|---|---|
| node --test simulation/test-rng.mjs | 8 PASS / 0 FAIL / 0 SKIP, exit 0 |
| node --test simulation/test-*.mjs (sin emulador) | 112 PASS / 0 FAIL / 8 SKIP, exit 0 |
| node --test simulation/test-*.mjs (con emulador demo) | 120 PASS / 0 FAIL / 0 SKIP, exit 0 |
| node scripts/build-activity.mjs | PASS, 108 registros, exit 0 |
| node scripts/validate.mjs | PASS, exit 0 |
- Las 8 pruebas antes omitidas por falta de emulador se ejecutaron satisfactoriamente. Evidencia local sobre SHA probado, no CI. El build de actividad se ejecutó antes de anexar la entrada nueva.
- development observado c3b21f6024c899ca1c45934b75a7665a31757eb9 (SYS-10 añadido); no se afirma ejecución sobre esa revisión ni combinación de PRs. Pendientes: consolidar consumidores al ratificar contratos, replay con compilador real y privacidad HTTP/Hosting, revisión SYS-09. Estado sigue en revisión, sin merge remoto ni despliegue.

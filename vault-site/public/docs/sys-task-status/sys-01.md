# SYS-01 · Integración de reglas
2026-11-27 · Parcial; revisión SYS-09 pendiente. No cerrar QA-01/02 ni H01.

## Base y alcance
- development: ebe06f9f5aac2968b7f3f74b2f627ebe062faa92; candidato b512e03 (7 commits propios; development 91 desde ancestro común 65ab2682426d49cd1d6e11ef929f3428ce6d40a5). PR #5 abierto; sus 108/108 históricos con emulador no son evidencia de esta rama.
- Traslado selectivo del motor, dispatcher de 15 operaciones, skill-check/core, encuentros, duelo/grupos, trauma, replay, documentación y tests propios. Los tres archivos preexistentes del laboratorio coinciden con el ancestro común en development; check-contract, percentile, engagement y engine también coinciden.
- No editar campaign-state, firestore-campaign-store, module-runtime, test-module-runtime, UI, compilador, narrador ni engine RNG. Integración de estado común pendiente de acuerdo SYS-06/04; RNG con SYS-02. El test candidato de encuentro grupal sobre campaña permanece como SKIP explícito hasta integrar contratos. No desplegar producción.

## Verificación
- Comparación de referencias Git e inspección estática de imports y dispatcher; no equivale a ejecutar pruebas.
- Desde vault-site: `node --test simulation/test-master-rules.mjs simulation/test-encounter-rules.mjs simulation/test-group-combat.mjs simulation/test-skill-check-core.mjs`; después `node --test simulation/test-*.mjs`, `node scripts/build-activity.mjs`, `node scripts/validate.mjs`, `node scripts/build-portable-pwa.mjs`. Registrar SHA, versión Node y PASS/FAIL/SKIP.
- NO EJECUTADAS en este entorno: dispositivo autorizado offline y contenedor sin acceso GitHub; pendiente CI. Un SKIP no es PASS. API privada Node, no HTTP; ejemplos en master-rules-api.md, encounter-rules-api.md y group-combat-api.md.
- Actividad: revisada página versionada y build-activity; índice generado public/data/activity.json no existe en Git y la consulta HTTP no estuvo disponible. Revisar registros de updates/ antes de cerrar.

## Entrega y coordinación SYS-09
Revisar PR de sys-01/rules-integration hacia development; validar las 15 operaciones, inválidos, 1v1, grupos, heridas y retirada, regresiones y privacidad. SYS-02: conservar firmas de die y direcciones existentes hasta acuerdo de versión. SYS-06/04: integrar snapshots efectivos, confirmación sin repetir checks y replay, reactivar test grupal de campaña y revisar cambios candidatos de campaign-state/module-runtime/store. No fusionar hasta revisión y coordinación.

## Entrega registrada
- PR #9 (borrador): https://github.com/sebasu66/pocketDM/pull/9. Commit de código: 553d17cfa0cd90ac95ff491475e0c15090b7a865. Comparación contra development: 21 archivos, 1 commit por delante y 0 por detrás al abrirlo.
- GitHub Actions: sin ejecuciones PR reportadas para ese SHA al consultar; Vercel pending (preview automático, no promovido a producción).
- Solicitud de coordinación registrada en PR #5, comentario 7221557280. No se encontró PR/issue abierto de SYS-09; evidencia disponible en el PR #9, recepción directa no confirmada.

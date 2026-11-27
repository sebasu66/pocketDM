# SYS-04 · Compilador de ramas

27/11/2026 · Agente SYS-04 · Estado: en curso.

- Base: development @ `ebe06f9f5aac2968b7f3f74b2f627ebe062faa92`.
- Rama: `feature/sys-04-compilador-ramas`. PR pendiente.
- Plan: `/dm/sistema/#sys-04`; MOD-01/02/03/04, QA-07.
- Dependencias: SYS-01 reglas, SYS-02 azar, SYS-03 contexto, SYS-08 bindings autorizados; coordinación de confirmación con SYS-06 y slots con SYS-05.
- Zona: `simulation/adventure-compiler.mjs`, módulos de compilación y tests propios. No editar motor compartido, canon, persistencia ni libro unilateralmente.
- Auditoría inicial: el piloto vuelve a resolver al confirmar; `module-runtime` solo acepta fixture y `campaign-state` tiene ventana anticipada, no compilación finita publicada.
- Actividad: PRs activos de cola narrativa, checks pregenerados y candidato H01; pendiente inspección de registro generado (ausente en Git de development).
- Pruebas: pendientes (SKIP, no PASS).
- Próximo paso: conservar transición preparada, preparar contrato y pruebas sintéticas. No certificar módulo real ni H01.

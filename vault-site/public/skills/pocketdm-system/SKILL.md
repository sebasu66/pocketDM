---
name: pocketdm-system
description: Protocolo operativo para IA conectadas a PocketDM, creación de campañas y uso de simulación y narración.
---
# PocketDM System · v0.1
Contrato propuesto, no servidor MCP desplegado. Descubrir las herramientas reales antes de llamar; no inventar funciones ni declarar escrituras inexistentes.
## Flujo
Leer canon y revisión de campaña. Proponer entidades con IDs estables, restricciones y agendas. Enumerar acciones legales. Previsualizar ramas sin modificar estado. Entregar al narrador eventos visibles resueltos y contexto permitido. Guardar fragmentos por clave de contenido, contexto, idioma y versión. Confirmar únicamente la acción elegida mediante comando idempotente con revisión esperada. El servicio de estado aplica efectos de mundo y personaje una sola vez, en transacción. Ante conflicto de revisión, reconsultar.
## Capacidades MCP previstas (pendientes)
Consulta de campaña y entidades; propuesta y validación de mundo; enumeración de acciones; resolución/preview de ramas; registro y recuperación de narración; confirmación de comandos; historial y diario. El motor, no el libro ni el narrador, resuelve dados. Semillas privadas, IDs de tiradas estables y versión de reglas para reproducibilidad. Nunca mostrar ramas futuras ni secretos al jugador.
## Contrato de chequeos
Usar los campos del contrato existente check-contract.mjs. Una tirada visible corresponde a una anotación; factores no son tiradas adicionales.
## Coordinación
Consultar /actividad/ y Git antes de cambiar contratos. Simulación y generación de acontecimientos por un lado; narración y presentación por otro; un único personaje y estado de campaña.

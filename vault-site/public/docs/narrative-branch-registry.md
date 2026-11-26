# Registro de ramas y narración preparada

Pocket DM prepara la narración durante la autoría de la aventura. Durante la partida, la edición selecciona el fragmento aprobado que corresponde al estado confirmado y a la opción tomada. La edición necesita cobertura para las opciones que ofrece.

## Registro de autoría

El primer lote de autoría para Hald se guarda como `stormkeep-puerta-oriental.json` en la carpeta editorial de Pocket DM. La bóveda documenta el formato y el avance del lote. El archivo de trabajo se entrega al modelo por el canal de autoría. Los IDs y condiciones de este ejemplo describen solicitudes de autoría. Las acciones legales y sus resultados siguen a cargo de simulación.

| Campo | Uso |
|---|---|
| `requiredBranches[branchId]` | Contexto de esa situación, condiciones de entrada, rama precedente, hechos ya conocidos, prioridad, revisión del contexto y estado editorial. |
| `context` | Referencias compartidas al lugar y al NPC, variables perceptibles y restricciones de conocimiento. |
| `narrationByBranch[branchId]` | Texto preparado para esa situación. El contenido conserva el mismo ID y la revisión de contexto usada para escribirlo. |

Estados de una rama: `pendiente` (por escribir), `en_revision` (texto preparado), `aprobada` (texto validado para esa revisión de contexto). Si cambia un hecho que afecta a la prosa, se incrementa `contextRevision` y vuelve a revisión. Una rama heredada necesita los hechos que realmente quedaron establecidos. Una prioridad alta ordena el lote editorial y no altera las reglas del juego.

## Entrega al modelo de narración

Tomar la ficha pública del NPC y pasar el contexto común pertinente, luego una solicitud por rama con su ID, revisión, condiciones, historia conocida y dirección editorial. Pasar las líneas anteriores de la misma ruta si ya están preparadas; los briefs de autoría pueden redactarse sin ellas usando los hechos registrados. Pedir prosa en español, en texto plano, con una formulación completa por variante relevante. Devolver por cada trabajo `{ "branchId": "...", "contextRevision": 1, "variants": [{ "when": {}, "text": "..." }] }`. Dentro de `variants`, `when` expresa las condiciones adicionales dentro de esa rama. `{}` indica un texto general de esa rama y puede servir de respaldo. Variantes que alteran el estado requieren ramas propias.

Guardar cada resultado en `narrationByBranch`, con la misma revisión y el texto en revisión editorial. Validar que cada línea respete lo que sabe el NPC, lo que ya pasó, las consecuencias autorizadas y los perfiles que cubre. Una edición se declara lista cuando todos los caminos ofrecidos tienen texto aprobado hasta el siguiente punto de cierre o preparación.

## Clave de consulta y semilla

El compilador de prueba ya produce `narrativeJobs` con `key`, contexto `semantic`, estado `missing` o `candidate` y referencias a eventos y chequeos en `eventBindings`. Cada arista lleva su `narrativeKey`. Una clave candidata por sí sola todavía necesita cotejo con el fragmento y su revisión.

Para autoría se usa el diccionario **situación de la rama → narración**, con ID estable y revisión de contexto. Para una edición preparada, el compilador vincula el evento o arista a la variante aprobada que coincide con su clave semántica. Al ampliar el formato de producción, la equivalencia debe considerar versión de módulo y reglas, hechos narrables, resultado y contexto de esa rama, audiencia, idioma y versión del narrador. La semilla privada sirve para reproducir la simulación de una edición. Dos ramas de una misma semilla pueden requerir textos distintos. Los valores exactos de tirada y los IDs de chequeo se vinculan al evento confirmado.

Estado de integración: primer lote de autoría listo y compilador mecánico de prueba disponible. El modelo aún debe producir el primer lote. Queda por vincular las ramas de Hald a eventos autorizados de campaña y consumir sus fragmentos aprobados desde el lector.

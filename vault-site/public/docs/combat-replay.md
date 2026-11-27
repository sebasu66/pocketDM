# Contrato de registro de combate para narración gráfica
25/11/2026 · combat.replay schemaVersion 1

El evento confirmado de campaña, y antes el job privado de narración de la rama, incluyen combat.replay. Es una proyección mecánica de los intercambios reales, tanto del duelo como del combate grupal. No recalcular ni inventar golpes al redactar o ilustrar.

- initialActors / finalActors: identidad, especie, arma visible, localizaciones y HP, postura, aturdimiento, inconsciencia, incapacidad, muerte, miedo, fatiga y hemorragia.
- initiative: actorId, dado D10, total; order: IDs en orden de iniciativa.
- turns: orden sequence (base cero), id estable de turno, ronda (base uno), ciclo (base cero; null para efectos entre rondas), kind, actorId y targetId cuando corresponde.
- Acciones de ataque: weapon (id, name, natural, size, reach), defenseWeapon si parada, defense, hit, evaded, attackCheckId, defenseCheckId y checkIds. Los IDs referencian event.checks, no copias ni tiradas nuevas.
- Daño: localización, D20 si se tiró, dados de arma, bonificación, dados/modificador de daño, bruto, tras parada, armadura, neto, HP antes/después. hit no implica necesariamente daño neto positivo.
- Herida: id, localización, gravedad, resistencia, hemorragia, efectos y plazo si corresponde. opposedAgainst referencia el ataque original.
- Efectos: entitlement (derecho a efectos; no equivale a efectos ejecutados), effects (efectivamente aplicados), surpriseEffect, grip, rangeChange, cambios de alcance y resultado de liberación. En daño continuado por agarre, referenceAttackId vincula el ataque previo.
- changes: cambios efectivos por actor, campos de estado con before/after y cambios de HP/funcionalidad por localización. ap: AP restantes en orden combat.actorIds. kind round-state registra cambios entre rondas; fatigue registra su chequeo y cambios. initialActors + changes reconstruyen el estado visible final.

El narrador puede elegir encuadres, ilustraciones, prosa y agrupación de acciones sin cambiar los hechos. Para una viñeta de mordida, usar arma natural, objetivo, localización, postura, daño y estado posterior; si el daño es cero, no dibujar una herida causada por ese golpe. Los dados se muestran mediante el componente de chequeos existente. No interpretar un intento fallido como impacto.

Ejemplo real de fixture 1v2 con semilla de prueba: ronda 1, ciclo 0, Lobo B ataca a Galahad con mordida, D100 33, sin defensa, D20 de localización 4 (pierna izquierda), daño de arma 4, modificador -1, armadura 0, daño neto 3, HP 5 a 2, herida menor. No es una escena canónica.

Límites: no se han creado ilustraciones ni secuencias animadas nuevas; el lector actual todavía no consume replay como storyboard. El contrato registra mecánica, no coordenadas, orientación de cámara, coreografía física exacta ni todos los efectos especiales de Mythras. La pérdida automática de agarre al quedar incapacitado se deduce del estado y no tiene un evento gráfico propio. Las cifras exactas de HP y daño de participantes visibles forman parte de esta proyección de prueba; el narrador/validador decidirán qué cifras mostrar al jugador. No incluye semilla, inventario completo ni fichas privadas. El combate legado 1v1 conserva su política y confirmación determinista previa; el grupal conserva la transición preparada. No se afirma que una aventura real ya utilice estas trazas.

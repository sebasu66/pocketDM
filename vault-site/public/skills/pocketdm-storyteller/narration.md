# Narración a partir de hechos
## Entrada
Evento visible, estado previo y posterior autorizado, referencias de chequeos, lugar, personajes, contexto reciente, idioma y tono. El motor conserva la autoridad.
## Salida propuesta
eventId, locale, narratorVersion, fragments: [{type:"text",text:"..."},{type:"check",checkId:"..."}], illustrationHints, visibleChoices. No insertar HTML arbitrario ni información secreta. Las referencias de chequeos deben ser únicas y válidas.
## Ejemplo
Evento visible: Galahad intenta identificar un ruido; Percepción fallida; origen no identificado.
Texto: Galahad levantó la cabeza. Algo había quebrado el silencio, pero el viento borró el sonido antes de que pudiera reconocerlo. [Percepción · Fallo].
No escribir: dos lobos se aproximaban (si ese hecho todavía no es conocido).
## Estilo
Alternar acción, percepción y consecuencia; usar detalles con función narrativa. Las heridas, miedo y agotamiento se expresan según estado registrado, sin inventar sensaciones decisivas del PJ. Evitar redundancia entre texto, resultado y panel técnico. Una escena tranquila admite más atmósfera que un intercambio urgente.
## Validación
Comprobar actor, acción, resultado, ubicación, cronología, inventario, heridas, conocimiento, IDs de chequeos y opciones disponibles. El narrador no confirma acciones. Si faltan datos, pedir al motor contexto o marcar fragmento pendiente. Cachear por hechos, contexto autorizado, idioma y versión; invalidar cuando cambien.

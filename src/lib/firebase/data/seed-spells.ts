
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial spell data needed to seed the Firestore database.

export const hellfrostSpells = {
    "conjuros": {
      "aim": {
        "nombre": "Apuntar (Aim)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Mano fantasmal", "Ráfaga de viento", "Rastro de fuego"],
        "efecto": "El objetivo obtiene +2 a sus tiradas de Disparar o Lanzar; con un raise, el bono aumenta a +4. El bono no se aplica a Armas Pesadas [14, 15]."
      },
      "altered_senses": {
        "nombre": "Sentidos Alterados (Altered Senses)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Ojos de animal", "Brillo"],
        "efecto": "El objetivo gana Infravision o Visión en Baja Luz (elegido por el lanzador); con un raise, obtiene ambos (sin penalizaciones en Iluminación tenue u oscura, y -3 en Oscuridad Total contra objetivos que producen calor) [15, 16]."
      },
      "analyze_foe": {
        "nombre": "Analizar Enemigo (Analyze Foe)",
        "rango": "Experimentado",
        "alcance": "Visión",
        "duracion": "Instantáneo",
        "trappings": ["Gestos", "Palabras susurradas", "Mirada fija"],
        "efecto": "Con un éxito, el personaje discierne el número de Ventajas y Desventajas o habilidades especiales de un objetivo, así como el tipo de dado de su habilidad de ataque más alta. Con un raise, conoce los nombres de todas las Ventajas, Desventajas y habilidades especiales, y el dado de habilidad de ataque del objetivo. No afecta al objetivo ni permite tirada para resistir [16-19]."
      },
      "animate_war_tree": {
        "nombre": "Animar Árbol de Guerra (Animate War Tree)",
        "rango": "Heroico",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Hojas y ramas se animan"],
        "efecto": "Anima un árbol para que se convierta en un árbol de guerra [19-21]. (Descripción detallada de la criatura no incluida en las fuentes dadas)."
      },
      "arcane_resistance": {
        "nombre": "Resistencia Arcana (Arcane Resistance)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Runas o glifos en la piel", "Brillo tenue", "Ojos que brillan rojo, amarillo o negro"],
        "efecto": "El objetivo obtiene los beneficios de la Ventaja Resistencia Arcana (+2); con un raise, obtiene la versión Mejorada (+4). Los beneficios no se acumulan si el objetivo ya tiene estas Ventajas [19, 22]."
      },
      "aura": {
        "nombre": "Aura",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Frío", "Fuego frío", "Energía divina", "Electricidad", "Fuego", "Calor"],
        "efecto": "Al final del movimiento del objetivo, todos los personajes adyacentes sufren 2d6 de daño. Afecta a amigos y enemigos por igual. El objetivo del conjuro no se ve afectado por el aura [19, 23]."
      },
      "banish": {
        "nombre": "Desterrar (Banish)",
        "rango": "Veterano",
        "alcance": "Espíritu",
        "duracion": "Instantáneo",
        "trappings": ["Gesto arcano", "Liturgia", "Abre portal"],
        "efecto": "Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito y superando la tirada del objetivo, la criatura es devuelta a su reino. Solo afecta a criaturas con habilidades especiales de Demonio, Elemental o Etéreo [19, 23, 24]."
      },
      "battle_song": {
        "nombre": "Canto de Batalla (Battle Song)",
        "rango": "Experimentado",
        "alcance": "Especial (Plantilla de Ráfaga Mediana centrada en el lanzador)",
        "duracion": "Mantenido",
        "trappings": ["Poesía", "Canto de batalla"],
        "efecto": "Toda criatura dentro de una Plantilla de Ráfaga Mediana (excepto el lanzador) obtiene la Ventaja Berserk. Con un raise, las víctimas entran en Berserk inmediatamente. Las víctimas no dispuestas pueden hacer una tirada de Espíritu opuesta por la habilidad arcana del lanzador para resistir. Afecta a amigos y enemigos. Con una penalización de -2 a la tirada de habilidad arcana, el área aumenta a una Plantilla de Ráfaga Grande [19, 25, 26]."
      },
      "beast_friend": {
        "nombre": "Amigo Bestia (Beast Friend) (ALTERADO)",
        "rango": "Novato",
        "alcance": "Inteligencia x 100 yardas",
        "duracion": "Mantenido",
        "trappings": ["El mago se concentra y gesticula con las manos"],
        "efecto": "Permite al mago hablar con y guiar las acciones de bestias de inteligencia animal. No funciona con humanoides, ni animales conjurados, mágicos o 'antinaturales'. El tamaño de la bestia impone una penalización acumulativa de -1 por cada +2 puntos de Tamaño positivo (redondeando hacia arriba). Enjambres pequeños no dan penalización, medianos -1, grandes -2 [26-28]."
      },
      "becalm": {
        "nombre": "Calmar (Becalm)",
        "rango": "Novato",
        "alcance": "Visión",
        "duracion": "Mantenido",
        "trappings": ["El lanzador se para en cubierta y aspira aire", "Vientos tranquilos"],
        "efecto": "Un barco objetivo (solo uno) reduce a la mitad su Aceleración y Velocidad Máxima. Quienes estén a bordo de dicho barco obtienen +2 a las tiradas de Navegación durante tormentas [27-29]."
      },
      "bladebreaker": {
        "nombre": "Rompehojas (Bladebreaker)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "Instantáneo",
        "trappings": ["El arma se oxida", "Se parte por la mitad", "Se convierte en agua/hielo y se rompe", "Desaparece en una nube de humo"],
        "efecto": "Destruye un arma dentro del rango. Conjuro opuesto (habilidad arcana vs dado de daño del arma). Con un éxito, el arma se destruye permanentemente. Las reliquias tienen una bonificación a su tirada igual a cualquier modificador de tirada de ataque base, además de los bonos por dado de daño superior [28-30]."
      },
      "blast": {
        "nombre": "Explosión (Blast) (ALTERADO)",
        "rango": "Experimentado",
        "alcance": "24/48/96",
        "duracion": "Instantáneo",
        "trappings": ["Bolas de fuego/hielo/luz/oscuridad", "Rayos de colores", "Enjambre de insectos"],
        "efecto": "Daño de 2d6 en una Plantilla de Ráfaga Mediana. Si la tirada falla, la explosión se desvía como un proyectil lanzado. Con una penalización de -1 a la tirada de lanzamiento, el daño es 3d6 o el tamaño aumenta a una Plantilla de Ráfaga Grande. Con -2 de penalización, hace ambas cosas [28, 30, 31]."
      },
      "bless_panic": {
        "nombre": "Bendecir/Pánico (Bless/Panic)",
        "rango": "Experimentado",
        "alcance": "Espíritu",
        "duracion": "Mantenido",
        "trappings": ["Oración", "Palabras de aliento"],
        "efecto": "Con Bendecir, cada aliado del lanzador en rango gana +2 a las tiradas de Agallas, +4 con un raise. Pánico reduce las Agallas de todos los enemigos en rango en una cantidad similar [28, 31, 32]."
      },
      "bodyguard": {
        "nombre": "Guardaespaldas (Bodyguard)",
        "rango": "Novato",
        "alcance": "Casilla adyacente",
        "duracion": "Especial",
        "trappings": ["Soldado modelo"],
        "efecto": "Invoca un guardaespaldas robusto, totalmente bajo el control del héroe. Con un raise, el guardaespaldas es un Wild Card. El guardaespaldas se desmorona en polvo cuando es herido. Cuesta 10 gs por figura [28, 32, 33]. (Descripción de las estadísticas del guardaespaldas incluida en la fuente)."
      },
      "bridge": {
        "nombre": "Puente (Bridge)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Sólida pasarela de madera", "Pilar de piedra o hielo", "Muro de agua"],
        "efecto": "Crea un puente, cada sección cubre 2 yardas [28]. (Detalles adicionales no proporcionados en las fuentes)."
      },
      "champion_of_the_faith": {
        "nombre": "Campeón de la Fe (Champion of the Faith)",
        "rango": "Experimentado",
        "alcance": "Personal",
        "duracion": "Mantenido",
        "trappings": ["Aura sagrada"],
        "efecto": "El lanzador obtiene los beneficios de la Ventaja Campeón o Guerrero Sagrado (elegido al lanzar). No se acumula si el objetivo ya tiene la Ventaja [28, 34]."
      },
      "charismatic_aura": {
        "nombre": "Aura Carismática (Charismatic Aura)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Voz de mando", "Mirada intensa", "Personalidad encantadora"],
        "efecto": "El objetivo gana +1 de Carisma con un éxito o +2 con un raise [28, 34, 35]."
      },
      "confusion": {
        "nombre": "Confusión (Confusion)",
        "rango": "Experimentado",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Mirada aturdida", "Pérdida de coordinación"],
        "efecto": "Conjuro opuesto (habilidad arcana vs Astucia del objetivo). Con un éxito, la víctima pierde concentración y coordinación, sufriendo -2 a sus tiradas de rasgo durante la duración, -4 con un raise [28, 35]."
      },
      "corpse_senses": {
        "nombre": "Sentidos Cadavéricos (Corpse Senses)",
        "rango": "Experimentado",
        "alcance": "Astucia x 100 yardas",
        "duracion": "Mantenido",
        "trappings": ["Canto", "Mirar fijamente a un espejo", "Concentración"],
        "efecto": "El lanzador usa los sentidos de un cadáver animado por él mismo. No tiene control sobre el cadáver ni puede hablar a través de él. La conexión se rompe si el cadáver se sale del rango [36, 37]."
      },
      "detect_conceal": {
        "nombre": "Detectar/Ocultar (Detect/Conceal) (ALTERADO)",
        "rango": "Novato",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Palabras susurradas", "Gestos", "Sonido de 'ping'"],
        "efecto": "Reemplaza a `detectar/ocultar arcana`. Al detectar, el lanzador debe nombrar el tipo de objeto que busca (arcano, trampas, puertas secretas, oro o algo específico como un orco). Con -2 a la tirada, los objetos se vuelven visibles para cualquiera. Para 'ocultar', funciona como `ocultar arcana` estándar [37-40]."
      },
      "disease": {
        "nombre": "Enfermedad (Disease)",
        "rango": "Experimentado",
        "alcance": "Espíritu",
        "duracion": "Especial",
        "trappings": ["Tos", "Pústulas", "Fiebre", "Enfermedad debilitante"],
        "efecto": "Conjuro opuesto (Fe vs Vigor de la víctima). Con un éxito, la víctima desarrolla una enfermedad y sufre un nivel automático de Fatiga. Cada semana, debe hacer una tirada de Vigor (con -2 si el lanzador obtuvo un raise) o sufrir otro nivel de Fatiga (puede llevar a la Muerte). La Fatiga se recupera un nivel por día. Curación puede eliminar la enfermedad [37, 40, 41]."
      },
      "elemental_form": {
        "nombre": "Forma Elemental (Elemental Form)",
        "rango": "Veterano",
        "alcance": "Personal",
        "duracion": "Mantenido",
        "trappings": ["La naturaleza física cambia al elemento apropiado"],
        "efecto": "El lanzador convierte su propio cuerpo en materia elemental. Los elementalistas con varios elementos conocen el conjuro para todas sus escuelas [37, 41-43]. (Descripción de los beneficios específicos de la forma elemental no incluida en las fuentes)."
      },
      "energy_immunity": {
        "nombre": "Inmunidad a la Energía (Energy Immunity)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Aura protectora", "Piel metálica", "Burbuja de agua/aire"],
        "efecto": "Protege contra un elemento o trapping específico. El objetivo sufre la mitad de daño del elemento con un éxito, o inmunidad total con un raise [37, 42]. (Detalles de los elementos cubiertos pueden variar según el tipo de elementalista [43])."
      },
      "enhance_undead": {
        "nombre": "Mejorar No Muertos (Enhance Undead)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "Especial",
        "trappings": ["Piel pálida", "Garras", "Colmillos"],
        "efecto": "Otorga una Ventaja (Edge) a un no muerto dentro del rango, siempre que el no muerto cumpla los requisitos de Rango. Afecta a un no muerto; cada no muerto adicional después del primero otorga una penalización acumulativa de -1 a la tirada. Los no muertos permanecen mejorados durante 1 hora con un éxito, 1d6 horas con un raise, o un día entero con dos raises [37, 42, 44]."
      },
      "entangle": {
        "nombre": "Enmarañar (Entangle) (ALTERADO)",
        "rango": "Novato",
        "alcance": "Astucia",
        "duracion": "Especial",
        "trappings": ["Bomba de pegamento", "Enredaderas", "Esposas", "Telarañas"],
        "efecto": "Conjuro opuesto (habilidad arcana vs Agilidad del objetivo). Éxito: el objetivo sufre -2 a Paso y habilidades ligadas a Agilidad/Fuerza. Raise: el objetivo está completamente inmovilizado. Los enmarañados pueden intentar liberarse con tiradas de Fuerza o Agilidad. Un -1 de penalización a la tirada de habilidad arcana afecta a todos en una Plantilla de Ráfaga Mediana o a una criatura Grande. Con -2, afecta a todos en una Plantilla de Ráfaga Grande o a una criatura Enorme [37, 44, 45]."
      },
      "etherealness_corporealness": {
        "nombre": "Eterealidad/Corporeidad (Etherealness/Corporealness)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Forma espectral", "Translúcido", "Se convierte en forma elemental"],
        "efecto": "Con un éxito, el usuario se vuelve etéreo, incapaz de afectar el mundo material y el mundo material incapaz de afectarle (excepto la magia). Si se vuelve corpóreo 'dentro' de alguien/algo, ambos sufren daño. La corporeidad elimina la Habilidad Especial Etéreo de una criatura etérea [37, 45-48]."
      },
      "farsight": {
        "nombre": "Visión Lejana (Farsight)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Los ojos se vuelven de animal", "Brillan"],
        "efecto": "El objetivo recibe +2 a las tiradas de Notar dentro de su Astucia x 2, +4 con un raise. Puede discernir pequeños detalles hasta a 5 millas y figuras individuales hasta a 10 millas (sin detalles específicos como raza o sexo) [47-49]."
      },
      "fatigue": {
        "nombre": "Fatiga (Fatigue)",
        "rango": "Experimentado",
        "alcance": "12/24/48",
        "duracion": "Instantáneo",
        "trappings": ["La víctima se ahoga", "Energía sifonada por un canto fúnebre", "La temperatura desciende"],
        "efecto": "Afecta a una Plantilla de Ráfaga Mediana (Grande con un raise). Cada personaje en la plantilla debe hacer una tirada de Vigor opuesta por la habilidad arcana del lanzador. Con un fallo, sufre un nivel de Fatiga (hasta Agotado). La Fatiga se recupera a razón de un nivel cada 5 minutos de descanso [48-50]."
      },
      "feast": {
        "nombre": "Banquete (Feast)",
        "rango": "Novato",
        "alcance": "Espíritu",
        "duracion": "Instantáneo",
        "trappings": ["La comida aparece de la nada", "Bayas crecen en arbustos", "Animales de caza aparecen"],
        "efecto": "Invoca 5 libras de comida básica (no agua) por Rango de personaje del lanzador. La comida no puede ser invocada dentro de un objeto. Cualquier comida no consumida antes de la medianoche se echa a perder [48, 50, 51]."
      },
      "fog_cloud": {
        "nombre": "Nube de Niebla (Fog Cloud)",
        "rango": "Veterano",
        "alcance": "Personal (1 milla por Rango del personaje)",
        "duracion": "Mantenido",
        "trappings": ["La niebla surge del suelo"],
        "efecto": "Crea un área de niebla alrededor del lanzador. Reduces the quality of illumination by one step (toward Total Darkness), two steps with a raise. The caster suffers the penalties when inside the fog [48, 51, 52]."
      },
      "fortunes_favored": {
        "nombre": "Favorecido por la Fortuna (Fortune's Favored)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["La víctima brilla brevemente", "Capta destellos de eventos futuros", "Simplemente suerte"],
        "efecto": "Con un éxito, un objetivo que gasta un benny y falla el relanzamiento, puede hacer otro relanzamiento inmediato sin gastar un benny adicional. Solo se permite una tirada gratuita por benny [48, 52, 53]."
      },
      "gift_of_battle": {
        "nombre": "Don de Batalla (Gift of Battle)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Grito de guerra", "Discurso de aliento", "Percepción táctica"],
        "efecto": "El objetivo gana una Ventaja de Liderazgo con un éxito o dos con un raise, ignorando los requisitos de Rango, pero no otros requisitos de Ventajas [48, 53-55]."
      },
      "glyph": {
        "nombre": "Glifo (Glyph)",
        "rango": "Veterano",
        "alcance": "Especial",
        "duracion": "Especial",
        "trappings": ["Glifo dibujado o inscrito"],
        "efecto": "Almacena un conjuro para activarlo bajo un desencadenante predeterminado (máximo 10 palabras/2 cláusulas). Requiere Combinar Conjuros. Máximo de glifos activos igual a la mitad del dado de habilidad arcana. El lanzador sabe cuándo se activa un glifo. Se puede disipar o borrar (acción de tocar). La magia del glifo usa los rasgos del lanzador en el momento de su creación [54-57]."
      },
      "gravespeak": {
        "nombre": "Hablar con los Muertos (Gravespeak)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Voces susurradas", "Nubes de gas", "Espíritus agitados"],
        "efecto": "Permite al mortal contactar con un alma difunta. Solo es posible porque los dioses lo han permitido [58]. (Detalles de las preguntas/respuestas no incluidos en las fuentes, pero se asume que funciona como el conjuro 'Gravespeak' del Savage Worlds estándar). Si Hela intercepta, redirige a una de sus almas oscuras [58]."
      },
      "greater_zombie": {
        "nombre": "Zombi Mayor (Greater Zombie)",
        "rango": "Heroico",
        "alcance": "Espíritu x 2",
        "duracion": "Especial",
        "trappings": ["Liturgia oscura", "Sangre", "Polvo especial"],
        "efecto": "Funciona como el conjuro 'Zombi', but anima cadáveres como moradores de túmulos, hombres del pantano, ahogados o gorta wights (dependiendo de cómo vivieron y murieron). No puede crear nieblas de sangre, wights de escarcha, vampiros u otros no muertos. Las versiones mejoradas para crear monstruosidades existen para PNJ poderosos [55, 59]."
      },
      "growth_shrink": {
        "nombre": "Crecer/Encoger (Growth/Shrink)",
        "rango": "Experimentado",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Gestos", "Palabras de poder", "Pociones"],
        "efecto": "Crecer duplica la altura y masa del objetivo, aumentando su Tamaño en un paso con un éxito, dos con un raise, lo que a su vez aumenta su Fuerza y Dureza. Puede lanzarse varias veces en el mismo objetivo. Encoger funciona a la inversa [55, 60]."
      },
      "heat_mask": {
        "nombre": "Máscara de Calor (Heat Mask)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Ligero brillo", "Piel pálida"],
        "efecto": "La temperatura corporal del objetivo se enmascara para que coincida con la del aire circundante, negando la Infravision [55, 61]."
      },
      "insight": {
        "nombre": "Percepción (Insight)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Instantáneo",
        "trappings": ["Tocar objeto", "Brillo pálido", "Adivinación afortunada", "Voces susurradas"],
        "efecto": "El lanzador obtiene una visión, sensación o 'intuición' sobre un evento pasado reciente de una persona, lugar u objeto. Los raises otorgan más información a discreción del GM [55, 61, 62]."
      },
      "knockdown": {
        "nombre": "Derribo (Knockdown)",
        "rango": "Experimentado",
        "alcance": "Plantilla de Cono",
        "duracion": "Instantáneo",
        "trappings": ["Tierra ondulante", "Vientos impetuosos", "Muro de nieve"],
        "efecto": "Los objetivos en el cono deben hacer una tirada de Fuerza opuesta por la habilidad arcana del lanzador. Con un fallo, son derribados 1d4\" y quedan Prone. Si sacan un 1 (independientemente del Wild Die), quedan Sacudidos [55, 62, 63]."
      },
      "leaping": {
        "nombre": "Salto (Leaping)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Piernas poderosas", "Las piernas cambian a forma animal"],
        "efecto": "El objetivo suma +2\" a su distancia de salto, o +4\" con un raise [63-65]."
      },
      "lock_unlock": {
        "nombre": "Cerrar/Abrir (Lock/Unlock)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Especial/Instantáneo",
        "trappings": ["Cadena que aprieta", "Manos que se fusionan", "Viento gélido"],
        "efecto": "Hace una cerradura más difícil de abrir, o abre una cerradura. [65]."
      },
      "luck_jinx": {
        "nombre": "Suerte/Mala Suerte (Luck/Jinx)",
        "rango": "Veterano",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Brillo", "Presagio"],
        "efecto": "Con Suerte, el objetivo tira dos dados de rasgo y toma el mejor. Con Mala Suerte, el objetivo tira dos dados de rasgo y toma el peor [64, 65]."
      },
      "mend": {
        "nombre": "Remendar (Mend)",
        "rango": "Veterano",
        "alcance": "Toque",
        "duracion": "Instantáneo",
        "trappings": ["El vehículo se repara solo"],
        "efecto": "Repara el daño hecho al cuerpo de un vehículo de madera en la última hora. El lanzador se concentra una acción, luego lanza, restando una penalización igual a las heridas del vehículo. Un éxito remienda una herida; un raise remienda dos. No afecta golpes críticos [64, 65]."
      },
      "mimic": {
        "nombre": "Mimetizar (Mimic)",
        "rango": "Novato",
        "alcance": "Espíritu",
        "duracion": "Mantenido",
        "trappings": ["El lanzador brilla brevemente", "Gana conocimiento oculto"],
        "efecto": "El lanzador puede duplicar un conjuro que haya visto usar a un oponente durante el combate actual. El lanzador debe tener el Rango adecuado. Con un éxito, el mago obtiene el uso del conjuro mimetizado. Cada lanzamiento de 'Mimetizar' copia un conjuro específico [65-67]."
      },
      "mind_rider": {
        "nombre": "Jinete Mental (Mind Rider)",
        "rango": "Veterano",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Trance", "Runas en la cara", "Rostro del lanzador superpuesto al del objetivo"],
        "efecto": "Permite proyectar parte de la mente en la mente de un objetivo en rango. Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito, el lanzador puede percibir lo que el objetivo percibe y leer sus pensamientos superficiales. Si el objetivo es Sacudido, el contacto se interrumpe [65, 67, 68]."
      },
      "negate_arcana": {
        "nombre": "Negar Arcano (Negate Arcana)",
        "rango": "Veterano",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Señal arcana", "Explosión de energía mágica", "Campo de luces titilantes"],
        "efecto": "El lanzador coloca una Plantilla de Ráfaga Mediana (o Grande con -2 de penalización). Cualquier uso de magia en o a través de la plantilla se trata como si fuera contrarrestada por un poder de 'Disipar' automático basado en el dado de habilidad arcana del lanzador. Afecta a amigos y enemigos. No afecta reliquias ni dispositivos alquímicos [65, 68-70]."
      },
      "nightmare": {
        "nombre": "Pesadilla (Nightmare)",
        "rango": "Experimentado",
        "alcance": "Astucia x 1 milla",
        "duracion": "Especial",
        "trappings": ["Runas", "Sangre", "Alfileres en una muñeca"],
        "efecto": "La víctima sufre pesadillas terribles, impidiéndole dormir. Requiere conocer el nombre de la víctima y poseer algo suyo. Se mantiene hasta que la víctima duerma. Al dormir, la víctima hace una tirada de Espíritu (-2 si hubo raise del lanzador) o sufre pesadillas y tira en la Tabla de Pánico. Con fallo crítico, tira en la Tabla de Pánico con +2 [69-72]."
      },
      "obscure": {
        "nombre": "Oscurecer (Obscure)",
        "rango": "Novato",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Nubes de polvo", "Niebla", "Humo espeso"],
        "efecto": "Crea una nube opaca que oscurece la visión en el área. Funciona como el conjuro 'Obscure' del Savage Worlds estándar [73-75]. (Descripción detallada de efectos no en las fuentes)."
      },
      "precognition": {
        "nombre": "Precognición (Precognition)",
        "rango": "Veterano",
        "alcance": "Especial",
        "duracion": "Instantáneo",
        "trappings": ["Adivinación afortunada", "Augurios naturales", "Vislumbrar el futuro", "Piedras rúnicas"],
        "efecto": "El lanzador puede reorganizar dos cartas de acción (cuatro con un raise) para cualquier aliado o enemigo (incluido él mismo) en la ronda siguiente a la del lanzamiento. Las cartas deben moverse antes de que alguien actúe [70, 72, 76]."
      },
      "prolonged_blast": {
        "nombre": "Explosión Prolongada (Prolonged Blast)",
        "rango": "Veterano",
        "alcance": "24/48/96",
        "duracion": "Mantenido",
        "trappings": ["Fuego frío", "Electricidad", "Fuego", "Frío", "Charco de ácido", "Púas dentadas que brotan del suelo"],
        "efecto": "Crea un área donde cualquier criatura que pase sufre daño. Funciona como 'Blast', pero la plantilla permanece en juego durante la duración. Cualquier criatura que entre o comience su turno en la plantilla recibe daño [70, 76]."
      },
      "puppet": {
        "nombre": "Títere (Puppet)",
        "rango": "Veterano",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Ojos vidriosos", "Movimientos robóticos"],
        "efecto": "Permite al mago controlar la mente de una víctima. Funciona como el conjuro 'Puppet' del Savage Worlds estándar [35, 75, 77-80]. (Descripción detallada de efectos no en las fuentes)."
      },
      "quake": {
        "nombre": "Terremoto (Quake)",
        "rango": "Veterano",
        "alcance": "Astucia x 3",
        "duracion": "Instantáneo",
        "trappings": ["Tierra temblorosa", "Rocas que se abren", "Gritos subterráneos"],
        "efecto": "Causa un terremoto. Funciona como el conjuro 'Quake' del Savage Worlds estándar. Las paredes se desmoronan y se abren agujeros del ancho del terremoto [70, 81]."
      },
      "quickness": {
        "nombre": "Rapidez (Quickness)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Aura de velocidad", "Movimiento borroso"],
        "efecto": "Otorga al objetivo una acción adicional por ronda. Funciona como el conjuro 'Quickness' del Savage Worlds estándar [43, 70, 77, 80, 82-86]. (Descripción detallada de efectos no en las fuentes)."
      },
      "refuge": {
        "nombre": "Refugio (Refuge)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "12 horas",
        "trappings": ["Cabaña de madera", "Pequeña hacienda", "Iglú", "Vegetación que cubre un área"],
        "efecto": "Crea un refugio de 10x6x6 pies con Dureza 10. Otorga +2 a las tiradas de Vigor para resistir el frío (+4 con un raise). Un fuego dentro da +2 adicional. Se mantiene durante 12 horas. Se puede renovar [70, 81, 87]."
      },
      "regenerate": {
        "nombre": "Regenerar (Regenerate)",
        "rango": "Heroico",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Las heridas sanan sobrenaturalmente rápido"],
        "efecto": "El objetivo puede hacer una tirada gratuita de Absorción con -2 cada vez que es herido (sin modificador con un raise). No se acumulan otros modificadores a Absorción [70, 87-89]."
      },
      "sacrifice": {
        "nombre": "Sacrificio (Sacrifice)",
        "rango": "Veterano",
        "alcance": "Personal",
        "duracion": "Especial",
        "trappings": ["El espíritu de la víctima fluye hacia el lanzador", "Oleada de poder"],
        "efecto": "Permite al lanzador oscuro sacrificar un ser sintiente para obtener una bonificación a su próxima tirada de habilidad arcana. Gana +1 por cada tipo de dado de Espíritu del ser asesinado. Se pierde si el conjuro termina antes de usarse. Solo una víctima por lanzamiento [88-90]."
      },
      "sanctuary": {
        "nombre": "Santuario (Sanctuary)",
        "rango": "Novato",
        "alcance": "Especial",
        "duracion": "Instantáneo",
        "trappings": ["El lanzador desaparece en una bocanada de humo", "Es absorbido por un torbellino", "Se transforma en una columna de fuego"],
        "efecto": "Teletransporta al lanzador a una ubicación segura. Los personajes con Fe van a su templo más cercano. Los magos van a un lugar que hayan convertido en santuario (permanente o temporal). Puede llevar personas adicionales con -1 por persona [89, 91, 92]."
      },
      "sentry": {
        "nombre": "Centinela (Sentry)",
        "rango": "Experimentado",
        "alcance": "Astucia x 2",
        "duracion": "Especial",
        "trappings": ["Círculo de tiza, polvo o sangre", "Runa mística", "Báculo clavado en el suelo"],
        "efecto": "Crea un centinela fantasmal que vigila el campamento (Notice d8 o d10 con raise), siempre alerta y sin penalizaciones por poca luz. No es físico y no puede ser dañado. Otorga instrucciones (máximo 10 palabras) sobre cuándo dar la alarma. O protege un objeto tocado, alertando al lanzador si alguien que no sea de los nombrados lo toca. Expira al amanecer o al anochecer [89, 92-94]."
      },
      "shape_change": {
        "nombre": "Cambio de Forma (Shape Change) (ALTERADO)",
        "rango": "Veterano",
        "alcance": "Personal",
        "duracion": "Mantenido",
        "trappings": ["'Transformación'", "Talismán", "Tatuaje"],
        "efecto": "El lanzador se transforma en un animal mundano. Penalización a la tirada de lanzamiento según el tamaño de la criatura (Pequeño: 0, Mediano: -1, Grande: -2, Enorme: -4). Habilidades especiales de animal: -2. Transformarse en otra raza o criatura no animal: -2. Mimetizar una apariencia exacta: -2 (penaliza Notar en -4, -6 con raise). El personaje conserva su Astucia, Espíritu y habilidades vinculadas. Gana Agilidad, Fuerza y habilidades vinculadas del animal. La Vigoria es la más alta entre el héroe y la criatura [89, 95-99]."
      },
      "silence": {
        "nombre": "Silencio (Silence)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Gestos", "Bolsa encantada para capturar sonidos"],
        "efecto": "Crea un área de silencio total (Plantilla de Ráfaga Mediana) alrededor de un objeto inanimado. Con un raise, es una Plantilla de Ráfaga Grande. No se puede crear sonido dentro, pero se escucha el sonido exterior. La zona se mueve con el objeto. Los hechiceros que dependen del habla fallan automáticamente sus conjuros. Los monstruos con ataques basados en sonido pierden su poder temporalmente [89, 99, 100]."
      },
      "sluggish_reflexes": {
        "nombre": "Reflejos Lentos (Sluggish Reflexes)",
        "rango": "Experimentado",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Atar un nudo en una cuerda", "La víctima se cubre de hielo"],
        "efecto": "Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito, el objetivo saca una carta menos para la iniciativa. Las víctimas que normalmente sacan solo una carta, sacan dos y toman la más baja. Si sacan un Joker como primera carta, lo usan normalmente e ignoran el conjuro por la ronda [89, 101]."
      },
      "slumber": {
        "nombre": "Letargo (Slumber)",
        "rango": "Experimentado",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Cantar nana", "Gestos", "Soplar polvo a los objetivos"],
        "efecto": "Afecta a un oponente Pequeño o Mediano. Con -2 a la tirada de lanzamiento, afecta a todos en una Plantilla de Ráfaga Mediana o a una criatura Grande. Con -4, afecta a todos en una Plantilla de Ráfaga Grande o a una criatura Enorme. No afecta a constructos, demonios, elementales, fey, plantas o no muertos. Las víctimas deben hacer una tirada de Espíritu (-2 si el lanzador obtuvo un raise) o se quedan dormidas instantáneamente. Los ruidos fuertes despiertan a las víctimas [89, 102, 103]."
      },
      "smite": {
        "nombre": "Castigo Divino (Smite)",
        "rango": "Novato",
        "alcance": "Personal",
        "duracion": "Mantenido",
        "trappings": ["Arma que brilla", "Fuego sagrado", "Escarcha divina"],
        "efecto": "Un arma cuerpo a cuerpo obtiene un bono de +2 al daño. Funciona como el conjuro 'Smite' del Savage Worlds estándar [43, 74, 77, 82, 85, 86, 89, 104]. (Descripción detallada de efectos no en las fuentes)."
      },
      "speak_language": {
        "nombre": "Hablar Idioma (Speak Language)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["El objetivo comienza a tartamudear", "Una lengua invisible se extiende desde el lanzador"],
        "efecto": "El objetivo puede hablar y entender cualquier idioma que el lanzador conozca. Funciona como el conjuro 'Speak Language' del Savage Worlds estándar [75, 78, 83, 105, 106]. (Descripción detallada de efectos no en las fuentes)."
      },
      "speed": {
        "nombre": "Velocidad (Speed)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Ráfaga de viento", "Pies cubiertos de hielo"],
        "efecto": "Aumenta la velocidad de movimiento del objetivo. Funciona como el conjuro 'Speed' del Savage Worlds estándar [43, 77, 83, 84, 86, 106-108]. (Descripción detallada de efectos no en las fuentes)."
      },
      "sphere_of_might": {
        "nombre": "Esfera de Poder (Sphere of Might)",
        "rango": "Veterano",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Rocas giratorias", "Viento helado", "Fuego frío", "Electricidad"],
        "efecto": "Crea una esfera móvil de fuerza. Funciona como el conjuro 'Sphere of Might' del Savage Worlds estándar [103, 106, 109]. (Descripción detallada de efectos no en las fuentes)."
      },
      "storm": {
        "nombre": "Tormenta (Storm)",
        "rango": "Experimentado",
        "alcance": "10 millas",
        "duracion": "Mantenido",
        "trappings": ["Nubes que se forman", "Ráfagas de viento", "Relámpagos"],
        "efecto": "Crea una tormenta. Requiere 4 rondas de trabajo mágico antes de la tirada. Disipa una tormenta existente o crea una nueva. Reduce la visibilidad [51, 52]. Funciona como el conjuro 'Storm' del Savage Worlds estándar [43, 77, 83, 106]. (Descripción detallada de efectos no en las fuentes)."
      },
      "stun": {
        "nombre": "Aturdir (Stun)",
        "rango": "Novato",
        "alcance": "Astucia x 2",
        "duracion": "Instantáneo",
        "trappings": ["Chispas", "Onda de choque", "Grito"],
        "efecto": "El objetivo queda Aturdido. Funciona como el conjuro 'Stun' del Savage Worlds estándar [43, 73, 74, 77-79, 86, 106, 110]. (Descripción detallada de efectos no en las fuentes)."
      },
      "strength_of_the_undead": {
        "nombre": "Fuerza de los No Muertos (Strength of the Undead)",
        "rango": "Veterano",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Piel pálida", "Garras", "Colmillos"],
        "efecto": "El lanzador imita un rasgo o habilidad especial de un no muerto que está tocando durante la duración del poder (dos con un raise). El rasgo imitado reemplaza el rasgo del lanzador. El no muerto no pierde el rasgo o habilidad [106, 109]."
      },
      "succor": {
        "nombre": "Socorrer (Succor)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Instantáneo",
        "trappings": ["Imposición de manos", "Remedios herbales"],
        "efecto": "Elimina un nivel de Fatiga, o dos con un raise. No detiene hemorragias, no elimina Sacudidos, no revive incapacitados ni sana heridas. No elimina la causa de la Fatiga. La tirada sufre una penalización igual a la Fatiga de la víctima más cualquier herida o Fatiga del lanzador [106, 111]."
      },
      "summon_beast": {
        "nombre": "Invocar Bestia (Summon Beast)",
        "rango": "Veterano",
        "alcance": "Espíritu x 10 yardas",
        "duracion": "Mantenido",
        "trappings": ["El mago se concentra y gesticula con las manos"],
        "efecto": "Invoca una bestia natural bajo el control del invocador. Funciona solo en criaturas con inteligencia animal. El tamaño de la bestia invoca una penalización acumulativa de -1 por cada dos puntos de Tamaño positivo. Los enjambres pueden invocarse (Pequeño: 0, Mediano: -1, Grande: -2). La criatura aparece en rango y línea de visión. Permanece controlada hasta que el conjuro termina o es asesinada [106, 112-114]."
      },
      "summon_demon": {
        "nombre": "Invocar Demonio (Summon Demon)",
        "rango": "Veterano",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Sangre", "Incienso fétido", "Sacrificios", "Círculo de invocación"],
        "efecto": "Invoca un demonio del Abismo. Los demonios tienen modificadores a la tirada de habilidad arcana según su tipo (0 para soldado demoníaco/corcel, -1 para cadena/cambiante/imp/fustigador/espinado, -2 para gula/bibliotecario/súcubo/íncubo, -4 para plaga/revelador, -6 para hielo). Con un éxito, el demonio está vagamente ligado a la voluntad del invocador. Pueden negarse a cumplir órdenes. Desaparecen al morir o al terminar el conjuro [106, 114-117]."
      },
      "summon_elemental": {
        "nombre": "Invocar Elemental (Summon Elemental)",
        "rango": "Veterano",
        "alcance": "Especial",
        "duracion": "Mantenido",
        "trappings": ["Sustancia del mismo tipo que el elemental"],
        "efecto": "Invoca un elemental bajo el mando del invocador. El elemental permanece hasta que el conjuro termina o es asesinado. La comunicación es unidireccional mental [106, 117, 118]."
      },
      "summon_herald": {
        "nombre": "Invocar Heraldo (Summon Herald)",
        "rango": "Heroico",
        "alcance": "Espíritu",
        "duracion": "Especial",
        "trappings": ["Oración", "Canto", "Incienso ardiendo"],
        "efecto": "El héroe puede invocar al heraldo específico de su deidad. El lanzador sufre una penalización acumulativa de -2 por cada lanzamiento del conjuro (exitoso o no) durante un año. Los heraldos aceptan comandos solo del invocador y dentro de los límites de la fe de su deidad. El conjuro dura hasta que el heraldo es asesinado o el GM decide que se vaya [106, 119, 120]."
      },
      "telekinesis": {
        "nombre": "Telequinesis (Telekinesis)",
        "rango": "Novato",
        "alcance": "Astucia x 2",
        "duracion": "Mantenido",
        "trappings": ["Mano fantasmal", "Fuerza invisible", "Levitación"],
        "efecto": "Mueve objetos con la mente. Funciona como el conjuro 'Telekinesis' del Savage Worlds estándar [77, 80]. (Descripción detallada de efectos no en las fuentes)."
      },
      "teleport": {
        "nombre": "Teletransporte (Teleport) (ALTERADO)",
        "rango": "Experimentado",
        "alcance": "Especial",
        "duracion": "Instantáneo",
        "trappings": ["Nube de humo", "'Fasear'", "Convertirse en rayo"],
        "efecto": "Teletransporta al lanzador a cualquier punto dentro del rango y línea de visión (3\" por Rango, 6\" con raise). No puede entrar en espacio sólido. Transportar a otros causa un nivel de Fatiga por 'pasajero' adicional (más de dos causan Incapacitación instantánea) [106, 120, 121]."
      },
      "viper_weapon": {
        "nombre": "Arma de Víbora (Viper Weapon)",
        "rango": "Experimentado",
        "alcance": "Espíritu x 2",
        "duracion": "Mantenido",
        "trappings": ["El arma se transforma en una serpiente"],
        "efecto": "Con un éxito, un arma dentro del rango se transforma en una serpiente venenosa (usa las estadísticas de víbora estándar). La serpiente no está bajo el control del lanzador y ataca al objetivo más cercano. Con un raise, la serpiente es un Wild Card. Se revierte a arma cuando es asesinada o el conjuro termina [106, 121, 122]."
      },
      "voice_on_the_wind": {
        "nombre": "Voz en el Viento (Voice on the Wind)",
        "rango": "Novato",
        "alcance": "Astucia x 50 millas",
        "duracion": "Instantáneo",
        "trappings": ["El viento lleva las palabras", "Susurros etéreos"],
        "efecto": "Permite al lanzador enviar un mensaje de 10 palabras por Rango de personaje del lanzador a un objetivo distante [106, 123]."
      },
      "wall_walker": {
        "nombre": "Caminante de Paredes (Wall Walker)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Pies pegajosos", "Adherencia a la superficie"],
        "efecto": "El objetivo puede caminar y correr por paredes o techos. Funciona como el conjuro 'Wall Walker' del Savage Worlds estándar [21, 75, 83, 123]. (Descripción detallada de efectos no en las fuentes)."
      },
      "wandering_senses": {
        "nombre": "Sentidos Errantes (Wandering Senses)",
        "rango": "Novato",
        "alcance": "Astucia x 10",
        "duracion": "Mantenido",
        "trappings": ["Mano espectral y ojo que aparecen", "Mirada vacía", "Concentración"],
        "efecto": "El lanzador proyecta sus sentidos de vista, oído y olfato. Puede mover sus sentidos 6\" cada ronda hasta el límite del conjuro. Los sentidos funcionan como si el personaje se moviera realmente [123, 124]."
      },
      "warding": {
        "nombre": "Protección (Warding)",
        "rango": "Experimentado",
        "alcance": "Especial",
        "duracion": "Mantenido",
        "trappings": ["Símbolos de protección", "Aura", "Barrera"],
        "efecto": "Crea una protección igual a una Plantilla de Ráfaga Mediana centrada en el lanzador (Grande con un raise). Las criaturas del tipo nominado que intenten entrar o usar habilidades especiales en objetivos dentro de la protección deben hacer una tirada de Espíritu o no podrán hacerlo. No detiene ataques mundanos desde fuera [123, 125]."
      },
      "warriors_gift": {
        "nombre": "Don del Guerrero (Warrior's Gift)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Aura de fuerza", "Espíritu de batalla"],
        "efecto": "Otorga al objetivo una Ventaja de Combate. Funciona como el conjuro 'Warrior's Gift' del Savage Worlds estándar [78, 82, 85, 86, 123]. (Descripción detallada de efectos no en las fuentes)."
      },
      "water_walk": {
        "nombre": "Caminar sobre el Agua (Water Walk)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Pies brillantes", "El agua se endurece"],
        "efecto": "El objetivo puede caminar sobre la superficie del agua como si fuera tierra firme. Lagos y mares en calma se atraviesan normalmente. Mares agitados cuentan como terreno difícil [123, 126, 127]."
      },
      "weaken_undead": {
        "nombre": "Debilitar No Muertos (Weaken Undead)",
        "rango": "Veterano",
        "alcance": "Espíritu",
        "duracion": "Mantenido",
        "trappings": ["Canto", "Oraciones", "Himnos", "Símbolos de fe"],
        "efecto": "Despoja a un no muerto de su vínculo con los campos de energía nigromántica, si bien solo por un corto tiempo. Negando su Habilidad Monstruosa 'No Muerto' [123, 127]. (Detalles adicionales de efectos no en las fuentes)."
      },
      "weapon_immunity": {
        "nombre": "Inmunidad a Armas (Weapon Immunity)",
        "rango": "Experimentado",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["Armadura reluciente", "Escudo místico"],
        "efecto": "El objetivo recibe la mitad de daño (o ningún daño con un raise) de un tipo específico de arma. Funciona como el conjuro 'Weapon Immunity' del Savage Worlds estándar [77, 80, 82, 85, 86, 110, 123, 128, 129]. (Descripción detallada de efectos no en las fuentes)."
      },
      "whirlwind": {
        "nombre": "Torbellino (Whirlwind)",
        "rango": "Experimentado",
        "alcance": "Astucia",
        "duracion": "Mantenido",
        "trappings": ["Gestos", "Movimiento giratorio"],
        "efecto": "Crea un torbellino que llena una Plantilla de Ráfaga Mediana. Cualquier cosa en contacto debe hacer una tirada de Fuerza (modificada por Tamaño) o ser derribada. Si saca un 1 (independientemente del Wild Die), también queda Sacudido. El lanzador puede mover el torbellino hasta su dado de Astucia en pulgadas por ronda (es una acción). También puede dispersar enjambres voladores (Sacudido con éxito, Herida con raise) [15, 129, 130]."
      },
      "wilderness_step": {
        "nombre": "Paso Salvaje (Wilderness Step)",
        "rango": "Novato",
        "alcance": "Toque",
        "duracion": "Mantenido",
        "trappings": ["El suelo se suaviza", "El objetivo flota ligeramente"],
        "efecto": "El objetivo trata el terreno difícil como terreno normal [21, 78, 83, 108, 129]."
      },
      "zephyr": {
        "nombre": "Céfiro (Zephyr)",
        "rango": "Novato",
        "alcance": "Un barco",
        "duracion": "Mantenido",
        "trappings": ["Vientos favorables", "Velas que se hinchan solas"],
        "efecto": "Aumenta la Aceleración y Velocidad Máxima de un barco en un 25%, y +1 a su Manejo [83, 129]. (Descripción detallada de efectos no en las fuentes)."
      }
    }
  };
    
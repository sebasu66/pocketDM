
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial archetype data needed to seed the Firestore database.

export const archetypes = {
  avenger: {
    id: "avenger",
    visualPreset: "avenger",
    name: "Vengador",
    race: "Humano (Saxa)",
    description: "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores. Eres un humano alto y corpulento de dos metros de altura y 120 kilos. Vistes una piel de oso polar en hombros y espalda, y llevas la cabeza del oso como casco, dándote una apariencia intimidante. Tu furia es tu fortaleza: en combate te vuelves casi insensible al dolor, más resistente y tus ataques son devastadores. Pero esta condición también es un peligro para quienes están cerca, pues se te hace difícil controlar tu ira cuando ya no hay enemigos que combatir. Tu apariencia intimidante es también tu debilidad: te cuesta ser diplomático y delicado. Mucha gente te mira con temor y recelo. Algunos te llaman 'la Bestia'.",
    attributes: { agility: "d6", smarts: "d4", spirit: "d6", strength: "d8", vigor: "d8" },
    skills: { fighting: "d8", guts: "d6", intimidation: "d6", notice: "d6", riding: "d4", survival: "d6", throwing: "d6" },
    edges: ["Berserk", "Venganza"],
    hindrances: ["Vengativo (Mayor)", "Enemigo (Menor: tribu Orco)"],
    inventory: [
      { "item": "Espada Larga", "quantity": 1, "notes": "Fuerza+d8" },
      { "item": "Escudo Mediano", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Piel de Oso Polar", "quantity": 1, "notes": "Capa/casco, +2 vs frío, +1 Intimidación" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    generalBackground: "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores. Eres un humano alto y corpulento de dos metros de altura y 120 kilos. Vistes una piel de oso polar en hombros y espalda, y llevas la cabeza del oso como casco, dándote una apariencia intimidante. Tu furia es tu fortaleza: en combate te vuelves casi insensible al dolor, más resistente y tus ataques son devastadores. Pero esta condición también es un peligro para quienes están cerca, pues se te hace difícil controlar tu ira cuando ya no hay enemigos que combatir. Tu apariencia intimidante es también tu debilidad: te cuesta ser diplomático y delicado. Mucha gente te mira con temor y recelo. Algunos te llaman 'la Bestia'.",
    glory: 0,
    derived: { pace: 6, parry: 7, toughness: 7, charisma: -1 },
    arcane: null, religion: null
  },
  bladedancer: {
    id: "bladedancer",
    visualPreset: "bladedancer",
    name: "Bailarín de Cuchillas",
    race: "Elfo de la Taiga",
    description: "Como guardián élfico de los antiguos bosques de taiga, has perfeccionado un arte de combate ancestral: el baile de las cuchillas. Eres ágil y grácil, moviendo dos espadas cortas con una fluidez hipnótica que confunde y desarma a tus enemigos. Tu silueta es esbelta y tu piel clara brilla con un tono plateado bajo la luz de la luna. Vistes armadura de cuero élfico adaptada para máxima movilidad, adornada con hojas y símbolos naturales. Tu conexión con el bosque te hace letal en combate cercano, anticipando movimientos enemigos con instinto sobrenatural. Pero tu naturaleza élfica trae debilidades: el calor intenso te agota rápidamente, y tu crianza aislada en los bosques te hace torpe en situaciones sociales urbanas. Los humanos te ven con desconfianza, y tú a ellos con recelo.",
    attributes: { agility: "d8", smarts: "d6", spirit: "d6", strength: "d6", vigor: "d6" },
    skills: { fighting: "d8", notice: "d6", stealth: "d6", survival: "d6", throwing: "d4", tracking: "d4" },
    edges: ["Dos Puños", "Bailarín de Cuchillas"],
    hindrances: ["Torpe", "Insular"],
    inventory: [
      { "item": "Dos Espadas Cortas Élficas", "quantity": 2, "notes": "Fuerza+d6 cada una, grabadas con runas" },
      { "item": "Armadura de Cuero Élfica", "quantity": 1, "notes": "+1 Armadura, decorada con hojas" },
      { "item": "Arco Largo", "quantity": 1, "notes": "2d6" },
      { "item": "Carcaj (Flechas)", "quantity": 20, "notes": "Munición" },
      { "item": "Capa de Hojas", "quantity": 1, "notes": "+2 vs frío, +1 Sigilo en bosques" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    generalBackground: "Como guardián élfico de los antiguos bosques de taiga, has perfeccionado un arte de combate ancestral: el baile de las cuchillas. Eres ágil y grácil, moviendo dos espadas cortas con una fluidez hipnótica que confunde y desarma a tus enemigos. Tu silueta es esbelta y tu piel clara brilla con un tono plateado bajo la luz de la luna. Vistes armadura de cuero élfico adaptada para máxima movilidad, adornada con hojas y símbolos naturales. Tu conexión con el bosque te hace letal en combate cercano, anticipando movimientos enemigos con instinto sobrenatural. Pero tu naturaleza élfica trae debilidades: el calor intenso te agota rápidamente, y tu crianza aislada en los bosques te hace torpe en situaciones sociales urbanas. Los humanos te ven con desconfianza, y tú a ellos con recelo.",
    glory: 0,
    derived: { pace: 6, parry: 6, toughness: 5, charisma: -2 },
    arcane: null, religion: null
  },
  druid: {
    id: "druid",
    visualPreset: "druid",
    name: "Druida",
    race: "Elfo del Hogar",
    description: "Eres un elfo del Hogar profundamente conectado con los espíritus de la naturaleza. Tu cabello largo está entrelazado con hojas y ramitas, y tus ojos reflejan el verde profundo de los antiguos bosques. Vistes túnicas de lino y cuero natural, nunca metal, pues rechazas lo antinatural. Llevas un báculo de roble antiguo tallado con runas druídicas que canaliza tu magia. Puedes comunicarte con animales y plantas, hacer crecer enredaderas para atrapar enemigos, y sanar heridas con ungüentos herbales. Tu poder alcanza su cúspide en entornos naturales, donde los espíritus te responden. Pero en ciudades y edificios de piedra, tu magia se debilita dramáticamente, los espíritus no te escuchan. Tu crianza aislada te hace torpe con la tecnología y las costumbres urbanas. Desconfías de quienes explotan la naturaleza, y ellos te ven como un primitivo excéntrico.",
    attributes: { agility: "d6", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d6" },
    skills: { druidism: "d6", healing: "d6", notice: "d6", survival: "d8", tracking: "d6" },
    edges: ["Trasfondo Arcano (Druidismo)", "Vínculo Animal"],
    hindrances: ["Torpe", "Insular"],
    inventory: [
      { "item": "Báculo de Roble Antiguo", "quantity": 1, "notes": "Fuerza+d4, tallado con runas" },
      { "item": "Kit de Hierbas Druídicas", "quantity": 1, "notes": "+1 Curación natural" },
      { "item": "Armadura de Cuero Natural", "quantity": 1, "notes": "+1 Armadura, sin metal" },
      { "item": "Honda", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Túnica de Hojas", "quantity": 1, "notes": "+2 vs frío, +1 Sigilo en naturaleza" },
      { "item": "Mochila (Hierbas/Pociones)", "quantity": 1, "notes": "Suministros naturales" }
    ],
    generalBackground: "Eres un elfo del Hogar profundamente conectado con los espíritus de la naturaleza. Tu cabello largo está entrelazado con hojas y ramitas, y tus ojos reflejan el verde profundo de los antiguos bosques. Vistes túnicas de lino y cuero natural, nunca metal, pues rechazas lo antinatural. Llevas un báculo de roble antiguo tallado con runas druídicas que canaliza tu magia. Puedes comunicarte con animales y plantas, hacer crecer enredaderas para atrapar enemigos, y sanar heridas con ungüentos herbales. Tu poder alcanza su cúspide en entornos naturales, donde los espíritus te responden. Pero en ciudades y edificios de piedra, tu magia se debilita dramáticamente, los espíritus no te escuchan. Tu crianza aislada te hace torpe con la tecnología y las costumbres urbanas. Desconfías de quienes explotan la naturaleza, y ellos te ven como un primitivo excéntrico.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 5, charisma: -2 },
    arcane: { type: "Druidismo", skill: "d6", powers: ["enmarañar", "amigo animal"] },
    religion: null
  },
  elementalist: {
    id: "elementalist",
    visualPreset: "elementalist",
    name: "Elementalista",
    race: "Humano (Anari)",
    description: "Eres un maestro elementalista humano de la prestigiosa Convocatoria Anari. Tu especialidad es el fuego, elemento vital contra las heladas mortales del norte. Tus ojos brillan con un fulgor naranja cuando canalizas poder, y tus manos están marcadas con cicatrices de quemaduras rituales que prueban tu dominio elemental. Vistes túnicas rojas y doradas bordadas con símbolos alquímicos, y llevas un báculo coronado con un cristal de fuego perpetuo. Tu conocimiento arcano es vasto, capaz de lanzar proyectiles de llamas y crear barreras de calor protector. Tu curiosidad insaciable te impulsa a experimentar con nuevas combinaciones elementales. Pero tu confianza en tu intelecto roza la arrogancia: subestimas peligros no-mágicos y desprecias a quienes no comprenden las artes arcanas. Tu postura académica te hace parecer distante y condescendiente, ganándote pocos amigos fuera de círculos eruditos.",
    attributes: { agility: "d4", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d6" },
    skills: { elementalism: "d6", "knowledge (arcana)": "d8", notice: "d6", survival: "d4", persuasion: "d4" },
    edges: ["Trasfondo Arcano (Elementalismo - Fuego)", "Nuevo Poder"],
    hindrances: ["Curioso (Menor)", "Arrogante (Mayor)"],
    inventory: [
      { "item": "Báculo de Cristal de Fuego", "quantity": 1, "notes": "Fuerza+d4, cristal perpetuo" },
      { "item": "Túnicas de la Convocatoria", "quantity": 1, "notes": "+1 vs magia, símbolos alquímicos" },
      { "item": "Kit Alquímico", "quantity": 1, "notes": "Componentes elementales" },
      { "item": "Daga Ritual", "quantity": 1, "notes": "Fuerza+d4, runas grabadas" },
      { "item": "Grimorio Personal", "quantity": 1, "notes": "Teorías y experimentos arcanos" }
    ],
    generalBackground: "Eres un maestro elementalista humano de la prestigiosa Convocatoria Anari. Tu especialidad es el fuego, elemento vital contra las heladas mortales del norte. Tus ojos brillan con un fulgor naranja cuando canalizas poder, y tus manos están marcadas con cicatrices de quemaduras rituales que prueban tu dominio elemental. Vistes túnicas rojas y doradas bordadas con símbolos alquímicos, y llevas un báculo coronado con un cristal de fuego perpetuo. Tu conocimiento arcano es vasto, capaz de lanzar proyectiles de llamas y crear barreras de calor protector. Tu curiosidad insaciable te impulsa a experimentar con nuevas combinaciones elementales. Pero tu confianza en tu intelecto roza la arrogancia: subestimas peligros no-mágicos y desprecias a quienes no comprenden las artes arcanas. Tu postura académica te hace parecer distante y condescendiente, ganándote pocos amigos fuera de círculos eruditos.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 5, charisma: -2 },
    arcane: { type: "Elementalismo (Fuego)", skill: "d6", powers: ["proyectil", "castigo divino"] },
    religion: null
  },
  hearth_knight: {
    id: "hearth_knight",
    visualPreset: "hearth_knight",
    name: "Caballero del Hogar",
    race: "Nacido de Escarcha",
    description: "Eres un Nacido de Escarcha, criatura mágica con piel azul pálida y ojos que brillan como hielo bajo la luz. Eres un guerrero montado jurado a la orden de los Caballeros del Hogar, protectores de las tierras civilizadas contra las hordas del Hellfrost. Tu armadura de placas está grabada con runas de protección que brillan tenuemente con magia invernal. Montas un caballo de guerra entrenado para resistir el frío extremo. Tu hacha de batalla ha segado innumerables orcos, gigantes y criaturas del hielo. Tu juramento te obliga a defender a los inocentes sin importar el costo personal. Tu naturaleza de escarcha te hace inmune al frío y más fuerte en invierno. Pero el calor te debilita gravemente: en ambientes cálidos te vuelves letárgico y tus reflejos se ralentizan. Tus órdenes son absolutas: debes obedecer a tus superiores de la orden incluso cuando tu corazón lo cuestione. La gente te respeta pero también te teme por tu naturaleza no-humana.",
    attributes: { agility: "d6", smarts: "d6", spirit: "d6", strength: "d8", vigor: "d8" },
    skills: { fighting: "d8", riding: "d6", survival: "d8", notice: "d6", guts: "d6" },
    edges: ["Caballero del Hogar", "Alma de Invierno"],
    hindrances: ["Órdenes", "Letargo por Calor"],
    inventory: [
      { "item": "Hacha de Guerra Rúnica", "quantity": 1, "notes": "Fuerza+d8, grabada con runas" },
      { "item": "Escudo del Hogar", "quantity": 1, "notes": "+1 Parada, emblema de la orden" },
      { "item": "Armadura de Placas", "quantity": 1, "notes": "+2 Armadura, runas protectoras" },
      { "item": "Caballo de Guerra", "quantity": 1, "notes": "Entrenado para frío extremo" },
      { "item": "Capa de la Orden", "quantity": 1, "notes": "+2 vs frío, símbolo de autoridad" }
    ],
    generalBackground: "Eres un Nacido de Escarcha, criatura mágica con piel azul pálida y ojos que brillan como hielo bajo la luz. Eres un guerrero montado jurado a la orden de los Caballeros del Hogar, protectores de las tierras civilizadas contra las hordas del Hellfrost. Tu armadura de placas está grabada con runas de protección que brillan tenuemente con magia invernal. Montas un caballo de guerra entrenado para resistir el frío extremo. Tu hacha de batalla ha segado innumerables orcos, gigantes y criaturas del hielo. Tu juramento te obliga a defender a los inocentes sin importar el costo personal. Tu naturaleza de escarcha te hace inmune al frío y más fuerte en invierno. Pero el calor te debilita gravemente: en ambientes cálidos te vuelves letárgico y tus reflejos se ralentizan. Tus órdenes son absolutas: debes obedecer a tus superiores de la orden incluso cuando tu corazón lo cuestione. La gente te respeta pero también te teme por tu naturaleza no-humana.",
    glory: 0,
    derived: { pace: 6, parry: 6, toughness: 7, charisma: 0 },
    arcane: null, religion: null
  },
  hrimwisard: {
    id: "hrimwisard",
    visualPreset: "hrimwisard",
    name: "Hrimwisard",
    race: "Humano (Finnar)",
    description: "Eres un hechicero nómada Finnar que ha dominado la magia del hielo puro: la Hrimwisardry. Tu piel es pálida como la nieve, curtida por años vagando las llanuras heladas del Hellfrost exterior. Tu cabello blanco está congelado en escarcha permanente, y tu aliento forma cristales de hielo incluso en interiores. Vistes túnicas de pieles blancas y grises que te camuflan en la nieve, y llevas un báculo de icewood que canaliza tu magia helada. Tus hechizos crean proyectiles de hielo afilado y barreras de escarcha protectora, más potentes cuanto más frío sea el ambiente. Tu vida nómada te ha enseñado a sobrevivir donde otros perecerían. Pero tu existencia solitaria te marca: eres un forastero en asentamientos civilizados, incómodo con costumbres sociales. Tu curiosidad por secretos arcanos del hielo a veces te lleva a explorar ruinas peligrosas sin pensar en consecuencias. La gente común te ve como una aparición fantasmal y perturbadora.",
    attributes: { agility: "d4", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d8" },
    skills: { hrimwisardry: "d6", notice: "d6", survival: "d8", "knowledge (arcana)": "d6" },
    edges: ["Trasfondo Arcano (Hrimwisardry)", "Alma de Invierno"],
    hindrances: ["Forastero", "Curioso"],
    inventory: [
      { "item": "Báculo de Icewood", "quantity": 1, "notes": "Fuerza+d4, nunca se derrite" },
      { "item": "Túnicas de Pieles Blancas", "quantity": 1, "notes": "+2 vs frío, +1 Sigilo en nieve" },
      { "item": "Daga de Hielo", "quantity": 1, "notes": "Fuerza+d4, formada con magia" },
      { "item": "Mochila Nómada", "quantity": 1, "notes": "Componentes helados, cristales" }
    ],
    generalBackground: "Eres un hechicero nómada Finnar que ha dominado la magia del hielo puro: la Hrimwisardry. Tu piel es pálida como la nieve, curtida por años vagando las llanuras heladas del Hellfrost exterior. Tu cabello blanco está congelado en escarcha permanente, y tu aliento forma cristales de hielo incluso en interiores. Vistes túnicas de pieles blancas y grises que te camuflan en la nieve, y llevas un báculo de icewood que canaliza tu magia helada. Tus hechizos crean proyectiles de hielo afilado y barreras de escarcha protectora, más potentes cuanto más frío sea el ambiente. Tu vida nómada te ha enseñado a sobrevivir donde otros perecerían. Pero tu existencia solitaria te marca: eres un forastero en asentamientos civilizados, incómodo con costumbres sociales. Tu curiosidad por secretos arcanos del hielo a veces te lleva a explorar ruinas peligrosas sin pensar en consecuencias. La gente común te ve como una aparición fantasmal y perturbadora.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 6, charisma: -2 },
    arcane: { type: "Hrimwisardry", skill: "d6", powers: ["armadura", "proyectil"] },
    religion: null
  },
  knight_hrafn: {
    id: "knight_hrafn",
    visualPreset: "knight_hrafn",
    name: "Caballero Hrafn",
    race: "Humano (Anari)",
    description: "Eres un Caballero Hrafn, miembro de una prestigiosa orden militar Anari de estrategas y comandantes. Tu mente es tu arma más afilada: has estudiado tratados de guerra ancestrales y tácticas de batalla en la Academia de Belvenus. Vistes armadura de cuero reforzada funcional, no ostentosa, decorada solo con el emblema del cuervo (hrafn) de tu orden. Llevas mapas enrollados y un cuaderno de estrategias en tu montura. En batalla, lideras desde el frente analizando el campo con ojo clínico, dirigiendo tropas con órdenes precisas que cambian el curso del combate. Tu don para la táctica te hace invaluable para nobles y generales. Pero tu servicio viene con cadenas: debes obedecer órdenes de tus superiores incluso cuando creas que hay mejor estrategia. Tu código de honor te impide tácticas deshonestas como emboscadas nocturnas o veneno, limitando tus opciones. Desprecias la política; solo te interesa ganar batallas honorablemente.",
    attributes: { agility: "d6", smarts: "d8", spirit: "d6", strength: "d6", vigor: "d6" },
    skills: { "knowledge (battle)": "d8", fighting: "d6", persuasion: "d6", notice: "d6", riding: "d6" },
    edges: ["Caballero Hrafn", "Mando"],
    hindrances: ["Órdenes", "Código de Honor"],
    inventory: [
      { "item": "Espada Corta de Oficial", "quantity": 1, "notes": "Fuerza+d6, grabada con rango" },
      { "item": "Armadura de Cuero Reforzada", "quantity": 1, "notes": "+1 Armadura, funcional" },
      { "item": "Caballo de Oficial", "quantity": 1, "notes": "Montura entrenada" },
      { "item": "Escudo con Emblema", "quantity": 1, "notes": "+1 Parada, cuervo grabado" },
      { "item": "Mapas y Tratados Tácticos", "quantity": 1, "notes": "Conocimiento militar" }
    ],
    generalBackground: "Eres un Caballero Hrafn, miembro de una prestigiosa orden militar Anari de estrategas y comandantes. Tu mente es tu arma más afilada: has estudiado tratados de guerra ancestrales y tácticas de batalla en la Academia de Belvenus. Vistes armadura de cuero reforzada funcional, no ostentosa, decorada solo con el emblema del cuervo (hrafn) de tu orden. Llevas mapas enrollados y un cuaderno de estrategias en tu montura. En batalla, lideras desde el frente analizando el campo con ojo clínico, dirigiendo tropas con órdenes precisas que cambian el curso del combate. Tu don para la táctica te hace invaluable para nobles y generales. Pero tu servicio viene con cadenas: debes obedecer órdenes de tus superiores incluso cuando creas que hay mejor estrategia. Tu código de honor te impide tácticas deshonestas como emboscadas nocturnas o veneno, limitando tus opciones. Desprecias la política; solo te interesa ganar batallas honorablemente.",
    glory: 0,
    derived: { pace: 6, parry: 5, toughness: 5, charisma: 0 },
    arcane: null, religion: null
  },
  paladin: {
    id: "paladin",
    visualPreset: "paladin",
    name: "Paladín",
    race: "Humano (Saxa)",
    description: "Eres un Paladín de Tiw, dios Saxa de la guerra y el honor. Tu armadura de placas brilla con luz divina bendecida en ceremonias sagradas. Llevas un espadón enorme grabado con runas de tu dios, capaz de cortar acero y carne no-muerta por igual. Tu símbolo sagrado de Tiw cuelga de tu cuello, canal de tu fe y milagros. Eres un campeón divino: tu presencia inspira a aliados y aterroriza a seguidores del caos. Puedes invocar armadura divina que te protege de ataques, y castigo divino que aniquila enemigos con fuego sagrado. Tu juramento es inquebrantable: defender a los fieles, destruir no-muertos y abominaciones, y nunca rechazar un desafío honorable. Pero tu voto te encadena: debes servir a Tiw sobre todo, incluso tu familia. Tu código de honor te impide mentir, atacar enemigos desarmados, o usar tácticas cobardes. Muchos te admiran, pero otros te ven como un fanático peligroso.",
    attributes: { agility: "d6", smarts: "d4", spirit: "d8", strength: "d8", vigor: "d8" },
    skills: { faith: "d6", fighting: "d8", guts: "d6", intimidation: "d6", riding: "d4" },
    edges: ["Trasfondo Arcano (Milagros - Tiw)", "Campeón"],
    hindrances: ["Código de Honor", "Voto (Mayor: Servir a Tiw)"],
    inventory: [
      { "item": "Espadón Sagrado", "quantity": 1, "notes": "Fuerza+d10, bendecido, runas de Tiw" },
      { "item": "Armadura de Placas Bendita", "quantity": 1, "notes": "+3 Armadura, brilla tenuemente" },
      { "item": "Símbolo Sagrado de Tiw", "quantity": 1, "notes": "Foco divino, collar" },
      { "item": "Caballo de Guerra", "quantity": 1, "notes": "Montura entrenada" }
    ],
    generalBackground: "Eres un Paladín de Tiw, dios Saxa de la guerra y el honor. Tu armadura de placas brilla con luz divina bendecida en ceremonias sagradas. Llevas un espadón enorme grabado con runas de tu dios, capaz de cortar acero y carne no-muerta por igual. Tu símbolo sagrado de Tiw cuelga de tu cuello, canal de tu fe y milagros. Eres un campeón divino: tu presencia inspira a aliados y aterroriza a seguidores del caos. Puedes invocar armadura divina que te protege de ataques, y castigo divino que aniquila enemigos con fuego sagrado. Tu juramento es inquebrantable: defender a los fieles, destruir no-muertos y abominaciones, y nunca rechazar un desafío honorable. Pero tu voto te encadena: debes servir a Tiw sobre todo, incluso tu familia. Tu código de honor te impide mentir, atacar enemigos desarmados, o usar tácticas cobardes. Muchos te admiran, pero otros te ven como un fanático peligroso.",
    glory: 0,
    derived: { pace: 5, parry: 6, toughness: 8, charisma: 0 },
    arcane: { type: "Milagros (Tiw)", skill: "d6", powers: ["armadura", "castigo divino"] },
    religion: { god: "Tiw", powers: ["armadura", "castigo divino"] }
  },
  rune_mage: {
    id: "rune_mage",
    visualPreset: "rune_mage",
    name: "Mago Rúnico",
    race: "Enano de Hielo",
    description: "En las profundidades de las montañas heladas, el Mago Rúnico talla runas de poder en piedra, su martillo resonando como un eco del pasado enano. Este guerrero de escarcha protege las minas y forjas con magia antigua, su resistencia al frío un legado de su pueblo, aunque el calor lo traiciona fuera de su hogar subterráneo.",
    attributes: { agility: "d4", smarts: "d8", spirit: "d6", strength: "d6", vigor: "d8" },
    skills: { "rune (armor-rune)": "d6", "knowledge (arcana)": "d6", fighting: "d6", notice: "d6", survival: "d4" },
    edges: ["Trasfondo Arcano (Magia Rúnica)"],
    hindrances: ["Insular", "Letargo por Calor"],
    inventory: [
      { "item": "Martillo", "quantity": 1, "notes": "Fuerza+d6" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Herramientas de Talla", "quantity": 1, "notes": "Creación de Runas" },
      { "item": "Mochila", "quantity": 1, "notes": "Runas y Componentes" }
    ],
    generalBackground: "Tallas runas en piedra para invocar magia ancestral, defendiendo las fortalezas enanas contra invasores del Hellfrost.",
    glory: 0,
    derived: { pace: 5, parry: 5, toughness: 7, charisma: -2 },
    arcane: { type: "Magia Rúnica", skill: "d6", powers: ["armadura"] },
    religion: null
  },
  skald: {
    id: "skald",
    visualPreset: "skald",
    name: "Skald",
    race: "Humano (Finnar)",
    description: "Bajo un cielo gris, el Skald teje magia con su voz, sus canciones resonando como un canto de guerra en las llanuras heladas. Este nómada Finnar inspira a los suyos con historias épicas, su curiosidad lo llevando a explorar ruinas ocultas bajo la nieve, aunque su destreza reside en el arte de la palabra más que en la espada.",
    attributes: { agility: "d4", smarts: "d6", spirit: "d8", strength: "d4", vigor: "d6" },
    skills: { "song magic": "d6", persuasion: "d8", "knowledge (folklore)": "d6", notice: "d6", survival: "d4" },
    edges: ["Trasfondo Arcano (Magia de Canción)", "Carisma +1 (de Skald)"],
    hindrances: ["Curioso", "Forastero"],
    inventory: [
      { "item": "Laúd", "quantity": 1, "notes": "Instrumento" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Mochila", "quantity": 1, "notes": "Libros de Poemas" }
    ],
    generalBackground: "Nómada finnar, cantas épicas para invocar magia y entretener, preservando las leyendas del Hellfrost con cada nota.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 5, charisma: 1 },
    arcane: { type: "Magia de Canción", skill: "d6", powers: ["potenciar rasgo", "inspirar"] },
    religion: null
  }
};

    
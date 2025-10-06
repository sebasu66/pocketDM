
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial archetype data needed to seed the Firestore database.

export const archetypes = {
  avenger: {
    id: "avenger",
    visualPreset: "preset_1",
    name: "Vengador",
    race: "Humano (Saxa)",
    description: "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores.",
    attributes: { agility: "d6", smarts: "d4", spirit: "d6", strength: "d8", vigor: "d8" },
    skills: { fighting: "d8", guts: "d6", intimidation: "d6", notice: "d6", riding: "d4", survival: "d6", throwing: "d6" },
    edges: ["Berserk", "Venganza"],
    hindrances: ["Vengativo (Mayor)", "Enemigo (Menor: tribu Orco)"],
    inventory: [
      { "item": "Espada Larga", "quantity": 1, "notes": "Fuerza+d8" },
      { "item": "Escudo Mediano", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Capa de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    generalBackground: "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores.",
    glory: 0,
    derived: { pace: 6, parry: 7, toughness: 7, charisma: 0 },
    arcane: null, religion: null
  },
  bladedancer: {
    id: "bladedancer",
    visualPreset: "preset_2",
    name: "Bailarín de Cuchillas",
    race: "Elfo de la Taiga",
    description: "Como guardián de los bosques de la taiga, dominas el baile de las espadas para defender la naturaleza contra invasores. Tu gracia élfica te hace letal en combates cercanos, pero el calor te debilita.",
    attributes: { agility: "d8", smarts: "d6", spirit: "d6", strength: "d6", vigor: "d6" },
    skills: { fighting: "d8", notice: "d6", stealth: "d6", survival: "d6", throwing: "d4", tracking: "d4" },
    edges: ["Dos Puños", "Bailarín de Cuchillas"],
    hindrances: ["Torpe", "Insular"],
    inventory: [
      { "item": "Dos Espadas Cortas", "quantity": 2, "notes": "Fuerza+d6 cada una" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Arco", "quantity": 1, "notes": "2d6" },
      { "item": "Carjaj (Flechas)", "quantity": 20, "notes": "Munición" },
      { "item": "Capa de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    generalBackground: "Como guardián de los bosques de la taiga, dominas el baile de las espadas para defender la naturaleza contra invasores. Tu gracia élfica te hace letal en combates cercanos, pero el calor te debilita.",
    glory: 0,
    derived: { pace: 6, parry: 6, toughness: 5, charisma: -2 },
    arcane: null, religion: null
  },
  druid: {
    id: "druid",
    visualPreset: "preset_4",
    name: "Druida",
    race: "Elfo del Hogar",
    description: "Conectado con la naturaleza, manipulas plantas y animales para proteger los bosques. Eres fuerte en la naturaleza, pero sufres en entornos urbanos donde la magia natural se debilita.",
    attributes: { agility: "d6", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d6" },
    skills: { druidism: "d6", healing: "d6", notice: "d6", survival: "d8", tracking: "d6" },
    edges: ["Trasfondo Arcano (Druidismo)", "Vínculo Animal"],
    hindrances: ["Torpe", "Insular"],
    inventory: [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Kit de Hierbas", "quantity": 1, "notes": "Herramientas de curación" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Honda", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Equipo de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila (Hierbas/Pociones)", "quantity": 1, "notes": "Suministros" }
    ],
    generalBackground: "Conectado con la naturaleza, manipulas plantas y animales para proteger los bosques. Eres fuerte en la naturaleza, pero sufres en entornos urbanos donde la magia natural se debilita.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 5, charisma: -2 },
    arcane: { type: "Druidismo", skill: "d6", powers: ["enmarañar", "amigo animal"] },
    religion: null
  },
  elementalist: {
    id: "elementalist",
    visualPreset: "preset_5",
    name: "Elementalista",
    race: "Humano (Anari)",
    description: "Maestro de los elementos, comienzas con fuego para combatir el frío del Hellfrost. Como miembro de la Convocatoria, buscas equilibrio, pero tu arrogancia te hace subestimar peligros.",
    attributes: { agility: "d4", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d6" },
    skills: { elementalism: "d6", "knowledge (arcana)": "d8", notice: "d6", survival: "d4", persuasion: "d4" },
    edges: ["Trasfondo Arcano (Elementalismo - Fuego)", "Nuevo Poder"],
    hindrances: ["Curioso (Menor)", "Arrogante (Mayor)"],
    inventory: [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Túnicas", "quantity": 1, "notes": "+1 vs magia" },
      { "item": "Herramientas Alquímicas", "quantity": 1, "notes": "Componentes" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Mochila (Libros)", "quantity": 1, "notes": "Saber arcano" }
    ],
    generalBackground: "Maestro de los elementos, comienzas con fuego para combatir el frío del Hellfrost. Como miembro de la Convocatoria, buscas equilibrio, pero tu arrogancia te hace subestimar peligros.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 5, charisma: -2 },
    arcane: { type: "Elementalismo (Fuego)", skill: "d6", powers: ["proyectil", "castigo divino"] },
    religion: null
  },
  hearth_knight: {
    id: "hearth_knight",
    visualPreset: "preset_6",
    name: "Caballero del Hogar",
    race: "Nacido de Escarcha",
    description: "Montado en su corcel bajo un cielo grisáceo, el Caballero del Hogar es un baluarte contra las hordas del Hellfrost, su armadura reflejando el brillo del hielo. Nacido de la escarcha, este guerrero protege las Tierras del Hogar con un juramento sagrado, enfrentando dragones y gigantes con una determinación que resuena como el viento helado. Su deber lo ata, pero el calor lo debilita.",
    attributes: { agility: "d6", smarts: "d6", spirit: "d6", strength: "d8", vigor: "d8" },
    skills: { fighting: "d8", riding: "d6", survival: "d8", notice: "d6", guts: "d6" },
    edges: ["Caballero del Hogar", "Alma de Invierno"],
    hindrances: ["Órdenes", "Letargo por Calor"],
    inventory: [
      { "item": "Hacha de Batalla", "quantity": 1, "notes": "Fuerza+d8" },
      { "item": "Escudo Mediano", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" },
      { "item": "Equipo de Invierno", "quantity": 1, "notes": "+2 vs frío" }
    ],
    generalBackground: "Juraste defender las Tierras del Hogar contra bestias del Hellfrost, guiado por un código de honor que te impulsa a proteger a los inocentes en las tierras heladas.",
    glory: 0,
    derived: { pace: 6, parry: 6, toughness: 7, charisma: 0 },
    arcane: null, religion: null
  },
  hrimwisard: {
    id: "hrimwisard",
    visualPreset: "preset_4",
    name: "Hrimwisard",
    race: "Humano (Finnar)",
    description: "En las llanuras nevadas del Hellfrost exterior, el Hrimwisard canaliza el frío como un maestro del hielo, sus hechizos brillando con un fulgor glacial. Este nómada Finnar, forjado por el viento cortante, encuentra su fuerza en el invierno eterno, pero su aislamiento lo marca como un extraño entre los civilizados, siempre buscando el siguiente horizonte helado.",
    attributes: { agility: "d4", smarts: "d8", spirit: "d6", strength: "d4", vigor: "d8" },
    skills: { hrimwisardry: "d6", notice: "d6", survival: "d8", "knowledge (arcana)": "d6" },
    edges: ["Trasfondo Arcano (Hrimwisardry)", "Alma de Invierno"],
    hindrances: ["Forastero", "Curioso"],
    inventory: [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Túnicas de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Mochila", "quantity": 1, "notes": "Componentes" }
    ],
    generalBackground: "Nómada finnar, canalizas el frío del Hellfrost para hechizos potentes en invierno, explorando las tierras heladas en busca de conocimiento arcano.",
    glory: 0,
    derived: { pace: 6, parry: 4, toughness: 6, charisma: -2 },
    arcane: { type: "Hrimwisardry", skill: "d6", powers: ["armadura", "proyectil"] },
    religion: null
  },
  knight_hrafn: {
    id: "knight_hrafn",
    visualPreset: "preset_7",
    name: "Caballero Hrafn",
    race: "Humano (Anari)",
    description: "Con un estandarte ondeando bajo la nieve, el Caballero Hrafn lidera con la precisión de un estratega en un campo de batalla helado. Este humano Anari, desprovisto de ambiciones políticas, ofrece su genio táctico a nobles y ejércitos, su mente calculadora enfrentándose a las hordas oscuras como un faro de orden en el caos del Hellfrost.",
    attributes: { agility: "d6", smarts: "d8", spirit: "d6", strength: "d6", vigor: "d6" },
    skills: { "knowledge (battle)": "d8", fighting: "d6", persuasion: "d6", notice: "d6", riding: "d6" },
    edges: ["Caballero Hrafn", "Mando"],
    hindrances: ["Órdenes", "Código de Honor"],
    inventory: [
      { "item": "Espada Corta", "quantity": 1, "notes": "Fuerza+d6" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" },
      { "item": "Escudo", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Mochila", "quantity": 1, "notes": "Mapas y Tratados" }
    ],
    generalBackground: "Estratega anari, lideras ejércitos con tácticas precisas, guiando a tus aliados a través de las batallas heladas del Hellfrost.",
    glory: 0,
    derived: { pace: 6, parry: 5, toughness: 5, charisma: 0 },
    arcane: null, religion: null
  },
  paladin: {
    id: "paladin",
    visualPreset: "preset_3",
    name: "Paladín",
    race: "Humano (Saxa)",
    description: "Vestido con armadura resplandeciente, el Paladín de Tiw es un campeón divino, su espada bendecida cortando la oscuridad del Hellfrost. Este guerrero Saxa, guiado por el dios de la guerra, protege a los fieles con un juramento inquebrantable, su fe un escudo contra las abominaciones heladas que acechan en la noche.",
    attributes: { agility: "d6", smarts: "d4", spirit: "d8", strength: "d8", vigor: "d8" },
    skills: { faith: "d6", fighting: "d8", guts: "d6", intimidation: "d6", riding: "d4" },
    edges: ["Trasfondo Arcano (Milagros - Tiw)", "Campeón"],
    hindrances: ["Código de Honor", "Voto (Mayor: Servir a Tiw)"],
    inventory: [
      { "item": "Espadón", "quantity": 1, "notes": "Fuerza+d10" },
      { "item": "Armadura de Placas (Torso)", "quantity": 1, "notes": "+3 Armadura" },
      { "item": "Símbolo Sagrado", "quantity": 1, "notes": "Foco Divino" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" }
    ],
    generalBackground: "Devoto de Tiw, luchas en batallas por honor y sangre, defendiendo la fe en las tierras heladas con tu espada bendita.",
    glory: 0,
    derived: { pace: 5, parry: 6, toughness: 8, charisma: 0 },
    arcane: { type: "Milagros (Tiw)", skill: "d6", powers: ["armadura", "castigo divino"] },
    religion: { god: "Tiw", powers: ["armadura", "castigo divino"] }
  },
  rune_mage: {
    id: "rune_mage",
    visualPreset: "preset_8",
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
    visualPreset: "preset_9",
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

    
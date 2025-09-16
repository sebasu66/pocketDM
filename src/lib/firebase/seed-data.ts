
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains all the initial data needed to seed the Firestore database.

export const initialUsers = [
    { id: "1", name: "Game Master", email: "gm@example.com", password: "password", role: "master", avatar: "https://picsum.photos/seed/gm/100/100", campaignId: "1" },
    { id: "2", name: "Alice", email: "alice@example.com", password: "password", role: "player", avatar: "https://picsum.photos/seed/alice/100/100", campaignId: "1" },
    { id: "3", name: "Bob", email: "bob@example.com", password: "password", role: "player", avatar: "https://picsum.photos/seed/bob/100/100", campaignId: "1" },
    { id: "4", name: "Carlos", email: "carlos@example.com", password: "password", role: "player", avatar: "https://picsum.photos/seed/carlos/100/100", campaignId: "1" },
    { id: "5", name: "Diana", email: "diana@example.com", password: "password", role: "player", avatar: "https://picsum.photos/seed/diana/100/100", campaignId: "1" },
];

export const initialCampaigns = [
    { 
        id: "1", 
        title: "The Frozen Reach", 
        description: "A campaign set in the northern territories of Rassilon, where the biting winds of the Hellfrost are a constant threat and ancient evils stir beneath the ice.",
        bannerUrl: "https://picsum.photos/seed/campaign1/1200/400",
        bannerAiHint: "frozen landscape fantasy",
        systemPrompt: "You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.\n\n- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.\n- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.\n- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.\n- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.\n- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure)."
    }
];

export const archetypes = {
  "avenger": {
    "name": "Vengador",
    "race": "Humano (Saxa)",
    "description": "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores.",
    "attributes": { "agility": "d6", "smarts": "d4", "spirit": "d6", "strength": "d8", "vigor": "d8" },
    "skills": { "fighting": "d8", "guts": "d6", "intimidation": "d6", "notice": "d6", "riding": "d4", "survival": "d6", "throwing": "d6" },
    "edges": ["Berserk", "Venganza"],
    "hindrances": ["Vengativo (Mayor)", "Enemigo (Menor: tribu Orco)"],
    "inventory": [
      { "item": "Espada Larga", "quantity": 1, "notes": "Fuerza+d8" },
      { "item": "Escudo Mediano", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Capa de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    "generalBackground": "Tu familia fue masacrada por orcos del Hellfrost. Juraste venganza eterna contra esas bestias, viajando por las tierras heladas para cazarlas y fortalecerte contra amenazas mayores.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 7, "toughness": 7, "charisma": 0 },
    "arcane": null, "religion": null
  },
  "bladedancer": {
    "name": "Bailarín de Cuchillas",
    "race": "Elfo de la Taiga",
    "description": "Como guardián de los bosques de la taiga, dominas el baile de las espadas para defender la naturaleza contra invasores. Tu gracia élfica te hace letal en combates cercanos, pero el calor te debilita.",
    "attributes": { "agility": "d8", "smarts": "d6", "spirit": "d6", "strength": "d6", "vigor": "d6" },
    "skills": { "fighting": "d8", "notice": "d6", "stealth": "d6", "survival": "d6", "throwing": "d4", "tracking": "d4" },
    "edges": ["Dos Puños", "Bailarín de Cuchillas"],
    "hindrances": ["Torpe", "Insular"],
    "inventory": [
      { "item": "Dos Espadas Cortas", "quantity": 2, "notes": "Fuerza+d6 cada una" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Arco", "quantity": 1, "notes": "2d6" },
      { "item": "Carjaj (Flechas)", "quantity": 20, "notes": "Munición" },
      { "item": "Capa de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila", "quantity": 1, "notes": "General" }
    ],
    "generalBackground": "Como guardián de los bosques de la taiga, dominas el baile de las espadas para defender la naturaleza contra invasores. Tu gracia élfica te hace letal en combates cercanos, pero el calor te debilita.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 6, "toughness": 5, "charisma": -2 },
    "arcane": null, "religion": null
  },
  "druid": {
    "name": "Druida",
    "race": "Elfo del Hogar",
    "description": "Conectado con la naturaleza, manipulas plantas y animales para proteger los bosques. Eres fuerte en la naturaleza, pero sufres en entornos urbanos donde la magia natural se debilita.",
    "attributes": { "agility": "d6", "smarts": "d8", "spirit": "d6", "strength": "d4", "vigor": "d6" },
    "skills": { "druidism": "d6", "healing": "d6", "notice": "d6", "survival": "d8", "tracking": "d6" },
    "edges": ["Trasfondo Arcano (Druidismo)", "Vínculo Animal"],
    "hindrances": ["Torpe", "Insular"],
    "inventory": [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Kit de Hierbas", "quantity": 1, "notes": "Herramientas de curación" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Honda", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Equipo de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Mochila (Hierbas/Pociones)", "quantity": 1, "notes": "Suministros" }
    ],
    "generalBackground": "Conectado con la naturaleza, manipulas plantas y animales para proteger los bosques. Eres fuerte en la naturaleza, pero sufres en entornos urbanos donde la magia natural se debilita.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 4, "toughness": 5, "charisma": -2 },
    "arcane": { "type": "Druidismo", "skill": "d6", "powers": ["enmarañar", "amigo animal"] },
    "religion": null
  },
  "elementalist": {
    "name": "Elementalista",
    "race": "Humano (Anari)",
    "description": "Maestro de los elementos, comienzas con fuego para combatir el frío del Hellfrost. Como miembro de la Convocatoria, buscas equilibrio, pero tu arrogancia te hace subestimar peligros.",
    "attributes": { "agility": "d4", "smarts": "d8", "spirit": "d6", "strength": "d4", "vigor": "d6" },
    "skills": { "elementalism": "d6", "knowledge (arcana)": "d8", "notice": "d6", "survival": "d4", "persuasion": "d4" },
    "edges": ["Trasfondo Arcano (Elementalismo - Fuego)", "Nuevo Poder"],
    "hindrances": ["Curioso (Menor)", "Arrogante (Mayor)"],
    "inventory": [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Túnicas", "quantity": 1, "notes": "+1 vs magia" },
      { "item": "Herramientas Alquímicas", "quantity": 1, "notes": "Componentes" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Mochila (Libros)", "quantity": 1, "notes": "Saber arcano" }
    ],
    "generalBackground": "Maestro de los elementos, comienzas con fuego para combatir el frío del Hellfrost. Como miembro de la Convocatoria, buscas equilibrio, pero tu arrogancia te hace subestimar peligros.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 4, "toughness": 5, "charisma": -2 },
    "arcane": { "type": "Elementalismo (Fuego)", "skill": "d6", "powers": ["proyectil", "castigo divino"] },
    "religion": null
  },
  "hearth_knight": {
    "name": "Caballero del Hogar",
    "race": "Nacido de Escarcha",
    "description": "Montado en su corcel bajo un cielo grisáceo, el Caballero del Hogar es un baluarte contra las hordas del Hellfrost, su armadura reflejando el brillo del hielo. Nacido de la escarcha, este guerrero protege las Tierras del Hogar con un juramento sagrado, enfrentando dragones y gigantes con una determinación que resuena como el viento helado. Su deber lo ata, pero el calor lo debilita.",
    "attributes": { "agility": "d6", "smarts": "d6", "spirit": "d6", "strength": "d8", "vigor": "d8" },
    "skills": { "fighting": "d8", "riding": "d6", "survival": "d8", "notice": "d6", "guts": "d6" },
    "edges": ["Caballero del Hogar", "Alma de Invierno"],
    "hindrances": ["Órdenes", "Letargo por Calor"],
    "inventory": [
      { "item": "Hacha de Batalla", "quantity": 1, "notes": "Fuerza+d8" },
      { "item": "Escudo Mediano", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" },
      { "item": "Equipo de Invierno", "quantity": 1, "notes": "+2 vs frío" }
    ],
    "generalBackground": "Juraste defender las Tierras del Hogar contra bestias del Hellfrost, guiado por un código de honor que te impulsa a proteger a los inocentes en las tierras heladas.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 6, "toughness": 7, "charisma": 0 },
    "arcane": null, "religion": null
  },
  "hrimwisard": {
    "name": "Hrimwisard",
    "race": "Humano (Finnar)",
    "description": "En las llanuras nevadas del Hellfrost exterior, el Hrimwisard canaliza el frío como un maestro del hielo, sus hechizos brillando con un fulgor glacial. Este nómada Finnar, forjado por el viento cortante, encuentra su fuerza en el invierno eterno, pero su aislamiento lo marca como un extraño entre los civilizados, siempre buscando el siguiente horizonte helado.",
    "attributes": { "agility": "d4", "smarts": "d8", "spirit": "d6", "strength": "d4", "vigor": "d8" },
    "skills": { "hrimwisardry": "d6", "notice": "d6", "survival": "d8", "knowledge (arcana)": "d6" },
    "edges": ["Trasfondo Arcano (Hrimwisardry)", "Alma de Invierno"],
    "hindrances": ["Forastero", "Curioso"],
    "inventory": [
      { "item": "Báculo", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Túnicas de Invierno", "quantity": 1, "notes": "+2 vs frío" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Mochila", "quantity": 1, "notes": "Componentes" }
    ],
    "generalBackground": "Nómada finnar, canalizas el frío del Hellfrost para hechizos potentes en invierno, explorando las tierras heladas en busca de conocimiento arcano.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 4, "toughness": 6, "charisma": -2 },
    "arcane": { "type": "Hrimwisardry", "skill": "d6", "powers": ["armadura", "proyectil"] },
    "religion": null
  },
  "knight_hrafn": {
    "name": "Caballero Hrafn",
    "race": "Humano (Anari)",
    "description": "Con un estandarte ondeando bajo la nieve, el Caballero Hrafn lidera con la precisión de un estratega en un campo de batalla helado. Este humano Anari, desprovisto de ambiciones políticas, ofrece su genio táctico a nobles y ejércitos, su mente calculadora enfrentándose a las hordas oscuras como un faro de orden en el caos del Hellfrost.",
    "attributes": { "agility": "d6", "smarts": "d8", "spirit": "d6", "strength": "d6", "vigor": "d6" },
    "skills": { "knowledge (battle)": "d8", "fighting": "d6", "persuasion": "d6", "notice": "d6", "riding": "d6" },
    "edges": ["Caballero Hrafn", "Mando"],
    "hindrances": ["Órdenes", "Código de Honor"],
    "inventory": [
      { "item": "Espada Corta", "quantity": 1, "notes": "Fuerza+d6" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" },
      { "item": "Escudo", "quantity": 1, "notes": "+1 Parada" },
      { "item": "Mochila", "quantity": 1, "notes": "Mapas y Tratados" }
    ],
    "generalBackground": "Estratega anari, lideras ejércitos con tácticas precisas, guiando a tus aliados a través de las batallas heladas del Hellfrost.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 5, "toughness": 5, "charisma": 0 },
    "arcane": null, "religion": null
  },
  "paladin": {
    "name": "Paladín",
    "race": "Humano (Saxa)",
    "description": "Vestido con armadura resplandeciente, el Paladín de Tiw es un campeón divino, su espada bendecida cortando la oscuridad del Hellfrost. Este guerrero Saxa, guiado por el dios de la guerra, protege a los fieles con un juramento inquebrantable, su fe un escudo contra las abominaciones heladas que acechan en la noche.",
    "attributes": { "agility": "d6", "smarts": "d4", "spirit": "d8", "strength": "d8", "vigor": "d8" },
    "skills": { "faith": "d6", "fighting": "d8", "guts": "d6", "intimidation": "d6", "riding": "d4" },
    "edges": ["Trasfondo Arcano (Milagros - Tiw)", "Campeón"],
    "hindrances": ["Código de Honor", "Voto (Mayor: Servir a Tiw)"],
    "inventory": [
      { "item": "Espadón", "quantity": 1, "notes": "Fuerza+d10" },
      { "item": "Armadura de Placas (Torso)", "quantity": 1, "notes": "+3 Armadura" },
      { "item": "Símbolo Sagrado", "quantity": 1, "notes": "Foco Divino" },
      { "item": "Caballo", "quantity": 1, "notes": "Montura" }
    ],
    "generalBackground": "Devoto de Tiw, luchas en batallas por honor y sangre, defendiendo la fe en las tierras heladas con tu espada bendita.",
    "glory": 0,
    "derived": { "pace": 5, "parry": 6, "toughness": 8, "charisma": 0 },
    "arcane": { "type": "Milagros (Tiw)", "skill": "d6", "powers": ["armadura", "castigo divino"] },
    "religion": { "god": "Tiw", "powers": ["armadura", "castigo divino"] }
  },
  "rune_mage": {
    "name": "Mago Rúnico",
    "race": "Enano de Hielo",
    "description": "En las profundidades de las montañas heladas, el Mago Rúnico talla runas de poder en piedra, su martillo resonando como un eco del pasado enano. Este guerrero de escarcha protege las minas y forjas con magia antigua, su resistencia al frío un legado de su pueblo, aunque el calor lo traiciona fuera de su hogar subterráneo.",
    "attributes": { "agility": "d4", "smarts": "d8", "spirit": "d6", "strength": "d6", "vigor": "d8" },
    "skills": { "rune (armor-rune)": "d6", "knowledge (arcana)": "d6", "fighting": "d6", "notice": "d6", "survival": "d4" },
    "edges": ["Trasfondo Arcano (Magia Rúnica)"],
    "hindrances": ["Insular", "Letargo por Calor"],
    "inventory": [
      { "item": "Martillo", "quantity": 1, "notes": "Fuerza+d6" },
      { "item": "Cota de Malla", "quantity": 1, "notes": "+2 Armadura" },
      { "item": "Herramientas de Talla", "quantity": 1, "notes": "Creación de Runas" },
      { "item": "Mochila", "quantity": 1, "notes": "Runas y Componentes" }
    ],
    "generalBackground": "Tallas runas en piedra para invocar magia ancestral, defendiendo las fortalezas enanas contra invasores del Hellfrost.",
    "glory": 0,
    "derived": { "pace": 5, "parry": 5, "toughness": 7, "charisma": -2 },
    "arcane": { "type": "Magia Rúnica", "skill": "d6", "powers": ["armadura"] },
    "religion": null
  },
  "skald": {
    "name": "Skald",
    "race": "Humano (Finnar)",
    "description": "Bajo un cielo gris, el Skald teje magia con su voz, sus canciones resonando como un canto de guerra en las llanuras heladas. Este nómada Finnar inspira a los suyos con historias épicas, su curiosidad lo llevando a explorar ruinas ocultas bajo la nieve, aunque su destreza reside en el arte de la palabra más que en la espada.",
    "attributes": { "agility": "d4", "smarts": "d6", "spirit": "d8", "strength": "d4", "vigor": "d6" },
    "skills": { "song magic": "d6", "persuasion": "d8", "knowledge (folklore)": "d6", "notice": "d6", "survival": "d4" },
    "edges": ["Trasfondo Arcano (Magia de Canción)", "Carisma +1 (de Skald)"],
    "hindrances": ["Curioso", "Forastero"],
    "inventory": [
      { "item": "Laúd", "quantity": 1, "notes": "Instrumento" },
      { "item": "Daga", "quantity": 1, "notes": "Fuerza+d4" },
      { "item": "Armadura de Cuero", "quantity": 1, "notes": "+1 Armadura" },
      { "item": "Mochila", "quantity": 1, "notes": "Libros de Poemas" }
    ],
    "generalBackground": "Nómada finnar, cantas épicas para invocar magia y entretener, preservando las leyendas del Hellfrost con cada nota.",
    "glory": 0,
    "derived": { "pace": 6, "parry": 4, "toughness": 5, "charisma": 1 },
    "arcane": { "type": "Magia de Canción", "skill": "d6", "powers": ["potenciar rasgo", "inspirar"] },
    "religion": null
  }
};

export const hellfrostGameData = {
    "razas": {
        "Engro": {
            "descripcion": "Una raza diminuta de nómadas, que viajan por las Tierras del Hogar y el Hellfrost exterior en caravanas de colores brillantes. Tienen una mala reputación, siendo considerados ladrones y mendigos por otras razas. A pesar de ser despreciados, los engro son optimistas y de espíritu elevado, incluso ante el peligro. Miden en promedio 90 cm (3') de altura y la mayoría vive unos 70 años, aunque se han registrado engro de 100 años. Son religiosos por naturaleza, aunque rara vez participan en ceremonias organizadas, y la mayoría practica una forma de druidismo.",
            "caracteristicas_raciales": [
                "**Suerte:** Los engro roban un benny adicional por sesión de juego. Esto se puede combinar con los Filos Suerte y Gran Suerte.",
                "**Forastero:** Los engro tienen la Desventaja Forastero entre todas las razas excepto la suya.",
                "**Pequeño:** Los engro miden en promedio solo unos 90 cm (3') de altura. Su pequeño tamaño resta 1 a su Dureza y son de Tamaño –1.",
                "**Astuto:** La mayoría de los engro se ganan la vida operando al margen de la ley. Comienzan el juego con Abrir Cerraduras o Sigilo en d6. Esto no se puede cambiar más tarde.",
                "**Espíritu:** Los engro son seres generalmente optimistas. Comienzan con un Espíritu d6 en lugar de un d4. Mediante avances y Filos, pueden tener un Espíritu máximo de d12+3."
            ],
            "nombres_ejemplo": {
                "masculinos": ["Bertrem", "Jym", "Odbert", "Oxbow", "Rodgar"],
                "femeninos": ["Daisy", "Foxglove", "Petunia", "Rose"],
                "apellidos": "Los engro nunca han usado apellidos, creyendo que un nombre tiene poder."
            }
        },
        "Enano de Hielo": {
            "descripcion": "Aunque los enanos viven predominantemente en montañas, siempre lo hacen por encima de la línea de nieve. Algunos han tallado complejos vastos en los lados de los glaciares. Son ligeramente xenófobos y sus hogares son fortalezas vastas con guardias y trampas ocultas. Tienen pocos clérigos, que suelen seguir a Ertha o Tiw, pero han dominado el poder de las runas. Viven alrededor de 300 años, tienen cabello blanco, piel pálida y ojos negros. La mayoría mide 1.5 metros (5 pies) de altura, pero son criaturas fornidas. Los hombres llevan barba, cuya longitud y número de trenzas determinan el estatus social y la profesión.",
            "caracteristicas_raciales": [
                "**Letargo por Calor:** Los enanos de hielo se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas.",
                "**Insular:** Los enanos de hielo se han mantenido apartados y rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las demás razas.",
                "**Visión en Baja Luz:** Los ojos de los enanos están acostumbrados a la penumbra del subsuelo. Ignoran las penalizaciones por oscuridad en todas las situaciones excepto en Oscuridad Total."
            ],
            "nombres_ejemplo": {
                "masculinos": ["Ari", "Bardi", "Geirstein", "Hord", "Ljot", "Olvir"],
                "femeninos": ["Asleif", "Herdis", "Svala", "Thyra"],
                "apellidos": "Los nombres de clan se forman con un descriptor seguido de un objeto (ej. Brighthammer, Foeaxe, Goldbeard, Steelhand)."
            }
        },
        "Nacido de Hielo": {
            "descripcion": "Hace un siglo no existían los nacidos de hielo; hoy son numerosos, aunque no tanto como otras razas. No evolucionaron, simplemente aparecieron. Pueden ser engendrados por cualquier raza, pero un apareamiento de nacidos de hielo siempre resulta en un hijo nacido de hielo. Comparten la forma física de sus padres, pero carecen de sus cualidades raciales, poseyendo rasgos únicos. Todos tienen piel blanco-azulada, cabello blanco y ojos azul pálido, y su piel siempre está fría al tacto. La mayoría se aventuran al Hellfrost, intentando comenzar una nueva vida lejos de los prejuicios.",
            "caracteristicas_raciales": [
                "**Forma Frígida:** Los nacidos de hielo tienen una forma innata limitada de hrimwisardry. Conocen los poderes: armadura (piel helada), protección ambiental (solo contra el frío), castigo (carámbanos crecen de las manos o un arma), y velocidad (pies con hielo). Pueden adquirir la habilidad Hrimwisardry sin tomar el Filo Trasfondo Arcano.",
                "**Letargo por Calor:** Los nacidos de hielo se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas.",
                "**Forastero:** Los nacidos de hielo son universalmente desconfiados fuera de los enclaves de nacidos de hielo.",
                "**Alma de Invierno:** Los nacidos de hielo tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo."
            ],
            "nombres_ejemplo": {
                "comunes": "Al nacer, generalmente reciben nombres de la cultura de sus padres, pero muchos rechazan los nombres familiares y adoptan nuevos nombres con un toque gélido (ej. Crinhelada, Filohielo, Manoescarcha, Caminanieves)."
            }
        },
        "Elfo del Hogar": {
            "descripcion": "En el pasado distante, los elfos del hogar vivían en los bosques cálidos del mundo, actuando como jardineros y guardianes. Construían grandes Elfhomes de madera. Se consideran la primera creación de los dioses y eligieron seguir las enseñanzas de los dioses del bien. Pueden vivir más de 500 años, son ligeramente más altos que los humanos pero más esbeltos, con cabello rubio o castaño claro y ojos verde pálido o marrones. Las relaciones con los humanos son tensas.",
            "caracteristicas_raciales": [
                "**Ágil:** Los elfos del hogar son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4.",
                "**Torpe:** Los elfos del hogar tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe.",
                "**Nacido en el Bosque:** Los elfos del hogar no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior.",
                "**Visión en Baja Luz:** Los elfos del hogar tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total.",
                "**Reinos Naturales:** Los elfos del hogar que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas."
            ],
            "nombres_ejemplo": {
                "genero_neutro": ["Ailinnil", "Elleneirlir", "Lilime", "Melasion", "Niellan", "Sinrilli"],
                "apellidos": "A menudo asociados con eventos naturales (ej. Corremas, Hojasusurro, Nieblamañana, Silbobrillo)."
            }
        },
        "Humano": {
            "descripcion": "Los humanos son la raza más poblada en las Tierras del Hogar, aunque sus números han disminuido por la hambruna, enfermedades y ataques. Hay cuatro ramas distintas de humanos: Anari, Finnar, Saxa y Tuomi. Cada cultura tiene numerosas subculturas.",
            "culturas_humanas": {
                "Anari": { "descripcion": "Habitantes de ciudades y pueblos, se consideran culturalmente superiores. Su antiguo imperio dominó el continente occidental, pero ahora es una raza fracturada. Sus magos favorecen el elementalismo, excepto en la Magocracia, donde practican heahwisardry. Miden en promedio 1.68 m (5’6”) y tienen piel más oscura, cabello castaño oscuro o negro, y ojos generalmente verdes o marrones." },
                "Finnar": { "descripcion": "Prefieren vivir en tiendas de fieltro, cálidas y fácilmente transportables por renos. Son extremadamente pragmáticos, un hábito vital para sobrevivir en los páramos helados. Los magos finnar suelen aprender magia de la canción o hrimwisardry. Tienden a ser bajos para los humanos, promediando 1.68 m (5’6”), con cabello oscuro y piel morena, curtida por el viento." },
                "Saxa": { "descripcion": "Un pueblo clannish que vive principalmente en pequeñas granjas y aldeas. Su cultura se basa en juramentos de amistad y lealtad, y el principio de hospitalidad. Los magos saxa prefieren la magia de la canción. Miden poco menos de 1.83 m (6 pies) de altura, tienen cabello castaño o rubio, ojos azules o verde claro, y piel pálida. Los hombres usan bigotes y barbas, y llevan el cabello largo." },
                "Tuomi": { "descripcion": "La cultura humana menos numerosa, confinada a las Battlelands y Drachenlands. Son una cultura guerrera orgullosa que prefiere resolver disputas con sangre. Tiw, el dios de la guerra, es muy favorecido entre las tribus. Miden alrededor de 1.63 m (5’4”) de altura. Ambos sexos llevan el cabello largo y a menudo lo tiñen. Usan glasto y henna para crear tatuajes elaborados, algunos de los cuales tienen poder mágico." }
            },
            "caracteristicas_raciales": ["**Diversos:** Los humanos de cualquier cultura comienzan el juego con un Filo gratuito de su elección o 2 puntos de habilidad adicionales."]
        },
        "Elfo de la Taiga": {
            "descripcion": "En el pasado distante, varias tribus élficas se dirigieron al norte para establecer Elfhomes en la gran taiga. Vivieron en relativo aislamiento y con el tiempo, casi todos los lazos con sus primos del sur se olvidaron. Desde la Guerra de la Ventisca, han visto su hábitat natural disminuir. Tienen cabello blanco y piel azul claro, siendo por lo demás similares a los elfos del hogar en esperanza de vida.",
            "caracteristicas_raciales": [
                "**Ágil:** Los elfos de la taiga son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4.",
                "**Torpe:** Los elfos de la taiga tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe.",
                "**Nacido en el Bosque:** Los elfos de la taiga no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior.",
                "**Letargo por Calor:** Los elfos de la taiga se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas.",
                "**Insular:** Los elfos de la taiga rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las razas excepto los elfos.",
                "**Visión en Baja Luz:** Al igual que sus parientes templados, los elfos de la taiga tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total.",
                "**Reinos Naturales:** Los elfos de la taiga que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas.",
                "**Alma de Invierno:** Los elfos de la taiga tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo."
            ],
            "nombres_ejemplo": { "simples": "Los elfos de la taiga usan un solo nombre, que suele (pero no siempre) tener un elemento invernal o natural (ej. Jineteescarcha, Crinhelada, Brillohielo, Ojosnocturnos, Tejeombra, Correnieve)." }
        }
    },
    "categorias_personaje": {
        "Vengador": { "descripcion": "Los habitantes del Hellfrost, bandidos u orcos han arrebatado todo lo que el héroe amaba. La venganza es lo único que lo mantiene en pie." },
        "Bandido": { "descripcion": "Ante la escasez de alimentos, algunas personas han recurrido a tomar lo que quieren por la fuerza o la amenaza de violencia." },
        "Bailarín de Espadas": { "descripcion": "Guerreros elfos hábiles en el uso de dos hojas. Sus movimientos parecen espontáneos pero son como pasos de baile bien ensayados para los no-elfos." },
        "Porra": { "descripcion": "Guerreros engro altamente entrenados en el uso de la honda. Sirven como una especie de policía, pero solo en la sociedad engro." },
        "Ciudadano": { "descripcion": "Héroes que surgen de personas comunes, como una viuda que busca venganza o un hijo de granjero que busca aventura." },
        "Druida": { "descripcion": "Solo los elfos y los engro entienden cómo canalizar energía de plantas y animales. Son fuertes en la naturaleza, pero sufren dificultades en entornos urbanos." },
        "Elementalista": { "descripcion": "Magos que obtienen su poder a través de los reinos elementales. Un elementalista que ha dominado los cuatro elementos es conocido como arkhwisard (archimago)." },
        "Explorador": { "descripcion": "Viajeros que recorren las tierras, corrigiendo mapas antiguos y detallando las nuevas maravillas del mundo casi congelado." },
        "Luchador": { "descripcion": "Puede ser desde mercenarios endurecidos y guardaespaldas hasta jóvenes granjeros que buscan defender sus hogares." },
        "Heahwisard Mago Superior": { "descripcion": "Magos que obtienen energías mágicas a través de sus bastones, y son extremadamente débiles mágicamente sin ellos. También son la nobleza gobernante de las tierras conocidas como la Magocracia." },
        "Sanador": { "descripcion": "Personas que se esfuerzan por detener la marea de miseria con cataplasmas y ungüentos. Las Hermanas de la Misericordia son la única organización no religiosa jurada a este servicio." },
        "Caballero del Hogar": { "descripcion": "Dedicados a la defensa de las Tierras del Hogar contra las depredaciones de los habitantes del Hellfrost. Operan solo en las regiones más frías, custodiando caminos y pasos de montaña." },
        "Heraldo": { "descripcion": "Sirven a los nobles como diplomáticos y mensajeros. Un ataque contra un heraldo es un ataque contra su señor." },
        "Hrimwisard Mago de Escarcha": { "descripcion": "Magos que tejen poderosos hechizos extrayendo energías mágicas que se encuentran en el Hellfrost a través de sus cuerpos. Cuanto más frío hace, más poderosos efectos pueden invocar." },
        "Manipulador de Hielo": { "descripcion": "Marineros hábiles en el pilotaje de barcos de hielo, que se deslizan sobre el hielo y la nieve con patines y esquís largos." },
        "Mercenario del Gremio de Hierro": { "descripcion": "Aunque existen muchas compañías mercenarias, el Gremio de Hierro solo contrata tropas para comerciantes que requieren protección." },
        "Trabajador Itinerante": { "descripcion": "Vagabundos que ofrecen sus servicios en granjas y aldeas por todo Rassilon, como sanadores, herreros o sacerdotes. Los soldados itinerantes son mercenarios." },
        "Caballero Hrafn Cuervo": { "descripcion": "La Orden de los Caballeros Hrafn se dedica a la perfección del liderazgo militar. Se preocupan poco por la política y contratan a sus miembros para servir a nobles." },
        "Guardián del Saber": { "descripcion": "Dedicados a encontrar y preservar el conocimiento, se esfuerzan por evitar que se olvide." },
        "Mensajero": { "descripcion": "Parte jinete, explorador y guerrero, cuya vida es difícil, pero puede ser gratificante. La comunicación está limitada por la velocidad del caballo y el coraje del jinete." },
        "Noble": { "descripcion": "La nobleza permanece en la cima de la escala social. Muchas tierras ancestrales se han perdido, lo que obliga a los hijos más jóvenes a buscar fortuna a través de la aventura." },
        "Forajido": { "descripcion": "Marginados por actividades criminales o falsas acusaciones. A diferencia de los bandidos que atacan a los débiles, los forajidos son simplemente parias y aún pueden ser héroes honorables." },
        "Paladín": { "descripcion": "Mientras los sacerdotes guardan las almas de los fieles, los paladines guardan su carne. Algunos residen permanentemente en templos, otros viajan realizando hazañas en nombre de su deidad." },
        "Sacerdote": { "descripcion": "Existen muchos dioses adorados en Rassilon. Los sacerdotes forman el brazo espiritual de su fe." },
        "Guardabosques Ranger": { "descripcion": "Operan en la naturaleza como exploradores, espías, exploradores y soldados. A menudo patrullan las Tierras del Hogar para combatir los males que allí residen." },
        "Refugiado": { "descripcion": "El héroe puede haber perdido su hogar por ataques de bestias del Hellfrost, huido por malas cosechas o tenido su hogar enterrado bajo la nieve. No tiene un hogar propio y debe sobrevivir con su ingenio y la generosidad de otros." },
        "Reliqus": { "descripcion": "Miembro del Relicario, una organización dedicada a localizar, estudiar y proteger objetos mágicos. Algunos identifican reliquias por sus marcas, otros buscan magia antigua en criptas y templos." },
        "Guardián de Caminos": { "descripcion": "Un grupo de hombres y mujeres que se han encargado de proteger los caminos y salvaguardar a los viajeros en Rassilon." },
        "Mago Rúnico": { "descripcion": "Encontrado solo entre los enanos, los magos rúnicos concentran las energías mágicas del mundo a través de runas talladas." },
        "Explorador Scout": { "descripcion": "Trabajan para comerciantes (vigilando bandidos u orcos), como tropas de reconocimiento independientes para compañías mercenarias, y como guías para grupos de aventureros en los páramos congelados." },
        "Skald": { "descripcion": "Hechiceros que realizan su magia a través del poder de la canción. También conocen música, historias y poemas, y son bienvenidos en la mayoría de los asentamientos." },
        "Ladrón": { "descripcion": "Aprovechan a quienes tienen algo de valor. Algunos son tipos al estilo Robin Hood, otros buscan su propio beneficio." },
        "Trampero": { "descripcion": "Se ganan la vida cazando osos y lobos para vender sus pieles (necesarias para sobrevivir). Están curtidos a la intemperie y a menudo encuentran ruinas mientras cazan." },
        "Guardián del Bosque": { "descripcion": "Una organización principalmente élfica, dedicada a proteger los bosques de Rassilon. Son tiradores expertos y saben cómo hablar con bestias mundanas." },
        "Leñador": { "descripcion": "Almas resistentes que viajan al Bosque Congelado para recolectar valiosa madera de hielo, que los enanos utilizan en sus forjas de hielo negro." }
    },
    "habilidades": {
        "Generales": {
          "descripcion": "Todas las habilidades estándar de Savage Worlds, excepto Conducir y Pilotar. Montar ahora cubre vehículos tirados por animales."
        },
        "Arcanas Especiales": {
          "descripcion": "Disponibles para personajes con Trasfondo Arcano.",
          "lista": ["Druidismo", "Elementalismo", "Magia Superior", "Magia de Escarcha", "Magia Rúnica", "Magia de la Canción"]
        },
        "Conocimiento": {
          "descripcion": "Habilidades prácticas que el GM debe dar oportunidad de usar.",
          "lista": ["Alquimia", "Arcanos", "Área", "Batalla", "Oficio", "Folklore", "Heráldica", "Historia", "Ley", "Monstruos", "Religión", "Adivinanzas", "Artillería de Asedio"]
        }
    },
    "hindrances": {
      "Aprendiz/Novicio (Menor/Mayor)": { "descripcion": "Un héroe debe tener una Ventaja de Fondo Arcano. Menor: habilidad arcana inicial no superior a d6. Mayor: un poder inicial menos, o límite de habilidad arcana d4 para magos rúnicos." },
      "Oveja Negra (Menor)": { "descripcion": "Solo para héroes de la Magocracia. Ha rechazado la heahwisardry, resultando en exclusión familiar y -2 de Carisma con heahwisards. No puede tomar las Ventajas Fondo Arcano (Heahwisardry), Noble o Rico." },
      "Sangre Fría (Menor)": { "descripcion": "El héroe tiene –2 a tiradas de Vigor para resistir los efectos del clima frío." },
      "Maldito por los Dioses (Mayor)": { "descripcion": "Ha ofendido a un dios. Hechizos beneficiosos de clérigos de ese dios fallan; los dañinos causan +2 de daño extra. Hechizos opuestos del sacerdote ganan +2 para afectarle." },
      "Prohibición Mágica (Mayor)": { "descripcion": "Sin lazos con energías mágicas. No puede detectar/usar reliquias, beber pociones ni leer pergaminos. No puede tomar ninguna Ventaja de Fondo Arcano (Magia)." },
      "Debilidad Nigromántica (Menor/Mayor)": { "descripcion": "Susceptible a ataques de muertos vivientes. Menor: –2 a tiradas de rasgo para resistir ataques especiales sobrenaturales de no muertos. Mayor: la penalización sube a –4." },
      "Órdenes (Menor)": { "descripcion": "Sirve a otro poder y se espera que siga órdenes. Puede ser un agente de un noble, soldado del Gremio de Hierro, o mercenario." }
    },
    "edges": {
      "Fondo Arcano": { "categoria": "Trasfondo", "descripcion": "Los personajes con esta ventaja (Milagros) obtienen Conexiones con su fe y la desventaja Órdenes. Solo se puede tener un Fondo Arcano." },
      "Biblioteca": { "categoria": "Trasfondo", "requisitos": "Novato, Rico o Guardián del Saber, no Analfabeto", "descripcion": "Posee tomos de saber, con puntos de bonificación para distribuir entre ellos igual a la mitad de su dado de Astucia." },
      "Lingüista": { "categoria": "Trasfondo", "requisitos": "Novato, Astucia d6+, no Analfabeto", "descripcion": "Conoce un número de idiomas igual a su dado de Astucia." },
      "Noble": { "categoria": "Trasfondo", "requisitos": "Novato", "descripcion": "Posee el título noble más bajo y gobierna una pequeña aldea. Personajes de la Magocracia deben tomar Fondo Arcano (Heahwisardry)." },
      "Familia Antigua": { "categoria": "Trasfondo", "requisitos": "Novato, Fondo Arcano (Heahwisardry)", "descripcion": "Proviene de una familia influyente en la Magocracia. +2 a Conocimiento (Arcanos) y comienza como Mago-Barón." },
      "Rico y Muy Rico": { "categoria": "Trasfondo", "descripcion": "Rico: 3x dinero inicial, 5,000 gs/año. Muy Rico: 5x dinero inicial, 15,000 gs/año." },
      "Styrimathr": { "categoria": "Trasfondo", "requisitos": "Novato, Navegación d8+", "descripcion": "Posee un barco (smabyrding sin aparejo de hielo)." },
      "Valeroso": { "categoria": "Combate", "requisitos": "Novato, Agallas d8+", "descripcion": "+2 a tiradas de Agallas y -2 a tiradas en la Tabla de Pánico." },
      "Doble Disparo": { "categoria": "Combate", "requisitos": "Experimentado, Elfo, Disparar d8+", "descripcion": "Dispara dos flechas a un objetivo con –2 a Disparar." },
      "Cazagigantes Mejorado": { "categoria": "Combate", "requisitos": "Heroico, Cazagigantes", "descripcion": "Ignora Armadura o Tamaño de criaturas tres o más tamaños más grandes." },
      "Disparo Poderoso": { "categoria": "Combate", "requisitos": "Veterano, Fuerza d8+, Disparar d10+", "descripcion": "Daño con arco es Fuerza+d6." },
      "Maestro de Armas de Gran Tamaño": { "categoria": "Combate", "requisitos": "Veterano, Fuerza d10+, Pelear d10+", "descripcion": "Usa armas a dos manos con una sola mano." },
      "Escaramuza": { "categoria": "Combate", "requisitos": "Experimentado, Engro, Agilidad d8+", "descripcion": "Oponentes grandes restan 1 a tiradas de ataque." },
      "Muro de Escudos": { "categoria": "Combate", "requisitos": "Experimentado, Bloquear, escudo mediano/grande", "descripcion": "Defiende a un compañero adyacente con un escudo." },
      "Caminante de Nieve": { "categoria": "Combate", "requisitos": "Novato, Agilidad d6+", "descripcion": "Se mueve fácilmente sobre nieve y hielo." },
      "Romper Mejorado": { "categoria": "Combate", "requisitos": "Veterano, Romper", "descripcion": "Ignora 2 puntos de armadura." },
      "Muro de Acero": { "categoria": "Combate", "requisitos": "Veterano, Agilidad d8+, Pelear d8+", "descripcion": "Oponentes no obtienen bonificación por Superioridad Numérica." },
      "Grito de Guerra": { "categoria": "Combate", "requisitos": "Experimentado, Enano de Hielo/Saxa, Intimidación d8+", "descripcion": "Tirada de Intimidación contra todos en un área." },
      "Discípulo de Hela": { "categoria": "Discípulo", "requisitos": "Experimentado, Fondo Arcano (Milagros), Astucia d8+, Fe d8+", "descripcion": "+1 a tiradas de Fe. Con dos raises, los zombis son permanentes." },
      "Unos Cuantos Hombres Buenos": { "categoria": "Liderazgo", "requisitos": "Heroico, Astucia d8+, Conocimiento (Batalla) d10+", "descripcion": "Añade un token al total del ejército en Batallas Masivas." },
      "Presencia de Mando": { "categoria": "Liderazgo", "requisitos": "Novato, Mando", "descripcion": "Radio de mando de 10”." },
      "Fuego Coordinado": { "categoria": "Liderazgo", "requisitos": "Veterano, Astucia d6+, Disparar/Lanzar d8+", "descripcion": "Tropas de misiles disparan como una unidad." },
      "¡Grita Estragos!": { "categoria": "Liderazgo", "requisitos": "Veterano, Espíritu d8+, Conocimiento (Batalla) d10+", "descripcion": "Una vez por batalla, si una carga tiene éxito, el enemigo pierde un token extra." },
      "Muerte Antes que la Deshonra": { "categoria": "Liderazgo", "requisitos": "Veterano, Espíritu d8+, Conocimiento (Batalla) d8+", "descripcion": "+2 a tiradas de Moral en Batallas Masivas." },
      "Fanatismo": { "categoria": "Liderazgo", "requisitos": "Experimentado, Mando, Fervor", "descripcion": "Tropas bajo mando añaden +2 a Agallas." },
      "Rompeasedios": { "categoria": "Liderazgo", "requisitos": "Experimentado, Astucia d8+, Conocimiento (Batalla) d8+", "descripcion": "Reduce la Bonificación de Asedio de fortificaciones enemigas en 1." },
      "Mentalidad de Asedio": { "categoria": "Liderazgo", "requisitos": "Experimentado, Astucia d8+, Conocimiento (Batalla) d8+", "descripcion": "Aumenta la Bonificación de Asedio de fortificaciones defendidas en +1." },
      "Táctico": { "categoria": "Liderazgo", "requisitos": "Wild Card, Experimentado, Astucia d8+, Conocimiento (Batalla) d6+", "descripcion": "Recibe cartas de iniciativa adicionales." },
      "Seguidores": { "categoria": "Legendaria", "descripcion": "Gana seguidores relacionados con el rol del héroe." },
      "Compañero": { "categoria": "Legendaria", "descripcion": "Gana un compañero leal." },
      "Alquimia": { "categoria": "Poder", "requisitos": "Experimentado, Fondo Arcano, habilidad arcana d6+", "descripcion": "Crea dispositivos alquímicos (pociones, pergaminos)." },
      "Aumento de Bastón": { "categoria": "Poder", "requisitos": "Experimentado, Fondo Arcano (Heahwisardry), Heahwisardry d8+", "descripcion": "Encanta el bastón con habilidades (Aura, Daño, Desviar, Almacenar Hechizo)." },
      "Combinar Hechizos": { "categoria": "Poder", "requisitos": "Heroico, Fondo Arcano, habilidad arcana d10+", "descripcion": "Lanza dos hechizos diferentes simultáneamente." },
      "Concentración": { "categoria": "Poder", "requisitos": "Experimentado, Fondo Arcano, Astucia/Espíritu/Vigor d6+", "descripcion": "+2 para resistir interrupciones." },
      "Concentración Mejorada": { "categoria": "Poder", "requisitos": "Veterano, Concentración", "descripcion": "Bono de resistencia a interrupciones aumenta a +4." },
      "Maestría Elemental": { "categoria": "Poder", "requisitos": "Experimentado, Fondo Arcano (Elementalismo)", "descripcion": "Aprende un nuevo elemento con penalización a las tiradas." },
      "Foco": { "categoria": "Poder", "requisitos": "Experimentado, Fondo Arcano, Espíritu d6+", "descripcion": "Tirada de Espíritu a –2 para recuperarse de Sacudido por fallo de conjuro." },
      "Foco Mejorado": { "categoria": "Poder", "requisitos": "Heroico, Foco", "descripcion": "La tirada de recuperación no tiene penalización." },
      "Hellfreeze": { "categoria": "Poder", "requisitos": "Veterano, Fondo Arcano (frío), habilidad arcana d10+", "descripcion": "Hechizos de frío causan daño a criaturas resistentes/inmunes." },
      "Percepción Rúnica": { "categoria": "Poder", "requisitos": "Novato, Fondo Arcano (Magia Rúnica), habilidad de runa d8+", "descripcion": "+1 al dado de habilidad arcana para una runa específica." },
      "Sutileza de Hechizo": { "categoria": "Poder", "requisitos": "Novato, Fondo Arcano, habilidad arcana d8+", "descripcion": "Elige una mejora (Arcana o Selectiva) para un hechizo conocido." },
      "Legionario Gris": { "categoria": "Profesional", "requisitos": "Novato, Espíritu d8+, Pelear d8+", "descripcion": "Inmune a Intimidación y Miedo." },
      "Ladrón de Gremio": { "categoria": "Profesional", "requisitos": "Novato, Ladrón", "descripcion": "+2 a Callejear y Wild Die d8 con Trepar/Abrir Cerraduras/Sigilo." },
      "Magia de Setos": { "categoria": "Profesional", "requisitos": "Novato, Astucia d8+, Conocimiento (Alquimia) d6+", "descripcion": "Crea remedios herbales." },
      "Guerrero Sagrado/Impío": { "categoria": "Profesional", "requisitos": "Novato, Fondo Arcano (Milagros), Espíritu d8+", "descripcion": "Si falla la tirada de Fe, queda Sacudido; con un 1, sufre Fatiga." },
      "Reliquus": { "categoria": "Profesional", "requisitos": "Novato, Agilidad d8+, Abrir Cerraduras d6+", "descripcion": "+2 a Notar trampas y nunca es Sorprendido por una." },
      "Hermana de la Misericordia": { "categoria": "Profesional", "requisitos": "Novato, Curar d8+, mujer, Pacifista", "descripcion": "+2 a Curar y +1 a Carisma." },
      "Maestro Narrador": { "categoria": "Social", "requisitos": "Experimentado, Astucia d8+, Conocimiento (Folklore) d8+", "descripcion": "Otorga bonificaciones a la Gloria de la partida." },
      "Narrador Legendario": { "categoria": "Social", "requisitos": "Heroico, Maestro Narrador", "descripcion": "Mejora los bonos de Gloria." },
      "Sobrecarga de Poder": { "categoria": "Wild Card", "requisitos": "Wild Card, Experimentado, Fondo Arcano", "descripcion": "Duplica el daño de un ataque con habilidad arcana exitoso." }
    },
    "rassilon_grid_map_summary": [
        { "id": "A1", "region_info": { "name": "The Hellfrost (The Core)", "climate": "Supernatural, extreme cold." } },
        { "id": "A2", "region_info": { "name": "The Hellfrost (Inner Wastes)", "climate": "Extreme, supernatural cold." } },
        { "id": "A3", "region_info": { "name": "The Hellfrost (Outer Wastes)", "climate": "Extreme cold, though slightly less severe than the inner wastes." } },
        { "id": "A4", "region_info": { "name": "The Hellfrost (The Icewall - North)", "climate": "High Winterlands temperatures on the south side, supernatural cold on the north." } },
        { "id": "A5", "region_info": { "name": "Unclaimed Lands (Northern Fringes)", "climate": "High Winterlands. Brutally long and cold winters." } },
        { "id": "A6", "region_info": { "name": "Unclaimed Lands (Dwarven Hills)", "climate": "High Winterlands. Unpredictable weather patterns." } },
        { "id": "A7", "region_info": { "name": "Unclaimed Lands (The Great Forest)", "climate": "High Winterlands. Dense forest provides some shelter." } },
        { "id": "A8", "region_info": { "name": "Unclaimed Lands (Highwood Forest)", "climate": "High Winterlands. High altitude and mountainous terrain." } },
        { "id": "A9", "region_info": { "name": "Unclaimed Lands (Frozen Forest)", "climate": "An unnatural, magical cold at a constant -40 degrees Fahrenheit." } },
        { "id": "A10", "region_info": { "name": "Rimeholm (Jotunvalk Mountains)", "climate": "High Winterlands, though Hearthstones create a temperate microclimate in the core." } },
        { "id": "B1", "region_info": { "name": "The Hellfrost (Icewall - North)", "climate": "The most extreme cold imaginable on Rassilon." } },
        { "id": "B2", "region_info": { "name": "Glittersands", "climate": "High Winterlands, but markedly warmer, on par with Low Winterlands." } },
        { "id": "B3", "region_info": { "name": "Unclaimed Lands (Frostwater Lake)", "climate": "High Winterlands. The lake freezes over in winter." } },
        { "id": "B4", "region_info": { "name": "Unclaimed Lands (The Palisade)", "climate": "High Winterlands. Deep cold and heavy snow." } },
        { "id": "B5", "region_info": { "name": "Hrimthyr Isle", "climate": "Permanently frozen. Volcanic activity does not warm the island." } },
        { "id": "B6", "region_info": { "name": "Giant's Throne", "climate": "High Winterlands. High altitude ensures a brutally cold climate." } },
        { "id": "B7", "region_info": { "name": "The Freelands (The Stone Forest)", "climate": "Low Winterlands. Dense forest provides some shelter." } },
        { "id": "B8", "region_info": { "name": "The Freelands (Spyre & The Pinnacle)", "climate": "Low Winterlands. Elevated position makes it colder than surrounding hills." } },
        { "id": "B9", "region_info": { "name": "The Freelands (Lesser Hills)", "climate": "Low Winterlands. Cold, windswept climate with significant winter snowfall." } },
        { "id": "B10", "region_info": { "name": "Angarion (The Forest Heart)", "climate": "Hearthlands. Sheltered, stable microclimate." } },
        { "id": "C1", "region_info": { "name": "The Hellfrost (Icewall - North)", "climate": "The absolute extreme of Rassilon's climate." } },
        { "id": "C2", "region_info": { "name": "Unclaimed Lands (The Bleak Moor)", "climate": "High Winterlands. Exposed and windswept." } },
        { "id": "C3", "region_info": { "name": "Unclaimed Lands (Frost Hills)", "climate": "High Winterlands. Bitter winds and deep, lasting snows." } },
        { "id": "C4", "region_info": { "name": "The Battlelands (Calivar)", "climate": "Low Winterlands. Coastal location moderates temperature slightly." } },
        { "id": "C5", "region_info": { "name": "The Battlelands (Jotungraef)", "climate": "Low Winterlands. Hills provide little shelter, vales are boggy." } },
        { "id": "C6", "region_info": { "name": "Angmark (Leirvik)", "climate": "Hearthlands. Maritime climate with cool summers and cold, wet winters." } },
        { "id": "C7", "region_info": { "name": "The Mistlands & Isles of the Seareavers", "climate": "Unnaturally damp and cold due to magical fog (Mistlands). Fierce sea storms (Isles)." } },
        { "id": "C8", "region_info": { "name": "Alantaris Isle (Imperial City)", "climate": "Hearthlands. More temperate maritime climate than the mainland." } },
        { "id": "C9", "region_info": { "name": "The Inner Sea (West)", "climate": "Maritime. Unpredictable weather with dense fogs and violent storms." } },
        { "id": "C10", "region_info": { "name": "Angarion (Southern Border)", "climate": "Hearthlands. Slightly milder than the northern interior." } },
        { "id": "D1", "region_info": { "name": "The Hellfrost (Icewall - North-East)", "climate": "The absolute extreme of Rassilon's climate." } },
        { "id": "D2", "region_info": { "name": "Lakeland (Mere)", "climate": "High Winterlands. Long, brutal winters." } },
        { "id": "D3", "region_info": { "name": "Lakeland (Vimmar)", "climate": "Low Winterlands. Harsh and unforgiving." } },
        { "id": "D4", "region_info": { "name": "The Borderlands (Giantwatch)", "climate": "Low Winterlands. Long, cold winters with heavy snowfall." } },
        { "id": "D5", "region_info": { "name": "The Borderlands (Hjorn & Ludogov)", "climate": "Low Winterlands. Harsh, with cold winters and short, cool summers." } },
        { "id": "D6", "region_info": { "name": "The Freelands (The Citadel & Crase)", "climate": "Low Winterlands. High altitude ensures a cold, harsh climate." } },
        { "id": "D7", "region_info": { "name": "The Withered Lands & Foulwater Swamp", "climate": "Unnatural. Perpetually shrouded in cold, damp fog." } },
        { "id": "D8", "region_info": { "name": "Coglelund (Halfway)", "climate": "Hearthlands. Cold, windy winters and mild summers." } },
        { "id": "D9", "region_info": { "name": "The Magocracy (Principality of Darovia)", "climate": "Hearthlands. More moderate coastal climate." } },
        { "id": "D10", "region_info": { "name": "The Magocracy (Auldwood & Anselwood)", "climate": "Hearthlands. Cool, damp microclimate in the forests." } },
        { "id": "E1", "region_info": { "name": "Unclaimed Lands (Far Northeast Coast)", "climate": "High Winterlands. Brutal storms from the Narfel Sea." } },
        { "id": "E2", "region_info": { "name": "Unclaimed Lands (Sunken Realm Border)", "climate": "High Winterlands. Perpetually cold, with unusual mists and winds." } },
        { "id": "E3", "region_info": { "name": "Drachenlands (The Giant's Steps)", "climate": "Low Winterlands. Colder and harsher at higher altitudes." } },
        { "id": "E4", "region_info": { "name": "Drachenlands (Angrad)", "climate": "Low Winterlands. Long, cold winters." } },
        { "id": "E5", "region_info": { "name": "The Freelands (Nara & Sanctuary)", "climate": "Hearthlands. Cool and temperate." } },
        { "id": "E6", "region_info": { "name": "Royalmark (Hereford & Salnorr)", "climate": "Hearthlands. Overcast and dreary, with cold mists." } },
        { "id": "E7", "region_info": { "name": "Royalmark (Ravensburg)", "climate": "Hearthlands. Sheltered position gives a stable, predictable climate." } },
        { "id": "E8", "region_info": { "name": "Vestmark (Castle Hrafn)", "climate": "Hearthlands. Grim and overcast." } },
        { "id": "E9", "region_info": { "name": "The Magocracy (Principality of Bremen)", "climate": "Hearthlands. Temperate climate." } },
        { "id": "E10", "region_info": { "name": "The Magocracy (Principality of Hergenald)", "climate": "Hearthlands. Mild and pleasant southern coastal climate." } },
        { "id": "F1", "region_info": { "name": "The Icebarrier (Northeast)", "climate": "High Winterlands. Alpine and extremely harsh." } },
        { "id": "F2", "region_info": { "name": "Icedale Freeholds (The Icicle)", "climate": "High Winterlands. One of the coldest and most unforgiving cells." } },
        { "id": "F3", "region_info": { "name": "Icedale Freeholds (Icedale)", "climate": "High Winterlands. Long, dark, and brutally cold winters." } },
        { "id": "F4", "region_info": { "name": "Barony of Trond (Boarstream Border)", "climate": "Hearthlands. Cold winters and cool, breezy summers." } },
        { "id": "F5", "region_info": { "name": "Barony of Trond (Trondavoe)", "climate": "Hearthlands. Maritime climate with cool summers and milder winters." } },
        { "id": "F6", "region_info": { "name": "Heldalund (Held, Occupied)", "climate": "Low Winterlands. Cold and miserable, with a damp, chilling atmosphere." } },
        { "id": "F7", "region_info": { "name": "Heldalund (Norvik)", "climate": "Low Winterlands. Exposed to the north, with harsh, long winters." } },
        { "id": "F8", "region_info": { "name": "Barony of Cul", "climate": "Low Winterlands. Cold and harsh, long and severe winter." } },
        { "id": "F9", "region_info": { "name": "Nordmark (Yorvik)", "climate": "Hearthlands. Cold, snowy winters and cool, short summers." } },
        { "id": "F10", "region_info": { "name": "Crystalflow Confederacy (Bridgewater)", "climate": "Hearthlands. Temperate climate with cool summers and cold winters." } },
        { "id": "G1", "region_info": { "name": "Unclaimed Lands (Far Northeast Coast)", "climate": "High Winterlands. Brutal storms from the Narfel Sea." } },
        { "id": "G2", "region_info": { "name": "Unclaimed Lands (Sunken Realm Border)", "climate": "High Winterlands. Perpetually cold, with unusual mists and winds." } },
        { "id": "G3", "region_info": { "name": "Sunken Realm", "climate": "High Winterlands. Perpetually cold and dark." } },
        { "id": "G4", "region_info": { "name": "Liche Lands of Old (The Black Heath)", "climate": "Unnatural. Perpetually fog-shrouded and chillingly cold." } },
        { "id": "G5", "region_info": { "name": "Seithrby & Liche Lands (Southern Border)", "climate": "Low Winterlands. Cold winters, but land is fertile enough for grazing." } },
        { "id": "G6", "region_info": { "name": "Cairn Lands (Hergist)", "climate": "Hearthlands. Cool and temperate, but a supernatural chill in the hills." } },
        { "id": "G7", "region_info": { "name": "Ostmark (Iarnsburg & The Grimwold)", "climate": "Hearthlands. High rainfall in the west, drier in the east." } },
        { "id": "G8", "region_info": { "name": "Ostmark (Sandvik)", "climate": "Hearthlands. Maritime climate with mild winters and cool summers." } },
        { "id": "G9", "region_info": { "name": "Veermark (The Grasslands)", "climate": "Hearthlands, but more extreme. Cold, windy winters and hot, dry summers." } },
        { "id": "G10", "region_info": { "name": "Sutmark (The High Pass)", "climate": "Hearthlands, but warmer. Dry, bordering on arid." } }
    ],
    "conceptosWebApp": {
        "introduccion_hellfrost": { "titulo": "Bienvenido a Hellfrost", "descripcion": "Un escenario de fantasía épica para Savage Worlds, donde Rassilon está cubierto de hielo y nieve, y la magia es impredecible." },
        "el_mundo_de_rassilon": { "titulo": "Rassilon: La Tierra y sus Horrores", "descripcion": "Rassilon se divide en cinco regiones geográficas, desde el Hellfrost Profundo hasta las tierras civilizadas, cada una con sus propios peligros y culturas." },
        "creacion_de_personajes": { "titulo": "Conceptos de Creación de Personajes", "descripcion": "Crear héroes en Hellfrost es sencillo, siguiendo una serie de pasos con la hoja de personaje." },
        "magia_y_arcano": { "titulo": "La Magia en Hellfrost", "descripcion": "Rassilon es un mundo de magia, pero el Sifonamiento la ha vuelto peligrosa y poco fiable." },
        "equipo_y_logistica": { "titulo": "Conceptos de Equipo y Logística", "descripcion": "El equipo se adquiere con escudos de oro, y la disponibilidad de los artículos varía según la región." },
        "clima_y_ambiente": { "titulo": "Conceptos de Clima y Ambiente", "descripcion": "Hellfrost usa un sistema de 'niveles de temperatura' que afectan la supervivencia de los personajes." },
        "la_gloria": { "titulo": "Concepto de la Gloria", "descripcion": "Un rasgo que mide las grandes hazañas de los héroes, otorgando bonificaciones especiales." },
        "religion": { "titulo": "Conceptos Religiosos", "descripcion": "Los dioses de Rassilon son entidades poderosas pero limitadas, y el 'Pacto' impide su intervención directa." },
        "vida_en_rassilon": { "titulo": "Conceptos de la Vida en Rassilon", "descripcion": "Detalles sobre el calendario, costumbres funerarias, comercio y organizaciones del mundo." }
    }
};

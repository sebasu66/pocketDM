

// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
// In a real application, you would have proper data management and user registration.
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./config";
import { User, Campaign, Character, NarrativeThread, NarrativeComment, Race, CharacterCategory, Skill, Hindrance, Attribute, Edge, HellfrostItem, Conjuro, Archetype, Concepto } from "./types";

const defaultSystemPrompt = `You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.

- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.
- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.
- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.
- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.
- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure).`;

const defaultSystemPromptEs = `Eres un maestro narrador y un creativo Dungeon Master para un juego de rol de mesa. Tu tarea es tejer una narrativa convincente y colaborativa.

- **Analiza la Historia**: Lee atentamente el historial narrativo proporcionado, que incluye tus publicaciones anteriores y las acciones de los jugadores.
- **Consulta los Datos de los Personajes**: Usa las herramientas disponibles para buscar información sobre los personajes de los jugadores. Refiérete a ellos por su nombre e incorpora sus historias y habilidades únicas en la narrativa.
- **Impulsa la Historia**: Escribe la siguiente publicación de la historia. Debe ser una continuación directa de los eventos, reaccionando a las elecciones de los jugadores e introduciendo nuevos desafíos, personajes o giros en la trama.
- **Sé Evocativo**: Usa un lenguaje descriptivo para pintar una imagen vívida del mundo, sus habitantes y la atmósfera.
- **Mantén el Tono**: Adhiérete al tono establecido de la campaña (p. ej., fantasía épica, noir descarnado, aventura ligera).`;


// --- Seeding Data ---

const hellfrostGameData = {
  rassilon_grid_map_summary: [
    {
      id: 'A1',
      region_info: {
        name: 'El Hellfrost (El Núcleo)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Se cree que está habitado por los más poderosos gigantes de escarcha, dragones del Hellfrost y otros demonios monstruosos.',
        },
        ruler: 'Desconocido',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El Hellfrost apareció como un evento cataclísmico y repentino antes de la Guerra de la Ventisca, expandiéndose a un ritmo alarmante y borrando culturas enteras. Después de la guerra, el misterioso Muro de Hielo se levantó del suelo, aislando estos páramos helados del resto de Rassilon. Esta región profunda es la fuente del frío antinatural y las bestias aterradoras que asolan las Tierras de Invierno.',
        government:
          'No se conoce la existencia de un gobierno formal. Es una tierra gobernada por el poder bruto y primario, donde las criaturas más fuertes dominan su territorio.',
        military:
          'Los habitantes inteligentes, como los gigantes de escarcha y los osos blancos, son una fuerza militar en sí mismos. Están adaptados al frío extremo y representan una amenaza constante para las tierras al sur del Muro de Hielo.',
        geography:
          'Esta región es más hermosa y peligrosa de lo que cualquier escaldo puede describir. Presenta vastos campos de hielo afilado más grandes que países enteros, imponentes volcanes que arrojan fuegofrío y roca fangosa, y majestuosas montañas que se alzan como cuchillas en el horizonte. En los días más claros es visible un colosal pináculo de hielo, rodeado por dragones de una milla de largo.',
        climate:
          'Frío extremo y sobrenatural. Las temperaturas son lo suficientemente bajas como para congelar la carne expuesta en segundos. El clima está dominado por vientos constantes con fuerza de huracán que transportan partículas de hielo afiladas como cuchillas y lluvia de puro fuegofrío.',
      },
    },
    {
      id: 'A2',
      region_info: {
        name: 'El Hellfrost (Páramos Interiores)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Orcos, goblins y gigantes de escarcha se encuentran entre los habitantes menos peligrosos.',
        },
        ruler: 'Desconocido',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Los Caballeros de la Lanza y otros valientes aventureros han explorado solo una pequeña fracción de los páramos invernales. Lo que han encontrado ha hecho que más de uno caiga muerto de miedo. Los horrores que yacen hacia el núcleo es mejor imaginarlos junto a un fuego cálido, lejos del aullante viento del Hellfrost.',
        government:
          'Prevalece la anarquía y el gobierno del más fuerte. Las tribus de orcos y los clanes de gigantes de escarcha se han adaptado al frío intenso, pero no son los amos de esta tierra.',
        military:
          'Los habitantes están en un estado constante de guerra entre sí y con el propio entorno. No hay ejércitos organizados, solo bandas de guerra y depredadores monstruosos.',
        geography:
          'Una continuación del paisaje extraño y mortal del núcleo. Las características incluyen campos de hielo y nieve tan vastos y sin rasgos que pueden volver loco a una persona con solo verlos. Los rumores más extraños se relacionan con "la Herida", un cañón de cuatro millas de profundidad del que se eleva vapor caliente, evitando que el hielo se forme cerca.',
        climate:
          'Frío extremo y sobrenatural. Aunque no está en el nadir absoluto del núcleo, el clima sigue siendo hostil para casi todas las formas de vida del sur del Muro de Hielo.',
      },
    },
    {
      id: 'A3',
      region_info: {
        name: 'El Hellfrost (Páramos Exteriores)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Dominado por extrañas bestias que se asemejan a criaturas más mundanas, como mamuts cuyo aliento puede congelar a un hombre en el acto.',
        },
        ruler: 'Desconocido',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Este es el borde del verdadero Hellfrost, la región inmediatamente más allá del Muro de Hielo. Fue desde estas tierras que los ejércitos del Hellfrost se derramaron durante la Guerra de la Ventisca. Su proximidad al Muro de Hielo la convierte en la parte más "explorada" del Hellfrost, aunque este es un término relativo para una tierra que mata a casi todos los que entran.',
        government: 'Ninguno. Es un páramo sin ley.',
        military:
          'La principal presencia militar son la miríada de bestias del Hellfrost que habitan la región. No hay fuerzas organizadas, solo depredadores y presas en un ecosistema mortal.',
        geography:
          'La geografía está definida por el Muro de Hielo, una barrera de una milla de alto y 40 millas de espesor de hielo escarpado. El propio muro está plagado de las guaridas de dragones del Hellfrost y crioesfinges. La tierra más allá es una desolada extensión de nieve y hielo.',
        climate:
          'Frío extremo, aunque ligeramente menos severo que en los páramos interiores. El clima sigue siendo peligrosamente impredecible, con ventiscas repentinas y temperaturas en picado como norma.',
      },
    },
    {
      id: 'A4',
      region_info: {
        name: 'El Hellfrost (El Muro de Hielo - Norte)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Dragones del Hellfrost, crioesfinges y otras bestias caídas. Se han descubierto aproximadamente 20 guaridas de orcos que se extienden profundamente en el Muro de Hielo.',
        },
        ruler: 'Ninguno',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El Muro de Hielo surgió de la nada después de que terminó la Guerra de la Ventisca, deteniendo la expansión hacia el sur del Hellfrost. Los eruditos han debatido su origen durante siglos. Sirve como una barrera casi infranqueable, con solo unas pocas rutas conocidas como la Escalera Blanca que permiten el paso.',
        government: 'N/A',
        military:
          'Los habitantes de las cuevas del Muro de Hielo, principalmente orcos y monstruos, forman una línea defensiva formidable y caótica contra cualquiera que intente cruzar hacia el Hellfrost.',
        geography:
          'Un muro de una milla de alto y 40 millas de espesor de hielo sólido y escarpado. Escalarlo es posible pero excepcionalmente peligroso debido a las caras escarpadas, las condiciones traicioneras y las criaturas monstruosas que hacen sus guaridas en sus cuevas.',
        climate:
          'Las temperaturas de las Altas Tierras de Invierno prevalecen en el lado sur, con una caída drástica y dramática hacia el frío sobrenatural del Hellfrost en el lado norte. El propio muro está sujeto a vientos extremos y un clima impredecible.',
      },
    },
    {
      id: 'A5',
      region_info: {
        name: 'Tierras sin Reclamar (Franjas del Norte)',
        population: {
          total: '100,000+',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Una vasta franja de las Tierras de Invierno no reclamada por ningún gobernante poderoso. Estas tierras fueron una vez el hogar de los Selari y otras culturas perdidas durante la Guerra de la Ventisca. Ahora, es una frontera poblada por pequeños asentamientos independientes y clanes nómadas Finnar que desafían los duros elementos y los monstruos mortales.',
        government:
          'No hay un gobierno central. Cada asentamiento y clan es un oasis de civilización en un paisaje bárbaro, luchando por sobrevivir por su cuenta. No deben lealtad a nadie.',
        military:
          'Cada asentamiento es responsable de su propia defensa. No hay ejércitos permanentes, solo milicias y la dureza inherente de un pueblo acostumbrado a una vida de dificultades y peligro constante.',
        geography:
          'Los territorios centrales y occidentales son colinas bajas y praderas, sepultadas bajo un campo de nieve continuo durante la mayor parte del año. El suelo es duro como la roca incluso en el breve verano. El Páramo Sombrío, una meseta cubierta de nieve de árboles raquíticos y ciénagas heladas, es una característica clave.',
        climate:
          'Altas Tierras de Invierno. Los inviernos son brutalmente largos y fríos. En pleno verano, la nieve puede derretirse lo suficiente como para revelar el suelo helado debajo, pero este deshielo es breve y poco fiable. Toda la región está perpetuamente fría.',
      },
    },
    {
      id: 'A6',
      region_info: {
        name: 'Tierras sin Reclamar (Colinas Enanas)',
        population: {
          total: '100,000+',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Esta área de las Tierras sin Reclamar es notable por la feroz protección que los enanos dan a las ruinas aquí. La ciudad-fortaleza fue abandonada cuando sus habitantes marcharon hacia el norte para ayudar a Karad Marn, y desde entonces han impedido que cualquier otra raza, particularmente orcos y goblins, reclame las ruinas.',
        government:
          'Los clanes nómadas Finnar y los pequeños pueblos de la zona son todos independientes. La única fuerza política general es el decreto enano de que su ciudad en ruinas está fuera de los límites.',
        military:
          'Los Finnar y Tuomi locales son guerreros capaces, pero la principal fuerza militar son las patrullas enanas de las Tierras del Hogar que barren periódicamente el área para expulsar a los orcos y hacer valer su reclamo sobre las ruinas.',
        geography:
          'Una región de colinas empinadas que contienen las ruinas de una pequeña ciudad fortaleza enana. En tiempos más antiguos, antes del invierno extremo, estas laderas se usaban como punto de encuentro para el comercio entre enanos y otras razas. Varios caravasares en ruinas salpican las laderas más altas.',
        climate:
          'Altas Tierras de Invierno. El terreno montañoso crea patrones climáticos impredecibles, con valles que a menudo se llenan de profundos ventisqueros mientras los picos son azotados por el viento.',
      },
    },
    {
      id: 'A7',
      region_info: {
        name: 'Tierras sin Reclamar (El Gran Bosque)',
        population: {
          total: '100,000+',
          breakdown:
            'Principalmente clanes de elfos de la taiga y Finnar, pero también hogar de hadas, goblins, orcos y trolls.',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El Gran Bosque es un vasto y antiguo bosque de hoja perenne que se extiende por las Tierras sin Reclamar occidentales. Es un lugar salvaje y peligroso, en gran parte intacto por las razas civilizadas, que lo ven solo como otra parte del vasto e inconquistado territorio del norte.',
        government:
          'Ningún gobierno central. Los clanes de elfos de la taiga y Finnar que viven aquí son nómadas e independientes, gobernándose a sí mismos sin interferencia externa.',
        military:
          'Los elfos y Finnar que habitan el bosque son hábiles cazadores y guerreros, expertos en la guerra de guerrillas dentro de su patria boscosa. Son un elemento disuasorio para los orcos y goblins que también habitan en el bosque.',
        geography:
          'Un extenso bosque de hoja perenne. El terreno es difícil, una mezcla de bosques densos, valles ocultos y arroyos que están congelados la mayor parte del año. Los dragones del Hellfrost de las Montañas Grises al oeste y el Muro de Hielo al norte son una constante amenaza aérea.',
        climate:
          'Altas Tierras de Invierno. El denso dosel del bosque proporciona algo de refugio contra el viento y la nieve, haciéndolo ligeramente más habitable que las llanuras abiertas, aunque el frío sigue siendo intenso y peligroso.',
      },
    },
    {
      id: 'A8',
      region_info: {
        name: 'Tierras sin Reclamar (Bosque Alto)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Una zona en disputa habitada por elfos de la taiga, enanos de escarcha, orcos y gigantes de escarcha.',
        },
        ruler: 'Ninguno (en disputa)',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El Bosque Alto es una región amargamente disputada. Sirve como un amortiguador estratégico vital para la ciudad enana de Karad Marn. Si cayera por completo en manos de los orcos y gigantes del Muro de Hielo y las Montañas de la Guadaña, la ruta principal hacia la ciudad sitiada estaría en peligro.',
        government:
          'No hay gobierno, solo una guerra constante de bajo nivel entre las diversas facciones que compiten por el control del bosque.',
        military:
          'Bandas de elfos de la taiga y enanos de escarcha controlan la parte occidental del bosque, luchando tenazmente contra los orcos y gigantes de escarcha que controlan las secciones central y oriental.',
        geography:
          'Una densa franja de pinos, coníferas y abetos, encajada entre las Montañas Jotunvalk y de la Guadaña, el Muro de Hielo y la Meseta Caída. El terreno es montañoso y difícil, lo que hace que los movimientos de tropas a gran escala sean casi imposibles.',
        climate:
          'Altas Tierras de Invierno. La gran altitud y el terreno montañoso hacen de este uno de los bosques más fríos y traicioneros de la región.',
      },
    },
    {
      id: 'A9',
      region_info: {
        name: 'Tierras sin Reclamar (Bosque Congelado)',
        population: {
          total: 'Desconocida',
          breakdown: 'Espectros de escarcha y momias de hielo.',
        },
        ruler: 'Desconocido',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Madera de hielo'],
        background:
          'Una vez el magnífico reino de los elfos de la taiga de Morenelion, fue congelado instantáneamente por un viento sobrenatural al comienzo de la Guerra de la Ventisca. Los árboles se convirtieron instantáneamente en valiosa madera de hielo y sus habitantes en espectros de escarcha y momias de hielo no muertos. Las caravanas enanas realizan expediciones anuales para cosechar la madera de hielo.',
        government: 'N/A',
        military:
          'Los elfos no muertos que acechan en el bosque son sus únicos defensores. Son una amenaza mortal para cualquiera que se aventure demasiado profundo, especialmente en las regiones centrales donde tienden a congregarse.',
        geography:
          'Un vasto bosque de madera de hielo, congelado en el tiempo. Aquí no crece nada vivo. La Escalera Blanca, un paso traicionero a través del Muro de Hielo, comienza en este bosque. La región está bordeada por las Montañas de la Guadaña. Todo el valle está plagado de bestias del Hellfrost.',
        climate:
          'Un frío mágico y antinatural impregna el bosque, que permanece a una temperatura constante de -40 grados Fahrenheit, independientemente de la estación. El aire es quieto y gélido, un lugar de profundo silencio y muerte.',
      },
    },
    {
      id: 'A10',
      region_info: {
        name: 'Rimeholm (Montañas Jotunvalk)',
        population: {
          total: 19531,
          breakdown: '100% elfos de la taiga',
        },
        ruler: 'El Rey Blanco',
        religion: 'Ullr, Kenaz, Eostre, Tiw',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El mayor reino superviviente de los elfos de la taiga, Rimeholm se convirtió en su principal refugio después de la destrucción de Morenelion. A salvo detrás de las Montañas Jotunvalk, sobrevivieron a la Guerra de la Ventisca en gran parte intactos. Sin embargo, el levantamiento del Muro de Hielo los dejó con orcos y gigantes como vecinos cercanos.',
        government:
          'Una monarquía absoluta gobernada por el Rey Blanco, un antiguo y poderoso druida. Es servido por un consejo de druidas, clérigos y elementalistas conocido como los Señores Blancos. Sus dos hijos, el guerrero Rompehielos y el druida Ojosnocturnos, son rivales por la sucesión.',
        military:
          'El ejército está compuesto por pequeñas bandas de exploradores y druidas expertos en tiro con arco, esquí y montañismo. Los guardaespaldas de élite del Rey Blanco, la Guardia de la Ventisca, son formidables guerreros y practicantes de hrimwisardry (magia de hielo).',
        geography:
          'El reino se centra en el Bosque Blanco, un bosque de pinos y abetos en las laderas del sur de las Montañas Jotunvalk. Las montañas son escarpadas e infestadas de orcos y gigantes. El bosque está protegido por un perímetro de Piedras del Hogar mágicas que protegen de lo peor de la nieve y el hielo.',
        climate:
          'Altas Tierras de Invierno. Si bien las Piedras del Hogar mantienen el núcleo del bosque mágicamente templado (equivalente a las Tierras del Hogar), las montañas circundantes están sujetas al frío brutal y las fuertes nevadas de la región.',
      },
    },
    {
      id: 'B1',
      region_info: {
        name: 'El Hellfrost (Muro de Hielo - Norte)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Una región desolada, hogar de las bestias más resistentes del Hellfrost y tribus potencialmente no descubiertas de gigantes de escarcha u orcos adaptados al frío extremo.',
        },
        ruler: 'Ninguno',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Esta sección del Muro de Hielo norte es aún más remota y peligrosa que las áreas más al oeste. Marca el borde absoluto del mundo conocido, un lugar donde el frío antinatural del Hellfrost se encuentra con la barrera que lo contiene. Muy pocos han puesto los ojos en esta región y han regresado.',
        government: 'N/A. Anarquía y la ley de la selva.',
        military:
          'Los habitantes naturales, criaturas monstruosas de hielo y frío, son la única presencia militar. Son altamente territoriales y hostiles a todos los intrusos.',
        geography:
          'Una continuación del colosal Muro de Hielo, una barrera de hielo de una milla de altura. Es probable que esta área no tenga rasgos distintivos, un acantilado escarpado de hielo azotado por los vientos del Hellfrost. Cualquier paso o cueva aquí es desconocido y estaría excepcionalmente bien escondido o sería peligroso.',
        climate:
          'El frío más extremo imaginable en Rassilon. La cara norte es una pared escarpada de hielo azotada por vientos sobrenaturales, mientras que la cara sur experimenta las condiciones más duras de las Altas Tierras de Invierno.',
      },
    },
    {
      id: 'B2',
      region_info: {
        name: 'Arenas Brillantes',
        population: {
          total: '2,468+',
          breakdown:
            '70% Anari, 25% nacidos de la escarcha, 5% Saxa, más un número desconocido de orcos, gigantes y trolls.',
        },
        ruler: 'Ninguno (consejo municipal en Glaston)',
        religion: 'Thrym, Kenaz, Sigel',
        imports: ['Cerveza', 'ropa', 'grano', 'carne'],
        exports: ['Vidrio'],
        background:
          'Los eruditos han debatido durante mucho tiempo la formación de las Arenas Brillantes, ya que los registros antiguos muestran praderas fértiles en la región antes de la Guerra de la Ventisca. La teoría favorita actual es que una estrella cayó aquí, quemando la tierra y levantando las montañas. La única evidencia que respalda esto es el Lago de Vidrio. Docenas de ruinas calcinadas salpican el paisaje. Las Arenas Brillantes permanecen aisladas y solo se conocen como un páramo estéril para las razas del hogar.',
        government:
          'El único gobierno verdadero en la región es el consejo municipal de Glaston. Nueve concejales son elegidos cada año entre la población. También hay tres escaños automáticos, uno para los sacerdotes principales de Kenaz y Sigel, y uno para el comandante de la guardia. Todos los concejales tienen el mismo voto.',
        military:
          'Glaston, el único asentamiento en el reino, tiene un ejército de 100 infantes, todos mercenarios. Los mercenarios se dividen en tres unidades: una guardia permanente para el asentamiento, una escolta para los envíos de vidrio y exploradores que operan a lo largo de la ruta comercial y alrededor de la ciudad.',
        geography:
          'Un desierto frío de origen antinatural, rodeado por montañas al este y al sur, el Muro de Hielo al norte y el Mar Blanco al oeste. Aparte de las Grandes Dunas y las estribaciones de las montañas, gran parte de la tierra es una extensión sin rasgos de arena, rocas pequeñas y llanuras heladas. La característica clave es el Lago de Vidrio, un bloque sólido de vidrio excepcionalmente puro.',
        climate:
          'Altas Tierras de Invierno. La temperatura es notablemente más cálida que en las tierras circundantes, en el peor de los casos a la par con las Bajas Tierras de Invierno. A pesar de tener una costa, la precipitación es extremadamente rara, aunque se forma hielo sobre las arenas estériles durante los períodos de mucho frío.',
      },
    },
    {
      id: 'B3',
      region_info: {
        name: 'Tierras sin Reclamar (Lago Aguasgelidas)',
        population: {
          total: '100,000+',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Esta región está definida por el enorme Lago Aguasgelidas, el más grande del este de Rassilon. Es un recurso crítico para los nómadas Finnar y los asentamientos dispersos que salpican sus orillas. Las aguas del lago son una fuente tanto de sustento como de peligro.',
        government:
          'Los asentamientos alrededor del lago son independientes. Los clanes nómadas Finnar que frecuentan el área siguen a sus propios líderes y tradiciones tribales, sin deber lealtad a ningún gobernante terrateniente.',
        military:
          'Cada asentamiento y clan es responsable de su propia defensa. No hay ejércitos unificados, solo milicias y bandas de guerra locales.',
        geography:
          'El paisaje está dominado por el Lago Aguasgelidas. Las orillas occidental y septentrional marcan el comienzo efectivo de las Altas Tierras de Invierno. El lago está rodeado por una mezcla de bosque de taiga, llanuras y las estribaciones de los Picos Sigil. La larga y estrecha Isla de las Ruinas, llena de estructuras inexploradas, se encuentra entre los lagos Aguasgelidas y Blanco.',
        climate:
          'Altas Tierras de Invierno. Casi todo el lago se congela en invierno, aunque el hielo hacia el centro es muy delgado, lo que lo convierte en un cruce traicionero. Las tierras circundantes están sepultadas bajo una profunda nieve durante la mayor parte del año.',
      },
    },
    {
      id: 'B4',
      region_info: {
        name: 'Tierras sin Reclamar (La Empalizada)',
        population: {
          total: '100,000+',
          breakdown:
            'Pequeños pueblos y granjas independientes, principalmente Saxa y Tuomi.',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Esta región sirve como amortiguador contra los gigantes de escarcha del Trono del Gigante al oeste. Los colonos aquí son un pueblo resistente e independiente, acostumbrado a defenderse de las incursiones. A medida que los inviernos empeoran y los gigantes se vuelven más audaces, más colonos abandonan sus hogares y se mudan.',
        government:
          'Cada asentamiento es independiente y autónomo, una colección de pueblos y granjas sin vínculos formales entre sí.',
        military:
          'La defensa es local. Cada pueblo y granja debe proveer su propia protección. Se han construido atalayas en las laderas más altas para advertir de los ataques desde el Trono del Gigante.',
        geography:
          'Una región de colinas que se elevan bruscamente en el oeste en escalones cada vez mayores, formando una barrera natural. Las orillas occidentales alrededor del área donde se encuentran los lagos Aguasgelidas y Blanco albergan muchos asentamientos pequeños. El río Páramohelado proporciona un coto de caza ideal para la pesca en hielo.',
        climate:
          'Altas Tierras de Invierno. Las colinas escalonadas de la Empalizada ofrecen cierta protección contra los peores vientos que vienen del Trono del Gigante, pero la región todavía está sujeta a un frío profundo y fuertes nevadas.',
      },
    },
    {
      id: 'B5',
      region_info: {
        name: 'Isla Hrimthyr',
        population: {
          total: '12,000+',
          breakdown:
            '1,000 gigantes de escarcha, 10,000 orcos, 1,000 mercenarios nacidos de la escarcha (estimado).',
        },
        ruler: 'Gran Rey de Hielo Nagal Aliento de Ventisca',
        religion: 'Thrym, Dargar',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Considerada la patria de los gigantes de escarcha, la Isla Hrimthyr llegó a su estado actual durante la Guerra de la Ventisca, cuando un volcán de fuegofrío entró en erupción, formando la isla de roca fangosa semicongelada. Se utilizó como base para ataques contra el oeste de Rassilon. El gobernante actual, Nagal, está planeando una gran invasión de las Tierras de Batalla.',
        government:
          'Una autocracia absoluta. El Gran Rey de Hielo Nagal gobierna con un puño de hielo negro. Cualquier debilidad conduce a la muerte a manos de un rival. El propio Nagal tomó el poder matando a su predecesor por liderazgo inepto.',
        military:
          'Nagal comanda un gran ejército de gigantes de escarcha y orcos, reforzado por sacerdotes de Thrym, mercenarios nacidos de la escarcha, jinetes de lobos goblins de hielo y hrimwisards renegados. El ejército está bien organizado en regimientos y compañías, una desviación de las tácticas típicas de los gigantes.',
        geography:
          'Una isla de hielo sólido, que todavía se expande a medida que el volcán de fuegofrío siempre activo, las Fauces de Thrym, arroja lodo fundido al Mar Blanco. No hay vida vegetal. El lado oriental es montañoso (Montañas de la Cordillera de los Jarls), mientras que el oeste consiste en colinas onduladas (Colinas del Oso de Hielo) utilizadas como coto de caza de osos polares.',
        climate:
          'Permanentemente congelada. La actividad volcánica no calienta la isla, sino que se suma a su masa de hielo y roca fangosa. El Mar Blanco circundante a menudo está obstruido por bancos de hielo.',
      },
    },
    {
      id: 'B6',
      region_info: {
        name: 'Trono del Gigante',
        population: {
          total: '3,300+',
          breakdown: '300 gigantes de escarcha, 3,000 orcos y goblins (ambos estimados).',
        },
        ruler: 'Rey Kaldr el Malvado',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Un reino reconocido solo por los Caballeros del Hogar, aparece en la mayoría de los mapas como una advertencia. Los primeros informes de gigantes de escarcha aquí datan de después del Levantamiento del Hielo. Solo en los últimos 40 años han comenzado a hacer sentir su presencia, agitando a las tribus de goblins y asaltando las granjas saxa.',
        government:
          'El rey Kaldr gobierna con un puño de hielo negro. Siempre está vigilante, atento a los rivales que puedan adquirir demasiada gloria y busquen usurpar su trono. Ser honrado por Kaldr es tanto un reconocimiento al servicio como una advertencia.',
        military:
          'Prácticamente todos los habitantes forman parte del ejército de Kaldr. Provienen de tribus dispares y les gusta tanto luchar entre sí como con otras razas. Kaldr tiene a su disposición infantería, arqueros, artillería de asedio, jinetes de lobos, hrimwisards y clérigos de Thrym.',
        geography:
          'La tierra comprende la protuberancia sur de los Picos Sigil y las estribaciones circundantes. El río Aguasgelidas marca su frontera sur. Los Picos Sigil son una cordillera escarpada hogar de orcos, goblins y gigantes. La fortaleza del Trono del Gigante es una fortaleza gigantesca que surge orgánicamente de una montaña.',
        climate:
          'Altas Tierras de Invierno. La gran altitud de los Picos Sigil asegura un clima brutalmente frío con cobertura de nieve durante todo el año y tormentas frecuentes y violentas.',
      },
    },
    {
      id: 'B7',
      region_info: {
        name: 'Las Tierras Libres (El Bosque de Piedra)',
        population: {
          total: '4,000+',
          breakdown: '90% elfos del hogar, 8% Saxa, 2% engro.',
        },
        ruler: 'Asentamientos independientes',
        religion: 'Fes druídicas y elementales centradas en los círculos de piedra.',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Un bosque antiguo incluso para los estándares élficos, el Bosque de Piedra contiene seis círculos de piedra principales y diez veces más piedras individuales en pie, que son anteriores a todas las culturas conocidas en Rassilon. Estos círculos son importantes lugares de poder para druidas y elementalistas de la tierra.',
        government:
          'No hay un gobierno central. Las comunidades de elfos del hogar y los pocos asentamientos humanos operan de forma independiente, aunque los druidas y elementalistas que frecuentan los círculos de piedra actúan como una autoridad laxa.',
        military:
          'Los orcos y goblins de la Barrera de Hielo amenazan la parte norte del bosque, pero el poder combinado de los druidas y los elementalistas de la tierra les ha impedido obtener un punto de apoyo permanente.',
        geography:
          'Un antiguo bosque caducifolio que contiene numerosos y misteriosos círculos de piedra. El más famoso es el de las Nueve Hermanas en el centro del bosque. La Piedra Susurrante, en el borde oriental, produce un flujo constante de susurros débiles e ininteligibles.',
        climate:
          'Bajas Tierras de Invierno. El denso bosque proporciona algo de refugio contra lo peor del invierno, pero el clima sigue siendo frío y duro, con inviernos largos y veranos cortos y frescos.',
      },
    },
    {
      id: 'B8',
      region_info: {
        name: 'Las Tierras Libres (Spyre y El Pináculo)',
        population: {
          total: 18725,
          breakdown:
            'Principalmente Anari y Saxa, con una importante comunidad de enanos de escarcha en Spyre.',
        },
        ruler: 'Conde Baldar Anthwine (en Spyre)',
        religion: 'Thunor, Ertha, el Incognoscible',
        imports: ['Pieles', 'artículos de lujo', 'comida', 'vino'],
        exports: ['Cobre', 'gemas', 'hierro', 'piedra'],
        background:
          'Esta región está dominada por la ciudad de Spyre, que se asienta sobre una montaña solitaria conocida como el Pináculo. Construida mucho antes de la Guerra de la Ventisca, es una ciudad de antiguos misterios, aislada de las tierras de abajo. El gobernante de la ciudad ha aprobado recientemente una ley que permite a los enanos de escarcha residentes pagar menos impuestos a cambio de reparar el único acceso de la ciudad, el desmoronado Puente del Jugador.',
        government:
          'Spyre está gobernada por un conde hereditario. Los enanos de escarcha de Dvergdelf, tallados en la ladera de la montaña, se gobiernan a sí mismos pero son súbditos del conde.',
        military:
          'Spyre mantiene su propia guardia de la ciudad. El clan de enanos de escarcha proporciona sus propios guerreros, principalmente preocupados por defender su hogar subterráneo.',
        geography:
          'El paisaje está dominado por el Pináculo, una única montaña de cima plana que se eleva media milla sobre las Colinas Menores circundantes. La ciudad de Spyre se asienta en este afloramiento. El único acceso es a través de un sendero largo y sinuoso y un único puente arqueado, antiguo y traicionero. El misterioso edificio de la Aguja domina el horizonte de la ciudad.',
        climate:
          'Bajas Tierras de Invierno. La posición elevada de Spyre la hace más fría que las colinas circundantes. Está sujeta a fuertes vientos y fuertes tormentas de invierno, lo que hace que el viaje a través del Puente del Jugador sea extremadamente peligroso.',
      },
    },
    {
      id: 'B9',
      region_info: {
        name: 'Las Tierras Libres (Colinas Menores)',
        population: {
          total: 'Desconocida',
          breakdown: 'Pequeños pueblos de Anari y Saxa.',
        },
        ruler: 'Asentamientos independientes',
        religion: 'Principalmente el panteón estándar de las Tierras del Hogar.',
        imports: ['Productos terminados'],
        exports: ['Oro', 'plata', 'productos alimenticios'],
        background:
          'Las Colinas Menores se llaman así porque parecen meros hormigueros en comparación con la imponente montaña del Pináculo que las rodea. Los pueblos de aquí se ganan la vida extrayendo pequeñas cantidades de oro y plata o cultivando y vendiendo su excedente de producción a la gente de Spyre.',
        government:
          'Cada pueblo es independiente, sin ningún gobernante que controle toda la región. Tienen una relación laxa e informal con la ciudad de Spyre.',
        military:
          'Cada pueblo mantiene su propia milicia. Deben enfrentarse a gigantes, trolls y orcos que viven en la zona, así como a incursiones ocasionales de muertos vivientes de las Tierras Marchitas al norte. A menudo son ayudados por la milicia de Spyre y los elfos de Angarion.',
        geography:
          'Una serie de colinas altas y estériles que rodean la montaña del Pináculo. Unos pocos pueblos pequeños salpican el paisaje. El área es hogar de gigantes, trolls y orcos, aunque no en grandes cantidades.',
        climate:
          'Bajas Tierras de Invierno. Las colinas ofrecen poca protección contra los elementos, lo que resulta en un clima frío y ventoso con importantes nevadas en invierno.',
      },
    },
    {
      id: 'B10',
      region_info: {
        name: 'Angarion (El Corazón del Bosque)',
        population: {
          total: 23048,
          breakdown: '99% elfos del hogar, 1% engro',
        },
        ruler: 'El Rey Resplandeciente',
        religion: 'Sigel, Eostre y Ullr',
        imports: ['Autosuficiente'],
        exports: ['Arte', 'joyería'],
        background:
          'El centro de la cultura de los elfos del hogar y hogar de su capital, la ciudad de Angarion. Desde el avance del Hellfrost, la población ha aumentado constantemente a medida que los refugiados acuden aquí en busca de seguridad. Los elfos aquí se han retirado de los asuntos de otras razas, solo emergiendo para repeler las incursiones del Pantano Aguasucias o las Tierras Marchitas.',
        government:
          'Una monarquía absoluta gobernada por el Rey Resplandeciente, un elfo de piel dorada de la profecía. No ha sido visto en público durante un siglo, y gobierna a través de su chambelán. Los rivales potenciales por el trono están conspirando para el día en que muera.',
        military:
          'Cada elfo adulto es un soldado. Cada noble en Angarion mantiene un ejército de arqueros y druidas. El Rey Resplandeciente mantiene una guardia real de infantería blindada conocida como danzarines de espadas. Están listos para morir por su rey en cualquier momento.',
        geography:
          'Un antiguo bosque caducifolio de robles, abedules y arces. La vegetación del suelo es densa, y los senderos son pocos y distantes entre sí. Se cree que los elfos pueden hacer que el bosque se cierre sobre los intrusos. El río Corriente Verde serpentea perezosamente a través del bosque. Las Colinas Desnudas, donde no crece nada, son una extraña y estéril característica dentro del bosque.',
        climate:
          'Tierras del Hogar. El denso bosque proporciona un microclima más protegido y estable que las tierras circundantes, aunque todavía está sujeto a los fríos inviernos de la región.',
      },
    },
    {
      id: 'C1',
      region_info: {
        name: 'El Hellfrost (Muro de Hielo - Norte)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Probablemente deshabitado por vida inteligente, salvo por las bestias del Hellfrost más poderosas y adaptadas al frío.',
        },
        ruler: 'Ninguno',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Esta sección del Muro de Hielo marca la frontera entre el mundo conocido y la desolación absoluta del Hellfrost. Es una región de mitos y terror, un lugar del que no han regresado expediciones conocidas. Es la frontera norte absoluta.',
        government: 'N/A',
        military:
          'El propio entorno es el principal obstáculo militar. Cualquier criatura aquí sería un depredador ápice de los páramos helados.',
        geography:
          'La cara norte del Muro de Hielo, un acantilado escarpado de una milla de altura de hielo irregular. Se cree que la tierra más allá es una extensión interminable de hielo y nieve, aún más sin rasgos y hostil que los páramos occidentales.',
        climate:
          'El extremo absoluto del clima de Rassilon. El lado sur se enfrenta a todo el rigor de las Altas Tierras de Invierno, mientras que el lado norte es un torbellino de frío y viento sobrenaturales del Hellfrost.',
      },
    },
    {
      id: 'C2',
      region_info: {
        name: 'Tierras sin Reclamar (El Páramo Sombrío)',
        population: {
          total: '100,000+',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Este páramo elevado es un lugar de misterio dentro de las Tierras sin Reclamar. Está dominado por las ruinas de una ciudad construida por una cultura perdida hace mucho tiempo. Los Caballeros del Hogar han informado haber visto luces extrañas en las atalayas de la ciudad, pero no han podido identificar la causa, lo que se suma a la siniestra reputación de la región.',
        government:
          'Los clanes nómadas Finnar y Tuomi que atraviesan esta región son autónomos. No hay autoridad más allá del líder del clan o el anciano del pueblo.',
        military:
          'Los clanes nómadas son guerreros hábiles, pero no hay ejércitos formales. La defensa es un asunto de clan y familia.',
        geography:
          'Una meseta cubierta de nieve caracterizada por árboles raquíticos y ciénagas heladas, que se descongelan en traicioneros pantanos durante los breves y suaves veranos. En el centro del páramo se encuentra una gran ciudad en ruinas, rodeada de numerosas atalayas.',
        climate:
          'Altas Tierras de Invierno. El páramo está expuesto y azotado por el viento. El deshielo de las ciénagas en verano crea un frío húmedo y escalofriante que se aferra al paisaje, incluso en los días más cálidos.',
      },
    },
    {
      id: 'C3',
      region_info: {
        name: 'Tierras sin Reclamar (Colinas de Escarcha)',
        population: {
          total: '100,000+',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Las Colinas de Escarcha son una región escasamente poblada de las Tierras sin Reclamar. Una vez hogar de más granjas saxa, la mayoría han sido abandonadas debido al creciente frío y las incursiones de orcos y goblins que descienden de los Picos Sigil.',
        government:
          'No hay un gobierno general. Las pocas granjas restantes y los clanes nómadas Finnar que pasan por allí son completamente independientes.',
        military:
          'Los habitantes deben valerse por sí mismos. No hay un ejército permanente, y la región se considera una frontera peligrosa.',
        geography:
          'Una serie de colinas empinadas que se elevan desde la orilla oriental del Lago Aguasgelidas. El paisaje es estéril y rocoso, con poca vegetación. Los orcos y goblins de los Picos Sigil son los habitantes principales, aunque no han establecido grandes asentamientos.',
        climate:
          'Altas Tierras de Invierno. Las colinas no ofrecen protección contra los elementos, y la región es conocida por sus vientos amargos y nieves profundas y duraderas.',
      },
    },
    {
      id: 'C4',
      region_info: {
        name: 'Las Tierras de Batalla (Calivar)',
        population: {
          total: 39046,
          breakdown: '69% Tuomi, 11% Anari, 10% nacidos de la escarcha, 8% Saxa, 2% engro',
        },
        ruler: 'Mormaer Vipoig Maestro Velero Vepogenus (en Calivar)',
        religion: 'Tiw, Eostre, Kenaz, Neorthe, Thunor',
        imports: ['Cerveza', 'ropa', 'vino'],
        exports: ['Pescado', 'gemas'],
        background:
          'Esta región norte de las Tierras de Batalla se define por su proximidad al mar y la constante amenaza de incursiones de gigantes de escarcha desde la Isla Hrimthyr. El asentamiento principal, Calivar, ve poco comercio debido a esta amenaza, lo que obliga a los comerciantes a tomar rutas terrestres más seguras. Mormaer Vipoig es un maestro marinero que lidera personalmente la defensa contra los incursores náuticos.',
        government:
          'La región es una confederación laxa de tribus. El gobernante de la ciudad principal, Calivar, es un Mormaer (un líder de clan Tuomi).',
        military:
          'Calivar mantiene una flota de cuatro drakkars y dos snekkes, tripulados por marineros y guerreros expertos. Son expertos en maniobrar entre los barcos más grandes de los gigantes de escarcha, frustrando los desembarcos con tácticas de ataque y huida.',
        geography:
          'El puerto marítimo más septentrional de la costa oeste. Un hito clave es el Templo de los Elfos Marinos, una misteriosa estructura de coral que se encuentra a media milla de la costa, anterior a la llegada de los humanos. A menudo se ven Havmand (sirenas) cerca del templo.',
        climate:
          'Bajas Tierras de Invierno. La ubicación costera modera ligeramente la temperatura en comparación con las regiones del interior, pero todavía está sujeta a inviernos largos y duros y feroces tormentas marinas.',
      },
    },
    {
      id: 'C5',
      region_info: {
        name: 'Las Tierras de Batalla (Jotungraef)',
        population: {
          total: 39046,
          breakdown: '69% Tuomi, 11% Anari, 10% nacidos de la escarcha, 8% Saxa, 2% engro',
        },
        ruler: 'Mormaer Pyrogenes Peliazul Murtholoic (en Jotungraef)',
        religion: 'Tiw, Eostre, Kenaz, Neorthe, Thunor',
        imports: ['Cerveza', 'ropa', 'vino'],
        exports: ['Pescado', 'gemas'],
        background:
          'La parte sur de las Tierras de Batalla está dominada por la ciudad de Jotungraef ("Tumba del Gigante"). Fue rebautizada de Cailtarni después de que un vasto ejército de gigantes de escarcha fuera derrotado allí en 381 IR. El héroe de la batalla, Canaul, es ahora objeto de un creciente culto guerrero. El gobernante actual, descendiente de Canaul, es arrogante y está ansioso por tener la oportunidad de luchar contra los gigantes de escarcha él mismo.',
        government:
          'La región es una confederación laxa de tribus. El gobernante de la ciudad principal, Jotungraef, es un Mormaer.',
        military:
          'Cada tribu mantiene su propio ejército. El culto a Canaul-Tiw se está convirtiendo en una importante fuerza militar y social, con guerreros que alteran antiguas canciones de batalla para incorporar al nuevo héroe-deidad.',
        geography:
          'La región presenta los escarpados y estériles Montículos de Batalla al norte y las pantanosas Colinas de la Ciénaga al sur. Alrededor de Jotungraef hay numerosos túmulos, cada uno con el cadáver sin cabeza de un gigante asesinado por Canaul, que la superstición local afirma que ahuyenta nuevas incursiones.',
        climate:
          'Bajas Tierras de Invierno. Las colinas ofrecen poco refugio, y los valles y cañadas son extremadamente pantanosos, especialmente en verano cuando se derriten las nieves del invierno.',
      },
    },
    {
      id: 'C6',
      region_info: {
        name: 'Angmark (Leirvik)',
        population: {
          total: 53458,
          breakdown: '84% Saxa, 10% Anari, 5% engro, 1% nacidos de la escarcha',
        },
        ruler: 'Cyning Knui Gillingsunu',
        religion: 'Neorthe, Freo, Thunor, Eostre',
        imports: ['Tela', 'hierro', 'cerámica'],
        exports: ['Pescado', 'pieles', 'sal', 'madera', 'aceite de ballena'],
        background:
          'Esta región contiene Leirvik, la capital de Angmark y sede de su rey. Es una ciudad grande y fortificada a orillas del Mar Interior, que mantiene una gran flota pesquera y tres drakkars (barcos de guerra). La ciudad es un centro para el culto a Neorthe, el dios del mar, y cuenta con un nuevo templo con forma de casco de barco. Justo a las afueras de la ciudad vive la misteriosa y demente vidente conocida como la Vieja Madre.',
        government:
          'Una monarquía hereditaria. El Cyning gobierna desde Leirvik, pero debe gestionar constantemente las ambiciones de sus jarls.',
        military:
          'El Cyning mantiene su ejército y flota personales en Leirvik. Las defensas de la ciudad son formidables, y sirve como el comando militar central del reino.',
        geography:
          'La ciudad se encuentra en un puerto natural y tiene una playa de guijarros larga y poco profunda conocida como la Ribera. Está cerca de las Colinas Draugr, una serie de colinas escarpadas y azotadas por el viento llenas de antiguos túmulos y cairns funerarios. Estas colinas son ahora un lugar de peligro, siendo los orcos y goblins la amenaza más común.',
        climate:
          'Tierras del Hogar. Su posición costera en el Mar Interior le da un clima marítimo con veranos frescos e inviernos fríos y húmedos. Las colinas cercanas son traicioneras, con muchas trampas para el viajero incauto.',
      },
    },
    {
      id: 'C7',
      region_info: {
        name: 'Las Tierras de la Niebla y las Islas de los Saqueadores Marinos',
        population: {
          total: '3,356 (Saqueadores Marinos) + Desconocida (Tierras de la Niebla)',
          breakdown:
            'Saqueadores Marinos: 50% Anari, 30% Saxa, 12% nacidos de la escarcha, 8% orcos y goblins. Tierras de la Niebla: Desconocida.',
        },
        ruler:
          'General Saqueador Odbert Lenguasucia (Saqueadores Marinos); Ninguno (Tierras de la Niebla)',
        religion:
          'Neorthe, Nauthiz, Thunor, Dargar (Saqueadores Marinos); Hela (Tierras de la Niebla, posiblemente)',
        imports: ['Ninguno (los Saqueadores Marinos toman lo que quieren)'],
        exports: ['Ninguno'],
        background:
          'Esta celda contiene dos regiones distintas y peligrosas. Las Tierras de la Niebla fueron una vez una próspera región minera Anari llamada Valle de Plata. Hace más de 30 años, una niebla mágica cubrió la tierra y toda la población desapareció. La región ahora se considera maldita. En alta mar, las Islas de los Saqueadores Marinos son la base de una notoria hermandad de piratas y asesinos que aterrorizan las costas occidentales.',
        government:
          'Las Tierras de la Niebla no tienen ley y están deshabitadas. Los Saqueadores Marinos son liderados por un General Saqueador, un título que se le da al capitán que saquea el mayor botín cada año.',
        military:
          'Las Tierras de la Niebla no tienen ejército, solo monstruos errantes. Cada capitán Saqueador Marino comanda su propia tripulación, formando un ejército privado. El General Saqueador tiene la fuerza más grande pero no puede detener una revuelta importante.',
        geography:
          'Las Tierras de la Niebla son las estribaciones de los Picos Sigil, llenas de ciénagas apestosas y humedales, y perpetuamente envueltas en una densa niebla mágica que reduce la visibilidad a casi cero. Las Islas de los Saqueadores Marinos son una cadena de tres islas principales y docenas de islas más pequeñas, en su mayoría escarpadas y cubiertas de bosques ligeros. Ruinas de una antigua cultura prehumana salpican las islas.',
        climate:
          'Las Tierras de la Niebla son antinaturalmente húmedas y frías debido a la niebla mágica. Las corrientes cálidas del Mar Interior ofrecen cierta protección contra lo peor del invierno, pero la niebla crea una atmósfera escalofriante y espeluznante. Las Islas están sujetas a feroces tormentas marinas.',
      },
    },
    {
      id: 'C8',
      region_info: {
        name: 'Isla Alantaris (Ciudad Imperial)',
        population: {
          total: 110840,
          breakdown:
            '83% Anari, 5% Saxa, 5% enanos, 3% elfos, 2% engro, 2% nacidos de la escarcha',
        },
        ruler: 'Consejo electo (Consejo de Ciudadanos)',
        religion: 'Maera, Neorthe, Var y Ertha',
        imports: ['Joyería', 'hierro', 'vino'],
        exports: [
          'Pociones alquímicas',
          'grano',
          'pescado',
          'madera',
          'aceite de ballena',
        ],
        background:
          'El corazón del antiguo Imperio Anari. La Ciudad Imperial, aunque es una sombra de lo que fue, sigue siendo la ciudad más grande de las Tierras del Hogar por área. Los otrora grandes canales que dividían los anillos concéntricos de la ciudad ahora están obstruidos con escombros de la Guerra de la Ventisca. La vida continúa en el protegido Cuartel del Palacio central.',
        government:
          'El Consejo de Ciudadanos gobierna desde el Palacio de los Ciudadanos, un antiguo bloque de establos del gran Palacio Imperial. El presidente del consejo debe ser de origen común para garantizar la imparcialidad.',
        military:
          'Las principales fuerzas militares de la isla tienen su base en y alrededor de la Ciudad Imperial y su puerto cercano. Se centran principalmente en contener la amenaza orca del Bosque de los Orcos y defender el puerto.',
        geography:
          'La Ciudad Imperial es una ruina en expansión. Solo queda en pie el Cuartel del Palacio central. El resto, conocido como "Los Escombros", es un laberinto caótico de edificios derrumbados habitado por monstruos y saqueadores de tumbas. La cordillera de los Tres Picos domina la isla central, sus estribaciones alguna vez albergaron pueblos, villas y minas, ahora todos desiertos.',
        climate:
          'Tierras del Hogar. La isla disfruta de un clima marítimo más templado que el continente, pero las ruinas de la ciudad son frías y con corrientes de aire, y los picos de las montañas ven nieve durante gran parte del año.',
      },
    },
    {
      id: 'C9',
      region_info: {
        name: 'El Mar Interior (Oeste)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Navegantes, piratas, comerciantes y diversas criaturas marinas.',
        },
        ruler: 'Ninguno',
        religion: 'Neorthe, Nauthiz',
        imports: ['N/A'],
        exports: ['N/A'],
        background:
          'El Mar Interior es un cuerpo de agua vital para las Tierras del Hogar occidentales, sirviendo como una arteria principal para el comercio y los viajes. También es un lugar de gran peligro, con las Islas de los Saqueadores Marinos cerca y las galeras orcas de Orcomarca a menudo merodeando por sus aguas del sur.',
        government:
          'El mar no tiene ley. Las patrullas navales de la Isla Alantaris y los príncipes mercaderes de la Magocracia intentan imponer algo de orden, pero su alcance es limitado.',
        military:
          'Las principales fuerzas militares son las flotas de los Saqueadores Marinos y la armada de la Isla Alantaris. Los barcos mercantes individuales a menudo están armados, y los asentamientos costeros mantienen sus propios pequeños botes patrulleros.',
        geography:
          'Un gran cuerpo de agua salada que separa la Isla Alantaris del continente. Las aguas pueden ser traicioneras, con tormentas repentinas y corrientes peligrosas. El lecho marino está lleno de los restos de antiguos barcos anari y víctimas piratas más recientes.',
        climate:
          'Marítimo. El clima es impredecible. Las nieblas densas son comunes y pueden aparecer tormentas violentas con poca advertencia, lo que representa una amenaza significativa incluso para los marineros más experimentados.',
      },
    },
    {
      id: 'C10',
      region_info: {
        name: 'Angarion (Frontera Sur)',
        population: {
          total: 23048,
          breakdown: '99% elfos del hogar, 1% engro',
        },
        ruler: 'El Rey Resplandeciente',
        religion: 'Sigel, Eostre y Ullr',
        imports: ['Autosuficiente'],
        exports: ['Arte', 'joyería'],
        background:
          'El borde sur del gran bosque élfico es una frontera fuertemente custodiada y vigilante. Los elfos aquí son particularmente cautelosos con los reinos humanos expansionistas y políticamente complejos de Coglelund y la Magocracia al sur. Las tensiones con la Magocracia, que ha comenzado a invadir el oeste de Angarion, son particularmente altas.',
        government:
          'La región está bajo el gobierno absoluto del Rey Resplandeciente, aunque el gobierno local está a cargo de las casas nobles cuyas tierras se encuentran a lo largo de la frontera.',
        military:
          'Las fronteras son vigiladas constantemente por guerreros elfos, muchos de ellos guardianes del bosque, y por animales que informan a los elfos. A los intrusos se les advierte una vez que regresen, y los que se niegan aprenden rápidamente de la reputación de los elfos como maestros arqueros.',
        geography:
          'El antiguo bosque caducifolio da paso a las llanuras planas y cubiertas de hierba de Coglelund al sur. La frontera no es una línea clara, sino una zona de influencia cambiante donde el borde del bosque se encuentra con las tierras reclamadas por los humanos.',
        climate:
          'Tierras del Hogar. El borde sur del bosque experimenta un clima ligeramente más suave que el interior del norte, pero sigue siendo una tierra de veranos frescos e inviernos fríos.',
      },
    },
    {
      id: 'D1',
      region_info: {
        name: 'El Hellfrost (Muro de Hielo - Noreste)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Habitado solo por las criaturas del Hellfrost más poderosas.',
        },
        ruler: 'Ninguno',
        religion: 'Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El borde noreste del Muro de Hielo es un lugar de desolación absoluta. Es el punto más alejado del mundo conocido desde la relativa calidez y seguridad de las Tierras del Hogar del sur. Las leyendas entre los enanos del norte hablan de ciudades enteras de hielo que se encuentran más allá de esta parte del muro, pero se descartan como meras fábulas.',
        government: 'N/A',
        military:
          'El propio entorno es la mayor defensa. Cualquier criatura que pueda sobrevivir aquí es un enemigo formidable.',
        geography:
          'El punto donde el Muro de Hielo se curva hacia el este. La geografía está definida por el colosal acantilado de hielo, probablemente roto por glaciares e inmensos campos de nieve azotados por el viento en su lado sur. El lado norte es una caída vertical hacia el Hellfrost.',
        climate:
          'El extremo absoluto del clima de Rassilon. Una región de invierno sobrenatural perpetuo, donde el sol es una luz distante e impotente en el cielo.',
      },
    },
    {
      id: 'D2',
      region_info: {
        name: 'Tierra de Lagos (Mere)',
        population: {
          total: 14649,
          breakdown:
            '45% Finnar, 30% Saxa, 20% nacidos de la escarcha, 5% Anari',
        },
        ruler: 'Consejo (Maestro Cazador Orkning Visinsunu en Mere)',
        religion: 'Ullr, Neorthe, Thunor',
        imports: ['Cerveza', 'grano', 'vegetales'],
        exports: ['Pieles', 'marfil', 'carne'],
        background:
          'Los confines más septentrionales de la Tierra de Lagos, esta área fue abandonada en gran parte después de la Guerra de la Ventisca y reasentada hace solo 50 años por cazadores atraídos por su abundancia de caza. Los habitantes son rudos y hoscos, centrados en la supervivencia en una tierra dura. La ciudad principal, Mere, está fuertemente fortificada contra los ataques de orcos y goblins.',
        government:
          'La región está gobernada por el Consejo de Caza de la Tierra de Lagos, compuesto por maestros cazadores de cada asentamiento. El consejo se reúne en Vimmar una vez al año.',
        military:
          'Cada habitante está entrenado en combate y supervivencia. Cada ciudadano de Mere entre 15 y 50 años debe practicar diariamente con el arco o la jabalina, lo que le da a la ciudad una milicia impresionantemente hábil.',
        geography:
          'La tierra está dominada por las orillas del norte del Lago Serpiente. El terreno es una mezcla de bosque de taiga y llanuras heladas. La ciudad de Mere se encuentra en las Altas Tierras de Invierno y está cubierta de nieve durante gran parte del año, dependiendo del lago para los suministros.',
        climate:
          'Altas Tierras de Invierno. Los inviernos son largos y brutales, con el lago congelándose durante meses. El corto verano es fresco y breve. Esta es una de las regiones habitadas más frías al sur del Muro de Hielo.',
      },
    },
    {
      id: 'D3',
      region_info: {
        name: 'Tierra de Lagos (Vimmar)',
        population: {
          total: 14649,
          breakdown:
            '45% Finnar, 30% Saxa, 20% nacidos de la escarcha, 5% Anari',
        },
        ruler: 'Consejo (Maestra Cazadora Gwendolyn Crinblanca en Vimmar)',
        religion: 'Ullr, Neorthe, Thunor',
        imports: ['Cerveza', 'grano', 'vegetales'],
        exports: ['Pieles', 'marfil', 'carne'],
        background:
          'Este es el corazón de la Tierra de Lagos, con su capital, Vimmar, que sirve como el principal centro de comercio y gobierno. La mayoría de la población son nómadas Finnar que vagan por las Tierras sin Reclamar y regresan en invierno. La cultura se centra en la caza y la supervivencia.',
        government:
          'El Consejo de Caza de la Tierra de Lagos gobierna el estado colectivo. El consejo, compuesto por maestros cazadores de cada asentamiento, se reúne en el Gran Pabellón de Vimmar al comienzo de cada temporada de caza. El asiento reservado para el dios Ullr es un acto de sacrilegio para que un mortal se siente en él.',
        military:
          'Cada cazador es hábil con el arco y la lanza y está bien entrenado en emboscadas y sigilo. Los asentamientos entrenan a cada hombre, mujer y niño en habilidades básicas de combate. Aunque no son aptos para batallas campales, sus tácticas de guerrilla harían que cualquier invasión fuera costosa.',
        geography:
          'La región está centrada alrededor del vasto Lago Serpiente, llamado así por su forma inusual. La capital, Vimmar, se encuentra en la ruta comercial hacia Aspiria. El Gran Pabellón de Vimmar es una magnífica estructura de madera, sus pilares decorados con hueso y marfil incrustados.',
        climate:
          'Bajas Tierras de Invierno. El lago se congela durante varios meses al año, lo que permite viajar en trineo pero detiene el tráfico de barcos. Las orillas pueden permanecer congeladas durante la primavera y el otoño. El clima es duro e implacable.',
      },
    },
    {
      id: 'D4',
      region_info: {
        name: 'Las Tierras Fronterizas (Guardia del Gigante)',
        population: {
          total: 40489,
          breakdown:
            '35% Tuomi, 25% Anari, 10% Saxa, 10% enanos, 10% nacidos de la escarcha, 5% elfos de la taiga, 3% elfos del hogar, 2% engro',
        },
        ruler: 'Mormaer Grith Bebedor de Hidromiel Fidaich (en Guardia del Gigante)',
        religion: 'Kenaz, Ertha, Tiw, Sigel',
        imports: ['Hierro', 'carne', 'madera'],
        exports: ['Armadura', 'armas'],
        background:
          'Esta parte norte de las Tierras Fronterizas es una zona fronteriza constantemente amenazada por gigantes de escarcha del norte. El asentamiento principal, Guardia del Gigante, fue construido después de la Guerra de la Ventisca para contrarrestar esta amenaza. Su gobernante es un cacique hereditario que ha instituido el entrenamiento de milicias obligatorio para todos los hombres.',
        government:
          'Al igual que el resto de las Tierras Fronterizas, la región es un mosaico de asentamientos independientes. Guardia del Gigante está gobernada por un Mormaer hereditario que ve su ciudad como un oasis de civilización en una tierra caótica.',
        military:
          'Guardia del Gigante es una ciudad militar. El gran número de carboneros y herreros trabajan constantemente para forjar armaduras y armas. El gobernante, Grith Bebedor de Hidromiel, envía a sus tropas a incursiones en las profundidades de las Colinas de los Uros para mantener bajo el número de hombres bestia. Sus leyes son justas, pero los castigos son duros.',
        geography:
          'La región comprende colinas ligeramente boscosas, con las Montañas Cuchilla de Hielo al norte. El camino oeste que sale de Guardia del Gigante cruza el río Filo de Cuchilla a través de un puente de madera que puede derrumbarse durante un ataque. La ciudad está constantemente envuelta en el humo de sus muchas forjas.',
        climate:
          'Bajas Tierras de Invierno. La proximidad a las Montañas Cuchilla de Hielo asegura inviernos largos y fríos con fuertes nevadas. Los veranos son cortos y frescos.',
      },
    },
    {
      id: 'D5',
      region_info: {
        name: 'Las Tierras Fronterizas (Hjorn y Ludogov)',
        population: {
          total: 40489,
          breakdown:
            'Un verdadero crisol: 35% Tuomi, 25% Anari, 10% Saxa, 10% enanos, 10% nacidos de la escarcha, 5% elfos de la taiga, 3% elfos del hogar, 2% engro',
        },
        ruler: 'Ninguno (confederación laxa)',
        religion: 'Var, Eira, Ertha, Kenaz, Eostre, Ullr',
        imports: ['Sal', 'vidrio', 'gemas', 'oro', 'plata', 'vino'],
        exports: [
          'Queso',
          'cuerno',
          'artículos de cuero',
          'carne',
          'ropa',
          'agua curativa',
          'joyería',
          'madera',
        ],
        background:
          'El corazón de las Tierras Fronterizas, una frontera semicivilizada de tribus Tuomi rivales que se convirtió en un crisol de culturas después de la Guerra de la Ventisca. El comercio es intenso, especialmente en el este a lo largo del camino desde las Tierras de Lagos hasta Aspiria, pero esto también atrae a muchos bandidos. Los asentamientos son independientes y protegen ferozmente su autonomía.',
        government:
          'Las Tierras Fronterizas están compuestas por asentamientos independientes con poca o ninguna lealtad entre sí, excepto cuando orcos y goblins amenazan el reino. La naturaleza del gobierno en cada asentamiento varía inmensamente.',
        military:
          'Cada asentamiento mantiene su propio ejército, generalmente una pequeña fuerza permanente de no más de 100 hombres, apoyada por una milicia. La táctica común es usar tropas de misiles para detener a los atacantes antes de que lleguen a los muros del asentamiento.',
        geography:
          'La tierra consiste en colinas ligeramente boscosas, con dos pequeñas cadenas montañosas (Colinas de los Uros y Montañas Huecas) que forman los puntos más altos. Las Colinas de los Uros albergan grandes rebaños de la bestia homónima, mientras que las Montañas Huecas están plagadas de cuevas y túneles. Las Colinas Púrpuras son conocidas por el brezo utilizado para hacer un licor fuerte.',
        climate:
          'Bajas Tierras de Invierno. El clima es duro, con inviernos fríos y veranos cortos y frescos. Las colinas ofrecen cierta protección, pero los valles pueden volverse pantanosos. En invierno, los osos polares migran desde las Altas Tierras de Invierno, lo que hace que la región sea aún más peligrosa.',
      },
    },
    {
      id: 'D6',
      region_info: {
        name: 'Las Tierras Libres (La Ciudadela y Crase)',
        population: {
          total: '149,492 (total regional)',
          breakdown:
            '45% Anari, 28% Saxa, 12% enanos, 10% elfos del hogar, 3% engro, 2% nacidos de la escarcha',
        },
        ruler:
          'Su Arcana Serenidad Yaval Lanzador de Hechizos (La Ciudadela); Barón Triath ap-Clust (Crase)',
        religion: 'Maera, Ertha, Kenaz',
        imports: ['Libros', 'vidrio', 'oro', 'vino', 'pieles', 'sal'],
        exports: ['Ninguno (Ciudadela)', 'Armadura', 'hierro', 'armas'],
        background:
          'Esta área está dominada por los Picos Dentados y dos asentamientos clave. La Ciudadela es la sede secreta del Relicario, una organización dedicada a salvaguardar reliquias mágicas. Crase es una antigua ciudad minera anari, ahora conocida por su producción en masa de armas baratas pero útiles. Su barón es anciano, y su paranoico hijo se encarga de los asuntos diarios.',
        government:
          'La Ciudadela es una ciudad-estado fortaleza independiente gobernada por el jefe del Relicario. Crase es una baronía hereditaria.',
        military:
          'La Ciudadela está defendida por los Guardianes de lo Arcano, el brazo militante del Relicario. Crase mantiene su propia guardia de la ciudad y las tropas personales del barón.',
        geography:
          'La región está definida por los Picos Dentados, una serie de colinas empinadas y rotas que alguna vez fueron parte de la Barrera de Hielo. La Ciudadela es una fortaleza construida en las laderas de los picos, su verdadera extensión oculta bajo tierra. Crase se encuentra en las estribaciones, rodeada de antiguas minas derrumbadas.',
        climate:
          'Bajas Tierras de Invierno. La gran altitud de los Picos Dentados asegura un clima frío y duro con inviernos largos y fuertes nevadas. Los valles ofrecen cierta protección pero todavía están sujetos al frío severo de la región.',
      },
    },
    {
      id: 'D7',
      region_info: {
        name: 'Las Tierras Marchitas y el Pantano Aguasucias',
        population: {
          total: 'Desconocida',
          breakdown:
            'Muertos vivientes de todas las variedades, seguidores mortales de Hela (Tierras Marchitas); Trolls, hombres caimán, bufomi (Pantano Aguasucias).',
        },
        ruler:
          'El Triunvirato Negro (Tierras Marchitas); El Rey Troll (Pantano Aguasucias, nominal)',
        religion: 'Hela, Niht',
        imports: ['Cadáveres'],
        exports: ['Ninguno'],
        background:
          'Esta celda contiene dos de las regiones más desoladas de Rassilon. Las Tierras Marchitas son el antiguo dominio maldito de los lugartenientes más poderosos del Sacerdote Liche, una tierra de niebla perpetua y no muerte. Al sur se encuentra el Pantano Aguasucias, una vasta marisma salada que se rumorea que es el hogar del casi inmortal Rey Troll y su fortaleza.',
        government:
          'Las Tierras Marchitas están gobernadas por el Triunvirato Oscuro, un consejo de tres liches poderosos. El Pantano Aguasucias es un lodazal sin ley, aunque el Rey Troll es la entidad individual más poderosa dentro de él.',
        military:
          'El Triunvirato comanda un ejército poco organizado de esqueletos, zombis y otros muertos vivientes. Los habitantes del Pantano Aguasucias no son una fuerza unificada, pero los trolls son una amenaza significativa.',
        geography:
          'Las Tierras Marchitas (específicamente el Brezal Negro) es una tierra enfermiza de árboles raquíticos, ciénagas traicioneras y niebla constante. Las Torres Negras, hogares del Triunvirato, se elevan como dedos esqueléticos del paisaje. El Pantano Aguasucias es una marisma de agua salada de tierras bajas con vegetación enmarañada e islas que se dice que se mueven por sí solas.',
        climate:
          'Antinatural. Las Tierras Marchitas están perpetuamente envueltas en una niebla fría y húmeda, con iluminación tenue incluso en días brillantes. El Pantano Aguasucias es un humedal fresco y húmedo, propenso a congelarse en los meses más fríos del invierno.',
      },
    },
    {
      id: 'D8',
      region_info: {
        name: 'Coglelund (A Medio Camino)',
        population: {
          total: 39431,
          breakdown: '71% Anari, 25% Saxa, 4% engro',
        },
        ruler: 'Príncipe Mercader Leon Cogle IV',
        religion: 'Var (secretamente Vali)',
        imports: ['Tela', 'gemas', 'hierro', 'artículos de lujo', 'madera'],
        exports: ['Ropa', 'joyería', 'cerámica'],
        background:
          'Un pequeño reino independiente que alcanzó la prominencia después de la Guerra de la Ventisca. La familia de comerciantes Cogle construyó una serie de almacenes fortificados cerca de un pequeño pueblo, creando un centro de comercio seguro. Esta ciudad, A Medio Camino, prosperó. El gobernante actual, Leon Cogle IV, es un hombre de negocios astuto pero arrogante que intenta expandir sus rutas comerciales.',
        government:
          'Un principado mercader autocrático. Leon Cogle IV es un gobernante arrogante, egocéntrico y egoísta que cree que su vasta fortuna puede comprarle cualquier cosa.',
        military:
          'Coglelund tiene una fuerza de 500 caballería ligera y 2000 infantería pesada. Sin embargo, el príncipe derrochador ha dejado al ejército mal equipado y liderado por oficiales más conocidos por su sentido de la moda que por su habilidad táctica.',
        geography:
          'La mayoría de Coglelund comprende llanuras planas y cubiertas de hierba con solo colinas suaves. Angarion marca la frontera occidental y el río Corazóncorriente la oriental. La característica clave es el Puente del Hogar, el único punto de cruce seguro hacia Vestmark, que Cogle ha sellado recientemente a todos menos a los refugiados más ricos.',
        climate:
          'Tierras del Hogar. Las llanuras abiertas ofrecen poca protección contra los elementos, lo que lleva a inviernos fríos y ventosos y veranos suaves. Su ubicación lo protege de lo peor del frío del norte.',
      },
    },
    {
      id: 'D9',
      region_info: {
        name: 'La Magocracia (Principado de Darovia)',
        population: {
          total: 30545,
          breakdown: 'Principalmente Anari y Saxa.',
        },
        ruler: 'Mago-Príncipe Dartuk Darovia de la Cuarta Esfera',
        religion: 'Maera',
        imports: ['N/A'],
        exports: ['N/A'],
        background:
          'Darovia es un dominio pobre sumido en el miedo. Su gobernante, el Mago-Príncipe Dartuk, es un tirano paranoico, manipulado por su consejero cambiante para creer que su familia y vasallos conspiran contra él. Su policía secreta, la Guardia del Señor, arresta regularmente a ciudadanos por traición. Dartuk también ha adquirido ilegalmente un segundo bastón de heahwisard maestro, un crimen que lo vería destituido si se descubriera.',
        government:
          'Un principado feudal dentro de la Magocracia, gobernado por un Mago-Príncipe paranoico. En realidad, el reino está controlado por el miedo y las maquinaciones del consejero del Príncipe.',
        military:
          'El Mago-Príncipe mantiene su propio ejército, apoyado por las fuerzas de sus vasallos. También comanda la Guardia del Señor, una fuerza policial secreta utilizada para hacer cumplir su gobierno tiránico.',
        geography:
          'Un dominio con suelo delgado y escasos recursos naturales. Su principal característica es la ciudad portuaria de Dargon, que maneja el comercio de Chalcis y Angmark. El Castillo Dargon, un edificio monótono y enorme, se asienta en acantilados con vistas a la ciudad, proyectando una sombra de miedo sobre los ciudadanos.',
        climate:
          'Tierras del Hogar. Su ubicación costera le da un clima más moderado que los principados del interior, pero todavía está sujeto a la tendencia general de enfriamiento de Rassilon.',
      },
    },
    {
      id: 'D10',
      region_info: {
        name: 'La Magocracia (Bosque Viejo y Bosque de Ansel)',
        population: {
          total: '377,000 (total regional)',
          breakdown:
            '79% Anari, 12% Saxa, 4% elfos del hogar, 3% enanos, 1% nacidos de la escarcha, 1% engro',
        },
        ruler: 'Varía según la provincia (los elfos del Bosque Viejo son independientes)',
        religion: 'Maera',
        imports: ['Arte', 'vidrio', 'joyería', 'hoja de pipa', 'vino'],
        exports: ['Madera', 'Dispositivos alquímicos', 'oro'],
        background:
          'Esta región contiene dos bosques importantes. El Bosque Viejo es un reino independiente de elfos del hogar, un remanente de un bosque más grande que los elfos se negaron a ceder a la Magocracia. Evitan el contacto y tienen la autoridad para "tratar con los intrusos de la manera que consideren conveniente". Cerca, el Bosque de Ansel es la principal fuente de madera de la Magocracia, controlada por el Principado de Sethnor.',
        government:
          'El Bosque de Ansel es parte del Principado de Sethnor. El Bosque Viejo es una monarquía élfica independiente, ferozmente aislacionista y hostil al reino humano circundante.',
        military:
          'El Bosque Viejo está defendido por sus habitantes élficos, que son maestros de la guerra en el bosque. El Principado de Sethnor mantiene su propio ejército para proteger sus tierras, incluido el Bosque de Ansel.',
        geography:
          'Una región densamente boscosa. El Bosque Viejo es un antiguo bosque de elfos del hogar. El Bosque de Ansel es un antiguo bosque de elfos del hogar, ahora principalmente una fuente de madera para la flota naval de la Magocracia.',
        climate:
          'Tierras del Hogar. Los densos bosques crean un microclima fresco y húmedo. Los inviernos son fríos, con fuertes nevadas que persisten mucho tiempo bajo el dosel del bosque.',
      },
    },
    {
      id: 'E1',
      region_info: {
        name: 'Tierras sin Reclamar (Costa del Extremo Noreste)',
        population: {
          total: '100,000+ (total regional)',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Este es el rincón más nororiental del continente conocido al sur del Muro de Hielo. Es una tierra verdaderamente desolada y salvaje, habitada solo por clanes nómadas Finnar, resistentes tribus Tuomi y los monstruos que se aprovechan de ellos. Ningún gobernante poderoso ha reclamado jamás este territorio remoto.',
        government:
          'Anarquía completa. La supervivencia depende de la fuerza del clan o del pueblo de uno. No hay más leyes que las de los asentamientos individuales.',
        military:
          'Los Finnar y Tuomi que viven aquí son guerreros duros y autosuficientes, pero no son un ejército. Luchan por sobrevivir, no por conquistar.',
        geography:
          'Una vasta tundra costera. La tierra es un campo de nieve continuo, roto por ríos cubiertos de hielo y las orillas heladas del Mar de Narfel. Pequeños montículos marcan áreas de colinas sepultadas bajo el manto blanco. El terreno es traicionero y en gran parte sin rasgos distintivos.',
        climate:
          'Altas Tierras de Invierno. Esta región experimenta toda la furia del invierno del norte. La ubicación costera significa que está sujeta a brutales tormentas que soplan desde el Mar de Narfel, trayendo consigo lluvia helada y hielo marino.',
      },
    },
    {
      id: 'E2',
      region_info: {
        name: 'Tierras sin Reclamar (Frontera del Reino Hundido)',
        population: {
          total: '100,000+ (total regional)',
          breakdown:
            'Nómadas Finnar, pueblos Tuomi dispersos y diversas criaturas monstruosas.',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Las tierras que bordean el Reino Hundido son evitadas y temidas. Este territorio es una frontera accidentada donde el duro mundo natural se encuentra con una catástrofe sobrenatural. Las pocas personas que viven aquí son resistentes y supersticiosas, con un profundo respeto por los peligros que acechan al oeste.',
        government:
          'Los pueblos dispersos y los clanes nómadas son completamente independientes y autónomos.',
        military:
          'Las milicias locales y los guerreros de los clanes son la única defensa contra los horrores que emergen del Reino Hundido y la dureza de las Tierras de Invierno.',
        geography:
          'El borde este de esta celda es una continuación de las llanuras heladas de las Tierras sin Reclamar. El borde oeste está definido por las Colinas Bajas y los acantilados escarpados que caen en el Reino Hundido. El río Cascada cae sobre estos acantilados en una gran cascada.',
        climate:
          'Altas Tierras de Invierno. La región es perpetuamente fría, pero la proximidad al Reino Hundido parece crear patrones climáticos inusuales, con extrañas nieblas y vientos que a menudo se elevan desde el abismo.',
      },
    },
    {
      id: 'E3',
      region_info: {
        name: 'Drachenlands (Los Pasos del Gigante)',
        population: {
          total: '76,560 (total regional)',
          breakdown: 'Principalmente Tuomi, con orcos y goblins en las colinas.',
        },
        ruler: 'Voivoda Ramel el Berserker',
        religion: 'Dargar, Freo, Thrym, Thunor, Tiw',
        imports: ['Metal', 'vino'],
        exports: ['Pieles', 'carne', 'pellejos'],
        background:
          'Esta región montañosa está habitada por orcos y goblins. Las colinas reciben su nombre en la creencia de que los gigantes alguna vez las usaron como peldaños para cruzar lo que entonces eran ciénagas. El Voivoda de las Drachenlands elige nobles al azar para atacar los Pasos cada verano para mantener ocupado al ejército y evitar que los nobles fomenten la rebelión.',
        government:
          'La región está bajo el control nominal del Voivoda. En realidad, las tribus de orcos y goblins de las colinas se gobiernan a sí mismas.',
        military:
          'El ejército de Drachenland realiza incursiones anuales aquí. Las tribus de orcos y goblins son una amenaza militar constante de bajo nivel para las tierras bajas circundantes.',
        geography:
          'Una región montañosa de colinas. Los valles bajos alguna vez fueron ciénagas. Un pequeño número de pueblos fortificados de Drachenlander se encuentran en lo alto de las colinas.',
        climate:
          'Bajas Tierras de Invierno. La mayor altitud de las colinas hace que los inviernos sean más fríos y duros que en las llanuras circundantes. La región es conocida por sus fuertes vientos.',
      },
    },
    {
      id: 'E4',
      region_info: {
        name: 'Drachenlands (Angrad)',
        population: {
          total: 76560,
          breakdown:
            '75% Tuomi, 10% Saxa, 10% nacidos de la escarcha, 3% elfos de la taiga, 2% engro',
        },
        ruler: 'Voivoda Ramel el Berserker de la tribu Argentocoxus',
        religion: 'Dargar, Freo, Thrym, Thunor, Tiw',
        imports: ['Metal', 'vino'],
        exports: ['Pieles', 'carne', 'pellejos'],
        background:
          'Una vez parte de una región más grande dominada por los Tuomi, aunque nunca cohesiva. Los Drachenlanders son un pueblo beligerante y nómada famoso por su caballería. Su gobernante, el Voivoda Ramel, es un tirano duro que ha ejecutado a tres de sus cuatro hijos. El reino está actualmente en guerra con los elfos de Tethilin por los derechos de la madera.',
        government:
          'Una confederación laxa de tribus, nominalmente bajo el control de un voivoda ("señor de la guerra"). Las tribus individuales son gobernadas por mormaers. En realidad, el poder del Voivoda se extiende solo hasta donde su ejército puede llegar.',
        military:
          'Los Drachenlanders son famosos por su caballería y desprecian el uso de armas de misiles. Solo la caballería pesada de élite bajo el mando directo del Voivoda puede usar lanzas. La guardia personal de Ramel, la Caballería del Trueno, monta mamuts pigmeos en la batalla.',
        geography:
          'Gran parte de la región son colinas bajas y onduladas. La capital, Angrad, es una ciudad fortificada dominada por el feo palacio del Voivoda. Las fronteras norte, oeste y este están marcadas por ríos, y el Bosque de las Brujas domina el extremo sur.',
        climate:
          'Bajas Tierras de Invierno. Los inviernos son largos y fríos, lo que obliga a los Drachenlanders a buscar constantemente recursos de sus vecinos del sur, lo que a menudo conduce a la guerra.',
      },
    },
    {
      id: 'E5',
      region_info: {
        name: 'Las Tierras Libres (Nara y Santuario)',
        population: {
          total: '149,492 (total regional)',
          breakdown:
            '45% Anari, 28% Saxa, 12% enanos, 10% elfos del hogar, 3% engro, 2% nacidos de la escarcha',
        },
        ruler: 'Asentamientos independientes',
        religion: 'Hoenir, Eostre, Var (Nara); Eira (Santuario)',
        imports: ['Pieles', 'oro (en hoja)', 'vino', 'tela', 'sal'],
        exports: [
          'Libros',
          'artículos de cuero',
          'ganado',
          'carne',
          'lana',
          'hierbas curativas',
          'pociones',
        ],
        background:
          'Esta parte oriental de las Tierras Libres es un centro de civilización. Nara es una ciudad rica de pastores y eruditos, hogar del scriptorium central de los Guardianes del Saber. La cercana ciudad de Santuario es conocida como la "Ciudad de la Curación", dirigida por la aparentemente benévola Hermandad de la Misericordia.',
        government:
          'Nara es una plutocracia, gobernada por un consejo de los diez pastores más ricos. Santuario es una teocracia, gobernada por la Madre Felise de la Hermandad de la Misericordia.',
        military:
          'Nara es defendida por los guardias privados de sus ricos pastores y los paladines de Hoenir que protegen la Casa del Saber. Santuario es una ciudad pacifista, protegida por las Espadas de la Necesidad, guerreros que han dedicado sus vidas a la Hermandad después de ser curados de heridas graves.',
        geography:
          'La región consiste en colinas onduladas, perfectas para el pastoreo de ganado. Las ciudades se encuentran en la principal ruta comercial que va de Aslov a Puente del Vado.',
        climate:
          'Tierras del Hogar. El clima es fresco y templado, adecuado para la agricultura y la cría de ganado. Es una de las regiones más agradables y estables de las Tierras Libres.',
      },
    },
    {
      id: 'E6',
      region_info: {
        name: 'Marca Real (Hereford y Salnorr)',
        population: {
          total: 119547,
          breakdown:
            '84% Saxa, 10% Anari, 4% elfos del hogar, 1% engro, 1% nacidos de la escarcha',
        },
        ruler: 'Gran Cyning Eyolf Melnirsunu',
        religion: 'Sigel, Tiw, Hothar, Eostre, Scaetha',
        imports: ['Oro', 'hidromiel', 'hoja de pipa', 'plata'],
        exports: ['Obras de arte', 'cerveza', 'queso', 'joyería'],
        background:
          'Esta región de Marca Real es la primera línea en la guerra contra los muertos vivientes del Bosque Oscuro. Las ciudades de Hereford y Salnorr son campamentos militares, constantemente vigilantes contra los horrores que acechan en el bosque maldito. Salnorr sufrió recientemente un gran ataque de una horda de zombis que usaban extrañas catapultas de hueso.',
        government:
          'La región está gobernada por jarls que son vasallos del Gran Cyning. El Jarl Thorgeir de Hereford es un comandante militar competente. El Jarl Gunnbjorn de Salnorr está actualmente centrado en reconstruir sus defensas.',
        military:
          'La zona está fuertemente militarizada. Hereford mantiene una fuerza de 500 huscarls y 200 caballería mercenaria. Salnorr cuenta con 300 huscarls y 150 caballería mercenaria, aunque sus defensas están actualmente en ruinas.',
        geography:
          'La tierra es tierra de cultivo trabajada, pero se encuentra a la sombra del Bosque Oscuro. Las ciudades son asentamientos militares fortificados, diseñados para la defensa en lugar de la comodidad.',
        climate:
          'Tierras del Hogar. La proximidad al Bosque Oscuro le da a la región una palpable sensación de pavor. El clima es a menudo nublado y lúgubre, y una niebla fría con frecuencia se desplaza desde el bosque maldito.',
      },
    },
    {
      id: 'E7',
      region_info: {
        name: 'Marca Real (Ravensburgo)',
        population: {
          total: 119547,
          breakdown:
            '84% Saxa, 10% Anari, 4% elfos del hogar, 1% engro, 1% nacidos de la escarcha',
        },
        ruler: 'Gran Cyning Eyolf Melnirsunu',
        religion: 'Sigel, Tiw, Hothar, Eostre, Scaetha',
        imports: ['Oro', 'hidromiel', 'hoja de pipa', 'plata'],
        exports: ['Obras de arte', 'cerveza', 'queso', 'joyería'],
        background:
          'La capital de Marca Real y principal ciudad de los Saxa. A pesar de su supuesto poder, la ciudad se ha estancado. Siglos de tradición forzada y aislamiento han dejado a la gente del pueblo ambivalente a los cambios en el resto del mundo. Es una ciudad con siglos de antigüedad, donde las nuevas modas se encuentran con miradas perplejas y las nuevas canciones no encuentran audiencia.',
        government:
          'El Gran Cyning gobierna desde su granja, Hartstead. Su influencia, sin embargo, está en serio declive. Tiene pocas tropas de repuesto para enviar a otros reinos y se enfrenta a la oposición tanto dentro como fuera de Marca Real.',
        military:
          'Marca Real es una nación tradicionalista. Los nobles de cualquier rango pueden mantener su propio ejército de huscarls sin restricción de número. El Gran Cyning tiene el ejército individual más grande, pero las fuerzas combinadas de sus jarls serían mayores.',
        geography:
          'La ciudad se encuentra en la base de la Cordillera del Hogar. No tiene empalizada ni foso, pero está protegida por seis fuertes de mota y bailey. La granja del Gran Cyning, Hartstead, es un enorme palacio de madera con tejas de escudos dorados.',
        climate:
          'Tierras del Hogar. La ciudad disfruta de una posición relativamente protegida en la base de las montañas, lo que le da un clima estable y predecible en comparación con las regiones más expuestas.',
      },
    },
    {
      id: 'E8',
      region_info: {
        name: 'Vestmark (Castillo Hrafn)',
        population: {
          total: 51676,
          breakdown: '75% Saxa, 15% Anari, 8% elfos del hogar, 2% engro',
        },
        ruler: 'Cyning Horgar el Débil',
        religion: 'Tiw, Sigel, Thunor, Hothar',
        imports: ['Armadura', 'hierro', 'mercenarios', 'armas'],
        exports: ['Plata'],
        background:
          'El centro muerto de Vestmark, ahora una tierra en grave peligro. Esta región es el hogar del Castillo Hrafn, el cuartel general de los Caballeros Hrafn, una orden de mercenarios dedicada a la excelencia en el liderazgo. Los caballeros cobran a Vestmark por sus servicios, aunque a una tarifa reducida, y su presencia es todo lo que mantiene unido al reino.',
        government:
          'La región está nominalmente gobernada por el Cyning Horgar, pero ha perdido la cabeza por el dolor y la obsesión. El verdadero poder militar y político reside en el Barón Adelmar, el Señor Mariscal de los Caballeros Hrafn, y el Mariscal Theodred, que comanda las fuerzas nativas saxa.',
        military:
          'El Castillo Hrafn es el cuartel general de los líderes militares más eficaces de la región. El propio castillo contiene salas de juegos de guerra, una extensa biblioteca de mapas y una biblioteca de tratados sobre la guerra. Mucha gente sospecha que los Caballeros tienen un stock de reliquias.',
        geography:
          'La tierra es montañosa, dominada por las Colinas Seolfor, que alguna vez fueron el alma del comercio de Vestmark debido a sus ricos depósitos de plata. El Bosque de Yet, un pequeño bosque de elfos del hogar, se encuentra al sur.',
        climate:
          'Tierras del Hogar. El clima es sombrío y nublado, reflejando el estado de ánimo del reino. Una constante sensación de opresión flota en el aire, un efecto psicológico de la guerra interminable hacia el sur.',
      },
    },
    {
      id: 'E9',
      region_info: {
        name: 'La Magocracia (Principado de Bremen)',
        population: {
          total: 37567,
          breakdown:
            '79% Anari, 12% Saxa, 4% elfos del hogar, 3% enanos, 1% nacidos de la escarcha, 1% engro',
        },
        ruler: 'Mago-Príncipe Andmar Bremen de la Tercera Esfera',
        religion: 'Maera',
        imports: ['Vino aspiriano', 'hoja de pipa del Valle', 'ropa exquisita'],
        exports: ['Dispositivos alquímicos', 'oro'],
        background:
          'Bremen es un principado gobernado por un déspota depravado. El Mago-Príncipe Andmar Bremen es completamente endogámico, tiene una afición por vestirse de mujer y celebra fiestas depravadas donde los invitados torturan a la gente con el acompañamiento de un cuarteto de cuerda. Cada año, él y sus lacayos recorren la tierra, cazando campesinos por deporte.',
        government:
          'Un principado feudal gobernado por un tirano. Andmar Bremen ha sido llamado ante el Consejo Electo varias veces para explicar sus acciones, pero el consejo solo tiene poderes limitados sobre cómo un noble dirige su reino.',
        military:
          'El Príncipe mantiene su propio ejército, aunque su calidad es cuestionable. Usa a sus soldados más para sus "cazas" personales que para cualquier propósito estratégico.',
        geography:
          'La ciudad principal de Bremen, Serlana, se encuentra casi en la frontera con el bosque élfico de Angarion. El Príncipe a menudo contempla las frondosas ramas desde su torre, soñando con las delicias que podría infligir a los elfos.',
        climate:
          'Tierras del Hogar. El clima es templado, pero una palpable sensación de miedo y desesperación se cierne sobre la tierra debido a la naturaleza cruel de su gobernante.',
      },
    },
    {
      id: 'E10',
      region_info: {
        name: 'La Magocracia (Principado de Hergenald)',
        population: {
          total: 30854,
          breakdown:
            '79% Anari, 12% Saxa, 4% elfos del hogar, 3% enanos, 1% nacidos de la escarcha, 1% engro',
        },
        ruler: 'Maga-Princesa Olvia Hergenald de la Cuarta Esfera',
        religion: 'Maera, Var',
        imports: ['Vidrio', 'vino'],
        exports: ['Dispositivos alquímicos', 'oro'],
        background:
          'Quizás la provincia más rica de la Magocracia, Hergenald controla todas las importaciones de vidrio y vino de Aspiria. Sus llanuras también son tierras agrícolas de primera. Su gobernante, la Maga-Princesa Olvia, llegó al poder cuando sus padres murieron por envenenamiento con hongos. Es una política astuta que prefiere arreglar los asuntos para que otros tomen las decisiones que la benefician.',
        government:
          'Un principado feudal gobernado por una astuta Maga-Princesa. Olvia es una maestra de la manipulación política, usando su riqueza e influencia para lograr sus objetivos sin ensuciarse las manos.',
        military:
          'Hergenald mantiene un poderoso ejército acorde con su estatus de riqueza. Las fuerzas están bien equipadas y son profesionales.',
        geography:
          'El principado se define por su concurrida ciudad portuaria, Puerto Helgen, que comercia principalmente con mercaderes de Aspiria. La tierra es en su mayoría llanuras fértiles.',
        climate:
          'Tierras del Hogar. Su ubicación costera del sur le da un clima suave y agradable, ideal para la agricultura. Es una de las regiones más prósperas y estables de la Magocracia.',
      },
    },
    {
      id: 'F1',
      region_info: {
        name: 'La Barrera de Hielo (Noreste)',
        population: {
          total: '8,000+',
          breakdown: '95% enanos, más varios monstruos.',
        },
        ruler: 'Ninguno (fortalezas enanas independientes)',
        religion: 'Ertha, Tiw, Niht',
        imports: ['Alimentos', 'Madera de hielo'],
        exports: ['Armadura', 'armas', 'artículos de metal'],
        background:
          'La cadena montañosa más grande conocida, formando un muro natural que ha frenado el avance del Hellfrost. Esta sección remota es el hogar de ciudades aisladas de enanos de escarcha, como Karad Zor. Los tramperos y cazadores también frecuentan las laderas más bajas.',
        government:
          'Cada ciudad enana es un dominio feudal hereditario e independiente. No hay un gobierno central para la cordillera.',
        military:
          'Cada clan enano mantiene una fuerza de infantería pesada. En tiempos de crisis, la milicia de la ciudad, compuesta principalmente por mineros, es llamada a las armas.',
        geography:
          'Una enorme cordillera, con una altura promedio de cuatro millas. La nieve permanente se encuentra a tan solo 3,000 pies, incluso en verano. Se rumorea que el mítico Locus Elemental está escondido en algún lugar dentro de estos picos.',
        climate:
          'Altas Tierras de Invierno. El clima es alpino y extremadamente duro. Los altos picos están sujetos a vientos con fuerza de huracán y temperaturas increíblemente frías. Solo los enanos pueden habitar cómodamente esta región durante todo el año.',
      },
    },
    {
      id: 'F2',
      region_info: {
        name: 'Feudos de Valle de Hielo (El Carámbano)',
        population: {
          total: 31697,
          breakdown:
            '50% Finnar, 20% Saxa, 10% Anari, 13% nacidos de la escarcha, 7% elfos de la taiga',
        },
        ruler: 'Consejo',
        religion: 'Ertha, Sigel, Scaetha, Kenaz',
        imports: ['Cerveza', 'grano', 'hierro', 'joyería', 'lana'],
        exports: ['Hueso', 'pieles', 'madera de hielo'],
        background:
          'Un entorno hostil donde los individuos no duran mucho. Esto ha fomentado una cultura comunal donde la propiedad personal es una preocupación menor. La característica principal de esta celda es el misterioso castillo invertido conocido como El Carámbano, un refugio para los hrimwisards.',
        government:
          'Técnicamente gobernado por un consejo de Valle de Hielo y Puerto de Hielo, pero en la práctica los elfos de la taiga y los Finnar tienen la misma voz. La Hermandad del Fuego Blanco en El Carámbano se gobierna a sí misma.',
        military:
          'Los Feudos mantienen un ejército de 4,000 hombres, con un cuerpo de élite de soldados de esquí conocidos como los Guardabosques Blancos. Trabajan en estrecha colaboración con los Caballeros del Hogar visitantes.',
        geography:
          'Esta región está dominada por las montañas del norte de la Barrera de Hielo. El Carámbano, un pequeño castillo de piedra, cuelga boca abajo de un saliente helado del propio Muro de Hielo.',
        climate:
          'Altas Tierras de Invierno. La gran altitud y la proximidad al Muro de Hielo hacen de esta una de las celdas más frías e implacables al sur del Hellfrost.',
      },
    },
    {
      id: 'F3',
      region_info: {
        name: 'Feudos de Valle de Hielo (Valle de Hielo)',
        population: {
          total: 31697,
          breakdown:
            '50% Finnar, 20% Saxa, 10% Anari, 13% nacidos de la escarcha, 7% elfos de la taiga',
        },
        ruler: 'Consejo',
        religion: 'Ertha, Sigel, Scaetha, Kenaz',
        imports: ['Cerveza', 'grano', 'hierro', 'joyería', 'lana'],
        exports: ['Hueso', 'pieles', 'madera de hielo'],
        background:
          'Este reino no existiría si no fuera por el valor de la madera de hielo del cercano Bosque Congelado. Es una frontera dura, colonizada por Anari y Saxa que vinieron por la "fiebre del hielo". Los Finnar y los elfos de la taiga nativos los toleran pero no desean gobernar. La cultura es comunal y resistente.',
        government:
          'Un consejo de hombres y mujeres de las principales ciudades de Valle de Hielo y Puerto de Hielo gobierna, pero en la práctica, los elfos y los Finnar tienen la misma voz. Varios nobles Finnar notables participan regularmente.',
        military:
          'Los Feudos mantienen un ejército sorprendentemente grande de 4,000 hombres. Los soldados de élite son los Guardabosques Blancos, competentes con armas de misiles, esquís y aparejos de hielo. Llevan la guerra a sus enemigos en lugar de esperar un ataque.',
        geography:
          'La región se encuentra a lo largo del valle del río Valle de Hielo. Es una mezcla de llanuras de nieve y bosque de taiga irregular, bordeado por las Colinas de los Trolls y las embrujadas Colinas del Túmulo Blanco, que están llenas de muertos vivientes y considerables rebaños de renos.',
        climate:
          'Altas Tierras de Invierno. Durante un mes al año, la temperatura sube lo suficiente como para que la superficie del río Valle de Hielo se derrita, y solo en sus tramos inferiores. Los inviernos son largos, oscuros y brutalmente fríos.',
      },
    },
    {
      id: 'F4',
      region_info: {
        name: 'Baronía de Trond (Frontera del Arroyo del Jabalí)',
        population: {
          total: 18395,
          breakdown: '45% Anari, 40% Saxa, 15% nacidos de la escarcha',
        },
        ruler: 'Barón Rodger ap-Gwar (figura decorativa) y consejo electo',
        religion: 'Var, Neorthe, Eostre',
        imports: ['Obras de arte', 'grano', 'joyería', 'madera', 'comercio'],
        exports: ['Comercio (de paso)', 'Lana'],
        background:
          'Un enclave comercial Anari distante que sobrevivió a la Guerra de la Ventisca pero perdió su propósito cuando el comercio con el este murió. Los esclavos Saxa se levantaron en rebelión, y los Anari, en lugar de enfrentarse a la destrucción, les concedieron libertad y estatus. El reino es ahora un jugador menor, centrado en su comercio de madera de hielo.',
        government:
          'El barón es una figura decorativa con solo poder ceremonial. La autoridad real recae en un consejo electo, que ha estado dominado por los mismos ricos pastores y clérigos de Eostre durante décadas.',
        military:
          'El ejército permanente está compuesto por 500 infantes medianos y 200 caballería mediana, pero está mal controlado por el consejo, que nombra comandantes poco aptos pero dóciles.',
        geography:
          'Un lugar muy poco interesante. Dos ríos atraviesan praderas de tierras bajas, adecuadas principalmente para ovejas y algunos cultivos de raíces resistentes. El río Arroyo del Jabalí marca la frontera con las Tierras de los Túmulos.',
        climate:
          'Tierras del Hogar. La falta de barreras geográficas lo deja expuesto a los vientos, lo que provoca inviernos fríos y veranos frescos y ventosos.',
      },
    },
    {
      id: 'F5',
      region_info: {
        name: 'Baronía de Trond (Trondavoe)',
        population: {
          total: 18395,
          breakdown: '45% Anari, 40% Saxa, 15% nacidos de la escarcha',
        },
        ruler: 'Barón Rodger ap-Gwar (figura decorativa) y consejo electo',
        religion: 'Var, Neorthe, Eostre',
        imports: ['Obras de arte', 'grano', 'joyería', 'madera', 'comercio'],
        exports: ['Comercio (de paso)', 'Lana'],
        background:
          'La capital de la región, Trondavoe, fue una vez una metrópolis en expansión de más de 20,000 almas. Desde entonces se ha reducido a un tercio de su tamaño, con la ciudad exterior dejada en ruinas. Ahora es el principal puerto de las Bajas Tierras de Invierno, prosperando con el comercio de madera de hielo.',
        government:
          'El consejo tiene el verdadero poder aquí. Son notoriamente estáticos, con los mismos miembros siendo reelegidos durante décadas. El barón es una mera figura decorativa.',
        military:
          'Dos de las cinco compañías del ejército de la Baronía están guarnecidas en Trondavoe, con una sirviendo como fuerza marina para su único barco de guerra.',
        geography:
          'Trondavoe ocupa las zonas costeras de lo que una vez fue una ciudad mucho más grande. Más allá de un nuevo muro construido con escombros, la ciudad vieja yace en ruinas. El antiguo sistema de alcantarillado está intacto, un señuelo para los aventureros.',
        climate:
          'Tierras del Hogar. La ubicación costera le otorga un clima marítimo, con veranos más frescos e inviernos más suaves (aunque todavía fríos) que las regiones del interior.',
      },
    },
    {
      id: 'F6',
      region_info: {
        name: 'Heldalund (Held, Ocupado)',
        population: {
          total: 24063,
          breakdown:
            '82% Saxa, 11% Anari, 6% nacidos de la escarcha, 1% engro. (La población de Held es de 3,795, ahora con una importante minoría orca).',
        },
        ruler: 'Thegn Franmar Barrisunu (Gobernante de Heldalund); Señor de la Guerra Ragkar (Gobernante de Held)',
        religion: 'Neorthe, Ertha, Sigel, Kenaz',
        imports: ['Aceite', 'cerámica', 'vino'],
        exports: ['Cobre', 'pescado', 'gemas'],
        background:
          'Esta región es el corazón de una crisis. Su capital, Held, fue una vez una ciudad prominente pero perdió importancia cuando los dragones del Hellfrost comenzaron a anidar en las montañas cercanas. Hace cinco años, fue capturada por un ejército de orcos bajo el mando del Señor de la Guerra Ragkar, que utiliza la ilusión de un dragón para mantener esclavizada a la población humana y extrayendo gemas para él.',
        government:
          'La región de Held está bajo el gobierno tiránico de un señor de la guerra orco. El resto de Heldalund está gobernado por un thegn que está acosado por enemigos por todos lados.',
        military:
          'El ejército de Heldalund está en un estado de decadencia, con baja moral y deserciones. Las fuerzas orcas en Held son pequeñas pero efectivas, dependiendo del miedo y un engaño inteligente para mantener el control.',
        geography:
          'La característica clave es el Pantano de Lodo, una tierra baja de ciénagas salobres donde el agua nunca se congela por completo. Las leyendas locales dicen que el cadáver de un dragón del Hellfrost yace pudriéndose en el pantano, dándole un frío sobrenatural. La supuesta guarida del dragón es una colina ahuecada en el pantano.',
        climate:
          'Bajas Tierras de Invierno. El clima es frío y miserable. La presencia del Pantano de Lodo crea una atmósfera húmeda y escalofriante que impregna la región.',
      },
    },
    {
      id: 'F7',
      region_info: {
        name: 'Heldalund (Norvik)',
        population: {
          total: 24063,
          breakdown: '82% Saxa, 11% Anari, 6% nacidos de la escarcha, 1% engro',
        },
        ruler: 'Thegn Franmar Barrisunu',
        religion: 'Neorthe, Ertha, Sigel, Kenaz',
        imports: ['Aceite', 'cerámica', 'vino'],
        exports: ['Cobre', 'pescado', 'gemas'],
        background:
          'Un antiguo reino Vindari ahora gobernado por los Saxa. Sus fronteras se han reducido con el tiempo, perdiendo tierras ante Cul y Trond. El reino ahora está acosado por enemigos en tres frentes: los orcos en Held, el agresivo Barón Tejedor de Escarcha de Cul y los muertos vivientes de las Tierras de los Liches. El gobernante, Thegn Franmar, está tratando de mantener unido su reino en ruinas.',
        government:
          'Heldalund nunca ha tenido un rey. El Thegn es el jefe de estado nominal pero debe lidiar con numerosas familias nobles y mercantes. Con enemigos por todos lados, sus rivales se contentan con dejarle tomar las decisiones difíciles antes de hacer su movimiento.',
        military:
          'El ejército es pequeño (750 infantes medianos, 125 caballería ligera) y está mal equipado, con equipo de décadas de antigüedad. La moral está en su punto más bajo y las deserciones son comunes. El poderío naval del reino consiste en dos snekkes atracados en Norvik.',
        geography:
          'La tierra comienza en un terreno elevado en el sur y desciende gradualmente hacia el norte. Las llanuras centrales están interrumpidas por pequeños bosques y ciénagas. Al norte se encuentra el Pantano de Lodo. El río Draco Blanco, que se congela en invierno, forma la frontera occidental.',
        climate:
          'Bajas Tierras de Invierno. La región está expuesta al norte y tiene inviernos duros y largos. Las Montañas del Draco Blanco al oeste ofrecen algo de refugio pero también albergan muchos peligros.',
      },
    },
    {
      id: 'F8',
      region_info: {
        name: 'Baronía de Cul',
        population: {
          total: 14048,
          breakdown: '65% nacidos de la escarcha, 25% Anari, 18% Saxa, 2% engro',
        },
        ruler: 'Barón Tejedor de Escarcha I',
        religion: 'Hrimheorte (Thrym), Ullr',
        imports: ['Aceite', 'sal', 'vino'],
        exports: ['Carne (jabalí)'],
        background:
          'Hasta hace siete años, Cul era un reino de pueblos independientes. Entonces llegó un carismático nacido de la escarcha llamado Tejedor de Escarcha, conquistó la tierra y estableció un reinado de terror. Está brutalizando a la población Anari y Saxa y obligando a sus hijos a tomar cónyuges nacidos de la escarcha para aumentar la población de nacidos de la escarcha. Está siendo manipulado por el dios Thrym disfrazado.',
        government:
          'Una autocracia absoluta. Tejedor de Escarcha gobierna con mano de hierro, dejando que sus lugartenientes (como el brutal Omar Manohielo, "el Verdugo") se encarguen del funcionamiento diario del estado mientras él comulga con su "dios" y planea la expansión de su reino.',
        military:
          'Cul tiene un ejército de 3.000 hombres. 1.000 son solo matones pagados para mantener a los ciudadanos a raya. El resto son infantería mediana, todos nacidos de la escarcha. Tejedor de Escarcha también tiene un guardaespaldas de 20 hrimwisards de élite nacidos de la escarcha.',
        geography:
          'El reino está dominado por las Colinas del Lomo de Jabalí y las estribaciones de las Montañas del Draco Blanco. Las colinas están cubiertas de bosques ligeros y albergan muchas manadas de jabalíes, que Tejedor de Escarcha ha declarado su reserva de caza privada.',
        climate:
          'Bajas Tierras de Invierno. El clima es frío y duro. Las Montañas del Draco Blanco al este contribuyen a un invierno largo y severo.',
      },
    },
    {
      id: 'F9',
      region_info: {
        name: 'Marca del Norte (Yorvik)',
        population: {
          total: 73274,
          breakdown: '75% Saxa, 10% Anari, 9% enanos, 4% engro, 2% elfos del hogar',
        },
        ruler: 'Cyning Geirmund Kolsunu',
        religion: 'Tiw, Thunor, Sigel, Hothar',
        imports: ['Caballos', 'hidromiel', 'madera'],
        exports: ['Hierro', 'artículos de cuero', 'vino'],
        background:
          'El corazón de Marca del Norte. Su joven rey, Geirmund, es un gobernante carismático y capaz que ganó su trono en una brutal guerra civil hace solo dos años. Ahora está centrado en reconstruir su reino destrozado, expandir el comercio y mantener a raya a sus rebeldes primos.',
        government:
          'Una monarquía hereditaria. El Cyning Geirmund es un gobernante práctico que recibe consejos de su consejo pero deja claro que su palabra es la última. Ha roto con la tradición al ordenar a sus jarls que disuelvan sus ejércitos, una medida que ha sido recibida con resistencia secreta.',
        military:
          'Geirmund ha consolidado el ejército del reino bajo su propio mando. Tiene una fuerza de buen tamaño de escaramuzadores de caballería ligera y una tropa de choque de caballería pesada, empleando tácticas que sus parientes nunca habían visto antes de la guerra civil.',
        geography:
          'La tierra es montañosa, bordeada por la Barrera de Hielo al norte. La capital, Yorvik, es una ciudad de mercado en el Pequeño Flujo de Cristal. El Palacio del Rey es una gran casa comunal con tejas de hierro pulido. El fuerte de la colina cercano, El Refugio, sirve como campamento para los refugiados de las Tierras de Invierno.',
        climate:
          'Tierras del Hogar. La Barrera de Hielo al norte asegura inviernos fríos y nevados. Los veranos son frescos y cortos. Las llanuras centrales son fértiles.',
      },
    },
    {
      id: 'F10',
      region_info: {
        name: 'Confederación del Flujo de Cristal (Puente del Vado)',
        population: {
          total: 107330,
          breakdown: '62% Anari, 35% Saxa, 5% engro, 3% nacidos de la escarcha',
        },
        ruler: 'Ninguno (Barón Gallandros ap-Morgwen en Puente del Vado)',
        religion: 'Var, Neorthe, Freo',
        imports: ['Tela', 'pieles', 'vidrio', 'madera', 'comercio'],
        exports: [
          'Pescado',
          'grano',
          'comercio',
          'vegetales',
          'vino',
          'lana',
        ],
        background:
          'Una asociación laxa de pueblos y aldeas que se extienden a lo largo de las orillas del río Flujo de Cristal, desde Puerto del Draco hasta Puente del Vado. La confederación se formó para proteger el vital comercio fluvial. A cambio de la tierra, los cargamentos de las vecinas Tierras de Marca pagan impuestos reducidos.',
        government:
          'La Confederación no tiene un gobierno central. Cada asentamiento gobierna sus propios asuntos, siempre que no se obstaculice el comercio. Puente del Vado está gobernado por un barón hereditario.',
        military:
          'Cada asentamiento mantiene su propio ejército. Un ataque contra un miembro se considera un ataque contra todos. Se han contratado tres Caballeros Hrafn con carácter permanente para que actúen como generales y entrenen a las fuerzas locales.',
        geography:
          'El reino reclama la parte baja del río Flujo de Cristal y unas 50 millas de tierra a cada lado. La ciudad de Puente del Vado se encuentra en un recodo del río, bordeada por el Pantano de los Mosquitos y las Colinas de la Torre.',
        climate:
          'Tierras del Hogar. El valle del río tiene un clima templado con veranos frescos e inviernos fríos. El río es de corriente rápida y solo se congela en los inviernos más duros.',
      },
    },
    {
      id: 'G1',
      region_info: {
        name: 'Tierras sin Reclamar (Costa del Extremo Noreste)',
        population: {
          total: '100,000+ (total regional)',
          breakdown:
            '55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Este es el rincón más nororiental del continente conocido al sur del Muro de Hielo. Es una tierra verdaderamente desolada y salvaje, habitada solo por clanes nómadas Finnar, resistentes tribus Tuomi y los monstruos que se aprovechan de ellos. Ningún gobernante poderoso ha reclamado jamás este territorio remoto.',
        government:
          'Anarquía completa. La supervivencia depende de la fuerza del clan o del pueblo de uno. No hay más leyes que las de los asentamientos individuales.',
        military:
          'Los Finnar y Tuomi que viven aquí son guerreros duros y autosuficientes, pero no son un ejército. Luchan por sobrevivir, no por conquistar.',
        geography:
          'Una vasta tundra costera. La tierra es un campo de nieve continuo, roto por ríos cubiertos de hielo y las orillas heladas del Mar de Narfel. Pequeños montículos marcan áreas de colinas sepultadas bajo el manto blanco. El terreno es traicionero y en gran parte sin rasgos distintivos.',
        climate:
          'Altas Tierras de Invierno. Esta región experimenta toda la furia del invierno del norte. La ubicación costera significa que está sujeta a brutales tormentas que soplan desde el Mar de Narfel, trayendo consigo lluvia helada y hielo marino.',
      },
    },
    {
      id: 'G2',
      region_info: {
        name: 'Tierras sin Reclamar (Frontera del Reino Hundido)',
        population: {
          total: '100,000+ (total regional)',
          breakdown:
            'Nómadas Finnar, pueblos Tuomi dispersos y diversas criaturas monstruosas.',
        },
        ruler: 'Ninguno',
        religion: 'Ullr, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'Las tierras que bordean el Reino Hundido son evitadas y temidas. Este territorio es una frontera accidentada donde el duro mundo natural se encuentra con una catástrofe sobrenatural. Las pocas personas que viven aquí son resistentes y supersticiosas, con un profundo respeto por los peligros que acechan al oeste.',
        government:
          'Los pueblos dispersos y los clanes nómadas son completamente independientes y autónomos.',
        military:
          'Las milicias locales y los guerreros de los clanes son la única defensa contra los horrores que emergen del Reino Hundido y la dureza de las Tierras de Invierno.',
        geography:
          'El borde este de esta celda es una continuación de las llanuras heladas de las Tierras sin Reclamar. El borde oeste está definido por las Colinas Bajas y los acantilados escarpados que caen en el Reino Hundido. El río Cascada cae sobre estos acantilados en una gran cascada.',
        climate:
          'Altas Tierras de Invierno. La región es perpetuamente fría, pero la proximidad al Reino Hundido parece crear patrones climáticos inusuales, con extrañas nieblas y vientos que a menudo se elevan desde el abismo.',
      },
    },
    {
      id: 'G3',
      region_info: {
        name: 'Reino Hundido',
        population: {
          total: 'Desconocida',
          breakdown: 'Orcos, gigantes, saqueadores de escarcha y Vendahl.',
        },
        ruler: 'Ninguno',
        religion: 'Dargar, Thrym',
        imports: ['Ninguno'],
        exports: ['Ninguno'],
        background:
          'El Reino Hundido fue creado hace miles de años en un desastre que hundió una enorme área del continente de la noche a la mañana. Registros fragmentarios insinúan que esta fue una vez un reino muy poblado. Desde entonces, ha sido evitado como una tierra embrujada y maldita por los dioses, un lugar de ruinas y monstruos.',
        government:
          'Ninguno. Es un abismo sin ley gobernado por las facciones monstruosas más fuertes.',
        military:
          'Las diversas tribus de orcos, gigantes y saqueadores de escarcha están en un estado constante de conflicto entre sí. Presentan una amenaza unida solo para los forasteros que se atreven a aventurarse en su dominio.',
        geography:
          'Un lodazal de acantilados rotos y tierra destrozada. Toda la región es una depresión llena de rocas irregulares, grietas y acantilados escarpados, algunos de los cuales caen media milla. La región incluye el pantano helado de Deepmarsh y la misteriosa Ciudad Derrumbada, una ruina que parece haberse derrumbado en una profunda grieta.',
        climate:
          'Altas Tierras de Invierno. Los profundos y sombríos abismos del Reino Hundido rara vez ven la luz solar directa, lo que hace que la región sea perpetuamente fría y oscura. El clima frío es constante y el suelo es inútil para la agricultura o el pastoreo.',
      },
    },
    {
      id: 'G4',
      region_info: {
        name: 'Tierras de los Liches de Antaño (El Brezal Negro)',
        population: {
          total: 'Desconocida',
          breakdown:
            'Un gran número de muertos vivientes y seguidores mortales de Hela.',
        },
        ruler: 'El Triunvirato Negro (Angharad, Angtharinax y Taxmagulus)',
        religion: 'Hela, Niht',
        imports: ['Cadáveres'],
        exports: ['Ninguno'],
        background:
          'Este es el núcleo del antiguo imperio del Sacerdote Liche. Después de su derrota, sus tres lugartenientes más poderosos entraron en hibernación aquí. Despertaron después de la Guerra de la Ventisca y usaron magia vil para corromper la tierra en un pozo negro de oscuridad. Los paladines de Scaetha ahora contienen a los muertos vivientes, pero carecen del número para destruirlos.',
        government:
          'El Triunvirato Oscuro, un consejo de tres liches poderosos, gobierna el reino. Están totalmente comprometidos con la causa de Hela y su oscuro espíritu de cooperación los convierte en un enemigo verdaderamente mortal.',
        military:
          'El Triunvirato comanda un ejército poco organizado de esqueletos y zombis, liderado por caballeros negros y moradores de túmulos. También tienen acceso a casi todos los tipos de muertos vivientes conocidos en Rassilon. Los aliados vivos se limitan al clero de Hela.',
        geography:
          'La región se define por dos características clave: el Brezal Negro y el Bosque Oscuro. El Brezal Negro es una tierra enfermiza de árboles raquíticos, ciénagas traicioneras y niebla constante. Las Torres Negras, hogares del Triunvirato, se elevan como dedos esqueléticos del paisaje. Todo el reino está perpetuamente envuelto en niebla.',
        climate:
          'Antinatural. La iluminación es tenue incluso en días brillantes y completamente oscura por la noche. Independientemente del clima, las Tierras Marchitas están perpetuamente envueltas en niebla y son escalofriantemente frías, un frío mágico que se cuela en los huesos.',
      },
    },
    {
      id: 'G5',
      region_info: {
        name: 'Seithrby y Tierras de los Liches (Frontera Sur)',
        population: {
          total: 19086,
          breakdown: '68% Saxa, 30% Anari, 2% engro',
        },
        ruler: 'Aethling Cuthwulf Eodricsunu',
        religion: 'Eostre, Tiw, Neorthe, Scaetha',
        imports: ['Arcilla', 'hierro'],
        exports: ['Pescado', 'cerámica', 'madera'],
        background:
          'Hace veinte años, Seithrby era una frontera escasamente poblada. Un clan de Saxa, expulsado de sus tierras por orcos y gigantes, se mudó y la conquistó, esclavizando a los Anari locales. El gobernante, Aethling Cuthwulf, rechaza el título de "cyning" para evitar enredarse en la política de las Tierras de Marca.',
        government:
          'Un Aethling gobierna, aunque rechaza el título de rey. Cuthwulf es un gobernante justo pero indulgente, con un amor por la caza, la cetrería y las artes de los escaldos. Tiene la última palabra en todos los asuntos, pero invita regularmente a sus thegns al consejo para mantener una ilusión de poder compartido.',
        military:
          'Cuthwulf permite que cada thegn mantenga su propia fuerza de huscarls, mientras se asegura de que la suya sea la más grande. También mantiene una pequeña banda de caballería pesada Anari como símbolo de estatus, que patrulla la peligrosa frontera con las Tierras de los Liches.',
        geography:
          'El terreno desciende desde Heligioland hacia pastos ricos perfectos para el pastoreo. Las características clave son las Colinas de Fernbury, hogar de un antiguo y embrujado fuerte en una colina, y el Bosque de las Hadas, donde la tala masiva ha enfurecido a los habitantes feéricos. La frontera con las Tierras de los Liches es un lugar de pavor constante.',
        climate:
          'Bajas Tierras de Invierno. Los inviernos son largos y fríos, pero la tierra es lo suficientemente fértil para el pastoreo. La proximidad a las Tierras de los Liches parece tener una influencia corruptora en el clima, con frecuentes nieblas frías y una atmósfera opresiva.',
      },
    },
    {
      id: 'G6',
      region_info: {
        name: 'Tierras de los Túmulos (Hergist)',
        population: {
          total: 25346,
          breakdown: '70% Saxa, 15% elfos del hogar, 10% Anari, 5% engro',
        },
        ruler: 'Moot (asamblea)',
        religion: 'Sigel, Eostre, Scaetha',
        imports: ['Fruta', 'Vino'],
        exports: ['Queso', 'artículos de cuero', 'lana'],
        background:
          'Asentadas por primera vez hace milenios por los Vindari, las Tierras de los Túmulos fueron abandonadas en gran parte durante el reinado del Sacerdote Liche. La recolonización comenzó hace dos siglos por familias Saxa y Anari. La tierra permanece en gran parte despoblada, consistiendo en llanuras cubiertas de hierba muy adecuadas para las ovejas, y el Bosque Dalthalinin central, habitado por elfos. Las Colinas de los Túmulos son una vasta necrópolis, embrujada por muertos vivientes.',
        government:
          'Las Tierras de los Túmulos se gobiernan por un moot, un consejo de veinte ciudadanos elegidos cada año. Solo los ciudadanos que poseen su propia granja o negocio pueden votar, lo que significa que los terratenientes ricos tienen todo el poder político.',
        military:
          'El reino no tiene un ejército permanente. Cada persona de riqueza contrata a sus propios guerreros para proteger sus bienes. El templo de Scaetha en la capital, Hergist, tiene una fuerza de 50 hombres y mujeres de combate, pero están centrados en los muertos vivientes de las Colinas de los Túmulos, no en disputas fronterizas.',
        geography:
          'El cinturón sur es una meseta, dominada por las Colinas de los Túmulos, una vasta necrópolis de tumbas antiguas. Al norte de las colinas, el terreno desciende a amplias llanuras interrumpidas por parches de páramo. El dominio de elfos del hogar más septentrional, el Bosque Dalthalinin, se encuentra en el centro de las llanuras. Hergist, la capital, es el único asentamiento importante.',
        climate:
          'Tierras del Hogar. El clima es fresco y templado, adecuado para el pastoreo de ovejas. Las Colinas de los Túmulos están azotadas por el viento y desoladas, y se dice que poseen un frío sobrenatural, especialmente por la noche.',
      },
    },
    {
      id: 'G7',
      region_info: {
        name: 'Marca del Este (Iarnsburg y El Bosque Sombrío)',
        population: {
          total: 72824,
          breakdown:
            '70% Saxa, 15% elfos del hogar, 5% Anari, 5% enanos, 4% engro, 1% nacidos de la escarcha',
        },
        ruler: 'Aethling Mercader Aran Thormodsunu y el Consejo de Trada',
        religion: 'Var, Neorthe, Eostre, Ertha, Tiw, Nauthiz (secretamente)',
        imports: ['Marfil', 'arroz', 'seda', 'aceite de ballena'],
        exports: ['Pescado', 'grano', 'hierro', 'vegetales'],
        background:
          'Uno de los reinos más ricos de Rassilon, Marca del Este nunca fue conquistada por los Anari y se convirtió en un puerto de refugio durante la Guerra de la Ventisca, lo que le valió el título de "Salvador de los Saxa". Es una nación de comerciantes, que controla todo el comercio del misterioso este y comercia extensamente con las Tierras de Invierno.',
        government:
          'Una república mercantil, gobernada por el Consejo de Trada y el Consejo de Mercaderes. El poder está determinado por la riqueza. El jefe de la familia más rica recibe el título de Aethling Mercader y gobierna el reino.',
        military:
          'Marca del Este mantiene un gran ejército profesional, la mitad de los cuales son mercenarios, para proteger su gran riqueza. El ejército está compuesto por infantería pesada, caballería mediana y marines. También cuenta con una poderosa armada estacionada en Sandvik.',
        geography:
          'La parte occidental del reino es una accidentada meseta dominada por El Bosque Sombrío, una región rica en hierro que ha sido explotada extensamente durante más de mil años. Está llena de las ruinas de las ciudades anari destruidas durante el Levantamiento de los Golems. Al este de El Bosque Sombrío, el terreno se convierte en un valle ancho, plano y fértil.',
        climate:
          'Tierras del Hogar. La Cordillera de Thunor al norte crea altas precipitaciones en las tierras altas occidentales, mientras que el sur y el este son más secos. El clima es generalmente templado y propicio para la agricultura en el valle central.',
      },
    },
    {
      id: 'G8',
      region_info: {
        name: 'Marca del Este (Sandvik)',
        population: {
          total: 72824,
          breakdown:
            '70% Saxa, 15% elfos del hogar, 5% Anari, 5% enanos, 4% engro, 1% nacidos de la escarcha',
        },
        ruler: 'Aethling Mercader Aran Thormodsunu',
        religion: 'Var, Neorthe, Eostre, Ertha, Tiw, Nauthiz (secretamente)',
        imports: ['Marfil', 'arroz', 'seda', 'aceite de ballena'],
        exports: ['Pescado', 'grano', 'hierro', 'vegetales'],
        background:
          'Esta región es el corazón del poder de Marca del Este, y contiene su capital, Sandvik. Sandvik es una de las ciudades más ricas de Rassilon, sus grandes muelles bullen de comercio las 24 horas del día. Es el punto de entrada para todo el comercio del misterioso Imperio de Jade del este y las tierras desérticas del sur.',
        government:
          'Los dos consejos gobernantes de Marca del Este, el Consejo de Trada y el Consejo de Mercaderes, tienen su sede en Sandvik. La ciudad es el centro político y económico del reino.',
        military:
          'La poderosa armada de Marca del Este está estacionada en Sandvik, protegiendo sus vitales rutas comerciales. La ciudad también mantiene una gran guarnición de soldados profesionales y mercenarios.',
        geography:
          'La ciudad de Sandvik es un importante puerto en la costa este. La tierra a su alrededor es una mezcla de llanuras fértiles y colinas suaves. La región incluye el bosque sur de Bosque Verde y el pequeño enclave druídico en las Colinas Sagradas.',
        climate:
          'Tierras del Hogar. La ubicación costera proporciona un clima marítimo con inviernos suaves (para Rassilon) y veranos frescos. Es uno de los climas más agradables en la mitad norte del continente.',
      },
    },
    {
      id: 'G9',
      region_info: {
        name: 'Veermark (Las Praderas)',
        population: {
          total: '20,000+',
          breakdown: 'Casi en su totalidad Saxa nómadas.',
        },
        ruler: 'Rey-Caballo Thrand Agitador de Vientres',
        religion: 'Freo (como Maestro de Caballos), Ullr, Thunor',
        imports: ['Grano', 'productos terminados'],
        exports: ['Caballos', 'ganado'],
        background:
          'Las Praderas son el hogar de los clanes de caballos nómadas de los Saxa orientales. Abandonaron las formas de vida sedentarias de sus primos occidentales y adoptaron un estilo de vida nómada centrado en sus rebaños de ovejas, cabras y ponis. Son excelentes jinetes y se refieren a su tierra como el "Reino de Freo".',
        government:
          'Una monarquía nómada. El Rey-Caballo celebra la corte durante el verano en el gran campamento de Veergarth. Durante el resto del año, las diversas tribus y clanes se gobiernan a sí mismos bajo sus propios nobles.',
        military:
          'Cada hombre adulto es un guerrero, del que se espera que sea competente con la lanza, el arco y la jabalina. Alrededor de un tercio de cada tribu está compuesto por guerreros que responden a su señor noble.',
        geography:
          'Una vasta estepa abierta de colinas bajas y onduladas, pequeños arroyos y hierba achaparrada. El suelo es delgado y poco apto para la agricultura. La región está casi completamente desprovista de árboles. El Caballo Blanco, una figura gigante tallada en la ladera de una colina, es un importante hito y lugar religioso.',
        climate:
          'Tierras del Hogar, pero más extremas que el oeste. Las praderas abiertas están expuestas al frío viento del norte en invierno y pueden ser calurosas y secas en verano. La nevada es menor que en el oeste, pero el viento hace que se sienta mucho más frío.',
      },
    },
    {
      id: 'G10',
      region_info: {
        name: 'Sutmark (El Paso Alto)',
        population: {
          total: 47076,
          breakdown: '90% Saxa, 6% elfos del hogar, 3% engro, 1% otro',
        },
        ruler: 'Aethling Tind Beitisunu',
        religion: 'Tiw, Ullr',
        imports: ['Oro', 'sal'],
        exports: ['Cerveza', 'pescado', 'aceite', 'lana'],
        background:
          'Sutmark marca la unión entre Rassilon y los desiertos del sur. Es una tierra bajo asedio, su ciudad principal de Ostvik resiste desesperadamente a un enorme ejército de hombres lagarto. Con sus rutas terrestres cortadas, el reino se está muriendo lentamente, recibiendo poca ayuda de sus vecinos.',
        government:
          'Sutmark no tiene un gobierno verdadero en la actualidad. Aethling Tind, hijo del difunto cyning, se encuentra en la ciudad sitiada de Ostvik y ha jurado no tomar su título hasta que se elimine la amenaza. En su ausencia, los asentamientos se gobiernan a sí mismos.',
        military:
          'La mayoría de los guerreros nativos del reino han muerto defendiendo Ostvik. Sutmark ahora depende casi por completo de mercenarios, a quienes se les paga a un gran costo.',
        geography:
          'Una región montañosa de colinas y valles, rodeada por los Picos Sigil y las Colinas Rojas. La ciudad de Ostvik se encuentra al final del Paso Alto, un cuello de botella defensivo de una milla de ancho y cuatro millas de largo de ingeniería monumental. El río Sangrerun obtiene su tono rojizo de los depósitos de hierro.',
        climate:
          'Tierras del Hogar, pero más cálido que las Tierras de Marca del sur. Los Picos Sigil bloquean gran parte del frío del norte. El clima es seco, rozando lo árido cerca del desierto del sur.',
      },
    },
  ],
  conceptosWebApp: {
    introduccion_hellfrost: {
      titulo: 'Bienvenido a Hellfrost',
      descripcion:
        'Hellfrost es un escenario de fantasía épica para el galardonado juego de rol Savage Worlds [1, 2]. El mundo de Rassilon está permanentemente cubierto de hielo y nieve, y las tierras templadas no escapan a la miseria de cosechas fallidas, inviernos mortales y el temido viento del Hellfrost [3, 4]. Además, hace apenas 30 años, la magia, que alguna vez fue el arma más potente de las razas civilizadas, comenzó a fallar repentinamente, un efecto de origen desconocido llamado "El Sifonamiento" la ha convertido en un aliado impredecible [3, 4].',
      contenido_guia_jugador:
        "La Guía del Jugador de Hellfrost contiene todo lo necesario para comenzar a aventurarse en los páramos helados [1, 2], incluyendo seis razas de personaje jugables, decenas de nuevas Ventajas (Edges) y Desventajas (Hindrances), seis trasfondos arcanos mágicos alternativos, detalles sobre 24 deidades y sus seguidores, reglas para la Gloria (un nuevo rasgo que mide las grandes hazañas de los héroes), y reglas completas del escenario para aventurarse en Rassilon [1, 2].",
      libros_requeridos:
        "Para disfrutar plenamente de este escenario, los GMs necesitan el 'Hellfrost Bestiary' y el 'Hellfrost Gazetteer', además del libro de reglas de 'Savage Worlds'. El 'Bestiary' contiene la lista de monstruos y arquetipos, así como reglas para crear reliquias, mientras que el 'Gazetteer' detalla los reinos y lugares principales de Rassilon [5].",
      heroes_y_villanos:
        'Hellfrost fomenta los actos heroicos y las hazañas valientes, similares a las sagas nórdicas antiguas. Los jugadores pueden elegir interpretar héroes o villanos. Los héroes que se sacrifican por los demás ganan Gloria y bonificaciones especiales. Los villanos tienen total libertad, pero no son recompensados por actos malvados [6].',
    },
    el_mundo_de_rassilon: {
      titulo: 'Rassilon: La Tierra y sus Horrores',
      descripcion:
        'La tierra donde tienen lugar las aventuras de los personajes se conoce como Rassilon. Otras tierras existieron, pero han sido inaccesibles durante siglos [7]. Rassilon se divide en cinco regiones geográficas principales [8].',
      el_hellfrost_profundo:
        "Al norte se encuentra el Hellfrost, una vasta extensión de hielo y nieve donde habitan gigantes de escarcha, dragones del Hellfrost, vampiros de escarcha y mamuts del Hellfrost. Se dice que el hielo y la nieve permanentes irradian desde un colosal pico de hielo azul en el centro del Hellfrost [8]. El 'Corazón del Hellfrost' se encuentra alrededor del Mar de Fuego Frío, una masa de fuego frío que destruye cualquier barco de madera que se atreva a navegarla [9]. Pocos animales naturales sobreviven en este reino; solo las criaturas más viles pueden soportar el frío terrible y la mentalidad de 'matar o morir' que impregna esta tierra [10].",
      razas_civilizadas:
        'Rassilon alberga varias razas inteligentes. Los humanos son los más comunes, viviendo en las Tierras del Hogar y el Hellfrost exterior [11]. Otras razas incluyen los enanos de escarcha, que tallan fortalezas en glaciares; los elfos de la taiga, adaptados al frío; y los elfos del hogar, parientes de los elfos de la taiga, que viven en los bosques del sur [11]. Los nacidos del hielo también son una raza de Hellfrost [12]. Las razas civilizadas no viven aisladas; gigantes, orcos, goblins, muertos vivientes inteligentes y demonios acechan, esperando el momento adecuado para atacar [13].',
      idiomas_de_rassilon: {
        descripcion:
          "Algunos términos del manual provienen del inglés antiguo, nórdico y germánico, siendo la base del idioma humano dominante. La mayoría de las palabras se pronuncian como se escriben, con 'g' como 'y' y diptongos con la primera vocal alargada (ej. 'daeg' se pronuncia 'daay') [7].",
        adquisicion_de_idiomas:
          "Los personajes empiezan con un número de idiomas igual a la mitad de su dado de Astucia [14]. El primer idioma debe ser el racial. Muchos también hablan 'Trader', un idioma común creado después de la Guerra de la Ventisca [15]. Se pueden aprender nuevos idiomas invirtiendo un avance [15]. Subir el dado de Astucia durante el juego no otorga idiomas adicionales automáticamente [16]. Los personajes pueden leer y escribir los idiomas que hablan, a menos que sean 'Analfabetos' (común en Rassilon) [16]. Algunas lenguas no tienen forma escrita [16].",
        variaciones_elficas:
          'Aunque el élfico del hogar y el élfico de la taiga comparten palabras, sus idiomas han evolucionado de manera diferente. Los elfos de la taiga tienen muchas palabras para tipos de nieve, mientras que los elfos del hogar tienen múltiples palabras para un solo roble, dependiendo de su ubicación, estación, animales, edad, etc. Se consideran idiomas separados [17].',
      },
      historia_condensada:
        "La historia de Rassilon está marcada por eventos dramáticos desde antes de la Guerra de la Ventisca (Blizzard War). Algunos hitos incluyen la fundación de la Convocación de Elementalistas (-611 IR), las Guerras de la Puerta Demoníaca, la traición de Hela (-352 IR) que liberó a los primeros muertos vivientes, y el inicio de la Guerra de la Ventisca (-25 IR) que diezmó la población y vio la desaparición de los dioses Kenaz y Sigel. El 'Ice Rise' (0 IR) marcó el fin de la guerra, la creación de la Muralla de Hielo y un endurecimiento climático. Eventos posteriores incluyen la fundación de la Magocracia (45 IR), la introducción del 'scield' como moneda (50 IR), y el inicio del Sifonamiento (471 IR) que debilitó la magia [10, 18]. El año actual es 499 IR [18].",
    },
    creacion_de_personajes: {
      titulo: 'Conceptos de Creación de Personajes',
      descripcion:
        'Crear héroes en Hellfrost es sencillo, siguiendo una serie de pasos con la hoja de personaje [19].',
      razas_jugables:
        'En Hellfrost, puedes jugar engros, enanos de escarcha, nacidos del hielo, elfos del hogar, elfos de la taiga y humanos. No existen mestizos como semi-elfos o semi-orcos, ya que elfos y humanos no son genéticamente compatibles [12]. Cada raza tiene sus propias ventajas y desventajas raciales [12].',
      atributos_derivados: {
        carisma:
          'Mide la simpatía del héroe y se añade a las tiradas de Persuasión y Callejear. El modificador base es +0 [16].',
        paso: 'Es igual a 6" (pulgadas), a menos que sea modificado por Ventajas o Desventajas [16].',
        parada:
          'Es igual a 2 más la mitad del dado de Pelear. Puede ser modificado por Ventajas, Desventajas y equipo [20].',
        dureza:
          'Es igual a 2 más la mitad del dado de Vigor. Puede ser modificado por Ventajas, Desventajas y Armadura [20].',
      },
      ventajas_y_desventajas:
        'Los grandes héroes son más que solo habilidades y atributos; son sus dones únicos, poderes especiales y defectos trágicos lo que los hace interesantes [20]. Puedes tomar una Desventaja Mayor (2 puntos) y dos Desventajas Menores (1 punto cada una). Estos puntos pueden usarse para aumentar un atributo, elegir una Ventaja o ganar puntos de habilidad/dinero adicional [21].',
    },
    magia_y_arcano: {
      titulo: 'La Magia en Hellfrost',
      descripcion_general:
        'Rassilon es un mundo de magia [22]. Filamentos de energía mágica de la luna tocan a cada criatura, otorgándoles el potencial de manipular la magia [22, 23]. No hay puntos de poder; el único límite para lanzar hechizos es el riesgo del Sifonamiento o de ofender a los dioses [24]. Solo las criaturas con la Desventaja "Prohibición Mágica" no son afectadas por estos filamentos [23].',
      el_sifonamiento: {
        descripcion:
          'El Sifonamiento comenzó hace menos de 30 años, debilitando la magia y haciéndola impredecible [3, 25]. Los magos temen lanzarla frívolamente debido al riesgo de perder poder temporal o permanentemente [26]. Solo afecta la magia tejida en los conjuros, no la magia bruta del mundo [26].',
        contragolpe_arcano:
          'Cuando un mago saca un 1 en su dado de habilidad arcana (independientemente del Wild Die), sufre el Sifonamiento. Debe tirar 2d6 (o 3d6 y tomar los dos más bajos con un fallo crítico) y consultar la Tabla del Sifonamiento [27]. Si el Wild Die indica un éxito, el conjuro se activa antes de aplicar el efecto del Sifonamiento [27].',
      },
      el_efecto_hellfrost: {
        descripcion:
          'Los magos y clérigos que invocan conjuros de calor o fuego sufren penalizaciones basadas en la temperatura ambiental [28, 29]. Este fenómeno también afecta a criaturas con habilidades basadas en fuego que requieren una tirada [29]. El daño no se ve afectado [29]. Los académicos arcanos debaten la causa, sospechando que está relacionado con la desaparición de los dioses Kenaz y Sigel durante la Guerra de la Ventisca [30]. El fuego mágico ha estado en declive durante siglos [31].',
        modificadores_por_temperatura:
          'Las penalizaciones varían: de 0°C a -10°C, -1; de -11°C a -21°C, -2; de -22°C a -32°C, -3; de -33°C a -44°C, -4; de -45°C a -55°C, -5; y de -56°C o menos, -6 [29]. Estos modificadores se aplican a todas las tiradas de habilidad arcana para conjuros de calor o fuego [29].',
      },
      elemental_loci: {
        descripcion:
          'Los loci elementales son lugares donde los reinos elemental y mortal se superponen, ofreciendo gran poder pero también peligro. Un locus suele estar relacionado con su elemento (ej. fuego en un volcán) [32]. Solo se han descubierto loci de aire, tierra, fuego y agua [33].',
        dimensiones_y_efecto:
          'Un locus se divide en alcance exterior (12 yardas), alcance interior (8 yardas) y núcleo (4 yardas) [33, 34]. Un elementalista afín al elemento gana bonificaciones a sus tiradas de Elementalismo: +1 en el alcance exterior, +2 en el interior y +4 en el núcleo [34]. Un elementalista no afín sufre penalizaciones de -1, -2 y -4, respectivamente [35].',
        contragolpe_en_loci:
          'El contragolpe es más severo en un locus. Fallar una tirada de conjuro causa una herida automática. Con un 1 o un fallo crítico, el mago sufre el Sifonamiento, tirando 1d6 adicional en el alcance exterior, 2d6 en el interior y 3d6 en el núcleo (tomando los dados más bajos) [35].',
      },
      trasfondos_arcanos:
        "Los héroes que toman la Ventaja 'Fondo Arcano (Magia)' deben elegir uno de los tipos de hechicero arcano, cada uno con una habilidad arcana específica y una lista de poderes disponibles [36, 37]. Estos reemplazan la Ventaja estándar 'Fondo Arcano (Magia)' de Savage Worlds [36].",
      hedge_magic_vs_magia_verdadera: {
        descripcion:
          'La magia de setos, o magia natural, no implica manipular hilos mágicos ni requiere un Trasfondo Arcano [38]. No está sujeta a contragolpe, el Efecto Hellfrost, ni puede ser disipada [39]. Su eficacia se basa en el conocimiento detallado del mundo natural [40].',
        beneficios:
          'Los remedios herbales no generan contragolpe ni Sifonamiento [41], son baratos de producir [41], no se detectan como reliquias mágicas [41] y no pueden ser disipados o negados mágicamente [41].',
        creacion_de_remedios_herbales:
          'Implica seleccionar el propósito del remedio (con modificadores de dificultad), nombrar la planta y la forma (polvo, aceite, etc.), encontrar ingredientes (con tiradas de Conocimiento (Alquimia) o Supervivencia, modificadas por rareza y estación) y prepararlos (con tiempos de preparación que afectan la dificultad) [41-50].',
      },
      activacion_objetos_magicos: {
        tipos_de_objetos:
          'Hay tres tipos de objetos mágicos: dispositivos alquímicos (pociones, pergaminos), objetos de magia de setos (pociones herbales) y reliquias legendarias (los más poderosos) [51].',
        dispositivos_alquimicos:
          'Cualquier criatura sentiente que toca uno sabe instantáneamente su poder y cómo usarlo, siguiendo las instrucciones (ej. beber una poción, leer un pergamino) [51, 52].',
        objetos_hedge_magic:
          'No se detectan como mágicos al tacto (aunque los conjuros de detección sí funcionan) y no requieren sintonización [52]. Se necesita una tirada de Conocimiento (Alquimia) para aprender sus propiedades si no están etiquetados [53].',
        reliquias_legendarias:
          "Son los objetos mágicos más raros, cuya creación se perdió hace eones [54]. Tocarlas revela que son objetos de poder [55]. Para usar sus poderes, un héroe debe 'sintonizarse' con el objeto gastando un benny. Si es usable, el héroe aprende instantáneamente todas sus habilidades y bonificaciones [56].",
      },
    },
    equipo_y_logistica: {
      titulo: 'Conceptos de Equipo y Logística',
      descripcion_general:
        'Después de crear el personaje, se adquiere equipo (armas, armaduras, objetos). A menos que se modifique por Ventajas o Desventajas, el héroe comienza con 500 escudos de oro [57]. La tecnología en Rassilon es predominantemente medieval [57].',
      moneda:
        "La única moneda de uso diario son los 'scields' (escudos), monedas con forma de escudo introducidas en Drakeport 50 años después de la Guerra de la Ventisca [57]. Hay escudos de oro (gs) y de plata (ss), con 10 scields de plata equivalentes a 1 de oro [57]. Los Finnari y Saxa prefieren el trueque, pero las monedas son necesarias en mercados y ciudades [58].",
      disponibilidad_de_items: {
        general:
          "Tener dinero no garantiza poder comprar bienes en cualquier lugar [59]. Los asentamientos y aldeas son autosuficientes en bienes básicos, pero carecen de materiales y artesanos para otros artículos. En una ciudad importante, se encuentra casi todo [59]. La mayoría de los bienes se clasifican por disponibilidad en Aldea (V), Pueblo (T) o Ciudad (C), indicando el tamaño mínimo de asentamiento [59]. 'Especial' (S) se refiere a ubicaciones específicas (ej. armaduras bendecidas en templos) [59]. Durante la generación de personaje, se asume que los héroes ya han adquirido su equipo [60].",
        factores_raciales_geograficos:
          'La disponibilidad también varía por raza y geografía [60]. Por ejemplo, la armadura de placas cuesta el doble en tierras Saxa o élficas, ya que prefieren armaduras más ligeras, mientras que los Anari las favorecen [60]. Los Finnar no producen armaduras o armas de metal, y estos artículos cuestan cinco veces más en sus campamentos debido a la importación [conversación]. Los Saxa favorecen las hachas (75% del precio normal) y ven las espadas como armas de la nobleza (50% más caras) [conversación]. Los enanos venden armas y armaduras al doble del costo por su xenofobia [conversación]. Las pieles y ropa de invierno son más baratas y siempre disponibles entre los Finnar [conversación].',
        compra_venta_de_bienes:
          'Los artículos de Ciudad en un pueblo, o de Pueblo en una aldea, cuestan un 50% más. Los artículos de Ciudad en una aldea cuestan el doble [61]. Los bienes especiales rara vez se compran fuera de su lugar descrito [61].',
      },
      materiales_especiales: {
        general:
          'Ciertos materiales otorgan propiedades mágicas y son extremadamente raros y caros. Su disponibilidad la determina el GM [62].',
        hielo_negro:
          "Se encuentra en glaciares antiguos o páramos del Hellfrost. Se trabaja como metal en fraguas de fuego frío (se derrite con llamas normales). Cuesta 10 veces más y es 'Especial' [62, 63]. Es muy susceptible al calor; los ataques de fuego o calor reducen su Armadura o dado de daño por herida, derritiéndose completamente al llegar a cero [63]. Los objetos de hielo negro que comienzan a derretirse no pueden repararse [64].",
        maerathril_metal_lunar:
          "Metal blanco, ligero y con propiedades antimágicas, trabajado en fraguas normales o de fuego frío. Cuesta 100 veces más y es 'Especial' [64]. Las armaduras de Maerathril otorgan la Ventaja Resistencia Arcana (+2 o +4 mejorada), acumulándose con Edges similares (hasta +6). Los magos que las usan sufren -2 a sus tiradas de habilidad arcana. El peso es la mitad [64]. Las armas 'Disipan' automáticamente un hechizo activo cada vez que golpean a un objetivo [64].",
        metal_estelar:
          "Un metal raro de estrellas caídas, fuerte y perforante. Se trabaja como metal normal. Cuesta 50 veces más y es 'Especial' [65]. Las armaduras de metal estelar tienen +2 Armadura adicional. Las armas tienen AP 2 (o +2 AP adicional si ya tenían). Las herramientas tienen +3 de Dureza de Objeto [65].",
      },
      fortificaciones: {
        general:
          "Las fortificaciones rara vez están a la venta. Las paredes se consideran Armadura Pesada; cada herida crea una brecha de 1 pulgada [66, 67]. El 'Bono de Asedio' se añade a las tiradas de Batalla y Moral del defensor [67]. Los 'Defensores' son el número habitual de guardias [67]. Los 'Suministros' son semanas de provisiones; sin ellos, los defensores pierden el Bono de Asedio y sufren -2 de penalización a Moral [68]. El 'Costo' es una guía para el GM; las construcciones en territorio sin dueño aumentan un 25% por guardias [68]. Los nobles o personajes Ricos/Muy Ricos pueden poseerlas/construirlas, pero deben cubrir los gastos anuales (2% del costo) si no tienen tierras de apoyo [69].",
      },
    },
    clima_y_ambiente: {
      titulo: 'Conceptos de Clima y Ambiente',
      niveles_de_temperatura:
        "Hellfrost usa un sistema de 'niveles de temperatura' [70]. La temperatura exacta es irrelevante; cualquier temperatura dentro de un nivel da la misma penalización de Vigor [70]. La columna de Vigor lista la penalización a las tiradas para resistir el frío [70].",
      vestimenta_y_penalizaciones:
        'Las penalizaciones de la tabla de temperatura asumen que el personaje ya lleva una camisa cálida y una capa. El viento constante y cortante impone una penalización más alta. Un personaje con ropa menos sustancial sufre un -2 adicional a sus tiradas de Vigor [71].',
      temperatura_nocturna:
        'Por la noche, la temperatura desciende 1 nivel debido a la pérdida de calor del débil sol, dejando el terreno extremadamente frío [72].',
      refugio_y_fuego:
        "Un refugio (cueva, hoyo de nieve, tienda, conjuro de 'Refugio') bloquea el viento cortante y otorga un bono de +1 a +4 a las tiradas de Vigor para resistir el frío, dependiendo de su resistencia al viento [73]. Un fuego adecuado dentro del refugio otorga un +2 adicional [73].",
      fuego_frio_coldfire:
        'El fuego frío es una de las grandes maravillas del Hellfrost. Tiene las propiedades del fuego normal, pero arde con una llama azul-blanca fría, capaz de derretir metal. Existe de forma natural o se crea quemando leña de hielo (icewood) [74].',
    },
    la_gloria: {
      titulo: 'Concepto de la Gloria',
      que_es_la_gloria:
        'La Gloria es un nuevo rasgo que mide las grandes hazañas de tus héroes [1, 2]. Los jugadores que se esfuerzan por interpretar a un personaje heroico, que se sacrifica por los demás, pueden ganar Gloria [6]. Un héroe más glorioso obtiene bonificaciones especiales [6].',
      ganando_gloria_general:
        'Para ganar Gloria se evalúan las hazañas heroicas. Por ejemplo, decapitar a un liche con un golpe de gracia es una hazaña notable, digna de un pequeño modificador [75]. Una partida Novata que vence a un grupo de orcos sin ayuda debería ser recompensada con una mayor fama [75]. Se pueden aplicar penalizaciones por oponentes débiles o circunstancias favorables [76].',
      gloria_en_batalla_masiva:
        'La guerra es terrible y puede forjar o romper reputaciones. En Batallas Masivas, los modificadores de Gloria son fijos [77].',
      beneficios_de_la_gloria:
        'Ser un héroe tiene sus ventajas. Cada vez que un héroe alcanza un múltiplo de 20 puntos de Gloria, puede elegir un beneficio de una lista, cumpliendo los requisitos [78]. Los beneficios pueden tomarse varias veces [79]. Si la Gloria cae por debajo de un múltiplo de 20, los beneficios correspondientes se pierden temporalmente hasta que se recupere la Gloria [79]. Un beneficio notable es ser "Inmortalizado en Canción", garantizando un lugar en la historia y un entierro digno [80].',
    },
    religion: {
      titulo: 'Conceptos Religiosos',
      dioses_y_el_pacto:
        "Los dioses no son omnipotentes; son entidades poderosas pero limitadas a sus esferas de interés [81]. La desaparición de Kenaz y Sigel (dioses del fuego y el sol) hizo que sus clérigos se debilitaran en regiones frías [81]. El 'Pacto' impide la intervención divina directa para evitar que los dioses oscuros apoyen directamente a sus seguidores [81]. Thrym (dios del invierno) ha crecido en poder con el Hellfrost, y los dioses del bien debaten si ha roto el Pacto [82].",
      deidades_patronas:
        "Una deidad patrona es a la que un mortal dedica su vida religiosa. Los que mueren habiendo vivido según los preceptos de su patrón son llevados a su vida después de la muerte. Los que no tienen patrón van a la 'Sala de los Gritos Resonantes', un 'salón de subastas de almas' donde los demonios y heraldos pujan por ellas [83, 84].",
      deidades_menores:
        "Hay cientos de dioses menores, a menudo aspectos de deidades mayores. Permiten a los jugadores crear su propio dios (ej. un tipo de pájaro o una montaña específica), pero con poderes muy específicos y de alcance limitado para no rivalizar con los dioses mayores [85-87]. Los clérigos de deidades menores no obtienen la Ventaja 'Conexiones' ni la Desventaja 'Órdenes' [88].",
      clérigos_y_milagros:
        'Todos los clérigos obtienen la Ventaja "Fondo Arcano (Milagros)", pero cada uno es diferente según la deidad que sigue [89]. Deben obedecer los preceptos de su fe o corren el riesgo de perder su magia (pecados) [90]. Si un clérigo saca un 1 en su dado de Fe, es Sacudido. Un fallo crítico resulta en un nivel de Fatiga [91].',
      nigromancia_religiosa:
        "Antes de la locura de Hela (la antigua diosa de la muerte), había pocos muertos vivientes. Tras su traición, liberó miles de espíritus del Abismo que habitaron cadáveres, convirtiéndola en la Diosa de la No Muerte y otorgando poder nigromántico a sus clérigos [92]. Se cree que los clérigos de Hela extraen espíritus de un reino secreto para animar cadáveres [93]. El conjuro 'Gravespeak' permite contactar almas difuntas, pero Hela a veces intercepta la conexión, redirigiéndola a una de sus almas oscuras [89].",
    },
    vida_en_rassilon: {
      titulo: 'Conceptos de la Vida en Rassilon',
      calendario:
        "Un año en Rassilon tiene 416 días. Los años se numeran desde el 'Ice Rise' (0 IR), el fin de la Guerra de la Ventisca, siendo el año actual 499 IR [94]. Las fechas se dan como 'segundo Sunnandaeg de Plohmonan' [94]. Los magos usan relojes de arena para periodos cortos [95].",
      sol_y_luna:
        "El sol se conoce como 'El Hogar de Sigel' y la luna como 'La Ascua de Maera'. Los skalds llaman a la luna 'La Perdición de Niht' [95].",
      costumbres_funerarias:
        "Las costumbres funerarias varían por raza [96]. Los Saxa creman a sus muertos, incluyendo nobles en 'longships' [96]. Los Finnar y Tuomi siempre han cremado [96]. Los Anari de Alantaris Isle y la Magocracia entierran sin ajuar funerario [97]. Los elfos de ambas razas entierran a sus muertos y plantan un retoño sobre la tumba, creyendo que el espíritu pasa al árbol y sus raíces inmovilizan el cuerpo para evitar que se convierta en muerto viviente [97].",
      comercio_y_tiendas_de_magia:
        "La mayoría de los comerciantes tienen rutas comerciales regulares. Las 'reliquias' (objetos mágicos permanentes) son extremadamente raras y no están a la venta en tiendas [98]. Pociones, pergaminos y otros objetos temporales pueden encontrarse en ciudades grandes y mercados rurales [99].",
      organizaciones_general:
        "El manual describe varias organizaciones en las Tierras del Hogar y el Hellfrost, a las que los personajes pueden unirse [100]. Estas incluyen los 'Bludgeoners' (guerreros engro que protegen sus caravanas) [100], la 'Convocación de Elementalistas' (que unificó a los elementalistas bajo leyes comunes) [101], los 'Caballeros Hrafn' (una orden de estrategas y tácticos mercenarios) [102], los 'Lorekeepers' (dedicados a preservar el conocimiento) [103], el 'Relicario' (busca y protege artefactos mágicos permanentes) [104], la 'Hermandad de la Misericordia' (sanadoras no religiosas) [105], y los 'Wood Wardens' (organización élfica que protege los bosques) [106].",
    },
    razas: {
      Engro: {
        descripcion:
          'Una raza diminuta de nómadas, que viajan por las Tierras del Hogar y el Hellfrost exterior en caravanas de colores brillantes [1]. Tienen una mala reputación, siendo considerados ladrones y mendigos por otras razas [1]. A pesar de ser despreciados, los engro son optimistas y de espíritu elevado, incluso ante el peligro [2]. Miden en promedio 90 cm (3\') de altura y la mayoría vive unos 70 años, aunque se han registrado engro de 100 años [3]. Son religiosos por naturaleza, aunque rara vez participan en ceremonias organizadas, y la mayoría practica una forma de druidismo [4].',
        caracteristicas_raciales: [
          '**Suerte:** Los engro roban un benny adicional por sesión de juego. Esto se puede combinar con los Filos Suerte y Gran Suerte [5].',
          '**Forastero:** Los engro tienen la Desventaja Forastero entre todas las razas excepto la suya [5].',
          '**Pequeño:** Los engro miden en promedio solo unos 90 cm (3\') de altura. Su pequeño tamaño resta 1 a su Dureza y son de Tamaño –1 [5].',
          '**Astuto:** La mayoría de los engro se ganan la vida operando al margen de la ley. Comienzan el juego con Abrir Cerraduras o Sigilo en d6. Esto no se puede cambiar más tarde [5].',
          '**Espíritu:** Los engro son seres generalmente optimistas. Comienzan con un Espíritu d6 en lugar de un d4. Mediante avances y Filos, pueden tener un Espíritu máximo de d12+3 [6].',
        ],
        nombres_ejemplo: {
          masculinos: ['Bertrem', 'Jym', 'Odbert', 'Oxbow', 'Rodgar'],
          femeninos: ['Daisy', 'Foxglove', 'Petunia', 'Rose'],
          apellidos:
            'Los engro nunca han usado apellidos, creyendo que un nombre tiene poder [3].',
        },
      },
      Enano_Helado: {
        descripcion:
          'Aunque los enanos viven predominantemente en montañas, siempre lo hacen por encima de la línea de nieve [6]. Algunos han tallado complejos vastos en los lados de los glaciares. Son ligeramente xenófobos y sus hogares son fortalezas vastas con guardias y trampas ocultas [7]. Tienen pocos clérigos, que suelen seguir a Ertha o Tiw, pero han dominado el poder de las runas. Viven alrededor de 300 años, tienen cabello blanco, piel pálida y ojos negros. La mayoría mide 1.5 metros (5 pies) de altura, pero son criaturas fornidas [7]. Los hombres llevan barba, cuya longitud y número de trenzas determinan el estatus social y la profesión [8].',
        caracteristicas_raciales: [
          '**Letargo por Calor:** Los enanos helados se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [9].',
          '**Insular:** Los enanos helados se han mantenido apartados y rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las demás razas [9].',
          '**Visión en Baja Luz:** Los ojos de los enanos están acostumbrados a la penumbra del subsuelo. Ignoran las penalizaciones por oscuridad en todas las situaciones excepto en Oscuridad Total [9].',
        ],
        nombres_ejemplo: {
          masculinos: ['Ari', 'Bardi', 'Geirstein', 'Hord', 'Ljot', 'Olvir'],
          femeninos: ['Asleif', 'Herdis', 'Svala', 'Thyra'],
          apellidos:
            'Los nombres de clan se forman con un descriptor seguido de un objeto (ej. Brighthammer, Foeaxe, Goldbeard, Steelhand) [8, 9].',
        },
      },
      Nacido_del_Hielo: {
        descripcion:
          'Hace un siglo no existían los nacidos del hielo; hoy son numerosos, aunque no tanto como otras razas. No evolucionaron, simplemente aparecieron. Pueden ser engendrados por cualquier raza, pero un apareamiento de nacidos del hielo siempre resulta en un hijo nacido del hielo [10]. Comparten la forma física de sus padres, pero carecen de sus cualidades raciales, poseyendo rasgos únicos. Todos tienen piel blanco-azulada, cabello blanco y ojos azul pálido, y su piel siempre está fría al tacto [11]. La mayoría se aventuran al Hellfrost, intentando comenzar una nueva vida lejos de los prejuicios [11].',
        caracteristicas_raciales: [
          '**Forma Frígida:** Los nacidos del hielo tienen una forma innata limitada de hrimwisardry. Conocen los poderes: armadura (piel helada), protección ambiental (solo contra el frío), castigo (carámbanos crecen de las manos o un arma), y velocidad (pies con hielo). Pueden adquirir la habilidad Hrimwisardry sin tomar el Filo Trasfondo Arcano [12, 13].',
          '**Letargo por Calor:** Los nacidos del hielo se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [14].',
          '**Forastero:** Los nacidos del hielo son universalmente desconfiados fuera de los enclaves de nacidos del hielo [14].',
          '**Alma de Invierno:** Los nacidos del hielo tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo [14].',
        ],
        nombres_ejemplo: {
          comunes:
            'Al nacer, generalmente reciben nombres de la cultura de sus padres, pero muchos rechazan los nombres familiares y adoptan nuevos nombres con un toque gélido (ej. Crinhelada, Filohielo, Manoescarcha, Caminanieves) [12].',
        },
      },
      Elfo_del_Hogar: {
        descripcion:
          'En el pasado distante, los elfos del hogar vivían en los bosques cálidos del mundo, actuando como jardineros y guardianes. Construían grandes Elfhomes de madera. Se consideran la primera creación de los dioses y eligieron seguir las enseñanzas de los dioses del bien [15]. Pueden vivir más de 500 años, son ligeramente más altos que los humanos pero más esbeltos, con cabello rubio o castaño claro y ojos verde pálido o marrones [16]. Las relaciones con los humanos son tensas [16].',
        caracteristicas_raciales: [
          '**Ágil:** Los elfos del hogar son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4 [17].',
          '**Torpe:** Los elfos del hogar tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe [17].',
          '**Nacido en el Bosque:** Los elfos del hogar no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior [18].',
          '**Visión en Baja Luz:** Los elfos del hogar tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total [18].',
          '**Reinos Naturales:** Los elfos del hogar que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas [18].',
        ],
        nombres_ejemplo: {
          genero_neutro: [
            'Ailinnil',
            'Elleneirlir',
            'Lilime',
            'Melasion',
            'Niellan',
            'Sinrilli',
          ],
          apellidos:
            'A menudo asociados con eventos naturales (ej. Corremas, Hojasusurro, Nieblamañana, Silbobrillo) [17].',
        },
      },
      Humano: {
        descripcion:
          'Los humanos son la raza más poblada en las Tierras del Hogar, aunque sus números han disminuido por la hambruna, enfermedades y ataques [18]. Hay cuatro ramas distintas de humanos: Anari, Finnar, Saxa y Tuomi. Cada cultura tiene numerosas subculturas [19].',
        culturas_humanas: {
          Anari: {
            descripcion:
              'Habitantes de ciudades y pueblos, se consideran culturalmente superiores [20]. Su antiguo imperio dominó el continente occidental, pero ahora es una raza fracturada [20]. Sus magos favorecen el elementalismo, excepto en la Magocracia, donde practican heahwisardry [21]. Miden en promedio 1.68 m (5’6”) y tienen piel más oscura, cabello castaño oscuro o negro, y ojos generalmente verdes o marrones [22].',
            nombres_ejemplo: {
              masculinos: [
                'Argius',
                'Bron',
                'Bovert',
                'Delbaeth',
                'Emeric',
                'Gaidon',
                'Garth',
                'Howel',
                'Patris',
                'Rochad',
                'Serin',
                'Thosa',
              ],
              femeninos: [
                'Aife',
                'Armide',
                'Branwen',
                'Elianor',
                'Emer',
                'Liaze',
                'Lusiane',
                'Tangwenn Ursanne',
              ],
              apellidos:
                "Tradicionalmente formados añadiendo 'ap-' al nombre del padre. Actualmente, muchos adoptan su oficio como apellido o crean nuevos nombres [22].",
            },
          },
          Finnar: {
            descripcion:
              'Prefieren vivir en tiendas de fieltro, cálidas y fácilmente transportables por renos. Son extremadamente pragmáticos, un hábito vital para sobrevivir en los páramos helados [23]. Los magos finnar suelen aprender magia de la canción o hrimwisardry [24]. Tienden a ser bajos para los humanos, promediando 1.68 m (5’6”), con cabello oscuro y piel morena, curtida por el viento [24].',
            nombres_ejemplo: {
              masculinos: ['Arto', 'Kaiju', 'Konsta', 'Taneli', 'Tove', 'Vilho'],
              femeninos: ['Esko', 'Hannu', 'Kaari', 'Merja', 'Pirkka', 'Tyko'],
              apellidos: [
                'Aho',
                'Hietanen',
                'Jarnefelt',
                'Paatalo',
                'Petelius',
                'Stenvall',
                'Utrio',
                'Waltari',
              ],
            },
          },
          Saxa: {
            descripcion:
              'Un pueblo clannish que vive principalmente en pequeñas granjas y aldeas. Su cultura se basa en juramentos de amistad y lealtad, y el principio de hospitalidad [25, 26]. Los magos saxa prefieren la magia de la canción [26]. Miden poco menos de 1.83 m (6 pies) de altura, tienen cabello castaño o rubio, ojos azules o verde claro, y piel pálida [27]. Los hombres usan bigotes y barbas, y llevan el cabello largo [28].',
            nombres_ejemplo: {
              masculinos: [
                'Agdi',
                'Cynric',
                'Edwin',
                'Gautrek',
                'Leofric',
                'Penda',
                'Runolf',
                'Seaxwulf',
                'Skuli',
                'Wiglaf',
              ],
              femeninos: [
                'Aalfwynn',
                'Eadgifu',
                'Gytha',
                'Isgerrd',
                'Skjalf',
                'Thorgerd',
                'Wulfwynn',
                'Yrsa',
              ],
              apellidos:
                "Los saxa añaden los sufijos '-sunu' ('hijo') o '-sdohtor' ('hija') al nombre de su padre [28].",
            },
          },
          Tuomi: {
            descripcion:
              'La cultura humana menos numerosa, confinada a las Battlelands y Drachenlands. Son una cultura guerrera orgullosa que prefiere resolver disputas con sangre [29]. Tiw, el dios de la guerra, es muy favorecido entre las tribus [30]. Miden alrededor de 1.63 m (5’4”) de altura. Ambos sexos llevan el cabello largo y a menudo lo tiñen. Usan glasto y henna para crear tatuajes elaborados, algunos de los cuales tienen poder mágico [30, 31].',
            nombres_ejemplo: {
              masculinos: [
                'Achivir',
                'Arcois',
                'Bili',
                'Brude',
                'Canaul',
                'Gart',
                'Volas',
              ],
              femeninos: [
                'Aniel',
                'Bannatia',
                'Breth',
                'Cailis',
                'Ila',
                'Olfinecta',
                'Tamia',
              ],
              apellidos:
                'Usan apodos en lugar de apellidos y siempre añaden el nombre de su tribu después [31].',
            },
          },
        },
        caracteristicas_raciales: [
          '**Diversos:** Los humanos de cualquier cultura comienzan el juego con un Filo gratuito de su elección o 2 puntos de habilidad adicionales [32].',
        ],
      },
      Elfo_de_la_Taiga: {
        descripcion:
          'En el pasado distante, varias tribus élficas se dirigieron al norte para establecer Elfhomes en la gran taiga. Vivieron en relativo aislamiento y con el tiempo, casi todos los lazos con sus primos del sur se olvidaron [32]. Desde la Guerra de la Ventisca, han visto su hábitat natural disminuir. Tienen cabello blanco y piel azul claro, siendo por lo demás similares a los elfos del hogar en esperanza de vida [33].',
        caracteristicas_raciales: [
          '**Ágil:** Los elfos de la taiga son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4 [34].',
          '**Torpe:** Los elfos de la taiga tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe [35].',
          '**Nacido en el Bosque:** Los elfos de la taiga no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior [35].',
          '**Letargo por Calor:** Los elfos de la taiga se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [35].',
          '**Insular:** Los elfos de la taiga rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las razas excepto los elfos [35].',
          '**Visión en Baja Luz:** Al igual que sus parientes templados, los elfos de la taiga tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total [36].',
          '**Reinos Naturales:** Los elfos de la taiga que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas [36].',
          '**Alma de Invierno:** Los elfos de la taiga tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo [36].',
        ],
        nombres_ejemplo: {
          simples:
            'Los elfos de la taiga usan un solo nombre, que suele (pero no siempre) tener un elemento invernal o natural (ej. Jineteescarcha, Crinhelada, Brillohielo, Ojosnocturnos, Tejeombra, Correnieve) [34].',
        },
      },
    },
    categorias_personaje: {
      Vengador: {
        descripcion:
          'Los habitantes del Hellfrost, bandidos u orcos han arrebatado todo lo que el héroe amaba. La venganza es lo único que lo mantiene en pie [37].',
      },
      Bandido: {
        descripcion:
          'Ante la escasez de alimentos, algunas personas han recurrido a tomar lo que quieren por la fuerza o la amenaza de violencia [37].',
      },
      Bailarín_de_Espadas: {
        descripcion:
          'Guerreros elfos hábiles en el uso de dos hojas. Sus movimientos parecen espontáneos pero son como pasos de baile bien ensayados para los no-elfos [37].',
      },
      Porra: {
        descripcion:
          'Guerreros engro altamente entrenados en el uso de la honda. Sirven como una especie de policía, pero solo en la sociedad engro [38].',
      },
      Ciudadano: {
        descripcion:
          'Héroes que surgen de personas comunes, como una viuda que busca venganza o un hijo de granjero que busca aventura [38].',
      },
      Druida: {
        descripcion:
          'Solo los elfos y los engro entienden cómo canalizar energía de plantas y animales. Son fuertes en la naturaleza, pero sufren dificultades en entornos urbanos [38].',
      },
      Elementalista: {
        descripcion:
          'Magos que obtienen su poder a través de los reinos elementales. Un elementalista que ha dominado los cuatro elementos es conocido como arkhwisard (archimago) [39].',
      },
      Explorador: {
        descripcion:
          'Viajeros que recorren las tierras, corrigiendo mapas antiguos y detallando las nuevas maravillas del mundo casi congelado [39].',
      },
      Luchador: {
        descripcion:
          'Puede ser desde mercenarios endurecidos y guardaespaldas hasta jóvenes granjeros que buscan defender sus hogares [39].',
      },
      'Heahwisard_Mago_Superior': {
        descripcion:
          'Magos que obtienen energías mágicas a través de sus bastones, y son extremadamente débiles mágicamente sin ellos. También son la nobleza gobernante de las tierras conocidas como la Magocracia [40].',
      },
      Sanador: {
        descripcion:
          'Personas que se esfuerzan por detener la marea de miseria con cataplasmas y ungüentos. Las Hermanas de la Misericordia son la única organización no religiosa jurada a este servicio [40].',
      },
      Caballero_del_Hogar: {
        descripcion:
          'Dedicados a la defensa de las Tierras del Hogar contra las depredaciones de los habitantes del Hellfrost. Operan solo en las regiones más frías, custodiando caminos y pasos de montaña [40].',
      },
      Heraldo: {
        descripcion:
          'Sirven a los nobles como diplomáticos y mensajeros. Un ataque contra un heraldo es un ataque contra su señor [41].',
      },
      'Hrimwisard_Mago_de_Escarcha': {
        descripcion:
          'Magos que tejen poderosos hechizos extrayendo energías mágicas que se encuentran en el Hellfrost a través de sus cuerpos. Cuanto más frío hace, más poderosos efectos pueden invocar [41].',
      },
      Manipulador_de_Hielo: {
        descripcion:
          'Marineros hábiles en el pilotaje de barcos de hielo, que se deslizan sobre el hielo y la nieve con patines y esquís largos [41].',
      },
      Mercenario_del_Gremio_de_Hierro: {
        descripcion:
          'Aunque existen muchas compañías mercenarias, el Gremio de Hierro solo contrata tropas para comerciantes que requieren protección [42].',
      },
      Trabajador_Itinerante: {
        descripcion:
          'Vagabundos que ofrecen sus servicios en granjas y aldeas por todo Rassilon, como sanadores, herreros o sacerdotes. Los soldados itinerantes son mercenarios [42].',
      },
      'Caballero_Hrafn_Cuervo': {
        descripcion:
          'La Orden de los Caballeros Hrafn se dedica a la perfección del liderazgo militar. Se preocupan poco por la política y contratan a sus miembros para servir a nobles [42, 43].',
      },
      Guardián_del_Saber: {
        descripcion:
          'Dedicados a encontrar y preservar el conocimiento, se esfuerzan por evitar que se olvide [43].',
      },
      Mensajero: {
        descripcion:
          'Parte jinete, explorador y guerrero, cuya vida es difícil, pero puede ser gratificante. La comunicación está limitada por la velocidad del caballo y el coraje del jinete [43].',
      },
      Noble: {
        descripcion:
          'La nobleza permanece en la cima de la escala social. Muchas tierras ancestrales se han perdido, lo que obliga a los hijos más jóvenes a buscar fortuna a través de la aventura [43].',
      },
      Forajido: {
        descripcion:
          'Marginados por actividades criminales o falsas acusaciones. A diferencia de los bandidos que atacan a los débiles, los forajidos son simplemente parias y aún pueden ser héroes honorables [44].',
      },
      Paladín: {
        descripcion:
          'Mientras los sacerdotes guardan las almas de los fieles, los paladines guardan su carne. Algunos residen permanentemente en templos, otros viajan realizando hazañas en nombre de su deidad [44].',
      },
      Sacerdote: {
        descripcion:
          'Existen muchos dioses adorados en Rassilon. Los sacerdotes forman el brazo espiritual de su fe [45].',
      },
      'Guardabosques_Ranger': {
        descripcion:
          'Operan en la naturaleza como exploradores, espías, exploradores y soldados. A menudo patrullan las Tierras del Hogar para combatir los males que allí residen [45].',
      },
      Refugiado: {
        descripcion:
          'El héroe puede haber perdido su hogar por ataques de bestias del Hellfrost, huido por malas cosechas o tenido su hogar enterrado bajo la nieve. No tiene un hogar propio y debe sobrevivir con su ingenio y la generosidad de otros [45].',
      },
      Reliqus: {
        descripcion:
          'Miembro del Relicario, una organización dedicada a localizar, estudiar y proteger objetos mágicos. Algunos identifican reliquias por sus marcas, otros buscan magia antigua en criptas y templos [46, 47].',
      },
      Guardián_de_Caminos: {
        descripcion:
          'Un grupo de hombres y mujeres que se han encargado de proteger los caminos y salvaguardar a los viajeros en Rassilon [46].',
      },
      Mago_Rúnico: {
        descripcion:
          'Encontrado solo entre los enanos, los magos rúnicos concentran las energías mágicas del mundo a través de runas talladas [46].',
      },
      'Explorador_Scout': {
        descripcion:
          'Trabajan para comerciantes (vigilando bandidos u orcos), como tropas de reconocimiento independientes para compañías mercenarias, y como guías para grupos de aventureros en los páramos congelados [48].',
      },
      Skald: {
        descripcion:
          'Hechiceros que realizan su magia a través del poder de la canción. También conocen música, historias y poemas, y son bienvenidos en la mayoría de los asentamientos [48, 49].',
      },
      Ladrón: {
        descripcion:
          'Aprovechan a quienes tienen algo de valor. Algunos son tipos al estilo Robin Hood, otros buscan su propio beneficio [49].',
      },
      Trampero: {
        descripcion:
          'Se ganan la vida cazando osos y lobos para vender sus pieles (necesarias para sobrevivir). Están curtidos a la intemperie y a menudo encuentran ruinas mientras cazan [49].',
      },
      Guardián_del_Bosque: {
        descripcion:
          'Una organización principalmente élfica, dedicada a proteger los bosques de Rassilon. Son tiradores expertos y saben cómo hablar con bestias mundanas [50].',
      },
      Leñador: {
        descripcion:
          'Almas resistentes que viajan al Bosque Congelado para recolectar valiosa madera de hielo, que los enanos utilizan en sus forjas de hielo negro [50].',
      },
    },
    habilidades: {
      generales: [
        'Todas las habilidades estándar de Savage Worlds, excepto Conducir (Driving) y Pilotar (Piloting).',
        'Montar (Riding) ahora cubre el control de vehículos tirados por animales.',
      ],
      arcanas_especiales: {
        descripcion:
          'Los personajes con un Fondo Arcano (Arcane Background) tienen acceso a habilidades arcanas especiales, las cuales se detallan en el capítulo de Magia. Estas son:',
        lista: [
          'Druidismo (Druidism) (basada en Astucia)',
          'Elementalismo (Elementalism) (basada en Astucia)',
          'Magia Superior (Heahwisardry) (basada en Astucia)',
          'Magia de Escarcha (Hrimwisardry) (basada en Astucia)',
          'Magia Rúnica (Rune Magic) (especial, basada en Astucia, una por cada runa)',
          'Magia de la Canción (Song Magic) (basada en Astucia)',
        ],
      },
      conocimiento: {
        descripcion:
          'Las habilidades de Conocimiento en Hellfrost son la parte práctica del Conocimiento General. Si un héroe compra una habilidad, el GM debe asegurarse de que tenga la oportunidad de usarla regularmente. Las habilidades de Conocimiento principales utilizadas son:',
        lista: {
          Alquimia:
            'Cubre la creación de pociones mágicas, pergaminos y otros objetos temporales, así como pociones herbales mundanas.',
          Arcanos:
            'El estudio de asuntos arcanos y ocultos, desde los diversos tipos de magia hasta alfabetos rúnicos místicos, el conocimiento de los reinos elementales o el Abismo.',
          Área: 'El estudio de una región determinada, su gente, lugares y costumbres. Cuanto mayor sea el área cubierta por la habilidad, mayor será la penalización que el GM debe imponer para información específica. El conocimiento del dominio de origen de un personaje se cubre con Conocimiento General.',
          Batalla:
            'La aplicación práctica de tácticas y estrategia, así como la logística y el reclutamiento. También cubre el conocimiento de batallas famosas, tácticas y generales.',
          Oficio: 'Cada oficio, como la carpintería, la alfarería, la herrería y el tejido, es una habilidad de conocimiento separada. Un artesano puede usar Conocimiento General para tasar bienes similares a su especialidad de Oficio.',
          Folklore:
            'Cubre las leyendas, historias y poemas, además de chismes conocidos. El conocimiento del folklore dentro de la región de origen de un personaje se cubre con Conocimiento General.',
          Heráldica:
            'Conocimiento de los escudos de armas, estandartes y diseños de escudos de las casas nobles, clanes y religiones de Rassilon. El conocimiento de los nobles y diseños heráldicos dentro de la región de origen de un personaje se cubre con Conocimiento General.',
          Historia:
            'Estudio de los principales eventos históricos desde la Guerra de la Ventisca (Blizzard War). El conocimiento de eventos anteriores al desastre siempre incurre en una penalización, que va de –1 a –6, dependiendo del grado de información que se busca.',
          Ley: 'Una comprensión de las principales leyes de cada reino. El conocimiento de las leyes dentro de la región de origen de un personaje se cubre con Conocimiento General.',
          Monstruos:
            'Se divide en tipos específicos de monstruos, como demonios, hadas, gigantes, gólems, orcos o muertos vivientes.',
          Religión:
            'El estudio de las diversas deidades y su clero. Clérigos y paladines pueden usar Conocimiento General para asuntos relacionados con su propia fe.',
          Adivinanzas:
            'Los concursos de adivinanzas son una forma popular de entretenimiento entre las razas civilizadas.',
          'Artillería de Asedio':
            'Se utiliza para disparar balistas, catapultas y otras armas de asedio.',
        },
      },
    },
    edges: {
      prohibidas: [
        'As del Aire (Ace)',
        'Fondo Arcano (Arcane Background) (Psiónica, Superpoderes o Ciencia Extraña)',
        'Puntos de Poder (Power Points)',
        'Recarga Rápida (Rapid Recharge)',
        'Mago (Wizard)',
        'Drenar Alma (Soul Drain)',
        'y cualquier Ventaja que las liste como requisito.',
      ],
      alteradas: [
        'Noble',
        'Sobrecarga de Poder (Power Surge)',
        'Rico (Rich) y Muy Rico (Very Rich)',
        'Guerrero Sagrado (Holy Warrior) sufre algunos cambios y solo puede ser elegido por sacerdotes.',
        'Campeón (Champion) solo está disponible para paladines.',
        'Sanador (Healer) y Todoterreno (Jack-of-all-Trades) han sido renombradas o ajustadas y solo están disponibles como Ventajas de Discípulo (Disciple Edges).',
      ],
      nuevas: {
        trasfondo: {
          'Fondo Arcano': {
            nombre: 'Fondo Arcano (Arcane Background)',
            descripcion:
              'Los personajes que toman esta ventaja (Milagros) obtienen automáticamente la ventaja Conexiones (Connections) con respecto a la fe específica a la que pertenecen, representando acceso a la infraestructura de la fe, amigos y colegas. Esto no cuenta para los límites iniciales de Ventajas. A cambio, el héroe también obtiene la desventaja Órdenes (Orders) con respecto a la fe, lo cual no cuenta para los límites iniciales de desventajas ni otorga puntos. Solo se puede tener un Fondo Arcano.',
          },
          Biblioteca: {
            nombre: 'Biblioteca (Library)',
            requisitos:
              'Novato (Novice), debe ser Rico (Rich) o tener la Ventaja Guardián del Saber (Lorekeeper), no puede ser Analfabeto (Illiterate).',
            descripcion:
              'El héroe posee uno o más tomos de saber. Tiene puntos de bonificación para distribuir entre sus libros igual a la mitad de su dado de Astucia, con un máximo de +3 por tomo. Cada tomo debe aplicarse a una habilidad diferente.',
          },
          Lingüista: {
            nombre: 'Lingüista (Linguist)',
            requisitos:
              'Novato (Novice), Astucia d6+, no puede ser Analfabeto (Illiterate).',
            descripcion:
              'El héroe es muy educado o pertenece a una organización académica. Conoce un número de idiomas igual a su dado de Astucia durante la generación de personaje.',
          },
          Noble: {
            nombre: 'Noble',
            requisitos: 'Novato (Novice).',
            descripcion:
              'El personaje posee el título noble más bajo y gobierna una pequeña aldea o caserío. Se requiere permiso del GM para comenzar con un estatus social más alto. Los personajes de la Magocracia que tomen esta Ventaja deben tomar también el Fondo Arcano (Heahwisardry).',
          },
          'Familia Antigua': {
            nombre: 'Familia Antigua (Old Family)',
            requisitos: 'Novato (Novice), Fondo Arcano (Heahwisardry).',
            descripcion:
              'El personaje proviene de una familia antigua e influyente en la Magocracia y ha sido instruido en magia desde pequeño. Tiene +2 a las tiradas de Conocimiento (Arcanos) y comienza el juego como Mago-Barón.',
          },
          'Rico y Muy Rico': {
            nombre: 'Rico (Rich) y Muy Rico (Very Rich)',
            descripcion:
              'Rico: Comienza el juego con tres veces su dinero inicial usual y tiene un ingreso anual de 5,000 escudos de oro. Muy Rico: Comienza con cinco veces su dinero inicial usual y tiene un ingreso regular de 15,000 escudos de oro al año. En ambos casos, el jugador debe describir cómo se genera este ingreso.',
          },
          Styrimathr: {
            nombre: 'Styrimathr',
            requisitos: 'Novato (Novice), Navegación d8+.',
            descripcion:
              'El personaje posee un barco (un smabyrding sin aparejo de hielo). No otorga tripulación.',
          },
        },
        combate: {
          Valeroso: {
            nombre: 'Valeroso (Courageous)',
            requisitos: 'Novato (Novice), Agallas d8+.',
            descripcion:
              'El héroe añade +2 a todas las tiradas de Agallas y resta 2 a las tiradas en la Tabla de Pánico.',
          },
          'Doble Disparo': {
            nombre: 'Doble Disparo (Double Shot)',
            requisitos:
              'Experimentado (Seasoned), Elfo del Hogar o Elfo de la Taiga, Disparar d8+.',
            descripcion:
              'Permite a un arquero disparar dos flechas al mismo objetivo con un modificador de –2 a sus dados de Disparar. Ambas flechas impactan y causan daño normal si el ataque tiene éxito.',
          },
          'Cazagigantes Mejorado': {
            nombre: 'Cazagigantes Mejorado (Improved Giant Killer)',
            requisitos: 'Heroico (Heroic), Cazagigantes (Giant Killer).',
            descripcion:
              'En lugar de +1d6 de daño contra criaturas tres o más tamaños más grandes, el personaje puede ignorar su Armadura o Tamaño.',
          },
          'Disparo Poderoso': {
            nombre: 'Disparo Poderoso (Mighty Shot)',
            requisitos: 'Veterano (Veteran), Fuerza d8+, Disparar d10+.',
            descripcion:
              'El héroe calcula el daño con su arco como Fuerza+d6, en lugar de un 2d6 fijo.',
          },
          'Maestro de Armas de Gran Tamaño': {
            nombre: 'Maestro de Armas de Gran Tamaño (Oversized Weapon Master)',
            requisitos:
              'Veterano (Veteran), Fuerza d10+, Pelear d10+, Tamaño +0 o mayor.',
            descripcion:
              'El personaje puede usar armas cuerpo a cuerpo a dos manos con una sola mano. Puede usar una a la vez, incluso con Ambidiestro (Ambidextrous) o Dos Armas (Two-Fisted), aunque puede usar un arma de gran tamaño de esta manera y empuñar un arma estándar a una mano simultáneamente.',
          },
          Escaramuza: {
            nombre: 'Escaramuza (Scamper)',
            requisitos: 'Experimentado (Seasoned), Engro, Agilidad d8+.',
            descripcion:
              'Los oponentes de tamaño humano o más grandes restan 1 a las tiradas de ataque contra engros con esta Ventaja.',
          },
          'Muro de Escudos': {
            nombre: 'Muro de Escudos (Shieldwall)',
            requisitos:
              'Experimentado (Seasoned), Bloquear (Block), escudo mediano o grande.',
            descripcion:
              'Permite al héroe defender a un compañero adyacente usando un escudo mediano o grande. Los ataques contra el compañero sufren modificadores según el tipo de escudo.',
          },
          'Caminante de Nieve': {
            nombre: 'Caminante de Nieve (Snow Walker)',
            requisitos: 'Novato (Novice), Agilidad d6+.',
            descripcion:
              'El héroe se mueve fácilmente sobre la nieve y el hielo. En nieve, cada pulgada de movimiento cuenta como 1.5” en lugar de 2”. Trata el hielo rugoso como terreno normal y el hielo liso como hielo rugoso.',
          },
          'Romper Mejorado': {
            nombre: 'Romper Mejorado (Improved Sunder)',
            requisitos: 'Veterano (Veteran), Romper (Sunder).',
            descripcion: 'El personaje ignora 2 puntos de armadura.',
          },
          'Muro de Acero': {
            nombre: 'Muro de Acero (Wall of Steel)',
            requisitos: 'Veterano (Veteran), Agilidad d8+, Pelear d8+, Notar d8+.',
            descripcion:
              'Los oponentes no obtienen bonificación por Superioridad Numérica (Gang Up) contra el héroe.',
          },
          'Grito de Guerra': {
            nombre: 'Grito de Guerra (War Cry)',
            requisitos:
              'Experimentado (Seasoned), Enano Helado o Saxa, Intimidación d8+.',
            descripcion:
              'Permite al personaje hacer una tirada de Intimidación contra todos los objetivos en un área (Plantilla de Ráfaga Grande).',
          },
        },
        discipulo: {
          'Discípulo de Dargar': {
            nombre: 'Discípulo de Dargar (Disciple of Dargar)',
          },
          'Discípulo de Eira': { nombre: 'Discípulo de Eira (Disciple of Eira)' },
          'Discípulo de Eostre MadredelAnimales': {
            nombre:
              'Discípulo de Eostre MadredelAnimales (Disciple of Eostre Animalmother)',
          },
          'Discípulo de Eostre MadredelasPlantas': {
            nombre:
              'Discípulo de Eostre MadredelasPlantas (Disciple of Eostre Plantmother)',
          },
          'Discípulo de Ertha': {
            nombre: 'Discípulo de Ertha (Disciple of Ertha)',
          },
          'Discípulo de Freo': {
            nombre: 'Discípulo de Freo (Disciple of Freo)',
          },
          'Discípulo de Hela': {
            nombre: 'Discípulo de Hela (Disciple of Hela)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Milagros), Astucia d8+, Fe d8+, Conocimiento (Arcanos) d6+, seguidor de Hela.',
            descripcion:
              'Gana +1 a todas las tiradas de Fe. Además, si el clérigo obtiene dos raises en su Fe al lanzar el hechizo zombie o zombie mayor, los muertos vivientes son permanentes y permanecen activos hasta ser destruidos.',
          },
          'Discípulo de Hoenir': {
            nombre: 'Discípulo de Hoenir (Disciple of Hoenir)',
          },
          'Discípulo de Hothar': {
            nombre: 'Discípulo de Hothar (Disciple of Hothar)',
          },
          'Discípulo de Kenaz': {
            nombre: 'Discípulo de Kenaz (Disciple of Kenaz)',
          },
          'Discípulo de Maera': {
            nombre: 'Discípulo de Maera (Disciple of Maera)',
          },
          'Discípulo de Neorthe': {
            nombre: 'Discípulo de Neorthe (Disciple of Neorthe)',
          },
          'Discípulo de Niht': {
            nombre: 'Discípulo de Niht (Disciple of Niht)',
          },
          'Discípulo de las Nornas': {
            nombre: 'Discípulo de las Nornas (Disciple of The Norns)',
          },
          'Discípulo de Rigr': {
            nombre: 'Discípulo de Rigr (Disciple of Rigr)',
          },
          'Discípulo de Scaetha': {
            nombre: 'Discípulo de Scaetha (Disciple of Scaetha)',
          },
          'Discípulo de Sigel': {
            nombre: 'Discípulo de Sigel (Disciple of Sigel)',
          },
          'Discípulo de Thrym': {
            nombre: 'Discípulo de Thrym (Disciple of Thrym)',
          },
          'Discípulo de Thunor': {
            nombre: 'Discípulo de Thunor (Disciple of Thunor)',
          },
          'Discípulo de Tiw': {
            nombre: 'Discípulo de Tiw (Disciple of Tiw)',
          },
          'Discípulo de Ullr': {
            nombre: 'Discípulo de Ullr (Disciple of Ullr)',
          },
          'Discípulo del Inconocible': {
            nombre:
              'Discípulo del Inconocible (Disciple of The Unknowable One)',
          },
          'Discípulo de Vali': {
            nombre: 'Discípulo de Vali (Disciple of Vali)',
          },
          'Discípulo de Var': {
            nombre: 'Discípulo de Var (Disciple of Var)',
          },
        },
        liderazgo: {
          'Unos Cuantos Hombres Buenos': {
            nombre: 'Unos Cuantos Hombres Buenos (A Few Good Men)',
            requisitos:
              'Heroico (Heroic), Astucia d8+, Conocimiento (Batalla) d10+, Mando (Command), Inspirar (Inspire).',
            descripcion:
              'Solo para Batallas Masivas. El personaje añade un token al total de su ejército.',
          },
          'Presencia de Mando': {
            nombre: 'Presencia de Mando (Command Presence)',
            requisitos: 'Novato (Novice), Mando (Command).',
            descripcion:
              'El héroe tiene un "radio de mando" de 10” en lugar de 5”.',
          },
          'Fuego Coordinado': {
            nombre: 'Fuego Coordinado (Coordinated Firepower)',
            requisitos:
              'Veterano (Veteran), Astucia d6+, Disparar d8+, Lanzar d8+, Mando (Command).',
            descripcion:
              'Las tropas de misiles dentro del radio de mando del héroe pueden disparar como una unidad única en la acción del héroe.',
          },
          '¡Grita Estragos!': {
            nombre: '¡Grita Estragos! (Cry Havoc!)',
            requisitos:
              'Veterano (Veteran), Espíritu d8+, Conocimiento (Batalla) d10+, Mando (Command), Fervor (Fervor).',
            descripcion:
              'Solo para Batallas Masivas. Una vez por batalla, el personaje puede declarar una carga, y si tiene éxito y supera al oponente, el enemigo pierde un token extra.',
          },
          'Muerte Antes que la Deshonra': {
            nombre: 'Muerte Antes que la Deshonra (Death Before Dishonor)',
            requisitos:
              'Veterano (Veteran), Espíritu d8+, Conocimiento (Batalla) d8+, Mando (Command), Mantener la Línea (Hold the Line).',
            descripcion:
              'Solo para Batallas Masivas. El personaje gana +2 a las tiradas de Espíritu al tirar por Moral en una Batalla Masiva.',
          },
          Fanatismo: {
            nombre: 'Fanatismo (Fanaticism)',
            requisitos:
              'Experimentado (Seasoned), Mando (Command), Fervor (Fervor).',
            descripcion:
              'Las tropas bajo el mando de un personaje con esta Ventaja añaden +2 a sus tiradas de Agallas y restan 2 a las tiradas en la Tabla de Pánico.',
          },
          Rompeasedios: {
            nombre: 'Rompeasedios (Siege Breaker)',
            requisitos:
              'Experimentado (Seasoned), Astucia d8+, Conocimiento (Batalla) d8+.',
            descripcion:
              'Solo para Batallas Masivas. Reduce la Bonificación de Asedio de cualquier fortificación que su ejército esté atacando en 1 (mínimo cero).',
          },
          'Mentalidad de Asedio': {
            nombre: 'Mentalidad de Asedio (Siege Mentality)',
            requisitos:
              'Experimentado (Seasoned), Astucia d8+, Conocimiento (Batalla) d8+.',
            descripcion:
              'Solo para Batallas Masivas. Aumenta la Bonificación de Asedio de cualquier fortificación que defienda en +1.',
          },
          Táctico: {
            nombre: 'Táctico (Tactician)',
            requisitos:
              'Wild Card, Experimentado (Seasoned), Astucia d8+, Conocimiento (Batalla) d6+, Mando (Command).',
            descripcion:
              'Al inicio de un combate, el héroe hace una tirada de Conocimiento (Batalla) y por cada éxito y raise recibe una carta de iniciativa adicional.',
          },
        },
        legendarias: {
          Seguidores: {
            nombre: 'Seguidores (Followers)',
            descripcion:
              'Esta Ventaja permanece inalterada de las reglas de Savage Worlds, pero requiere clarificaciones para este escenario. Los seguidores deben estar directamente relacionados con el rol del héroe y no todos necesitan ser soldados. Los seguidores no pueden tener Fondo Arcano.',
          },
          Compañero: {
            nombre: 'Compañero (Sidekick)',
            descripcion:
              'Esta Ventaja permanece inalterada de las reglas de Savage Worlds, pero requiere clarificaciones para este escenario. El compañero debe estar directamente relacionado con el rol del héroe.',
          },
        },
        poder: {
          Alquimia: {
            nombre: 'Alquimia (Alchemy)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Cualquiera), habilidad arcana d6+, Conocimiento (Alquimia) d6+.',
            descripcion:
              'Permite la creación de dispositivos alquímicos (pociones, pergaminos, varitas de un solo uso, etc.) que contienen hechizos del repertorio del alquimista.',
          },
          'Aumento de Bastón': {
            nombre: 'Aumento de Bastón (Augment Staff)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Heahwisardry), Heahwisardry d8+, Conocimiento (Arcanos) d8+.',
            descripcion:
              'Un Heahwisard puede encantar su bastón con una de las siguientes habilidades: Aura (Oscurece sombras para +2 a Intimidación, o proyecta calma para +2 a Persuasión), Daño (El daño del bastón aumenta a Fuerza+d6 y AP 1. Puede tomarse dos veces, llegando a Fuerza+d8 y AP 2), Desviar (Los ataques a distancia contra el mago tienen –1 de penalización. Si se toma de nuevo, la penalización es –2), o Almacenar Hechizo (Un hechizo conocido puede ser almacenado en el bastón, obteniendo +2 a la tirada de habilidad arcana al lanzarlo).',
          },
          'Combinar Hechizos': {
            nombre: 'Combinar Hechizos (Combine Spells)',
            requisitos:
              'Heroico (Heroic), Fondo Arcano (Cualquiera), habilidad arcana d10+, Conocimiento (Arcanos) d10+.',
            descripcion:
              'El personaje puede lanzar dos hechizos diferentes que conoce simultáneamente al mismo objetivo, con una sola tirada de habilidad arcana.',
          },
          Concentración: {
            nombre: 'Concentración (Concentration)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Cualquiera), Astucia d6+, Espíritu d6+, Vigor d6+.',
            descripcion:
              'El héroe tiene +2 para resistir la interrupción de cualquier fuente.',
          },
          'Concentración Mejorada': {
            nombre: 'Concentración Mejorada (Improved Concentration)',
            requisitos: 'Veterano (Veteran), Concentración (Concentration).',
            descripcion: 'El bono de resistencia a la interrupción aumenta a +4.',
          },
          'Maestría Elemental': {
            nombre: 'Maestría Elemental (Elemental Mastery)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Elementalismo).',
            descripcion:
              'Después de alcanzar Experimentado, un elementalista puede aprender un nuevo elemento. Cada elemento adicional resta 1 a todas las tiradas de Elementalismo. Un Arkhwisard (que ha dominado los cuatro elementos) no sufre penalizaciones.',
          },
          Foco: {
            nombre: 'Foco (Focus)',
            requisitos:
              'Experimentado (Seasoned), Fondo Arcano (Cualquiera), Espíritu d6+, habilidad arcana d8+.',
            descripcion:
              'Si el personaje es Sacudido (Shaken) por fallar al invocar un hechizo o por la Tabla de Sifonamiento (Siphoning Table), obtiene una tirada inmediata de Espíritu a –2 para recuperarse.',
          },
          'Foco Mejorado': {
            nombre: 'Foco Mejorado (Improved Focus)',
            requisitos: 'Heroico (Heroic), Foco (Focus).',
            descripcion:
              'La tirada de recuperación no incurre en la penalización de –2.',
          },
          Hellfreeze: {
            nombre: 'Hellfreeze',
            requisitos:
              'Veterano (Veteran), Fondo Arcano (Cualquiera que permita efectos de frío, fuego frío o hielo), habilidad arcana d10+, Conocimiento (Arcanos) d10+.',
            descripcion:
              'Los hechizos dañinos del personaje con efectos de frío, fuego frío o hielo causan daño normal contra criaturas con Resistencia (Frío) y la mitad de daño contra criaturas con Inmunidad (Frío).',
          },
          'Percepción Rúnica': {
            nombre: 'Percepción Rúnica (Runic Insight)',
            requisitos:
              'Novato (Novice), Fondo Arcano (Magia Rúnica), Conocimiento (Arcanos) d8+, habilidad de runa específica d8+.',
            descripcion:
              'El héroe es particularmente hábil con una runa. Al lanzar cualquiera de los tres hechizos asociados con la runa, gana +1 a su dado de habilidad arcana.',
          },
          'Sutileza de Hechizo': {
            nombre: 'Sutileza de Hechizo (Spell Finesse)',
            requisitos:
              'Novato (Novice), Fondo Arcano (Cualquiera excepto Magia Rúnica), habilidad arcana d8+, Conocimiento (Arcanos) d8+.',
            descripcion:
              'El héroe es particularmente hábil con un hechizo. Cada vez que toma esta Ventaja, puede elegir una de las opciones y aplicarla a un hechizo que conozca: Arcana (Aumenta su Wild Die de habilidad arcana) o Selectiva (Al lanzar un hechizo con efecto de plantilla, el lanzador decide quiénes son afectados y quiénes no, hasta un máximo de la mitad de su dado de habilidad arcana).',
          },
        },
        profesionales: {
          Porra: {
            nombre: 'Porra (Bludgeoner)',
            requisitos:
              'Novato (Novice), Engro, Espíritu d8+, Fuerza d6+, Intimidación d6+, Disparar d8+.',
            descripcion:
              'Los Porras aumentan el alcance de una honda según su Rango de personaje. Las hondas infligen Fuerza+d6 de daño a corto alcance. Tienen +1 a Carisma al tratar con engros.',
          },
          'Legionario Gris': {
            nombre: 'Legionario Gris (Gray Legionary)',
            requisitos:
              'Novato (Novice), Espíritu d8+, Vigor d8+, Pelear d8+, Disparar o Lanzar d6+, no tener familia ni responsabilidades fuera de la Legión.',
            descripcion:
              'Los Legionarios Grises no temen a la muerte y son inmunes a Intimidación y Miedo.',
          },
          'Ladrón de Gremio': {
            nombre: 'Ladrón de Gremio (Guild Thief)',
            requisitos:
              'Novato (Novice), Ladrón (Thief), debe conocer el lenguaje de señas (Fingerspeak).',
            descripcion:
              'Un Ladrón de Gremio obtiene +2 a las tiradas de Callejear (Streetwise) dentro de su país de origen. Gana un Wild Die d8 con Trepar (Climbing), Abrir Cerraduras (Lockpicking) o Sigilo (Stealth) (este último solo en entornos urbanos).',
          },
          'Caballero del Hogar': {
            nombre: 'Caballero del Hogar (Hearth Knight)',
            requisitos:
              'Novato (Novice), Espíritu d8+, Vigor d8+, Pelear d6+, Montar d6+, Supervivencia d8+.',
            descripcion:
              'Tienen +1 a Parada (Parry) y +2 a las tiradas de ataque al hacer Disparos Apuntados (Called Shots) contra monstruos con Inmunidad (Frío) o Resistencia (Frío). También tienen +2 a Supervivencia cuando la temperatura es bajo cero.',
          },
          'Magia de Setos': {
            nombre: 'Magia de Setos (Hedge Magic)',
            requisitos:
              'Novato (Novice), Astucia d8+, Conocimiento (Alquimia) d6+, Supervivencia d6+.',
            descripcion:
              'El héroe sabe cómo identificar plantas específicas y convertirlas en remedios herbales.',
          },
          'Guerrero Sagrado/Impío': {
            nombre: 'Guerrero Sagrado/Impío (Holy/Unholy Warrior)',
            requisitos:
              'Novato (Novice), Fondo Arcano (Milagros), Espíritu d8+, Fe d6+.',
            descripcion:
              'Si el héroe falla la tirada de Fe, es Sacudido (Shaken). Si saca un 1 en su dado de Fe, sufre un nivel de Fatiga.',
          },
          'Miembro del Gremio de Hierro': {
            nombre: 'Miembro del Gremio de Hierro (Iron Guilder)',
            requisitos: 'Novato (Novice), Fuerza d8+, Espíritu d6+, Pelear d6+.',
            descripcion:
              'El héroe obtiene un +1 adicional al hacer un Ataque por Superioridad Numérica (Ganging Up), aumentando el bono máximo a +5 solo para él. Comienza con una cota de malla, espada larga y escudo mediano, pagados por el Gremio.',
          },
          'Caballero Hrafn': {
            nombre: 'Caballero Hrafn (Knight Hrafn)',
            requisitos:
              'Novato (Novice), Astucia d6+, Espíritu d6+, Conocimiento (Batalla) d8+, Mando (Command), otra Ventaja de Liderazgo.',
            descripcion:
              'El personaje gana +1” a su “radio de mando” por Rango de personaje. Tiene +1 a todas las tiradas de Conocimiento (Batalla) y puede ignorar los requisitos de Rango al tomar Ventajas de Liderazgo.',
          },
          'Guardián del Saber': {
            nombre: 'Guardián del Saber (Lorekeeper)',
            requisitos:
              'Novato (Novice), Astucia d8+, Investigación d6+, no puede ser Analfabeto (Illiterate).',
            descripcion:
              'Los Guardianes del Saber tienen la custodia de una pequeña colección de pergaminos. Tienen +2 a las tiradas de Conocimiento General y Conocimiento relacionadas con reliquias (como Folklore o Historia).',
          },
          Reliquus: {
            nombre: 'Reliquus (Reliquary (Reliqus))',
            requisitos:
              'Novato (Novice), Agilidad d8+, Abrir Cerraduras d6+, Notar d6+.',
            descripcion:
              'El héroe gana +2 a Notar al buscar trampas y puertas ocultas, y +2 a las tiradas para desactivarlas. Nunca es Sorprendido por una trampa.',
          },
          'Guardián de Caminos': {
            nombre: 'Guardián de Caminos (Roadwarden)',
            requisitos:
              'Novato (Novice), Vigor d6+, Pelear d8+, Montar d6+, Supervivencia d6+, Rastrear d6+.',
            descripcion:
              'Un Guardián de Caminos obtiene +2 a todas las tiradas de Supervivencia y Rastrear. Además, obtiene +2 a las tiradas de Notar para detectar emboscadas, trampas y armas ocultas.',
          },
          'Hermana de la Misericordia': {
            nombre: 'Hermana de la Misericordia (Sister of Mercy)',
            requisitos:
              'Novato (Novice), Curar d8+, debe ser mujer, debe tener una Desventaja Pacifista.',
            descripcion:
              'Las Hermanas ganan +2 a las tiradas de Curar y +1 a Carisma.',
          },
          'Guardián del Bosque': {
            nombre: 'Guardián del Bosque (Wood Warden)',
            requisitos:
              'Novato (Novice), Disparar d8+, Fondo Arcano (Druidismo) o Ventaja Leñador (Woodsman Edge).',
            descripcion:
              'Los miembros son enseñados a hablar con bestias mundanas y aprenden el poder Amigo Bestia (beast friend).',
          },
        },
        sociales: {
          'Maestro Narrador': {
            nombre: 'Maestro Narrador (Master Storyteller)',
            requisitos:
              'Experimentado (Seasoned), Astucia d8+, Conocimiento (Folklore) d8+, Persuasión d8+.',
            descripcion:
              'Al usar las reglas de Premios de Gloria Variables, los personajes tiran d8 en lugar de d6 si este héroe relata sus hazañas. La fiesta no sufre penalizaciones a la Gloria si el narrador tiene un fracaso crítico.',
          },
          'Narrador Legendario': {
            nombre: 'Narrador Legendario (Legendary Storyteller)',
            requisitos: 'Heroico (Heroic), Maestro Narrador (Master Storyteller).',
            descripcion:
              'La fiesta gana +1d8 de Gloria por cada raise después de la primera al usar los Premios de Gloria Variables.',
          },
        },
        wild_card: {
          'Sobrecarga de Poder': {
            nombre: 'Sobrecarga de Poder (Power Surge)',
            requisitos:
              'Wild Card, Experimentado (Seasoned), Fondo Arcano (Cualquiera), habilidad arcana d10+.',
            descripcion:
              'El personaje duplica su daño total al hacer un ataque con habilidad arcana exitoso en ese turno.',
          },
        },
      },
    },
    hindrances: {
      'Aprendiz/Novicio': {
        nombre: 'Aprendiz/Novicio (Apprentice/Novitiate)',
        nivel: 'Menor/Mayor',
        descripcion:
          'Un héroe debe tener una Ventaja de Fondo Arcano. Menor: El héroe no puede comenzar el juego con una habilidad arcana superior a d6. Mayor: El personaje tiene un poder inicial menos de lo normal para su Fondo Arcano. Los magos rúnicos comienzan con una runa, pero tienen un límite de habilidad arcana de d4.',
      },
      'Oveja Negra': {
        nombre: 'Oveja Negra (Black Sheep)',
        nivel: 'Menor',
        descripcion:
          'Solo los héroes de la Magocracia pueden tomar esta desventaja. El héroe es un noble de la Magocracia que ha rechazado la heahwisardry, lo que llevó a su exclusión familiar y ostracismo. Sufre un –2 de penalización a Carisma al tratar con heahwisards. No puede tomar las Ventajas Fondo Arcano (Heahwisardry), Noble o Rico durante la generación de personaje.',
      },
      'Sangre Fría': {
        nombre: 'Sangre Fría (Cold Blooded)',
        nivel: 'Menor',
        descripcion:
          'El héroe tiene –2 a las tiradas de Vigor para resistir los efectos del clima frío.',
      },
      'Maldito por los Dioses': {
        nombre: 'Maldito por los Dioses (God Cursed)',
        nivel: 'Mayor',
        descripcion:
          'Tus acciones pasadas han ofendido a uno de los dioses. Los hechizos beneficiosos lanzados por clérigos de ese dios fallan automáticamente, y los hechizos dañinos causan +2 de daño extra. Los hechizos opuestos lanzados por el sacerdote obtienen un +2 de bonificación para afectarte.',
      },
      'Prohibición Mágica': {
        nombre: 'Prohibición Mágica (Magic Forbiddance)',
        nivel: 'Mayor',
        descripcion:
          'El héroe no tiene lazos con las energías mágicas del mundo. No puede detectar reliquias legendarias al tocarlas, ni gastar un benny para usarlas. No puede beber pociones ni leer pergaminos. No puede tomar ninguna Ventaja de Fondo Arcano (Magia).',
      },
      'Debilidad Nigromántica': {
        nombre: 'Debilidad Nigromántica (Necromantic Weakness)',
        nivel: 'Menor/Mayor',
        descripcion:
          'El personaje es muy susceptible a los ataques de los muertos vivientes. Menor: –2 a las tiradas de rasgo para resistir ataques especiales sobrenaturales de criaturas no muertas. Mayor: La penalización sube a –4.',
      },
      Órdenes: {
        nombre: 'Órdenes (Orders)',
        nivel: 'Menor',
        descripcion:
          'El personaje sirve a otro poder y se espera que siga órdenes cuando se le den. Puede ser un agente de un noble, un soldado del Gremio de Hierro o un mercenario bajo contrato.',
      },
    },
    conjuros: {
      aim: {
        nombre: 'Apuntar (Aim)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Mano fantasmal', 'Ráfaga de viento', 'Rastro de fuego'],
        efecto:
          'El objetivo obtiene +2 a sus tiradas de Disparar o Lanzar; con un raise, el bono aumenta a +4. El bono no se aplica a Armas Pesadas [14, 15].',
      },
      'altered_senses': {
        nombre: 'Sentidos Alterados (Altered Senses)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Ojos de animal', 'Brillo'],
        efecto:
          'El objetivo gana Infravision o Visión en Baja Luz (elegido por el lanzador); con un raise, obtiene ambos (sin penalizaciones en Iluminación tenue u oscura, y -3 en Oscuridad Total contra objetivos que producen calor) [15, 16].',
      },
      'analyze_foe': {
        nombre: 'Analizar Enemigo (Analyze Foe)',
        rango: 'Experimentado',
        alcance: 'Visión',
        duracion: 'Instantáneo',
        trappings: ['Gestos', 'Palabras susurradas', 'Mirada fija'],
        efecto:
          'Con un éxito, el personaje discierne el número de Ventajas y Desventajas o habilidades especiales de un objetivo, así como el tipo de dado de su habilidad de ataque más alta. Con un raise, conoce los nombres de todas las Ventajas, Desventajas y habilidades especiales, y el dado de habilidad de ataque del objetivo. No afecta al objetivo ni permite tirada para resistir [16-19].',
      },
      'animate_war_tree': {
        nombre: 'Animar Árbol de Guerra (Animate War Tree)',
        rango: 'Heroico',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Hojas y ramas se animan'],
        efecto:
          'Anima un árbol para que se convierta en un árbol de guerra [19-21]. (Descripción detallada de la criatura no incluida en las fuentes dadas).',
      },
      'arcane_resistance': {
        nombre: 'Resistencia Arcana (Arcane Resistance)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: [
          'Runas o glifos en la piel',
          'Brillo tenue',
          'Ojos que brillan rojo, amarillo o negro',
        ],
        efecto:
          'El objetivo obtiene los beneficios de la Ventaja Resistencia Arcana (+2); con un raise, obtiene la versión Mejorada (+4). Los beneficios no se acumulan si el objetivo ya tiene estas Ventajas [19, 22].',
      },
      aura: {
        nombre: 'Aura',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: [
          'Frío',
          'Fuego frío',
          'Energía divina',
          'Electricidad',
          'Fuego',
          'Calor',
        ],
        efecto:
          'Al final del movimiento del objetivo, todos los personajes adyacentes sufren 2d6 de daño. Afecta a amigos y enemigos por igual. El objetivo del conjuro no se ve afectado por el aura [19, 23].',
      },
      banish: {
        nombre: 'Desterrar (Banish)',
        rango: 'Veterano',
        alcance: 'Espíritu',
        duracion: 'Instantáneo',
        trappings: ['Gesto arcano', 'Liturgia', 'Abre portal'],
        efecto:
          'Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito y superando la tirada del objetivo, la criatura es devuelta a su reino. Solo afecta a criaturas con habilidades especiales de Demonio, Elemental o Etéreo [19, 23, 24].',
      },
      'battle_song': {
        nombre: 'Canto de Batalla (Battle Song)',
        rango: 'Experimentado',
        alcance:
          'Especial (Plantilla de Ráfaga Mediana centrada en el lanzador)',
        duracion: 'Mantenido',
        trappings: ['Poesía', 'Canto de batalla'],
        efecto:
          'Toda criatura dentro de una Plantilla de Ráfaga Mediana (excepto el lanzador) obtiene la Ventaja Berserk. Con un raise, las víctimas entran en Berserk inmediatamente. Las víctimas no dispuestas pueden hacer una tirada de Espíritu opuesta por la habilidad arcana del lanzador para resistir. Afecta a amigos y enemigos. Con una penalización de -2 a la tirada de habilidad arcana, el área aumenta a una Plantilla de Ráfaga Grande [19, 25, 26].',
      },
      'beast_friend': {
        nombre: 'Amigo Bestia (Beast Friend) (ALTERADO)',
        rango: 'Novato',
        alcance: 'Inteligencia x 100 yardas',
        duracion: 'Mantenido',
        trappings: ['El mago se concentra y gesticula con las manos'],
        efecto:
          'Permite al mago hablar con y guiar las acciones de bestias de inteligencia animal. No funciona con humanoides, ni animales conjurados, mágicos o "antinaturales". El tamaño de la bestia impone una penalización acumulativa de -1 por cada +2 puntos de Tamaño positivo (redondeando hacia arriba). Enjambres pequeños no dan penalización, medianos -1, grandes -2 [26-28].',
      },
      becalm: {
        nombre: 'Calmar (Becalm)',
        rango: 'Novato',
        alcance: 'Visión',
        duracion: 'Mantenido',
        trappings: [
          'El lanzador se para en cubierta y aspira aire',
          'Vientos tranquilos',
        ],
        efecto:
          'Un barco objetivo (solo uno) reduce a la mitad su Aceleración y Velocidad Máxima. Quienes estén a bordo de dicho barco obtienen +2 a las tiradas de Navegación durante tormentas [27-29].',
      },
      bladebreaker: {
        nombre: 'Rompehojas (Bladebreaker)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: 'Instantáneo',
        trappings: [
          'El arma se oxida',
          'Se parte por la mitad',
          'Se convierte en agua/hielo y se rompe',
          'Desaparece en una nube de humo',
        ],
        efecto:
          'Destruye un arma dentro del rango. Conjuro opuesto (habilidad arcana vs dado de daño del arma). Con un éxito, el arma se destruye permanentemente. Las reliquias tienen una bonificación a su tirada igual a cualquier modificador de tirada de ataque base, además de los bonos por dado de daño superior [28-30].',
      },
      blast: {
        nombre: 'Explosión (Blast) (ALTERADO)',
        rango: 'Experimentado',
        alcance: '24/48/96',
        duracion: 'Instantáneo',
        trappings: [
          'Bolas de fuego/hielo/luz/oscuridad',
          'Rayos de colores',
          'Enjambre de insectos',
        ],
        efecto:
          'Daño de 2d6 en una Plantilla de Ráfaga Mediana. Si la tirada falla, la explosión se desvía como un proyectil lanzado. Con una penalización de -1 a la tirada de lanzamiento, el daño es 3d6 o el tamaño aumenta a una Plantilla de Ráfaga Grande. Con -2 de penalización, hace ambas cosas [28, 30, 31].',
      },
      'bless_panic': {
        nombre: 'Bendecir/Pánico (Bless/Panic)',
        rango: 'Experimentado',
        alcance: 'Espíritu',
        duracion: 'Mantenido',
        trappings: ['Oración', 'Palabras de aliento'],
        efecto:
          'Con Bendecir, cada aliado del lanzador en rango gana +2 a las tiradas de Agallas, +4 con un raise. Pánico reduce las Agallas de todos los enemigos en rango en una cantidad similar [28, 31, 32].',
      },
      bodyguard: {
        nombre: 'Guardaespaldas (Bodyguard)',
        rango: 'Novato',
        alcance: 'Casilla adyacente',
        duracion: 'Especial',
        trappings: ['Soldado modelo'],
        efecto:
          'Invoca un guardaespaldas robusto, totalmente bajo el control del héroe. Con un raise, el guardaespaldas es un Wild Card. El guardaespaldas se desmorona en polvo cuando es herido. Cuesta 10 gs por figura [28, 32, 33]. (Descripción de las estadísticas del guardaespaldas incluida en la fuente).',
      },
      bridge: {
        nombre: 'Puente (Bridge)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: [
          'Sólida pasarela de madera',
          'Pilar de piedra o hielo',
          'Muro de agua',
        ],
        efecto:
          'Crea un puente, cada sección cubre 2 yardas [28]. (Detalles adicionales no proporcionados en las fuentes).',
      },
      'champion_of_the_faith': {
        nombre: 'Campeón de la Fe (Champion of the Faith)',
        rango: 'Experimentado',
        alcance: 'Personal',
        duracion: 'Mantenido',
        trappings: ['Aura sagrada'],
        efecto:
          'El lanzador obtiene los beneficios de la Ventaja Campeón o Guerrero Sagrado (elegido al lanzar). No se acumula si el objetivo ya tiene la Ventaja [28, 34].',
      },
      'charismatic_aura': {
        nombre: 'Aura Carismática (Charismatic Aura)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: [
          'Voz de mando',
          'Mirada intensa',
          'Personalidad encantadora',
        ],
        efecto:
          'El objetivo gana +1 de Carisma con un éxito o +2 con un raise [28, 34, 35].',
      },
      confusion: {
        nombre: 'Confusión (Confusion)',
        rango: 'Experimentado',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: ['Mirada aturdida', 'Pérdida de coordinación'],
        efecto:
          'Conjuro opuesto (habilidad arcana vs Astucia del objetivo). Con un éxito, la víctima pierde concentración y coordinación, sufriendo -2 a sus tiradas de rasgo durante la duración, -4 con un raise [28, 35].',
      },
      'corpse_senses': {
        nombre: 'Sentidos Cadavéricos (Corpse Senses)',
        rango: 'Experimentado',
        alcance: 'Astucia x 100 yardas',
        duracion: 'Mantenido',
        trappings: ['Canto', 'Mirar fijamente a un espejo', 'Concentración'],
        efecto:
          'El lanzador usa los sentidos de un cadáver animado por él mismo. No tiene control sobre el cadáver ni puede hablar a través de él. La conexión se rompe si el cadáver se sale del rango [36, 37].',
      },
      'detect_conceal': {
        nombre: 'Detectar/Ocultar (Detect/Conceal) (ALTERADO)',
        rango: 'Novato',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: ['Palabras susurradas', 'Gestos', "Sonido de 'ping'"],
        efecto:
          'Reemplaza a `detectar/ocultar arcana`. Al detectar, el lanzador debe nombrar el tipo de objeto que busca (arcano, trampas, puertas secretas, oro o algo específico como un orco). Con -2 a la tirada, los objetos se vuelven visibles para cualquiera. Para "ocultar", funciona como `ocultar arcana` estándar [37-40].',
      },
      disease: {
        nombre: 'Enfermedad (Disease)',
        rango: 'Experimentado',
        alcance: 'Espíritu',
        duracion: 'Especial',
        trappings: ['Tos', 'Pústulas', 'Fiebre', 'Enfermedad debilitante'],
        efecto:
          'Conjuro opuesto (Fe vs Vigor de la víctima). Con un éxito, la víctima desarrolla una enfermedad y sufre un nivel automático de Fatiga. Cada semana, debe hacer una tirada de Vigor (con -2 si el lanzador obtuvo un raise) o sufrir otro nivel de Fatiga (puede llevar a la Muerte). La Fatiga se recupera un nivel por día. Curación puede eliminar la enfermedad [37, 40, 41].',
      },
      'elemental_form': {
        nombre: 'Forma Elemental (Elemental Form)',
        rango: 'Veterano',
        alcance: 'Personal',
        duracion: 'Mantenido',
        trappings: ['La naturaleza física cambia al elemento apropiado'],
        efecto:
          'El lanzador convierte su propio cuerpo en materia elemental. Los elementalistas con varios elementos conocen el conjuro para todas sus escuelas [37, 41-43]. (Descripción de los beneficios específicos de la forma elemental no incluida en las fuentes).',
      },
      'energy_immunity': {
        nombre: 'Inmunidad a la Energía (Energy Immunity)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Aura protectora', 'Piel metálica', 'Burbuja de agua/aire'],
        efecto:
          'Protege contra un elemento o trapping específico. El objetivo sufre la mitad de daño del elemento con un éxito, o inmunidad total con un raise [37, 42]. (Detalles de los elementos cubiertos pueden variar según el tipo de elementalista [43]).',
      },
      'enhance_undead': {
        nombre: 'Mejorar No Muertos (Enhance Undead)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: 'Especial',
        trappings: ['Piel pálida', 'Garras', 'Colmillos'],
        efecto:
          'Otorga una Ventaja (Edge) a un no muerto dentro del rango, siempre que el no muerto cumpla los requisitos de Rango. Afecta a un no muerto; cada no muerto adicional después del primero otorga una penalización acumulativa de -1 a la tirada. Los no muertos permanecen mejorados durante 1 hora con un éxito, 1d6 horas con un raise, o un día entero con dos raises [37, 42, 44].',
      },
      entangle: {
        nombre: 'Enmarañar (Entangle) (ALTERADO)',
        rango: 'Novato',
        alcance: 'Astucia',
        duracion: 'Especial',
        trappings: ['Bomba de pegamento', 'Enredaderas', 'Esposas', 'Telarañas'],
        efecto:
          'Conjuro opuesto (habilidad arcana vs Agilidad del objetivo). Éxito: el objetivo sufre -2 a Paso y habilidades ligadas a Agilidad/Fuerza. Raise: el objetivo está completamente inmovilizado. Los enmarañados pueden intentar liberarse con tiradas de Fuerza o Agilidad. Un -1 de penalización a la tirada de habilidad arcana afecta a todos en una Plantilla de Ráfaga Mediana o a una criatura Grande. Con -2, afecta a todos en una Plantilla de Ráfaga Grande o a una criatura Enorme [37, 44, 45].',
      },
      'etherealness_corporealness': {
        nombre: 'Eterealidad/Corporeidad (Etherealness/Corporealness)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: ['Forma espectral', 'Translúcido', 'Se convierte en forma elemental'],
        efecto:
          'Con un éxito, el usuario se vuelve etéreo, incapaz de afectar el mundo material y el mundo material incapaz de afectarle (excepto la magia). Si se vuelve corpóreo "dentro" de alguien/algo, ambos sufren daño. La corporeidad elimina la Habilidad Especial Etéreo de una criatura etérea [37, 45-48].',
      },
      farsight: {
        nombre: 'Visión Lejana (Farsight)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Los ojos se vuelven de animal', 'Brillan'],
        efecto:
          'El objetivo recibe +2 a las tiradas de Notar dentro de su Astucia x 2, +4 con un raise. Puede discernir pequeños detalles hasta a 5 millas y figuras individuales hasta a 10 millas (sin detalles específicos como raza o sexo) [47-49].',
      },
      fatigue: {
        nombre: 'Fatiga (Fatigue)',
        rango: 'Experimentado',
        alcance: '12/24/48',
        duracion: 'Instantáneo',
        trappings: [
          'La víctima se ahoga',
          'Energía sifonada por un canto fúnebre',
          'La temperatura desciende',
        ],
        efecto:
          'Afecta a una Plantilla de Ráfaga Mediana (Grande con un raise). Cada personaje en la plantilla debe hacer una tirada de Vigor opuesta por la habilidad arcana del lanzador. Con un fallo, sufre un nivel de Fatiga (hasta Agotado). La Fatiga se recupera a razón de un nivel cada 5 minutos de descanso [48-50].',
      },
      feast: {
        nombre: 'Banquete (Feast)',
        rango: 'Novato',
        alcance: 'Espíritu',
        duracion: 'Instantáneo',
        trappings: [
          'La comida aparece de la nada',
          'Bayas crecen en arbustos',
          'Animales de caza aparecen',
        ],
        efecto:
          'Invoca 5 libras de comida básica (no agua) por Rango de personaje del lanzador. La comida no puede ser invocada dentro de un objeto. Cualquier comida no consumida antes de la medianoche se echa a perder [48, 50, 51].',
      },
      'fog_cloud': {
        nombre: 'Nube de Niebla (Fog Cloud)',
        rango: 'Veterano',
        alcance: 'Personal (1 milla por Rango del personaje)',
        duracion: 'Mantenido',
        trappings: ['La niebla surge del suelo'],
        efecto:
          'Crea un área de niebla alrededor del lanzador. Reduce la calidad de iluminación en un paso (hacia Oscuridad Total), dos pasos con un raise. El lanzador sufre las penalizaciones cuando está dentro de la niebla [48, 51, 52].',
      },
      'fortunes_favored': {
        nombre: 'Favorecido por la Fortuna (Fortune\'s Favored)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: [
          'La víctima brilla brevemente',
          'Capta destellos de eventos futuros',
          'Simplemente suerte',
        ],
        efecto:
          'Con un éxito, un objetivo que gasta un benny y falla el relanzamiento, puede hacer otro relanzamiento inmediato sin gastar un benny adicional. Solo se permite una tirada gratuita por benny [48, 52, 53].',
      },
      'gift_of_battle': {
        nombre: 'Don de Batalla (Gift of Battle)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Grito de guerra', 'Discurso de aliento', 'Percepción táctica'],
        efecto:
          'El objetivo gana una Ventaja de Liderazgo con un éxito o dos con un raise, ignorando los requisitos de Rango, pero no otros requisitos de Ventajas [48, 53-55].',
      },
      glyph: {
        nombre: 'Glifo (Glyph)',
        rango: 'Veterano',
        alcance: 'Especial',
        duracion: 'Especial',
        trappings: ['Glifo dibujado o inscrito'],
        efecto:
          'Almacena un conjuro para activarlo bajo un desencadenante predeterminado (máximo 10 palabras/2 cláusulas). Requiere Combinar Conjuros. Máximo de glifos activos igual a la mitad del dado de habilidad arcana. El lanzador sabe cuándo se activa un glifo. Se puede disipar o borrar (acción de tocar). La magia del glifo usa los rasgos del lanzador en el momento de su creación [54-57].',
      },
      gravespeak: {
        nombre: 'Hablar con los Muertos (Gravespeak)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Voces susurradas', 'Nubes de gas', 'Espíritus agitados'],
        efecto:
          'Permite al mortal contactar con un alma difunta. Solo es posible porque los dioses lo han permitido [58]. (Detalles de las preguntas/respuestas no incluidos en las fuentes, pero se asume que funciona como el conjuro "Gravespeak" del Savage Worlds estándar). Si Hela intercepta, redirige a una de sus almas oscuras [58].',
      },
      'greater_zombie': {
        nombre: 'Zombi Mayor (Greater Zombie)',
        rango: 'Heroico',
        alcance: 'Espíritu x 2',
        duracion: 'Especial',
        trappings: ['Liturgia oscura', 'Sangre', 'Polvo especial'],
        efecto:
          'Funciona como el conjuro "Zombi", pero anima cadáveres como moradores de túmulos, hombres del pantano, ahogados o gorta wights (dependiendo de cómo vivieron y murieron). No puede crear nieblas de sangre, wights de escarcha, vampiros u otros no muertos. Las versiones mejoradas para crear monstruosidades existen para PNJ poderosos [55, 59].',
      },
      'growth_shrink': {
        nombre: 'Crecer/Encoger (Growth/Shrink)',
        rango: 'Experimentado',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: ['Gestos', 'Palabras de poder', 'Pociones'],
        efecto:
          'Crecer duplica la altura y masa del objetivo, aumentando su Tamaño en un paso con un éxito, dos con un raise, lo que a su vez aumenta su Fuerza y Dureza. Puede lanzarse varias veces en el mismo objetivo. Encoger funciona a la inversa [55, 60].',
      },
      'heat_mask': {
        nombre: 'Máscara de Calor (Heat Mask)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Ligero brillo', 'Piel pálida'],
        efecto:
          'La temperatura corporal del objetivo se enmascara para que coincida con la del aire circundante, negando la Infravision [55, 61].',
      },
      insight: {
        nombre: 'Percepción (Insight)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Instantáneo',
        trappings: [
          'Tocar objeto',
          'Brillo pálido',
          'Adivinación afortunada',
          'Voces susurradas',
        ],
        efecto:
          'El lanzador obtiene una visión, sensación o "intuición" sobre un evento pasado reciente de una persona, lugar u objeto. Los raises otorgan más información a discreción del GM [55, 61, 62].',
      },
      knockdown: {
        nombre: 'Derribo (Knockdown)',
        rango: 'Experimentado',
        alcance: 'Plantilla de Cono',
        duracion: 'Instantáneo',
        trappings: ['Tierra ondulante', 'Vientos impetuosos', 'Muro de nieve'],
        efecto:
          'Los objetivos en el cono deben hacer una tirada de Fuerza opuesta por la habilidad arcana del lanzador. Con un fallo, son derribados 1d4" y quedan Prone. Si sacan un 1 (independientemente del Wild Die), quedan Sacudidos [55, 62, 63].',
      },
      leaping: {
        nombre: 'Salto (Leaping)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Piernas poderosas', 'Las piernas cambian a forma animal'],
        efecto:
          'El objetivo suma +2" a su distancia de salto, o +4" con un raise [63-65].',
      },
      'lock_unlock': {
        nombre: 'Cerrar/Abrir (Lock/Unlock)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Especial/Instantáneo',
        trappings: ['Cadena que aprieta', 'Manos que se fusionan', 'Viento gélido'],
        efecto:
          'Hace una cerradura más difícil de abrir, o abre una cerradura. [65].',
      },
      'luck_jinx': {
        nombre: 'Suerte/Mala Suerte (Luck/Jinx)',
        rango: 'Veterano',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Brillo', 'Presagio'],
        efecto:
          'Con Suerte, el objetivo tira dos dados de rasgo y toma el mejor. Con Mala Suerte, el objetivo tira dos dados de rasgo y toma el peor [64, 65].',
      },
      mend: {
        nombre: 'Remendar (Mend)',
        rango: 'Veterano',
        alcance: 'Toque',
        duracion: 'Instantáneo',
        trappings: ['El vehículo se repara solo'],
        efecto:
          'Repara el daño hecho al cuerpo de un vehículo de madera en la última hora. El lanzador se concentra una acción, luego lanza, restando una penalización igual a las heridas del vehículo. Un éxito remienda una herida; un raise remienda dos. No afecta golpes críticos [64, 65].',
      },
      mimic: {
        nombre: 'Mimetizar (Mimic)',
        rango: 'Novato',
        alcance: 'Espíritu',
        duracion: 'Mantenido',
        trappings: ['El lanzador brilla brevemente', 'Gana conocimiento oculto'],
        efecto:
          'El lanzador puede duplicar un conjuro que haya visto usar a un oponente durante el combate actual. El lanzador debe tener el Rango adecuado. Con un éxito, el mago obtiene el uso del conjuro mimetizado. Cada lanzamiento de "Mimetizar" copia un conjuro específico [65-67].',
      },
      'mind_rider': {
        nombre: 'Jinete Mental (Mind Rider)',
        rango: 'Veterano',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: [
          'Trance',
          'Runas en la cara',
          'Rostro del lanzador superpuesto al del objetivo',
        ],
        efecto:
          'Permite proyectar parte de la mente en la mente de un objetivo en rango. Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito, el lanzador puede percibir lo que el objetivo percibe y leer sus pensamientos superficiales. Si el objetivo es Sacudido, el contacto se interrumpe [65, 67, 68].',
      },
      'negate_arcana': {
        nombre: 'Negar Arcano (Negate Arcana)',
        rango: 'Veterano',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: [
          'Señal arcana',
          'Explosión de energía mágica',
          'Campo de luces titilantes',
        ],
        efecto:
          'El lanzador coloca una Plantilla de Ráfaga Mediana (o Grande con -2 de penalización). Cualquier uso de magia en o a través de la plantilla se trata como si fuera contrarrestada por un poder de "Disipar" automático basado en el dado de habilidad arcana del lanzador. Afecta a amigos y enemigos. No afecta reliquias ni dispositivos alquímicos [65, 68-70].',
      },
      nightmare: {
        nombre: 'Pesadilla (Nightmare)',
        rango: 'Experimentado',
        alcance: 'Astucia x 1 milla',
        duracion: 'Especial',
        trappings: ['Runas', 'Sangre', 'Alfileres en una muñeca'],
        efecto:
          'La víctima sufre pesadillas terribles, impidiéndole dormir. Requiere conocer el nombre de la víctima y poseer algo suyo. Se mantiene hasta que la víctima duerma. Al dormir, la víctima hace una tirada de Espíritu (-2 si hubo raise del lanzador) o sufre pesadillas y tira en la Tabla de Pánico. Con fallo crítico, tira en la Tabla de Pánico con +2 [69-72].',
      },
      obscure: {
        nombre: 'Oscurecer (Obscure)',
        rango: 'Novato',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: ['Nubes de polvo', 'Niebla', 'Humo espeso'],
        efecto:
          'Crea una nube opaca que oscurece la visión en el área. Funciona como el conjuro "Obscure" del Savage Worlds estándar [73-75]. (Descripción detallada de efectos no en las fuentes).',
      },
      precognition: {
        nombre: 'Precognición (Precognition)',
        rango: 'Veterano',
        alcance: 'Especial',
        duracion: 'Instantáneo',
        trappings: [
          'Adivinación afortunada',
          'Augurios naturales',
          'Vislumbrar el futuro',
          'Piedras rúnicas',
        ],
        efecto:
          'El lanzador puede reorganizar dos cartas de acción (cuatro con un raise) para cualquier aliado o enemigo (incluido él mismo) en la ronda siguiente a la del lanzamiento. Las cartas deben moverse antes de que alguien actúe [70, 72, 76].',
      },
      'prolonged_blast': {
        nombre: 'Explosión Prolongada (Prolonged Blast)',
        rango: 'Veterano',
        alcance: '24/48/96',
        duracion: 'Mantenido',
        trappings: [
          'Fuego frío',
          'Electricidad',
          'Fuego',
          'Frío',
          'Charco de ácido',
          'Púas dentadas que brotan del suelo',
        ],
        efecto:
          'Crea un área donde cualquier criatura que pase sufre daño. Funciona como "Blast", pero la plantilla permanece en juego durante la duración. Cualquier criatura que entre o comience su turno en la plantilla recibe daño [70, 76].',
      },
      puppet: {
        nombre: 'Títere (Puppet)',
        rango: 'Veterano',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: ['Ojos vidriosos', 'Movimientos robóticos'],
        efecto:
          'Permite al mago controlar la mente de una víctima. Funciona como el conjuro "Puppet" del Savage Worlds estándar [35, 75, 77-80]. (Descripción detallada de efectos no en las fuentes).',
      },
      quake: {
        nombre: 'Terremoto (Quake)',
        rango: 'Veterano',
        alcance: 'Astucia x 3',
        duracion: 'Instantáneo',
        trappings: ['Tierra temblorosa', 'Rocas que se abren', 'Gritos subterráneos'],
        efecto:
          'Causa un terremoto. Funciona como el conjuro "Quake" del Savage Worlds estándar. Las paredes se desmoronan y se abren agujeros del ancho del terremoto [70, 81].',
      },
      quickness: {
        nombre: 'Rapidez (Quickness)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Aura de velocidad', 'Movimiento borroso'],
        efecto:
          'Otorga al objetivo una acción adicional por ronda. Funciona como el conjuro "Quickness" del Savage Worlds estándar [43, 70, 77, 80, 82-86]. (Descripción detallada de efectos no en las fuentes).',
      },
      refuge: {
        nombre: 'Refugio (Refuge)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: '12 horas',
        trappings: [
          'Cabaña de madera',
          'Pequeña hacienda',
          'Iglú',
          'Vegetación que cubre un área',
        ],
        efecto:
          'Crea un refugio de 10x6x6 pies con Dureza 10. Otorga +2 a las tiradas de Vigor para resistir el frío (+4 con un raise). Un fuego dentro da +2 adicional. Se mantiene durante 12 horas. Se puede renovar [70, 81, 87].',
      },
      regenerate: {
        nombre: 'Regenerar (Regenerate)',
        rango: 'Heroico',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Las heridas sanan sobrenaturalmente rápido'],
        efecto:
          'El objetivo puede hacer una tirada gratuita de Absorción con -2 cada vez que es herido (sin modificador con un raise). No se acumulan otros modificadores a Absorción [70, 87-89].',
      },
      sacrifice: {
        nombre: 'Sacrificio (Sacrifice)',
        rango: 'Veterano',
        alcance: 'Personal',
        duracion: 'Especial',
        trappings: ['El espíritu de la víctima fluye hacia el lanzador', 'Oleada de poder'],
        efecto:
          'Permite al lanzador oscuro sacrificar un ser sintiente para obtener una bonificación a su próxima tirada de habilidad arcana. Gana +1 por cada tipo de dado de Espíritu del ser asesinado. Se pierde si el conjuro termina antes de usarse. Solo una víctima por lanzamiento [88-90].',
      },
      sanctuary: {
        nombre: 'Santuario (Sanctuary)',
        rango: 'Novato',
        alcance: 'Especial',
        duracion: 'Instantáneo',
        trappings: [
          'El lanzador desaparece en una bocanada de humo',
          'Es absorbido por un torbellino',
          'Se transforma en una columna de fuego',
        ],
        efecto:
          'Teletransporta al lanzador a una ubicación segura. Los personajes con Fe van a su templo más cercano. Los magos van a un lugar que hayan convertido en santuario (permanente o temporal). Puede llevar personas adicionales con -1 por persona [89, 91, 92].',
      },
      sentry: {
        nombre: 'Centinela (Sentry)',
        rango: 'Experimentado',
        alcance: 'Astucia x 2',
        duracion: 'Especial',
        trappings: [
          'Círculo de tiza, polvo o sangre',
          'Runa mística',
          'Báculo clavado en el suelo',
        ],
        efecto:
          'Crea un centinela fantasmal que vigila el campamento (Notice d8 o d10 con raise), siempre alerta y sin penalizaciones por poca luz. No es físico y no puede ser dañado. Otorga instrucciones (máximo 10 palabras) sobre cuándo dar la alarma. O protege un objeto tocado, alertando al lanzador si alguien que no sea de los nombrados lo toca. Expira al amanecer o al anochecer [89, 92-94].',
      },
      'shape_change': {
        nombre: 'Cambio de Forma (Shape Change) (ALTERADO)',
        rango: 'Veterano',
        alcance: 'Personal',
        duracion: 'Mantenido',
        trappings: ['"Transformación"', 'Talismán', 'Tatuaje'],
        efecto:
          'El lanzador se transforma en un animal mundano. Penalización a la tirada de lanzamiento según el tamaño de la criatura (Pequeño: 0, Mediano: -1, Grande: -2, Enorme: -4). Habilidades especiales de animal: -2. Transformarse en otra raza o criatura no animal: -2. Mimetizar una apariencia exacta: -2 (penaliza Notar en -4, -6 con raise). El personaje conserva su Astucia, Espíritu y habilidades vinculadas. Gana Agilidad, Fuerza y habilidades vinculadas del animal. La Vigoria es la más alta entre el héroe y la criatura [89, 95-99].',
      },
      silence: {
        nombre: 'Silencio (Silence)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Gestos', 'Bolsa encantada para capturar sonidos'],
        efecto:
          'Crea un área de silencio total (Plantilla de Ráfaga Mediana) alrededor de un objeto inanimado. Con un raise, es una Plantilla de Ráfaga Grande. No se puede crear sonido dentro, pero se escucha el sonido exterior. La zona se mueve con el objeto. Los hechiceros que dependen del habla fallan automáticamente sus conjuros. Los monstruos con ataques basados en sonido pierden su poder temporalmente [89, 99, 100].',
      },
      'sluggish_reflexes': {
        nombre: 'Reflejos Lentos (Sluggish Reflexes)',
        rango: 'Experimentado',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: ['Atar un nudo en una cuerda', 'La víctima se cubre de hielo'],
        efecto:
          'Conjuro opuesto (habilidad arcana vs Espíritu del objetivo). Con un éxito, el objetivo saca una carta menos para la iniciativa. Las víctimas que normalmente sacan solo una carta, sacan dos y toman la más baja. Si sacan un Joker como primera carta, lo usan normalmente e ignoran el conjuro por la ronda [89, 101].',
      },
      slumber: {
        nombre: 'Letargo (Slumber)',
        rango: 'Experimentado',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: [
          'Cantar nana',
          'Gestos',
          'Soplar polvo a los objetivos',
        ],
        efecto:
          'Afecta a un oponente Pequeño o Mediano. Con -2 a la tirada de lanzamiento, afecta a todos en una Plantilla de Ráfaga Mediana o a una criatura Grande. Con -4, afecta a todos en una Plantilla de Ráfaga Grande o a una criatura Enorme. No afecta a constructos, demonios, elementales, fey, plantas o no muertos. Las víctimas deben hacer una tirada de Espíritu (-2 si el lanzador obtuvo un raise) o se quedan dormidas instantáneamente. Los ruidos fuertes despiertan a las víctimas [89, 102, 103].',
      },
      smite: {
        nombre: 'Castigo Divino (Smite)',
        rango: 'Novato',
        alcance: 'Personal',
        duracion: 'Mantenido',
        trappings: ['Arma que brilla', 'Fuego sagrado', 'Escarcha divina'],
        efecto:
          'Un arma cuerpo a cuerpo obtiene un bono de +2 al daño. Funciona como el conjuro "Smite" del Savage Worlds estándar [43, 74, 77, 82, 85, 86, 89, 104]. (Descripción detallada de efectos no en las fuentes).',
      },
      'speak_language': {
        nombre: 'Hablar Idioma (Speak Language)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: [
          'El objetivo comienza a tartamudear',
          'Una lengua invisible se extiende desde el lanzador',
        ],
        efecto:
          'El objetivo puede hablar y entender cualquier idioma que el lanzador conozca. Funciona como el conjuro "Speak Language" del Savage Worlds estándar [75, 78, 83, 105, 106]. (Descripción detallada de efectos no en las fuentes).',
      },
      speed: {
        nombre: 'Velocidad (Speed)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Ráfaga de viento', 'Pies cubiertos de hielo'],
        efecto:
          'Aumenta la velocidad de movimiento del objetivo. Funciona como el conjuro "Speed" del Savage Worlds estándar [43, 77, 83, 84, 86, 106-108]. (Descripción detallada de efectos no en las fuentes).',
      },
      'sphere_of_might': {
        nombre: 'Esfera de Poder (Sphere of Might)',
        rango: 'Veterano',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: [
          'Rocas giratorias',
          'Viento helado',
          'Fuego frío',
          'Electricidad',
        ],
        efecto:
          'Crea una esfera móvil de fuerza. Funciona como el conjuro "Sphere of Might" del Savage Worlds estándar [103, 106, 109]. (Descripción detallada de efectos no en las fuentes).',
      },
      storm: {
        nombre: 'Tormenta (Storm)',
        rango: 'Experimentado',
        alcance: '10 millas',
        duracion: 'Mantenido',
        trappings: ['Nubes que se forman', 'Ráfagas de viento', 'Relámpagos'],
        efecto:
          'Crea una tormenta. Requiere 4 rondas de trabajo mágico antes de la tirada. Disipa una tormenta existente o crea una nueva. Reduce la visibilidad [51, 52]. Funciona como el conjuro "Storm" del Savage Worlds estándar [43, 77, 83, 106]. (Descripción detallada de efectos no en las fuentes).',
      },
      stun: {
        nombre: 'Aturdir (Stun)',
        rango: 'Novato',
        alcance: 'Astucia x 2',
        duracion: 'Instantáneo',
        trappings: ['Chispas', 'Onda de choque', 'Grito'],
        efecto:
          'El objetivo queda Aturdido. Funciona como el conjuro "Stun" del Savage Worlds estándar [43, 73, 74, 77-79, 86, 106, 110]. (Descripción detallada de efectos no en las fuentes).',
      },
      'strength_of_the_undead': {
        nombre: 'Fuerza de los No Muertos (Strength of the Undead)',
        rango: 'Veterano',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Piel pálida', 'Garras', 'Colmillos'],
        efecto:
          'El lanzador imita un rasgo o habilidad especial de un no muerto que está tocando durante la duración del poder (dos con un raise). El rasgo imitado reemplaza el rasgo del lanzador. El no muerto no pierde el rasgo o habilidad [106, 109].',
      },
      succor: {
        nombre: 'Socorrer (Succor)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Instantáneo',
        trappings: ['Imposición de manos', 'Remedios herbales'],
        efecto:
          'Elimina un nivel de Fatiga, o dos con un raise. No detiene hemorragias, no elimina Sacudidos, no revive incapacitados ni sana heridas. No elimina la causa de la Fatiga. La tirada sufre una penalización igual a la Fatiga de la víctima más cualquier herida o Fatiga del lanzador [106, 111].',
      },
      'summon_beast': {
        nombre: 'Invocar Bestia (Summon Beast)',
        rango: 'Veterano',
        alcance: 'Espíritu x 10 yardas',
        duracion: 'Mantenido',
        trappings: ['El mago se concentra y gesticula con las manos'],
        efecto:
          'Invoca una bestia natural bajo el control del invocador. Funciona solo en criaturas con inteligencia animal. El tamaño de la bestia invoca una penalización acumulativa de -1 por cada dos puntos de Tamaño positivo. Los enjambres pueden invocarse (Pequeño: 0, Mediano: -1, Grande: -2). La criatura aparece en rango y línea de visión. Permanece controlada hasta que el conjuro termina o es asesinada [106, 112-114].',
      },
      'summon_demon': {
        nombre: 'Invocar Demonio (Summon Demon)',
        rango: 'Veterano',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: [
          'Sangre',
          'Incienso fétido',
          'Sacrificios',
          'Círculo de invocación',
        ],
        efecto:
          'Invoca un demonio del Abismo. Los demonios tienen modificadores a la tirada de habilidad arcana según su tipo (0 para soldado demoníaco/corcel, -1 para cadena/cambiante/imp/fustigador/espinado, -2 para gula/bibliotecario/súcubo/íncubo, -4 para plaga/revelador, -6 para hielo). Con un éxito, el demonio está vagamente ligado a la voluntad del invocador. Pueden negarse a cumplir órdenes. Desaparecen al morir o al terminar el conjuro [106, 114-117].',
      },
      'summon_elemental': {
        nombre: 'Invocar Elemental (Summon Elemental)',
        rango: 'Veterano',
        alcance: 'Especial',
        duracion: 'Mantenido',
        trappings: ['Sustancia del mismo tipo que el elemental'],
        efecto:
          'Invoca un elemental bajo el mando del invocador. El elemental permanece hasta que el conjuro termina o es asesinado. La comunicación es unidireccional mental [106, 117, 118].',
      },
      'summon_herald': {
        nombre: 'Invocar Heraldo (Summon Herald)',
        rango: 'Heroico',
        alcance: 'Espíritu',
        duracion: 'Especial',
        trappings: ['Oración', 'Canto', 'Incienso ardiendo'],
        efecto:
          'El héroe puede invocar al heraldo específico de su deidad. El lanzador sufre una penalización acumulativa de -2 por cada lanzamiento del conjuro (exitoso o no) durante un año. Los heraldos aceptan comandos solo del invocador y dentro de los límites de la fe de su deidad. El conjuro dura hasta que el heraldo es asesinado o el GM decide que se vaya [106, 119, 120].',
      },
      telekinesis: {
        nombre: 'Telequinesis (Telekinesis)',
        rango: 'Novato',
        alcance: 'Astucia x 2',
        duracion: 'Mantenido',
        trappings: ['Mano fantasmal', 'Fuerza invisible', 'Levitación'],
        efecto:
          'Mueve objetos con la mente. Funciona como el conjuro "Telekinesis" del Savage Worlds estándar [77, 80]. (Descripción detallada de efectos no en las fuentes).',
      },
      teleport: {
        nombre: 'Teletransporte (Teleport) (ALTERADO)',
        rango: 'Experimentado',
        alcance: 'Especial',
        duracion: 'Instantáneo',
        trappings: ['Nube de humo', "'Fasear'", 'Convertirse en rayo'],
        efecto:
          'Teletransporta al lanzador a cualquier punto dentro del rango y línea de visión (3" por Rango, 6" con raise). No puede entrar en espacio sólido. Transportar a otros causa un nivel de Fatiga por "pasajero" adicional (más de dos causan Incapacitación instantánea) [106, 120, 121].',
      },
      'viper_weapon': {
        nombre: 'Arma de Víbora (Viper Weapon)',
        rango: 'Experimentado',
        alcance: 'Espíritu x 2',
        duracion: 'Mantenido',
        trappings: ['El arma se transforma en una serpiente'],
        efecto:
          'Con un éxito, un arma dentro del rango se transforma en una serpiente venenosa (usa las estadísticas de víbora estándar). La serpiente no está bajo el control del lanzador y ataca al objetivo más cercano. Con un raise, la serpiente es un Wild Card. Se revierte a arma cuando es asesinada o el conjuro termina [106, 121, 122].',
      },
      'voice_on_the_wind': {
        nombre: 'Voz en el Viento (Voice on the Wind)',
        rango: 'Novato',
        alcance: 'Astucia x 50 millas',
        duracion: 'Instantáneo',
        trappings: ['El viento lleva las palabras', 'Susurros etéreos'],
        efecto:
          'Permite al lanzador enviar un mensaje de 10 palabras por Rango de personaje del lanzador a un objetivo distante [106, 123].',
      },
      'wall_walker': {
        nombre: 'Caminante de Paredes (Wall Walker)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Pies pegajosos', 'Adherencia a la superficie'],
        efecto:
          'El objetivo puede caminar y correr por paredes o techos. Funciona como el conjuro "Wall Walker" del Savage Worlds estándar [21, 75, 83, 123]. (Descripción detallada de efectos no en las fuentes).',
      },
      'wandering_senses': {
        nombre: 'Sentidos Errantes (Wandering Senses)',
        rango: 'Novato',
        alcance: 'Astucia x 10',
        duracion: 'Mantenido',
        trappings: ['Mano espectral y ojo que aparecen', 'Mirada vacía', 'Concentración'],
        efecto:
          'El lanzador proyecta sus sentidos de vista, oído y olfato. Puede mover sus sentidos 6" cada ronda hasta el límite del conjuro. Los sentidos funcionan como si el personaje se moviera realmente [123, 124].',
      },
      warding: {
        nombre: 'Protección (Warding)',
        rango: 'Experimentado',
        alcance: 'Especial',
        duracion: 'Mantenido',
        trappings: ['Símbolos de protección', 'Aura', 'Barrera'],
        efecto:
          'Crea una protección igual a una Plantilla de Ráfaga Mediana centrada en el lanzador (Grande con un raise). Las criaturas del tipo nominado que intenten entrar o usar habilidades especiales en objetivos dentro de la protección deben hacer una tirada de Espíritu o no podrán hacerlo. No detiene ataques mundanos desde fuera [123, 125].',
      },
      'warriors_gift': {
        nombre: 'Don del Guerrero (Warrior\'s Gift)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Aura de fuerza', 'Espíritu de batalla'],
        efecto:
          'Otorga al objetivo una Ventaja de Combate. Funciona como el conjuro "Warrior\'s Gift" del Savage Worlds estándar [78, 82, 85, 86, 123]. (Descripción detallada de efectos no en las fuentes).',
      },
      'water_walk': {
        nombre: 'Caminar sobre el Agua (Water Walk)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Pies brillantes', 'El agua se endurece'],
        efecto:
          'El objetivo puede caminar sobre la superficie del agua como si fuera tierra firme. Lagos y mares en calma se atraviesan normalmente. Mares agitados cuentan como terreno difícil [123, 126, 127].',
      },
      'weaken_undead': {
        nombre: 'Debilitar No Muertos (Weaken Undead)',
        rango: 'Veterano',
        alcance: 'Espíritu',
        duracion: 'Mantenido',
        trappings: ['Canto', 'Oraciones', 'Himnos', 'Símbolos de fe'],
        efecto:
          'Despoja a un no muerto de su vínculo con los campos de energía nigromántica, si bien solo por un corto tiempo. Negando su Habilidad Monstruosa "No Muerto" [123, 127]. (Detalles adicionales de efectos no en las fuentes).',
      },
      'weapon_immunity': {
        nombre: 'Inmunidad a Armas (Weapon Immunity)',
        rango: 'Experimentado',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['Armadura reluciente', 'Escudo místico'],
        efecto:
          'El objetivo recibe la mitad de daño (o ningún daño con un raise) de un tipo específico de arma. Funciona como el conjuro "Weapon Immunity" del Savage Worlds estándar [77, 80, 82, 85, 86, 110, 123, 128, 129]. (Descripción detallada de efectos no en las fuentes).',
      },
      whirlwind: {
        nombre: 'Torbellino (Whirlwind)',
        rango: 'Experimentado',
        alcance: 'Astucia',
        duracion: 'Mantenido',
        trappings: ['Gestos', 'Movimiento giratorio'],
        efecto:
          'Crea un torbellino que llena una Plantilla de Ráfaga Mediana. Cualquier cosa en contacto debe hacer una tirada de Fuerza (modificada por Tamaño) o ser derribada. Si saca un 1 (independientemente del Wild Die), también queda Sacudido. El lanzador puede mover el torbellino hasta su dado de Astucia en pulgadas por ronda (es una acción). También puede dispersar enjambres voladores (Sacudido con éxito, Herida con raise) [15, 129, 130].',
      },
      'wilderness_step': {
        nombre: 'Paso Salvaje (Wilderness Step)',
        rango: 'Novato',
        alcance: 'Toque',
        duracion: 'Mantenido',
        trappings: ['El suelo se suaviza', 'El objetivo flota ligeramente'],
        efecto:
          'El objetivo trata el terreno difícil como terreno normal [21, 78, 83, 108, 129].',
      },
      zephyr: {
        nombre: 'Céfiro (Zephyr)',
        rango: 'Novato',
        alcance: 'Un barco',
        duracion: 'Mantenido',
        trappings: ['Vientos favorables', 'Velas que se hinchan solas'],
        efecto:
          'Aumenta la Aceleración y Velocidad Máxima de un barco en un 25%, y +1 a su Manejo [83, 129]. (Descripción detallada de efectos no en las fuentes).',
      },
    },
    'hellfrost_items': {
      materiales_especiales: {
        black_ice: {
          nombre: 'Hielo Negro',
          descripcion:
            'Se encuentra en las profundidades de glaciares antiguos o en los páramos del Hellfrost. Puede trabajarse como metal, pero solo en una fragua de fuego frío (se derrite con llamas normales). Se usa para crear armaduras y armas, así como artículos mundanos.',
          costo_multiplicador: '10 veces el costo de los artículos normales.',
          disponibilidad: 'Especial (S) - solo con permiso del GM.',
          notas: [
            '**Derretimiento:** El hielo negro es muy susceptible al calor y se derrite rápidamente a temperaturas por encima del punto de congelación.',
            '**Ataques de Calor y Fuego:** El hielo negro sometido a un ataque basado en calor o fuego pierde +1 de Armadura o dado de daño por cada herida que sufre el usuario, derritiéndose por completo cuando la protección o el dado de daño llegan a cero. Por ejemplo, un hechizo de explosión de fuego que inflige 2 heridas derretiría por completo la armadura de malla de hielo negro (+2 Armadura) y reduciría permanentemente una espada larga de hielo negro de Fuerza+d10 a Fuerza+d6.',
            'Las armas y armaduras de hielo negro que comienzan a derretirse no pueden repararse. Si una espada larga se reduce a Fuerza+d6, siempre causará ese daño.',
          ],
          fuente: ['[1, 2]'],
        },
        maerathril: {
          nombre: 'Maerathril (Metal Lunar)',
          descripcion:
            'Metal blanco, excepcionalmente ligero y con propiedades antimágicas. Puede trabajarse en fraguas normales o de fuego frío.',
          costo_multiplicador: '100 veces el costo de los artículos normales.',
          disponibilidad: 'Especial (S) - solo con permiso del GM.',
          notas: [
            '**Armadura:** Las camisas de malla, cotas de malla y corseletes de placa de Maerathril otorgan los beneficios de la Ventaja Resistencia Arcana (+2) al usuario. Si el usuario ya tiene esta Ventaja o la versión Mejorada, los beneficios se acumulan (otorgando un posible bono total de +6). Los hechiceros (no clérigos) que usan armaduras de Maerathril sufren una penalización de –2 a sus tiradas de habilidad arcana.',
            '**Peso:** La armadura de Maerathril pesa la mitad que la armadura normal.',
            '**Armas:** Las armas de Maerathril "lanzan" automáticamente Disipar cada vez que golpean a un enemigo con un hechizo lanzado sobre él. El ataque no necesita causar daño para que este efecto ocurra y puede usarse con un Ataque de Toque. La habilidad arcana del arma es equivalente a su dado de daño completo (d4 para una daga, d10 para una espada a dos manos, etc.). Las armas de Maerathril tienen –2 en su tirada de disipar al afectar poderes milagrosos. Todos los poderes activos son afectados. Solo se realiza una tirada de habilidad arcana por el arma y el objetivo.',
          ],
          fuente: ['[3-5]'],
        },
        star_metal: {
          nombre: 'Metal Estelar',
          descripcion:
            'En raras ocasiones, una estrella cae a la tierra, dejando un núcleo humeante de metal estelar. Se trabaja como metal normal (incluso en fraguas de fuego frío). Es excepcionalmente fuerte y bueno para perforar materiales.',
          costo_multiplicador: '50 veces el costo de los artículos normales.',
          disponibilidad: 'Especial (S) - solo con permiso del GM.',
          notas: [
            '**Armadura:** Las armaduras de malla, placas o cascos de metal estelar tienen una Protección de Armadura adicional de +2 y pesan lo mismo que las armaduras regulares. La armadura no tiene por qué ser un traje completo (ej. perneras o brazales).',
            '**Armas:** Las armas de metal estelar son capaces de cortar o aplastar materiales endurecidos. Tienen AP 2. Las armas que ya tienen una clasificación de AP aumentan su AP en +2. Pesan lo mismo que las normales.',
            '**Herramientas/Objetos Mundanos:** Las herramientas o artículos mundanos, en los que rara vez se desperdicia metal estelar, tienen +3 de Dureza de Objeto.',
          ],
          fuente: ['[5, 6]'],
        },
      },
      armaduras: {
        hide: {
          nombre: 'Armadura de Cuero Grueso (Hide)',
          armor_bonus: '+1',
          peso_lbs: 15,
          costo_gs: 75,
          notas:
            'Cubre torso, brazos y piernas. Más gruesa que el cuero regular e aislada, restringe el movimiento. Otorga +2 a las tiradas de Vigor para resistir los efectos del frío, pero sufre una penalización de –1 a la Velocidad y a todas las tiradas de Agilidad y habilidades vinculadas a Agilidad.',
          disponibilidad: 'V',
          fuente: ['[7, 8]'],
        },
        leather_suit: {
          nombre: 'Traje de Cuero (Leather Suit)',
          armor_bonus: '+1',
          peso_lbs: 10,
          costo_gs: 50,
          notas:
            "Cubre torso, brazos y piernas. Suave y flexible en las articulaciones, con 'placas' hervidas adheridas a los antebrazos, pecho y parte superior de las piernas.",
          disponibilidad: 'V',
          fuente: ['[7, 9]'],
        },
        leather_shirt: {
          nombre: 'Camisa de Cuero (Leather Shirt)',
          armor_bonus: '+1',
          peso_lbs: 3,
          costo_gs: 20,
          notas: 'Cubre el torso.',
          disponibilidad: 'V',
          fuente: ['[7, 9]'],
        },
        chain_hauberk: {
          nombre: 'Cota de Malla (Hauberk)',
          armor_bonus: '+2',
          peso_lbs: 20,
          costo_gs: 300,
          notas:
            'Cubre torso, brazos y piernas. Miles de eslabones de hierro entrelazados.',
          disponibilidad: 'T',
          fuente: ['[7, 8]'],
        },
        chain_shirt: {
          nombre: 'Camisa de Malla (Chain Shirt)',
          armor_bonus: '+2',
          peso_lbs: 10,
          costo_gs: 200,
          notas:
            'Cubre torso y brazos. Miles de eslabones de hierro entrelazados.',
          disponibilidad: 'T',
          fuente: ['[7, 8]'],
        },
        chain_leggings: {
          nombre: 'Grebas de Malla (Chain Leggings)',
          armor_bonus: '+2',
          peso_lbs: 8,
          costo_gs: 100,
          notas: 'Cubre las piernas.',
          disponibilidad: 'T',
          fuente: ['[7]'],
        },
        chain_sleeves: {
          nombre: 'Mangas de Malla (Chain Sleeves)',
          armor_bonus: '+2',
          peso_lbs: 6,
          costo_gs: 75,
          notas: 'Cubre los brazos.',
          disponibilidad: 'T',
          fuente: ['[7]'],
        },
        scale_hauberk: {
          nombre: 'Cota de Escamas (Hauberk)',
          armor_bonus: '+2',
          peso_lbs: 25,
          costo_gs: 200,
          notas:
            'Cubre torso, brazos y piernas. Más barata que la malla pero más engorrosa; placas de metal remachadas sobre un respaldo de cuero rígido.',
          disponibilidad: 'V',
          fuente: ['[7, 10]'],
        },
        plate_corselet: {
          nombre: 'Corselete de Placas (Plate Corselet)',
          armor_bonus: '+3',
          peso_lbs: 20,
          costo_gs: 400,
          notas:
            'Cubre el torso. La armadura más pesada y con mayor protección. El peto, los brazales y las grebas están hechos de acero templado. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.',
          disponibilidad: 'C',
          fuente: ['[7, 9]'],
        },
        plate_bracers: {
          nombre: 'Brazales de Placas (Plate Bracers)',
          armor_bonus: '+3',
          peso_lbs: 8,
          costo_gs: 300,
          notas:
            'Cubre los brazos. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.',
          disponibilidad: 'C',
          fuente: ['[7, 9]'],
        },
        plate_greaves: {
          nombre: 'Grebas de Placas (Plate Greaves)',
          armor_bonus: '+3',
          peso_lbs: 12,
          costo_gs: 200,
          notas:
            'Cubre las piernas. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.',
          disponibilidad: 'C',
          fuente: ['[7, 9]'],
        },
        chain_coif: {
          nombre: 'Capucha de Malla (Chain Coif)',
          armor_bonus: '+2',
          peso_lbs: 3,
          costo_gs: 50,
          notas: '75% de probabilidad de proteger la cabeza.',
          disponibilidad: 'T',
          fuente: ['[11]'],
        },
        pot_helm: {
          nombre: 'Yelmo Cilíndrico (Pot Helm)',
          armor_bonus: '+3',
          peso_lbs: 4,
          costo_gs: 75,
          notas: '50% de probabilidad de proteger la cabeza.',
          disponibilidad: 'T',
          fuente: ['[11]'],
        },
        full_helmet: {
          nombre: 'Casco Completo (Full Helmet)',
          armor_bonus: '+3',
          peso_lbs: 8,
          costo_gs: 150,
          notas: 'Cubre la cabeza.',
          disponibilidad: 'C',
          fuente: ['[11]'],
        },
        blessed_robes: {
          nombre: 'Túnicas Bendecidas (Blessed Robes)',
          armor_bonus: '+1',
          peso_lbs: 8,
          costo_gs: 50,
          notas:
            'Cubre torso, brazos y piernas. Disponible solo para héroes con la Ventaja Fondo Arcano (Milagros) que son sacerdotes. Otros pueden usarlas, pero no obtienen bono de armadura. Solo disponibles en un templo de la deidad apropiada.',
          disponibilidad: 'S',
          fuente: ['[11, 12]'],
        },
        blessed_armor: {
          nombre: 'Armadura Bendecida (Blessed Armor)',
          armor_bonus: '+3',
          peso_lbs: 30,
          costo_gs: 500,
          notas:
            'Cubre torso, brazos y piernas. Disponible solo para héroes con la Ventaja Fondo Arcano (Milagros) que son paladines. Si otro intenta usarla, actúa como cota de placas regular (incluyendo peso). Solo disponible en un templo de la deidad apropiada.',
          disponibilidad: 'S',
          fuente: ['[11, 12]'],
        },
        small_shield: {
          nombre: 'Escudo Pequeño (Small Shield)',
          parry_bonus: '+1',
          peso_lbs: 8,
          costo_gs: 25,
          notas:
            'Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).',
          disponibilidad: 'V',
          fuente: ['[10, 13]'],
        },
        medium_shield: {
          nombre: 'Escudo Mediano (Medium Shield)',
          parry_bonus: '+1',
          armor_bonus_ranged: '+2',
          peso_lbs: 12,
          costo_gs: 50,
          notas:
            'Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).',
          disponibilidad: 'V',
          fuente: ['[10, 13]'],
        },
        large_shield: {
          nombre: 'Escudo Grande (Large Shield)',
          parry_bonus: '+2',
          armor_bonus_ranged: '+2',
          peso_lbs: 20,
          costo_gs: 200,
          notas:
            'Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).',
          disponibilidad: 'T',
          fuente: ['[10, 13]'],
        },
        barding_horse_leather: {
          nombre: 'Barda para Caballo (Cuero)',
          armor_bonus: '+1',
          peso_lbs: 15,
          costo_gs: 200,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'V',
          fuente: ['[8, 13]'],
        },
        barding_horse_plate: {
          nombre: 'Barda para Caballo (Placa)',
          armor_bonus: '+3',
          peso_lbs: 30,
          costo_gs: 1250,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'C',
          fuente: ['[8, 14]'],
        },
        barding_pygmy_mammoth_leather: {
          nombre: 'Barda para Mamut Pigmeo (Cuero)',
          armor_bonus: '+1',
          peso_lbs: 25,
          costo_gs: 400,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'V',
          fuente: ['[8, 14]'],
        },
        barding_pygmy_mammoth_chain: {
          nombre: 'Barda para Mamut Pigmeo (Malla)',
          armor_bonus: '+2',
          peso_lbs: 40,
          costo_gs: 1600,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'T',
          fuente: ['[8, 14]'],
        },
        barding_war_dog_leather: {
          nombre: 'Barda para Perro de Guerra (Cuero)',
          armor_bonus: '+1',
          peso_lbs: 3,
          costo_gs: 50,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'V',
          fuente: ['[8, 14]'],
        },
        barding_war_dog_chain: {
          nombre: 'Barda para Perro de Guerra (Malla)',
          armor_bonus: '+2',
          peso_lbs: 10,
          costo_gs: 250,
          notas:
            'Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.',
          disponibilidad: 'T',
          fuente: ['[8, 14]'],
        },
      },
      armas_cuerpo_a_cuerpo: {
        antler_staff: {
          nombre: 'Báculo de Astas (Antler Staff)',
          tipo: 'Arma Primitiva',
          damage: 'Fuerza+d6',
          peso_lbs: 10,
          costo_gs: 300,
          min_str: '—',
          notas:
            'Parada +1; Alcance 1; Requiere 2 manos. Las púas extendidas proporcionan un bono a Parada y un +1 al desarmar. Los atacantes ignoran un punto de bonificación por Superioridad Numérica debido al ancho de las púas. Se rompe con un 1 en el dado de Pelear.',
          disponibilidad: 'V',
          fuente: ['[11, 15-17]'],
        },
        bear_claw: {
          nombre: 'Garra de Oso (Bear Claw)',
          tipo: 'Arma Primitiva',
          damage: 'Fuerza+d4',
          peso_lbs: 8,
          costo_gs: 200,
          min_str: '—',
          notas:
            '+1 a Parada. Principalmente utilizada por tribus Vendahl y Finnar. Hecha de una zarpa de oso real. Otorga +1 a Trepar, pero no permite usar la mano para agarrar otros objetos (incluidos escudos). No se puede Desarmar al usuario ni cuenta como Defensor Desarmado. El bono de Trepar se acumula si se usan dos, pero el de Parada no. Se rompe con un 1 en el dado de Pelear.',
          disponibilidad: 'V',
          fuente: ['[11, 16-18]'],
        },
        toothpick_double: {
          nombre: 'Palillo Doble (Toothpick, Double)',
          tipo: 'Arma Primitiva',
          damage: 'Fuerza+d6',
          peso_lbs: 5,
          costo_gs: 150,
          min_str: '—',
          notas:
            'Solo entre tribus bárbaras del norte y criaturas como orcos/goblins. Un asta de madera con dos dientes de tigre dientes de sable unidos. Los dientes están a 180 grados, permitiendo invertir el arma si uno se rompe. Con un 1 en el dado de Pelear, solo un diente se rompe. Se rompe con un 1 en el dado de Pelear.',
          disponibilidad: 'V',
          fuente: ['[17, 19, 20]'],
        },
        toothpick_twin: {
          nombre: 'Palillo Gemelo (Toothpick, Twin)',
          tipo: 'Arma Primitiva',
          damage: 'Fuerza+d8',
          peso_lbs: 5,
          costo_gs: 200,
          min_str: '—',
          notas:
            'Similar al Palillo Doble, pero ambos dientes unidos al mismo extremo. Inflige más daño, pero con un 1 en el dado de Pelear, ambos dientes se rompen. Se rompe con un 1 en el dado de Pelear.',
          disponibilidad: 'V',
          fuente: ['[17, 19, 20]'],
        },
        boot_spikes: {
          nombre: 'Púas de Bota (Boot Spikes)',
          tipo: 'Hoja',
          damage: 'Fuerza+d4',
          peso_lbs: 3,
          costo_gs: 10,
          min_str: '—',
          notas:
            'Solo para ataques de patada. Un personaje con púas de bota trata el hielo rugoso como terreno normal y el hielo liso como hielo rugoso. Otorga +1 a las tiradas de Trepar. Ponerlas o quitarlas toma una acción.',
          disponibilidad: 'V',
          fuente: ['[19, 21]'],
        },
        dagger: {
          nombre: 'Daga (Dagger)',
          tipo: 'Hoja',
          damage: 'Fuerza+d4',
          peso_lbs: 1,
          costo_gs: 25,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        flail: {
          nombre: 'Mangual (Flail)',
          tipo: 'Hoja',
          damage: 'Fuerza+d6',
          peso_lbs: 8,
          costo_gs: 200,
          min_str: '—',
          notas: 'Ignora la Parada de escudo y los bonos de Cobertura.',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        great_sword: {
          nombre: 'Espada a Dos Manos (Great Sword)',
          tipo: 'Hoja',
          damage: 'Fuerza+d10',
          peso_lbs: 12,
          costo_gs: 400,
          min_str: '—',
          notas: 'Parada –1; Requiere 2 manos.',
          disponibilidad: 'T',
          fuente: ['[19]'],
        },
        long_sword: {
          nombre: 'Espada Larga (Long Sword)',
          tipo: 'Hoja',
          damage: 'Fuerza+d8',
          peso_lbs: 8,
          costo_gs: 300,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        short_sword: {
          nombre: 'Espada Corta (Short Sword)',
          tipo: 'Hoja',
          damage: 'Fuerza+d6',
          peso_lbs: 4,
          costo_gs: 200,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        axe: {
          nombre: 'Hacha (Axe)',
          tipo: 'Hacha',
          damage: 'Fuerza+d6',
          peso_lbs: 2,
          costo_gs: 200,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        battle_axe: {
          nombre: 'Hacha de Batalla (Battle Axe)',
          tipo: 'Hacha',
          damage: 'Fuerza+d8',
          peso_lbs: 10,
          costo_gs: 300,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        great_axe: {
          nombre: 'Hacha Grande (Great Axe)',
          tipo: 'Hacha',
          damage: 'Fuerza+d10',
          peso_lbs: 15,
          costo_gs: 400,
          min_str: '—',
          notas: 'AP 1; Parada –1; Requiere 2 manos.',
          disponibilidad: 'T',
          fuente: ['[19]'],
        },
        mace: {
          nombre: 'Maza (Mace)',
          tipo: 'Martillo y Maza',
          damage: 'Fuerza+d6',
          peso_lbs: 4,
          costo_gs: 200,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        maul: {
          nombre: 'Mazo (Maul)',
          tipo: 'Martillo y Maza',
          damage: 'Fuerza+d8',
          peso_lbs: 20,
          costo_gs: 400,
          min_str: '—',
          notas: 'AP 2 contra armadura rígida; Parada –1; Requiere 2 manos.',
          disponibilidad: 'V',
          fuente: ['[19]'],
        },
        warhammer: {
          nombre: 'Martillo de Guerra (Warhammer)',
          tipo: 'Martillo y Maza',
          damage: 'Fuerza+d6',
          peso_lbs: 8,
          costo_gs: 250,
          min_str: '—',
          notas: 'AP 1 contra armadura rígida.',
          disponibilidad: 'T',
          fuente: ['[19]'],
        },
        halberd: {
          nombre: 'Alabarda (Halberd)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d8',
          peso_lbs: 15,
          costo_gs: 250,
          min_str: '—',
          notas: 'Alcance 1; Requiere 2 manos.',
          disponibilidad: 'T',
          fuente: ['[13]'],
        },
        lance: {
          nombre: 'Lanza (Lance)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d8',
          peso_lbs: 10,
          costo_gs: 250,
          min_str: '—',
          notas:
            'AP 2 al cargar. Daño basado en la Fuerza de la montura si se usa la maniobra de Carga. Cuando está montado, usa d8 de daño independientemente de la Fuerza del usuario. Alcance 2.',
          disponibilidad: 'T',
          fuente: ['[13, 15]'],
        },
        pike: {
          nombre: 'Pica (Pike)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d8',
          peso_lbs: 25,
          costo_gs: 300,
          min_str: '—',
          notas: 'Alcance 2; Requiere 2 manos.',
          disponibilidad: 'T',
          fuente: ['[13]'],
        },
        spear_long: {
          nombre: 'Lanza Larga (Long Spear)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d6',
          peso_lbs: 5,
          costo_gs: 100,
          min_str: '—',
          notas: 'Parada +1; Alcance 1; Requiere 2 manos.',
          disponibilidad: 'V',
          fuente: ['[13]'],
        },
        spear_short: {
          nombre: 'Lanza Corta (Short Spear)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d6',
          peso_lbs: 3,
          costo_gs: 75,
          min_str: '—',
          notas: 'Alcance 1.',
          disponibilidad: 'V',
          fuente: ['[13]'],
        },
        staff: {
          nombre: 'Báculo (Staff)',
          tipo: 'Arma de Asta',
          damage: 'Fuerza+d4',
          peso_lbs: 8,
          costo_gs: 10,
          min_str: '—',
          notas: 'Parada +1; Alcance 1; Requiere 2 manos.',
          disponibilidad: 'V',
          fuente: ['[13]'],
        },
      },
      armas_a_distancia: {
        axe_throwing: {
          nombre: 'Hacha Arrojadiza (Throwing Axe)',
          range: '3/6/12',
          damage: 'Fuerza+d6',
          costo_gs: 50,
          peso_lbs: 2,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        bow: {
          nombre: 'Arco (Bow)',
          range: '12/24/48',
          damage: '2d6',
          costo_gs: 100,
          peso_lbs: 3,
          min_str: 'd6',
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        bow_long: {
          nombre: 'Arco Largo (Long Bow)',
          range: '15/30/60',
          damage: '2d6',
          costo_gs: 200,
          peso_lbs: 5,
          min_str: 'd8',
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        crossbow: {
          nombre: 'Ballesta (Crossbow)',
          range: '15/30/60',
          damage: '2d6',
          costo_gs: 300,
          peso_lbs: 10,
          min_str: 'd6',
          notas: 'AP 2; 1 acción para recargar.',
          disponibilidad: 'T',
          fuente: ['[22]'],
        },
        sling: {
          nombre: 'Honda (Sling)',
          range: '4/8/16',
          damage: 'Fuerza+d4',
          costo_gs: 10,
          peso_lbs: 1,
          min_str: '—',
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        short_spear_throwing: {
          nombre: 'Lanza Corta (Arrojadiza) / Jabalina',
          range: '3/6/12',
          damage: 'Fuerza+d6',
          costo_gs: 75,
          peso_lbs: 3,
          min_str: 'd6',
          notas:
            'Igual que la lanza corta en combate cuerpo a cuerpo. También cubre jabalinas.',
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        throwing_knife: {
          nombre: 'Cuchillo Arrojadizo (Throwing Knife)',
          range: '3/6/12',
          damage: 'Fuerza+d4',
          costo_gs: 25,
          peso_lbs: 1,
          min_str: '—',
          disponibilidad: 'T',
          fuente: ['[22]'],
        },
      },
      municiones: {
        arrow_armor_piercing: {
          nombre: 'Flecha Perforante (Armor Piercing Arrow)',
          peso_lbs: '1 lb/5 flechas',
          costo_gs: 1,
          notas:
            'AP 2; se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).',
          disponibilidad: 'V',
          fuente: ['[14, 23]'],
        },
        arrow_fleshripper: {
          nombre: 'Flecha Desgarradora (Fleshripper Arrow)',
          peso_lbs: '1 lb/5 flechas',
          costo_gs: 1,
          notas:
            '+2 de daño, pero duplica la protección de cualquier armadura que lleve el objetivo (o armadura natural). Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).',
          disponibilidad: 'V',
          fuente: ['[14, 23]'],
        },
        arrow_signaling: {
          nombre: 'Flecha de Señal (Signaling Arrow)',
          peso_lbs: '1 lb/5 flechas',
          costo_gs: 2,
          notas:
            'Produce un silbido agudo que se puede escuchar a 100" (200 yardas). Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo). Inventada por los elfos.',
          disponibilidad: 'V',
          fuente: ['[14, 23]'],
        },
        arrow_standard: {
          nombre: 'Flecha Estándar (Standard Arrow)',
          peso_lbs: '1 lb/5 flechas',
          costo_gs: 0.5,
          notas:
            'Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).',
          disponibilidad: 'V',
          fuente: ['[24]'],
        },
        ballista_bolt: {
          nombre: 'Dardo de Ballesta (Ballista Bolt)',
          peso_lbs: 1,
          costo_gs: 4,
          notas:
            'Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).',
          disponibilidad: 'T',
          fuente: ['[24]'],
        },
        quarrel: {
          nombre: 'Virote (Quarrel)',
          peso_lbs: '1 lb/5 virotes',
          costo_gs: 1,
          notas:
            'Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).',
          disponibilidad: 'T',
          fuente: ['[24]'],
        },
        sling_stone: {
          nombre: 'Piedra de Honda (Sling Stone)',
          peso_lbs: '1 lb/10 piedras',
          costo_gs: 0.1,
          notas:
            'Se pueden encontrar gratis con una tirada de Notar y 1d10 minutos de búsqueda.',
          disponibilidad: 'V',
          fuente: ['[24]'],
        },
      },
      armas_de_asedio: {
        notas_generales:
          'Todas las armas de asedio tienen una disponibilidad de Ciudad (C) y son raras incluso allí. Nunca están disponibles para la compra en asentamientos pequeños, aldeas o pueblos.',
        ballista: {
          nombre: 'Ballista',
          range: '25/50/100',
          damage: '3d6',
          rof: 1,
          ap: 3,
          crew: 1,
          costo_gs: 800,
          notas: 'Puede usarse contra tropas individuales; 1 acción para recargar.',
          disponibilidad: 'C',
          fuente: ['[25]'],
        },
        catapult: {
          nombre: 'Catapulta',
          range: '50/100/200*',
          damage: '3d10',
          rof: 1,
          ap: 10,
          crew: 6,
          costo_gs: 2000,
          notas:
            '4 acciones para recargar; Plantilla de Ráfaga Mediana; Arma Pesada. *Rango mínimo de 25”.',
          disponibilidad: 'C',
          fuente: ['[25]'],
        },
        coldfire_thrower: {
          nombre: 'Lanzallamas de Fuego Frío (Coldfire Thrower)',
          range: 'Cono/25”',
          damage: '2d10',
          rof: 1,
          ap: 'Ignora armadura',
          crew: 1,
          costo_gs: 3000,
          notas:
            'Funciona como un lanzallamas vehicular. Comúnmente llamado "boca de draco". Consiste en una caldera de metal y un cañón corto. La leña de hielo (icewood) se coloca en la caldera y se enciende. Consume 1 libra de leña de hielo por uso. La caldera puede contener un máximo de 10 libras. Añadir leña de hielo toma 1 acción por libra (2 libras con éxito, 3 con raise en tirada de Agilidad).',
          disponibilidad: 'C',
          fuente: ['[23, 25, 26]'],
        },
        ram_frame: {
          nombre: 'Ariete (con Armazón) (Ram, Frame)',
          range: '—',
          damage: '1d6/yarda',
          rof: 1,
          ap: 3,
          crew: '2/yarda',
          costo_gs: 750,
          notas:
            'Longitud máxima 10 yardas. Diseñado para puertas, no muros. Usualmente un tronco pesado con un extremo de metal. El armazón suele estar cubierto para proteger a las tropas, a menudo con pieles sin tratar o mojadas para evitar el fuego.',
          disponibilidad: 'C',
          fuente: ['[25, 27, 28]'],
        },
        ram_hand: {
          nombre: 'Ariete (Manual) (Ram, Hand)',
          range: '—',
          damage: '1d6/yarda',
          rof: 1,
          ap: 3,
          crew: '4/yarda',
          costo_gs: 400,
          notas:
            'Longitud máxima 10 yardas. Diseñado para puertas, no muros. Usualmente un tronco pesado con un extremo de metal.',
          disponibilidad: 'C',
          fuente: ['[25, 27, 28]'],
        },
        siege_tower: {
          nombre: 'Torre de Asedio (Siege Tower)',
          range: '—',
          damage: '—',
          rof: 1,
          ap: '—',
          crew: 20,
          costo_gs: 3500,
          notas:
            'Velocidad 2; transporta 30 tropas. Pasarelas protegidas usadas solo en asedios. Una estructura de madera de 10 yardas de alto sobre una base con ruedas. Las paredes están cubiertas de pieles y empapadas en agua. Un puente abatible en la parte superior se baja sobre las almenas enemigas. Moverla es un trabajo agotador; no se puede correr.',
          disponibilidad: 'C',
          fuente: ['[25, 28, 29]'],
        },
        trebuchet: {
          nombre: 'Trabucador (Trebuchet)',
          range: '24/48/96**',
          damage: '3d8',
          rof: 1,
          ap: 6,
          crew: 4,
          costo_gs: 1600,
          notas:
            '2 acciones para recargar; Plantilla de Ráfaga Pequeña; Arma Pesada. **Rango mínimo de 12”.',
          disponibilidad: 'C',
          fuente: ['[25]'],
        },
      },
      equipo_mundano_general: {
        backpack: {
          nombre: 'Mochila (Backpack)',
          peso_lbs: 2,
          costo_gs: 5,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        bedroll: {
          nombre: 'Saco de Dormir (Bedroll)',
          peso_lbs: 4,
          costo_gs: 25,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        blanket: {
          nombre: 'Manta (Blanket)',
          peso_lbs: 4,
          costo_gs: 10,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        crowbar: {
          nombre: 'Palanca (Crowbar)',
          peso_lbs: 2,
          costo_gs: 10,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        flask_ceramic: {
          nombre: 'Petaca de Cerámica (Flask, Ceramic)',
          peso_lbs: 1,
          costo_gs: 5,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        flask_metal: {
          nombre: 'Petaca de Metal (Flask, Metal)',
          peso_lbs: 1,
          costo_gs: 10,
          disponibilidad: 'T',
          fuente: ['[30]'],
        },
        flint_and_steel: {
          nombre: 'Pedernal y Esmeril (Flint and Steel)',
          peso_lbs: 1,
          costo_gs: 3,
          disponibilidad: 'V',
          fuente: ['[31]'],
        },
        hammer: {
          nombre: 'Martillo (Hammer)',
          peso_lbs: 1,
          costo_gs: 10,
          disponibilidad: 'V',
          fuente: ['[31]'],
        },
        'oil_1_pint': {
          nombre: 'Aceite (1 pinta) (Oil, 1 Pint)',
          peso_lbs: 1,
          costo_gs: 2,
          notas:
            'Además de iluminar linternas, puede usarse como arma (en frasco cerámico con mecha encendida). Rango 3/6/12. Al golpear, un 5-6 en d6 enciende al objetivo, causando 1d10 de daño por ronda. La mecha tarda 1d6 rondas en encenderse (1 ronda con llama abierta).',
          disponibilidad: 'V',
          fuente: ['[31, 32]'],
        },
        parchment: {
          nombre: 'Pergamino (Parchment)',
          peso_lbs: '1/20 lb por hoja',
          costo_gs: 1,
          disponibilidad: 'V',
          fuente: ['[22]'],
        },
        'pick_or_shovel': {
          nombre: 'Pico o Pala (Pick or Shovel)',
          peso_lbs: 5,
          costo_gs: 5,
          notas:
            'Los picos son armas desequilibradas y aplican -1 a la Parada y Pelear del usuario. Su daño es Fuerza+d6.',
          disponibilidad: 'V',
          fuente: ['[33, 34]'],
        },
        'pipe_smoking': {
          nombre: 'Pipa para Fumar (Pipe, Smoking)',
          peso_lbs: '1/5 lb',
          costo_gs: 3,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        'pipeleaf_5_smokes': {
          nombre:
            'Hoja de Pipa (5 fumadas por bolsa) (Pipeleaf, 5 Smokes per Pouch)',
          peso_lbs: '—',
          costo_gs: 15,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        pouch: {
          nombre: 'Bolsa (Pouch)',
          peso_lbs: '1/2 lb',
          costo_gs: 2,
          notas: 'Capacidad: 1 libra.',
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        quiver: {
          nombre: 'Carjaj (Quiver)',
          peso_lbs: 2,
          costo_gs: 10,
          notas: 'Capacidad: 20 flechas.',
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        'rope_hemp_50_feet': {
          nombre: "Cuerda (Cáñamo, 50 pies) (Rope, Hemp, 5')",
          peso_lbs: 10,
          costo_gs: 10,
          notas:
            'Puede soportar con seguridad 300 libras. Por cada 50 libras adicionales, tira 1d6 cada minuto o ante un estrés repentino. Con un 6, la cuerda se rompe.',
          disponibilidad: 'V',
          fuente: ['[33, 34]'],
        },
        'salt_waterproof_bag': {
          nombre: 'Sal (en bolsa impermeable) (Salt, in Waterproof Bag)',
          peso_lbs: 1,
          costo_gs: 10,
          notas:
            'Una libra de sal esparcida sobre un cuadrado de hielo de 1" reduce el grosor en un nivel. Reducir el hielo por debajo de "muy fino" lo derrite por completo.',
          disponibilidad: 'V',
          fuente: ['[33, 35]'],
        },
        sandglass: {
          nombre: 'Reloj de Arena (Sandglass)',
          peso_lbs: 1,
          costo_gs: 25,
          notas:
            "Relojes primitivos que registran los 'gates' (períodos de 3 horas) en los que se divide el día.",
          disponibilidad: 'C',
          fuente: ['[33, 35]'],
        },
        'satchel_waterproof': {
          nombre: 'Talego Impermeable (Satchel, Waterproof)',
          peso_lbs: 1,
          costo_gs: 50,
          disponibilidad: 'T',
          fuente: ['[33]'],
        },
        'scroll_case_waterproof': {
          nombre: 'Estuche para Pergaminos Impermeable (Scroll Case, Waterproof)',
          peso_lbs: '1/2 lb',
          costo_gs: 5,
          disponibilidad: 'T',
          fuente: ['[33]'],
        },
        soap: {
          nombre: 'Jabón (Soap)',
          peso_lbs: '1/5 lb',
          costo_gs: 1,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        whistle: {
          nombre: 'Silbato (Whistle)',
          peso_lbs: '—',
          costo_gs: 2,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        waterskin: {
          nombre: 'Odre (Waterskin)',
          peso_lbs: 1,
          costo_gs: 5,
          notas: 'Capacidad: 2 cuartos de galón.',
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        whetstone: {
          nombre: 'Piedra de Afilar (Whetstone)',
          peso_lbs: 1,
          costo_gs: 5,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        'writing_equipment': {
          nombre: 'Equipo de Escritura (Writing Equipment)',
          peso_lbs: 1,
          costo_gs: 30,
          disponibilidad: 'T',
          fuente: ['[36]'],
        },
      },
      equipo_mundano_especializado: {
        alchemical_device: {
          nombre: 'Dispositivo Alquímico (Alchemical Device)',
          peso_lbs: 1,
          costo_gs: '200/Rango del hechizo',
          notas:
            'Dispositivo de un solo uso que contiene un hechizo (pociones, pergaminos, gemas, plumas, polvos, aceites, etc.). El héroe elige un solo hechizo al comprarlo. Los hechizos que requieren tirada de objetivo usan Disparar o Lanzar. Los hechizos son siempre la variedad más básica. Los fabricados por personajes creadores pueden ser más efectivos. Los dispositivos alquímicos se detectan como elementos mágicos por el tacto.',
          disponibilidad: 'V',
          fuente: ['[29, 36-38]'],
        },
        'alchemist_trunk': {
          nombre: 'Baúl de Alquimista (Alchemist\'s Trunk)',
          peso_lbs: 15,
          costo_gs: 300,
          notas:
            'Laboratorio portátil con lámpara de aceite, vasos de vidrio, tubos, alambiques, pinzas, pipetas y una tabla de referencia de minerales y hierbas comunes. Crea dispositivos alquímicos sin penalización (-2 de penalización sin él).',
          disponibilidad: 'C',
          fuente: ['[36, 39]'],
        },
        bandolier: {
          nombre: 'Bandolera (Bandolier)',
          peso_lbs: 1,
          costo_gs: 10,
          notas:
            'Cinturón de tela con una docena de ranuras para pociones, pergaminos o cuchillos arrojadizos, para fácil acceso. Se puede usar alrededor de la cintura o cruzado en el pecho.',
          disponibilidad: 'T',
          fuente: ['[30, 39]'],
        },
        candle: {
          nombre: 'Vela (Candle)',
          peso_lbs: '1/2 lb',
          costo_gs: 1,
          notas:
            'Proporciona luz clara en un radio de 2" durante dos horas. Se apaga con viento fuerte o si el personaje que la sostiene corre. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.',
          disponibilidad: 'V',
          fuente: ['[21, 30, 40]'],
        },
        'climbing_gear': {
          nombre: 'Equipo de Escalada (Climbing Gear)',
          peso_lbs: 4,
          costo_gs: 50,
          notas:
            'Incluye un pequeño martillo/pico, clavos y guantes. No incluye cuerda ni púas de bota. Otorga +2 a las tiradas de Trepar.',
          disponibilidad: 'V',
          fuente: ['[21, 30]'],
        },
        firewood_per_pound: {
          nombre: 'Leña (por libra) (Firewood, per Pound)',
          peso_lbs: 1,
          costo_gs: 5,
          notas:
            'Quemar leña crea un fuego de 1" de diámetro. Una hoguera (usa 1 libra cada dos horas) eleva la temperatura dos niveles en una Plantilla de Ráfaga Grande centrada en el fuego.',
          disponibilidad: 'V',
          fuente: ['[21, 30]'],
        },
        'game_set': {
          nombre: 'Juego de Mesa (Game Set)',
          peso_lbs: 1,
          costo_gs: 50,
          notas:
            'Los juegos de mesa varían: ajedrez, zorros y sabuesos, backgammon, damas. Cada juego requiere un set diferente. El costo es por set.',
          disponibilidad: 'V',
          fuente: ['[31, 41]'],
        },
        goggles: {
          nombre: 'Gafas (Goggles)',
          peso_lbs: 2,
          costo_gs: 25,
          notas:
            'Duplican el tiempo antes de tener que hacer tiradas para evitar la ceguera por nieve. Las tiradas de Notar que implican la vista se hacen con –2 debido al tinte pesado.',
          disponibilidad: 'T',
          fuente: ['[31, 41]'],
        },
        'grappling_hook': {
          nombre: 'Garra de Escalada y Cuerda (Grappling Hook and Line)',
          peso_lbs: 2,
          costo_gs: 50,
          notas:
            'Un gancho unido a una línea ligera (usualmente no más de 15 yardas). Se lanza como un ataque (rango 3/6/12). Si "golpea", el gancho se fija y puede soportar hasta 200 libras.',
          disponibilidad: 'V',
          fuente: ['[31, 42]'],
        },
        'healers_bag': {
          nombre: 'Bolsa de Sanador (Healer\'s Bag)',
          peso_lbs: 2,
          costo_gs: 100,
          notas:
            'Un personaje que intente curar a alguien sin vendajes, hierbas, ungüentos y cataplasmas sufre una penalización de –2 a su tirada de Curar. Esto no afecta al hechizo Curación.',
          disponibilidad: 'V',
          fuente: ['[31, 42]'],
        },
        'herbalist_kit': {
          nombre: 'Kit de Herborista (Herbalist\'s Kit)',
          peso_lbs: 3,
          costo_gs: 100,
          notas:
            'Contiene olla de hierro, cuchillos, mortero y mazo, y frascos de almacenamiento de arcilla. Un personaje que intente preparar remedios herbales sin un kit sufre una penalización de –2 a sus tiradas de Conocimiento (Alquimia).',
          disponibilidad: 'V',
          fuente: ['[36, 43]'],
        },
        'herbal_remedy_any': {
          nombre: 'Remedio Herbal (cualquiera) (Herbal Remedy, Any)',
          peso_lbs: 1,
          costo_gs: 50,
          notas:
            'Detallados en el Capítulo 3. El héroe elige un efecto de la lista. Son efectivos solo por una semana (8 días). No generan repercusiones mágicas, ni están sujetos al Sifonamiento, ni pueden ser disipados. No se detectan como magia al tacto. Ejemplos de efectos: Anti-anemia, Anti-inflamatorio, Antibacterial, Antihistamínico, Antitoxina, Berserk, Sustituto de Alimentos, Curación (Específico), Entumecimiento, Purgativo, Restaurador, Soporífico, Estimulante I, Calentamiento.',
          disponibilidad: 'V',
          fuente: ['[36, 42, 44-53]'],
        },
        'herbs_dried': {
          nombre: 'Hierbas Secas (Herbs, Dried)',
          peso_lbs: 1,
          costo_gs: '5 por lote',
          notas:
            'Pueden usarse para hacer remedios herbales, pero dan una penalización de –2 a las tiradas de Conocimiento (Alquimia).',
          disponibilidad: 'V',
          fuente: ['[36, 43]'],
        },
        icewood_per_pound: {
          nombre: 'Leña de Hielo (por libra) (Icewood, per Pound)',
          peso_lbs: 1,
          costo_gs: 25,
          notas:
            'Cosechada solo del Bosque Congelado. Cuando se enciende, arde con una llama de fuego frío. Una hoguera de leña de hielo (usa 1 libra cada dos horas) baja la temperatura dos niveles en una Plantilla de Ráfaga Grande. Solo se encuentra a la venta en las Tierras Libres de Icedale o en un asentamiento enano.',
          disponibilidad: 'S',
          fuente: ['[31, 43, 54]'],
        },
        'insect_net_1_inch_square': {
          nombre: 'Mosquitera (1" cuadrada) (Insect Net, 1" Square)',
          peso_lbs: 3,
          costo_gs: 15,
          notas:
            'En verano, las tierras húmedas del Hearthlands zumban con mosquitos, mientras que las ciudades sufren plagas de moscas. Mantiene un cuadrado de 1" libre de insectos.',
          disponibilidad: 'V',
          fuente: ['[31, 54]'],
        },
        lantern: {
          nombre: 'Linterna (Lantern)',
          peso_lbs: 3,
          costo_gs: 25,
          notas:
            'Proporciona luz en un radio de 4" durante tres horas por pinta de aceite. Hay un 50% de probabilidad de que se rompa si se cae, y una probabilidad de 1 en 6 de que encienda materiales combustibles normales. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.',
          disponibilidad: 'T',
          fuente: ['[31, 40, 54]'],
        },
        lantern_bullseye: {
          nombre: 'Linterna de Ojo de Buey (Lantern, Bullseye)',
          peso_lbs: 3,
          costo_gs: 50,
          notas:
            'Actúa como una linterna normal, pero tiene una campana reflectante que puede enfocar la luz a través de una pequeña abertura. Cuando se usa de esta manera, proporciona un cono de luz igual a la Plantilla de Cono. 50% de probabilidad de romperse si se cae. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.',
          disponibilidad: 'T',
          fuente: ['[31, 40, 54]'],
        },
        lockpicks: {
          nombre: 'Ganzúas (Lockpicks)',
          peso_lbs: 1,
          costo_gs: 150,
          notas:
            'Un personaje que intente forzar una cerradura sin estas herramientas sufre una penalización de –2 a su tirada.',
          disponibilidad: 'T',
          fuente: ['[31, 55]'],
        },
        'musical_instrument': {
          nombre: 'Instrumento Musical (Musical Instrument)',
          peso_lbs: '1+ lbs',
          costo_gs: '50+',
          notas:
            'Incluye flautas (50 gs/1 lb), liras (150 gs/2 lbs), tambores (75 gs/3 lbs), gaitas (250 gs/5 lbs), laúdes (200 gs/3 lbs) y arpas pequeñas (300 gs/6 lbs). Tocar un instrumento requiere una tirada de Agilidad. Se aplica una penalización de –2 si el héroe no tiene entrenamiento musical obvio. El costo y el peso varían según el instrumento específico.',
          disponibilidad: 'V',
          fuente: ['[31, 55]'],
        },
        'norn_charm': {
          nombre: 'Amuleto Norn (Norn Charm)',
          peso_lbs: 1,
          costo_gs: 250,
          notas:
            'Runas del destino talladas en piedras planas o trozos de corteza. Cada amuleto es de un solo uso y contiene 1 benny. El benny se puede usar exactamente como un benny normal.',
          disponibilidad: 'S',
          fuente: ['[36, 55]'],
        },
        'skates_pair': {
          nombre: 'Patines (par) (Skates, Pair)',
          peso_lbs: 1,
          costo_gs: 10,
          notas:
            'Un héroe que usa patines trata el hielo liso como terreno normal. Rueda un tipo de dado más alto (típicamente un d8) al "correr" sobre hielo liso. En otro terreno, su Velocidad se reduce a la mitad (mínimo de 1) y no puede correr. Ponerlos o quitarlos toma una acción.',
          disponibilidad: 'V',
          fuente: ['[33, 35]'],
        },
        'skis_pair': {
          nombre: 'Esquís (par) (Skis, Pair)',
          peso_lbs: 6,
          costo_gs: 40,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        'snowshoes_pair': {
          nombre: 'Raquetas de Nieve (par) (Snowshoes, Pair)',
          peso_lbs: 4,
          costo_gs: 20,
          disponibilidad: 'V',
          fuente: ['[33]'],
        },
        'tome_of_learning': {
          nombre: 'Tomo de Aprendizaje (Tome of Learning)',
          peso_lbs: 1,
          costo_gs: '1,000/Rango del hechizo',
          notas:
            'Libro mágico que describe el proceso para lanzar un único hechizo. Un mago puede aprender el contenido aunque no sea del Rango suficiente. El hechizo debe estar disponible para el Fondo Arcano. No existen tomos de runas. Después de 2d6 días de estudio y una tirada exitosa de Astucia, el héroe añade el hechizo a su repertorio. El contenido se borra permanentemente del libro. Disponible solo en ciudades con templos a Maera o donde se reúnen magos (ej. skalds en Scathmoor, elementalistas en Imperial City).',
          disponibilidad: 'S',
          fuente: ['[36, 56-58]'],
        },
        'tome_of_lore_plus1_to_plus3': {
          nombre: 'Tomo de Saber (+1 a +3) (Tome of Lore, +1 to +3)',
          peso_lbs: '1-3 lbs',
          costo_gs: '500/punto',
          notas:
            'Libro de referencia que otorga un bono a una habilidad de Conocimiento específica (+1 a +6). +1 es el más común, +6 el más raro. Los bonos superiores a +3 no se pueden comprar sin permiso del GM. Se debe leer por una hora por cada +1 de bono. El bono se pierde al usarlo, al dormir o después de 24h. Disponible en ciudades con templos a Hoenir o donde los Lorekeepers tienen fuerte presencia.',
          disponibilidad: 'S',
          fuente: ['[36, 58-60]'],
        },
        'tome_of_lore_plus4_to_plus6': {
          nombre: 'Tomo de Saber (+4 a +6) (Tome of Lore, +4 to +6)',
          peso_lbs: '4-6 lbs',
          costo_gs: '2,000/punto',
          notas:
            'Libro de referencia que otorga un bono a una habilidad de Conocimiento específica (+1 a +6). +1 es el más común, +6 el más raro. Los bonos superiores a +3 no se pueden comprar sin permiso del GM. Se debe leer por una hora por cada +1 de bono. El bono se pierde al usarlo, al dormir o después de 24h. Disponible en ciudades con templos a Hoenir o donde los Lorekeepers tienen fuerte presencia. Precios aumentan dramáticamente para estos bonos.',
          disponibilidad: 'S',
          fuente: ['[36, 58-60]'],
        },
        'whale_blubber': {
          nombre: 'Grasa de Ballena (Whale Blubber)',
          peso_lbs: 1,
          costo_gs: 25,
          notas:
            'Esta sustancia grasosa se unta sobre la piel para proporcionar aislamiento contra el frío. Cada libra proporciona +1 a las tiradas de Vigor para resistir los efectos del clima frío durante 4 horas. Solo se puede aplicar una dosis a la vez.',
          disponibilidad: 'S',
          fuente: ['[33, 61]'],
        },
      },
      comida_y_agua: {
        average_meal: {
          nombre: 'Comida Promedio (Average Meal)',
          peso_lbs: '—',
          costo_gs: 2,
          disponibilidad: 'T',
          fuente: ['[36]'],
        },
        cheap_meal: {
          nombre: 'Comida Barata (Cheap Meal)',
          peso_lbs: '—',
          costo_gs: '5 ss',
          disponibilidad: 'V',
          fuente: ['[36]'],
        },
        expensive_meal: {
          nombre: 'Comida Cara (Expensive Meal)',
          peso_lbs: '—',
          costo_gs: '20+',
          disponibilidad: 'T',
          fuente: ['[36]'],
        },
        'one_weeks_rations': {
          nombre: 'Raciones para una Semana (One Week\'s Rations)',
          peso_lbs: 5,
          costo_gs: 10,
          disponibilidad: 'V',
          fuente: ['[36]'],
        },
        'one_days_water_2_quarts': {
          nombre: 'Agua para un Día (2 cuartos) (One Day\'s Water, 2 Quarts)',
          peso_lbs: 4,
          costo_gs: '—',
          disponibilidad: 'V',
          fuente: ['[36]'],
        },
      },
      animales_y_aparejos: {
        dog_war: {
          nombre: 'Perro de Guerra (Dog, War)',
          costo_gs: 200,
          notas: 'Entrenado para la guerra.',
          disponibilidad: 'V',
          fuente: ['[30, 61]'],
        },
        hawk: {
          nombre: 'Halcón (Hawk)',
          costo_gs: 350,
          disponibilidad: 'T',
          fuente: ['[30]'],
        },
        horse_riding: {
          nombre: 'Caballo de Monta (Horse, Riding)',
          costo_gs: 300,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        horse_war: {
          nombre: 'Caballo de Guerra (Horse, War)',
          costo_gs: 1000,
          notas: 'Entrenado para la guerra.',
          disponibilidad: 'T',
          fuente: ['[30, 61]'],
        },
        mammoth_pygmy: {
          nombre: 'Mamut Pigmeo (Mammoth, Pygmy)',
          costo_gs: 3000,
          notas: 'Entrenado para la guerra.',
          disponibilidad: 'T',
          fuente: ['[30, 61]'],
        },
        mule: {
          nombre: 'Mula (Mule)',
          costo_gs: 150,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        pigeon_carrier: {
          nombre: 'Paloma Mensajera (Pigeon, Carrier)',
          peso_lbs: 1,
          costo_gs: 10,
          notas:
            'Una paloma mensajera se usa para transportar mensajes a una sola ubicación. El peso incluye una pequeña jaula de mimbre. La paloma puede volar 100 millas al día.',
          disponibilidad: 'T',
          fuente: ['[30, 34]'],
        },
        saddle: {
          nombre: 'Silla de Montar (Saddle)',
          peso_lbs: 10,
          costo_gs: 30,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        saddle_war: {
          nombre: 'Silla de Montar de Guerra (Saddle, War)',
          peso_lbs: 10,
          costo_gs: 200,
          notas:
            'Hecha a medida. Otorga un bono de +1 a las tiradas de Montar para permanecer en la silla.',
          disponibilidad: 'C',
          fuente: ['[30, 35]'],
        },
      },
      vestimenta: {
        normal_clothing: {
          nombre: 'Ropa Normal (Normal Clothing)',
          peso_lbs: '—',
          costo_gs: 10,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        formal_clothing: {
          nombre: 'Ropa Formal (Formal Clothing)',
          peso_lbs: '—',
          costo_gs: 75,
          disponibilidad: 'V',
          fuente: ['[30]'],
        },
        tailored_clothing: {
          nombre: 'Ropa a Medida (Tailored Clothing)',
          peso_lbs: '—',
          costo_gs: 250,
          notas:
            'Normalmente usada por nobles y dignatarios, otorga al usuario +1 de Carisma siempre que la ropa sea completamente visible.',
          disponibilidad: 'T',
          fuente: ['[30, 56]'],
        },
        furs: {
          nombre: 'Pieles (Furs)',
          peso_lbs: 5,
          costo_gs: 50,
          notas:
            'Otorga +1 a las tiradas de Vigor para resistir los efectos del Frío. El modificador se acumula con la ropa de invierno.',
          disponibilidad: 'V',
          fuente: ['[30, 41]'],
        },
        winter_clothing: {
          nombre: 'Ropa de Invierno (Winter Clothing)',
          peso_lbs: 10,
          costo_gs: 100,
          notas:
            'Capas cálidas, ropa interior de lana, botas y guantes de piel. Otorga +2 a las tiradas de Vigor para resistir el clima frío.',
          disponibilidad: 'V',
          fuente: ['[30, 62]'],
        },
      },
      vehiculos: {
        busse: {
          nombre: 'Busse',
          descripcion:
            'Lento a remo, pero con gran capacidad de carga, ideal para actividades mercantiles.',
          velocidad: 'Acel: 1/Vel. Máx: 5 (2/8 a vela)',
          dureza: '12 (2)',
          manejo: '–1',
          tripulacion: '40 + 5',
          costo_gs: 3000,
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'T',
          fuente: ['[63]'],
        },
        drakkar: {
          nombre: 'Drakkar',
          descripcion:
            'Un pequeño drakkar, ideal para incursiones costeras y navegación en ríos poco profundos. Acelera bien a remo o vela.',
          velocidad: 'Acel: 4/Vel. Máx: 10 (5/12 a vela)',
          dureza: '14 (2)',
          manejo: '–1',
          tripulacion: '60 + 10',
          costo_gs: 6000,
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'T',
          fuente: ['[64]'],
        },
        galley: {
          nombre: 'Galera (Galley)',
          descripcion:
            'No favorecida por las razas civilizadas desde antes de la Guerra de la Ventisca; solo los orcos la usan. Lenta a vela, pero muy rápida a remo por periodos cortos.',
          velocidad: 'Acel: 2/Vel. Máx: 8 (remada) (1/3 a vela)',
          dureza: '19 (4)',
          manejo: '–2',
          tripulacion: '30 + 100 esclavos de galera',
          costo_gs: 8000,
          notas:
            'Armadura Pesada (no está realmente blindada, pero es lo suficientemente masiva como para requerir armas pesadas para dañarla).',
          armamento: [
            '**Pequeña Catapulta:** Rango 24/48/96; Daño 3d6; RoF 1; AP 4; Plantilla de Ráfaga Pequeña; AP 2, Arma Pesada.',
            '**Ariete:** Arma Pesada. Otorga al barco AP 4 y reduce a la mitad el daño recibido al embestir otro barco.',
          ],
          disponibilidad: 'C',
          fuente: ['[64, 65]'],
        },
        'horse_and_carriage': {
          nombre: 'Caballo y Carroza (Horse and Carriage)',
          descripcion:
            'Incluye coches, carros, vagones engro y otros vehículos tirados por caballos. Los mamuts pigmeos también pueden tirar de ellos. Poco útiles en nieve, barro profundo o hielo delgado sin aparejo de hielo.',
          velocidad:
            'Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera',
          dureza: '10 (2) para vagón/carroza',
          manejo: '—',
          tripulacion: '1 + 4 (carroza) o 1/10 (vagón)',
          costo_gs: '500-1000 (carroza) o 100 (vagón)',
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'V (carrozas), T (vagones)',
          fuente: ['[65]'],
        },
        knarr: {
          nombre: 'Knarr',
          descripcion:
            'Embarcación de manga ancha, pequeña para combate o comercio. Relativamente barata y la más común en los mares. También se usa en ríos navegables por su capacidad de carga, pero es lenta.',
          velocidad: 'Acel: 2/Vel. Máx: 4 (2/6 a vela)',
          dureza: '14 (2)',
          manejo: '–2',
          tripulacion: '20 + 4',
          costo_gs: 5000,
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'T',
          fuente: ['[66]'],
        },
        'river_barge': {
          nombre: 'Barcaza de Río (River Barge)',
          descripcion:
            'Mencionado, pero sin descripción detallada en las fuentes.',
          velocidad: '—',
          dureza: '—',
          manejo: '—',
          tripulacion: '—',
          costo_gs: '—',
          disponibilidad: '—',
          fuente: ['[66]'],
        },
        skeid: {
          nombre: 'Skeid',
          descripcion:
            'El buque de guerra más potente, el doble de grande que un drakkar. Su construcción y mantenimiento son muy costosos.',
          velocidad: 'Acel: 2/Vel. Máx: 10 (2/12 a vela)',
          dureza: '18 (4)',
          manejo: '–1',
          tripulacion: '200 + 10',
          costo_gs: 15000,
          notas: 'Armadura Pesada.',
          disponibilidad: 'T',
          fuente: ['[67]'],
        },
        smabyrding: {
          nombre: 'Smabyrding',
          descripcion:
            'Pequeña embarcación, ideal para ríos o viajes costeros cortos. Se maneja mal en mar abierto. Lenta a remo y vela.',
          velocidad: 'Acel: 2/Vel. Máx: 5 (2/6 a vela)',
          dureza: '10 (2)',
          manejo: '+1 (costero o fluvial)/–2 (mar abierto)',
          tripulacion: '10 + 4',
          costo_gs: 2500,
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'T',
          fuente: ['[67]'],
        },
        snekke: {
          nombre: 'Snekke',
          descripcion:
            'El arquetipo de drakkar, con proa de dragón. Diseñado para mares agitados, pero también puede navegar ríos poco profundos. El buque de guerra más común, favorecido por Saxa y Anari.',
          velocidad: 'Acel: 2/Vel. Máx: 8 (2/10 a vela)',
          dureza: '15 (2)',
          manejo: '+1',
          tripulacion: '100 + 10',
          costo_gs: 8000,
          notas: 'Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'T',
          fuente: ['[68]'],
        },
        sledge: {
          nombre: 'Trineo (Sledge)',
          descripcion:
            'Trineo estándar para transportar pequeñas cantidades de equipo o pasajeros. Los orcos usan lobos huargos, que también sirven de protección.',
          velocidad:
            'Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera',
          dureza: 6,
          manejo: '+0',
          tripulacion: '1 + 2 pasajeros',
          costo_gs: 50,
          notas:
            'Tirado por 2 animales (usualmente caballos o lobos huargos). Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'V',
          fuente: ['[69]'],
        },
        'war_sledge': {
          nombre: 'Trineo de Guerra (War Sledge)',
          descripcion:
            'Trineo con estructura de madera y pieles de animales clavadas para proteger a los ocupantes. Las solapas permiten disparar ballestas o lanzar lanzas.',
          velocidad:
            'Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera',
          dureza: '8 (2)',
          manejo: '–1',
          tripulacion: '1 + 4 pasajeros',
          costo_gs: 200,
          notas:
            'Tirado por 2 animales (usualmente lobos huargos o mulas). Requiere aparejo de hielo para nieve/hielo.',
          disponibilidad: 'V',
          fuente: ['[70]'],
        },
      },
      fortificaciones: {
        notas_generales:
          'Las fortificaciones no tienen código de disponibilidad; rara vez están a la venta. Aplican notas sobre Dureza (paredes son Armadura Pesada, cada herida crea una brecha de 1"), Bono de Asedio (modificador a tiradas de Batalla y Moral del defensor), Defensores (número habitual de guardias, se duplica con aviso de ataque (+1 Bono de Asedio, reduce suministros a la mitad)), Suministros (semanas de provisiones para los defensores, se duplica con tiempo de preparación), y Costo (guía para GM, +25% en territorio sin dueño para guardias de construcción). Nobles o personajes Ricos/Muy Ricos pueden poseerlas/construirlas, pero deben cubrir gastos anuales del 2% del costo si no tienen tierras/industrias de apoyo.',
        'fortified_manor_house': {
          nombre: 'Casa Señorial Fortificada (Fortified Manor House)',
          descripcion:
            'Hogar de nobles menores o terratenientes ricos. Estructuras de piedra de dos pisos sin defensas exteriores (excepto zanjas/muros bajos). Talleres, establos y barracones en dependencias separadas. Techos de pizarra o madera para protección.',
          dureza: '20 (10)',
          bono_asedio: '+1',
          defensores: 10,
          suministros_semanas: 6,
          costo_gs: 20000,
          disponibilidad: '—',
          fuente: ['[71, 72]'],
        },
        'hill_fort': {
          nombre: 'Castillo en Colina (Hill Fort)',
          descripcion:
            'Construidos como refugio para los lugareños en tiempos de guerra, principalmente por los Saxa. Carecen de muros defensivos fuertes, hechos de fosos concéntricos y terraplenes altos, coronados con una empalizada de madera. Entrada protegida por un laberinto de movimientos de tierra. Pueblos permanentes pueden existir en los más grandes.',
          dureza: '38 (18)',
          bono_asedio: '+2',
          defensores: 400,
          suministros_semanas: 20,
          costo_gs: 250000,
          disponibilidad: '—',
          fuente: ['[72, 73]'],
        },
        'large_castle': {
          nombre: 'Castillo Grande (Large Castle)',
          descripcion:
            'Comprende una torre central (usualmente cuadrada), un gran patio con establos, talleres y barracones, una alta muralla protegida en las esquinas con torres, y un foso.',
          dureza: '50 (25)',
          bono_asedio: '+3',
          defensores: 300,
          suministros_semanas: 26,
          costo_gs: 750000,
          disponibilidad: '—',
          fuente: ['[73, 74]'],
        },
        'motte_and_bailey': {
          nombre: 'Castillo de Motte y Bailey (Motte and Bailey)',
          descripcion:
            'Consiste en una pequeña torre o fortaleza, usualmente en una colina, rodeada por un terraplén con un muro de madera o piedra. Las versiones más grandes se dividen en dos niveles. Los fuertes de los Hearth Knights usan este diseño (100 Caballeros de guarnición).',
          dureza: '25 (10)',
          bono_asedio: '+1',
          defensores: 50,
          suministros_semanas: 12,
          costo_gs: 60000,
          disponibilidad: '—',
          fuente: ['[74]'],
        },
        'small_castle': {
          nombre: 'Castillo Pequeño (Small Castle)',
          descripcion:
            'Comprende una torre central (usualmente cuadrada), un pequeño patio con talleres y barracones, un muro cortina de piedra, y frecuentemente, un foso o zanja.',
          dureza: '32 (18)',
          bono_asedio: '+2',
          defensores: 100,
          suministros_semanas: 26,
          costo_gs: 275000,
          disponibilidad: '—',
          fuente: ['[75]'],
        },
        'stone_tower': {
          nombre: 'Torre de Piedra (Stone Tower)',
          descripcion:
            'Precursora del motte y bailey, carece de defensas de tierra. Usualmente de 20 a 30 pies de altura, con varios niveles. La mayoría son el hogar de magos o nobles pobres.',
          dureza: '20 (10)',
          bono_asedio: '+1',
          defensores: 10,
          suministros_semanas: 4,
          costo_gs: 15000,
          disponibilidad: '—',
          fuente: ['[75]'],
        },
      },
    },
  },
};

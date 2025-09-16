
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
// In a real application, you would have proper data management and user registration.
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./config";
import { User, Campaign, Character, NarrativeThread, NarrativeComment, Race, CharacterCategory, Skill, Hindrance, Attribute, Edge } from "./types";

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

const hellfrostRacesAndCategories = {
  "referenciasWebApp": {
    "razas": {
      "Engro": {
        "descripcion": "Una raza diminuta de nómadas, que viajan por las Tierras del Hogar y el Hellfrost exterior en caravanas de colores brillantes [1]. Tienen una mala reputación, siendo considerados ladrones y mendigos por otras razas [1]. A pesar de ser despreciados, los engro son optimistas y de espíritu elevado, incluso ante el peligro [2]. Miden en promedio 90 cm (3') de altura y la mayoría vive unos 70 años, aunque se han registrado engro de 100 años [3]. Son religiosos por naturaleza, aunque rara vez participan en ceremonias organizadas, y la mayoría practica una forma de druidismo [4].",
        "caracteristicas_raciales": [
          "**Suerte:** Los engro roban un benny adicional por sesión de juego. Esto se puede combinar con los Filos Suerte y Gran Suerte [5].",
          "**Forastero:** Los engro tienen la Desventaja Forastero entre todas las razas excepto la suya [5].",
          "**Pequeño:** Los engro miden en promedio solo unos 90 cm (3') de altura. Su pequeño tamaño resta 1 a su Dureza y son de Tamaño –1 [5].",
          "**Astuto:** La mayoría de los engro se ganan la vida operando al margen de la ley. Comienzan el juego con Abrir Cerraduras o Sigilo en d6. Esto no se puede cambiar más tarde [5].",
          "**Espíritu:** Los engro son seres generalmente optimistas. Comienzan con un Espíritu d6 en lugar de un d4. Mediante avances y Filos, pueden tener un Espíritu máximo de d12+3 [6]."
        ],
        "nombres_ejemplo": {
          "masculinos": ["Bertrem", "Jym", "Odbert", "Oxbow", "Rodgar"],
          "femeninos": ["Daisy", "Foxglove", "Petunia", "Rose"],
          "apellidos": "Los engro nunca han usado apellidos, creyendo que un nombre tiene poder [3]."
        }
      },
      "Enano_Helado": {
        "descripcion": "Aunque los enanos viven predominantemente en montañas, siempre lo hacen por encima de la línea de nieve [6]. Algunos han tallado complejos vastos en los lados de los glaciares. Son ligeramente xenófobos y sus hogares son fortalezas vastas con guardias y trampas ocultas [7]. Tienen pocos clérigos, que suelen seguir a Ertha o Tiw, pero han dominado el poder de las runas. Viven alrededor de 300 años, tienen cabello blanco, piel pálida y ojos negros. La mayoría mide 1.5 metros (5 pies) de altura, pero son criaturas fornidas [7]. Los hombres llevan barba, cuya longitud y número de trenzas determinan el estatus social y la profesión [8].",
        "caracteristicas_raciales": [
          "**Letargo por Calor:** Los enanos helados se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [9].",
          "**Insular:** Los enanos helados se han mantenido apartados y rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las demás razas [9].",
          "**Visión en Baja Luz:** Los ojos de los enanos están acostumbrados a la penumbra del subsuelo. Ignoran las penalizaciones por oscuridad en todas las situaciones excepto en Oscuridad Total [9]."
        ],
        "nombres_ejemplo": {
          "masculinos": ["Ari", "Bardi", "Geirstein", "Hord", "Ljot", "Olvir"],
          "femeninos": ["Asleif", "Herdis", "Svala", "Thyra"],
          "apellidos": "Los nombres de clan se forman con un descriptor seguido de un objeto (ej. Brighthammer, Foeaxe, Goldbeard, Steelhand) [8, 9]."
        }
      },
      "Nacido_del_Hielo": {
        "descripcion": "Hace un siglo no existían los nacidos del hielo; hoy son numerosos, aunque no tanto como otras razas. No evolucionaron, simplemente aparecieron. Pueden ser engendrados por cualquier raza, pero un apareamiento de nacidos del hielo siempre resulta en un hijo nacido del hielo [10]. Comparten la forma física de sus padres, pero carecen de sus cualidades raciales, poseyendo rasgos únicos. Todos tienen piel blanco-azulada, cabello blanco y ojos azul pálido, y su piel siempre está fría al tacto [11]. La mayoría se aventuran al Hellfrost, intentando comenzar una nueva vida lejos de los prejuicios [11].",
        "caracteristicas_raciales": [
          "**Forma Frígida:** Los nacidos del hielo tienen una forma innata limitada de hrimwisardry. Conocen los poderes: armadura (piel helada), protección ambiental (solo contra el frío), castigo (carámbanos crecen de las manos o un arma), y velocidad (pies con hielo). Pueden adquirir la habilidad Hrimwisardry sin tomar el Filo Trasfondo Arcano [12, 13].",
          "**Letargo por Calor:** Los nacidos del hielo se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [14].",
          "**Forastero:** Los nacidos del hielo son universalmente desconfiados fuera de los enclaves de nacidos del hielo [14].",
          "**Alma de Invierno:** Los nacidos del hielo tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo [14]."
        ],
        "nombres_ejemplo": {
          "comunes": "Al nacer, generalmente reciben nombres de la cultura de sus padres, pero muchos rechazan los nombres familiares y adoptan nuevos nombres con un toque gélido (ej. Crinhelada, Filohielo, Manoescarcha, Caminanieves) [12]."
        }
      },
      "Elfo_del_Hogar": {
        "descripcion": "En el pasado distante, los elfos del hogar vivían en los bosques cálidos del mundo, actuando como jardineros y guardianes. Construían grandes Elfhomes de madera. Se consideran la primera creación de los dioses y eligieron seguir las enseñanzas de los dioses del bien [15]. Pueden vivir más de 500 años, son ligeramente más altos que los humanos pero más esbeltos, con cabello rubio o castaño claro y ojos verde pálido o marrones [16]. Las relaciones con los humanos son tensas [16].",
        "caracteristicas_raciales": [
          "**Ágil:** Los elfos del hogar son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4 [17].",
          "**Torpe:** Los elfos del hogar tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe [17].",
          "**Nacido en el Bosque:** Los elfos del hogar no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior [18].",
          "**Visión en Baja Luz:** Los elfos del hogar tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total [18].",
          "**Reinos Naturales:** Los elfos del hogar que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas [18]."
        ],
        "nombres_ejemplo": {
          "genero_neutro": ["Ailinnil", "Elleneirlir", "Lilime", "Melasion", "Niellan", "Sinrilli"],
          "apellidos": "A menudo asociados con eventos naturales (ej. Corremas, Hojasusurro, Nieblamañana, Silbobrillo) [17]."
        }
      },
      "Humano": {
        "descripcion": "Los humanos son la raza más poblada en las Tierras del Hogar, aunque sus números han disminuido por la hambruna, enfermedades y ataques [18]. Hay cuatro ramas distintas de humanos: Anari, Finnar, Saxa y Tuomi. Cada cultura tiene numerosas subculturas [19].",
        "culturas_humanas": {
          "Anari": {
            "descripcion": "Habitantes de ciudades y pueblos, se consideran culturalmente superiores [20]. Su antiguo imperio dominó el continente occidental, pero ahora es una raza fracturada [20]. Sus magos favorecen el elementalismo, excepto en la Magocracia, donde practican heahwisardry [21]. Miden en promedio 1.68 m (5’6”) y tienen piel más oscura, cabello castaño oscuro o negro, y ojos generalmente verdes o marrones [22].",
            "nombres_ejemplo": {
              "masculinos": ["Argius", "Bron", "Bovert", "Delbaeth", "Emeric", "Gaidon", "Garth", "Howel", "Patris", "Rochad", "Serin", "Thosa"],
              "femeninos": ["Aife", "Armide", "Branwen", "Elianor", "Emer", "Liaze", "Lusiane", "Tangwenn Ursanne"],
              "apellidos": "Tradicionalmente formados añadiendo 'ap-' al nombre del padre. Actualmente, muchos adoptan su oficio como apellido o crean nuevos nombres [22]."
            }
          },
          "Finnar": {
            "descripcion": "Prefieren vivir en tiendas de fieltro, cálidas y fácilmente transportables por renos. Son extremadamente pragmáticos, un hábito vital para sobrevivir en los páramos helados [23]. Los magos finnar suelen aprender magia de la canción o hrimwisardry [24]. Tienden a ser bajos para los humanos, promediando 1.68 m (5’6”), con cabello oscuro y piel morena, curtida por el viento [24].",
            "nombres_ejemplo": {
              "masculinos": ["Arto", "Kaiju", "Konsta", "Taneli", "Tove", "Vilho"],
              "femeninos": ["Esko", "Hannu", "Kaari", "Merja", "Pirkka", "Tyko"],
              "apellidos": ["Aho", "Hietanen", "Jarnefelt", "Paatalo", "Petelius", "Stenvall", "Utrio", "Waltari"]
            }
          },
          "Saxa": {
            "descripcion": "Un pueblo clannish que vive principalmente en pequeñas granjas y aldeas. Su cultura se basa en juramentos de amistad y lealtad, y el principio de hospitalidad [25, 26]. Los magos saxa prefieren la magia de la canción [26]. Miden poco menos de 1.83 m (6 pies) de altura, tienen cabello castaño o rubio, ojos azules o verde claro, y piel pálida [27]. Los hombres usan bigotes y barbas, y llevan el cabello largo [28].",
            "nombres_ejemplo": {
              "masculinos": ["Agdi", "Cynric", "Edwin", "Gautrek", "Leofric", "Penda", "Runolf", "Seaxwulf", "Skuli", "Wiglaf"],
              "femeninos": ["Aalfwynn", "Eadgifu", "Gytha", "Isgerrd", "Skjalf", "Thorgerd", "Wulfwynn", "Yrsa"],
              "apellidos": "Los saxa añaden los sufijos '-sunu' ('hijo') o '-sdohtor' ('hija') al nombre de su padre [28]."
            }
          },
          "Tuomi": {
            "descripcion": "La cultura humana menos numerosa, confinada a las Battlelands y Drachenlands. Son una cultura guerrera orgullosa que prefiere resolver disputas con sangre [29]. Tiw, el dios de la guerra, es muy favorecido entre las tribus [30]. Miden alrededor de 1.63 m (5’4”) de altura. Ambos sexos llevan el cabello largo y a menudo lo tiñen. Usan glasto y henna para crear tatuajes elaborados, algunos de los cuales tienen poder mágico [30, 31].",
            "nombres_ejemplo": {
              "masculinos": ["Achivir", "Arcois", "Bili", "Brude", "Canaul", "Gart", "Volas"],
              "femeninos": ["Aniel", "Bannatia", "Breth", "Cailis", "Ila", "Olfinecta", "Tamia"],
              "apellidos": "Usan apodos en lugar de apellidos y siempre añaden el nombre de su tribu después [31]."
            }
          }
        },
        "caracteristicas_raciales": [
          "**Diversos:** Los humanos de cualquier cultura comienzan el juego con un Filo gratuito de su elección o 2 puntos de habilidad adicionales [32]."
        ]
      },
      "Elfo_de_la_Taiga": {
        "descripcion": "En el pasado distante, varias tribus élficas se dirigieron al norte para establecer Elfhomes en la gran taiga. Vivieron en relativo aislamiento y con el tiempo, casi todos los lazos con sus primos del sur se olvidaron [32]. Desde la Guerra de la Ventisca, han visto su hábitat natural disminuir. Tienen cabello blanco y piel azul claro, siendo por lo demás similares a los elfos del hogar en esperanza de vida [33].",
        "caracteristicas_raciales": [
          "**Ágil:** Los elfos de la taiga son gráciles y ágiles. Comienzan con un d6 en Agilidad en lugar de un d4 [34].",
          "**Torpe:** Los elfos de la taiga tienen una aversión innata a los objetos mecánicos (incluidas las ballestas). Tienen la Desventaja Torpe [35].",
          "**Nacido en el Bosque:** Los elfos de la taiga no sufren penalizaciones por Terreno Difícil en bosques. Al usar el sistema de Ritmo de Viaje Terrestre, tratan dicho terreno como una categoría inferior [35].",
          "**Letargo por Calor:** Los elfos de la taiga se vuelven letárgicos a temperaturas de 12°C (53°F) o más. Tienen –1 a todas las tiradas de rasgo en dichas temperaturas [35].",
          "**Insular:** Los elfos de la taiga rara vez se inmiscuyen en los asuntos de otras razas. Tienen –2 a Carisma al tratar con todas las razas excepto los elfos [35].",
          "**Visión en Baja Luz:** Al igual que sus parientes templados, los elfos de la taiga tienen ojos de gato e ignoran las penalizaciones por iluminación en todas las situaciones excepto en Oscuridad Total [36].",
          "**Reinos Naturales:** Los elfos de la taiga que se convierten en druidas tratan los Elfhomes como zonas salvajes, no urbanas [36].",
          "**Alma de Invierno:** Los elfos de la taiga tienen +2 a las salvaciones de Vigor para resistir los efectos del clima frío, y +2 de Armadura para resistir los efectos de ataques de frío, hielo negro o hielo [36]."
        ],
        "nombres_ejemplo": {
          "simples": "Los elfos de la taiga usan un solo nombre, que suele (pero no siempre) tener un elemento invernal o natural (ej. Jineteescarcha, Crinhelada, Brillohielo, Ojosnocturnos, Tejeombra, Correnieve) [34]."
        }
      }
    },
    "categorias_personaje": {
      "Vengador": {
        "descripcion": "Los habitantes del Hellfrost, bandidos u orcos han arrebatado todo lo que el héroe amaba. La venganza es lo único que lo mantiene en pie [37]."
      },
      "Bandido": {
        "descripcion": "Ante la escasez de alimentos, algunas personas han recurrido a tomar lo que quieren por la fuerza o la amenaza de violencia [37]."
      },
      "Bailarín_de_Espadas": {
        "descripcion": "Guerreros elfos hábiles en el uso de dos hojas. Sus movimientos parecen espontáneos pero son como pasos de baile bien ensayados para los no-elfos [37]."
      },
      "Porra": {
        "descripcion": "Guerreros engro altamente entrenados en el uso de la honda. Sirven como una especie de policía, pero solo en la sociedad engro [38]."
      },
      "Ciudadano": {
        "descripcion": "Héroes que surgen de personas comunes, como una viuda que busca venganza o un hijo de granjero que busca aventura [38]."
      },
      "Druida": {
        "descripcion": "Solo los elfos y los engro entienden cómo canalizar energía de plantas y animales. Son fuertes en la naturaleza, pero sufren dificultades en entornos urbanos [38]."
      },
      "Elementalista": {
        "descripcion": "Magos que obtienen su poder a través de los reinos elementales. Un elementalista que ha dominado los cuatro elementos es conocido como arkhwisard (archimago) [39]."
      },
      "Explorador": {
        "descripcion": "Viajeros que recorren las tierras, corrigiendo mapas antiguos y detallando las nuevas maravillas del mundo casi congelado [39]."
      },
      "Luchador": {
        "descripcion": "Puede ser desde mercenarios endurecidos y guardaespaldas hasta jóvenes granjeros que buscan defender sus hogares [39]."
      },
      "Heahwisard_Mago_Superior": {
        "descripcion": "Magos que obtienen energías mágicas a través de sus bastones, y son extremadamente débiles mágicamente sin ellos. También son la nobleza gobernante de las tierras conocidas como la Magocracia [40]."
      },
      "Sanador": {
        "descripcion": "Personas que se esfuerzan por detener la marea de miseria con cataplasmas y ungüentos. Las Hermanas de la Misericordia son la única organización no religiosa jurada a este servicio [40]."
      },
      "Caballero_del_Hogar": {
        "descripcion": "Dedicados a la defensa de las Tierras del Hogar contra las depredaciones de los habitantes del Hellfrost. Operan solo en las regiones más frías, custodiando caminos y pasos de montaña [40]."
      },
      "Heraldo": {
        "descripcion": "Sirven a los nobles como diplomáticos y mensajeros. Un ataque contra un heraldo es un ataque contra su señor [41]."
      },
      "Hrimwisard_Mago_de_Escarcha": {
        "descripcion": "Magos que tejen poderosos hechizos extrayendo energías mágicas que se encuentran en el Hellfrost a través de sus cuerpos. Cuanto más frío hace, más poderosos efectos pueden invocar [41]."
      },
      "Manipulador_de_Hielo": {
        "descripcion": "Marineros hábiles en el pilotaje de barcos de hielo, que se deslizan sobre el hielo y la nieve con patines y esquís largos [41]."
      },
      "Mercenario_del_Gremio_de_Hierro": {
        "descripcion": "Aunque existen muchas compañías mercenarias, el Gremio de Hierro solo contrata tropas para comerciantes que requieren protección [42]."
      },
      "Trabajador_Itinerante": {
        "descripcion": "Vagabundos que ofrecen sus servicios en granjas y aldeas por todo Rassilon, como sanadores, herreros o sacerdotes. Los soldados itinerantes son mercenarios [42]."
      },
      "Caballero_Hrafn_Cuervo": {
        "descripcion": "La Orden de los Caballeros Hrafn se dedica a la perfección del liderazgo militar. Se preocupan poco por la política y contratan a sus miembros para servir a nobles [42, 43]."
      },
      "Guardián_del_Saber": {
        "descripcion": "Dedicados a encontrar y preservar el conocimiento, se esfuerzan por evitar que se olvide [43]."
      },
      "Mensajero": {
        "descripcion": "Parte jinete, explorador y guerrero, cuya vida es difícil, pero puede ser gratificante. La comunicación está limitada por la velocidad del caballo y el coraje del jinete [43]."
      },
      "Noble": {
        "descripcion": "La nobleza permanece en la cima de la escala social. Muchas tierras ancestrales se han perdido, lo que obliga a los hijos más jóvenes a buscar fortuna a través de la aventura [43]."
      },
      "Forajido": {
        "descripcion": "Marginados por actividades criminales o falsas acusaciones. A diferencia de los bandidos que atacan a los débiles, los forajidos son simplemente parias y aún pueden ser héroes honorables [44]."
      },
      "Paladín": {
        "descripcion": "Mientras los sacerdotes guardan las almas de los fieles, los paladines guardan su carne. Algunos residen permanentemente en templos, otros viajan realizando hazañas en nombre de su deidad [44]."
      },
      "Sacerdote": {
        "descripcion": "Existen muchos dioses adorados en Rassilon. Los sacerdotes forman el brazo espiritual de su fe [45]."
      },
      "Guardabosques_Ranger": {
        "descripcion": "Operan en la naturaleza como exploradores, espías, exploradores y soldados. A menudo patrullan las Tierras del Hogar para combatir los males que allí residen [45]."
      },
      "Refugiado": {
        "descripcion": "El héroe puede haber perdido su hogar por ataques de bestias del Hellfrost, huido por malas cosechas o tenido su hogar enterrado bajo la nieve. No tiene un hogar propio y debe sobrevivir con su ingenio y la generosidad de otros [45]."
      },
      "Reliqus": {
        "descripcion": "Miembro del Relicario, una organización dedicada a localizar, estudiar y proteger objetos mágicos. Algunos identifican reliquias por sus marcas, otros buscan magia antigua en criptas y templos [46, 47]."
      },
      "Guardián_de_Caminos": {
        "descripcion": "Un grupo de hombres y mujeres que se han encargado de proteger los caminos y salvaguardar a los viajeros en Rassilon [46]."
      },
      "Mago_Rúnico": {
        "descripcion": "Encontrado solo entre los enanos, los magos rúnicos concentran las energías mágicas del mundo a través de runas talladas [46]."
      },
      "Explorador_Scout": {
        "descripcion": "Trabajan para comerciantes (vigilando bandidos u orcos), como tropas de reconocimiento independientes para compañías mercenarias, y como guías para grupos de aventureros en los páramos congelados [48]."
      },
      "Skald": {
        "descripcion": "Hechiceros que realizan su magia a través del poder de la canción. También conocen música, historias y poemas, y son bienvenidos en la mayoría de los asentamientos [48, 49]."
      },
      "Ladrón": {
        "descripcion": "Aprovechan a quienes tienen algo de valor. Algunos son tipos al estilo Robin Hood, otros buscan su propio beneficio [49]."
      },
      "Trampero": {
        "descripcion": "Se ganan la vida cazando osos y lobos para vender sus pieles (necesarias para sobrevivir). Están curtidos a la intemperie y a menudo encuentran ruinas mientras cazan [49]."
      },
      "Guardián_del_Bosque": {
        "descripcion": "Una organización principalmente élfica, dedicada a proteger los bosques de Rassilon. Son tiradores expertos y saben cómo hablar con bestias mundanas [50]."
      },
      "Leñador": {
        "descripcion": "Almas resistentes que viajan al Bosque Congelado para recolectar valiosa madera de hielo, que los enanos utilizan en sus forjas de hielo negro [50]."
      }
    }
  }
};

const hellfrostGameData = {
    skills: [
        { name: "Montar", attribute: "Agilidad", description: "Cubre el control de vehículos tirados por animales." },
        { name: "Druidismo", attribute: "Astucia", description: "Habilidad arcana para el Fondo Arcano de Druida." },
        { name: "Elementalismo", attribute: "Astucia", description: "Habilidad arcana para el Fondo Arcano de Elementalista." },
        { name: "Magia Superior", attribute: "Astucia", description: "Habilidad arcana para el Fondo Arcano de Heahwisardry." },
        { name: "Magia de Escarcha", attribute: "Astucia", description: "Habilidad arcana para el Fondo Arcano de Hrimwisardry." },
        { name: "Magia Rúnica", attribute: "Astucia", description: "Habilidad arcana especial, una por cada runa." },
        { name: "Magia de la Canción", attribute: "Astucia", description: "Habilidad arcana para el Fondo Arcano de Song Magic." },
        { name: "Alquimia", attribute: "Astucia", description: "Creación de pociones mágicas, pergaminos y otros objetos temporales." },
        { name: "Arcanos", attribute: "Astucia", description: "Estudio de asuntos arcanos y ocultos." },
        { name: "Área", attribute: "Astucia", description: "Estudio de una región determinada, su gente, lugares y costumbres." },
        { name: "Batalla", attribute: "Astucia", description: "Aplicación práctica de tácticas y estrategia." },
        { name: "Oficio", attribute: "Astucia", description: "Habilidad de conocimiento separada para cada oficio (carpintería, herrería, etc.)." },
        { name: "Folklore", attribute: "Astucia", description: "Conocimiento de leyendas, historias, poemas y chismes." },
        { name: "Heráldica", attribute: "Astucia", description: "Conocimiento de escudos de armas, estandartes y diseños heráldicos." },
        { name: "Historia", attribute: "Astucia", description: "Estudio de los principales eventos históricos desde la Guerra de la Ventisca." },
        { name: "Ley", attribute: "Astucia", description: "Comprensión de las principales leyes de cada reino." },
        { name: "Monstruos", attribute: "Astucia", description: "Dividido en tipos específicos de monstruos (demonios, gigantes, etc.)." },
        { name: "Religión", attribute: "Astucia", description: "Estudio de las diversas deidades y su clero." },
        { name: "Adivinanzas", attribute: "Astucia", description: "Habilidad para participar en concursos de adivinanzas." },
        { name: "Artillería de Asedio", attribute: "Astucia", description: "Se utiliza para disparar balistas, catapultas y otras armas de asedio." }
    ],
    edges: [
        { name: "Fondo Arcano (Milagros)", category: "Background", requirements: "Novato", description: "Otorga la ventaja Conexiones con la fe específica y la desventaja Órdenes." },
        { name: "Biblioteca", category: "Background", requirements: "Novato, Rico o Guardián del Saber, no Analfabeto", description: "Posee tomos de saber con bonificaciones a habilidades de Conocimiento." },
        { name: "Lingüista", category: "Background", requirements: "Novato, Astucia d6+, no Analfabeto", description: "Conoce un número de idiomas igual a su dado de Astucia." },
        { name: "Noble", category: "Background", requirements: "Novato", description: "Posee el título noble más bajo y gobierna una pequeña aldea." },
        { name: "Familia Antigua", category: "Background", requirements: "Novato, Fondo Arcano (Heahwisardry)", description: "Proviene de una familia influyente en la Magocracia. +2 a Conocimiento (Arcanos)." },
        { name: "Rico", category: "Background", requirements: "Novato", description: "Comienza con 3x dinero inicial y un ingreso anual de 5,000 escudos de oro." },
        { name: "Muy Rico", category: "Background", requirements: "Novato, Rico", description: "Comienza con 5x dinero inicial y un ingreso de 15,000 escudos de oro." },
        { name: "Styrimathr", category: "Background", requirements: "Novato, Navegación d8+", description: "Posee un barco (smabyrding)." },
        { name: "Valeroso", category: "Combat", requirements: "Novato, Agallas d8+", description: "+2 a todas las tiradas de Agallas y -2 a las tiradas en la Tabla de Pánico." },
        { name: "Doble Disparo", category: "Combat", requirements: "Experimentado, Elfo, Disparar d8+", description: "Dispara dos flechas al mismo objetivo con -2 a Disparar. Ambas causan daño." },
        { name: "Cazagigantes Mejorado", category: "Combat", requirements: "Heroico, Cazagigantes", description: "Ignora la Armadura o el Tamaño de criaturas tres tamaños más grandes." },
        { name: "Disparo Poderoso", category: "Combat", requirements: "Veterano, Fuerza d8+, Disparar d10+", description: "El daño del arco se calcula como Fuerza+d6." },
        { name: "Maestro de Armas de Gran Tamaño", category: "Combat", requirements: "Veterano, Fuerza d10+, Pelear d10+", description: "Usa armas a dos manos con una sola mano." },
        { name: "Escaramuza", category: "Combat", requirements: "Experimentado, Engro, Agilidad d8+", description: "Oponentes de tamaño humano o mayor tienen -1 para atacarte." },
        { name: "Muro de Escudos", category: "Combat", requirements: "Experimentado, Bloquear", description: "Defiende a un compañero adyacente con un escudo mediano o grande." },
        { name: "Caminante de Nieve", category: "Combat", requirements: "Novato, Agilidad d6+", description: "Se mueve fácilmente sobre nieve y hielo." },
        { name: "Romper Mejorado", category: "Combat", requirements: "Veterano, Romper", description: "Ignora 2 puntos de armadura." },
        { name: "Muro de Acero", category: "Combat", requirements: "Veterano, Agilidad d8+, Pelear d8+, Notar d8+", description: "Los oponentes no obtienen bonificación por Superioridad Numérica." },
        { name: "Grito de Guerra", category: "Combat", requirements: "Experimentado, Enano Helado o Saxa, Intimidación d8+", description: "Permite una tirada de Intimidación contra todos en una Plantilla de Ráfaga Grande." },
        { name: "Discípulo de Hela", category: "Leadership", requirements: "Experimentado, Fondo Arcano (Milagros), Astucia d8+, Fe d8+", description: "+1 a todas las tiradas de Fe. Los zombies creados con dos raises son permanentes." },
        { name: "Unos Cuantos Hombres Buenos", category: "Leadership", requirements: "Heroico, Astucia d8+, Conocimiento (Batalla) d10+, Mando, Inspirar", description: "Añade un token al total de tu ejército en Batallas Masivas." },
        { name: "Presencia de Mando", category: "Leadership", requirements: "Novato, Mando", description: "Radio de mando de 10” en lugar de 5”." },
        { name: "Fuego Coordinado", category: "Leadership", requirements: "Veterano, Astucia d6+, Disparar d8+, Lanzar d8+, Mando", description: "Tropas de misiles pueden disparar como una unidad en tu acción." },
        { name: "¡Grita Estragos!", category: "Leadership", requirements: "Veterano, Espíritu d8+, Conocimiento (Batalla) d10+, Mando, Fervor", description: "En Batallas Masivas, una carga exitosa causa una pérdida de token extra." },
        { name: "Muerte Antes que la Deshonra", category: "Leadership", requirements: "Veterano, Espíritu d8+, Conocimiento (Batalla) d8+, Mando, Mantener la Línea", description: "+2 a las tiradas de Moral en Batallas Masivas." },
        { name: "Fanatismo", category: "Leadership", requirements: "Experimentado, Mando, Fervor", description: "Tropas bajo tu mando añaden +2 a Agallas y -2 a Pánico." },
        { name: "Rompeasedios", category: "Leadership", requirements: "Experimentado, Astucia d8+, Conocimiento (Batalla) d8+", description: "Reduce la Bonificación de Asedio enemiga en 1." },
        { name: "Mentalidad de Asedio", category: "Leadership", requirements: "Experimentado, Astucia d8+, Conocimiento (Batalla) d8+", description: "Aumenta tu Bonificación de Asedio en +1." },
        { name: "Táctico", category: "Leadership", requirements: "Wild Card, Experimentado, Astucia d8+, Conocimiento (Batalla) d6+, Mando", description: "Gana cartas de iniciativa adicionales al inicio del combate." },
        { name: "Seguidores", category: "Legendary", requirements: "Legendario", description: "Ganas seguidores leales." },
        { name: "Compañero", category: "Legendary", requirements: "Legendario", description: "Ganas un compañero Wild Card." },
        { name: "Alquimia", category: "Power", requirements: "Experimentado, Fondo Arcano, hab. arcana d6+, Conocimiento (Alquimia) d6+", description: "Crea dispositivos alquímicos." },
        { name: "Aumento de Bastón", category: "Power", requirements: "Experimentado, Fondo Arcano (Heahwisardry), Heahwisardry d8+", description: "Encanta tu bastón con nuevas habilidades." },
        { name: "Combinar Hechizos", category: "Power", requirements: "Heroico, Fondo Arcano, hab. arcana d10+", description: "Lanza dos hechizos diferentes simultáneamente." },
        { name: "Concentración", category: "Power", requirements: "Experimentado, Fondo Arcano, Astucia d6+", description: "+2 para resistir la interrupción de hechizos." },
        { name: "Concentración Mejorada", category: "Power", requirements: "Veterano, Concentración", description: "El bono de resistencia a la interrupción aumenta a +4." },
        { name: "Maestría Elemental", category: "Power", requirements: "Experimentado, Fondo Arcano (Elementalismo)", description: "Aprende un nuevo elemento con una penalización." },
        { name: "Foco", category: "Power", requirements: "Experimentado, Fondo Arcano, Espíritu d6+", description: "Tirada de Espíritu a -2 para recuperarte de Shaken por fallo de hechizo." },
        { name: "Foco Mejorado", category: "Power", requirements: "Heroico, Foco", description: "La tirada de recuperación de Foco no tiene penalización." },
        { name: "Hellfreeze", category: "Power", requirements: "Veterano, Fondo Arcano (frío), hab. arcana d10+", description: "Tus hechizos de frío dañan a criaturas resistentes o inmunes." },
        { name: "Percepción Rúnica", category: "Power", requirements: "Novato, Fondo Arcano (Magia Rúnica), hab. de runa d8+", description: "+1 a tu habilidad arcana al usar hechizos de una runa específica." },
        { name: "Sutileza de Hechizo", category: "Power", requirements: "Novato, Fondo Arcano, hab. arcana d8+", description: "Mejora un hechizo con opciones como Arcana o Selectiva." },
        { name: "Guardián del Bosque", category: "Professional", requirements: "Novato, Disparar d8+, Fondo Arcano (Druidismo) o Ventaja Leñador", description: "Habla con bestias y aprende el poder Amigo Bestia." },
        { name: "Magia de Setos", category: "Professional", requirements: "Novato, Astucia d8+, Conocimiento (Alquimia) d6+", description: "Identifica plantas y crea remedios herbales." },
        { name: "Guerrero Sagrado/Impío", category: "Professional", requirements: "Novato, Fondo Arcano (Milagros), Espíritu d8+", description: "Si fallas una tirada de Fe, quedas Sacudido." },
        { name: "Reliquus", category: "Professional", requirements: "Novato, Agilidad d8+, Abrir Cerraduras d6+", description: "+2 a Notar para trampas y puertas ocultas. Nunca te sorprenden." },
        { name: "Guardián de Caminos", category: "Professional", requirements: "Novato, Vigor d6+, Pelear d8+", description: "+2 a Supervivencia y Rastrear. +2 a Notar para detectar emboscadas." },
        { name: "Maestro Narrador", category: "Social", requirements: "Experimentado, Astucia d8+, Conocimiento (Folklore) d8+", description: "Usa d8 para Premios de Gloria Variables." },
        { name: "Narrador Legendario", category: "Social", requirements: "Heroico, Maestro Narrador", description: "Gana +1d8 de Gloria por cada raise en la tirada de narración." },
        { name: "Sobrecarga de Poder", category: "Wild Card", requirements: "Wild Card, Experimentado, Fondo Arcano, hab. arcana d10+", description: "Duplica el daño total de un ataque arcano exitoso." }
    ],
    hindrances: [
        { name: "Aprendiz/Novicio", level: "Menor/Mayor", description: "Menor: habilidad arcana no superior a d6. Mayor: un poder inicial menos." },
        { name: "Oveja Negra", level: "Menor", description: "Ex noble de la Magocracia que rechazó la heahwisardry. -2 Carisma con heahwisards." },
        { name: "Sangre Fría", level: "Menor", description: "-2 a las tiradas de Vigor para resistir el clima frío." },
        { name: "Maldito por los Dioses", level: "Mayor", description: "Un dios te ha maldecido. Hechizos beneficiosos de sus clérigos fallan, los dañinos causan +2 de daño." },
        { name: "Prohibición Mágica", level: "Mayor", description: "No puedes usar ni ser afectado por magia, pociones o pergaminos." },
        { name: "Debilidad Nigromántica", level: "Menor/Mayor", description: "Menor: -2 para resistir ataques especiales de muertos vivientes. Mayor: la penalización es -4." },
        { name: "Órdenes", level: "Menor", description: "Sirves a otro poder y debes seguir sus órdenes." }
    ],
    items: {
      "materiales_especiales": {
          "black_ice": {
            "nombre": "Hielo Negro",
            "descripcion": "Se encuentra en las profundidades de glaciares antiguos o en los páramos del Hellfrost. Puede trabajarse como metal, pero solo en una fragua de fuego frío (se derrite con llamas normales). Se usa para crear armaduras y armas, así como artículos mundanos.",
            "costo_multiplicador": "10 veces el costo de los artículos normales.",
            "disponibilidad": "Especial (S) - solo con permiso del GM.",
            "notas": [
              "**Derretimiento:** El hielo negro es muy susceptible al calor y se derrite rápidamente a temperaturas por encima del punto de congelación.",
              "**Ataques de Calor y Fuego:** El hielo negro sometido a un ataque basado en calor o fuego pierde +1 de Armadura o dado de daño por cada herida que sufre el usuario, derritiéndose por completo cuando la protección o el dado de daño llegan a cero. Por ejemplo, un hechizo de explosión de fuego que inflige 2 heridas derretiría por completo la armadura de malla de hielo negro (+2 Armadura) y reduciría permanentemente una espada larga de hielo negro de Fuerza+d10 a Fuerza+d6.",
              "Las armas y armaduras de hielo negro que comienzan a derretirse no pueden repararse. Si una espada larga se reduce a Fuerza+d6, siempre causará ese daño."
            ],
            "fuente": "[1, 2]"
          },
          "maerathril": {
            "nombre": "Maerathril (Metal Lunar)",
            "descripcion": "Metal blanco, excepcionalmente ligero y con propiedades antimágicas. Puede trabajarse en fraguas normales o de fuego frío.",
            "costo_multiplicador": "100 veces el costo de los artículos normales.",
            "disponibilidad": "Especial (S) - solo con permiso del GM.",
            "notas": [
              "**Armadura:** Las camisas de malla, cotas de malla y corseletes de placa de Maerathril otorgan los beneficios de la Ventaja Resistencia Arcana (+2) al usuario. Si el usuario ya tiene esta Ventaja o la versión Mejorada, los beneficios se acumulan (otorgando un posible bono total de +6). Los hechiceros (no clérigos) que usan armaduras de Maerathril sufren una penalización de –2 a sus tiradas de habilidad arcana.",
              "**Peso:** La armadura de Maerathril pesa la mitad que la armadura normal.",
              "**Armas:** Las armas de Maerathril 'lanzan' automáticamente Disipar cada vez que golpean a un enemigo con un hechizo lanzado sobre él. El ataque no necesita causar daño para que este efecto ocurra y puede usarse con un Ataque de Toque. La habilidad arcana del arma es equivalente a su dado de daño completo (d4 para una daga, d10 para una espada a dos manos, etc.). Las armas de Maerathril tienen –2 en su tirada de disipar al afectar poderes milagrosos. Todos los poderes activos son afectados. Solo se realiza una tirada de habilidad arcana por el arma y el objetivo."
            ],
            "fuente": "[3-5]"
          },
          "star_metal": {
            "nombre": "Metal Estelar",
            "descripcion": "En raras ocasiones, una estrella cae a la tierra, dejando un núcleo humeante de metal estelar. Se trabaja como metal normal (incluso en fraguas de fuego frío). Es excepcionalmente fuerte y bueno para perforar materiales.",
            "costo_multiplicador": "50 veces el costo de los artículos normales.",
            "disponibilidad": "Especial (S) - solo con permiso del GM.",
            "notas": [
              "**Armadura:** Las armaduras de malla, placas o cascos de metal estelar tienen una Protección de Armadura adicional de +2 y pesan lo mismo que las armaduras regulares. La armadura no tiene por qué ser un traje completo (ej. perneras o brazales).",
              "**Armas:** Las armas de metal estelar son capaces de cortar o aplastar materiales endurecidos. Tienen AP 2. Las armas que ya tienen una clasificación de AP aumentan su AP en +2. Pesan lo mismo que las normales.",
              "**Herramientas/Objetos Mundanos:** Las herramientas o artículos mundanos, en los que rara vez se desperdicia metal estelar, tienen +3 de Dureza de Objeto."
            ],
            "fuente": "[5, 6]"
          }
        },
        "armaduras": {
          "hide": {
            "nombre": "Armadura de Cuero Grueso (Hide)",
            "armor_bonus": "+1",
            "peso_lbs": 15,
            "costo_gs": 75,
            "notas": "Cubre torso, brazos y piernas. Más gruesa que el cuero regular e aislada, restringe el movimiento. Otorga +2 a las tiradas de Vigor para resistir los efectos del frío, pero sufre una penalización de –1 a la Velocidad y a todas las tiradas de Agilidad y habilidades vinculadas a Agilidad.",
            "disponibilidad": "V",
            "fuente": "[7, 8]"
          },
          "leather_suit": {
            "nombre": "Traje de Cuero (Leather Suit)",
            "armor_bonus": "+1",
            "peso_lbs": 10,
            "costo_gs": 50,
            "notas": "Cubre torso, brazos y piernas. Suave y flexible en las articulaciones, con 'placas' hervidas adheridas a los antebrazos, pecho y parte superior de las piernas.",
            "disponibilidad": "V",
            "fuente": "[7, 9]"
          },
          "leather_shirt": {
            "nombre": "Camisa de Cuero (Leather Shirt)",
            "armor_bonus": "+1",
            "peso_lbs": 3,
            "costo_gs": 20,
            "notas": "Cubre el torso.",
            "disponibilidad": "V",
            "fuente": "[7, 9]"
          },
          "chain_hauberk": {
            "nombre": "Cota de Malla (Hauberk)",
            "armor_bonus": "+2",
            "peso_lbs": 20,
            "costo_gs": 300,
            "notas": "Cubre torso, brazos y piernas. Miles de eslabones de hierro entrelazados.",
            "disponibilidad": "T",
            "fuente": "[7, 8]"
          },
          "chain_shirt": {
            "nombre": "Camisa de Malla (Chain Shirt)",
            "armor_bonus": "+2",
            "peso_lbs": 10,
            "costo_gs": 200,
            "notas": "Cubre torso y brazos. Miles de eslabones de hierro entrelazados.",
            "disponibilidad": "T",
            "fuente": "[7, 8]"
          },
          "chain_leggings": {
            "nombre": "Grebas de Malla (Chain Leggings)",
            "armor_bonus": "+2",
            "peso_lbs": 8,
            "costo_gs": 100,
            "notas": "Cubre las piernas.",
            "disponibilidad": "T",
            "fuente": "[7]"
          },
          "chain_sleeves": {
            "nombre": "Mangas de Malla (Chain Sleeves)",
            "armor_bonus": "+2",
            "peso_lbs": 6,
            "costo_gs": 75,
            "notas": "Cubre los brazos.",
            "disponibilidad": "T",
            "fuente": "[7]"
          },
          "scale_hauberk": {
            "nombre": "Cota de Escamas (Hauberk)",
            "armor_bonus": "+2",
            "peso_lbs": 25,
            "costo_gs": 200,
            "notas": "Cubre torso, brazos y piernas. Más barata que la malla pero más engorrosa; placas de metal remachadas sobre un respaldo de cuero rígido.",
            "disponibilidad": "V",
            "fuente": "[7, 10]"
          },
          "plate_corselet": {
            "nombre": "Corselete de Placas (Plate Corselet)",
            "armor_bonus": "+3",
            "peso_lbs": 20,
            "costo_gs": 400,
            "notas": "Cubre el torso. La armadura más pesada y con mayor protección. El peto, los brazales y las grebas están hechos de acero templado. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.",
            "disponibilidad": "C",
            "fuente": "[7, 9]"
          },
          "plate_bracers": {
            "nombre": "Brazales de Placas (Plate Bracers)",
            "armor_bonus": "+3",
            "peso_lbs": 8,
            "costo_gs": 300,
            "notas": "Cubre los brazos. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.",
            "disponibilidad": "C",
            "fuente": "[7, 9]"
          },
          "plate_greaves": {
            "nombre": "Grebas de Placas (Plate Greaves)",
            "armor_bonus": "+3",
            "peso_lbs": 12,
            "costo_gs": 200,
            "notas": "Cubre las piernas. Debe ser personalizada para el usuario (1h y tirada de Reparar), -1 a tiradas físicas si no está a medida.",
            "disponibilidad": "C",
            "fuente": "[7, 9]"
          },
          "chain_coif": {
            "nombre": "Capucha de Malla (Chain Coif)",
            "armor_bonus": "+2",
            "peso_lbs": 3,
            "costo_gs": 50,
            "notas": "75% de probabilidad de proteger la cabeza.",
            "disponibilidad": "T",
            "fuente": "[11]"
          },
          "pot_helm": {
            "nombre": "Yelmo Cilíndrico (Pot Helm)",
            "armor_bonus": "+3",
            "peso_lbs": 4,
            "costo_gs": 75,
            "notas": "50% de probabilidad de proteger la cabeza.",
            "disponibilidad": "T",
            "fuente": "[11]"
          },
          "full_helmet": {
            "nombre": "Casco Completo (Full Helmet)",
            "armor_bonus": "+3",
            "peso_lbs": 8,
            "costo_gs": 150,
            "notas": "Cubre la cabeza.",
            "disponibilidad": "C",
            "fuente": "[11]"
          },
          "blessed_robes": {
            "nombre": "Túnicas Bendecidas (Blessed Robes)",
            "armor_bonus": "+1",
            "peso_lbs": 8,
            "costo_gs": 50,
            "notas": "Cubre torso, brazos y piernas. Disponible solo para héroes con la Ventaja Fondo Arcano (Milagros) que son sacerdotes. Otros pueden usarlas, pero no obtienen bono de armadura. Solo disponibles en un templo de la deidad apropiada.",
            "disponibilidad": "S",
            "fuente": "[11, 12]"
          },
          "blessed_armor": {
            "nombre": "Armadura Bendecida (Blessed Armor)",
            "armor_bonus": "+3",
            "peso_lbs": 30,
            "costo_gs": 500,
            "notas": "Cubre torso, brazos y piernas. Disponible solo para héroes con la Ventaja Fondo Arcano (Milagros) que son paladines. Si otro intenta usarla, actúa como cota de placas regular (incluyendo peso). Solo disponible en un templo de la deidad apropiada.",
            "disponibilidad": "S",
            "fuente": "[11, 12]"
          },
          "small_shield": {
            "nombre": "Escudo Pequeño (Small Shield)",
            "parry_bonus": "+1",
            "peso_lbs": 8,
            "costo_gs": 25,
            "notas": "Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).",
            "disponibilidad": "V",
            "fuente": "[10, 13]"
          },
          "medium_shield": {
            "nombre": "Escudo Mediano (Medium Shield)",
            "parry_bonus": "+1",
            "armor_bonus_ranged": "+2",
            "peso_lbs": 12,
            "costo_gs": 50,
            "notas": "Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).",
            "disponibilidad": "V",
            "fuente": "[10, 13]"
          },
          "large_shield": {
            "nombre": "Escudo Grande (Large Shield)",
            "parry_bonus": "+2",
            "armor_bonus_ranged": "+2",
            "peso_lbs": 20,
            "costo_gs": 200,
            "notas": "Proporciona su bono de Armadura contra ataques de área de efecto (mágicos o mundanos).",
            "disponibilidad": "T",
            "fuente": "[10, 13]"
          },
          "barding_horse_leather": {
            "nombre": "Barda para Caballo (Cuero)",
            "armor_bonus": "+1",
            "peso_lbs": 15,
            "costo_gs": 200,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "V",
            "fuente": "[8, 13]"
          },
          "barding_horse_plate": {
            "nombre": "Barda para Caballo (Placa)",
            "armor_bonus": "+3",
            "peso_lbs": 30,
            "costo_gs": 1250,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "C",
            "fuente": "[8, 14]"
          },
          "barding_pygmy_mammoth_leather": {
            "nombre": "Barda para Mamut Pigmeo (Cuero)",
            "armor_bonus": "+1",
            "peso_lbs": 25,
            "costo_gs": 400,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "V",
            "fuente": "[8, 14]"
          },
          "barding_pygmy_mammoth_chain": {
            "nombre": "Barda para Mamut Pigmeo (Malla)",
            "armor_bonus": "+2",
            "peso_lbs": 40,
            "costo_gs": 1600,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "T",
            "fuente": "[8, 14]"
          },
          "barding_war_dog_leather": {
            "nombre": "Barda para Perro de Guerra (Cuero)",
            "armor_bonus": "+1",
            "peso_lbs": 3,
            "costo_gs": 50,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "V",
            "fuente": "[8, 14]"
          },
          "barding_war_dog_chain": {
            "nombre": "Barda para Perro de Guerra (Malla)",
            "armor_bonus": "+2",
            "peso_lbs": 10,
            "costo_gs": 250,
            "notas": "Cubre cabeza y torso del animal. Protege la cabeza y el torso del animal. Solo disponible para animales entrenados.",
            "disponibilidad": "T",
            "fuente": "[8, 14]"
          }
        },
        "armas_cuerpo_a_cuerpo": {
          "antler_staff": {
            "nombre": "Báculo de Astas (Antler Staff)",
            "tipo": "Arma Primitiva",
            "damage": "Fuerza+d6",
            "peso_lbs": 10,
            "costo_gs": 300,
            "min_str": "—",
            "notas": "Parada +1; Alcance 1; Requiere 2 manos. Las púas extendidas proporcionan un bono a Parada y un +1 al desarmar. Los atacantes ignoran un punto de bonificación por Superioridad Numérica debido al ancho de las púas. Se rompe con un 1 en el dado de Pelear.",
            "disponibilidad": "V",
            "fuente": "[11, 15-17]"
          },
          "bear_claw": {
            "nombre": "Garra de Oso (Bear Claw)",
            "tipo": "Arma Primitiva",
            "damage": "Fuerza+d4",
            "peso_lbs": 8,
            "costo_gs": 200,
            "min_str": "—",
            "notas": "+1 a Parada. Principalmente utilizada por tribus Vendahl y Finnar. Hecha de una zarpa de oso real. Otorga +1 a Trepar, pero no permite usar la mano para agarrar otros objetos (incluidos escudos). No se puede Desarmar al usuario ni cuenta como Defensor Desarmado. El bono de Trepar se acumula si se usan dos, pero el de Parada no. Se rompe con un 1 en el dado de Pelear.",
            "disponibilidad": "V",
            "fuente": "[11, 16-18]"
          },
          "toothpick_double": {
            "nombre": "Palillo Doble (Toothpick, Double)",
            "tipo": "Arma Primitiva",
            "damage": "Fuerza+d6",
            "peso_lbs": 5,
            "costo_gs": 150,
            "min_str": "—",
            "notas": "Solo entre tribus bárbaras del norte y criaturas como orcos/goblins. Un asta de madera con dos dientes de tigre dientes de sable unidos. Los dientes están a 180 grados, permitiendo invertir el arma si uno se rompe. Con un 1 en el dado de Pelear, solo un diente se rompe. Se rompe con un 1 en el dado de Pelear.",
            "disponibilidad": "V",
            "fuente": "[17, 19, 20]"
          },
          "toothpick_twin": {
            "nombre": "Palillo Gemelo (Toothpick, Twin)",
            "tipo": "Arma Primitiva",
            "damage": "Fuerza+d8",
            "peso_lbs": 5,
            "costo_gs": 200,
            "min_str": "—",
            "notas": "Similar al Palillo Doble, pero ambos dientes unidos al mismo extremo. Inflige más daño, pero con un 1 en el dado de Pelear, ambos dientes se rompen. Se rompe con un 1 en el dado de Pelear.",
            "disponibilidad": "V",
            "fuente": "[17, 19, 20]"
          },
          "boot_spikes": {
            "nombre": "Púas de Bota (Boot Spikes)",
            "tipo": "Hoja",
            "damage": "Fuerza+d4",
            "peso_lbs": 3,
            "costo_gs": 10,
            "min_str": "—",
            "notas": "Solo para ataques de patada. Un personaje con púas de bota trata el hielo rugoso como terreno normal y el hielo liso como hielo rugoso. Otorga +1 a las tiradas de Trepar. Ponerlas o quitarlas toma una acción.",
            "disponibilidad": "V",
            "fuente": "[19, 21]"
          },
          "dagger": {
            "nombre": "Daga (Dagger)",
            "tipo": "Hoja",
            "damage": "Fuerza+d4",
            "peso_lbs": 1,
            "costo_gs": 25,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "flail": {
            "nombre": "Mangual (Flail)",
            "tipo": "Hoja",
            "damage": "Fuerza+d6",
            "peso_lbs": 8,
            "costo_gs": 200,
            "min_str": "—",
            "notas": "Ignora la Parada de escudo y los bonos de Cobertura.",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "great_sword": {
            "nombre": "Espada a Dos Manos (Great Sword)",
            "tipo": "Hoja",
            "damage": "Fuerza+d10",
            "peso_lbs": 12,
            "costo_gs": 400,
            "min_str": "—",
            "notas": "Parada –1; Requiere 2 manos.",
            "disponibilidad": "T",
            "fuente": "[19]"
          },
          "long_sword": {
            "nombre": "Espada Larga (Long Sword)",
            "tipo": "Hoja",
            "damage": "Fuerza+d8",
            "peso_lbs": 8,
            "costo_gs": 300,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "short_sword": {
            "nombre": "Espada Corta (Short Sword)",
            "tipo": "Hoja",
            "damage": "Fuerza+d6",
            "peso_lbs": 4,
            "costo_gs": 200,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "axe": {
            "nombre": "Hacha (Axe)",
            "tipo": "Hacha",
            "damage": "Fuerza+d6",
            "peso_lbs": 2,
            "costo_gs": 200,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "battle_axe": {
            "nombre": "Hacha de Batalla (Battle Axe)",
            "tipo": "Hacha",
            "damage": "Fuerza+d8",
            "peso_lbs": 10,
            "costo_gs": 300,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "great_axe": {
            "nombre": "Hacha Grande (Great Axe)",
            "tipo": "Hacha",
            "damage": "Fuerza+d10",
            "peso_lbs": 15,
            "costo_gs": 400,
            "min_str": "—",
            "notas": "AP 1; Parada –1; Requiere 2 manos.",
            "disponibilidad": "T",
            "fuente": "[19]"
          },
          "mace": {
            "nombre": "Maza (Mace)",
            "tipo": "Martillo y Maza",
            "damage": "Fuerza+d6",
            "peso_lbs": 4,
            "costo_gs": 200,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "maul": {
            "nombre": "Mazo (Maul)",
            "tipo": "Martillo y Maza",
            "damage": "Fuerza+d8",
            "peso_lbs": 20,
            "costo_gs": 400,
            "min_str": "—",
            "notas": "AP 2 contra armadura rígida; Parada –1; Requiere 2 manos.",
            "disponibilidad": "V",
            "fuente": "[19]"
          },
          "warhammer": {
            "nombre": "Martillo de Guerra (Warhammer)",
            "tipo": "Martillo y Maza",
            "damage": "Fuerza+d6",
            "peso_lbs": 8,
            "costo_gs": 250,
            "min_str": "—",
            "notas": "AP 1 contra armadura rígida.",
            "disponibilidad": "T",
            "fuente": "[19]"
          },
          "halberd": {
            "nombre": "Alabarda (Halberd)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d8",
            "peso_lbs": 15,
            "costo_gs": 250,
            "min_str": "—",
            "notas": "Alcance 1; Requiere 2 manos.",
            "disponibilidad": "T",
            "fuente": "[13]"
          },
          "lance": {
            "nombre": "Lanza (Lance)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d8",
            "peso_lbs": 10,
            "costo_gs": 250,
            "min_str": "—",
            "notas": "AP 2 al cargar. Daño basado en la Fuerza de la montura si se usa la maniobra de Carga. Cuando está montado, usa d8 de daño independientemente de la Fuerza del usuario. Alcance 2.",
            "disponibilidad": "T",
            "fuente": "[13, 15]"
          },
          "pike": {
            "nombre": "Pica (Pike)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d8",
            "peso_lbs": 25,
            "costo_gs": 300,
            "min_str": "—",
            "notas": "Alcance 2; Requiere 2 manos.",
            "disponibilidad": "T",
            "fuente": "[13]"
          },
          "spear_long": {
            "nombre": "Lanza Larga (Long Spear)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d6",
            "peso_lbs": 5,
            "costo_gs": 100,
            "min_str": "—",
            "notas": "Parada +1; Alcance 1; Requiere 2 manos.",
            "disponibilidad": "V",
            "fuente": "[13]"
          },
          "spear_short": {
            "nombre": "Lanza Corta (Short Spear)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d6",
            "peso_lbs": 3,
            "costo_gs": 75,
            "min_str": "—",
            "notas": "Alcance 1.",
            "disponibilidad": "V",
            "fuente": "[13]"
          },
          "staff": {
            "nombre": "Báculo (Staff)",
            "tipo": "Arma de Asta",
            "damage": "Fuerza+d4",
            "peso_lbs": 8,
            "costo_gs": 10,
            "min_str": "—",
            "notas": "Parada +1; Alcance 1; Requiere 2 manos.",
            "disponibilidad": "V",
            "fuente": "[13]"
          }
        },
        "armas_a_distancia": {
          "axe_throwing": {
            "nombre": "Hacha Arrojadiza (Throwing Axe)",
            "range": "3/6/12",
            "damage": "Fuerza+d6",
            "costo_gs": 50,
            "peso_lbs": 2,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "bow": {
            "nombre": "Arco (Bow)",
            "range": "12/24/48",
            "damage": "2d6",
            "costo_gs": 100,
            "peso_lbs": 3,
            "min_str": "d6",
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "bow_long": {
            "nombre": "Arco Largo (Long Bow)",
            "range": "15/30/60",
            "damage": "2d6",
            "costo_gs": 200,
            "peso_lbs": 5,
            "min_str": "d8",
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "crossbow": {
            "nombre": "Ballesta (Crossbow)",
            "range": "15/30/60",
            "damage": "2d6",
            "costo_gs": 300,
            "peso_lbs": 10,
            "min_str": "d6",
            "notas": "AP 2; 1 acción para recargar.",
            "disponibilidad": "T",
            "fuente": "[22]"
          },
          "sling": {
            "nombre": "Honda (Sling)",
            "range": "4/8/16",
            "damage": "Fuerza+d4",
            "costo_gs": 10,
            "peso_lbs": 1,
            "min_str": "—",
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "short_spear_throwing": {
            "nombre": "Lanza Corta (Arrojadiza) / Jabalina",
            "range": "3/6/12",
            "damage": "Fuerza+d6",
            "costo_gs": 75,
            "peso_lbs": 3,
            "min_str": "d6",
            "notas": "Igual que la lanza corta en combate cuerpo a cuerpo. También cubre jabalinas.",
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "throwing_knife": {
            "nombre": "Cuchillo Arrojadizo (Throwing Knife)",
            "range": "3/6/12",
            "damage": "Fuerza+d4",
            "costo_gs": 25,
            "peso_lbs": 1,
            "min_str": "—",
            "disponibilidad": "T",
            "fuente": "[22]"
          }
        },
        "municiones": {
          "arrow_armor_piercing": {
            "nombre": "Flecha Perforante (Armor Piercing Arrow)",
            "peso_lbs": "1 lb/5 flechas",
            "costo_gs": 1,
            "notas": "AP 2; se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).",
            "disponibilidad": "V",
            "fuente": "[14, 23]"
          },
          "arrow_fleshripper": {
            "nombre": "Flecha Desgarradora (Fleshripper Arrow)",
            "peso_lbs": "1 lb/5 flechas",
            "costo_gs": 1,
            "notas": "+2 de daño, pero duplica la protección de cualquier armadura que lleve el objetivo (o armadura natural). Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).",
            "disponibilidad": "V",
            "fuente": "[14, 23]"
          },
          "arrow_signaling": {
            "nombre": "Flecha de Señal (Signaling Arrow)",
            "peso_lbs": "1 lb/5 flechas",
            "costo_gs": 2,
            "notas": "Produce un silbido agudo que se puede escuchar a 100\" (200 yardas). Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo). Inventada por los elfos.",
            "disponibilidad": "V",
            "fuente": "[14, 23]"
          },
          "arrow_standard": {
            "nombre": "Flecha Estándar (Standard Arrow)",
            "peso_lbs": "1 lb/5 flechas",
            "costo_gs": 0.5,
            "notas": "Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).",
            "disponibilidad": "V",
            "fuente": "[24]"
          },
          "ballista_bolt": {
            "nombre": "Dardo de Ballesta (Ballista Bolt)",
            "peso_lbs": 1,
            "costo_gs": 4,
            "notas": "Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).",
            "disponibilidad": "T",
            "fuente": "[24]"
          },
          "quarrel": {
            "nombre": "Virote (Quarrel)",
            "peso_lbs": "1 lb/5 virotes",
            "costo_gs": 1,
            "notas": "Se puede recuperar (4-6 en d6 al aire libre, 5-6 en d6 en interiores/subterráneo).",
            "disponibilidad": "T",
            "fuente": "[24]"
          },
          "sling_stone": {
            "nombre": "Piedra de Honda (Sling Stone)",
            "peso_lbs": "1 lb/10 piedras",
            "costo_gs": 0.1,
            "notas": "Se pueden encontrar gratis con una tirada de Notar y 1d10 minutos de búsqueda.",
            "disponibilidad": "V",
            "fuente": "[24]"
          }
        },
        "armas_de_asedio": {
          "notas_generales": "Todas las armas de asedio tienen una disponibilidad de Ciudad (C) y son raras incluso allí. Nunca están disponibles para la compra en asentamientos pequeños, aldeas o pueblos.",
          "ballista": {
            "nombre": "Ballista",
            "range": "25/50/100",
            "damage": "3d6",
            "rof": 1,
            "ap": 3,
            "crew": 1,
            "costo_gs": 800,
            "notas": "Puede usarse contra tropas individuales; 1 acción para recargar.",
            "disponibilidad": "C",
            "fuente": "[25]"
          },
          "catapult": {
            "nombre": "Catapulta",
            "range": "50/100/200*",
            "damage": "3d10",
            "rof": 1,
            "ap": 10,
            "crew": 6,
            "costo_gs": 2000,
            "notas": "4 acciones para recargar; Plantilla de Ráfaga Mediana; Arma Pesada. *Rango mínimo de 25”.",
            "disponibilidad": "C",
            "fuente": "[25]"
          },
          "coldfire_thrower": {
            "nombre": "Lanzallamas de Fuego Frío (Coldfire Thrower)",
            "range": "Cono/25”",
            "damage": "2d10",
            "rof": 1,
            "ap": "Ignora armadura",
            "crew": 1,
            "costo_gs": 3000,
            "notas": "Funciona como un lanzallamas vehicular. Comúnmente llamado 'boca de draco'. Consiste en una caldera de metal y un cañón corto. La leña de hielo (icewood) se coloca en la caldera y se enciende. Consume 1 libra de leña de hielo por uso. La caldera puede contener un máximo de 10 libras. Añadir leña de hielo toma 1 acción por libra (2 libras con éxito, 3 con raise en tirada de Agilidad).",
            "disponibilidad": "C",
            "fuente": "[23, 25, 26]"
          },
          "ram_frame": {
            "nombre": "Ariete (con Armazón) (Ram, Frame)",
            "range": "—",
            "damage": "1d6/yarda",
            "rof": 1,
            "ap": 3,
            "crew": "2/yarda",
            "costo_gs": 750,
            "notas": "Longitud máxima 10 yardas. Diseñado para puertas, no muros. Usualmente un tronco pesado con un extremo de metal. El armazón suele estar cubierto para proteger a las tropas, a menudo con pieles sin tratar o mojadas para evitar el fuego.",
            "disponibilidad": "C",
            "fuente": "[25, 27, 28]"
          },
          "ram_hand": {
            "nombre": "Ariete (Manual) (Ram, Hand)",
            "range": "—",
            "damage": "1d6/yarda",
            "rof": 1,
            "ap": 3,
            "crew": "4/yarda",
            "costo_gs": 400,
            "notas": "Longitud máxima 10 yardas. Diseñado para puertas, no muros. Usualmente un tronco pesado con un extremo de metal.",
            "disponibilidad": "C",
            "fuente": "[25, 27, 28]"
          },
          "siege_tower": {
            "nombre": "Torre de Asedio (Siege Tower)",
            "range": "—",
            "damage": "—",
            "rof": 1,
            "ap": "—",
            "crew": 20,
            "costo_gs": 3500,
            "notas": "Velocidad 2; transporta 30 tropas. Pasarelas protegidas usadas solo en asedios. Una estructura de madera de 10 yardas de alto sobre una base con ruedas. Las paredes están cubiertas de pieles y empapadas en agua. Un puente abatible en la parte superior se baja sobre las almenas enemigas. Moverla es un trabajo agotador; no se puede correr.",
            "disponibilidad": "C",
            "fuente": "[25, 28, 29]"
          },
          "trebuchet": {
            "nombre": "Trabucador (Trebuchet)",
            "range": "24/48/96**",
            "damage": "3d8",
            "rof": 1,
            "ap": 6,
            "crew": 4,
            "costo_gs": 1600,
            "notas": "2 acciones para recargar; Plantilla de Ráfaga Pequeña; Arma Pesada. **Rango mínimo de 12”.",
            "disponibilidad": "C",
            "fuente": "[25]"
          }
        },
        "equipo_mundano_general": {
          "backpack": {
            "nombre": "Mochila (Backpack)",
            "peso_lbs": 2,
            "costo_gs": 5,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "bedroll": {
            "nombre": "Saco de Dormir (Bedroll)",
            "peso_lbs": 4,
            "costo_gs": 25,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "blanket": {
            "nombre": "Manta (Blanket)",
            "peso_lbs": 4,
            "costo_gs": 10,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "crowbar": {
            "nombre": "Palanca (Crowbar)",
            "peso_lbs": 2,
            "costo_gs": 10,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "flask_ceramic": {
            "nombre": "Petaca de Cerámica (Flask, Ceramic)",
            "peso_lbs": 1,
            "costo_gs": 5,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "flask_metal": {
            "nombre": "Petaca de Metal (Flask, Metal)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "disponibilidad": "T",
            "fuente": "[30]"
          },
          "flint_and_steel": {
            "nombre": "Pedernal y Esmeril (Flint and Steel)",
            "peso_lbs": 1,
            "costo_gs": 3,
            "disponibilidad": "V",
            "fuente": "[31]"
          },
          "hammer": {
            "nombre": "Martillo (Hammer)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "disponibilidad": "V",
            "fuente": "[31]"
          },
          "oil_1_pint": {
            "nombre": "Aceite (1 pinta) (Oil, 1 Pint)",
            "peso_lbs": 1,
            "costo_gs": 2,
            "notas": "Además de iluminar linternas, puede usarse como arma (en frasco cerámico con mecha encendida). Rango 3/6/12. Al golpear, un 5-6 en d6 enciende al objetivo, causando 1d10 de daño por ronda. La mecha tarda 1d6 rondas en encenderse (1 ronda con llama abierta).",
            "disponibilidad": "V",
            "fuente": "[31, 32]"
          },
          "parchment": {
            "nombre": "Pergamino (Parchment)",
            "peso_lbs": "1/20 lb por hoja",
            "costo_gs": 1,
            "disponibilidad": "V",
            "fuente": "[22]"
          },
          "pick_or_shovel": {
            "nombre": "Pico o Pala (Pick or Shovel)",
            "peso_lbs": 5,
            "costo_gs": 5,
            "notas": "Los picos son armas desequilibradas y aplican -1 a la Parada y Pelear del usuario. Su daño es Fuerza+d6.",
            "disponibilidad": "V",
            "fuente": "[33, 34]"
          },
          "pipe_smoking": {
            "nombre": "Pipa para Fumar (Pipe, Smoking)",
            "peso_lbs": "1/5 lb",
            "costo_gs": 3,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "pipeleaf_5_smokes": {
            "nombre": "Hoja de Pipa (5 fumadas por bolsa) (Pipeleaf, 5 Smokes per Pouch)",
            "peso_lbs": "—",
            "costo_gs": 15,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "pouch": {
            "nombre": "Bolsa (Pouch)",
            "peso_lbs": "1/2 lb",
            "costo_gs": 2,
            "notas": "Capacidad: 1 libra.",
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "quiver": {
            "nombre": "Carjaj (Quiver)",
            "peso_lbs": 2,
            "costo_gs": 10,
            "notas": "Capacidad: 20 flechas.",
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "rope_hemp_50_feet": {
            "nombre": "Cuerda (Cáñamo, 50 pies) (Rope, Hemp, 5')",
            "peso_lbs": 10,
            "costo_gs": 10,
            "notas": "Puede soportar con seguridad 300 libras. Por cada 50 libras adicionales, tira 1d6 cada minuto o ante un estrés repentino. Con un 6, la cuerda se rompe.",
            "disponibilidad": "V",
            "fuente": "[33, 34]"
          },
          "salt_waterproof_bag": {
            "nombre": "Sal (en bolsa impermeable) (Salt, in Waterproof Bag)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "notas": "Una libra de sal esparcida sobre un cuadrado de hielo de 1\" reduce el grosor en un nivel. Reducir el hielo por debajo de 'muy fino' lo derrite por completo.",
            "disponibilidad": "V",
            "fuente": "[33, 35]"
          },
          "sandglass": {
            "nombre": "Reloj de Arena (Sandglass)",
            "peso_lbs": 1,
            "costo_gs": 25,
            "notas": "Relojes primitivos que registran los 'gates' (períodos de 3 horas) en los que se divide el día.",
            "disponibilidad": "C",
            "fuente": "[33, 35]"
          },
          "satchel_waterproof": {
            "nombre": "Talego Impermeable (Satchel, Waterproof)",
            "peso_lbs": 1,
            "costo_gs": 50,
            "disponibilidad": "T",
            "fuente": "[33]"
          },
          "scroll_case_waterproof": {
            "nombre": "Estuche para Pergaminos Impermeable (Scroll Case, Waterproof)",
            "peso_lbs": "1/2 lb",
            "costo_gs": 5,
            "disponibilidad": "T",
            "fuente": "[33]"
          },
          "soap": {
            "nombre": "Jabón (Soap)",
            "peso_lbs": "1/5 lb",
            "costo_gs": 1,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "whistle": {
            "nombre": "Silbato (Whistle)",
            "peso_lbs": "—",
            "costo_gs": 2,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "waterskin": {
            "nombre": "Odre (Waterskin)",
            "peso_lbs": 1,
            "costo_gs": 5,
            "notas": "Capacidad: 2 cuartos de galón.",
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "whetstone": {
            "nombre": "Piedra de Afilar (Whetstone)",
            "peso_lbs": 1,
            "costo_gs": 5,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "writing_equipment": {
            "nombre": "Equipo de Escritura (Writing Equipment)",
            "peso_lbs": 1,
            "costo_gs": 30,
            "disponibilidad": "T",
            "fuente": "[36]"
          }
        },
        "equipo_mundano_especializado": {
          "alchemical_device": {
            "nombre": "Dispositivo Alquímico (Alchemical Device)",
            "peso_lbs": 1,
            "costo_gs": "200/Rango del hechizo",
            "notas": "Dispositivo de un solo uso que contiene un hechizo (pociones, pergaminos, gemas, plumas, polvos, aceites, etc.). El héroe elige un solo hechizo al comprarlo. Los hechizos que requieren tirada de objetivo usan Disparar o Lanzar. Los hechizos son siempre la variedad más básica. Los fabricados por personajes creadores pueden ser más efectivos. Los dispositivos alquímicos se detectan como elementos mágicos por el tacto.",
            "disponibilidad": "V",
            "fuente": "[29, 36-38]"
          },
          "alchemist_trunk": {
            "nombre": "Baúl de Alquimista (Alchemist's Trunk)",
            "peso_lbs": 15,
            "costo_gs": 300,
            "notas": "Laboratorio portátil con lámpara de aceite, vasos de vidrio, tubos, alambiques, pinzas, pipetas y una tabla de referencia de minerales y hierbas comunes. Crea dispositivos alquímicos sin penalización (-2 de penalización sin él).",
            "disponibilidad": "C",
            "fuente": "[36, 39]"
          },
          "bandolier": {
            "nombre": "Bandolera (Bandolier)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "notas": "Cinturón de tela con una docena de ranuras para pociones, pergaminos o cuchillos arrojadizos, para fácil acceso. Se puede usar alrededor de la cintura o cruzado en el pecho.",
            "disponibilidad": "T",
            "fuente": "[30, 39]"
          },
          "candle": {
            "nombre": "Vela (Candle)",
            "peso_lbs": "1/2 lb",
            "costo_gs": 1,
            "notas": "Proporciona luz clara en un radio de 2\" durante dos horas. Se apaga con viento fuerte o si el personaje que la sostiene corre. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.",
            "disponibilidad": "V",
            "fuente": "[21, 30, 40]"
          },
          "climbing_gear": {
            "nombre": "Equipo de Escalada (Climbing Gear)",
            "peso_lbs": 4,
            "costo_gs": 50,
            "notas": "Incluye un pequeño martillo/pico, clavos y guantes. No incluye cuerda ni púas de bota. Otorga +2 a las tiradas de Trepar.",
            "disponibilidad": "V",
            "fuente": "[21, 30]"
          },
          "firewood_per_pound": {
            "nombre": "Leña (por libra) (Firewood, per Pound)",
            "peso_lbs": 1,
            "costo_gs": 5,
            "notas": "Quemar leña crea un fuego de 1\" de diámetro. Una hoguera (usa 1 libra cada dos horas) eleva la temperatura dos niveles en una Plantilla de Ráfaga Grande centrada en el fuego.",
            "disponibilidad": "V",
            "fuente": "[21, 30]"
          },
          "game_set": {
            "nombre": "Juego de Mesa (Game Set)",
            "peso_lbs": 1,
            "costo_gs": 50,
            "notas": "Los juegos de mesa varían: ajedrez, zorros y sabuesos, backgammon, damas. Cada juego requiere un set diferente. El costo es por set.",
            "disponibilidad": "V",
            "fuente": "[31, 41]"
          },
          "goggles": {
            "nombre": "Gafas (Goggles)",
            "peso_lbs": 2,
            "costo_gs": 25,
            "notas": "Duplican el tiempo antes de tener que hacer tiradas para evitar la ceguera por nieve. Las tiradas de Notar que implican la vista se hacen con –2 debido al tinte pesado.",
            "disponibilidad": "T",
            "fuente": "[31, 41]"
          },
          "grappling_hook": {
            "nombre": "Garra de Escalada y Cuerda (Grappling Hook and Line)",
            "peso_lbs": 2,
            "costo_gs": 50,
            "notas": "Un gancho unido a una línea ligera (usualmente no más de 15 yardas). Se lanza como un ataque (rango 3/6/12). Si 'golpea', el gancho se fija y puede soportar hasta 200 libras.",
            "disponibilidad": "V",
            "fuente": "[31, 42]"
          },
          "healers_bag": {
            "nombre": "Bolsa de Sanador (Healer's Bag)",
            "peso_lbs": 2,
            "costo_gs": 100,
            "notas": "Un personaje que intente curar a alguien sin vendajes, hierbas, ungüentos y cataplasmas sufre una penalización de –2 a su tirada de Curar. Esto no afecta al hechizo Curación.",
            "disponibilidad": "V",
            "fuente": "[31, 42]"
          },
          "herbalist_kit": {
            "nombre": "Kit de Herborista (Herbalist's Kit)",
            "peso_lbs": 3,
            "costo_gs": 100,
            "notas": "Contiene olla de hierro, cuchillos, mortero y mazo, y frascos de almacenamiento de arcilla. Un personaje que intente preparar remedios herbales sin un kit sufre una penalización de –2 a sus tiradas de Conocimiento (Alquimia).",
            "disponibilidad": "V",
            "fuente": "[36, 43]"
          },
          "herbal_remedy_any": {
            "nombre": "Remedio Herbal (cualquiera) (Herbal Remedy, Any)",
            "peso_lbs": 1,
            "costo_gs": 50,
            "notas": "Detallados en el Capítulo 3. El héroe elige un efecto de la lista. Son efectivos solo por una semana (8 días). No generan repercusiones mágicas, ni están sujetos al Sifonamiento, ni pueden ser disipados. No se detectan como magia al tacto. Ejemplos de efectos: Anti-anemia, Anti-inflamatorio, Antibacterial, Antihistamínico, Antitoxina, Berserk, Sustituto de Alimentos, Curación (Específico), Entumecimiento, Purgativo, Restaurador, Soporífico, Estimulante I, Calentamiento.",
            "disponibilidad": "V",
            "fuente": "[36, 42, 44-53]"
          },
          "herbs_dried": {
            "nombre": "Hierbas Secas (Herbs, Dried)",
            "peso_lbs": 1,
            "costo_gs": "5 por lote",
            "notas": "Pueden usarse para hacer remedios herbales, pero dan una penalización de –2 a las tiradas de Conocimiento (Alquimia).",
            "disponibilidad": "V",
            "fuente": "[36, 43]"
          },
          "icewood_per_pound": {
            "nombre": "Leña de Hielo (por libra) (Icewood, per Pound)",
            "peso_lbs": 1,
            "costo_gs": 25,
            "notas": "Cosechada solo del Bosque Congelado. Cuando se enciende, arde con una llama de fuego frío. Una hoguera de leña de hielo (usa 1 libra cada dos horas) baja la temperatura dos niveles en una Plantilla de Ráfaga Grande. Solo se encuentra a la venta en las Tierras Libres de Icedale o en un asentamiento enano.",
            "disponibilidad": "S",
            "fuente": "[31, 43, 54]"
          },
          "insect_net_1_inch_square": {
            "nombre": "Mosquitera (1\" cuadrada) (Insect Net, 1\" Square)",
            "peso_lbs": 3,
            "costo_gs": 15,
            "notas": "En verano, las tierras húmedas del Hearthlands zumban con mosquitos, mientras que las ciudades sufren plagas de moscas. Mantiene un cuadrado de 1\" libre de insectos.",
            "disponibilidad": "V",
            "fuente": "[31, 54]"
          },
          "lantern": {
            "nombre": "Linterna (Lantern)",
            "peso_lbs": 3,
            "costo_gs": 25,
            "notas": "Proporciona luz en un radio de 4\" durante tres horas por pinta de aceite. Hay un 50% de probabilidad de que se rompa si se cae, y una probabilidad de 1 en 6 de que encienda materiales combustibles normales. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.",
            "disponibilidad": "T",
            "fuente": "[31, 40, 54]"
          },
          "lantern_bullseye": {
            "nombre": "Linterna de Ojo de Buey (Lantern, Bullseye)",
            "peso_lbs": 3,
            "costo_gs": 50,
            "notas": "Actúa como una linterna normal, pero tiene una campana reflectante que puede enfocar la luz a través de una pequeña abertura. Cuando se usa de esta manera, proporciona un cono de luz igual a la Plantilla de Cono. 50% de probabilidad de romperse si se cae. Las fuentes de luz proyectan luz tenue (-1) hasta el doble del radio listado, y oscuridad (-2) hasta el triple del radio.",
            "disponibilidad": "T",
            "fuente": "[31, 40, 54]"
          },
          "lockpicks": {
            "nombre": "Ganzúas (Lockpicks)",
            "peso_lbs": 1,
            "costo_gs": 150,
            "notas": "Un personaje que intente forzar una cerradura sin estas herramientas sufre una penalización de –2 a su tirada.",
            "disponibilidad": "T",
            "fuente": "[31, 55]"
          },
          "musical_instrument": {
            "nombre": "Instrumento Musical (Musical Instrument)",
            "peso_lbs": "1+ lbs",
            "costo_gs": "50+",
            "notas": "Incluye flautas (50 gs/1 lb), liras (150 gs/2 lbs), tambores (75 gs/3 lbs), gaitas (250 gs/5 lbs), laúdes (200 gs/3 lbs) y arpas pequeñas (300 gs/6 lbs). Tocar un instrumento requiere una tirada de Agilidad. Se aplica una penalización de –2 si el héroe no tiene entrenamiento musical obvio. El costo y el peso varían según el instrumento específico.",
            "disponibilidad": "V",
            "fuente": "[31, 55]"
          },
          "norn_charm": {
            "nombre": "Amuleto Norn (Norn Charm)",
            "peso_lbs": 1,
            "costo_gs": 250,
            "notas": "Runas del destino talladas en piedras planas o trozos de corteza. Cada amuleto es de un solo uso y contiene 1 benny. El benny se puede usar exactamente como un benny normal.",
            "disponibilidad": "S",
            "fuente": "[36, 55]"
          },
          "skates_pair": {
            "nombre": "Patines (par) (Skates, Pair)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "notas": "Un héroe que usa patines trata el hielo liso como terreno normal. Rueda un tipo de dado más alto (típicamente un d8) al 'correr' sobre hielo liso. En otro terreno, su Velocidad se reduce a la mitad (mínimo de 1) y no puede correr. Ponerlos o quitarlos toma una acción.",
            "disponibilidad": "V",
            "fuente": "[33, 35]"
          },
          "skis_pair": {
            "nombre": "Esquís (par) (Skis, Pair)",
            "peso_lbs": 6,
            "costo_gs": 40,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "snowshoes_pair": {
            "nombre": "Raquetas de Nieve (par) (Snowshoes, Pair)",
            "peso_lbs": 4,
            "costo_gs": 20,
            "disponibilidad": "V",
            "fuente": "[33]"
          },
          "tome_of_learning": {
            "nombre": "Tomo de Aprendizaje (Tome of Learning)",
            "peso_lbs": 1,
            "costo_gs": "1,000/Rango del hechizo",
            "notas": "Libro mágico que describe el proceso para lanzar un único hechizo. Un mago puede aprender el contenido aunque no sea del Rango suficiente. El hechizo debe estar disponible para el Fondo Arcano. No existen tomos de runas. Después de 2d6 días de estudio y una tirada exitosa de Astucia, el héroe añade el hechizo a su repertorio. El contenido se borra permanentemente del libro. Disponible solo en ciudades con templos a Maera o donde se reúnen magos (ej. skalds en Scathmoor, elementalistas en Imperial City).",
            "disponibilidad": "S",
            "fuente": "[36, 56-58]"
          },
          "tome_of_lore_plus1_to_plus3": {
            "nombre": "Tomo de Saber (+1 a +3) (Tome of Lore, +1 to +3)",
            "peso_lbs": "1-3 lbs",
            "costo_gs": "500/punto",
            "notas": "Libro de referencia que otorga un bono a una habilidad de Conocimiento específica (+1 a +6). +1 es el más común, +6 el más raro. Los bonos superiores a +3 no se pueden comprar sin permiso del GM. Se debe leer por una hora por cada +1 de bono. El bono se pierde al usarlo, al dormir o después de 24h. Disponible en ciudades con templos a Hoenir o donde los Lorekeepers tienen fuerte presencia.",
            "disponibilidad": "S",
            "fuente": "[36, 58-60]"
          },
          "tome_of_lore_plus4_to_plus6": {
            "nombre": "Tomo de Saber (+4 a +6) (Tome of Lore, +4 to +6)",
            "peso_lbs": "4-6 lbs",
            "costo_gs": "2,000/punto",
            "notas": "Libro de referencia que otorga un bono a una habilidad de Conocimiento específica (+1 a +6). +1 es el más común, +6 el más raro. Los bonos superiores a +3 no se pueden comprar sin permiso del GM. Se debe leer por una hora por cada +1 de bono. El bono se pierde al usarlo, al dormir o después de 24h. Disponible en ciudades con templos a Hoenir o donde los Lorekeepers tienen fuerte presencia. Precios aumentan dramáticamente para estos bonos.",
            "disponibilidad": "S",
            "fuente": "[36, 58-60]"
          },
          "whale_blubber": {
            "nombre": "Grasa de Ballena (Whale Blubber)",
            "peso_lbs": 1,
            "costo_gs": 25,
            "notas": "Esta sustancia grasosa se unta sobre la piel para proporcionar aislamiento contra el frío. Cada libra proporciona +1 a las tiradas de Vigor para resistir los efectos del clima frío durante 4 horas. Solo se puede aplicar una dosis a la vez.",
            "disponibilidad": "S",
            "fuente": "[33, 61]"
          }
        },
        "comida_y_agua": {
          "average_meal": {
            "nombre": "Comida Promedio (Average Meal)",
            "peso_lbs": "—",
            "costo_gs": 2,
            "disponibilidad": "T",
            "fuente": "[36]"
          },
          "cheap_meal": {
            "nombre": "Comida Barata (Cheap Meal)",
            "peso_lbs": "—",
            "costo_gs": "5 ss",
            "disponibilidad": "V",
            "fuente": "[36]"
          },
          "expensive_meal": {
            "nombre": "Comida Cara (Expensive Meal)",
            "peso_lbs": "—",
            "costo_gs": "20+",
            "disponibilidad": "T",
            "fuente": "[36]"
          },
          "one_weeks_rations": {
            "nombre": "Raciones para una Semana (One Week's Rations)",
            "peso_lbs": 5,
            "costo_gs": 10,
            "disponibilidad": "V",
            "fuente": "[36]"
          },
          "one_days_water_2_quarts": {
            "nombre": "Agua para un Día (2 cuartos) (One Day's Water, 2 Quarts)",
            "peso_lbs": 4,
            "costo_gs": "—",
            "disponibilidad": "V",
            "fuente": "[36]"
          }
        },
        "animales_y_aparejos": {
          "dog_war": {
            "nombre": "Perro de Guerra (Dog, War)",
            "costo_gs": 200,
            "notas": "Entrenado para la guerra.",
            "disponibilidad": "V",
            "fuente": "[30, 61]"
          },
          "hawk": {
            "nombre": "Halcón (Hawk)",
            "costo_gs": 350,
            "disponibilidad": "T",
            "fuente": "[30]"
          },
          "horse_riding": {
            "nombre": "Caballo de Monta (Horse, Riding)",
            "costo_gs": 300,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "horse_war": {
            "nombre": "Caballo de Guerra (Horse, War)",
            "costo_gs": 1000,
            "notas": "Entrenado para la guerra.",
            "disponibilidad": "T",
            "fuente": "[30, 61]"
          },
          "mammoth_pygmy": {
            "nombre": "Mamut Pigmeo (Mammoth, Pygmy)",
            "costo_gs": 3000,
            "notas": "Entrenado para la guerra.",
            "disponibilidad": "T",
            "fuente": "[30, 61]"
          },
          "mule": {
            "nombre": "Mula (Mule)",
            "costo_gs": 150,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "pigeon_carrier": {
            "nombre": "Paloma Mensajera (Pigeon, Carrier)",
            "peso_lbs": 1,
            "costo_gs": 10,
            "notas": "Una paloma mensajera se usa para transportar mensajes a una sola ubicación. El peso incluye una pequeña jaula de mimbre. La paloma puede volar 100 millas al día.",
            "disponibilidad": "T",
            "fuente": "[30, 34]"
          },
          "saddle": {
            "nombre": "Silla de Montar (Saddle)",
            "peso_lbs": 10,
            "costo_gs": 30,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "saddle_war": {
            "nombre": "Silla de Montar de Guerra (Saddle, War)",
            "peso_lbs": 10,
            "costo_gs": 200,
            "notas": "Hecha a medida. Otorga un bono de +1 a las tiradas de Montar para permanecer en la silla.",
            "disponibilidad": "C",
            "fuente": "[30, 35]"
          }
        },
        "vestimenta": {
          "normal_clothing": {
            "nombre": "Ropa Normal (Normal Clothing)",
            "peso_lbs": "—",
            "costo_gs": 10,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "formal_clothing": {
            "nombre": "Ropa Formal (Formal Clothing)",
            "peso_lbs": "—",
            "costo_gs": 75,
            "disponibilidad": "V",
            "fuente": "[30]"
          },
          "tailored_clothing": {
            "nombre": "Ropa a Medida (Tailored Clothing)",
            "peso_lbs": "—",
            "costo_gs": 250,
            "notas": "Normalmente usada por nobles y dignatarios, otorga al usuario +1 de Carisma siempre que la ropa sea completamente visible.",
            "disponibilidad": "T",
            "fuente": "[30, 56]"
          },
          "furs": {
            "nombre": "Pieles (Furs)",
            "peso_lbs": 5,
            "costo_gs": 50,
            "notas": "Otorga +1 a las tiradas de Vigor para resistir los efectos del Frío. El modificador se acumula con la ropa de invierno.",
            "disponibilidad": "V",
            "fuente": "[30, 41]"
          },
          "winter_clothing": {
            "nombre": "Ropa de Invierno (Winter Clothing)",
            "peso_lbs": 10,
            "costo_gs": 100,
            "notas": "Capas cálidas, ropa interior de lana, botas y guantes de piel. Otorga +2 a las tiradas de Vigor para resistir el clima frío.",
            "disponibilidad": "V",
            "fuente": "[30, 62]"
          }
        },
        "vehiculos": {
          "busse": {
            "nombre": "Busse",
            "descripcion": "Lento a remo, pero con gran capacidad de carga, ideal para actividades mercantiles.",
            "velocidad": "Acel: 1/Vel. Máx: 5 (2/8 a vela)",
            "dureza": "12 (2)",
            "manejo": "–1",
            "tripulacion": "40 + 5",
            "costo_gs": 3000,
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "T",
            "fuente": "[63]"
          },
          "drakkar": {
            "nombre": "Drakkar",
            "descripcion": "Un pequeño drakkar, ideal para incursiones costeras y navegación en ríos poco profundos. Acelera bien a remo o vela.",
            "velocidad": "Acel: 4/Vel. Máx: 10 (5/12 a vela)",
            "dureza": "14 (2)",
            "manejo": "–1",
            "tripulacion": "60 + 10",
            "costo_gs": 6000,
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "T",
            "fuente": "[64]"
          },
          "galley": {
            "nombre": "Galera (Galley)",
            "descripcion": "No favorecida por las razas civilizadas desde antes de la Guerra de la Ventisca; solo los orcos la usan. Lenta a vela, pero muy rápida a remo por periodos cortos.",
            "velocidad": "Acel: 2/Vel. Máx: 8 (remada) (1/3 a vela)",
            "dureza": "19 (4)",
            "manejo": "–2",
            "tripulacion": "30 + 100 esclavos de galera",
            "costo_gs": 8000,
            "notas": "Armadura Pesada (no está realmente blindada, pero es lo suficientemente masiva como para requerir armas pesadas para dañarla).",
            "armamento": [
              "**Pequeña Catapulta:** Rango 24/48/96; Daño 3d6; RoF 1; AP 4; Plantilla de Ráfaga Pequeña; AP 2, Arma Pesada.",
              "**Ariete:** Arma Pesada. Otorga al barco AP 4 y reduce a la mitad el daño recibido al embestir otro barco."
            ],
            "disponibilidad": "C",
            "fuente": "[64, 65]"
          },
          "horse_and_carriage": {
            "nombre": "Caballo y Carroza (Horse and Carriage)",
            "descripcion": "Incluye coches, carros, vagones engro y otros vehículos tirados por caballos. Los mamuts pigmeos también pueden tirar de ellos. Poco útiles en nieve, barro profundo o hielo delgado sin aparejo de hielo.",
            "velocidad": "Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera",
            "dureza": "10 (2) para vagón/carroza",
            "manejo": "—",
            "tripulacion": "1 + 4 (carroza) o 1/10 (vagón)",
            "costo_gs": "500-1000 (carroza) o 100 (vagón)",
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "V (carrozas), T (vagones)",
            "fuente": "[65]"
          },
          "knarr": {
            "nombre": "Knarr",
            "descripcion": "Embarcación de manga ancha, pequeña para combate o comercio. Relativamente barata y la más común en los mares. También se usa en ríos navegables por su capacidad de carga, pero es lenta.",
            "velocidad": "Acel: 2/Vel. Máx: 4 (2/6 a vela)",
            "dureza": "14 (2)",
            "manejo": "–2",
            "tripulacion": "20 + 4",
            "costo_gs": 5000,
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "T",
            "fuente": "[66]"
          },
          "river_barge": {
            "nombre": "Barcaza de Río (River Barge)",
            "descripcion": "Mencionado, pero sin descripción detallada en las fuentes.",
            "velocidad": "—",
            "dureza": "—",
            "manejo": "—",
            "tripulacion": "—",
            "costo_gs": "—",
            "disponibilidad": "—",
            "fuente": "[66]"
          },
          "skeid": {
            "nombre": "Skeid",
            "descripcion": "El buque de guerra más potente, el doble de grande que un drakkar. Su construcción y mantenimiento son muy costosos.",
            "velocidad": "Acel: 2/Vel. Máx: 10 (2/12 a vela)",
            "dureza": "18 (4)",
            "manejo": "–1",
            "tripulacion": "200 + 10",
            "costo_gs": 15000,
            "notas": "Armadura Pesada.",
            "disponibilidad": "T",
            "fuente": "[67]"
          },
          "smabyrding": {
            "nombre": "Smabyrding",
            "descripcion": "Pequeña embarcación, ideal para ríos o viajes costeros cortos. Se maneja mal en mar abierto. Lenta a remo y vela.",
            "velocidad": "Acel: 2/Vel. Máx: 5 (2/6 a vela)",
            "dureza": "10 (2)",
            "manejo": "+1 (costero o fluvial)/–2 (mar abierto)",
            "tripulacion": "10 + 4",
            "costo_gs": 2500,
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "T",
            "fuente": "[67]"
          },
          "snekke": {
            "nombre": "Snekke",
            "descripcion": "El arquetipo de drakkar, con proa de dragón. Diseñado para mares agitados, pero también puede navegar ríos poco profundos. El buque de guerra más común, favorecido por Saxa y Anari.",
            "velocidad": "Acel: 2/Vel. Máx: 8 (2/10 a vela)",
            "dureza": "15 (2)",
            "manejo": "+1",
            "tripulacion": "100 + 10",
            "costo_gs": 8000,
            "notas": "Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "T",
            "fuente": "[68]"
          },
          "sledge": {
            "nombre": "Trineo (Sledge)",
            "descripcion": "Trineo estándar para transportar pequeñas cantidades de equipo o pasajeros. Los orcos usan lobos huargos, que también sirven de protección.",
            "velocidad": "Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera",
            "dureza": 6,
            "manejo": "+0",
            "tripulacion": "1 + 2 pasajeros",
            "costo_gs": 50,
            "notas": "Tirado por 2 animales (usualmente caballos o lobos huargos). Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "V",
            "fuente": "[69]"
          },
          "war_sledge": {
            "nombre": "Trineo de Guerra (War Sledge)",
            "descripcion": "Trineo con estructura de madera y pieles de animales clavadas para proteger a los ocupantes. Las solapas permiten disparar ballestas o lanzar lanzas.",
            "velocidad": "Acel: Media de la Velocidad del animal/Vel. Máx: Velocidad del animal + carrera",
            "dureza": "8 (2)",
            "manejo": "–1",
            "tripulacion": "1 + 4 pasajeros",
            "costo_gs": 200,
            "notas": "Tirado por 2 animales (usualmente lobos huargos o mulas). Requiere aparejo de hielo para nieve/hielo.",
            "disponibilidad": "V",
            "fuente": "[70]"
          }
        },
        "fortificaciones": {
          "notas_generales": "Las fortificaciones no tienen código de disponibilidad; rara vez están a la venta. Aplican notas sobre Dureza (paredes son Armadura Pesada, cada herida crea una brecha de 1\"), Bono de Asedio (modificador a tiradas de Batalla y Moral del defensor), Defensores (número habitual de guardias, se duplica con aviso de ataque (+1 Bono de Asedio, reduce suministros a la mitad)), Suministros (semanas de provisiones para los defensores, se duplica con tiempo de preparación), y Costo (guía para GM, +25% en territorio sin dueño para guardias de construcción). Nobles o personajes Ricos/Muy Ricos pueden poseerlas/construirlas, pero deben cubrir gastos anuales del 2% del costo si no tienen tierras/industrias de apoyo.",
          "fortified_manor_house": {
            "nombre": "Casa Señorial Fortificada (Fortified Manor House)",
            "descripcion": "Hogar de nobles menores o terratenientes ricos. Estructuras de piedra de dos pisos sin defensas exteriores (excepto zanjas/muros bajos). Talleres, establos y barracones en dependencias separadas. Techos de pizarra o madera para protección.",
            "dureza": "20 (10)",
            "bono_asedio": "+1",
            "defensores": 10,
            "suministros_semanas": 6,
            "costo_gs": 20000,
            "disponibilidad": "—",
            "fuente": "[71, 72]"
          },
          "hill_fort": {
            "nombre": "Castillo en Colina (Hill Fort)",
            "descripcion": "Construidos como refugio para los lugareños en tiempos de guerra, principalmente por los Saxa. Carecen de muros defensivos fuertes, hechos de fosos concéntricos y terraplenes altos, coronados con una empalizada de madera. Entrada protegida por un laberinto de movimientos de tierra. Pueblos permanentes pueden existir en los más grandes.",
            "dureza": "38 (18)",
            "bono_asedio": "+2",
            "defensores": 400,
            "suministros_semanas": 20,
            "costo_gs": 250000,
            "disponibilidad": "—",
            "fuente": "[72, 73]"
          },
          "large_castle": {
            "nombre": "Castillo Grande (Large Castle)",
            "descripcion": "Comprende una torre central (usualmente cuadrada), un gran patio con establos, talleres y barracones, una alta muralla protegida en las esquinas con torres, y un foso.",
            "dureza": "50 (25)",
            "bono_asedio": "+3",
            "defensores": 300,
            "suministros_semanas": 26,
            "costo_gs": 750000,
            "disponibilidad": "—",
            "fuente": "[73, 74]"
          },
          "motte_and_bailey": {
            "nombre": "Castillo de Motte y Bailey (Motte and Bailey)",
            "descripcion": "Consiste en una pequeña torre o fortaleza, usualmente en una colina, rodeada por un terraplén con un muro de madera o piedra. Las versiones más grandes se dividen en dos niveles. Los fuertes de los Hearth Knights usan este diseño (100 Caballeros de guarnición).",
            "dureza": "25 (10)",
            "bono_asedio": "+1",
            "defensores": 50,
            "suministros_semanas": 12,
            "costo_gs": 60000,
            "disponibilidad": "—",
            "fuente": "[74]"
          },
          "small_castle": {
            "nombre": "Castillo Pequeño (Small Castle)",
            "descripcion": "Comprende una torre central (usualmente cuadrada), un pequeño patio con talleres y barracones, un muro cortina de piedra, y frecuentemente, un foso o zanja.",
            "dureza": "32 (18)",
            "bono_asedio": "+2",
            "defensores": 100,
            "suministros_semanas": 26,
            "costo_gs": 275000,
            "disponibilidad": "—",
            "fuente": "[75]"
          },
          "stone_tower": {
            "nombre": "Torre de Piedra (Stone Tower)",
            "descripcion": "Precursora del motte y bailey, carece de defensas de tierra. Usualmente de 20 a 30 pies de altura, con varios niveles. La mayoría son el hogar de magos o nobles pobres.",
            "dureza": "20 (10)",
            "bono_asedio": "+1",
            "defensores": 10,
            "suministros_semanas": 4,
            "costo_gs": 15000,
            "disponibilidad": "—",
            "fuente": "[75]"
          }
        }
      }
};

const initialThread: (Omit<NarrativeThread, 'id'> & { id: string }) = {
    id: "thread-1",
    campaignId: "1",
    authorId: "1", // Game Master
    title: "The Arrival at Silverwood",
    createdAt: new Date('2024-07-28T10:00:00Z').getTime(),
    imageUrl: "https://picsum.photos/800/400?random=55",
    imageAiHint: "fantasy city gate",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    content: `
        <p>
            The party, weary from their travels, finally saw the shimmering rooftops of Silverwood. 
            As they approached the main gate, they were greeted by Captain <a href="/dashboard/characters/elara" class="text-accent hover:underline">Elara</a>, 
            a stern-looking guard with a noticeable scar above her left eye. She held the legendary{' '}
            <a href="/dashboard/items/moonshard-blade" class="text-accent hover:underline">Moonshard Blade</a>, its faint glow pulsing in the twilight.
        </p>
        <p>
            "State your business in Silverwood," she commanded, her voice firm but not unkind. The air was thick with the scent of pine and distant magic.
        </p>
    `
};

const initialSpanishThread: (Omit<NarrativeThread, 'id'> & { id: string }) = {
    id: "hilo-1",
    campaignId: "2",
    authorId: "1", // Game Master
    title: "El Llamado en la Tormenta",
    createdAt: new Date('2024-07-28T10:00:00Z').getTime(),
    imageUrl: "",
    imageAiHint: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    content: `
       <p>En el gélido mundo de Rassilon, el invierno eterno ha apretado su garra sobre la tierra. Hace quinientos años, la Guerra de la Ventisca aniquiló imperios, y los dioses, debilitados, apenas sostienen el equilibrio del cosmos. La nieve cubre los antiguos reinos, y bestias monstruosas acechan en la penumbra de los bosques helados. En este mundo de desesperanza, los héroes son faros de luz, enfrentándose a la oscuridad que amenaza con consumir lo poco que queda de la civilización. La Orden de la Llama Plateada lucha por preservar la justicia, mientras los antiguos linajes mágicos, como los descendientes de los dragones, despiertan poderes olvidados para desafiar al destino. Sin embargo, el hielo no es el único enemigo: intrigas políticas, cultos oscuros y profecías antiguas conspiran para sumir a Rassilon en un caos aún mayor.</p><p>La ventisca aúlla como un lobo hambriento mientras Sir Kaelan y Seraphina avanzan por el desfiladero de Hraefn’s Pass, un sendero traicionero en las Montañas del Hueso Gris. Han sido convocados urgentemente al asentamiento de Frosthaven, un pequeño bastión humano al borde del territorio salvaje. El mensaje, garabateado con mano temblorosa, hablaba de una reliquia sagrada, el Cáliz de la Llama Eterna, que ha sido robada de su santuario. Sin ella, la protección divina de Frosthaven se desvanece, y los rumores susurran que los orcos de las tierras heladas planean un asalto inminente.</p><p>El viento les golpea con furia, y la nieve dificulta ver más allá de unos pasos. De repente, un grito desgarrador corta la tormenta, procedente de un risco cercano. A través de la ventisca, logran distinguir una figura tambaleante: un joven explorador, herido, con sangre congelada en su capa. Balbucea algo sobre un "monstruo de escarcha" que acecha en las cuevas cercanas, donde los ladrones del Cáliz podrían haberse refugiado. Sin embargo, el tiempo apremia: Frosthaven está a solo unas horas, y cada minuto que pasa aumenta el riesgo de que el asentamiento caiga ante los orcos.</p>
    `
};


async function seedDatabase() {
    console.log("Seeding database...");
    const batch = writeBatch(db);

    // 1. Users
    const users: (Omit<User, 'id'> & { id: string; password?: string })[] = [
        {
            id: "1",
            name: "Game Master",
            email: "gm@example.com",
            role: "master",
            avatar: "https://picsum.photos/100/100?random=99",
            password: "password",
            campaignId: "1", // Default to campaign 1, can be switched
        },
        {
            id: "2",
            name: "Alice",
            email: "player@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=5",
            password: "password",
            campaignId: "1",
        },
        {
            id: "3",
            name: "Bob",
            email: "player2@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=6",
            password: "password",
            campaignId: "1",
        },
        {
            id: "4",
            name: "Carlos",
            email: "jugador1@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=7",
            password: "password",
            campaignId: "2",
        },
        {
            id: "5",
            name: "Diana",
            email: "jugador2@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=8",
            password: "password",
            campaignId: "2",
        }
    ];

    users.forEach(user => {
        const { id, ...userData } = user;
        const userRef = doc(db, "users", id);
        batch.set(userRef, userData);
    });
    console.log("Users queued for seeding.");


    // 2. Campaigns
    const campaigns: (Omit<Campaign, 'id'> & { id: string })[] = [
        {
            id: "1",
            title: "The Whispering Shadows",
            description: "A realm teetering on the brink of an ancient, creeping darkness. Once a safe haven for elves, dwarves, gnomos and other creatures, humans started settling in thousands of years ago through war and conquest. The elves live exiles in the north.",
            bannerUrl: "https://picsum.photos/1200/400?random=10",
            bannerAiHint: "epic fantasy landscape",
            systemPrompt: defaultSystemPrompt,
        },
        {
            id: "2",
            title: "Crónicas de la Sombra",
            description: "Un reino al borde de una antigua y creciente oscuridad. Antaño un refugio seguro para elfos, enanos y gnomos, los humanos comenzaron a asentarse hace miles de años a través de la guerra y la conquista. Los elfos viven exiliados en el norte.",
            bannerUrl: "https://picsum.photos/1200/400?random=20",
            bannerAiHint: "dark fantasy landscape",
            systemPrompt: defaultSystemPromptEs,
        }
    ];

    campaigns.forEach(campaign => {
        const { id, ...campaignData } = campaign;
        const campaignRef = doc(db, "campaigns", id);
        batch.set(campaignRef, campaignData);
    });
    console.log("Campaigns queued for seeding.");


    // 3. Characters
    const characters: (Omit<Character, 'id'> & { id: string })[] = [
        // English Campaign Characters
        {
            id: "char-1",
            name: "Grom the Valiant",
            description: "A stoic warrior from the northern mountains, seeking to reclaim his family's honor.",
            visualPreset: "barbarian",
            campaignId: "1",
            userId: "2", // Alice's ID
            level: 3,
            class: "Barbarian",
            strength: 18,
            dexterity: 14,
            constitution: 16,
            intelligence: 8,
            wisdom: 12,
            charisma: 10,
            isActive: true,
        },
        {
            id: "char-2",
            name: "Lyra Swiftwind",
            description: "An elven ranger, outcast from her homeland, with an uncanny connection to the spirits of the forest.",
            visualPreset: "ranger",
            campaignId: "1",
            userId: "3", // Bob's ID
            level: 3,
            class: "Ranger",
            strength: 12,
            dexterity: 18,
            constitution: 12,
            intelligence: 14,
            wisdom: 16,
            charisma: 14,
            isActive: false,
        },
        // Spanish Campaign Characters
        {
            id: "char-3",
            name: "Sir Kaelan",
            description: "Un paladín inquebrantable de la Orden de la Llama Plateada, juró proteger a los inocentes a cualquier costo. Su fe es su escudo y su martillo de guerra, la justicia.",
            visualPreset: "paladin",
            campaignId: "2",
            userId: "4", // Carlos's ID
            level: 2,
            class: "Paladín",
            strength: 16,
            dexterity: 10,
            constitution: 14,
            intelligence: 10,
            wisdom: 13,
            charisma: 15,
            isActive: true,
        },
        {
            id: "char-4",
            name: "Seraphina",
            description: "Una hechicera enigmática cuyo linaje se remonta a los dragones de antaño. Su magia es tan salvaje e impredecible como su temperamento.",
            visualPreset: "sorceress",
            campaignId: "2",
            userId: "5", // Diana's ID
            level: 2,
            class: "Hechicera",
            strength: 8,
            dexterity: 14,
            constitution: 12,
            intelligence: 15,
            wisdom: 10,
            charisma: 18,
            isActive: true,
        },
    ];

    characters.forEach(character => {
        const { id, ...charData } = character;
        const charRef = doc(db, "characters", id);
        batch.set(charRef, charData);
    });
    console.log("Characters queued for seeding.");

    // 4. Narrative Threads
    const threads = [initialThread, initialSpanishThread];
    threads.forEach(thread => {
        const { id, ...threadData } = thread;
        const threadRef = doc(db, "narrativeThreads", id);
        batch.set(threadRef, threadData);
    });
    console.log("Narrative threads queued for seeding.");


    // 5. Narrative Comments
    const narrativeComments: (Omit<NarrativeComment, 'id'> & { id: string })[] = [];

    narrativeComments.forEach(comment => {
        const { id, ...commentData } = comment;
        const commentRef = doc(db, "narrativeComments", id);
        batch.set(commentRef, commentData);
    });
    console.log("Narrative comments queued for seeding.");

    // 6. HellFrost Game System Data
    const { razas, categorias_personaje } = hellfrostRacesAndCategories.referenciasWebApp;

    for (const [raceName, raceData] of Object.entries(razas)) {
      const raceRef = doc(db, "razas", raceName);
      batch.set(raceRef, raceData);
    }
    console.log("HellFrost races queued for seeding.");

    for (const [categoryName, categoryData] of Object.entries(categorias_personaje)) {
      const categoryRef = doc(db, "characterCategories", categoryName);
      batch.set(categoryRef, categoryData);
    }
    console.log("HellFrost character categories queued for seeding.");
    
    hellfrostGameData.skills.forEach(skill => {
        const skillRef = doc(collection(db, "habilidades"));
        batch.set(skillRef, skill);
    });
    console.log("HellFrost skills queued for seeding.");

    hellfrostGameData.edges.forEach(edge => {
        const edgeRef = doc(collection(db, "edges"));
        batch.set(edgeRef, edge);
    });
    console.log("HellFrost edges queued for seeding.");

    hellfrostGameData.hindrances.forEach(hindrance => {
        const hindranceRef = doc(collection(db, "hindrances"));
        batch.set(hindranceRef, hindrance);
    });
    console.log("HellFrost hindrances queued for seeding.");

    // Seed all items into their own collections
    for (const [collectionName, items] of Object.entries(hellfrostGameData.items)) {
        for (const [itemId, itemData] of Object.entries(items)) {
            if (itemId === 'notas_generales') continue;
            const itemRef = doc(db, collectionName, itemId);
            batch.set(itemRef, itemData);
        }
        console.log(`HellFrost items for '${collectionName}' queued for seeding.`);
    }

    batch.set(doc(collection(db, "caracteristicas")), { name: 'Placeholder Attribute', description: 'This is a placeholder.' });
    console.log("HellFrost placeholder attributes queued for seeding.");


    // Commit the batch
    try {
        await batch.commit();
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}

let seeded = false;

export async function runSeed() {
    if (seeded) {
        return;
    }
    seeded = true;
    await seedDatabase();
}

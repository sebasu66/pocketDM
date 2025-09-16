
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

const hellfrostData = {
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

export const initialThread: (Omit<NarrativeThread, 'id'> & { id: string }) = {
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
    const { razas, categorias_personaje } = hellfrostData.referenciasWebApp;

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
    
    // Add placeholders for the other collections until data is provided
    const placeholders = {
        habilidades: { name: 'Placeholder Skill', description: 'This is a placeholder.', attribute: 'Agility' } as Omit<Skill, 'id'>,
        hindrances: { name: 'Placeholder Hindrance', description: 'This is a placeholder.', level: 'Minor' } as Omit<Hindrance, 'id'>,
        caracteristicas: { name: 'Placeholder Attribute', description: 'This is a placeholder.' } as Omit<Attribute, 'id'>,
        edges: { name: 'Placeholder Edge', description: 'This is a placeholder.', category: 'Background', requirements: 'Novice' } as Omit<Edge, 'id'>,
    };

    batch.set(doc(collection(db, "habilidades")), placeholders.habilidades);
    batch.set(doc(collection(db, "hindrances")), placeholders.hindrances);
    batch.set(doc(collection(db, "caracteristicas")), placeholders.caracteristicas);
    batch.set(doc(collection(db, "edges")), placeholders.edges);
    console.log("HellFrost placeholder collections queued for seeding.");


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

    


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
  conceptosWebApp: {
    "introduccion_hellfrost": {
      "titulo": "Bienvenido a Hellfrost",
      "descripcion": "Hellfrost es un escenario de fantasía épica para el galardonado juego de rol Savage Worlds [1, 2]. El mundo de Rassilon está permanentemente cubierto de hielo y nieve, y las tierras templadas no escapan a la miseria de cosechas fallidas, inviernos mortales y el temido viento del Hellfrost [3, 4]. Además, hace apenas 30 años, la magia, que alguna vez fue el arma más potente de las razas civilizadas, comenzó a fallar repentinamente, un efecto de origen desconocido llamado 'El Sifonamiento' la ha convertido en un aliado impredecible [3, 4].",
      "contenido_guia_jugador": "La Guía del Jugador de Hellfrost contiene todo lo necesario para comenzar a aventurarse en los páramos helados [1, 2], incluyendo seis razas de personaje jugables, decenas de nuevas Ventajas (Edges) y Desventajas (Hindrances), seis trasfondos arcanos mágicos alternativos, detalles sobre 24 deidades y sus seguidores, reglas para la Gloria (un nuevo rasgo que mide las grandes hazañas de los héroes), y reglas completas del escenario para aventurarse en Rassilon [1, 2].",
      "libros_requeridos": "Para disfrutar plenamente de este escenario, los GMs necesitan el 'Hellfrost Bestiary' y el 'Hellfrost Gazetteer', además del libro de reglas de 'Savage Worlds'. El 'Bestiary' contiene la lista de monstruos y arquetipos, así como reglas para crear reliquias, mientras que el 'Gazetteer' detalla los reinos y lugares principales de Rassilon [5].",
      "heroes_y_villanos": "Hellfrost fomenta los actos heroicos y las hazañas valientes, similares a las sagas nórdicas antiguas. Los jugadores pueden elegir interpretar héroes o villanos. Los héroes que se sacrifican por los demás ganan Gloria y bonificaciones especiales. Los villanos tienen total libertad, pero no son recompensados por actos malvados [6]."
    },
    "el_mundo_de_rassilon": {
      "titulo": "Rassilon: La Tierra y sus Horrores",
      "descripcion": "La tierra donde tienen lugar las aventuras de los personajes se conoce como Rassilon. Otras tierras existieron, pero han sido inaccesibles durante siglos [7]. Rassilon se divide en cinco regiones geográficas principales [8].",
      "el_hellfrost_profundo": "Al norte se encuentra el Hellfrost, una vasta extensión de hielo y nieve donde habitan gigantes de escarcha, dragones del Hellfrost, vampiros de escarcha y mamuts del Hellfrost. Se dice que el hielo y la nieve permanentes irradian desde un colosal pico de hielo azul en el centro del Hellfrost [8]. El 'Corazón del Hellfrost' se encuentra alrededor del Mar de Fuego Frío, una masa de fuego frío que destruye cualquier barco de madera que se atreva a navegarla [9]. Pocos animales naturales sobreviven en este reino; solo las criaturas más viles pueden soportar el frío terrible y la mentalidad de 'matar o morir' que impregna esta tierra [10].",
      "razas_civilizadas": "Rassilon alberga varias razas inteligentes. Los humanos son los más comunes, viviendo en las Tierras del Hogar y el Hellfrost exterior [11]. Otras razas incluyen los enanos de escarcha, que tallan fortalezas en glaciares; los elfos de la taiga, adaptados al frío; y los elfos del hogar, parientes de los elfos de la taiga, que viven en los bosques del sur [11]. Los nacidos del hielo también son una raza de Hellfrost [12]. Las razas civilizadas no viven aisladas; gigantes, orcos, goblins, muertos vivientes inteligentes y demonios acechan, esperando el momento adecuado para atacar [13].",
      "idiomas_de_rassilon": {
        "descripcion": "Algunos términos del manual provienen del inglés antiguo, nórdico y germánico, siendo la base del idioma humano dominante. La mayoría de las palabras se pronuncian como se escriben, con 'g' como 'y' y diptongos con la primera vocal alargada (ej. 'daeg' se pronuncia 'daay') [7].",
        "adquisicion_de_idiomas": "Los personajes empiezan con un número de idiomas igual a la mitad de su dado de Astucia [14]. El primer idioma debe ser el racial. Muchos también hablan 'Trader', un idioma común creado después de la Guerra de la Ventisca [15]. Se pueden aprender nuevos idiomas invirtiendo un avance [15]. Subir el dado de Astucia durante el juego no otorga idiomas adicionales automáticamente [16]. Los personajes pueden leer y escribir los idiomas que hablan, a menos que sean 'Analfabetos' (común en Rassilon) [16]. Algunas lenguas no tienen forma escrita [16].",
        "variaciones_elficas": "Aunque el élfico del hogar y el élfico de la taiga comparten palabras, sus idiomas han evolucionado de manera diferente. Los elfos de la taiga tienen muchas palabras para tipos de nieve, mientras que los elfos del hogar tienen múltiples palabras para un solo roble, dependiendo de su ubicación, estación, animales, edad, etc. Se consideran idiomas separados [17]."
      },
      "historia_condensada": "La historia de Rassilon está marcada por eventos dramáticos desde antes de la Guerra de la Ventisca (Blizzard War). Algunos hitos incluyen la fundación de la Convocación de Elementalistas (-611 IR), las Guerras de la Puerta Demoníaca, la traición de Hela (-352 IR) que liberó a los primeros muertos vivientes, y el inicio de la Guerra de la Ventisca (-25 IR) que diezmó la población y vio la desaparición de los dioses Kenaz y Sigel. El 'Ice Rise' (0 IR) marcó el fin de la guerra, la creación de la Muralla de Hielo y un endurecimiento climático. Eventos posteriores incluyen la fundación de la Magocracia (45 IR), la introducción del 'scield' como moneda (50 IR), y el inicio del Sifonamiento (471 IR) que debilitó la magia [10, 18]. El año actual es 499 IR [18]."
    },
    "creacion_de_personajes": {
      "titulo": "Conceptos de Creación de Personajes",
      "descripcion": "Crear héroes en Hellfrost es sencillo, siguiendo una serie de pasos con la hoja de personaje [19].",
      "razas_jugables": "En Hellfrost, puedes jugar engros, enanos de escarcha, nacidos del hielo, elfos del hogar, elfos de la taiga y humanos. No existen mestizos como semi-elfos o semi-orcos, ya que elfos y humanos no son genéticamente compatibles [12]. Cada raza tiene sus propias ventajas y desventajas raciales [12].",
      "atributos_derivados": {
        "carisma": "Mide la simpatía del héroe y se añade a las tiradas de Persuasión y Callejear. El modificador base es +0 [16].",
        "paso": "Es igual a 6\" (pulgadas), a menos que sea modificado por Ventajas o Desventajas [16].",
        "parada": "Es igual a 2 más la mitad del dado de Pelear. Puede ser modificado por Ventajas, Desventajas y equipo [20].",
        "dureza": "Es igual a 2 más la mitad del dado de Vigor. Puede ser modificado por Ventajas, Desventajas y Armadura [20]."
      },
      "ventajas_y_desventajas": "Los grandes héroes son más que solo habilidades y atributos; son sus dones únicos, poderes especiales y defectos trágicos lo que los hace interesantes [20]. Puedes tomar una Desventaja Mayor (2 puntos) y dos Desventajas Menores (1 punto cada una). Estos puntos pueden usarse para aumentar un atributo, elegir una Ventaja o ganar puntos de habilidad/dinero adicional [21]."
    },
    "magia_y_arcano": {
      "titulo": "La Magia en Hellfrost",
      "descripcion_general": "Rassilon es un mundo de magia [22]. Filamentos de energía mágica de la luna tocan a cada criatura, otorgándoles el potencial de manipular la magia [22, 23]. No hay puntos de poder; el único límite para lanzar hechizos es el riesgo del Sifonamiento o de ofender a los dioses [24]. Solo las criaturas con la Desventaja 'Prohibición Mágica' no son afectadas por estos filamentos [23].",
      "el_sifonamiento": {
        "descripcion": "El Sifonamiento comenzó hace menos de 30 años, debilitando la magia y haciéndola impredecible [3, 25]. Los magos temen lanzarla frívolamente debido al riesgo de perder poder temporal o permanentemente [26]. Solo afecta la magia tejida en los conjuros, no la magia bruta del mundo [26].",
        "contragolpe_arcano": "Cuando un mago saca un 1 en su dado de habilidad arcana (independientemente del Wild Die), sufre el Sifonamiento. Debe tirar 2d6 (o 3d6 y tomar los dos más bajos con un fallo crítico) y consultar la Tabla del Sifonamiento [27]. Si el Wild Die indica un éxito, el conjuro se activa antes de aplicar el efecto del Sifonamiento [27]."
      },
      "el_efecto_hellfrost": {
        "descripcion": "Los magos y clérigos que invocan conjuros de calor o fuego sufren penalizaciones basadas en la temperatura ambiental [28, 29]. Este fenómeno también afecta a criaturas con habilidades basadas en fuego que requieren una tirada [29]. El daño no se ve afectado [29]. Los académicos arcanos debaten la causa, sospechando que está relacionado con la desaparición de los dioses Kenaz y Sigel durante la Guerra de la Ventisca [30]. El fuego mágico ha estado en declive durante siglos [31].",
        "modificadores_por_temperatura": "Las penalizaciones varían: de 0°C a -10°C, -1; de -11°C a -21°C, -2; de -22°C a -32°C, -3; de -33°C a -44°C, -4; de -45°C a -55°C, -5; y de -56°C o menos, -6 [29]. Estos modificadores se aplican a todas las tiradas de habilidad arcana para conjuros de calor o fuego [29]."
      },
      "elemental_loci": {
        "descripcion": "Los loci elementales son lugares donde los reinos elemental y mortal se superponen, ofreciendo gran poder pero también peligro. Un locus suele estar relacionado con su elemento (ej. fuego en un volcán) [32]. Solo se han descubierto loci de aire, tierra, fuego y agua [33].",
        "dimensiones_y_efecto": "Un locus se divide en alcance exterior (12 yardas), alcance interior (8 yardas) y núcleo (4 yardas) [33, 34]. Un elementalista afín al elemento gana bonificaciones a sus tiradas de Elementalismo: +1 en el alcance exterior, +2 en el interior y +4 en el núcleo [34]. Un elementalista no afín sufre penalizaciones de -1, -2 y -4, respectivamente [35].",
        "contragolpe_en_loci": "El contragolpe es más severo en un locus. Fallar una tirada de conjuro causa una herida automática. Con un 1 o un fallo crítico, el mago sufre el Sifonamiento, tirando 1d6 adicional en el alcance exterior, 2d6 en el interior y 3d6 en el núcleo (tomando los dados más bajos) [35]."
      },
      "trasfondos_arcanos": "Los héroes que toman la Ventaja 'Fondo Arcano (Magia)' deben elegir uno de los tipos de hechicero arcano, cada uno con una habilidad arcana específica y una lista de poderes disponibles [36, 37]. Estos reemplazan la Ventaja estándar 'Fondo Arcano (Magia)' de Savage Worlds [36].",
      "hedge_magic_vs_magia_verdadera": {
        "descripcion": "La magia de setos, o magia natural, no implica manipular hilos mágicos ni requiere un Trasfondo Arcano [38]. No está sujeta a contragolpe, el Efecto Hellfrost, ni puede ser disipada [39]. Su eficacia se basa en el conocimiento detallado del mundo natural [40].",
        "beneficios": "Los remedios herbales no generan contragolpe ni Sifonamiento [41], son baratos de producir [41], no se detectan como reliquias mágicas [41] y no pueden ser disipados o negados mágicamente [41].",
        "creacion_de_remedios_herbales": "Implica seleccionar el propósito del remedio (con modificadores de dificultad), nombrar la planta y la forma (polvo, aceite, etc.), encontrar ingredientes (con tiradas de Conocimiento (Alquimia) o Supervivencia, modificadas por rareza y estación) y prepararlos (con tiempos de preparación que afectan la dificultad) [41-50]."
      },
      "activacion_objetos_magicos": {
        "tipos_de_objetos": "Hay tres tipos de objetos mágicos: dispositivos alquímicos (pociones, pergaminos), objetos de magia de setos (pociones herbales) y reliquias legendarias (los más poderosos) [51].",
        "dispositivos_alquimicos": "Cualquier criatura sentiente que toca uno sabe instantáneamente su poder y cómo usarlo, siguiendo las instrucciones (ej. beber una poción, leer un pergamino) [51, 52].",
        "objetos_hedge_magic": "No se detectan como mágicos al tacto (aunque los conjuros de detección sí funcionan) y no requieren sintonización [52]. Se necesita una tirada de Conocimiento (Alquimia) para aprender sus propiedades si no están etiquetados [53].",
        "reliquias_legendarias": "Son los objetos mágicos más raros, cuya creación se perdió hace eones [54]. Tocarlas revela que son objetos de poder [55]. Para usar sus poderes, un héroe debe 'sintonizarse' con el objeto gastando un benny. Si es usable, el héroe aprende instantáneamente todas sus habilidades y bonificaciones [56]."
      }
    },
    "equipo_y_logistica": {
      "titulo": "Conceptos de Equipo y Logística",
      "descripcion_general": "Después de crear el personaje, se adquiere equipo (armas, armaduras, objetos). A menos que se modifique por Ventajas o Desventajas, el héroe comienza con 500 escudos de oro [57]. La tecnología en Rassilon es predominantemente medieval [57].",
      "moneda": "La única moneda de uso diario son los 'scields' (escudos), monedas con forma de escudo introducidas en Drakeport 50 años después de la Guerra de la Ventisca [57]. Hay escudos de oro (gs) y de plata (ss), con 10 scields de plata equivalentes a 1 de oro [57]. Los Finnari y Saxa prefieren el trueque, pero las monedas son necesarias en mercados y ciudades [58].",
      "disponibilidad_de_items": {
        "general": "Tener dinero no garantiza poder comprar bienes en cualquier lugar [59]. Los asentamientos y aldeas son autosuficientes en bienes básicos, pero carecen de materiales y artesanos para otros artículos. En una ciudad importante, se encuentra casi todo [59]. La mayoría de los bienes se clasifican por disponibilidad en Aldea (V), Pueblo (T) o Ciudad (C), indicando el tamaño mínimo de asentamiento [59]. 'Especial' (S) se refiere a ubicaciones específicas (ej. armaduras bendecidas en templos) [59]. Durante la generación de personaje, se asume que los héroes ya han adquirido su equipo [60].",
        "factores_raciales_geograficos": "La disponibilidad también varía por raza y geografía [60]. Por ejemplo, la armadura de placas cuesta el doble en tierras Saxa o élficas, ya que prefieren armaduras más ligeras, mientras que los Anari las favorecen [60]. Los Finnar no producen armaduras o armas de metal, y estos artículos cuestan cinco veces más en sus campamentos debido a la importación [conversación]. Los Saxa favorecen las hachas (75% del precio normal) y ven las espadas como armas de la nobleza (50% más caras) [conversación]. Los enanos venden armas y armaduras al doble del costo por su xenofobia [conversación]. Las pieles y ropa de invierno son más baratas y siempre disponibles entre los Finnar [conversación].",
        "compra_venta_de_bienes": "Los artículos de Ciudad en un pueblo, o de Pueblo en una aldea, cuestan un 50% más. Los artículos de Ciudad en una aldea cuestan el doble [61]. Los bienes especiales rara vez se compran fuera de su lugar descrito [61]."
      },
      "materiales_especiales": {
        "general": "Ciertos materiales otorgan propiedades mágicas y son extremadamente raros y caros. Su disponibilidad la determina el GM [62].",
        "hielo_negro": "Se encuentra en glaciares antiguos o páramos del Hellfrost. Se trabaja como metal en fraguas de fuego frío (se derrite con llamas normales). Cuesta 10 veces más y es 'Especial' [62, 63]. Es muy susceptible al calor; los ataques de fuego o calor reducen su Armadura o dado de daño por herida, derritiéndose completamente al llegar a cero [63]. Los objetos de hielo negro que comienzan a derretirse no pueden repararse [64].",
        "maerathril_metal_lunar": "Metal blanco, ligero y con propiedades antimágicas, trabajado en fraguas normales o de fuego frío. Cuesta 100 veces más y es 'Especial' [64]. Las armaduras de Maerathril otorgan la Ventaja Resistencia Arcana (+2 o +4 mejorada), acumulándose con Edges similares (hasta +6). Los magos que las usan sufren -2 a sus tiradas de habilidad arcana. El peso es la mitad [64]. Las armas 'Disipan' automáticamente un hechizo activo cada vez que golpean a un objetivo [64].",
        "metal_estelar": "Un metal raro de estrellas caídas, fuerte y perforante. Se trabaja como metal normal. Cuesta 50 veces más y es 'Especial' [65]. Las armaduras de metal estelar tienen +2 Armadura adicional. Las armas tienen AP 2 (o +2 AP adicional si ya tenían). Las herramientas tienen +3 de Dureza de Objeto [65]."
      },
      "fortificaciones": {
        "general": "Las fortificaciones rara vez están a la venta. Las paredes se consideran Armadura Pesada; cada herida crea una brecha de 1 pulgada [66, 67]. El 'Bono de Asedio' se añade a las tiradas de Batalla y Moral del defensor [67]. Los 'Defensores' son el número habitual de guardias [67]. Los 'Suministros' son semanas de provisiones; sin ellos, los defensores pierden el Bono de Asedio y sufren -2 de penalización a Moral [68]. El 'Costo' es una guía para el GM; las construcciones en territorio sin dueño aumentan un 25% por guardias [68]. Los nobles o personajes Ricos/Muy Ricos pueden poseerlas/construirlas, pero deben cubrir los gastos anuales (2% del costo) si no tienen tierras de apoyo [69]."
      }
    },
    "clima_y_ambiente": {
      "titulo": "Conceptos de Clima y Ambiente",
      "niveles_de_temperatura": "Hellfrost usa un sistema de 'niveles de temperatura' [70]. La temperatura exacta es irrelevante; cualquier temperatura dentro de un nivel da la misma penalización de Vigor [70]. La columna de Vigor lista la penalización a las tiradas para resistir el frío [70].",
      "vestimenta_y_penalizaciones": "Las penalizaciones de la tabla de temperatura asumen que el personaje ya lleva una camisa cálida y una capa. El viento constante y cortante impone una penalización más alta. Un personaje con ropa menos sustancial sufre un -2 adicional a sus tiradas de Vigor [71].",
      "temperatura_nocturna": "Por la noche, la temperatura desciende 1 nivel debido a la pérdida de calor del débil sol, dejando el terreno extremadamente frío [72].",
      "refugio_y_fuego": "Un refugio (cueva, hoyo de nieve, tienda, conjuro de 'Refugio') bloquea el viento cortante y otorga un bono de +1 a +4 a las tiradas de Vigor para resistir el frío, dependiendo de su resistencia al viento [73]. Un fuego adecuado dentro del refugio otorga un +2 adicional [73].",
      "fuego_frio_coldfire": "El fuego frío es una de las grandes maravillas del Hellfrost. Tiene las propiedades del fuego normal, pero arde con una llama azul-blanca fría, capaz de derretir metal. Existe de forma natural o se crea quemando leña de hielo (icewood) [74]."
    },
    "la_gloria": {
      "titulo": "Concepto de la Gloria",
      "que_es_la_gloria": "La Gloria es un nuevo rasgo que mide las grandes hazañas de tus héroes [1, 2]. Los jugadores que se esfuerzan por interpretar a un personaje heroico, que se sacrifica por los demás, pueden ganar Gloria [6]. Un héroe más glorioso obtiene bonificaciones especiales [6].",
      "ganando_gloria_general": "Para ganar Gloria se evalúan las hazañas heroicas. Por ejemplo, decapitar a un liche con un golpe de gracia es una hazaña notable, digna de un pequeño modificador [75]. Una partida Novata que vence a un grupo de orcos sin ayuda debería ser recompensada con una mayor fama [75]. Se pueden aplicar penalizaciones por oponentes débiles o circunstancias favorables [76].",
      "gloria_en_batalla_masiva": "La guerra es terrible y puede forjar o romper reputaciones. En Batallas Masivas, los modificadores de Gloria son fijos [77].",
      "beneficios_de_la_gloria": "Ser un héroe tiene sus ventajas. Cada vez que un héroe alcanza un múltiplo de 20 puntos de Gloria, puede elegir un beneficio de una lista, cumpliendo los requisitos [78]. Los beneficios pueden tomarse varias veces [79]. Si la Gloria cae por debajo de un múltiplo de 20, los beneficios correspondientes se pierden temporalmente hasta que se recupere la Gloria [79]. Un beneficio notable es ser 'Inmortalizado en Canción', garantizando un lugar en la historia y un entierro digno [80]."
    },
    "religion": {
      "titulo": "Conceptos Religiosos",
      "dioses_y_el_pacto": "Los dioses no son omnipotentes; son entidades poderosas pero limitadas a sus esferas de interés [81]. La desaparición de Kenaz y Sigel (dioses del fuego y el sol) hizo que sus clérigos se debilitaran en regiones frías [81]. El 'Pacto' impide la intervención divina directa para evitar que los dioses oscuros apoyen directamente a sus seguidores [81]. Thrym (dios del invierno) ha crecido en poder con el Hellfrost, y los dioses del bien debaten si ha roto el Pacto [82].",
      "deidades_patronas": "Una deidad patrona es a la que un mortal dedica su vida religiosa. Los que mueren habiendo vivido según los preceptos de su patrón son llevados a su vida después de la muerte. Los que no tienen patrón van a la 'Sala de los Gritos Resonantes', un 'salón de subastas de almas' donde los demonios y heraldos pujan por ellas [83, 84].",
      "deidades_menores": "Hay cientos de dioses menores, a menudo aspectos de deidades mayores. Permiten a los jugadores crear su propio dios (ej. un tipo de pájaro o una montaña específica), pero con poderes muy específicos y de alcance limitado para no rivalizar con los dioses mayores [85-87]. Los clérigos de deidades menores no obtienen la Ventaja 'Conexiones' ni la Desventaja 'Órdenes' [88].",
      "clérigos_y_milagros": "Todos los clérigos obtienen la Ventaja 'Fondo Arcano (Milagros)', pero cada uno es diferente según la deidad que sigue [89]. Deben obedecer los preceptos de su fe o corren el riesgo de perder su magia (pecados) [90]. Si un clérigo saca un 1 en su dado de Fe, es Sacudido. Un fallo crítico resulta en un nivel de Fatiga [91].",
      "nigromancia_religiosa": "Antes de la locura de Hela (la antigua diosa de la muerte), había pocos muertos vivientes. Tras su traición, liberó miles de espíritus del Abismo que habitaron cadáveres, convirtiéndola en la Diosa de la No Muerte y otorgando poder nigromántico a sus clérigos [92]. Se cree que los clérigos de Hela extraen espíritus de un reino secreto para animar cadáveres [93]. El conjuro 'Gravespeak' permite contactar almas difuntas, pero Hela a veces intercepta la conexión, redirigiéndola a una de sus almas oscuras [89]."
    },
    "vida_en_rassilon": {
      "titulo": "Conceptos de la Vida en Rassilon",
      "calendario": "Un año en Rassilon tiene 416 días. Los años se numeran desde el 'Ice Rise' (0 IR), el fin de la Guerra de la Ventisca, siendo el año actual 499 IR [94]. Las fechas se dan como 'segundo Sunnandaeg de Plohmonan' [94]. Los magos usan relojes de arena para periodos cortos [95].",
      "sol_y_luna": "El sol se conoce como 'El Hogar de Sigel' y la luna como 'La Ascua de Maera'. Los skalds llaman a la luna 'La Perdición de Niht' [95].",
      "costumbres_funerarias": "Las costumbres funerarias varían por raza [96]. Los Saxa creman a sus muertos, incluyendo nobles en 'longships' [96]. Los Finnar y Tuomi siempre han cremado [96]. Los Anari de Alantaris Isle y la Magocracia entierran sin ajuar funerario [97]. Los elfos de ambas razas entierran a sus muertos y plantan un retoño sobre la tumba, creyendo que el espíritu pasa al árbol y sus raíces inmovilizan el cuerpo para evitar que se convierta en muerto viviente [97].",
      "comercio_y_tiendas_de_magia": "La mayoría de los comerciantes tienen rutas comerciales regulares. Las 'reliquias' (objetos mágicos permanentes) son extremadamente raras y no están a la venta en tiendas [98]. Pociones, pergaminos y otros objetos temporales pueden encontrarse en ciudades grandes y mercados rurales [99].",
      "organizaciones_general": "El manual describe varias organizaciones en las Tierras del Hogar y el Hellfrost, a las que los personajes pueden unirse [100]. Estas incluyen los 'Bludgeoners' (guerreros engro que protegen sus caravanas) [100], la 'Convocación de Elementalistas' (que unificó a los elementalistas bajo leyes comunes) [101], los 'Caballeros Hrafn' (una orden de estrategas y tácticos mercenarios) [102], los 'Lorekeepers' (dedicados a preservar el conocimiento) [103], el 'Relicario' (busca y protege artefactos mágicos permanentes) [104], la 'Hermandad de la Misericordia' (sanadoras no religiosas) [105], y los 'Wood Wardens' (organización élfica que protege los bosques) [106]."
    }
  },
  "rassilon_grid_map_summary": [
    {
      "id": "A1",
      "region_info": {
        "name": "The Hellfrost (The Core)",
        "population": {
          "total": "Unknown",
          "breakdown": "Believed to be inhabited by the most powerful of frost giants, Hellfrost dragons, and other monstrous fiends."
        },
        "ruler": "Unknown",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The Hellfrost appeared as a sudden, cataclysmic event before the Blizzard War, expanding at an alarming rate and erasing entire cultures. After the war, the mysterious Icewall rose from the ground, isolating these frozen wastes from the rest of Rassilon. This deep region is the source of the unnatural cold and the horrifying beasts that plague the Winterlands.",
        "government": "No formal government is known to exist. It is a land ruled by raw, primal power, where the strongest creatures hold dominion over their territory.",
        "military": "The sentient inhabitants, such as frost giants and white bears, are a military force unto themselves. They are adapted to the extreme cold and represent a constant threat to the lands south of the Icewall.",
        "geography": "This region is more beautiful and dangerous than any skald can describe. It features vast fields of razor ice larger than entire countries, towering volcanoes that spew coldfire and slushrock, and majestic mountains that stand like razors on the horizon. Visible on the clearest days is a colossal pinnacle of ice, circled by mile-long dragons.",
        "climate": "Supernatural, extreme cold. The temperatures are low enough to freeze exposed flesh in seconds. The weather is dominated by constant, hurricane-force winds that carry razor-sharp ice particles, and rain of pure coldfire."
      }
    },
    {
      "id": "A2",
      "region_info": {
        "name": "The Hellfrost (Inner Wastes)",
        "population": {
          "total": "Unknown",
          "breakdown": "Orcs, goblins, and frost giants are among the least dangerous inhabitants."
        },
        "ruler": "Unknown",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "Lance Knights and other brave adventurers have explored only a tiny fraction of the wintry wastes. What they have found has caused more than one to drop dead from fright. The horrors that lie toward the core are best left imagined beside a warm fire, far from the howling Hellfrost wind.",
        "government": "Anarchy and the rule of the strong prevail. Orc tribes and frost giant clans have adapted to the intense cold, but they are not the masters of this land.",
        "military": "The inhabitants are in a constant state of war with each other and the environment itself. There are no organized armies, only warbands and monstrous predators.",
        "geography": "A continuation of the bizarre and deadly landscape of the core. Features include fields of ice and snow so vast and featureless they can drive a person mad from the sight. The strangest rumors relate to 'the Wound,' a four-mile-deep canyon from which hot steam rises, preventing ice from forming nearby.",
        "climate": "Extreme, supernatural cold. While not at the absolute nadir of the core, the climate is still hostile to nearly all forms of life from south of the Icewall."
      }
    },
    {
      "id": "A3",
      "region_info": {
        "name": "The Hellfrost (Outer Wastes)",
        "population": {
          "total": "Unknown",
          "breakdown": "Dominated by strange beasts that resemble more mundane creatures, such as mammoths whose breath can freeze a man in his tracks."
        },
        "ruler": "Unknown",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This is the edge of the true Hellfrost, the region immediately beyond the Icewall. It was from these lands that the Hellfrost armies poured during the Blizzard War. Its proximity to the Icewall makes it the most 'explored' part of the Hellfrost, though this is a relative term for a land that kills nearly all who enter.",
        "government": "None. It is a lawless wasteland.",
        "military": "The primary military presence is the myriad of Hellfrost beasts that inhabit the region. There are no organized forces, only predators and prey in a deadly ecosystem.",
        "geography": "The geography is defined by the Icewall, a mile-high and 40-mile-thick barrier of craggy ice. The wall itself is riddled with the lairs of Hellfrost dragons and cryosphinxes. The land beyond is a desolate expanse of snow and ice.",
        "climate": "Extreme cold, though slightly less severe than the inner wastes. The weather is still dangerously unpredictable, with sudden blizzards and plummeting temperatures being the norm."
      }
    },
    {
      "id": "A4",
      "region_info": {
        "name": "The Hellfrost (The Icewall - North)",
        "population": {
          "total": "Unknown",
          "breakdown": "Hellfrost dragons, cryosphinxes, and other fell beasts. Approximately 20 orc lairs have been discovered extending deep into the Icewall."
        },
        "ruler": "None",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The Icewall rose from nowhere after the Blizzard War ended, ceasing the southern expansion of the Hellfrost. Scholars have debated its origin for centuries. It serves as a near-impassable barrier, with only a few known routes like the White Stair allowing passage.",
        "government": "N/A",
        "military": "The inhabitants of the Icewall caves, primarily orcs and monsters, form a formidable and chaotic defensive line against any who would try to cross into the Hellfrost.",
        "geography": "A mile-high, 40-mile-thick wall of solid, craggy ice. Climbing it is possible but exceptionally dangerous due to the sheer faces, treacherous conditions, and the monstrous creatures that make their lairs within its caves.",
        "climate": "High Winterlands temperatures prevail on the southern side, with a sharp, dramatic drop into the supernatural cold of the Hellfrost on the northern side. The wall itself is subject to extreme winds and unpredictable weather."
      }
    },
    {
      "id": "A5",
      "region_info": {
        "name": "Unclaimed Lands (Northern Fringes)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "A vast swathe of the Winterlands unclaimed by any powerful ruler. These lands were once home to the Selari and other cultures lost during the Blizzard War. Now, it is a frontier populated by small, independent settlements and nomadic Finnar clans who brave the harsh elements and deadly monsters.",
        "government": "There is no central government. Each settlement and clan is an oasis of civilization in a barbaric landscape, struggling to survive on its own. They owe allegiance to no one.",
        "military": "Each settlement is responsible for its own defense. There are no standing armies, only militias and the inherent toughness of a people accustomed to a life of hardship and constant danger.",
        "geography": "The central and western territories are low hills and grasslands, buried under a continuous snowfield for most of the year. The ground is hard as rock even in the brief summer. The Bleak Moor, a snow-covered upland of stunted trees and frozen bogs, is a key feature.",
        "climate": "High Winterlands. The winters are brutally long and cold. In high summer, the snow may melt enough to reveal the frozen ground beneath, but this thaw is brief and unreliable. The entire region is perpetually cold."
      }
    },
    {
      "id": "A6",
      "region_info": {
        "name": "Unclaimed Lands (Dwarven Hills)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This area of the Unclaimed Lands is notable for the fierce protection the dwarves give to the ruins here. The fortress-city was abandoned when its inhabitants marched north to aid Karad Marn, and they have since prevented any other race, particularly orcs and goblins, from claiming the ruins.",
        "government": "The nomadic Finnar clans and small villages in the area are all independent. The only overarching political force is the dwarven decree that their ruined city is off-limits.",
        "military": "The local Finnar and Tuomi are capable warriors, but the primary military force is the dwarven patrols from the Hearthlands who periodically sweep the area to drive out orcs and enforce their claim on the ruins.",
        "geography": "A region of steep hills containing the ruins of a small dwarf fortress city. In older times, before the extreme winter, these slopes were used as a meeting point for trade between dwarves and other races. Several ruined caravanserais dot the higher slopes.",
        "climate": "High Winterlands. The hilly terrain creates unpredictable weather patterns, with valleys often filling with deep snow drifts while the peaks are scoured by wind."
      }
    },
    {
      "id": "A7",
      "region_info": {
        "name": "Unclaimed Lands (The Great Forest)",
        "population": {
          "total": "100,000+",
          "breakdown": "Primarily taiga elves and Finnar clans, but also home to fey, goblins, orcs, and trolls."
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The Great Forest is a vast, ancient evergreen wood that sprawls across the western Unclaimed Lands. It is a wild and dangerous place, largely untouched by the civilized races, who see it as just another part of the vast, unconquered territory of the north.",
        "government": "No central government. The taiga elf and Finnar clans who live here are nomadic and independent, governing themselves without outside interference.",
        "military": "The elves and Finnar who inhabit the forest are skilled hunters and warriors, adept at guerilla warfare within their wooded homeland. They are a deterrent to the orcs and goblins who also dwell in the forest.",
        "geography": "A sprawling evergreen forest. The terrain is difficult, a mix of dense woods, hidden valleys, and streams that are frozen for most of the year. Hellfrost dragons from the Gray Mountains to the west and the Icewall to the north are a constant aerial threat.",
        "climate": "High Winterlands. The dense forest canopy provides some shelter from the wind and snow, making it slightly more habitable than the open plains, though the cold remains intense and perilous."
      }
    },
    {
      "id": "A8",
      "region_info": {
        "name": "Unclaimed Lands (Highwood Forest)",
        "population": {
          "total": "Unknown",
          "breakdown": "A contested zone inhabited by taiga elves, frost dwarves, orcs, and frost giants."
        },
        "ruler": "None (contested)",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "Highwood Forest is a bitterly contested region. It serves as a vital strategic buffer for the dwarven city of Karad Marn. Should it fall completely to the orcs and giants of the Icewall and Scythe Mountains, the main route to the besieged city would be imperiled.",
        "government": "There is no government, only a constant, low-level war between the various factions vying for control of the forest.",
        "military": "Bands of taiga elves and frost dwarves hold the western part of the forest, fighting tenaciously against the orcs and frost giants who control the central and eastern sections.",
        "geography": "A dense swathe of pines, conifers, and spruces, wedged between the Jotunvalk and Scythe Mountains, the Icewall, and the Fell Plateau. The terrain is mountainous and difficult, making large-scale troop movements nearly impossible.",
        "climate": "High Winterlands. The high altitude and mountainous terrain make this one of the colder and more treacherous forests in the region."
      }
    },
    {
      "id": "A9",
      "region_info": {
        "name": "Unclaimed Lands (Frozen Forest)",
        "population": {
          "total": "Unknown",
          "breakdown": "Frost wights and ice mummies."
        },
        "ruler": "Unknown",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["Icewood"],
        "background": "Once the magnificent taiga elf realm of Morenelion, it was flash-frozen by a supernatural wind at the start of the Blizzard War. The trees were instantly turned to valuable icewood and its inhabitants became undead frost wights and ice mummies. Dwarven caravans make yearly expeditions to harvest the icewood.",
        "government": "N/A",
        "military": "The undead elves that haunt the forest are its only defenders. They are a deadly threat to any who venture too deep, especially in the central regions where they tend to congregate.",
        "geography": "A vast forest of icewood, frozen in time. No living thing grows here. The White Stair, a treacherous pass through the Icewall, begins in this forest. The region is bordered by the Scythe Mountains. The entire valley is crawling with Hellfrost beasts.",
        "climate": "An unnatural, magical cold permeates the forest, which remains at a constant -40 degrees Fahrenheit, regardless of the season. The air is still and frigid, a place of profound silence and death."
      }
    },
    {
      "id": "A10",
      "region_info": {
        "name": "Rimeholm (Jotunvalk Mountains)",
        "population": {
          "total": 19531,
          "breakdown": "100% taiga elves"
        },
        "ruler": "The White King",
        "religion": "Ullr, Kenaz, Eostre, Tiw",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The greatest surviving realm of the taiga elves, Rimeholm became their primary refuge after the destruction of Morenelion. Safe behind the Jotunvalk Mountains, they survived the Blizzard War largely intact. However, the rising of the Icewall left them with orcs and giants as close neighbors.",
        "government": "An absolute monarchy ruled by the White King, an ancient and powerful druid. He is served by a council of druids, clerics, and elementalists known as the White Lords. His two sons, the warrior Icecleaver and the druid Nighteyes, are rivals for the succession.",
        "military": "The army is comprised of small bands of rangers and druids skilled in archery, skiing, and mountaineering. The White King's elite bodyguards, the Blizzard Guard, are formidable warriors and practitioners of hrimwisardry (ice magic).",
        "geography": "The realm is centered on the White Wood, a forest of pine and spruce on the southern slopes of the Jotunvalk Mountains. The mountains are ragged and infested with orcs and giants. The forest is protected by a perimeter of magical Hearthstones that ward off the worst of the snow and ice.",
        "climate": "High Winterlands. While the Hearthstones keep the core of the forest magically temperate (equivalent to the Hearthlands), the surrounding mountains are subject to the brutal cold and heavy snows of the region."
      }
    },
    {
      "id": "B1",
      "region_info": {
        "name": "The Hellfrost (Icewall - North)",
        "population": {
          "total": "Unknown",
          "breakdown": "A desolate region, home to the hardiest of Hellfrost beasts and potentially undiscovered tribes of frost giants or orcs adapted to the extreme cold."
        },
        "ruler": "None",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This section of the northern Icewall is even more remote and dangerous than the areas further west. It marks the absolute fringe of the known world, a place where the unnatural cold of the Hellfrost meets the barrier that contains it. Very few have ever laid eyes on this region and returned.",
        "government": "N/A. Anarchy and the law of the wild.",
        "military": "The natural inhabitants, monstrous creatures of ice and cold, are the only military presence. They are highly territorial and hostile to all intruders.",
        "geography": "A continuation of the colossal Icewall, a mile-high barrier of ice. This area is likely featureless, a sheer cliff of ice pounded by the Hellfrost winds. Any passes or caves here are unknown and would be exceptionally well-hidden or dangerous.",
        "climate": "The most extreme cold imaginable on Rassilon. The northern face is a sheer wall of ice scoured by supernatural winds, while the southern face experiences the harshest conditions of the High Winterlands."
      }
    },
    {
      "id": "B2",
      "region_info": {
        "name": "Glittersands",
        "population": {
          "total": "2,468+",
          "breakdown": "70% Anari, 25% frostborn, 5% Saxa, plus unknown numbers of orcs, giants, and trolls."
        },
        "ruler": "None (town council in Glaston)",
        "religion": "Thrym, Kenaz, Sigel",
        "imports": ["Ale", "clothing", "grain", "meat"],
        "exports": ["Glass"],
        "background": "Scholars have long debated the formation of the Glittersands, for ancient records show fertile grassland in the region before the Blizzard War. The current favorite theory is that a star fell here, scorching the land and throwing up the mountains. The only evidence to support this is the Glass Lake. Dozens of scorched ruins dot the landscape. The Glittersands remain isolated and are known only as a barren wasteland to the hearth races.",
        "government": "The only true government in the region is the town council of Glaston. Nine councilors are elected each year from the populace. There are also three automatic seats, one each for the senior priests of Kenaz and Sigel, and one for the commander of the watch. All councilors have an equal vote.",
        "military": "Glaston, the only settlement in the realm, has an army of 100 infantry, all mercenaries. The mercenaries are broken down into three units: a permanent guard for the settlement, an escort for glass shipments, and scouts who operate along the trade road and around the town.",
        "geography": "A cold desert of unnatural origin, hemmed in by mountains to the east and south, the Icewall to the north, and the White Sea to the west. Aside from the Great Dunes and the foothills of the mountains, much of the land is a featureless expanse of sand, small rocks, and icy plains. The key feature is the Glass Lake, a solid block of exceptionally pure glass.",
        "climate": "High Winterlands. The temperature is markedly warmer than in surrounding lands, at worst on par with the Low Winterlands. Despite having a coastline, precipitation is extremely rare, though ice forms atop the barren sands during very cold spells."
      }
    },
    {
      "id": "B3",
      "region_info": {
        "name": "Unclaimed Lands (Frostwater Lake)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This region is defined by the massive Frostwater Lake, the largest in eastern Rassilon. It's a critical resource for the nomadic Finnar and the scattered settlements that dot its shores. The lake's waters are a source of both sustenance and danger.",
        "government": "The settlements around the lake are independent. The nomadic Finnar clans who frequent the area follow their own tribal leaders and traditions, owing no allegiance to any landed ruler.",
        "military": "Each settlement and clan is responsible for its own defense. There are no unified armies, only local militias and warbands.",
        "geography": "The landscape is dominated by Frostwater Lake. The western and northern shores mark the effective start of the High Winterlands. The lake is surrounded by a mix of taiga forest, plains, and the foothills of the Sigil Peaks. The long, narrow Isle of Ruins, littered with unexplored structures, sits between Frostwater and White Lakes.",
        "climate": "High Winterlands. Almost the entire lake freezes over in winter, though the ice toward the center is very thin, making it a treacherous crossing. The surrounding lands are buried in deep snow for most of the year."
      }
    },
    {
      "id": "B4",
      "region_info": {
        "name": "Unclaimed Lands (The Palisade)",
        "population": {
          "total": "100,000+",
          "breakdown": "Small independent villages and steads, primarily Saxa and Tuomi."
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This region serves as a buffer against the frost giants of Giant's Throne to the west. The settlers here are a hardy, independent folk, accustomed to fending off raids. As the winters worsen and the giants grow bolder, more settlers are abandoning their homes and moving away.",
        "government": "Each settlement is independent and self-governing, a collection of villages and steads with no formal ties to one another.",
        "military": "Defense is local. Each village and stead must provide for its own protection. Watchtowers have been constructed on the higher slopes to warn of attacks from Giant's Throne.",
        "geography": "A region of hills that rise sharply in the west in ever-increasing steps, forming a natural barrier. The western shores around the area where Frostwater and White Lakes meet are home to many small settlements. The Moorfrost River provides an ideal hunting ground for ice fishing.",
        "climate": "High Winterlands. The stepped hills of the Palisade offer some protection from the worst of the winds coming off Giant's Throne, but the region is still subject to deep cold and heavy snow."
      }
    },
    {
      "id": "B5",
      "region_info": {
        "name": "Hrimthyr Isle",
        "population": {
          "total": "12,000+",
          "breakdown": "1,000 frost giants, 10,000 orcs, 1,000 frostborn mercenaries (estimated)."
        },
        "ruler": "High Ice King Nagal Blizzardbreath",
        "religion": "Thrym, Dargar",
        "imports": ["None"],
        "exports": ["None"],
        "background": "Considered the homeland of the frost giants, Hrimthyr Isle came into its current state during the Blizzard War, when a coldfire volcano erupted, forming the island of semi-frozen slushrock. It was used as a base for attacks against western Rassilon. The current ruler, Nagal, is plotting a major invasion of the Battlelands.",
        "government": "An absolute autocracy. High Ice King Nagal rules with a fist of black ice. Any weakness leads to death at the hands of a rival. Nagal himself seized power by slaying his predecessor for inept leadership.",
        "military": "Nagal commands a great army of frost giants and orcs, bolstered by priests of Thrym, frostborn mercenaries, ice goblin wolf riders, and renegade hrimwisards. The army is well-organized into regiments and companies, a departure from typical giant tactics.",
        "geography": "An island of solid ice, still expanding as the ever-active coldfire volcano, Thrym's Maw, spews molten slush into the White Sea. There is no plant life. The eastern side is mountainous (Jarls Range Mountains), while the west consists of rolling hills (Icebear Hills) used as a hunting ground for polar bears.",
        "climate": "Permanently frozen. The volcanic activity does not warm the island but instead adds to its mass of ice and slushrock. The surrounding White Sea is often choked with pack ice."
      }
    },
    {
      "id": "B6",
      "region_info": {
        "name": "Giant's Throne",
        "population": {
          "total": "3,300+",
          "breakdown": "300 frost giants, 3,000 orcs and goblins (both estimated)."
        },
        "ruler": "King Kaldr the Wicked",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "A realm recognized only by the Hearth Knights, it appears on most maps as a warning. The first reports of frost giants here date to after the Ice Rise. Only in the last 40 years have they begun to make their presence felt, stirring up goblin tribes and raiding Saxa steads.",
        "government": "King Kaldr rules with a fist of black ice. He is ever vigilant, watching for rivals who might acquire too much glory and seek to usurp his throne. Being honored by Kaldr is both a recognition of service and a warning.",
        "military": "Virtually all inhabitants are part of Kaldr's army. They come from disparate tribes and are as fond of fighting each other as they are other races. Kaldr has infantry, archers, siege artillery, wolf riders, hrimwisards, and clerics of Thrym at his disposal.",
        "geography": "The land comprises the southern bulge of the Sigil Peaks and the surrounding foothills. The Frostwater River marks its southern border. The Sigil Peaks are a craggy range home to orcs, goblins, and giants. The fortress of Giant's Throne itself is a gargantuan keep that rises organically from a mountain.",
        "climate": "High Winterlands. The high altitude of the Sigil Peaks ensures a brutally cold climate with year-round snow cover and frequent, violent storms."
      }
    },
    {
      "id": "B7",
      "region_info": {
        "name": "The Freelands (The Stone Forest)",
        "population": {
          "total": "4,000+",
          "breakdown": "90% hearth elves, 8% Saxa, 2% engro."
        },
        "ruler": "Independent settlements",
        "religion": "Druidic and elemental faiths centered on the stone circles.",
        "imports": ["None"],
        "exports": ["None"],
        "background": "An ancient wood even by elven standards, the Stone Forest contains six major stone circles and ten times as many single standing stones, which predate all known cultures in Rassilon. These circles are important places of power for druids and earth elementalists.",
        "government": "There is no central government. The hearth elf communities and the few human settlements operate independently, though the druids and elementalists who frequent the stone circles act as a loose authority.",
        "military": "Orcs and goblins from the Icebarrier menace the northern part of the forest, but the combined power of the druids and earth elementalists has prevented them from gaining any permanent foothold.",
        "geography": "An ancient deciduous forest containing numerous mysterious stone circles. The most famous is the Nine Sisters at the center of the forest. The Whispering Stone, on the eastern edge, produces a constant stream of faint, unintelligible whispers.",
        "climate": "Low Winterlands. The dense forest provides some shelter from the worst of the winter, but the climate is still cold and harsh, with long winters and short, cool summers."
      }
    },
    {
      "id": "B8",
      "region_info": {
        "name": "The Freelands (Spyre & The Pinnacle)",
        "population": {
          "total": 18725,
          "breakdown": "Primarily Anari and Saxa, with a significant frost dwarf community in Spyre."
        },
        "ruler": "Count Baldar Anthwine (in Spyre)",
        "religion": "Thunor, Ertha, the Unknowable One",
        "imports": ["Furs", "luxury goods", "food", "wine"],
        "exports": ["Copper", "gems", "iron", "stone"],
        "background": "This region is dominated by the city of Spyre, which sits atop a lone mountain known as the Pinnacle. Constructed long before the Blizzard War, it is a city of ancient mysteries, isolated from the lands below. The city's ruler has recently passed a law allowing the resident frost dwarves to pay less tax in return for repairing the city's only access, the crumbling Gambler's Bridge.",
        "government": "Spyre is ruled by a hereditary count. The frost dwarves of Dvergdelf, carved into the mountain face, govern themselves but are subjects of the count.",
        "military": "Spyre maintains its own city guard. The frost dwarf clan provides its own warriors, primarily concerned with defending their subterranean home.",
        "geography": "The landscape is dominated by the Pinnacle, a single, flat-topped mountain rising half a mile above the surrounding Lesser Hills. The city of Spyre sits on this outcropping. The only access is via a long, winding trail and a single, ancient, and treacherous arched bridge. The mysterious Spire building dominates the city's skyline.",
        "climate": "Low Winterlands. The elevated position of Spyre makes it colder than the surrounding hills. It is subject to strong winds and heavy winter storms, making the journey across the Gambler's Bridge extremely perilous."
      }
    },
    {
      "id": "B9",
      "region_info": {
        "name": "The Freelands (Lesser Hills)",
        "population": {
          "total": "Unknown",
          "breakdown": "Small villages of Anari and Saxa."
        },
        "ruler": "Independent settlements",
        "religion": "Primarily the standard Hearthlands pantheon.",
        "imports": ["Finished goods"],
        "exports": ["Gold", "silver", "foodstuffs"],
        "background": "The Lesser Hills are so named because they appear as mere anthills compared to the towering Pinnacle mountain they surround. The villages here scratch a living by mining small quantities of gold and silver or by farming and selling their excess produce to the folk of Spyre.",
        "government": "Each village is independent, with no ruler controlling the whole region. They have a loose, informal relationship with the city of Spyre.",
        "military": "Each village maintains its own militia. They must contend with giants, trolls, and orcs that live in the area, as well as occasional raids by undead from the Withered Lands to the north. They are often aided by the militia of Spyre and the elves of Angarion.",
        "geography": "A range of high, barren hills that surround the Pinnacle mountain. A few small villages dot the landscape. The area is home to giants, trolls, and orcs, though not in large numbers.",
        "climate": "Low Winterlands. The hills offer little protection from the elements, resulting in a cold, windswept climate with significant winter snowfall."
      }
    },
    {
      "id": "B10",
      "region_info": {
        "name": "Angarion (The Forest Heart)",
        "population": {
          "total": 23048,
          "breakdown": "99% hearth elves, 1% engro"
        },
        "ruler": "The Shining King",
        "religion": "Sigel, Eostre, and Ullr",
        "imports": ["Self-sufficient"],
        "exports": ["Art", "jewelry"],
        "background": "The center of hearth elf culture and home to their capital, the city of Angarion. Since the advance of the Hellfrost, the population has steadily risen as refugees flock here for safety. Elves here have withdrawn from the affairs of other races, only emerging to drive back incursions from the Foulwater Swamp or the Withered Lands.",
        "government": "An absolute monarchy ruled by the Shining King, a golden-skinned elf of prophecy. He has not been seen in public for a century, and rules through his chamberlain. Potential rivals for the throne are plotting for the day he dies.",
        "military": "Every adult elf is a soldier. Every noble in Angarion maintains an army of archers and druids. The Shining King maintains a royal guard of armored infantry known as bladedancers. They are ready to die for their king at a moment's notice.",
        "geography": "An ancient, deciduous woodland of oak, birch, and maple. The ground vegetation is dense, and trails are few and far between. It is believed the elves can cause the forest to close in on trespassers. The Greenstream river winds lazily through the forest. The Bare Hills, where nothing grows, are a strange, barren feature within the woods.",
        "climate": "Hearthlands. The dense forest provides a more sheltered, stable microclimate than the surrounding lands, though it is still subject to the cold winters of the region."
      }
    },
    {
      "id": "C1",
      "region_info": {
        "name": "The Hellfrost (Icewall - North)",
        "population": {
          "total": "Unknown",
          "breakdown": "Likely uninhabited by sentient life, save for the most powerful and cold-adapted Hellfrost beasts."
        },
        "ruler": "None",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This section of the Icewall marks the border between the known world and the utter desolation of the Hellfrost. It is a region of myth and terror, a place from which no known expeditions have returned. It is the absolute northern frontier.",
        "government": "N/A",
        "military": "The environment itself is the primary military obstacle. Any creatures here would be apex predators of the frozen wastes.",
        "geography": "The northern face of the Icewall, a sheer, mile-high cliff of jagged ice. The land beyond is believed to be an unending expanse of ice and snow, even more featureless and hostile than the western wastes.",
        "climate": "The absolute extreme of Rassilon's climate. The southern side faces the full brunt of the High Winterlands, while the northern side is a maelstrom of supernatural cold and wind from the Hellfrost."
      }
    },
    {
      "id": "C2",
      "region_info": {
        "name": "Unclaimed Lands (The Bleak Moor)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This upland moor is a place of mystery within the Unclaimed Lands. It is dominated by the ruins of a city built by a long-lost culture. Hearth Knights have reported seeing strange lights in the city's watchtowers but have been unable to identify the cause, adding to the region's sinister reputation.",
        "government": "The nomadic Finnar and Tuomi clans who traverse this region are self-governing. There is no authority beyond the clan leader or village elder.",
        "military": "The nomadic clans are skilled warriors, but there are no formal armies. Defense is a matter of clan and family.",
        "geography": "A snow-covered upland characterized by stunted trees and frozen bogs, which thaw into treacherous quagmires during the brief, mild summers. In the center of the moor stands a large ruined city, surrounded by numerous watchtowers.",
        "climate": "High Winterlands. The moor is exposed and windswept. The thawing of the bogs in summer creates a damp, chilling cold that clings to the landscape, even on the warmest days."
      }
    },
    {
      "id": "C3",
      "region_info": {
        "name": "Unclaimed Lands (Frost Hills)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The Frost Hills are a sparsely populated region of the Unclaimed Lands. Once home to more Saxa steads, most have been abandoned due to the increasing cold and raids from orcs and goblins descending from the Sigil Peaks.",
        "government": "There is no overarching government. The few remaining steads and the nomadic Finnar clans who pass through are entirely independent.",
        "military": "The inhabitants must fend for themselves. There is no standing army, and the region is considered a dangerous frontier.",
        "geography": "A series of steep hills rising from the eastern shore of Frostwater Lake. The landscape is barren and rocky, with little vegetation. Orcs and goblins from the Sigil Peaks are the primary inhabitants, though they have not established large settlements.",
        "climate": "High Winterlands. The hills offer no protection from the elements, and the region is known for its bitter winds and deep, lasting snows."
      }
    },
    {
      "id": "C4",
      "region_info": {
        "name": "The Battlelands (Calivar)",
        "population": {
          "total": 39046,
          "breakdown": "69% Tuomi, 11% Anari, 10% frostborn, 8% Saxa, 2% engro"
        },
        "ruler": "Mormaer Vipoig Sailmaster Vepogenus (in Calivar)",
        "religion": "Tiw, Eostre, Kenaz, Neorthe, Thunor",
        "imports": ["Ale", "clothing", "wine"],
        "exports": ["Fish", "gems"],
        "background": "This northern region of the Battlelands is defined by its proximity to the sea and the constant threat of frost giant raids from Hrimthyr Isle. The main settlement, Calivar, sees little trade due to this threat, forcing merchants to take safer overland routes. Mormaer Vipoig is a master mariner who personally leads the defense against nautical raiders.",
        "government": "The region is a loose confederation of tribes. The ruler of the main town, Calivar, is a Mormaer (a Tuomi clan leader).",
        "military": "Calivar maintains a fleet of four drakkars and two snekkes, crewed by skilled mariners and warriors. They are adept at maneuvering among the larger frost giant vessels, thwarting landings with hit-and-run tactics.",
        "geography": "The northernmost seaport on the western coast. A key landmark is the Sea Elves Temple, a mysterious structure of coral standing half a mile off the coast, predating the arrival of humans. Havmand (merfolk) are often seen near the temple.",
        "climate": "Low Winterlands. The coastal location moderates the temperature slightly compared to the inland regions, but it is still subject to long, harsh winters and fierce sea storms."
      }
    },
    {
      "id": "C5",
      "region_info": {
        "name": "The Battlelands (Jotungraef)",
        "population": {
          "total": 39046,
          "breakdown": "69% Tuomi, 11% Anari, 10% frostborn, 8% Saxa, 2% engro"
        },
        "ruler": "Mormaer Pyrogenes Bluehair Murtholoic (in Jotungraef)",
        "religion": "Tiw, Eostre, Kenaz, Neorthe, Thunor",
        "imports": ["Ale", "clothing", "wine"],
        "exports": ["Fish", "gems"],
        "background": "The southern part of the Battlelands is dominated by the town of Jotungraef (\"Giant's Grave\"). It was renamed from Cailtarni after a vast frost giant army was defeated there in 381 IR. The battle's hero, Canaul, is now the subject of a growing warrior cult. The current ruler, a descendant of Canaul, is arrogant and eager for a chance to fight the frost giants himself.",
        "government": "The region is a loose confederation of tribes. The ruler of the main town, Jotungraef, is a Mormaer.",
        "military": "Each tribe maintains its own army. The cult of Canaul-Tiw is becoming a significant military and social force, with warriors altering ancient battle songs to incorporate the new hero-deity.",
        "geography": "The region features the rugged, barren Battle Mounds to the north and the boggy Marshview Hills to the south. Surrounding Jotungraef are numerous barrows, each containing the headless corpse of a giant slain by Canaul, which local superstition claims scares off new raids.",
        "climate": "Low Winterlands. The hills provide little shelter, and the vales and dales are extremely boggy, especially in summer when the winter snows melt."
      }
    },
    {
      "id": "C6",
      "region_info": {
        "name": "Angmark (Leirvik)",
        "population": {
          "total": 53458,
          "breakdown": "84% Saxa, 10% Anari, 5% engro, 1% frostborn"
        },
        "ruler": "Cyning Knui Gillingsunu",
        "religion": "Neorthe, Freo, Thunor, Eostre",
        "imports": ["Cloth", "iron", "pottery"],
        "exports": ["Fish", "furs", "salt", "timber", "whale oil"],
        "background": "This region contains Leirvik, the capital of Angmark and seat of its king. It is a large, fortified town on the shore of the Inner Sea, maintaining a large fishing fleet and three drakkars (warships). The town is a center for the worship of Neorthe, the sea god, and features a new temple shaped like the hull of a boat. Just outside the town lives the mysterious and insane seeress known as Old Mother.",
        "government": "A hereditary monarchy. The Cyning rules from Leirvik, but must constantly manage the ambitions of his jarls.",
        "military": "The Cyning maintains his personal army and fleet in Leirvik. The town's defenses are formidable, and it serves as the central military command for the realm.",
        "geography": "The town sits in a natural harbor and has a long, shallow, pebbled beach known as the Strand. It is near the Draugr Hills, a range of craggy, windswept hills filled with ancient burial cairns and barrows. These hills are now a place of danger, with orcs and goblins being the most common threat.",
        "climate": "Hearthlands. Its coastal position on the Inner Sea gives it a maritime climate with cool summers and cold, wet winters. The nearby hills are treacherous, with many pitfalls for the unwary traveler."
      }
    },
    {
      "id": "C7",
      "region_info": {
        "name": "The Mistlands & Isles of the Seareavers",
        "population": {
          "total": "3,356 (Seareavers) + Unknown (Mistlands)",
          "breakdown": "Seareavers: 50% Anari, 30% Saxa, 12% frostborn, 8% orcs and goblins. Mistlands: Unknown."
        },
        "ruler": "Reaver-General Odbert Foultongue (Seareavers); None (Mistlands)",
        "religion": "Neorthe, Nauthiz, Thunor, Dargar (Seareavers); Hela (Mistlands, possibly)",
        "imports": ["None (Seareavers take what they want)"],
        "exports": ["None"],
        "background": "This cell contains two distinct and dangerous regions. The Mistlands was once a prosperous Anari mining region called Silverdale. Over 30 years ago, a magical fog blanketed the land, and the entire population vanished. The region is now considered cursed. Offshore, the Isles of the Seareavers are the base of a notorious brotherhood of pirates and cutthroats who terrorize the western coasts.",
        "government": "The Mistlands are lawless and uninhabited. The Seareavers are led by a Reaver-General, a title given to the captain who plunders the most booty each year.",
        "military": "The Mistlands have no military, only wandering monsters. Each Seareaver captain commands their own crew, forming a private army. The Reaver-General has the largest force but cannot stop a major revolt.",
        "geography": "The Mistlands are foothills of the Sigil Peaks, filled with stinking bogs and wetlands, and perpetually shrouded in a dense, magical fog that reduces visibility to near zero. The Isles of the Seareavers are a chain of three major and dozens of smaller islands, mostly rugged and covered in light forest. Ruins of an ancient, pre-human culture dot the islands.",
        "climate": "The Mistlands are unnaturally damp and cold due to the magical fog. The Inner Sea's warm currents offer some protection from the worst of the winter, but the fog creates a chilling, eerie atmosphere. The Isles are subject to fierce sea storms."
      }
    },
    {
      "id": "C8",
      "region_info": {
        "name": "Alantaris Isle (Imperial City)",
        "population": {
          "total": 110840,
          "breakdown": "83% Anari, 5% Saxa, 5% dwarves, 3% elves, 2% engro, 2% frostborn"
        },
        "ruler": "Elected council (Council of Citizens)",
        "religion": "Maera, Neorthe, Var, and Ertha",
        "imports": ["Jewelry", "iron", "wine"],
        "exports": ["Alchemical concoctions", "grain", "fish", "timber", "whale oil"],
        "background": "The heart of the former Anari Empire. The Imperial City, though a shadow of its former self, is still the largest city in the Hearthlands by area. The once-great canals that divided the city's concentric rings are now choked with rubble from the Blizzard War. Life continues in the protected central Palace Quarter.",
        "government": "The Council of Citizens rules from the Citizens' Palace, a former stable block of the grand Imperial Palace. The chairman of the council must be of common birth to ensure impartiality.",
        "military": "The island's main military forces are based in and around the Imperial City and its nearby port. They are primarily focused on containing the orc threat from the Orc Wood and defending the port.",
        "geography": "The Imperial City is a sprawling ruin. Only the central Palace Quarter still stands. The rest, known as 'The Rubble,' is a chaotic maze of collapsed buildings inhabited by monsters and tomb raiders. The Three Peaks mountain range dominates the central island, its foothills once home to towns, villas, and mines, now all deserted.",
        "climate": "Hearthlands. The island enjoys a more temperate maritime climate than the mainland, but the ruins of the city are cold and drafty, and the mountain peaks see snow for much of the year."
      }
    },
    {
      "id": "C9",
      "region_info": {
        "name": "The Inner Sea (West)",
        "population": {
          "total": "Unknown",
          "breakdown": "Seafarers, pirates, merchants, and various sea creatures."
        },
        "ruler": "None",
        "religion": "Neorthe, Nauthiz",
        "imports": ["N/A"],
        "exports": ["N/A"],
        "background": "The Inner Sea is a vital body of water for the western Hearthlands, serving as a major artery for trade and travel. It is also a place of great danger, with the Isles of the Seareavers nearby and orc galleys from Orcmark often prowling its southern waters.",
        "government": "The sea is lawless. Naval patrols from Alantaris Isle and merchant-princes of the Magocracy try to enforce some order, but their reach is limited.",
        "military": "The primary military forces are the fleets of the Seareavers and the navy of Alantaris Isle. Individual merchant ships are often armed, and coastal settlements maintain their own small patrol boats.",
        "geography": "A large body of saltwater separating Alantaris Isle from the mainland. The waters can be treacherous, with sudden storms and dangerous currents. The seabed is littered with the wrecks of ancient Anari vessels and more recent pirate victims.",
        "climate": "Maritime. The weather is unpredictable. Dense fogs are common, and violent storms can appear with little warning, posing a significant threat to even the most experienced sailors."
      }
    },
    {
      "id": "C10",
      "region_info": {
        "name": "Angarion (Southern Border)",
        "population": {
          "total": 23048,
          "breakdown": "99% hearth elves, 1% engro"
        },
        "ruler": "The Shining King",
        "religion": "Sigel, Eostre, and Ullr",
        "imports": ["Self-sufficient"],
        "exports": ["Art", "jewelry"],
        "background": "The southern edge of the great elven forest is a heavily guarded and watchful border. The elves here are particularly wary of the expansionist and politically complex human realms of Coglelund and the Magocracy to the south. Tensions with the Magocracy, which has begun encroaching into western Angarion, are particularly high.",
        "government": "The region is under the absolute rule of the Shining King, though local governance is handled by the noble houses whose lands lie along the border.",
        "military": "The borders are constantly watched by elf warriors, many of them wood wardens, and by animals that report to the elves. Intruders are warned once to turn back, and those who refuse quickly learn of the elves' reputation as master archers.",
        "geography": "The ancient deciduous forest gives way to the flat, grassy plains of Coglelund to the south. The border is not a clear line, but a shifting zone of influence where the forest's edge meets the human-claimed lands.",
        "climate": "Hearthlands. The southern edge of the forest experiences a slightly milder climate than the northern interior, but it is still a land of cool summers and cold winters."
      }
    },
    {
      "id": "D1",
      "region_info": {
        "name": "The Hellfrost (Icewall - North-East)",
        "population": {
          "total": "Unknown",
          "breakdown": "Inhabited only by the most powerful Hellfrost creatures."
        },
        "ruler": "None",
        "religion": "Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The northeastern edge of the Icewall is a place of absolute desolation. It is the furthest point of the known world from the relative warmth and safety of the southern Hearthlands. Legends among the northern dwarves speak of entire cities of ice that lie beyond this part of the wall, but these are dismissed as mere fables.",
        "government": "N/A",
        "military": "The environment itself is the greatest defense. Any creature that can survive here is a formidable foe.",
        "geography": "The point where the Icewall curves eastward. The geography is defined by the colossal ice cliff, likely broken by glaciers and immense, windswept snowfields on its southern side. The northern side is a sheer drop into the Hellfrost.",
        "climate": "The absolute extreme of Rassilon's climate. A region of perpetual supernatural winter, where the sun is a distant, powerless light in the sky."
      }
    },
    {
      "id": "D2",
      "region_info": {
        "name": "Lakeland (Mere)",
        "population": {
          "total": 14649,
          "breakdown": "45% Finnar, 30% Saxa, 20% frostborn, 5% Anari"
        },
        "ruler": "Council (Master Hunter Orkning Visinsunu in Mere)",
        "religion": "Ullr, Neorthe, Thunor",
        "imports": ["Ale", "grain", "vegetables"],
        "exports": ["Furs", "ivory", "meat"],
        "background": "The northernmost reaches of Lakeland, this area was largely abandoned after the Blizzard War and resettled only 50 years ago by hunters drawn to its abundance of game. The inhabitants are rough and dour, focused on survival in a harsh land. The main town, Mere, is heavily fortified against orc and goblin attacks.",
        "government": "The region is governed by the Lakeland Hunt Council, made up of master hunters from each settlement. The council convenes in Vimmar once a year.",
        "military": "Every inhabitant is trained in combat and survival. Every citizen of Mere between 15 and 50 is required to practice daily with the bow or javelin, giving the town an impressively skilled militia.",
        "geography": "The land is dominated by the northern shores of Serpent Lake. The terrain is a mix of taiga forest and frozen plains. The town of Mere lies in the High Winterlands and is snowed in for much of the year, relying on the lake for supplies.",
        "climate": "High Winterlands. The winters are long and brutal, with the lake freezing over for months. The short summer is cool and brief. This is one of the coldest inhabited regions south of the Icewall."
      }
    },
    {
      "id": "D3",
      "region_info": {
        "name": "Lakeland (Vimmar)",
        "population": {
          "total": 14649,
          "breakdown": "45% Finnar, 30% Saxa, 20% frostborn, 5% Anari"
        },
        "ruler": "Council (Master Hunter Gwendolyn Whitemane in Vimmar)",
        "religion": "Ullr, Neorthe, Thunor",
        "imports": ["Ale", "grain", "vegetables"],
        "exports": ["Furs", "ivory", "meat"],
        "background": "This is the heart of Lakeland, with its capital, Vimmar, serving as the main hub for trade and governance. The majority of the population are Finnar nomads who wander deep into the Unclaimed Lands and return in winter. The culture is focused on hunting and survival.",
        "government": "The Lakeland Hunt Council governs the collective state. The council, made up of master hunters from each settlement, convenes at the Grand Lodge in Vimmar at the start of each hunting season. The seat reserved for the god Ullr is an act of sacrilege for a mortal to sit in.",
        "military": "Every hunter is skilled with the bow and spear and well-trained in ambush and stealth. Settlements train every man, woman, and child in basic combat skills. Though not suited for pitched battles, their guerilla tactics would make any invasion costly.",
        "geography": "The region is centered around the vast Serpent Lake, so named for its unusual shape. The capital, Vimmar, is located on the trade route to Aspiria. The Grand Lodge in Vimmar is a magnificent wooden structure, its pillars decorated with inlaid bone and ivory.",
        "climate": "Low Winterlands. The lake freezes over for several months a year, allowing sledge travel but halting boat traffic. The shorelines can remain frozen throughout spring and fall. The climate is harsh and unforgiving."
      }
    },
    {
      "id": "D4",
      "region_info": {
        "name": "The Borderlands (Giantwatch)",
        "population": {
          "total": 40489,
          "breakdown": "35% Tuomi, 25% Anari, 10% Saxa, 10% dwarves, 10% frostborn, 5% taiga elves, 3% hearth elves, 2% engro"
        },
        "ruler": "Mormaer Grith Mead-drinker Fidaich (in Giantwatch)",
        "religion": "Kenaz, Ertha, Tiw, Sigel",
        "imports": ["Iron", "meat", "timber"],
        "exports": ["Armor", "weapons"],
        "background": "This northern part of the Borderlands is a frontier zone constantly threatened by frost giants from the north. The main settlement, Giantwatch, was constructed after the Blizzard War to counter this threat. Its ruler is a hereditary chieftain who has instituted compulsory militia training for all males.",
        "government": "Like the rest of the Borderlands, the region is a patchwork of independent settlements. Giantwatch is ruled by a hereditary Mormaer who sees his town as an oasis of civilization in a chaotic land.",
        "military": "Giantwatch is a military town. The large number of charcoal burners and smithies constantly work to forge armor and weapons. The ruler, Grith Mead-drinker, sends his troops on raids deep into the Aurochs Hills to keep beastmen numbers down. His laws are fair, but punishments are harsh.",
        "geography": "The region comprises lightly forested hills, with the Iceblade Mountains to the north. The west road out of Giantwatch crosses the Bladerun River via a wooden bridge that can be collapsed during an attack. The town is constantly plumed in smoke from its many forges.",
        "climate": "Low Winterlands. The proximity to the Iceblade Mountains ensures long, cold winters with heavy snowfall. The summers are short and cool."
      }
    },
    {
      "id": "D5",
      "region_info": {
        "name": "The Borderlands (Hjorn & Ludogov)",
        "population": {
          "total": 40489,
          "breakdown": "A true melting pot: 35% Tuomi, 25% Anari, 10% Saxa, 10% dwarves, 10% frostborn, 5% taiga elves, 3% hearth elves, 2% engro"
        },
        "ruler": "None (loose confederation)",
        "religion": "Var, Eira, Ertha, Kenaz, Eostre, Ullr",
        "imports": ["Salt", "glass", "gems", "gold", "silver", "wine"],
        "exports": ["Cheese", "horn", "leathergoods", "meat", "clothing", "healing water", "jewelry", "timber"],
        "background": "The heart of the Borderlands, a semi-civilized frontier of rival Tuomi tribes that became a melting pot of cultures after the Blizzard War. Trade is brisk, especially in the east along the road from the Lakelands to Aspiria, but this also attracts many bandits. Settlements are independent and fiercely protective of their autonomy.",
        "government": "The Borderlands are made up of independent settlements with little or no allegiance to one another, except when orcs and goblins threaten the realm. The nature of government in each settlement varies immensely.",
        "military": "Every settlement maintains its own army, usually a small permanent force of no more than 100 men, supported by a militia. The common tactic is to use missile troops to stop attackers before they reach the settlement walls.",
        "geography": "The land consists of lightly forested hills, with two small mountain chains (Aurochs Hills and Hollow Mountains) forming the highest points. The Aurochs Hills are home to large herds of the namesake beast, while the Hollow Mountains are riddled with caves and tunnels. The Purple Hills are known for the heather used to make a strong spirit.",
        "climate": "Low Winterlands. The climate is harsh, with cold winters and short, cool summers. The hills offer some protection, but the valleys can become boggy. In winter, polar bears migrate down from the High Winterlands, making the region even more dangerous."
      }
    },
    {
      "id": "D6",
      "region_info": {
        "name": "The Freelands (The Citadel & Crase)",
        "population": {
          "total": "149,492 (regional total)",
          "breakdown": "45% Anari, 28% Saxa, 12% dwarves, 10% hearth elves, 3% engro, 2% frostborn"
        },
        "ruler": "His Arcane Sereneness Yaval Spellslinger (The Citadel); Baron Triath ap-Clust (Crase)",
        "religion": "Maera, Ertha, Kenaz",
        "imports": ["Books", "glass", "gold", "wine", "furs", "salt"],
        "exports": ["None (Citadel)", "Armor", "iron", "weapons"],
        "background": "This area is dominated by the Jagged Peaks and two key settlements. The Citadel is the secret headquarters of the Reliquary, an organization dedicated to safeguarding magical relics. Crase is an old Anari mining town, now known for its mass production of cheap but serviceable weapons. Its baron is aged, and his paranoid son handles daily affairs.",
        "government": "The Citadel is an independent fortress-state ruled by the head of the Reliquiquary. Crase is a hereditary barony.",
        "military": "The Citadel is defended by the Guardians of the Arcane, the militant arm of the Reliquary. Crase maintains its own town guard and the baron's personal troops.",
        "geography": "The region is defined by the Jagged Peaks, a range of steep, broken hills that were once part of the Icebarrier. The Citadel is a fortress built into the slopes of the peaks, its true extent hidden underground. Crase is located in the foothills, surrounded by old, collapsed mines.",
        "climate": "Low Winterlands. The high altitude of the Jagged Peaks ensures a cold, harsh climate with long winters and heavy snow. The valleys offer some protection but are still subject to the severe cold of the region."
      }
    },
    {
      "id": "D7",
      "region_info": {
        "name": "The Withered Lands & Foulwater Swamp",
        "population": {
          "total": "Unknown",
          "breakdown": "Undead of all varieties, mortal followers of Hela (Withered Lands); Trolls, gatormen, bufomi (Foulwater Swamp)."
        },
        "ruler": "The Black Triumvirate (Withered Lands); The Troll King (Foulwater Swamp, nominal)",
        "religion": "Hela, Niht",
        "imports": ["Corpses"],
        "exports": ["None"],
        "background": "This cell contains two of the most blighted regions in Rassilon. The Withered Lands are the accursed former domain of the Liche-Priest's most powerful lieutenants, a land of perpetual fog and undeath. To its south lies the Foulwater Swamp, a vast, salty marsh rumored to be the home of the near-immortal Troll King and his fortress.",
        "government": "The Withered Lands are ruled by the Dark Triumvirate, a council of three powerful liches. Foulwater Swamp is a lawless mire, though the Troll King is the most powerful single entity within it.",
        "military": "The Triumvirate commands a loosely organized army of skeletons, zombies, and other undead. The inhabitants of Foulwater Swamp are not a unified force, but the trolls are a significant threat.",
        "geography": "The Withered Lands (specifically the Black Heath) is a sickly land of stunted trees, treacherous bogs, and constant mist. Foulwater Swamp is a low-lying saltwater marsh with tangled vegetation and islands that are said to move of their own accord.",
        "climate": "Unnatural. The Withered Lands are perpetually shrouded in a cold, damp fog, with Dim lighting even on bright days. Foulwater Swamp is a cool, damp wetland, prone to freezing in the coldest winter months."
      }
    },
    {
      "id": "D8",
      "region_info": {
        "name": "Coglelund (Halfway)",
        "population": {
          "total": 39431,
          "breakdown": "71% Anari, 25% Saxa, 4% engro"
        },
        "ruler": "Merchant Prince Leon Cogle IV",
        "religion": "Var (secretly Vali)",
        "imports": ["Cloth", "gems", "iron", "luxury goods", "timber"],
        "exports": ["Clothing", "jewelry", "pottery"],
        "background": "A small, independent realm that grew to prominence after the Blizzard War. The Cogle merchant family built a series of fortified warehouses near a small village, creating a safe trading hub. This town, Halfway, boomed. The current ruler, Leon Cogle IV, is an astute but arrogant businessman trying to expand his trade routes.",
        "government": "An autocratic merchant princedom. Leon Cogle IV is an arrogant, self-centered, and egotistical ruler who believes his vast fortune can buy him anything.",
        "military": "Coglelund has a force of 500 light cavalry and 2000 heavy infantry. However, the spendthrift Prince has left the army poorly equipped and led by officers renowned more for their fashion sense than their tactical ability.",
        "geography": "The majority of Coglelund comprises flat, grassy plains with only gentle hills. Angarion marks the western border and the River Hearthrun the east. The key feature is the Hearth Bridge, the only safe crossing point into Vestmark, which Cogle has recently sealed to all but the wealthiest refugees.",
        "climate": "Hearthlands. The open plains offer little protection from the elements, leading to cold, windy winters and mild summers. Its location shields it from the worst of the northern cold."
      }
    },
    {
      "id": "D9",
      "region_info": {
        "name": "The Magocracy (Principality of Darovia)",
        "population": {
          "total": 30545,
          "breakdown": "Primarily Anari and Saxa."
        },
        "ruler": "Mage-Prince Dartuk Darovia of the Fourth Sphere",
        "religion": "Maera",
        "imports": ["N/A"],
        "exports": ["N/A"],
        "background": "Darovia is a poor domain held in the grip of fear. Its ruler, Mage-Prince Dartuk, is a paranoid tyrant, manipulated by his changeling advisor into believing his family and vassals are plotting against him. His secret police, the Lord's Watch, regularly arrest citizens for treason. Dartuk has also illegally acquired a second master heahwisard's staff, a crime that would see him impeached if discovered.",
        "government": "A feudal principality within the Magocracy, ruled by a paranoid Mage-Prince. In reality, the realm is controlled through fear and the machinations of the Prince's advisor.",
        "military": "The Mage-Prince maintains his own army, supported by the forces of his vassals. He also commands the Lord's Watch, a secret police force used to enforce his tyrannical rule.",
        "geography": "A domain with thin soil and scant natural resources. Its main feature is the port city of Dargon, which handles trade from Chalcis and Angmark. Castle Dargon, a drab and enormous edifice, sits on bluffs overlooking the town, casting a shadow of fear over the citizens.",
        "climate": "Hearthlands. Its coastal location gives it a more moderate climate than the inland principalities, but it is still subject to the general cooling trend of Rassilon."
      }
    },
    {
      "id": "D10",
      "region_info": {
        "name": "The Magocracy (Auldwood & Anselwood)",
        "population": {
          "total": "377,000 (regional total)",
          "breakdown": "79% Anari, 12% Saxa, 4% hearth elves, 3% dwarves, 1% frostborn, 1% engro"
        },
        "ruler": "Varies by province (The elves of Auldwood are independent)",
        "religion": "Maera",
        "imports": ["Art", "glass", "jewelry", "pipeleaf", "wine"],
        "exports": ["Timber", "Alchemical devices", "gold"],
        "background": "This region contains two significant forests. Auldwood is an independent hearth elf realm, a remnant of a larger forest that the elves refused to cede to the Magocracy. They avoid contact and have the authority to 'deal with interlopers in any manner they see fit.' Nearby Anselwood is the Magocracy's major source of timber, controlled by the Principality of Sethnor.",
        "government": "Anselwood is part of the Principality of Sethnor. Auldwood is an independent elven monarchy, fiercely isolationist and hostile to the surrounding human realm.",
        "military": "Auldwood is defended by its elven inhabitants, who are masters of forest warfare. The Principality of Sethnor maintains its own army to protect its lands, including Anselwood.",
        "geography": "A heavily forested region. Auldwood is an ancient hearth elf wood. Anselwood is a former hearth elf wood, now primarily a source of timber for the Magocracy's naval fleet.",
        "climate": "Hearthlands. The dense forests create a cool, damp microclimate. Winters are cold, with heavy snow that lingers long under the forest canopy."
      }
    },
    {
      "id": "E1",
      "region_info": {
        "name": "Unclaimed Lands (Far Northeast Coast)",
        "population": {
          "total": "100,000+ (regional total)",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This is the farthest northeastern corner of the known continent south of the Icewall. It is a truly desolate and wild land, inhabited only by nomadic Finnar clans, hardy Tuomi tribes, and the monsters that prey upon them. No powerful ruler has ever claimed this remote territory.",
        "government": "Complete anarchy. Survival depends on the strength of one's clan or village. There are no laws beyond those of individual settlements.",
        "military": "The Finnar and Tuomi who live here are tough, self-reliant warriors, but they are not an army. They fight to survive, not to conquer.",
        "geography": "A vast, coastal tundra. The land is a continuous snow field, broken by ice-covered rivers and the frozen shores of the Narfel Sea. Low hummocks mark areas of hills buried beneath the white shroud. The terrain is treacherous and largely featureless.",
        "climate": "High Winterlands. This region experiences the full fury of the northern winter. The coastal location means it is subject to brutal storms blowing in from the Narfel Sea, bringing with them freezing rain and sea ice."
      }
    },
    {
      "id": "E2",
      "region_info": {
        "name": "Unclaimed Lands (Sunken Realm Border)",
        "population": {
          "total": "100,000+ (regional total)",
          "breakdown": "Finnar nomads, scattered Tuomi villages, and various monstrous creatures."
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The lands bordering the Sunken Realm are shunned and feared. This territory is a rugged frontier where the harsh natural world meets a supernatural catastrophe. The few people who live here are hardy and superstitious, with a deep respect for the dangers that lie to the west.",
        "government": "The scattered villages and nomadic clans are entirely independent and self-governing.",
        "military": "Local militias and clan warriors are the only defense against the horrors that emerge from the Sunken Realm and the harshness of the Winterlands.",
        "geography": "The eastern edge of this cell is a continuation of the Unclaimed Lands' frozen plains. The western edge is defined by the Low Hills and the sheer cliffs that drop into the Sunken Realm. The Cascade River tumbles over these cliffs in a great waterfall.",
        "climate": "High Winterlands. The region is perpetually cold, but the proximity to the Sunken Realm seems to create unusual weather patterns, with strange mists and winds often rising from the chasm."
      }
    },
    {
      "id": "E3",
      "region_info": {
        "name": "Drachenlands (The Giant's Steps)",
        "population": {
          "total": "76,560 (regional total)",
          "breakdown": "Primarily Tuomi, with orcs and goblins in the hills."
        },
        "ruler": "Voivode Ramel the Berserk",
        "religion": "Dargar, Freo, Thrym, Thunor, Tiw",
        "imports": ["Metal", "wine"],
        "exports": ["Furs", "meat", "skins"],
        "background": "This upland region is inhabited by orcs and goblins. The hills are named in the belief that giants once used them as stepping stones to cross what were then bogs. The Voivode of the Drachenlands picks nobles at random to raid the Steps each summer to keep the army busy and the nobles from fomenting rebellion.",
        "government": "The region is under the nominal control of the Voivode. In reality, the orc and goblin tribes of the hills govern themselves.",
        "military": "The Drachenlander army conducts annual raids here. The orc and goblin tribes are a constant, low-level military threat to the surrounding lowlands.",
        "geography": "An upland region of hills. The low-lying valleys were once bogs. A small number of fortified Drachenlander villages stand atop the hills.",
        "climate": "Low Winterlands. The higher altitude of the hills makes for colder, harsher winters than the surrounding plains. The region is known for its strong winds."
      }
    },
    {
      "id": "E4",
      "region_info": {
        "name": "Drachenlands (Angrad)",
        "population": {
          "total": 76560,
          "breakdown": "75% Tuomi, 10% Saxa, 10% frostborn, 3% taiga elves, 2% engro"
        },
        "ruler": "Voivode Ramel the Berserk of the Argentocoxus tribe",
        "religion": "Dargar, Freo, Thrym, Thunor, Tiw",
        "imports": ["Metal", "wine"],
        "exports": ["Furs", "meat", "skins"],
        "background": "Once part of a greater, though never cohesive, Tuomi-dominated region. The Drachenlanders are a belligerent, nomadic people famed for their cavalry. Their ruler, Voivode Ramel, is a harsh tyrant who has executed three of his four sons. The realm is currently at war with the elves of Tethilin over lumber rights.",
        "government": "A loose confederation of tribes, nominally under the control of a voivode ('warlord'). Individual tribes are governed by mormaers. In reality, the Voivode's power extends only as far as his army can reach.",
        "military": "The Drachenlanders are famed for their cavalry and disdain the use of missile weapons. Only the elite heavy cavalry under the Voivode's direct command are allowed to use lances. Ramel's personal guard, the Thunder Cavalry, ride pygmy mammoths into battle.",
        "geography": "Much of the region is low, rolling hills. The capital, Angrad, is a fortified town dominated by the Voivode's ugly palace. The northern, western, and eastern borders are marked by rivers, and the Witchwood dominates the southern extreme.",
        "climate": "Low Winterlands. The winters are long and cold, forcing the Drachenlanders to constantly seek resources from their southern neighbors, which often leads to war."
      }
    },
    {
      "id": "E5",
      "region_info": {
        "name": "The Freelands (Nara & Sanctuary)",
        "population": {
          "total": "149,492 (regional total)",
          "breakdown": "45% Anari, 28% Saxa, 12% dwarves, 10% hearth elves, 3% engro, 2% frostborn"
        },
        "ruler": "Independent settlements",
        "religion": "Hoenir, Eostre, Var (Nara); Eira (Sanctuary)",
        "imports": ["Furs", "gold (leaf)", "wine", "cloth", "salt"],
        "exports": ["Books", "leather goods", "livestock", "meat", "wool", "healing herbs", "potions"],
        "background": "This eastern part of the Freelands is a hub of civilization. Nara is a wealthy town of herders and scholars, home to the Lorekeepers' central scriptorium. The nearby town of Sanctuary is known as the 'Town of Healing', run by the seemingly benevolent Sisterhood of Mercy.",
        "government": "Nara is a plutocracy, ruled by a council of the ten wealthiest herders. Sanctuary is a theocracy, ruled by Mother Felise of the Sisterhood of Mercy.",
        "military": "Nara is defended by the private guards of its wealthy herders and the paladins of Hoenir who protect the House of Lore. Sanctuary is a pacifist town, protected by the Swords of Necessity, warriors who have devoted their lives to the Sisterhood after being healed of grievous injuries.",
        "geography": "The region consists of rolling hills, perfect for grazing livestock. The towns are located on the major trade road that runs from Aslov to Bridgewater.",
        "climate": "Hearthlands. The climate is cool and temperate, suitable for agriculture and raising livestock. It is one of the more pleasant and stable regions in the Freelands."
      }
    },
    {
      "id": "E6",
      "region_info": {
        "name": "Royalmark (Hereford & Salnorr)",
        "population": {
          "total": 119547,
          "breakdown": "84% Saxa, 10% Anari, 4% hearth elves, 1% engro, 1% frostborn"
        },
        "ruler": "High Cyning Eyolf Melnirsunu",
        "religion": "Sigel, Tiw, Hothar, Eostre, Scaetha",
        "imports": ["Gold", "mead", "pipeleaf", "silver"],
        "exports": ["Artwork", "beer", "cheese", "jewelry"],
        "background": "This region of Royalmark is the frontline in the war against the undead of Darkwood. The towns of Hereford and Salnorr are military camps, constantly vigilant against the horrors that lurk in the cursed forest. Salnorr recently suffered a major attack by a horde of zombies using strange bone catapults.",
        "government": "The region is ruled by jarls who are vassals of the High Cyning. Jarl Thorgeir of Hereford is a competent military commander. Jarl Gunnbjorn of Salnorr is currently focused on rebuilding his defenses.",
        "military": "The area is heavily militarized. Hereford maintains a force of 500 huscarls and 200 mercenary cavalry. Salnorr boasts 300 huscarls and 150 mercenary cavalry, though its defenses are currently in tatters.",
        "geography": "The land is worked farmland, but it lies in the shadow of Darkwood. The towns are fortified military settlements, designed for defense rather than comfort.",
        "climate": "Hearthlands. The proximity to Darkwood gives the region a palpable sense of dread. The weather is often overcast and dreary, and a cold mist frequently rolls in from the cursed forest."
      }
    },
    {
      "id": "E7",
      "region_info": {
        "name": "Royalmark (Ravensburg)",
        "population": {
          "total": 119547,
          "breakdown": "84% Saxa, 10% Anari, 4% hearth elves, 1% engro, 1% frostborn"
        },
        "ruler": "High Cyning Eyolf Melnirsunu",
        "religion": "Sigel, Tiw, Hothar, Eostre, Scaetha",
        "imports": ["Gold", "mead", "pipeleaf", "silver"],
        "exports": ["Artwork", "beer", "cheese", "jewelry"],
        "background": "The capital of Royalmark and chief city of the Saxa. Despite its supposed power, the town has grown stagnant. Centuries of enforced tradition and isolation have left the townsfolk ambivalent to changes in the rest of the world. It is a town centuries out of date, where new fashions are met with bewildered stares and new songs find no audience.",
        "government": "The High Cyning rules from his stead, Hartstead. His influence, however, is in serious decline. He has few spare troops to send to other realms and faces opposition both inside and outside Royalmark.",
        "military": "Royalmark is a traditionalist nation. Nobles of any rank may keep their own army of huscarls with no restriction on numbers. The High Cyning has the largest single army, but the combined forces of his jarls would be greater.",
        "geography": "The city sits at the base of the Hearth Range. It has no palisade or ditch, but is protected by six motte-and-bailey forts. The High Cyning's stead, Hartstead, is an enormous wooden palace with golden shields for roof tiles.",
        "climate": "Hearthlands. The city enjoys a relatively sheltered position at the base of the mountains, giving it a stable and predictable climate compared to the more exposed regions."
      }
    },
    {
      "id": "E8",
      "region_info": {
        "name": "Vestmark (Castle Hrafn)",
        "population": {
          "total": 51676,
          "breakdown": "75% Saxa, 15% Anari, 8% hearth elves, 2% engro"
        },
        "ruler": "Cyning Horgar the Feeble",
        "religion": "Tiw, Sigel, Thunor, Hothar",
        "imports": ["Armor", "iron", "mercenaries", "weapons"],
        "exports": ["Silver"],
        "background": "The dead center of Vestmark, now a land in dire peril. This region is home to Castle Hrafn, the headquarters of the Knights Hrafn, a mercenary order dedicated to excellence in leadership. The knights charge Vestmark for their services, though at a reduced rate, and their presence is all that holds the kingdom together.",
        "government": "The region is nominally ruled by Cyning Horgar, but he has lost his mind to grief and obsession. The true military and political power lies with Baron Adelmar, the Lord Marshal of the Knights Hrafn, and Marshal Theodred, who commands the native Saxa forces.",
        "military": "Castle Hrafn is the headquarters of the most effective military leaders in the region. The castle itself contains wargame rooms, an extensive map library, and a library of treaties on war. Many folk suspect the Knights have a stock of relics.",
        "geography": "The land is hilly, dominated by the Seolfor Hills, which were once the lifeblood of Vestmark's trade due to their rich silver deposits. Yetwood, a small hearth elf forest, lies to the south.",
        "climate": "Hearthlands. The weather is grim and overcast, mirroring the mood of the realm. A constant sense of oppression hangs in the air, a psychological effect of the unending war to the south."
      }
    },
    {
      "id": "E9",
      "region_info": {
        "name": "The Magocracy (Principality of Bremen)",
        "population": {
          "total": 37567,
          "breakdown": "79% Anari, 12% Saxa, 4% hearth elves, 3% dwarves, 1% frostborn, 1% engro"
        },
        "ruler": "Mage-Prince Andmar Bremen of the Third Sphere",
        "religion": "Maera",
        "imports": ["Aspirian wine", "Vale pipeleaf", "exquisite clothes"],
        "exports": ["Alchemical devices", "gold"],
        "background": "Bremen is a principality ruled by a depraved despot. Mage-Prince Andmar Bremen is thoroughly inbred, has a fondness for dressing as a woman, and holds debauched parties where guests torture people to the accompaniment of a string quartet. Every year, he and his lackeys ride through the land, hunting peasants for sport.",
        "government": "A feudal principality ruled by a tyrant. Andmar Bremen has been called before the Council Elect several times to explain his actions, but the council has only limited powers over how a noble runs his realm.",
        "military": "The Prince maintains his own army, though its quality is questionable. He uses his soldiers more for his personal 'hunts' than for any strategic purpose.",
        "geography": "The main town of Bremen, Serlana, sits almost on the border with the elven forest of Angarion. The Prince often gazes over the leafy boughs from his tower, dreaming of the delights he could inflict on the elves.",
        "climate": "Hearthlands. The climate is temperate, but a palpable sense of fear and despair hangs over the land due to the cruel nature of its ruler."
      }
    },
    {
      "id": "E10",
      "region_info": {
        "name": "The Magocracy (Principality of Hergenald)",
        "population": {
          "total": 30854,
          "breakdown": "79% Anari, 12% Saxa, 4% hearth elves, 3% dwarves, 1% frostborn, 1% engro"
        },
        "ruler": "Mage-Princess Olvia Hergenald of the Fourth Sphere",
        "religion": "Maera, Var",
        "imports": ["Glass", "wine"],
        "exports": ["Alchemical devices", "gold"],
        "background": "Perhaps the richest province in the Magocracy, Hergenald controls all imports of glass and wine from Aspiria. Its plains are also prime agricultural land. Its ruler, Mage-Princess Olvia, gained power when her parents died of mushroom poisoning. She is a shrewd politician who prefers to arrange matters so that others make the decisions that benefit her.",
        "government": "A feudal principality ruled by a cunning Mage-Princess. Olvia is a master of political manipulation, using her wealth and influence to achieve her goals without soiling her own hands.",
        "military": "Hergenald maintains a powerful army befitting its wealthy status. The forces are well-equipped and professional.",
        "geography": "The principality is defined by its busy port-city, Port Helgen, which deals mainly with merchants from Aspiria. The land is mostly fertile plains.",
        "climate": "Hearthlands. Its southern, coastal location gives it a mild and pleasant climate, ideal for agriculture. It is one of the most prosperous and stable regions of the Magocracy."
      }
    },
    {
      "id": "F1",
      "region_info": {
        "name": "The Icebarrier (Northeast)",
        "population": {
          "total": "8,000+",
          "breakdown": "95% dwarves, plus various monsters."
        },
        "ruler": "None (independent dwarf holds)",
        "religion": "Ertha, Tiw, Niht",
        "imports": ["Foodstuffs", "Icewood"],
        "exports": ["Armor", "weapons", "metal goods"],
        "background": "The largest mountain chain known, forming a natural wall that has slowed the advance of the Hellfrost. This remote section is home to isolated frost dwarf cities, like Karad Zor. Trappers and hunters also frequent the lower slopes.",
        "government": "Each dwarf city is an independent, hereditary feudal domain. There is no central government for the mountain range.",
        "military": "Each dwarf clan maintains a force of heavy infantry. In times of crisis, the city militia, composed mostly of miners, is called to arms.",
        "geography": "A massive mountain range, with an average height of four miles. Permanent snow is as low as 3,000 feet, even in summer. The mythical Elemental Locus is rumored to be hidden somewhere within these peaks.",
        "climate": "High Winterlands. The climate is alpine and extremely harsh. The high peaks are subject to hurricane-force winds and unbelievably cold temperatures. Only the dwarves can comfortably inhabit this region year-round."
      }
    },
    {
      "id": "F2",
      "region_info": {
        "name": "Icedale Freeholds (The Icicle)",
        "population": {
          "total": 31697,
          "breakdown": "50% Finnar, 20% Saxa, 10% Anari, 13% frostborn, 7% taiga elves"
        },
        "ruler": "Council",
        "religion": "Ertha, Sigel, Scaetha, Kenaz",
        "imports": ["Ale", "grain", "iron", "jewelry", "wool"],
        "exports": ["Bone", "furs", "icewood"],
        "background": "A harsh environment where individuals do not last long. This has fostered a communal culture where personal property is less of a concern. The main feature of this cell is the mysterious upside-down castle known as The Icicle, a refuge for hrimwisards.",
        "government": "Technically ruled by a council from Icedale and Iceport, but in practice the taiga elves and Finnar have an equal say. The Whitefire Brotherhood in The Icicle governs itself.",
        "military": "The Freeholds maintain an army of 4,000 men, with an elite corps of ski-troopers known as the White Rangers. They work closely with visiting Hearth Knights.",
        "geography": "This region is dominated by the northern Icebarrier mountains. The Icicle, a small stone castle, hangs upside down from an icy outcropping of the Icewall itself.",
        "climate": "High Winterlands. The high altitude and proximity to the Icewall make this one of the coldest and most unforgiving cells south of the Hellfrost."
      }
    },
    {
      "id": "F3",
      "region_info": {
        "name": "Icedale Freeholds (Icedale)",
        "population": {
          "total": 31697,
          "breakdown": "50% Finnar, 20% Saxa, 10% Anari, 13% frostborn, 7% taiga elves"
        },
        "ruler": "Council",
        "religion": "Ertha, Sigel, Scaetha, Kenaz",
        "imports": ["Ale", "grain", "iron", "jewelry", "wool"],
        "exports": ["Bone", "furs", "icewood"],
        "background": "This realm would not exist were it not for the value of icewood from the nearby Frozen Forest. It's a harsh frontier, settled by Anari and Saxa who came for the 'ice rush'. The native Finnar and taiga elves tolerate them but hold no desire to rule. The culture is communal and tough.",
        "government": "A council of men and women from the main towns of Icedale and Iceport governs, but in practice, the elves and Finnar have an equal say. Several notable Finnar nobles regularly participate.",
        "military": "The Freeholds maintain a surprisingly large army of 4,000 men. The elite soldiers are the White Rangers, proficient with missile weapons, skis, and ice-riggers. They take the war to their enemies rather than waiting for an attack.",
        "geography": "The region lies along the Icedale River valley. It's a mixture of snow plains and patchy taiga forest, bordered by the Troll Hills and the haunted Whitemound Hills, which are filled with undead and sizeable reindeer herds.",
        "climate": "High Winterlands. For one month a year, the temperature rises just high enough for the surface of the Icedale River to melt, and then only in its lower reaches. The winters are long, dark, and brutally cold."
      }
    },
    {
      "id": "F4",
      "region_info": {
        "name": "Barony of Trond (Boarstream Border)",
        "population": {
          "total": 18395,
          "breakdown": "45% Anari, 40% Saxa, 15% frostborn"
        },
        "ruler": "Baron Rodger ap-Gwar (figurehead) and elected council",
        "religion": "Var, Neorthe, Eostre",
        "imports": ["Artwork", "grain", "jewelry", "timber", "trade"],
        "exports": ["Trade (passing through)", "Wool"],
        "background": "A distant Anari trading enclave that survived the Blizzard War but lost its purpose when trade with the east died. The Saxa slaves rose up in revolt, and the Anari, rather than face destruction, granted them freedom and status. The realm is now a minor player, focused on its icewood trade.",
        "government": "The baron is a figurehead with only ceremonial power. Real authority lies with an elected council, which has been dominated by the same wealthy shepherds and clerics of Eostre for decades.",
        "military": "The permanent army comprises 500 medium infantry and 200 medium cavalry, but it is poorly controlled by the council who appoint ill-suited but pliable commanders.",
        "geography": "A very uninteresting place. Two rivers cut through low-lying grassland, suitable primarily for sheep and a few hardy root vegetable crops. The Boarstream river marks the border with the Cairn Lands.",
        "climate": "Hearthlands. The lack of geographical barriers leaves it exposed to the winds, making for cold winters and cool, breezy summers."
      }
    },
    {
      "id": "F5",
      "region_info": {
        "name": "Barony of Trond (Trondavoe)",
        "population": {
          "total": 18395,
          "breakdown": "45% Anari, 40% Saxa, 15% frostborn"
        },
        "ruler": "Baron Rodger ap-Gwar (figurehead) and elected council",
        "religion": "Var, Neorthe, Eostre",
        "imports": ["Artwork", "grain", "jewelry", "timber", "trade"],
        "exports": ["Trade (passing through)", "Wool"],
        "background": "The region's capital, Trondavoe, was once a sprawling metropolis of over 20,000 souls. It has since shrunk to a third of its size, with the outer city left to crumble. It is now the major port for the Low Winterlands, thriving on the icewood trade.",
        "government": "The council holds the true power here. They are notoriously static, with the same members being re-elected for decades. The baron is a mere figurehead.",
        "military": "Two of the Barony's five army companies are garrisoned in Trondavoe, with one serving as a marine force for its single warship.",
        "geography": "Trondavoe occupies the coastal zones of what was once a much larger city. Beyond a new wall built from rubble, the old city lies in ruins. The old sewer system is intact, a lure for adventurers.",
        "climate": "Hearthlands. The coastal location grants it a maritime climate, with cooler summers and milder (though still cold) winters than the inland regions."
      }
    },
    {
      "id": "F6",
      "region_info": {
        "name": "Heldalund (Held, Occupied)",
        "population": {
          "total": 24063,
          "breakdown": "82% Saxa, 11% Anari, 6% frostborn, 1% engro. (The population of Held is 3,795, now with a significant orc minority)."
        },
        "ruler": "Thegn Franmar Barrisunu (Ruler of Heldalund); Warlord Ragkar (Ruler of Held)",
        "religion": "Neorthe, Ertha, Sigel, Kenaz",
        "imports": ["Oil", "pottery", "wine"],
        "exports": ["Copper", "fish", "gems"],
        "background": "This region is the heart of a crisis. Its capital, Held, was once a prominent town but lost importance when Hellfrost dragons began nesting in the nearby mountains. Five years ago, it was captured by an orc army under Warlord Ragkar, who uses the illusion of a dragon to keep the human populace enslaved and mining gems for him.",
        "government": "The region of Held is under the tyrannical rule of an orc warlord. The rest of Heldalund is ruled by a thegn who is beset by enemies on all sides.",
        "military": "The army of Heldalund is in a state of decay, with low morale and desertions. The orc forces in Held are small but effective, relying on fear and a clever deception to maintain control.",
        "geography": "The key feature is the Slush Marsh, a lowland of brackish mires where the water never fully freezes. Local legends say the corpse of a Hellfrost dragon lies rotting in the marsh, giving it a supernatural chill. The supposed dragon's lair is a hollowed hill in the marsh.",
        "climate": "Low Winterlands. The climate is cold and miserable. The presence of the Slush Marsh creates a damp, chilling atmosphere that pervades the region."
      }
    },
    {
      "id": "F7",
      "region_info": {
        "name": "Heldalund (Norvik)",
        "population": {
          "total": 24063,
          "breakdown": "82% Saxa, 11% Anari, 6% frostborn, 1% engro"
        },
        "ruler": "Thegn Franmar Barrisunu",
        "religion": "Neorthe, Ertha, Sigel, Kenaz",
        "imports": ["Oil", "pottery", "wine"],
        "exports": ["Copper", "fish", "gems"],
        "background": "An old Vindari realm now ruled by Saxa. Its borders have shrunk over time, losing land to Cul and Trond. The realm is now beset by enemies on three fronts: the orcs in Held, the aggressive Baron Frostweaver of Cul, and the undead of the Liche-Lands. The ruler, Thegn Franmar, is trying to hold his crumbling realm together.",
        "government": "Heldalund has never had a king. The Thegn is the nominal head of state but must contend with numerous noble and merchant families. With enemies on all sides, his rivals are content to let him make the hard choices before they make their move.",
        "military": "The army is small (750 medium infantry, 125 light cavalry) and poorly equipped, with decades-old gear. Morale is at an all-time low, and desertions are common. The realm's naval might consists of two snekkes berthed at Norvik.",
        "geography": "The land begins on high ground in the south and gradually lowers to the north. The central plains are broken by small forests and bogs. To the north lies Slush Marsh. The Whitedrake River, which freezes solid in winter, forms the western border.",
        "climate": "Low Winterlands. The region is exposed to the north and has harsh, long winters. The Whitedrake Mountains to the west offer some shelter but are also home to many dangers."
      }
    },
    {
      "id": "F8",
      "region_info": {
        "name": "Barony of Cul",
        "population": {
          "total": 14048,
          "breakdown": "65% frostborn, 25% Anari, 18% Saxa, 2% engro"
        },
        "ruler": "Baron Frostweaver I",
        "religion": "Hrimheorte (Thrym), Ullr",
        "imports": ["Oil", "salt", "wine"],
        "exports": ["Meat (wild boar)"],
        "background": "Until seven years ago, Cul was a realm of independent villages. Then a charismatic frostborn named Frostweaver arrived, conquered the land, and established a reign of terror. He is brutalizing the Anari and Saxa population and forcing their children to take frostborn spouses to increase the frostborn population. He is being manipulated by the god Thrym in disguise.",
        "government": "An absolute autocracy. Frostweaver rules with an iron fist, letting his lieutenants (like the brutal Omar Icehand, 'the Enforcer') handle the daily running of the state while he communes with his 'god' and plans the expansion of his realm.",
        "military": "Cul has a 3,000-strong army. 1,000 are just thugs paid to keep the citizens in line. The remainder are medium infantry, all frostborn. Frostweaver also has a bodyguard of 20 elite frostborn hrimwisards.",
        "geography": "The realm is dominated by the Boarback Hills and the foothills of the Whitedrake Mountains. The hills are covered in light woods and are home to many herds of wild boar, which Frostweaver has declared his private hunting reserve.",
        "climate": "Low Winterlands. The climate is cold and harsh. The Whitedrake Mountains to the east contribute to a long and severe winter."
      }
    },
    {
      "id": "F9",
      "region_info": {
        "name": "Nordmark (Yorvik)",
        "population": {
          "total": 73274,
          "breakdown": "75% Saxa, 10% Anari, 9% dwarves, 4% engro, 2% hearth elves"
        },
        "ruler": "Cyning Geirmund Kolsunu",
        "religion": "Tiw, Thunor, Sigel, Hothar",
        "imports": ["Horses", "mead", "timber"],
        "exports": ["Iron", "leatherware", "wine"],
        "background": "The heartland of Nordmark. Its young king, Geirmund, is a charismatic and capable ruler who won his throne in a brutal civil war just two years ago. He is now focused on rebuilding his shattered realm, expanding trade, and keeping his rebellious cousins in check.",
        "government": "A hereditary monarchy. Cyning Geirmund is a hands-on ruler who takes advice from his council but makes it clear his word is final. He has broken with tradition by ordering his jarls to disband their armies, a move which has been met with secret resistance.",
        "military": "Geirmund has consolidated the realm's military under his own command. He has a good-sized force of light cavalry skirmishers and a shock troop of heavy cavalry, employing tactics his kinsfolk had never seen before the civil war.",
        "geography": "The land is hilly, bordered by the Icebarrier to the north. The capital, Yorvik, is a market town on the Lesser Crystalflow. The King's Palace is a grand longhouse with polished iron shingles. The nearby hill fort, The Refuge, serves as a camp for refugees from the Winterlands.",
        "climate": "Hearthlands. The Icebarrier to the north ensures cold, snowy winters. The summers are cool and short. The central plains are fertile."
      }
    },
    {
      "id": "F10",
      "region_info": {
        "name": "Crystalflow Confederacy (Bridgewater)",
        "population": {
          "total": 107330,
          "breakdown": "62% Anari, 35% Saxa, 5% engro, 3% frostborn"
        },
        "ruler": "None (Baron Gallandros ap-Morgwen in Bridgewater)",
        "religion": "Var, Neorthe, Freo",
        "imports": ["Cloth", "furs", "glass", "timber", "trade"],
        "exports": ["Fish", "grain", "trade", "vegetables", "wine", "wool"],
        "background": "A loose association of towns and villages running along the banks of the Crystalflow River, from Drakeport to Bridgewater. The confederacy was formed to protect the vital river trade. In return for the land, cargoes from the neighboring Marklands pay reduced taxes.",
        "government": "The Confederacy has no central government. Each settlement governs its own affairs, so long as trade is not hampered. Bridgewater is ruled by a hereditary baron.",
        "military": "Every settlement maintains its own army. An attack against one member is considered an attack against all. Three Knights Hrafn have been hired on permanent retainer to act as generals and to train the local forces.",
        "geography": "The realm claims the lower part of the Crystalflow River and about 50 miles of land on either side. The town of Bridgewater lies at a bend in the river, bordered by Gnatmarsh and the Tower Hills.",
        "climate": "Hearthlands. The river valley has a temperate climate with cool summers and cold winters. The river is fast-flowing and only freezes in the hardest of winters."
      }
    },
    {
      "id": "G1",
      "region_info": {
        "name": "Unclaimed Lands (Far Northeast Coast)",
        "population": {
          "total": "100,000+ (regional total)",
          "breakdown": "55% Finnar, 15% dwarves, 15% Tuomi, 10% taiga elves, 3% Saxa, 2% Anari"
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "This is the farthest northeastern corner of the known continent south of the Icewall. It is a truly desolate and wild land, inhabited only by nomadic Finnar clans, hardy Tuomi tribes, and the monsters that prey upon them. No powerful ruler has ever claimed this remote territory.",
        "government": "Complete anarchy. Survival depends on the strength of one's clan or village. There are no laws beyond those of individual settlements.",
        "military": "The Finnar and Tuomi who live here are tough, self-reliant warriors, but they are not an army. They fight to survive, not to conquer.",
        "geography": "A vast, coastal tundra. The land is a continuous snow field, broken by ice-covered rivers and the frozen shores of the Narfel Sea. Low hummocks mark areas of hills buried beneath the white shroud. The terrain is treacherous and largely featureless.",
        "climate": "High Winterlands. This region experiences the full fury of the northern winter. The coastal location means it is subject to brutal storms blowing in from the Narfel Sea, bringing with them freezing rain and sea ice."
      }
    },
    {
      "id": "G2",
      "region_info": {
        "name": "Unclaimed Lands (Sunken Realm Border)",
        "population": {
          "total": "100,000+ (regional total)",
          "breakdown": "Finnar nomads, scattered Tuomi villages, and various monstrous creatures."
        },
        "ruler": "None",
        "religion": "Ullr, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The lands bordering the Sunken Realm are shunned and feared. This territory is a rugged frontier where the harsh natural world meets a supernatural catastrophe. The few people who live here are hardy and superstitious, with a deep respect for the dangers that lie to the west.",
        "government": "The scattered villages and nomadic clans are entirely independent and self-governing.",
        "military": "Local militias and clan warriors are the only defense against the horrors that emerge from the Sunken Realm and the harshness of the Winterlands.",
        "geography": "The eastern edge of this cell is a continuation of the Unclaimed Lands' frozen plains. The western edge is defined by the Low Hills and the sheer cliffs that drop into the Sunken Realm. The Cascade River tumbles over these cliffs in a great waterfall.",
        "climate": "High Winterlands. The region is perpetually cold, but the proximity to the Sunken Realm seems to create unusual weather patterns, with strange mists and winds often rising from the chasm."
      }
    },
    {
      "id": "G3",
      "region_info": {
        "name": "Sunken Realm",
        "population": {
          "total": "Unknown",
          "breakdown": "Orcs, giants, frostreavers, and Vendahl."
        },
        "ruler": "None",
        "religion": "Dargar, Thrym",
        "imports": ["None"],
        "exports": ["None"],
        "background": "The Sunken Realm was created thousands of years ago in a disaster that sank a huge area of the continent overnight. Fragmentary records hint that this was once a highly populous realm. Ever since, it has been shunned as a haunted, god-cursed land, a place of ruins and monsters.",
        "government": "None. It is a lawless chasm ruled by the strongest monstrous factions.",
        "military": "The various tribes of orcs, giants, and frostreavers are in a constant state of conflict with one another. They present a united threat only to outsiders who dare to venture into their domain.",
        "geography": "A morass of broken cliffs and shattered earth. The entire region is a depression filled with jagged rocks, crevasses, and sheer cliffs, some dropping for half a mile. The region includes the frozen Deepmarsh and the mysterious Tumbledown City, a ruin that appears to have collapsed into a deep crevasse.",
        "climate": "High Winterlands. The deep, shadowed chasms of the Sunken Realm rarely see direct sunlight, making the region perpetually cold and dark. The cold weather is constant, and the ground is useless for agriculture or grazing."
      }
    },
    {
      "id": "G4",
      "region_info": {
        "name": "Liche Lands of Old (The Black Heath)",
        "population": {
          "total": "Unknown",
          "breakdown": "Vast numbers of undead, and mortal followers of Hela."
        },
        "ruler": "The Black Triumvirate (Angharad, Angtharinax, and Taxmagulus)",
        "religion": "Hela, Niht",
        "imports": ["Corpses"],
        "exports": ["None"],
        "background": "This is the core of the Liche-Priest's former empire. After his defeat, his three most powerful lieutenants entered hibernation here. They awakened after the Blizzard War and used fell magic to corrupt the land into a cesspit of darkness. The paladins of Scaetha now contain the undead, but lack the numbers to destroy them.",
        "government": "The Dark Triumvirate, a council of three powerful liches, rules the realm. They are totally committed to Hela's cause and their dark spirit of cooperation makes them a truly deadly foe.",
        "military": "The Triumvirate commands a loosely organized army of skeletons and zombies, led by black knights and barrow dwellers. They also have access to nearly every type of undead known in Rassilon. Living allies are limited to the clergy of Hela.",
        "geography": "The region is defined by two key features: the Black Heath and Darkwood. The Black Heath is a sickly land of stunted trees, treacherous bogs, and constant mist. The Black Towers, homes of the Triumvirate, rise like skeletal fingers from the landscape. The entire realm is perpetually fog-shrouded.",
        "climate": "Unnatural. The lighting is Dim even on bright days and Pitch Dark at night. Regardless of the weather, the Withered Lands are perpetually fog-shrouded and chillingly cold, a magical cold that seeps into the bones."
      }
    },
    {
      "id": "G5",
      "region_info": {
        "name": "Seithrby & Liche Lands (Southern Border)",
        "population": {
          "total": 19086,
          "breakdown": "68% Saxa, 30% Anari, 2% engro"
        },
        "ruler": "Aethling Cuthwulf Eodricsunu",
        "religion": "Eostre, Tiw, Neorthe, Scaetha",
        "imports": ["Clay", "iron"],
        "exports": ["Fish", "pottery", "timber"],
        "background": "Twenty years ago, Seithrby was a sparsely settled frontier. A clan of Saxa, driven from their lands by orcs and giants, moved in and conquered it, enslaving the local Anari. The ruler, Aethling Cuthwulf, refuses the title of 'cyning' to avoid entanglement with the politics of the Marklands.",
        "government": "An Aethling rules, though he refuses the title of king. Cuthwulf is a fair ruler but indulgent, with a love for hunting, falconry, and the skaldic arts. He has the final say in all matters but regularly invites his thegns to council to maintain an illusion of shared power.",
        "military": "Cuthwulf allows every thegn to maintain his own force of huscarls, while ensuring his own is the largest. He also keeps a small band of Anari heavy cavalry as a status symbol, who patrol the dangerous border with the Liche Lands.",
        "geography": "The terrain descends from Heligioland into rich pastures perfect for grazing. The key features are the Fernbury Hills, home to an ancient, haunted hill fort, and the Feywood, where mass logging has angered the fey inhabitants. The border with the Liche Lands is a place of constant dread.",
        "climate": "Low Winterlands. The winters are long and cold, but the land is fertile enough for grazing. The proximity to the Liche Lands seems to have a corrupting influence on the weather, with frequent cold mists and an oppressive atmosphere."
      }
    },
    {
      "id": "G6",
      "region_info": {
        "name": "Cairn Lands (Hergist)",
        "population": {
          "total": 25346,
          "breakdown": "70% Saxa, 15% hearth elves, 10% Anari, 5% engro"
        },
        "ruler": "Moot",
        "religion": "Sigel, Eostre, Scaetha",
        "imports": ["Fruit", "Wine"],
        "exports": ["Cheese", "leather goods", "wool"],
        "background": "First settled millennia ago by the Vindari, the Cairn Lands were largely abandoned during the reign of the Liche-Priest. Recolonization began two centuries ago by Saxa and Anari families. The land remains largely unpopulated, consisting of grassy plains well-suited for sheep, and the central, elf-inhabited Dalthalinin Wood. The Cairn Hills are a vast necropolis, haunted by undead.",
        "government": "The Cairn Lands are governed by a moot, a council of twenty citizens elected each year. Only citizens who own their own stead or business are permitted to vote, meaning the wealthy landowners hold all the political power.",
        "military": "The realm has no standing army. Every person of wealth hires their own warriors to protect their assets. The temple of Scaetha in the capital, Hergist, has a force of 50 fighting men and women, but they are focused on the undead in the Cairn Hills, not border disputes.",
        "geography": "The southern belt is upland, dominated by the Cairn Hills, a vast necropolis of ancient tombs. North of the hills, the ground drops onto wide plains broken by patches of moorland. The most northerly hearth elf domain, Dalthalinin Wood, is in the center of the plains. Hergist, the capital, is the only major settlement.",
        "climate": "Hearthlands. The climate is cool and temperate, suitable for sheep grazing. The Cairn Hills are windswept and desolate, and are said to possess a supernatural chill, especially at night."
      }
    },
    {
      "id": "G7",
      "region_info": {
        "name": "Ostmark (Iarnsburg & The Grimwold)",
        "population": {
          "total": 72824,
          "breakdown": "70% Saxa, 15% hearth elves, 5% Anari, 5% dwarves, 4% engro, 1% frostborn"
        },
        "ruler": "Marchand Aethling Aran Thormodsunu and the Trada Counseil",
        "religion": "Var, Neorthe, Eostre, Ertha, Tiw, Nauthiz (secretly)",
        "imports": ["Ivory", "rys", "silk", "whale oil"],
        "exports": ["Fish", "grain", "iron", "vegetables"],
        "background": "One of the richest realms in Rassilon, Ostmark was never conquered by the Anari and became a port of refuge during the Blizzard War, earning it the title 'Savior of the Saxa'. It is a nation of merchants, controlling all trade from the mysterious east and trading extensively with the Winterlands.",
        "government": "A merchant republic, ruled by the Trada Counseil (Trade Council) and the Marchands Counseil (Merchant's Council). Power is determined by wealth. The head of the wealthiest family is given the title Marchand Aethling and rules the realm.",
        "military": "Ostmark maintains a large professional army, half of which are mercenaries, to protect its great wealth. The army consists of heavy infantry, medium cavalry, and marines. It also boasts a powerful navy stationed in Sandvik.",
        "geography": "The western part of the realm is a rugged upland dominated by the Grimwold, a region rich in iron that has been extensively mined for over a thousand years. It is filled with the ruins of Anari towns destroyed during the Golem Uprising. East of the Grimwold, the terrain becomes a wide, flat, fertile valley.",
        "climate": "Hearthlands. The Thunor Range to the north creates high rainfall in the western uplands, while the south and east are drier. The climate is generally temperate and conducive to farming in the central valley."
      }
    },
    {
      "id": "G8",
      "region_info": {
        "name": "Ostmark (Sandvik)",
        "population": {
          "total": 72824,
          "breakdown": "70% Saxa, 15% hearth elves, 5% Anari, 5% dwarves, 4% engro, 1% frostborn"
        },
        "ruler": "Marchand Aethling Aran Thormodsunu",
        "religion": "Var, Neorthe, Eostre, Ertha, Tiw, Nauthiz (secretly)",
        "imports": ["Ivory", "rys", "silk", "whale oil"],
        "exports": ["Fish", "grain", "iron", "vegetables"],
        "background": "This region is the heart of Ostmark's power, containing its capital, Sandvik. Sandvik is one of the richest towns in Rassilon, its great docks bustling with trade 24 hours a day. It is the entry point for all trade from the mysterious eastern Jade Empire and the desert lands to the south.",
        "government": "The two ruling councils of Ostmark—the Trada Counseil and the Marchands Counseil—are based in Sandvik. The city is the political and economic center of the realm.",
        "military": "Ostmark's powerful navy is stationed in Sandvik, protecting its vital trade routes. The city also maintains a large garrison of professional soldiers and mercenaries.",
        "geography": "The city of Sandvik is a major port on the east coast. The land around it is a mix of fertile plains and gentle hills. The region includes the southern forest of Greenwood and the small druidic enclave in the Holy Hills.",
        "climate": "Hearthlands. The coastal location provides a maritime climate with mild winters (for Rassilon) and cool summers. It is one of the most pleasant climates in the northern half of the continent."
      }
    },
    {
      "id": "G9",
      "region_info": {
        "name": "Veermark (The Grasslands)",
        "population": {
          "total": "20,000+",
          "breakdown": "Almost entirely nomadic Saxa."
        },
        "ruler": "Horse-Cyning Thrand Belly-Shaker",
        "religion": "Freo (as Horsemaster), Ullr, Thunor",
        "imports": ["Grain", "finished goods"],
        "exports": ["Horses", "livestock"],
        "background": "The Grasslands are home to the nomadic horse-clans of the eastern Saxa. They abandoned the settled ways of their western cousins and embraced a nomadic lifestyle centered on their herds of sheep, goats, and ponies. They are excellent horsemen and refer to their land as 'Freo's Realm'.",
        "government": "A nomadic monarchy. The Horse-Cyning holds court during the summer at the great camp of Veergarth. For the rest of the year, the various tribes and clans govern themselves under their own nobles.",
        "military": "Every adult male is a warrior, expected to be proficient with lance, bow, and spear. Around one-third of every tribe is comprised of warriors who answer to their noble lord.",
        "geography": "A vast, open steppe of low, rolling hills, small streams, and scrubby grass. The soil is thin and ill-suited for farming. The region is almost entirely treeless. The White Horse, a giant figure carved into a hillside, is a major landmark and religious site.",
        "climate": "Hearthlands, but more extreme than the west. The open grasslands are exposed to the cold north wind in winter and can be hot and dry in summer. Snowfall is less than in the west, but the wind makes it feel much colder."
      }
    },
    {
      "id": "G10",
      "region_info": {
        "name": "Sutmark (The High Pass)",
        "population": {
          "total": 47076,
          "breakdown": "90% Saxa, 6% hearth elves, 3% engro, 1% other"
        },
        "ruler": "Aethling Tind Beitisunu",
        "religion": "Tiw, Ullr",
        "imports": ["Gold", "salt"],
        "exports": ["Ale", "fish", "oil", "wool"],
        "background": "Sutmark marks the join between Rassilon and the desert wastes to the south. It is a land under siege, its main city of Ostvik desperately holding back a massive lizardman army. With its overland routes cut off, the realm is slowly dying, receiving little aid from its neighbors.",
        "government": "Sutmark has no true government at present. Aethling Tind, son of the late cyning, is in the besieged city of Ostvik and has vowed not to take his title until the threat is removed. In his absence, settlements govern themselves.",
        "military": "The majority of the realm's native warriors have died defending Ostvik. Sutmark now depends almost entirely on mercenaries, who are paid at great expense.",
        "geography": "An upland region of hills and vales, hemmed in by the Sigel Peaks and the Red Hills. The city of Ostvik lies at the end of the High Pass, a mile-wide and four-mile-long defensive chokepoint of monumental engineering. The river Bloodrun gets its reddish hue from iron deposits.",
        "climate": "Hearthlands, but warmer than the southern Marklands. The Sigel Peaks block much of the northern cold. The climate is dry, bordering on arid near the southern desert."
      }
    }
  ]
}

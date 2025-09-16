

// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
// In a real application, you would have proper data management and user registration.
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./config";
import { User, Campaign, Character, NarrativeThread, NarrativeComment, Race, CharacterCategory, Skill, Hindrance, Attribute, Edge, HellfrostItem, Conjuro, Archetype } from "./types";

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
    razas: {
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
}

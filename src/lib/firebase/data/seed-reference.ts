
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial reference data needed to seed the Firestore database.

export const hellfrostReferenceData = {
    "razas": {
        "Engro": {
            "nombre": "Engro",
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
            "nombre": "Enano de Hielo",
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
            "nombre": "Nacido de Hielo",
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
            "nombre": "Elfo del Hogar",
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
            "nombre": "Humano",
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
            "nombre": "Elfo de la Taiga",
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
    }
};

export const rassilonGridMapSummary = [
    {
        "id": "A1",
        "region_info": {
          "name": "El Hellfrost (El Núcleo)",
          "climate": "Frío extremo y sobrenatural."
        }
      },
      {
        "id": "A2",
        "region_info": {
          "name": "El Hellfrost (Páramos Interiores)",
          "climate": "Frío extremo y sobrenatural."
        }
      },
      {
        "id": "A3",
        "region_info": {
          "name": "El Hellfrost (Páramos Exteriores)",
          "climate": "Frío extremo, aunque ligeramente menos severo que los páramos interiores."
        }
      },
      {
        "id": "A4",
        "region_info": {
          "name": "El Hellfrost (La Muralla de Hielo - Norte)",
          "climate": "Temperaturas de las Tierras Altas de Invierno en el lado sur, frío sobrenatural en el norte."
        }
      },
      {
        "id": "A5",
        "region_info": {
          "name": "Tierras No Reclamadas (Márgenes del Norte)",
          "climate": "Tierras Altas de Invierno. Inviernos brutalmente largos y fríos."
        }
      },
      {
        "id": "A6",
        "region_info": {
          "name": "Tierras No Reclamadas (Colinas Enanas)",
          "climate": "Tierras Altas de Invierno. Patrones climáticos impredecibles."
        }
      },
      {
        "id": "A7",
        "region_info": {
          "name": "Tierras No Reclamadas (El Gran Bosque)",
          "climate": "Tierras Altas de Invierno. El denso bosque proporciona algo de refugio."
        }
      },
      {
        "id": "A8",
        "region_info": {
          "name": "Tierras No Reclamadas (Bosque Alto)",
          "climate": "Tierras Altas de Invierno. Gran altitud y terreno montañoso."
        }
      },
      {
        "id": "A9",
        "region_info": {
          "name": "Tierras No Reclamadas (Bosque Congelado)",
          "climate": "Un frío mágico y antinatural a una constante de -40 grados Fahrenheit."
        }
      },
      {
        "id": "A10",
        "region_info": {
          "name": "Rimeholm (Montañas Jotunvalk)",
          "climate": "Tierras Altas de Invierno, aunque las Piedras del Hogar crean un microclima templado en el núcleo."
        }
      },
      {
        "id": "B1",
        "region_info": {
          "name": "El Hellfrost (Muralla de Hielo - Norte)",
          "climate": "El frío más extremo imaginable en Rassilon."
        }
      },
      {
        "id": "B2",
        "region_info": {
          "name": "Glittersands",
          "climate": "Tierras Altas de Invierno, pero notablemente más cálido, a la par con las Tierras Bajas de Invierno."
        }
      },
      {
        "id": "B3",
        "region_info": {
          "name": "Tierras No Reclamadas (Lago Aguanieve)",
          "climate": "Tierras Altas de Invierno. El lago se congela en invierno."
        }
      },
      {
        "id": "B4",
        "region_info": {
          "name": "Tierras No Reclamadas (La Empalizada)",
          "climate": "Tierras Altas de Invierno. Frío intenso y nieve abundante."
        }
      },
      {
        "id": "B5",
        "region_info": {
          "name": "Isla Hrimthyr",
          "climate": "Permanentemente congelada. La actividad volcánica no calienta la isla."
        }
      },
      {
        "id": "B6",
        "region_info": {
          "name": "Trono del Gigante",
          "climate": "Tierras Altas de Invierno. La gran altitud asegura un clima brutalmente frío."
        }
      },
      {
        "id": "B7",
        "region_info": {
          "name": "Las Tierras Libres (El Bosque de Piedra)",
          "climate": "Tierras Bajas de Invierno. El denso bosque proporciona algo de refugio."
        }
      },
      {
        "id": "B8",
        "region_info": {
          "name": "Las Tierras Libres (Spyre y El Pináculo)",
          "climate": "Tierras Bajas de Invierno. La posición elevada lo hace más frío que las colinas circundantes."
        }
      },
      {
        "id": "B9",
        "region_info": {
          "name": "Las Tierras Libres (Colinas Menores)",
          "climate": "Tierras Bajas de Invierno. Clima frío y ventoso con nevadas invernales significativas."
        }
      },
      {
        "id": "B10",
        "region_info": {
          "name": "Angarion (El Corazón del Bosque)",
          "climate": "Tierras del Hogar. Microclima protegido y estable."
        }
      },
      {
        "id": "C1",
        "region_info": {
          "name": "El Hellfrost (Muralla de Hielo - Norte)",
          "climate": "El extremo absoluto del clima de Rassilon."
        }
      },
      {
        "id": "C2",
        "region_info": {
          "name": "Tierras No Reclamadas (El Páramo Desolado)",
          "climate": "Tierras Altas de Invierno. Expuesto y ventoso."
        }
      },
      {
        "id": "C3",
        "region_info": {
          "name": "Tierras No Reclamadas (Colinas de Escarcha)",
          "climate": "Tierras Altas de Invierno. Vientos amargos y nieves profundas y duraderas."
        }
      },
      {
        "id": "C4",
        "region_info": {
          "name": "Las Tierras de Batalla (Calivar)",
          "climate": "Tierras Bajas de Invierno. La ubicación costera modera ligeramente la temperatura."
        }
      },
      {
        "id": "C5",
        "region_info": {
          "name": "Las Tierras de Batalla (Jotungraef)",
          "climate": "Tierras Bajas de Invierno. Las colinas ofrecen poco refugio, los valles son pantanosos."
        }
      },
      {
        "id": "C6",
        "region_info": {
          "name": "Angmark (Leirvik)",
          "climate": "Tierras del Hogar. Clima marítimo con veranos frescos e inviernos fríos y húmedos."
        }
      },
      {
        "id": "C7",
        "region_info": {
          "name": "Las Tierras de Niebla y las Islas de los Saqueadores Marinos",
          "climate": "Antinaturalmente húmedo y frío debido a la niebla mágica (Tierras de Niebla). Feroces tormentas marinas (Islas)."
        }
      },
      {
        "id": "C8",
        "region_info": {
          "name": "Isla Alantaris (Ciudad Imperial)",
          "climate": "Tierras del Hogar. Clima marítimo más templado que el continente."
        }
      },
      {
        "id": "C9",
        "region_info": {
          "name": "El Mar Interior (Oeste)",
          "climate": "Marítimo. Clima impredecible con densas nieblas y tormentas violentas."
        }
      },
      {
        "id": "C10",
        "region_info": {
          "name": "Angarion (Frontera Sur)",
          "climate": "Tierras del Hogar. Ligeramente más suave que el interior del norte."
        }
      },
      {
        "id": "D1",
        "region_info": {
          "name": "El Hellfrost (Muralla de Hielo - Noreste)",
          "climate": "El extremo absoluto del clima de Rassilon."
        }
      },
      {
        "id": "D2",
        "region_info": {
          "name": "Lakeland (Mere)",
          "climate": "Tierras Altas de Invierno. Inviernos largos y brutales."
        }
      },
      {
        "id": "D3",
        "region_info": {
          "name": "Lakeland (Vimmar)",
          "climate": "Tierras Bajas de Invierno. Duro e implacable."
        }
      },
      {
        "id": "D4",
        "region_info": {
          "name": "Las Tierras Fronterizas (Guardia del Gigante)",
          "climate": "Tierras Bajas de Invierno. Inviernos largos y fríos con fuertes nevadas."
        }
      },
      {
        "id": "D5",
        "region_info": {
          "name": "Las Tierras Fronterizas (Hjorn y Ludogov)",
          "climate": "Tierras Bajas de Invierno. Duro, con inviernos fríos y veranos cortos y frescos."
        }
      },
      {
        "id": "D6",
        "region_info": {
          "name": "Las Tierras Libres (La Ciudadela y Crase)",
          "climate": "Tierras Bajas de Invierno. La gran altitud asegura un clima frío y duro."
        }
      },
      {
        "id": "D7",
        "region_info": {
          "name": "Las Tierras Marchitas y el Pantano de Aguas Fétidas",
          "climate": "Antinatural. Perpetuamente envuelto en una niebla fría y húmeda."
        }
      },
      {
        "id": "D8",
        "region_info": {
          "name": "Coglelund (A Medio Camino)",
          "climate": "Tierras del Hogar. Inviernos fríos y ventosos y veranos suaves."
        }
      },
      {
        "id": "D9",
        "region_info": {
          "name": "La Magocracia (Principado de Darovia)",
          "climate": "Tierras del Hogar. Clima costero más moderado."
        }
      },
      {
        "id": "D10",
        "region_info": {
          "name": "La Magocracia (Auldwood y Anselwood)",
          "climate": "Tierras del Hogar. Microclima fresco y húmedo en los bosques."
        }
      },
      {
        "id": "E1",
        "region_info": {
          "name": "Tierras No Reclamadas (Costa del Lejano Noreste)",
          "climate": "Tierras Altas de Invierno. Tormentas brutales desde el Mar de Narfel."
        }
      },
      {
        "id": "E2",
        "region_info": {
          "name": "Tierras No Reclamadas (Frontera del Reino Hundido)",
          "climate": "Tierras Altas de Invierno. Perpetuamente frío, con nieblas y vientos inusuales."
        }
      },
      {
        "id": "E3",
        "region_info": {
          "name": "Drachenlands (Los Pasos del Gigante)",
          "climate": "Tierras Bajas de Invierno. Más frío y duro a mayor altitud."
        }
      },
      {
        "id": "E4",
        "region_info": {
          "name": "Drachenlands (Angrad)",
          "climate": "Tierras Bajas de Invierno. Inviernos largos y fríos."
        }
      },
      {
        "id": "E5",
        "region_info": {
          "name": "Las Tierras Libres (Nara y Santuario)",
          "climate": "Tierras del Hogar. Fresco y templado."
        }
      },
      {
        "id": "E6",
        "region_info": {
          "name": "Royalmark (Hereford y Salnorr)",
          "climate": "Tierras del Hogar. Nublado y lúgubre, con nieblas frías."
        }
      },
      {
        "id": "E7",
        "region_info": {
          "name": "Royalmark (Ravensburgo)",
          "climate": "Tierras del Hogar. La posición protegida le da un clima estable y predecible."
        }
      },
      {
        "id": "E8",
        "region_info": {
          "name": "Vestmark (Castillo Hrafn)",
          "climate": "Tierras del Hogar. Sombrío y nublado."
        }
      },
      {
        "id": "E9",
        "region_info": {
          "name": "La Magocracia (Principado de Bremen)",
          "climate": "Tierras del Hogar. Clima templado."
        }
      },
      {
        "id": "E10",
        "region_info": {
          "name": "La Magocracia (Principado de Hergenald)",
          "climate": "Tierras del Hogar. Clima costero del sur suave y agradable."
        }
      },
      {
        "id": "F1",
        "region_info": {
          "name": "La Barrera de Hielo (Noreste)",
          "climate": "Tierras Altas de Invierno. Alpino y extremadamente duro."
        }
      },
      {
        "id": "F2",
        "region_info": {
          "name": "Feudos de Icedale (El Carámbano)",
          "climate": "Tierras Altas de Invierno. Una de las celdas más frías e implacables."
        }
      },
      {
        "id": "F3",
        "region_info": {
          "name": "Feudos de Icedale (Icedale)",
          "climate": "Tierras Altas de Invierno. Inviernos largos, oscuros y brutalmente fríos."
        }
      },
      {
        "id": "F4",
        "region_info": {
          "name": "Baronía de Trond (Frontera de Boarstream)",
          "climate": "Tierras del Hogar. Inviernos fríos y veranos frescos y ventosos."
        }
      },
      {
        "id": "F5",
        "region_info": {
          "name": "Baronía de Trond (Trondavoe)",
          "climate": "Tierras del Hogar. Clima marítimo con veranos frescos e inviernos más suaves."
        }
      },
      {
        "id": "F6",
        "region_info": {
          "name": "Heldalund (Held, Ocupado)",
          "climate": "Tierras Bajas de Invierno. Frío y miserable, con una atmósfera húmeda y escalofriante."
        }
      },
      {
        "id": "F7",
        "region_info": {
          "name": "Heldalund (Norvik)",
          "climate": "Tierras Bajas de Invierno. Expuesto al norte, con inviernos duros y largos."
        }
      },
      {
        "id": "F8",
        "region_info": {
          "name": "Baronía de Cul",
          "climate": "Tierras Bajas de Invierno. Frío y duro, invierno largo y severo."
        }
      },
      {
        "id": "F9",
        "region_info": {
          "name": "Nordmark (Yorvik)",
          "climate": "Tierras del Hogar. Inviernos fríos y nevados y veranos frescos y cortos."
        }
      },
      {
        "id": "F10",
        "region_info": {
          "name": "Confederación Crystalflow (Bridgewater)",
          "climate": "Tierras del Hogar. Clima templado con veranos frescos e inviernos fríos."
        }
      },
      {
        "id": "G1",
        "region_info": {
          "name": "Tierras No Reclamadas (Costa del Lejano Noreste)",
          "climate": "Tierras Altas de Invierno. Tormentas brutales desde el Mar de Narfel."
        }
      },
      {
        "id": "G2",
        "region_info": {
          "name": "Tierras No Reclamadas (Frontera del Reino Hundido)",
          "climate": "Tierras Altas de Invierno. Perpetuamente frío, con nieblas y vientos inusuales."
        }
      },
      {
        "id": "G3",
        "region_info": {
          "name": "Reino Hundido",
          "climate": "Tierras Altas de Invierno. Perpetuamente frío y oscuro."
        }
      },
      {
        "id": "G4",
        "region_info": {
          "name": "Antiguas Tierras de los Liches (El Brezal Negro)",
          "climate": "Antinatural. Perpetuamente envuelto en niebla y un frío escalofriante."
        }
      },
      {
        "id": "G5",
        "region_info": {
          "name": "Seithrby y Tierras de los Liches (Frontera Sur)",
          "climate": "Tierras Bajas de Invierno. Inviernos fríos, pero la tierra es lo suficientemente fértil para el pastoreo."
        }
      },
      {
        "id": "G6",
        "region_info": {
          "name": "Tierras de los Túmulos (Hergist)",
          "climate": "Tierras del Hogar. Fresco y templado, pero con un frío sobrenatural en las colinas."
        }
      },
      {
        "id": "G7",
        "region_info": {
          "name": "Ostmark (Iarnsburg y El Grimwold)",
          "climate": "Tierras del Hogar. Altas precipitaciones en el oeste, más seco en el este."
        }
      },
      {
        "id": "G8",
        "region_info": {
          "name": "Ostmark (Sandvik)",
          "climate": "Tierras del Hogar. Clima marítimo con inviernos suaves y veranos frescos."
        }
      },
      {
        "id": "G9",
        "region_info": {
          "name": "Veermark (Las Praderas)",
          "climate": "Tierras del Hogar, pero más extremo. Inviernos fríos y ventosos y veranos calurosos y secos."
        }
      },
      {
        "id": "G10",
        "region_info": {
          "name": "Sutmark (El Paso Alto)",
          "climate": "Tierras del Hogar, pero más cálido. Seco, rozando lo árido."
        }
      }
];
    
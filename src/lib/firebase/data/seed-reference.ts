

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
        "population": {
          "total": "Desconocida",
          "breakdown": "Se cree que está habitado por los gigantes de hielo más poderosos, dragones del Hellfrost y otros demonios monstruosos."
        },
        "ruler": "Desconocido",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "El Hellfrost apareció como un evento repentino y cataclísmico antes de la Guerra de la Ventisca, expandiéndose a un ritmo alarmante y borrando culturas enteras. Después de la guerra, la misteriosa Muralla de Hielo se levantó del suelo, aislando estos páramos helados del resto de Rassilon. Esta región profunda es la fuente del frío antinatural y las bestias horripilantes que plagan las Tierras de Invierno.",
        "government": "No se conoce ningún gobierno formal. Es una tierra gobernada por el poder bruto y primario, donde las criaturas más fuertes dominan su territorio.",
        "military": "Los habitantes inteligentes, como los gigantes de hielo y los osos blancos, son una fuerza militar en sí mismos. Están adaptados al frío extremo y representan una amenaza constante para las tierras al sur de la Muralla de Hielo.",
        "geography": "Esta región es más hermosa y peligrosa de lo que cualquier skald puede describir. Presenta vastos campos de hielo afilado más grandes que países enteros, imponentes volcanes que escupen fuego frío y roca fangosa, y majestuosas montañas que se alzan como cuchillas en el horizonte. En los días más claros es visible un colosal pináculo de hielo, rodeado por dragones de una milla de largo.",
        "climate": "Frío sobrenatural y extremo. Las temperaturas son lo suficientemente bajas como para congelar la carne expuesta en segundos. El clima está dominado por vientos constantes con fuerza de huracán que transportan partículas de hielo afiladas como cuchillas, y lluvia de puro fuego frío."
      }
    },
    {
      "id": "A2",
      "region_info": {
        "name": "El Hellfrost (Páramos Interiores)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Orcos, goblins y gigantes de hielo se encuentran entre los habitantes menos peligrosos."
        },
        "ruler": "Desconocido",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Los Caballeros de la Lanza y otros valientes aventureros han explorado solo una pequeña fracción de los páramos invernales. Lo que han encontrado ha causado que más de uno caiga muerto del susto. Los horrores que yacen hacia el núcleo es mejor dejarlos a la imaginación junto a un fuego cálido, lejos del aullido del viento del Hellfrost.",
        "government": "Prevalece la anarquía y el gobierno del más fuerte. Las tribus orcas y los clanes de gigantes de hielo se han adaptado al frío intenso, pero no son los amos de esta tierra.",
        "military": "Los habitantes están en un constante estado de guerra entre sí y con el propio entorno. No hay ejércitos organizados, solo bandas de guerra y depredadores monstruosos.",
        "geography": "Una continuación del paisaje extraño y mortal del núcleo. Las características incluyen campos de hielo y nieve tan vastos y monótonos que pueden volver loco a una persona con solo verlos. Los rumores más extraños se relacionan con 'la Herida', un cañón de cuatro millas de profundidad del que emana vapor caliente, impidiendo que se forme hielo cerca.",
        "climate": "Frío extremo y sobrenatural. Aunque no está en el nadir absoluto del núcleo, el clima sigue siendo hostil para casi todas las formas de vida del sur de la Muralla de Hielo."
      }
    },
    {
      "id": "A3",
      "region_info": {
        "name": "El Hellfrost (Páramos Exteriores)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Dominado por extrañas bestias que se asemejan a criaturas más mundanas, como mamuts cuyo aliento puede congelar a un hombre en el acto."
        },
        "ruler": "Desconocido",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Este es el borde del verdadero Hellfrost, la región inmediatamente más allá de la Muralla de Hielo. Fue desde estas tierras que los ejércitos del Hellfrost se derramaron durante la Guerra de la Ventisca. Su proximidad a la Muralla de Hielo la convierte en la parte más 'explorada' del Hellfrost, aunque este es un término relativo para una tierra que mata a casi todos los que entran.",
        "government": "Ninguno. Es un páramo sin ley.",
        "military": "La principal presencia militar son la miríada de bestias del Hellfrost que habitan la región. No hay fuerzas organizadas, solo depredadores y presas en un ecosistema mortal.",
        "geography": "La geografía está definida por la Muralla de Hielo, una barrera de una milla de altura y 40 millas de espesor de hielo escarpado. La propia muralla está plagada de guaridas de dragones del Hellfrost y crioesfinges. La tierra más allá es una extensión desolada de nieve y hielo.",
        "climate": "Frío extremo, aunque ligeramente menos severo que los páramos interiores. El clima sigue siendo peligrosamente impredecible, siendo la norma ventiscas repentinas y temperaturas en picada."
      }
    },
    {
      "id": "A4",
      "region_info": {
        "name": "El Hellfrost (La Muralla de Hielo - Norte)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Dragones del Hellfrost, crioesfinges y otras bestias viles. Se han descubierto aproximadamente 20 guaridas de orcos que se extienden profundamente en la Muralla de Hielo."
        },
        "ruler": "Ninguno",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "La Muralla de Hielo surgió de la nada después de que terminara la Guerra de la Ventisca, deteniendo la expansión hacia el sur del Hellfrost. Los eruditos han debatido su origen durante siglos. Sirve como una barrera casi infranqueable, con solo unas pocas rutas conocidas como la Escalera Blanca que permiten el paso.",
        "government": "N/A",
        "military": "Los habitantes de las cuevas de la Muralla de Hielo, principalmente orcos y monstruos, forman una línea defensiva formidable y caótica contra cualquiera que intente cruzar hacia el Hellfrost.",
        "geography": "Una muralla de una milla de altura y 40 millas de espesor de hielo sólido y escarpado. Escalarla es posible pero excepcionalmente peligroso debido a las caras escarpadas, las condiciones traicioneras y las criaturas monstruosas que hacen sus guaridas en sus cuevas.",
        "climate": "Prevalecen las temperaturas de las Tierras Altas de Invierno en el lado sur, con una caída brusca y dramática hacia el frío sobrenatural del Hellfrost en el lado norte. La propia muralla está sujeta a vientos extremos y un clima impredecible."
      }
    },
    {
      "id": "A5",
      "region_info": {
        "name": "Tierras No Reclamadas (Márgenes del Norte)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari"
        },
        "ruler": "Ninguno",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Una vasta franja de las Tierras de Invierno no reclamada por ningún gobernante poderoso. Estas tierras fueron una vez el hogar de los Selari y otras culturas perdidas durante la Guerra de la Ventisca. Ahora, es una frontera poblada por pequeños asentamientos independientes y clanes nómadas Finnar que desafían los duros elementos y los monstruos mortales.",
        "government": "No hay gobierno central. Cada asentamiento y clan es un oasis de civilización en un paisaje bárbaro, luchando por sobrevivir por su cuenta. No deben lealtad a nadie.",
        "military": "Cada asentamiento es responsable de su propia defensa. No hay ejércitos permanentes, solo milicias y la dureza inherente de un pueblo acostumbrado a una vida de dificultades y peligro constante.",
        "geography": "Los territorios central y occidental son colinas bajas y praderas, enterradas bajo un campo de nieve continuo durante la mayor parte del año. El suelo es duro como la roca incluso en el breve verano. El Páramo Sombrío, una meseta cubierta de nieve de árboles atrofiados y ciénagas heladas, es una característica clave.",
        "climate": "Tierras Altas de Invierno. Los inviernos son brutalmente largos y fríos. En pleno verano, la nieve puede derretirse lo suficiente como para revelar el suelo helado debajo, pero este deshielo es breve y poco fiable. Toda la región está perpetuamente fría."
      }
    },
    {
      "id": "A6",
      "region_info": {
        "name": "Tierras No Reclamadas (Colinas Enanas)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari"
        },
        "ruler": "Ninguno",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Esta área de las Tierras No Reclamadas es notable por la feroz protección que los enanos dan a las ruinas aquí. La ciudad-fortaleza fue abandonada cuando sus habitantes marcharon hacia el norte para ayudar a Karad Marn, y desde entonces han impedido que cualquier otra raza, particularmente orcos y goblins, reclame las ruinas.",
        "government": "Los clanes nómadas Finnar y las pequeñas aldeas de la zona son todos independientes. La única fuerza política general es el decreto enano de que su ciudad en ruinas está fuera de los límites.",
        "military": "Los Finnar y Tuomi locales son guerreros capaces, pero la principal fuerza militar son las patrullas enanas de las Tierras del Hogar que periódicamente barren la zona para expulsar a los orcos y hacer cumplir su reclamo sobre las ruinas.",
        "geography": "Una región de colinas empinadas que contiene las ruinas de una pequeña ciudad fortaleza enana. En tiempos más antiguos, antes del invierno extremo, estas laderas se usaban como punto de encuentro para el comercio entre enanos y otras razas. Varias caravasares en ruinas salpican las laderas más altas.",
        "climate": "Tierras Altas de Invierno. El terreno montañoso crea patrones climáticos impredecibles, con valles que a menudo se llenan de profundos ventisqueros de nieve mientras que los picos son barridos por el viento."
      }
    },
    {
      "id": "A7",
      "region_info": {
        "name": "Tierras No Reclamadas (El Gran Bosque)",
        "population": {
          "total": "100,000+",
          "breakdown": "Principalmente elfos de la taiga y clanes Finnar, pero también hogar de hadas, goblins, orcos y trolls."
        },
        "ruler": "Ninguno",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "El Gran Bosque es un vasto y antiguo bosque de hoja perenne que se extiende por las Tierras No Reclamadas occidentales. Es un lugar salvaje y peligroso, en gran parte intacto por las razas civilizadas, que lo ven solo como otra parte del vasto e inconquistado territorio del norte.",
        "government": "Ningún gobierno central. Los clanes de elfos de la taiga y Finnar que viven aquí son nómadas e independientes, gobernándose a sí mismos sin interferencia externa.",
        "military": "Los elfos y Finnar que habitan el bosque son hábiles cazadores y guerreros, expertos en la guerra de guerrillas dentro de su patria boscosa. Son un elemento disuasorio para los orcos y goblins que también habitan en el bosque.",
        "geography": "Un extenso bosque de hoja perenne. El terreno es difícil, una mezcla de bosques densos, valles ocultos y arroyos que están congelados durante la mayor parte del año. Los dragones del Hellfrost de las Montañas Grises al oeste y la Muralla de Hielo al norte son una amenaza aérea constante.",
        "climate": "Tierras Altas de Invierno. La densa cubierta forestal proporciona algo de refugio del viento y la nieve, lo que lo hace ligeramente más habitable que las llanuras abiertas, aunque el frío sigue siendo intenso y peligroso."
      }
    },
    {
      "id": "A8",
      "region_info": {
        "name": "Tierras No Reclamadas (Bosque Alto)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Una zona en disputa habitada por elfos de la taiga, enanos de hielo, orcos y gigantes de hielo."
        },
        "ruler": "Ninguno (en disputa)",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "El Bosque Alto es una región amargamente disputada. Sirve como un amortiguador estratégico vital para la ciudad enana de Karad Marn. Si cayera completamente en manos de los orcos y gigantes de la Muralla de Hielo y las Montañas de la Guadaña, la ruta principal hacia la ciudad sitiada estaría en peligro.",
        "government": "No hay gobierno, solo una guerra constante de bajo nivel entre las diversas facciones que compiten por el control del bosque.",
        "military": "Bandas de elfos de la taiga y enanos de hielo controlan la parte occidental del bosque, luchando tenazmente contra los orcos y gigantes de hielo que controlan las secciones central y oriental.",
        "geography": "Una densa franja de pinos, coníferas y abetos, encajada entre las Montañas Jotunvalk y de la Guadaña, la Muralla de Hielo y la Meseta Caída. El terreno es montañoso y difícil, lo que hace que los movimientos de tropas a gran escala sean casi imposibles.",
        "climate": "Tierras Altas de Invierno. La gran altitud y el terreno montañoso hacen de este uno de los bosques más fríos y traicioneros de la región."
      }
    },
    {
      "id": "A9",
      "region_info": {
        "name": "Tierras No Reclamadas (Bosque Congelado)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Espectros de escarcha y momias de hielo."
        },
        "ruler": "Desconocido",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Madera de Hielo"],
        "background": "Antaño el magnífico reino de los elfos de la taiga de Morenelion, fue congelado instantáneamente por un viento sobrenatural al comienzo de la Guerra de la Ventisca. Los árboles se convirtieron instantáneamente en valiosa madera de hielo y sus habitantes en muertos vivientes espectros de escarcha y momias de hielo. Las caravanas enanas hacen expediciones anuales para cosechar la madera de hielo.",
        "government": "N/A",
        "military": "Los elfos no muertos que acechan en el bosque son sus únicos defensores. Son una amenaza mortal para cualquiera que se adentre demasiado, especialmente en las regiones centrales donde tienden a congregarse.",
        "geography": "Un vasto bosque de madera de hielo, congelado en el tiempo. Nada vivo crece aquí. La Escalera Blanca, un paso traicionero a través de la Muralla de Hielo, comienza en este bosque. La región está bordeada por las Montañas de la Guadaña. Todo el valle está repleto de bestias del Hellfrost.",
        "climate": "Un frío mágico y antinatural impregna el bosque, que permanece a una temperatura constante de -40 grados Fahrenheit, independientemente de la estación. El aire es quieto y gélido, un lugar de profundo silencio y muerte."
      }
    },
    {
      "id": "A10",
      "region_info": {
        "name": "Rimeholm (Montañas Jotunvalk)",
        "population": {
          "total": 19531,
          "breakdown": "100% elfos de la taiga"
        },
        "ruler": "El Rey Blanco",
        "religion": "Ullr, Kenaz, Eostre, Tiw",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "El mayor reino superviviente de los elfos de la taiga, Rimeholm se convirtió en su principal refugio después de la destrucción de Morenelion. A salvo detrás de las Montañas Jotunvalk, sobrevivieron a la Guerra de la Ventisca en gran parte intactos. Sin embargo, el levantamiento de la Muralla de Hielo los dejó con orcos y gigantes como vecinos cercanos.",
        "government": "Una monarquía absoluta gobernada por el Rey Blanco, un druida antiguo y poderoso. Es servido por un consejo de druidas, clérigos y elementalistas conocidos como los Señores Blancos. Sus dos hijos, el guerrero Cortahielo y el druida Ojosnocturnos, son rivales por la sucesión.",
        "military": "El ejército está compuesto por pequeñas bandas de exploradores y druidas expertos en tiro con arco, esquí y montañismo. Los guardaespaldas de élite del Rey Blanco, la Guardia de la Ventisca, son guerreros formidables y practicantes de hrimwisardry (magia de hielo).",
        "geography": "El reino se centra en el Bosque Blanco, un bosque de pinos y abetos en las laderas del sur de las Montañas Jotunvalk. Las montañas son escarpadas e infestadas de orcos y gigantes. El bosque está protegido por un perímetro de Piedras del Hogar mágicas que protegen de lo peor de la nieve y el hielo.",
        "climate": "Tierras Altas de Invierno. Mientras que las Piedras del Hogar mantienen el núcleo del bosque mágicamente templado (equivalente a las Tierras del Hogar), las montañas circundantes están sujetas al frío brutal y las fuertes nieves de la región."
      }
    },
    {
      "id": "B1",
      "region_info": {
        "name": "El Hellfrost (Muralla de Hielo - Norte)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Una región desolada, hogar de las bestias del Hellfrost más resistentes y tribus potencialmente no descubiertas de gigantes de hielo u orcos adaptados al frío extremo."
        },
        "ruler": "Ninguno",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Esta sección de la Muralla de Hielo del norte es aún más remota y peligrosa que las áreas más al oeste. Marca la franja absoluta del mundo conocido, un lugar del que ninguna expedición conocida ha regresado.",
        "government": "N/A. Anarquía y la ley de la naturaleza.",
        "military": "Los habitantes naturales, criaturas monstruosas de hielo y frío, son la única presencia militar. Son altamente territoriales y hostiles a todos los intrusos.",
        "geography": "Una continuación de la colosal Muralla de Hielo, una barrera de hielo de una milla de altura. Esta área es probablemente monótona, un acantilado de hielo barrido por los vientos del Hellfrost. Cualquier paso o cueva aquí es desconocido y estaría excepcionalmente bien escondido o sería peligroso.",
        "climate": "El frío más extremo imaginable en Rassilon. La cara norte es una pared escarpada de hielo barrida por vientos sobrenaturales, mientras que la cara sur experimenta las condiciones más duras de las Tierras Altas de Invierno."
      }
    },
    {
      "id": "B2",
      "region_info": {
        "name": "Arenas Brillantes",
        "population": {
          "total": "2,468+",
          "breakdown": "70% Anari, 25% nacidos de la escarcha, 5% Saxa, además de un número desconocido de orcos, gigantes y trolls."
        },
        "ruler": "Ninguno (consejo municipal en Glaston)",
        "religion": "Thrym, Kenaz, Sigel",
        "imports": ["Cerveza", "ropa", "grano", "carne"],
        "exports": ["Vidrio"],
        "background": "Los eruditos han debatido durante mucho tiempo la formación de las Arenas Brillantes, ya que los registros antiguos muestran pastizales fértiles en la región antes de la Guerra de la Ventisca. La teoría actual favorita es que una estrella cayó aquí, quemando la tierra y levantando las montañas. La única evidencia que respalda esto es el Lago de Cristal. Docenas de ruinas quemadas salpican el paisaje. Las Arenas Brillantes permanecen aisladas y solo se conocen como un páramo estéril para las razas del hogar.",
        "government": "El único gobierno verdadero en la región es el consejo municipal de Glaston. Nueve concejales son elegidos cada año de la población. También hay tres escaños automáticos, uno para cada uno de los sacerdotes principales de Kenaz y Sigel, y uno para el comandante de la guardia. Todos los concejales tienen un voto igual.",
        "military": "Glaston, el único asentamiento en el reino, tiene un ejército de 100 infantes, todos mercenarios. Los mercenarios se dividen en tres unidades: una guardia permanente para el asentamiento, una escolta para los envíos de vidrio y exploradores que operan a lo largo de la ruta comercial y alrededor de la ciudad.",
        "geography": "Un desierto frío de origen antinatural, rodeado por montañas al este y al sur, la Muralla de Hielo al norte y el Mar Blanco al oeste. Aparte de las Grandes Dunas y las estribaciones de las montañas, gran parte de la tierra es una extensión monótona de arena, pequeñas rocas y llanuras heladas. La característica clave es el Lago de Cristal, un bloque sólido de vidrio excepcionalmente puro.",
        "climate": "Tierras Altas de Invierno. La temperatura es notablemente más cálida que en las tierras circundantes, en el peor de los casos a la par con las Tierras Bajas de Invierno. A pesar de tener una costa, la precipitación es extremadamente rara, aunque se forma hielo sobre las arenas estériles durante los períodos de mucho frío."
      }
    },
    {
      "id": "B3",
      "region_info": {
        "name": "Tierras No Reclamadas (Lago Aguanieve)",
        "population": {
          "total": "100,000+",
          "breakdown": "55% Finnar, 15% enanos, 15% Tuomi, 10% elfos de la taiga, 3% Saxa, 2% Anari"
        },
        "ruler": "Ninguno",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Esta región está definida por el enorme Lago Aguanieve, el más grande del este de Rassilon. Es un recurso crítico para los nómadas Finnar y los asentamientos dispersos que salpican sus orillas. Las aguas del lago son una fuente tanto de sustento como de peligro.",
        "government": "Los asentamientos alrededor del lago son independientes. Los clanes nómadas Finnar que frecuentan la zona siguen a sus propios líderes y tradiciones tribales, sin deber lealtad a ningún gobernante terrateniente.",
        "military": "Cada asentamiento y clan es responsable de su propia defensa. No hay ejércitos unificados, solo milicias y bandas de guerra locales.",
        "geography": "El paisaje está dominado por el Lago Aguanieve. Las orillas occidental y norte marcan el comienzo efectivo de las Tierras Altas de Invierno. El lago está rodeado por una mezcla de bosque de taiga, llanuras y las estribaciones de los Picos Sigil. La larga y estrecha Isla de las Ruinas, llena de estructuras inexploradas, se encuentra entre los lagos Aguanieve y Blanco.",
        "climate": "Tierras Altas de Invierno. Casi todo el lago se congela en invierno, aunque el hielo hacia el centro es muy delgado, lo que lo convierte en un cruce traicionero. Las tierras circundantes están enterradas en nieve profunda durante la mayor parte del año."
      }
    },
    {
      "id": "B4",
      "region_info": {
        "name": "Tierras No Reclamadas (La Empalizada)",
        "population": {
          "total": "100,000+",
          "breakdown": "Pequeñas aldeas y granjas independientes, principalmente Saxa y Tuomi."
        },
        "ruler": "Ninguno",
        "religion": "Ullr, Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Esta región sirve como amortiguador contra los gigantes de hielo del Trono del Gigante al oeste. Los colonos aquí son un pueblo resistente e independiente, acostumbrado a defenderse de las incursiones. A medida que los inviernos empeoran y los gigantes se vuelven más audaces, más colonos abandonan sus hogares y se mudan.",
        "government": "Cada asentamiento es independiente y se autogobierna, una colección de aldeas y granjas sin lazos formales entre sí.",
        "military": "La defensa es local. Cada aldea y granja debe proveer para su propia protección. Se han construido atalayas en las laderas más altas para advertir de los ataques desde el Trono del Gigante.",
        "geography": "Una región de colinas que se elevan abruptamente en el oeste en escalones cada vez mayores, formando una barrera natural. Las orillas occidentales alrededor del área donde se encuentran los lagos Aguanieve y Blanco albergan muchos pequeños asentamientos. El río Páramohelado proporciona un coto de caza ideal para la pesca en hielo.",
        "climate": "Tierras Altas de Invierno. Las colinas escalonadas de la Empalizada ofrecen cierta protección contra los peores vientos que vienen del Trono del Gigante, pero la región todavía está sujeta a un frío profundo y fuertes nevadas."
      }
    },
    {
      "id": "B5",
      "region_info": {
        "name": "Isla Hrimthyr",
        "population": {
          "total": "12,000+",
          "breakdown": "1,000 gigantes de hielo, 10,000 orcos, 1,000 mercenarios nacidos de la escarcha (estimado)."
        },
        "ruler": "Alto Rey de Hielo Nagal Alientogélido",
        "religion": "Thrym, Dargar",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Considerada la patria de los gigantes de hielo, la Isla Hrimthyr llegó a su estado actual durante la Guerra de la Ventisca, cuando un volcán de fuego frío entró en erupción, formando la isla de roca fangosa semicongelada. Se utilizó como base para ataques contra el oeste de Rassilon. El gobernante actual, Nagal, está planeando una gran invasión de las Tierras de Batalla.",
        "government": "Una autocracia absoluta. El Alto Rey de Hielo Nagal gobierna con un puño de hielo negro. Cualquier debilidad conduce a la muerte a manos de un rival. El propio Nagal tomó el poder matando a su predecesor por liderazgo inepto.",
        "military": "Nagal comanda un gran ejército de gigantes de hielo y orcos, reforzado por sacerdotes de Thrym, mercenarios nacidos de la escarcha, jinetes de lobos goblins de hielo y hrimwisards renegados. El ejército está bien organizado en regimientos y compañías, una desviación de las tácticas típicas de los gigantes.",
        "geography": "Una isla de hielo sólido, que todavía se expande a medida que el volcán de fuego frío siempre activo, la Fauce de Thrym, arroja roca fangosa fundida al Mar Blanco. No hay vida vegetal. El lado este es montañoso (Montañas de la Cordillera de los Jarls), mientras que el oeste consiste en colinas onduladas (Colinas del Oso de Hielo) utilizadas como coto de caza para osos polares.",
        "climate": "Permanentemente congelado. La actividad volcánica no calienta la isla, sino que aumenta su masa de hielo y roca fangosa. El Mar Blanco circundante a menudo está obstruido con hielo compacto."
      }
    },
    {
      "id": "B6",
      "region_info": {
        "name": "Trono del Gigante",
        "population": {
          "total": "3,300+",
          "breakdown": "300 gigantes de hielo, 3,000 orcos y goblins (ambos estimados)."
        },
        "ruler": "Rey Kaldr el Malvado",
        "religion": "Thrym",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Un reino reconocido solo por los Caballeros del Hogar, aparece en la mayoría de los mapas como una advertencia. Los primeros informes de gigantes de hielo aquí datan de después del Alzamiento del Hielo. Solo en los últimos 40 años han comenzado a hacer sentir su presencia, incitando a las tribus de goblins y asaltando las granjas Saxa.",
        "government": "El Rey Kaldr gobierna con un puño de hielo negro. Siempre está vigilante, atento a los rivales que puedan adquirir demasiada gloria y busquen usurpar su trono. Ser honrado por Kaldr es tanto un reconocimiento al servicio como una advertencia.",
        "military": "Prácticamente todos los habitantes forman parte del ejército de Kaldr. Provienen de tribus dispares y les gusta tanto luchar entre sí como con otras razas. Kaldr tiene infantería, arqueros, artillería de asedio, jinetes de lobos, hrimwisards y clérigos de Thrym a su disposición.",
        "geography": "La tierra comprende el abultamiento sur de los Picos Sigil y las estribaciones circundantes. El río Aguanieve marca su frontera sur. Los Picos Sigil son una cordillera escarpada hogar de orcos, goblins y gigantes. La fortaleza del Trono del Gigante en sí es un torreón gargantuesco que se eleva orgánicamente desde una montaña.",
        "climate": "Tierras Altas de Invierno. La gran altitud de los Picos Sigil asegura un clima brutalmente frío con cobertura de nieve durante todo el año y tormentas frecuentes y violentas."
      }
    },
    {
      "id": "B7",
      "region_info": {
        "name": "Las Tierras Libres (El Bosque de Piedra)",
        "population": {
          "total": "4,000+",
          "breakdown": "90% elfos del hogar, 8% Saxa, 2% engro."
        },
        "ruler": "Asentamientos independientes",
        "religion": "Creencias druídicas y elementales centradas en los círculos de piedra.",
        "imports": ["Ninguna"],
        "exports": ["Ninguna"],
        "background": "Un bosque antiguo incluso para los estándares élficos, el Bosque de Piedra contiene seis círculos de piedra principales y diez veces más piedras erguidas individuales, que son anteriores a todas las culturas conocidas en Rassilon. Estos círculos son lugares de poder importantes para druidas y elementalistas de la tierra.",
        "government": "No hay gobierno central. Las comunidades de elfos del hogar y los pocos asentamientos humanos operan de forma independiente, aunque los druidas y elementalistas que frecuentan los círculos de piedra actúan como una autoridad laxa.",
        "military": "Orcos y goblins de la Barrera de Hielo amenazan la parte norte del bosque, pero el poder combinado de los druidas y los elementalistas de la tierra les ha impedido ganar un punto de apoyo permanente.",
        "geography": "Un antiguo bosque caducifolio que contiene numerosos círculos de piedra misteriosos. El más famoso es las Nueve Hermanas en el centro del bosque. La Piedra Susurrante, en el borde oriental, produce una corriente constante de susurros débiles e ininteligibles.",
        "climate": "Tierras Bajas de Invierno. El denso bosque proporciona algo de refugio de lo peor del invierno, pero el clima sigue siendo frío y duro, con inviernos largos y veranos cortos y frescos."
      }
    },
    {
      "id": "B8",
      "region_info": {
        "name": "Las Tierras Libres (Spyre y El Pináculo)",
        "population": {
          "total": 18725,
          "breakdown": "Principalmente Anari y Saxa, con una importante comunidad de enanos de hielo en Spyre."
        },
        "ruler": "Conde Baldar Anthwine (en Spyre)",
        "religion": "Thunor, Ertha, el Incognoscible",
        "imports": ["Pieles", "bienes de lujo", "comida", "vino"],
        "exports": ["Cobre", "gemas", "hierro", "piedra"],
        "background": "Esta región está dominada por la ciudad de Spyre, que se asienta sobre una montaña solitaria conocida como el Pináculo. Construida mucho antes de la Guerra de la Ventisca, es una ciudad de misterios antiguos, aislada de las tierras de abajo. El gobernante de la ciudad ha aprobado recientemente una ley que permite a los enanos de hielo residentes pagar menos impuestos a cambio de reparar el único acceso a la ciudad, el desmoronado Puente del Jugador.",
        "government": "Spyre está gobernada por un conde hereditario. Los enanos de hielo de Dvergdelf, tallados en la cara de la montaña, se gobiernan a sí mismos pero son súbditos del conde.",
        "military": "Spyre mantiene su propia guardia de la ciudad. El clan de enanos de hielo proporciona sus propios guerreros, principalmente preocupados por defender su hogar subterráneo.",
        "geography": "El paisaje está dominado por el Pináculo, una única montaña de cima plana que se eleva media milla por encima de las Colinas Menores circundantes. La ciudad de Spyre se asienta en este afloramiento. El único acceso es a través de un largo y sinuoso sendero y un único, antiguo y traicionero puente arqueado. El misterioso edificio de la Aguja domina el horizonte de la ciudad.",
        "climate": "Tierras Bajas de Invierno. La posición elevada de Spyre la hace más fría que las colinas circundantes. Está sujeta a fuertes vientos y fuertes tormentas de invierno, lo que hace que el viaje a través del Puente del Jugador sea extremadamente peligroso."
      }
    },
    {
      "id": "B9",
      "region_info": {
        "name": "Las Tierras Libres (Colinas Menores)",
        "population": {
          "total": "Desconocida",
          "breakdown": "Pequeñas aldeas de Anari y Saxa."
        },
        "ruler": "Asentamientos independientes",
        "religion": "Principalmente el panteón estándar de las Tierras del Hogar.",
        "imports": ["Bienes terminados"],
        "exports": ["Oro", "plata", "alimentos"],
        "background": "Las Colinas Menores se llaman así porque parecen meros hormigueros en comparación con la imponente montaña del Pináculo que rodean. Las aldeas aquí se ganan la vida extrayendo pequeñas cantidades de oro y plata o cultivando y vendiendo su excedente de alimentos a la gente de Spyre.",
        "government": "Cada aldea es independiente, sin ningún gobernante que controle toda la región. Tienen una relación laxa e informal con la ciudad de Spyre.",
        "military": "Cada aldea mantiene su propia milicia. Deben enfrentarse a gigantes, trolls y orcos que viven en la zona, así como a incursiones ocasionales de no muertos de las Tierras Marchitas al norte. A menudo son ayudados por la milicia de Spyre y los elfos de Angarion.",
        "geography": "Una cadena de colinas altas y estériles que rodean la montaña del Pináculo. Unas pocas pequeñas aldeas salpican el paisaje. La zona es hogar de gigantes, trolls y orcos, aunque no en grandes números.",
        "climate": "Tierras Bajas de Invierno. Las colinas ofrecen poca protección contra los elementos, lo que resulta en un clima frío y ventoso con importantes nevadas invernales."
      }
    },
    {
      "id": "B10",
      "region_info": {
        "name": "Angarion (El Corazón del Bosque)",
        "population": {
          "total": 23048,
          "breakdown": "99% elfos del hogar, 1% engro"
        },
        "ruler": "El Rey Brillante",
        "religion": "Sigel, Eostre y Ullr",
        "imports": ["Autosuficiente"],
        "exports": ["Arte", "joyería"],
        "background": "El centro de la cultura de los elfos del hogar y hogar de su capital, la ciudad de Angarion. Desde el avance del Hellfrost, la población ha aumentado constantemente a medida que los refugiados acuden aquí en busca de seguridad. Los elfos aquí se han retirado de los asuntos de otras razas, solo emergiendo para repeler las incursiones del Pantano de Aguas Fétidas o las Tierras Marchitas.",
        "government": "Una monarquía absoluta gobernada por el Rey Brillante, un elfo de piel dorada de la profecía. No ha sido visto en público durante un siglo, y gobierna a través de su chambelán. Los rivales potenciales al trono están conspirando para el día de su muerte.",
        "military": "Todo elfo adulto es un soldado. Todo noble en Angarion mantiene un ejército de arqueros y druidas. El Rey Brillante mantiene una guardia real de infantería blindada conocida como bailarines de espadas. Están listos para morir por su rey en cualquier momento.",
        "geography": "Un antiguo bosque caducifolio de robles, abedules y arces. La vegetación del suelo es densa, y los senderos son pocos y distantes entre sí. Se cree que los elfos pueden hacer que el bosque se cierre sobre los intrusos. El río Corriente Verde serpentea perezosamente a través del bosque. Las Colinas Desnudas, donde no crece nada, son una extraña y estéril característica dentro del bosque.",
        "climate": "Tierras del Hogar. El denso bosque proporciona un microclima más protegido y estable que las tierras circundantes, aunque todavía está sujeto a los fríos inviernos de la región."
      }
    }
]



// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial item data needed to seed the Firestore database.

export const hellfrostItems = {
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
  };
    
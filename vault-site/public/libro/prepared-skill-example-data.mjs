// Generated noncanonical public example. No campaign secrets.
export default {
  "paladin": {
    "catch": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-paladin",
      "actorId": "paladin",
      "revision": 3,
      "eventId": "evt-8bba85cd63ccdeb18cc161ff68bfad29",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-8bba85cd63ccdeb18cc161ff68bfad29",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra no tuvo éxito.",
          " ",
          {
            "check": "evt-8bba85cd63ccdeb18cc161ff68bfad29.module.catch"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-8bba85cd63ccdeb18cc161ff68bfad29.module.catch",
            "actorId": "paladin",
            "actorName": "Paladín",
            "skillId": "brawn",
            "skillName": "Fuerza aplicada",
            "base": 55,
            "target": 37,
            "difficulty": "Difícil",
            "reason": "Sujetar un caballo desbocado.",
            "dice": "D100",
            "roll": 89,
            "outcome": "failure",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "55 × 0.6666666666666666 = 37"
          }
        ]
      }
    },
    "dodge": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-paladin",
      "actorId": "paladin",
      "revision": 3,
      "eventId": "evt-46c9a6c275b54733e6f6d7fde1c8d0de",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-46c9a6c275b54733e6f6d7fde1c8d0de",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra tuvo éxito.",
          " ",
          {
            "check": "evt-46c9a6c275b54733e6f6d7fde1c8d0de.module.dodge"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-46c9a6c275b54733e6f6d7fde1c8d0de.module.dodge",
            "actorId": "paladin",
            "actorName": "Paladín",
            "skillId": "evade",
            "skillName": "Esquiva",
            "base": 40,
            "target": 40,
            "difficulty": "Estándar",
            "reason": "Apartarse de un caballo desbocado.",
            "dice": "D100",
            "roll": 22,
            "outcome": "success",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "40 × 1 = 40"
          }
        ]
      }
    }
  },
  "rogue": {
    "catch": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-rogue",
      "actorId": "rogue",
      "revision": 3,
      "eventId": "evt-085dc9574dce02acca1a79dc54422fb5",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-085dc9574dce02acca1a79dc54422fb5",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra no tuvo éxito.",
          " ",
          {
            "check": "evt-085dc9574dce02acca1a79dc54422fb5.module.catch"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-085dc9574dce02acca1a79dc54422fb5.module.catch",
            "actorId": "rogue",
            "actorName": "Pícaro",
            "skillId": "brawn",
            "skillName": "Fuerza aplicada",
            "base": 32,
            "target": 21,
            "difficulty": "Difícil",
            "reason": "Sujetar un caballo desbocado.",
            "dice": "D100",
            "roll": 77,
            "outcome": "failure",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "32 × 0.6666666666666666 = 21"
          }
        ]
      }
    },
    "dodge": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-rogue",
      "actorId": "rogue",
      "revision": 3,
      "eventId": "evt-3a070ba9c9913bb5a7c713a68cab055c",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-3a070ba9c9913bb5a7c713a68cab055c",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra no tuvo éxito.",
          " ",
          {
            "check": "evt-3a070ba9c9913bb5a7c713a68cab055c.module.dodge"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-3a070ba9c9913bb5a7c713a68cab055c.module.dodge",
            "actorId": "rogue",
            "actorName": "Pícaro",
            "skillId": "evade",
            "skillName": "Esquiva",
            "base": 70,
            "target": 70,
            "difficulty": "Estándar",
            "reason": "Apartarse de un caballo desbocado.",
            "dice": "D100",
            "roll": 93,
            "outcome": "failure",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "70 × 1 = 70"
          }
        ]
      }
    }
  },
  "mage": {
    "catch": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-mage",
      "actorId": "mage",
      "revision": 3,
      "eventId": "evt-79abb8ae6acebc9b275752f4f43dde18",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-79abb8ae6acebc9b275752f4f43dde18",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra tuvo éxito.",
          " ",
          {
            "check": "evt-79abb8ae6acebc9b275752f4f43dde18.module.catch"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-79abb8ae6acebc9b275752f4f43dde18.module.catch",
            "actorId": "mage",
            "actorName": "Maga",
            "skillId": "brawn",
            "skillName": "Fuerza aplicada",
            "base": 22,
            "target": 15,
            "difficulty": "Difícil",
            "reason": "Sujetar un caballo desbocado.",
            "dice": "D100",
            "roll": 3,
            "outcome": "success",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "22 × 0.6666666666666666 = 15"
          }
        ]
      }
    },
    "dodge": {
      "schemaVersion": 1,
      "kind": "confirmed-narration",
      "campaignId": "horse-demo-mage",
      "actorId": "mage",
      "revision": 3,
      "eventId": "evt-8313b68ae61a39f97f5edda9c564d516",
      "locale": "es-AR",
      "narratorVersion": "narrative-confirmed-v1",
      "presentationStatus": "fallback",
      "presentation": {
        "id": "evt-8313b68ae61a39f97f5edda9c564d516",
        "revision": 3,
        "phase": "module-intent",
        "title": "Prueba de habilidad",
        "roman": "",
        "text": [
          "La maniobra tuvo éxito.",
          " ",
          {
            "check": "evt-8313b68ae61a39f97f5edda9c564d516.module.dodge"
          }
        ],
        "checks": [
          {
            "schemaVersion": 1,
            "id": "evt-8313b68ae61a39f97f5edda9c564d516.module.dodge",
            "actorId": "mage",
            "actorName": "Maga",
            "skillId": "evade",
            "skillName": "Esquiva",
            "base": 50,
            "target": 50,
            "difficulty": "Estándar",
            "reason": "Apartarse de un caballo desbocado.",
            "dice": "D100",
            "roll": 16,
            "outcome": "success",
            "visibility": "player",
            "source": "prepared-skill-v1",
            "formula": "50 × 1 = 50"
          }
        ]
      }
    }
  }
};

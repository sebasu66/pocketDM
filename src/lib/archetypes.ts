
export type Archetype = {
    archetype: string;
    position: 'low' | 'mid' | 'high';
    resolve: 'low' | 'mid' | 'high';
    altruism: 'low' | 'mid' | 'high';
    discipline: 'low' | 'mid' | 'high';
    description: string;
};

const archetypes: Archetype[] = [
  {
    "archetype": "Loot Goblin",
    "position": "low",
    "resolve": "low",
    "altruism": "low",
    "discipline": "low",
    "description": "Cowardly, greedy, selfish opportunist who hides and grabs treasure."
  },
  {
    "archetype": "Merchant Hero",
    "position": "mid",
    "resolve": "mid",
    "altruism": "high",
    "discipline": "high",
    "description": "Pragmatic leader who values allies and survival through planning."
  },
  {
    "archetype": "Holy Fool",
    "position": "mid",
    "resolve": "low",
    "altruism": "high",
    "discipline": "low",
    "description": "Well-meaning but reckless altruist who makes clumsy sacrifices."
  },
  {
    "archetype": "Henchman",
    "position": "mid",
    "resolve": "low",
    "altruism": "mid",
    "discipline": "mid",
    "description": "Follower who rarely leads, loyal but unremarkable."
  },
  {
    "archetype": "Mercenary",
    "position": "mid",
    "resolve": "mid",
    "altruism": "low",
    "discipline": "high",
    "description": "Disciplined fighter motivated by coin, not loyalty."
  },
  {
    "archetype": "Joker",
    "position": "mid",
    "resolve": "low",
    "altruism": "low",
    "discipline": "low",
    "description": "Chaotic, unreliable trickster who bumbles through."
  },
  {
    "archetype": "Giant Slaughter",
    "position": "high",
    "resolve": "mid",
    "altruism": "low",
    "discipline": "mid",
    "description": "Brutal combatant, power over precision, likes the spotlight."
  },
  {
    "archetype": "Troubleshooter",
    "position": "low",
    "resolve": "high",
    "altruism": "mid",
    "discipline": "high",
    "description": "Smart problem-solver, tactical backliner who resolves crises."
  },
  {
    "archetype": "Dark Knight",
    "position": "high",
    "resolve": "high",
    "altruism": "low",
    "discipline": "mid",
    "description": "Relentless but selfish fighter with a personal agenda."
  },
  {
    "archetype": "Follower",
    "position": "low",
    "resolve": "mid",
    "altruism": "high",
    "discipline": "mid",
    "description": "Supportive but passive, does what others decide."
  },
  {
    "archetype": "Brute",
    "position": "high",
    "resolve": "low",
    "altruism": "low",
    "discipline": "low",
    "description": "Muscle without brains, charges then flees when things go wrong."
  },
  {
    "archetype": "Hellhound",
    "position": "high",
    "resolve": "high",
    "altruism": "low",
    "discipline": "low",
    "description": "Savage, reckless melee attacker with no restraint."
  },
  {
    "archetype": "Assassin",
    "position": "low",
    "resolve": "high",
    "altruism": "low",
    "discipline": "high",
    "description": "Precise, deadly, disciplined killer who hides in the shadows."
  },
  {
    "archetype": "Treasure Hunter",
    "position": "mid",
    "resolve": "mid",
    "altruism": "low",
    "discipline": "mid",
    "description": "Self-serving adventurer, avoids risk unless treasure is involved."
  },
  {
    "archetype": "Maniac",
    "position": "high",
    "resolve": "high",
    "altruism": "low",
    "discipline": "low",
    "description": "Unstable, bloodthirsty, unpredictable brawler."
  },
  {
    "archetype": "Zealot",
    "position": "high",
    "resolve": "high",
    "altruism": "high",
    "discipline": "low",
    "description": "Fanatical believer who sacrifices everything for their cause."
  },
  {
    "archetype": "Pacifist",
    "position": "low",
    "resolve": "low",
    "altruism": "high",
    "discipline": "high",
    "description": "Avoids violence, values friends and peace at any cost."
  },
  {
    "archetype": "Lone Wolf",
    "position": "mid",
    "resolve": "high",
    "altruism": "low",
    "discipline": "high",
    "description": "Independent, disciplined fighter who trusts only themselves."
  },
  {
    "archetype": "Braveheart",
    "position": "high",
    "resolve": "high",
    "altruism": "high",
    "discipline": "high",
    "description": "Heroic protector, courageous and altruistic leader."
  },
  {
    "archetype": "Berserker",
    "position": "high",
    "resolve": "high",
    "altruism": "mid",
    "discipline": "low",
    "description": "Rages uncontrollably, fights to the death without tactics."
  },
  {
    "archetype": "Outcast",
    "position": "low",
    "resolve": "low",
    "altruism": "low",
    "discipline": "mid",
    "description": "Rejected loner, cautious, distrustful, avoids conflict."
  },
  {
    "archetype": "Protectionist",
    "position": "mid",
    "resolve": "high",
    "altruism": "high",
    "discipline": "mid",
    "description": "Guardian of allies, balances courage with loyalty."
  },
  {
    "archetype": "Fanatic",
    "position": "mid",
    "resolve": "high",
    "altruism": "high",
    "discipline": "low",
    "description": "Obsessively devoted, self-sacrificing but tactically careless."
  },
  {
    "archetype": "Brazen",
    "position": "high",
    "resolve": "mid",
    "altruism": "mid",
    "discipline": "low",
    "description": "Cocky and daring, seeks glory, often reckless."
  }
];

type Category = 'low' | 'mid' | 'high';

function getCategory(value: number): Category {
    if (value <= 33) return 'low';
    if (value <= 66) return 'mid';
    return 'high';
}

function calculateDistance(a1: Archetype, cats: Record<keyof Omit<Archetype, 'archetype' | 'description'>, Category>): number {
    let distance = 0;
    if (a1.position !== cats.position) distance++;
    if (a1.resolve !== cats.resolve) distance++;
    if (a1.altruism !== cats.altruism) distance++;
    if (a1.discipline !== cats.discipline) distance++;
    return distance;
}

export function getArchetype(position: number, resolve: number, altruism: number, discipline: number): Archetype {
    const categories = {
        position: getCategory(position),
        resolve: getCategory(resolve),
        altruism: getCategory(altruism),
        discipline: getCategory(discipline),
    };
    
    let closestArchetype = archetypes[0];
    let minDistance = Infinity;

    for (const archetype of archetypes) {
        const distance = calculateDistance(archetype, categories);
        if (distance < minDistance) {
            minDistance = distance;
            closestArchetype = archetype;
        }
    }
    
    return closestArchetype;
}

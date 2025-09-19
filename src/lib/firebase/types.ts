
export interface User {
    id: string;
    name: string;
    email: string;
    role: {
        isGm: boolean;
        isPlayer: boolean;
    };
    avatar: string;
    campaignId: string;
    enabled: boolean;
}

export interface Campaign {
    id:string;
    title: string;
    description: string;
    bannerUrl: string;
    bannerAiHint: string;
    systemPrompt?: string;
    enabled: boolean;
    secretCode: string;
    ownerId: string;
}

export interface ConditionalRule {
    if: string;
    then: string;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    visualPreset: string;
    campaignId: string;
    userId: string;
    isActive: boolean;
    location_cell_id?: string;
    archetypeId?: string; // Helper for creation

    health?: number; // 0-100 percentage
    gold?: number;

    // Copied from Archetype
    race?: string;
    level?: number;
    class?: string;
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    
    // Behavior Profile
    preferredAttack?: string;
    mostPrecious?: string;
    motto?: string;
    conditionalRules?: ConditionalRule[];
    archetype?: string;
    archetypeDescription?: string;

    // Hellfrost specific from Archetype
    attributes?: {
        agility: string;
        smarts: string;
        spirit: string;
        strength: string;
        vigor: string;
    };
    skills?: { [key: string]: string };
    edges?: string[];
    hindrances?: string[];
    inventory?: {
        item: string;
        quantity: number;
        notes: string;
    }[];
    generalBackground?: string;
    glory?: number;
    derived?: {
        pace: number;
        parry: number;
        toughness: number;
        charisma: number;
    };
    arcane?: {
        type: string;
        skill: string;
        powers: string[];
    } | null;
    religion?: {
        god: string;
        powers: string[];
    } | null;
}

export interface NarrativeThread {
    id: string;
    title: string;
    content: string; // Can contain HTML
    imageUrl?: string;
    imageAiHint?: string;
    audioUrl?: string;
    authorId: string; // User ID (always GM)
    campaignId: string;
    createdAt: number; // timestamp
    characterFilterList?: string; // Comma-separated list of character IDs
}

export interface NarrativeComment {
    id:string;
    threadId: string;
    authorId: string; // User ID
    characterId?: string; // Character ID if posted in-character
    text: string;
    hiddenText?: string; // For GM-only notes
    createdAt: number; // timestamp
}

// --- HellFrost Game System Interfaces ---

export interface Race {
    id: string;
    name: string;
    description: string;
    caracteristicas_raciales: string[];
    nombres_ejemplo: {
        [key: string]: any;
    };
}

export interface CharacterCategory {
    id: string;
    name: string;
    description: string;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    base: string; 
}

export interface Hindrance {
    id: string;
    name: string;
    description: string;
    level: 'Mayor' | 'Menor' | 'Menor/Mayor';
}

export interface Attribute {
    id: string;
    name: string;
    description: string;
}

export interface Edge {
    id: string;
    name: string;
    description: string;
    category: string;
    requirements: string;
}

export interface HellfrostItem {
    id: string;
    nombre: string;
    descripcion?: string;
    costo_gs?: number | string;
    costo_multiplicador?: string;
    peso_lbs?: number | string;
    disponibilidad: string;
    notas?: string[] | string;
    fuente: string | string[];
    [key: string]: any; // For other properties like damage, range, etc.
}

export interface Conjuro {
    id: string;
    nombre: string;
    rango: string;
    alcance: string;
    duracion: string;
    trappings: string[];
    efecto: string;
}

export interface Archetype {
  id: string;
  name: string;
  visualPreset: string;
  description: string;
  race: string;
  attributes: {
    agility: string;
    smarts: string;
    spirit: string;
    strength: string;
    vigor: string;
  };
  skills: { [key: string]: string };
  edges: string[];
  hindrances: string[];
  inventory: {
    item: string;
    quantity: number;
    notes: string;
  }[];
  generalBackground: string;
  glory: number;
  derived: {
    pace: number;
    parry: number;
    toughness: number;
    charisma: number;
  };
  arcane: {
    type: string;
    skill: string;
    powers: string[];
  } | null;
  religion: {
    god: string;
    powers: string[];
  } | null;
}

export interface Concepto {
    id: string;
    collection?: string;
    [key: string]: any;
}


// Helper types for API responses
export type NarrativeCommentWithAuthor = NarrativeComment & { author: User };
export type EnrichedComment = NarrativeComment & {
    author: User;
    character?: Character | null;
};


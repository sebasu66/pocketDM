
import { Timestamp } from "firebase/firestore";

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

export interface QuickOption {
    action: string;
    skill: string;
    successChance: string;
}

export interface NarrativeComment {
    id: string;
    authorId: string;
    characterId: string;
    text: string;
    createdAt: Timestamp;
    hiddenText?: string;
}

export interface NarrativeThread {
    id: string;
    title: string;
    narrative: string; // Renamed from 'content'
    authorId: string; // User ID (always GM)
    createdAt: Timestamp;
    
    // Optional fields from the new structure
    audioUrl?: string;
    imageUrl?: string;
    imageAiHint?: string;
    quickOptions?: QuickOption[];
    characterFilterList?: string[];
    is_independent?: boolean;

    // Nested comments
    comments: NarrativeComment[];
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


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
    status?: 'initializing' | 'processing' | 'ready' | 'generating_narrative' | 'active' | 'failed' | 'narrative_failed';
    locale?: 'en' | 'es';
    toReset?: boolean;
    resetRequestedAt?: Timestamp;
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
    cell_id?: string;
    location_name?: string; // Populated from backend/locations table
    archetypeId?: string; // Helper for creation

    // Enriched context from backend (synced after each narrative)
    enriched_context?: {
        location_name: string;
        location_type?: string;
        location_description?: string;
        stats: {
            experience_points: number;
            rank: string;
            wounds: number;
            fatigue: number;
            bennies: number;
            glory: number;
        };
        inventory: Array<{
            id: string;
            name: string;
            type: string;
            description?: string;
            quantity: number;
            equipped: boolean;
        }>;
        active_quests: Array<{
            id: string;
            name: string;
            description?: string;
            status: string;
            progress?: string;
        }>;
        known_npcs: Array<{
            id: string;
            name: string;
            title?: string;
            role?: string;
            location?: string;
        }>;
        recent_narrative_summary: Array<{
            text: string;
            timestamp?: string;
        }>;
        current_objectives: Array<{
            quest_id: string;
            quest_name: string;
            objective: string;
        }>;
        context_updated_at: string;
    };

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
    success_chance: string;
}

export interface NarrativeNode {
    node_id: string;
    timestamp: Timestamp;

    // Location Context
    location: {
        location_id: string;
        location_name: string;
        cell_id: string;
    };

    // Narrative Content
    narrative_html: string;
    narrative_plain: string;

    // Audio
    audio_url: string | null;
    audio_status: 'pending' | 'ready' | 'failed';

    // Quick Actions
    quick_options: QuickOption[];

    // Who's Present
    visible_characters: string[];
    visible_npcs: string[];
    visible_monsters: string[];

    // Player Interaction
    player_comment: {
        text: string;
        timestamp: Timestamp;
    } | null;

    // Metadata
    summary: string | null;
    is_summarized: boolean;
}

export interface Concepto {
    id: string;
    collection?: string;
    [key: string]: any;
}


// Helper types for API responses
export interface EnrichedComment {
    id: string;
    authorId: string;
    characterId: string;
    text: string;
    createdAt: Timestamp;
    hiddenText?: string;
    author: User;
    character?: Character | null;
};

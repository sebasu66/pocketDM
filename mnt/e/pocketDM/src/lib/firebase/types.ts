
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
    id: string; // campaign_id
    dm_id: string;
    
    campaign_name: string;
    setting: 'hellfrost' | 'custom';
    created_at: Timestamp;
    updated_at: Timestamp;
    
    status: 'creating' | 'active' | 'paused' | 'completed';
    narrative_status: 'pending' | 'init' | 'in_progress' | 'completed_no_tts' | 'ready' | 'error';
    
    character_ids: string[];
    
    world_seed: string;
    difficulty: 'easy' | 'normal' | 'hard';
    
    description?: string;
    max_players?: number;

    // Deprecated / Legacy fields
    title?: string;
    bannerUrl?: string;
    bannerAiHint?: string;
    systemPrompt?: string;
    enabled?: boolean;
    secretCode?: string;
    ownerId?: string;
    locale?: 'en' | 'es';
}


export interface ConditionalRule {
    if: string;
    then: string;
}

export interface Character {
    id: string; // character_id
    player_id: string;
    campaign_id: string;

    name: string;
    description: string;
    visualPreset: string;
    isActive: boolean;
    
    created_at: Timestamp;
    updated_at: Timestamp;

    // Location
    cell_id?: string;
    
    // Gameplay Stats
    health?: number; // 0-100 percentage
    gold?: number;
    level?: number;
    
    // Savage Worlds specific from Archetype
    race?: string;
    class?: string; // Not in new spec, but useful
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
        notes?: string;
    }[];
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
    
    // Behavior Profile
    archetype?: string;
    archetypeDescription?: string;
    preferredAttack?: string;
    mostPrecious?: string;
    motto?: string;
    conditionalRules?: ConditionalRule[];

    // Deprecated
    userId?: string;
    campaignId?: string;
}

export interface QuickOption {
    text: string;
    action_type: 'comment' | 'roll' | 'move';
    icon: string;
    skill?: string;
    success_chance?: string;
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

    
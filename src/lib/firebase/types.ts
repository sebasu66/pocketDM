
export interface User {
    id: string;
    name: string;
    email: string;
    role: "master" | "player";
    avatar: string;
    campaignId: string;
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    bannerUrl: string;
    bannerAiHint: string;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    portrait: string;
    aiHint: string;
    campaignId: string;
    userId: string;
    level: number;
    class: string;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    isActive: boolean;
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


export interface User {
    id: string;
    name: string;
    email: string;
    role: "master" | "player";
    avatar: string;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    portrait: string;
    aiHint: string;
}

export interface NarrativeThread {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    imageAiHint?: string;
    audioUrl?: string;
    authorId: string; // User ID
    createdAt: number; // timestamp
}

export interface NarrativeComment {
    id: string;
    threadId: string;
    authorId: string; // User ID
    characterId?: string; // Character ID if posted in-character
    text: string;
    hiddenText?: string; // For GM-only notes
    createdAt: number; // timestamp
}

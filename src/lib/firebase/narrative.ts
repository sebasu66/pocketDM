
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread } from "./types";

// This is mock data. In a real app, you'd fetch this from Firestore.
const mockNarrativeThreads: NarrativeThread[] = [
    {
        id: "thread-1",
        campaignId: "1",
        authorId: "1", // Game Master
        title: "The Arrival at Silverwood",
        createdAt: new Date('2024-07-28T10:00:00Z').getTime(),
        imageUrl: "https://picsum.photos/800/400?random=55",
        imageAiHint: "fantasy city gate",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        content: `
            <p>
                The party, weary from their travels, finally saw the shimmering rooftops of Silverwood. 
                As they approached the main gate, they were greeted by Captain <a href="/dashboard/characters/elara" class="text-accent hover:underline">Elara</a>, 
                a stern-looking guard with a noticeable scar above her left eye. She held the legendary{' '}
                <a href="/dashboard/items/moonshard-blade" class="text-accent hover:underline">Moonshard Blade</a>, its faint glow pulsing in the twilight.
            </p>
            <p>
                "State your business in Silverwood," she commanded, her voice firm but not unkind. The air was thick with the scent of pine and distant magic.
            </p>
        `
    }
];

export const getNarrativeThreadById = async (id: string): Promise<NarrativeThread | null> => {
    const thread = mockNarrativeThreads.find(t => t.id === id) || null;
    return Promise.resolve(thread);

    // Real Firestore implementation:
    /*
    const docRef = doc(db, "narrativeThreads", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as NarrativeThread;
    }
    return null;
    */
}

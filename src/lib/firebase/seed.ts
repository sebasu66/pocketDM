
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
// In a real application, you would have proper data management and user registration.
import { collection, writeBatch, doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { User, Campaign, Character, NarrativeThread, NarrativeComment } from "./types";

// --- Seeding Data ---

export const initialThread: (Omit<NarrativeThread, 'id'> & { id: string }) = {
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
};


async function seedDatabase() {
    console.log("Seeding database...");
    const batch = writeBatch(db);

    // 1. Users
    const users: (Omit<User, 'id'> & { id: string; password?: string })[] = [
        {
            id: "1",
            name: "Game Master",
            email: "gm@example.com",
            role: "master",
            avatar: "https://picsum.photos/100/100?random=99",
            password: "password",
            campaignId: "1",
        },
        {
            id: "2",
            name: "Alice",
            email: "player@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=5",
            password: "password",
            campaignId: "1",
        },
        {
            id: "3",
            name: "Bob",
            email: "player2@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=6",
            password: "password",
            campaignId: "1",
        }
    ];

    users.forEach(user => {
        const { id, ...userData } = user;
        const userRef = doc(db, "users", id);
        batch.set(userRef, userData);
    });
    console.log("Users queued for seeding.");


    // 2. Campaigns
    const campaigns: (Omit<Campaign, 'id'> & { id: string })[] = [
        {
            id: "1",
            title: "The Whispering Shadows",
            description: "A realm teetering on the brink of an ancient, creeping darkness. Once a safe haven for elves, dwarves, gnomes and other creatures, humans started settling in thousands of years ago through war and conquest. The elves live exiles in the north.",
            bannerUrl: "https://picsum.photos/1200/400?random=10",
            bannerAiHint: "epic fantasy landscape"
        }
    ];

    campaigns.forEach(campaign => {
        const { id, ...campaignData } = campaign;
        const campaignRef = doc(db, "campaigns", id);
        batch.set(campaignRef, campaignData);
    });
    console.log("Campaigns queued for seeding.");


    // 3. Characters
    const characters: (Omit<Character, 'id'> & { id: string })[] = [
        {
            id: "char-1",
            name: "Grom the Valiant",
            description: "A stoic warrior from the northern mountains, seeking to reclaim his family's honor.",
            portrait: "https://picsum.photos/400/600?random=10",
            aiHint: "fantasy warrior portrait",
            campaignId: "1",
            userId: "2", // Alice's ID
            level: 3,
            class: "Barbarian",
            strength: 18,
            dexterity: 14,
            constitution: 16,
            intelligence: 8,
            wisdom: 12,
            charisma: 10,
            isActive: true,
        },
        {
            id: "char-2",
            name: "Lyra Swiftwind",
            description: "An elven ranger, outcast from her homeland, with an uncanny connection to the spirits of the forest.",
            portrait: "https://picsum.photos/400/600?random=11",
            aiHint: "fantasy elf ranger portrait",
            campaignId: "1",
            userId: "3", // Bob's ID
            level: 3,
            class: "Ranger",
            strength: 12,
            dexterity: 18,
            constitution: 12,
            intelligence: 14,
            wisdom: 16,
            charisma: 14,
            isActive: false,
        },
    ];

    characters.forEach(character => {
        const { id, ...charData } = character;
        const charRef = doc(db, "characters", id);
        batch.set(charRef, charData);
    });
    console.log("Characters queued for seeding.");

    // 4. Narrative Threads
    const { id: threadId, ...threadData } = initialThread;
    const threadRef = doc(db, "narrativeThreads", threadId);
    batch.set(threadRef, threadData);
    console.log("Narrative threads queued for seeding.");


    // 5. Narrative Comments
    const narrativeComments: (Omit<NarrativeComment, 'id'> & { id: string })[] = [
        {
            id: "comment-1",
            threadId: "thread-1",
            authorId: "2", // Alice's user ID
            characterId: "char-1", // Grom's ID
            createdAt: new Date('2024-07-29T11:00:00Z').getTime(),
            text: "Grom steps forward, his hand resting on the pommel of his axe. 'We seek refuge and supplies, Captain. And perhaps a worthy tale or two.'",
            hiddenText: "I'm keeping an eye on the captain. She seems too calm."
        },
        {
            id: "comment-2",
            threadId: "thread-1",
            authorId: "3", // Bob's user ID
            characterId: "char-2", // Lyra's ID
            createdAt: new Date('2024-07-29T11:05:00Z').getTime(),
            text: "Lyra scans the guards, her eyes trying to gauge their intentions. She subtly readies a minor illusion spell, just in case."
        }
    ];

    narrativeComments.forEach(comment => {
        const { id, ...commentData } = comment;
        const commentRef = doc(db, "narrativeComments", id);
        batch.set(commentRef, commentData);
    });
    console.log("Narrative comments queued for seeding.");

    // Commit the batch
    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        localStorage.setItem('db_seeded', 'true');
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}


// To run this seeding script, you would typically execute it as a standalone node script
// e.g., `node -r ts-node/register src/lib/firebase/seed.ts`
// For the purpose of this demo environment, we will find a way to trigger it.
// A simple way is to add a temporary button in the UI or call it from a component's useEffect.
// We will add a temporary trigger in the main AppLayout.
// **THIS IS FOR DEMO PURPOSES ONLY and should be removed in a real app.**
export async function runSeed() {
    // This is a more robust check to prevent re-seeding. It checks for a single document
    // that is expected to exist after seeding. This avoids race conditions and issues
    // with client-side storage during development.
    try {
        const seedCheckDoc = doc(db, 'users', '1');
        const docSnap = await getDoc(seedCheckDoc);
        if (docSnap.exists()) {
            // Document exists, so we assume the DB is seeded.
            // console.log("Database already seeded. Skipping.");
            return;
        }
    } catch (error) {
        console.error("Error checking for seeded database, proceeding with seed. Error:", error);
    }
    
    // If the check fails or the doc doesn't exist, proceed with seeding.
    await seedDatabase();
}

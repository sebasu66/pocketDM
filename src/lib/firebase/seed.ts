
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
// In a real application, you would have proper data management and user registration.
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./config";
import { User, Campaign, Character, NarrativeThread, NarrativeComment } from "./types";

const defaultSystemPrompt = `You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.

- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.
- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.
- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.
- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.
- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure).`;

const defaultSystemPromptEs = `Eres un maestro narrador y un creativo Dungeon Master para un juego de rol de mesa. Tu tarea es tejer una narrativa convincente y colaborativa.

- **Analiza la Historia**: Lee atentamente el historial narrativo proporcionado, que incluye tus publicaciones anteriores y las acciones de los jugadores.
- **Consulta los Datos de los Personajes**: Usa las herramientas disponibles para buscar información sobre los personajes de los jugadores. Refiérete a ellos por su nombre e incorpora sus historias y habilidades únicas en la narrativa.
- **Impulsa la Historia**: Escribe la siguiente publicación de la historia. Debe ser una continuación directa de los eventos, reaccionando a las elecciones de los jugadores e introduciendo nuevos desafíos, personajes o giros en la trama.
- **Sé Evocativo**: Usa un lenguaje descriptivo para pintar una imagen vívida del mundo, sus habitantes y la atmósfera.
- **Mantén el Tono**: Adhiérete al tono establecido de la campaña (p. ej., fantasía épica, noir descarnado, aventura ligera).`;


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

const initialSpanishThread: (Omit<NarrativeThread, 'id'> & { id: string }) = {
    id: "hilo-1",
    campaignId: "2",
    authorId: "1", // Game Master
    title: "La Encrucijada del Ermitaño",
    createdAt: new Date('2024-07-28T10:00:00Z').getTime(),
    imageUrl: "",
    imageAiHint: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    content: `
        <p>
            El camino a través del Bosque Tenebroso se bifurca ante vosotros. A la izquierda, un sendero cubierto de musgo serpentea hacia la oscuridad, prometiendo un atajo a través del corazón del bosque. A la derecha, el camino principal, más ancho y seguro, continúa hacia el siguiente pueblo.
        </p>
        <p>
            Sentado en una roca en la encrucijada, un anciano encapuchado llamado <b>Silas</b> os observa con ojos que parecen contener la sabiduría de siglos. Sujeta un bastón retorcido, el <a href="/dashboard/items/baston-susurrante" class="text-accent hover:underline">Bastón Susurrante</a>, que parece vibrar con una energía apenas contenida.
        </p>
        <p>
            "El camino rápido está plagado de peligros que ponen a prueba el alma", susurra, su voz como el crujir de hojas secas. "El camino largo es seguro, pero lento. Vuestro destino os espera, pero el sendero que elijáis definirá vuestro viaje."
        </p>
        <p>
            ¿Qué hacéis?
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
            campaignId: "1", // Default to campaign 1, can be switched
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
        },
        {
            id: "4",
            name: "Carlos",
            email: "jugador1@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=7",
            password: "password",
            campaignId: "2",
        },
        {
            id: "5",
            name: "Diana",
            email: "jugador2@example.com",
            role: "player",
            avatar: "https://picsum.photos/100/100?random=8",
            password: "password",
            campaignId: "2",
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
            bannerAiHint: "epic fantasy landscape",
            systemPrompt: defaultSystemPrompt,
        },
        {
            id: "2",
            title: "Crónicas de la Sombra",
            description: "Un reino al borde de una antigua y creciente oscuridad. Antaño un refugio seguro para elfos, enanos y gnomos, los humanos comenzaron a asentarse hace miles de años a través de la guerra y la conquista. Los elfos viven exiliados en el norte.",
            bannerUrl: "https://picsum.photos/1200/400?random=20",
            bannerAiHint: "dark fantasy landscape",
            systemPrompt: defaultSystemPromptEs,
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
        // English Campaign Characters
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
        // Spanish Campaign Characters
        {
            id: "char-3",
            name: "Sir Kaelan",
            description: "Un paladín inquebrantable de la Orden de la Llama Plateada, juró proteger a los inocentes a cualquier costo. Su fe es su escudo y su martillo de guerra, la justicia.",
            portrait: "https://picsum.photos/400/600?random=12",
            aiHint: "fantasy paladin portrait",
            campaignId: "2",
            userId: "4", // Carlos's ID
            level: 2,
            class: "Paladín",
            strength: 16,
            dexterity: 10,
            constitution: 14,
            intelligence: 10,
            wisdom: 13,
            charisma: 15,
            isActive: true,
        },
        {
            id: "char-4",
            name: "Seraphina",
            description: "Una hechicera enigmática cuyo linaje se remonta a los dragones de antaño. Su magia es tan salvaje e impredecible como su temperamento.",
            portrait: "https://picsum.photos/400/600?random=13",
            aiHint: "fantasy sorceress portrait",
            campaignId: "2",
            userId: "5", // Diana's ID
            level: 2,
            class: "Hechicera",
            strength: 8,
            dexterity: 14,
            constitution: 12,
            intelligence: 15,
            wisdom: 10,
            charisma: 18,
            isActive: true,
        },
    ];

    characters.forEach(character => {
        const { id, ...charData } = character;
        const charRef = doc(db, "characters", id);
        batch.set(charRef, charData);
    });
    console.log("Characters queued for seeding.");

    // 4. Narrative Threads
    const threads = [initialThread, initialSpanishThread];
    threads.forEach(thread => {
        const { id, ...threadData } = thread;
        const threadRef = doc(db, "narrativeThreads", id);
        batch.set(threadRef, threadData);
    });
    console.log("Narrative threads queued for seeding.");


    // 5. Narrative Comments
    const narrativeComments: (Omit<NarrativeComment, 'id'> & { id: string })[] = [];

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
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}

let seeded = false;

export async function runSeed() {
    if (seeded) {
        return;
    }
    seeded = true;
    await seedDatabase();
}

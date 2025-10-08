
// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It seeds the Firestore database with initial data so the app is usable.
import { collection, writeBatch, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";
import { initialUsers, initialCampaigns } from "./data/seed-core";
import { archetypes } from './data/seed-archetypes';
import { hellfrostItems } from './data/seed-items';
import { hellfrostSpells } from './data/seed-spells';
import { hellfrostReferenceData } from './data/seed-reference';
// Map-related imports removed - now handled by backend
// import { rassilonGridMapSummary, majorLocales, notableNPCs, adventureHooks }
import { conceptosWebApp } from './data/seed-concepts';

/**
 * Creates a new campaign from scratch.
 * NOTE: The initial narrative thread is no longer created here.
 * The backend orchestrator is now responsible for generating the first narrative node.
 */
const createCampaign = async (batch: any, campaignData: any) => {
    const campaignRef = doc(db, "campaigns", campaignData.id);
    batch.set(campaignRef, {
        title: campaignData.title,
        description: campaignData.description,
        bannerUrl: campaignData.bannerUrl,
        bannerAiHint: campaignData.bannerAiHint,
        systemPrompt: campaignData.systemPrompt,
        enabled: true,
        secretCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        ownerId: '1' // Default GM for seed
    });
};

/**
 * Creates a character document, copying data from a selected archetype.
 */
const createCharacterFromArchetype = (batch: any, characterData: any, selectedArchetype: any) => {
    const charRef = doc(db, "characters", characterData.id);
    const newCharacter = {
        // Copy all fields from the archetype
        ...selectedArchetype,
        // Overwrite/add character-specific data
        id: characterData.id,
        name: characterData.name,
        description: characterData.description,
        visualPreset: characterData.visualPreset,
        campaignId: characterData.campaignId,
        userId: characterData.userId,
        isActive: characterData.isActive,
        cell_id: characterData.cell_id, // Starting location
    };
    batch.set(charRef, newCharacter);
};

/**
 * Seeds the reference data for the Hellfrost game system (Races, Skills, etc.).
 * This function should only be run once.
 */
const seedReferenceData = async (batch: any) => {
    const dataToSeed = [
        { collectionName: 'razas', data: hellfrostReferenceData.razas },
        { collectionName: 'characterCategories', data: hellfrostReferenceData.categorias_personaje },
        { collectionName: 'habilidades', data: hellfrostReferenceData.habilidades },
        { collectionName: 'edges', data: hellfrostReferenceData.edges },
        { collectionName: 'hindrances', data: hellfrostReferenceData.hindrances },
        { collectionName: 'hellfrost_items', data: hellfrostItems },
        { collectionName: 'conjuros', data: hellfrostSpells.conjuros },
        { collectionName: 'conceptos', data: conceptosWebApp },
        { collectionName: 'archetypes', data: archetypes },
    ];

    for (const { collectionName, data } of dataToSeed) {
        for (const [docId, docData] of Object.entries(data)) {
            const formattedId = docId.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            const docRef = doc(db, collectionName, formattedId);
            const finalDocData = {
                ...docData,
                name: (docData as any).nombre || docId.replace(/_/g, ' '),
            };
            batch.set(docRef, finalDocData);
        }
    }
};

/**
 * The main seed function that orchestrates the entire database initialization.
 */
export const runSeed = async () => {
    try {
        const seedStateRef = doc(db, "internal", "seedState");
        const seedStateSnap = await getDoc(seedStateRef);

        if (seedStateSnap.exists() && seedStateSnap.data().isSeeded) {
            return;
        }

        console.log("Seeding database...");
        
        const coreBatch = writeBatch(db);

        await seedReferenceData(coreBatch);

        for (const campaign of initialCampaigns) {
            await createCampaign(coreBatch, campaign);
        }

        for (const user of initialUsers) {
            const userRef = doc(db, "users", user.id);
            coreBatch.set(userRef, {
                name: user.name,
                email: user.email,
                role: { isGm: user.role === 'master', isPlayer: user.role === 'player' },
                avatar: user.avatar,
                campaignId: user.campaignId,
                enabled: true,
            });
        }
        
        const alice = initialUsers.find(u => u.id === '2')!;
        createCharacterFromArchetype(coreBatch, {
            id: "1",
            name: "Grom Hellscream",
            description: "A stoic warrior from the north, seeking redemption for his clan's past.",
            visualPreset: "preset_1",
            campaignId: alice.campaignId,
            userId: alice.id,
            isActive: true,
            cell_id: "H1"
        }, archetypes.avenger);

        const bob = initialUsers.find(u => u.id === '3')!;
        createCharacterFromArchetype(coreBatch, {
            id: "2",
            name: "Elara Nightwind",
            description: "A graceful but deadly elf, she dances with blades to protect the ancient forests.",
            visualPreset: "preset_2",
            campaignId: bob.campaignId,
            userId: bob.id,
            isActive: false,
            cell_id: "H1"
        }, archetypes.bladedancer);

        const carlos = initialUsers.find(u => u.id === '4')!;
        createCharacterFromArchetype(coreBatch, {
            id: "3",
            name: "Kaelen",
            description: "Un paladín devoto de Tiw, dios de la guerra. Lucha por el honor y la justicia en las tierras heladas.",
            visualPreset: "preset_3",
            campaignId: carlos.campaignId,
            userId: carlos.id,
            isActive: true,
            cell_id: "H1"
        }, archetypes.paladin);

        const diana = initialUsers.find(u => u.id === '5')!;
        createCharacterFromArchetype(coreBatch, {
            id: "4",
            name: "Seraphina",
            description: "Una hechicera que domina el poder del hielo, nacida en las salvajes tierras del norte.",
            visualPreset: "preset_4",
            campaignId: diana.campaignId,
            userId: diana.id,
            isActive: true,
            cell_id: "H1"
        }, archetypes.hrimwisard);

        coreBatch.set(seedStateRef, { isSeeded: true });
        
        await coreBatch.commit();
        console.log("Core database data seeded successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

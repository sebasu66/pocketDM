

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"; 
import { db } from "./config";
import { Character } from "./types";
import { archetypes } from "./data/seed-archetypes";

const CHARACTERS_COLLECTION = "characters";

// Create
export const addCharacter = async (characterData: Partial<Character>): Promise<string> => {

    let baseCharacter: any = {
        // Base defaults for any character
        level: 1,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        health: 100,
        gold: 50,
        preferredAttack: "",
        mostPrecious: "",
        motto: "",
        conditionalRules: [{if: '', then: ''}, {if: '', then: ''}, {if: '', then: ''}],
        isActive: true,
        cell_id: "H1", // Trondavoe - Starting port city
    };

    // If an archetype is selected, merge its properties first
    if (characterData.archetypeId) {
        const selectedArchetype = (archetypes as Record<string, any>)[characterData.archetypeId];
        if (selectedArchetype) {
            // Remove archetype's 'id' field to avoid conflicts with Firestore auto-generated ID
            const { id, ...archetypeWithoutId } = selectedArchetype;
            baseCharacter = { ...baseCharacter, ...archetypeWithoutId };
        }
    }

    // Finally, overwrite with any specific data provided by the user, ensuring campaignId and userId are preserved.
    const finalCharacter = { ...baseCharacter, ...characterData };

    // Remove archetypeId as it's not part of the Character model before saving
    delete finalCharacter.archetypeId;
    // Remove id if it came from archetype to let Firestore assign it
    delete finalCharacter.id;

    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), finalCharacter);
    const newCharId = docRef.id;

    // ✅ If this is the first character, update campaign status to 'ready'
    if (characterData.campaign_id) {
        const { getCampaign, updateCampaign } = await import('./campaigns');
        const campaign = await getCampaign(characterData.campaign_id);

        if (campaign && campaign.status === 'waiting_for_character') {
            await updateCampaign(campaign.id, {
                status: 'ready',
                character_ids: [newCharId]
            });
            console.log(`[Characters] Campaign ${campaign.id} status updated to 'ready'`);
        } else if (campaign && campaign.character_ids) {
            // Add to existing character_ids
            await updateCampaign(campaign.id, {
                character_ids: [...campaign.character_ids, newCharId]
            });
        }
    }

    return newCharId;
};

// Read
export const getCharacters = async (): Promise<Character[]> => {
    const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
};

export const getCharactersByCampaign = async (campaignId: string, userId?: string): Promise<Character[]> => {
    console.log(`[Characters] Fetching characters for campaign ${campaignId}` + (userId ? ` and user ${userId}` : ''));
    // Fixed: Use snake_case 'campaign_id' to match Firestore schema
    let q = query(collection(db, CHARACTERS_COLLECTION), where("campaign_id", "==", campaignId));
    if (userId) {
        // Corrected from 'userId' to 'player_id' to match new DB schema
        q = query(q, where("player_id", "==", userId));
    }
    const querySnapshot = await getDocs(q);
    const characters = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
    console.log(`[Characters] Found ${characters.length} characters.`);
    return characters;
}

export const getCharacter = async (id: string): Promise<Character | null> => {
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Character;
    } else {
        return null;
    }
};

// Update
export const updateCharacter = async (id: string, character: Partial<Omit<Character, 'id'>>): Promise<void> => {
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    await updateDoc(docRef, character);
};

// Delete
export const deleteCharacter = async (id: string): Promise<void> => {
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    await deleteDoc(docRef);
};


    

    









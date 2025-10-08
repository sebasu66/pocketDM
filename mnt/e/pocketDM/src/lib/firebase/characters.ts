
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore"; 
import { db } from "./config";
import { Character } from "./types";
import { archetypes } from "./data/seed-archetypes";

const CHARACTERS_COLLECTION = "characters";

// Create
export const addCharacter = async (characterData: Partial<Character>): Promise<string> => {
    
    // Base defaults for any character
    let baseCharacter: any = {
        level: 1,
        health: 100,
        gold: 50,
        isActive: true,
        cell_id: "H1", // Trondavoe - Starting port city
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
    };

    // If an archetype is selected, merge its properties first
    const archetypeId = (characterData as any).archetypeId;
    if (archetypeId) {
        const selectedArchetype = (archetypes as Record<string, any>)[archetypeId];
        if (selectedArchetype) {
            const { id, ...archetypeWithoutId } = selectedArchetype;
            baseCharacter = { ...baseCharacter, ...archetypeWithoutId };
        }
    }

    // Finally, overwrite with any specific data provided by the user
    const finalCharacter = { 
        ...baseCharacter, 
        ...characterData,
        updated_at: Timestamp.now(),
    };

    // Clean up temporary fields
    delete finalCharacter.archetypeId;
    
    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), finalCharacter);

    // Update the campaign with the new character_id
    if (finalCharacter.campaign_id) {
        const campaignRef = doc(db, "campaigns", finalCharacter.campaign_id);
        const campaignSnap = await getDoc(campaignRef);
        if (campaignSnap.exists()) {
            const campaignData = campaignSnap.data();
            const character_ids = [...(campaignData.character_ids || []), docRef.id];
            await updateDoc(campaignRef, { character_ids });
        }
    }

    return docRef.id;
};

// Read
export const getCharacters = async (): Promise<Character[]> => {
    const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
};

export const getCharactersByCampaign = async (campaignId: string, userId?: string): Promise<Character[]> => {
    console.log(`[Characters] Fetching characters for campaign ${campaignId}` + (userId ? ` and user ${userId}` : ''));
    let q = query(collection(db, CHARACTERS_COLLECTION), where("campaign_id", "==", campaignId));
    if (userId) {
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
    await updateDoc(docRef, { ...character, updated_at: Timestamp.now() });
};

// Delete
export const deleteCharacter = async (id: string): Promise<void> => {
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    await deleteDoc(docRef);
};

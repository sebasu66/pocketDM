

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"; 
import { db } from "./config";
import { Character } from "./types";
import { archetypes } from "./data/seed-archetypes";

const CHARACTERS_COLLECTION = "characters";

// Create
export const addCharacter = async (characterData: Partial<Character>): Promise<string> => {
    
    let newCharacter: any = {
        // Base defaults for any character
        level: 1,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        position: 50,
        resolve: 50,
        altruism: 50,
        discipline: 50,
        preferredAttack: "",
        mostPrecious: "",
        motto: "",
        conditionalRules: [{if: '', then: ''}, {if: '', then: ''}, {if: '', then: ''}],
        isActive: true,
        location_cell_id: "D5", // Default starting location
    };

    // If an archetype is selected, merge its properties
    if (characterData.archetypeId) {
        const selectedArchetype = (archetypes as Record<string, any>)[characterData.archetypeId];
        if (selectedArchetype) {
            newCharacter = { ...newCharacter, ...selectedArchetype };
        }
    }

    // Finally, overwrite with any specific data provided by the user
    newCharacter = { ...newCharacter, ...characterData };
    
    // Remove archetypeId as it's not part of the Character model
    delete newCharacter.archetypeId;
    
    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), newCharacter);
    return docRef.id;
};

// Read
export const getCharacters = async (): Promise<Character[]> => {
    const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
};

export const getCharactersByCampaign = async (campaignId: string, userId?: string): Promise<Character[]> => {
    let q = query(collection(db, CHARACTERS_COLLECTION), where("campaignId", "==", campaignId));
    if (userId) {
        q = query(q, where("userId", "==", userId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
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


    

    

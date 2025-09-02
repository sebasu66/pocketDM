
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"; 
import { db } from "./config";
import { Character } from "./types";

const CHARACTERS_COLLECTION = "characters";

// Mock data
let mockCharacters: Character[] = [
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
        charisma: 10
    },
    // Initially, the GM has no character
];

// Create
export const addCharacter = async (character: Omit<Character, 'id' | 'level' | 'class' | 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'>): Promise<string> => {
    // Mock implementation
    const newId = `char-${mockCharacters.length + 1}`;
    const newCharacter: Character = { 
        id: newId, 
        ...character,
        level: 1,
        class: "Adventurer",
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
    };
    mockCharacters.push(newCharacter);
    console.log("Added character:", newCharacter);
    return Promise.resolve(newId);

    /* Real implementation
    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), character);
    return docRef.id;
    */
};

// Read
export const getCharacters = async (): Promise<Character[]> => {
    return Promise.resolve(mockCharacters);
    /* Real implementation
    const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
    */
};

export const getCharactersByCampaign = async (campaignId: string, userId?: string): Promise<Character[]> => {
    let characters = mockCharacters.filter(c => c.campaignId === campaignId);
    if (userId) {
        characters = characters.filter(c => c.userId === userId);
    }
    return Promise.resolve(characters);
    /* Real implementation
    let q = query(collection(db, CHARACTERS_COLLECTION), where("campaignId", "==", campaignId));
    if (userId) {
        q = query(q, where("userId", "==", userId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
    */
}

export const getCharacter = async (id: string): Promise<Character | null> => {
    const character = mockCharacters.find(c => c.id === id) || null;
    return Promise.resolve(character);
    /* Real implementation
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Character;
    } else {
        return null;
    }
    */
};

// Update
export const updateCharacter = async (id: string, character: Partial<Omit<Character, 'id'>>): Promise<void> => {
    const index = mockCharacters.findIndex(c => c.id === id);
    if (index !== -1) {
        mockCharacters[index] = { ...mockCharacters[index], ...character };
        console.log("Updated character:", mockCharacters[index]);
    }
    return Promise.resolve();
    /* Real implementation
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    await updateDoc(docRef, character);
    */
};

// Delete
export const deleteCharacter = async (id: string): Promise<void> => {
    const index = mockCharacters.findIndex(c => c.id === id);
    if (index !== -1) {
        mockCharacters.splice(index, 1);
    }
    return Promise.resolve();
    /* Real implementation
    const docRef = doc(db, CHARACTERS_COLLECTION, id);
    await deleteDoc(docRef);
    */
};

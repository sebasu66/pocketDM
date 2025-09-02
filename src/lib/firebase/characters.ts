
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "./config";
import { Character } from "./types";

const CHARACTERS_COLLECTION = "characters";

// Create
export const addCharacter = async (character: Omit<Character, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), character);
    return docRef.id;
};

// Read
export const getCharacters = async (): Promise<Character[]> => {
    const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
};

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

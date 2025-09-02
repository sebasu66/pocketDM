
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase/config';
import { User } from './firebase/types';

// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";

export const getUserByEmail = async (email: string): Promise<(User & { password?: string }) | undefined> => {
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return undefined;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User & { password?: string };
};

export const getUserById = async (id: string): Promise<(User & { password?: string }) | undefined> => {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User & { password?: string };
    }
    return undefined;
}

// In a real app, never handle passwords in plaintext on the client.
// This is a mock implementation for demo purposes.
export const checkPassword = (user: User & { password?: string }, pass: string): boolean => {
  return user.password === pass;
};

// Mock update function
export const updateUser = async (id: string, updatedData: Partial<User>): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(userRef, updatedData);
}


import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from './firebase/config';
import { User } from './firebase/types';
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";

// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');


export const signInWithGoogle = async (): Promise<FirebaseAuthUser> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

export const signInWithFacebook = async (): Promise<FirebaseAuthUser> => {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
};

export const signInWithApple = async (): Promise<FirebaseAuthUser> => {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
};


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

export const findOrCreateUserFromOAuth = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
    } else {
        // User does not exist, create a new one
        const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Player',
            email: firebaseUser.email || '',
            role: 'player', // Default role for new sign-ups
            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
            campaignId: '1', // Default campaign ID
        };
        await setDoc(userRef, newUser);
        return newUser;
    }
};

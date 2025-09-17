

import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db, auth } from './firebase/config';
import { User, Character, NarrativeComment } from './firebase/types';
import { GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";
import { createNewCampaignForUser } from "./firebase/campaigns";

// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";
const CHARACTERS_COLLECTION = "characters";
const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";
const COMMENTS_COLLECTION = "narrativeComments";
const CAMPAIGNS_COLLECTION = "campaigns";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<FirebaseAuthUser> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

export const getUserByEmail = async (email: string): Promise<(User & { password?: string }) | undefined> => {
    if (!email) return undefined;
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email.toLowerCase()));
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

export const updateUser = async (id: string, updatedData: Partial<User>): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(userRef, updatedData);
}

interface CreateUserInput {
    name: string;
    email: string;
    password?: string; // Optional for OAuth
    role: { isGm: boolean, isPlayer: boolean };
    campaignSecret?: string; // Required if isPlayer is true
    uid?: string; // Optional for OAuth users
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { name, email, password, role, campaignSecret, uid } = input;

    // 1. Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    // 2. Determine User ID and Campaign ID
    const userId = uid || doc(collection(db, USERS_COLLECTION)).id;
    let campaignId = '';

    // 3. Handle GM Role (always creates a new campaign for the GM)
    if (role.isGm) {
        const locale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as 'en' | 'es' | null) || 'en' : 'en';
        // The new campaign ID will be the same as the user's ID
        campaignId = await createNewCampaignForUser({ id: userId, name }, locale);
    }
    
    // 4. Handle Player-only Role
    if (role.isPlayer && !role.isGm) {
        if (!campaignSecret) {
            throw new Error("A secret code is required to join a campaign as a player.");
        }
        const campaignsRef = collection(db, CAMPAIGNS_COLLECTION);
        const q = query(campaignsRef, where("secretCode", "==", campaignSecret), where("enabled", "==", true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid or expired secret code. Could not find an active campaign.");
        }
        campaignId = querySnapshot.docs[0].id;
    }
    
    if (!campaignId) {
         throw new Error("Could not determine a campaign to assign to the user.");
    }

    // 5. Define and Save New User Data
    const newUserRef = doc(db, USERS_COLLECTION, userId);
    const newUser: User = {
        id: userId,
        name,
        email: email.toLowerCase(),
        role,
        avatar: `https://picsum.photos/seed/${userId}/100/100`,
        campaignId: campaignId,
        enabled: true,
    };
    
    const finalUserData: any = { ...newUser };
    if (password) {
        finalUserData.password = password;
    }

    await setDoc(newUserRef, finalUserData);

    return newUser;
};

export const findOrCreateUserFromOAuth = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
    const appUser = await getUserByEmail(firebaseUser.email!);

    if (appUser) {
        return appUser as User;
    } else {
        // This is a new user signing in via OAuth for the first time.
        // Default to creating a GM with their own campaign and dual roles for flexibility.
        return await createUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Adventurer',
            email: firebaseUser.email!,
            role: { isGm: true, isPlayer: true },
        });
    }
};

export const deleteUserAndAssociatedData = async (user: User): Promise<void> => {
    const batch = writeBatch(db);

    if (user.role.isGm) {
        // --- GM DELETION ---
        const campaignId = user.campaignId;

        // 1. Get all characters in the campaign
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("campaignId", "==", campaignId));
        const charactersSnapshot = await getDocs(charactersQuery);
        const characterIds = charactersSnapshot.docs.map(d => d.id);
        
        // 2. Delete all characters in the campaign
        charactersSnapshot.forEach(doc => batch.delete(doc.ref));

        // 3. Get and delete all comments associated with those characters
        if (characterIds.length > 0) {
            const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("characterId", "in", characterIds));
            const commentsSnapshot = await getDocs(commentsQuery);
            commentsSnapshot.forEach(doc => batch.delete(doc.ref));
        }

        // 4. Get and delete all narrative threads
        const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
        const threadsSnapshot = await getDocs(threadsQuery);
        threadsSnapshot.forEach(doc => batch.delete(doc.ref));

        // 5. Delete the campaign itself
        const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
        batch.delete(campaignRef);

    } else if (user.role.isPlayer) {
        // --- PLAYER DELETION ---
        
        // 1. Find the user's character
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("userId", "==", user.id), where("campaignId", "==", user.campaignId));
        const charactersSnapshot = await getDocs(charactersQuery);
        
        if (!charactersSnapshot.empty) {
            const characterDoc = charactersSnapshot.docs[0];
            const characterId = characterDoc.id;

            // 2. Delete the character
            batch.delete(characterDoc.ref);

            // 3. Find and delete all comments by that character
            const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("characterId", "==", characterId));
            const commentsSnapshot = await getDocs(commentsQuery);
            commentsSnapshot.forEach(commentDoc => batch.delete(commentDoc.ref));
        }
    }

    // Finally, delete the user document itself
    const userRef = doc(db, USERS_COLLECTION, user.id);
    batch.delete(userRef);

    // Commit all batched writes
    await batch.commit();
};

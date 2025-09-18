

import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db, auth } from './config';
import { User } from './types';
import { GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createNewCampaignForUser } from "./campaigns";

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

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    if (!email) return undefined;
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return undefined;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return undefined;
}

export const updateUser = async (id: string, updatedData: Partial<User>): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(userRef, updatedData);
}

interface CreateUserInput {
    name: string;
    email: string;
    password?: string;
    role: { isGm: boolean, isPlayer: boolean };
    campaignSecret?: string;
    uid?: string;
}

export const createUserInFirestore = async (input: CreateUserInput): Promise<User> => {
    const { name, email, role, campaignSecret, uid } = input;

    // Use the Firebase Auth UID as the document ID in Firestore.
    const userId = uid;
    if (!userId) {
        throw new Error("A unique user ID (UID) from Firebase Auth is required to create a user profile.");
    }
    
    // Check if user profile already exists in Firestore.
    const existingUser = await getUserById(userId);
    if (existingUser) {
        return existingUser; // Return existing user if found
    }

    let campaignId = '';

    if (role.isGm) {
        const locale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as 'en' | 'es' | null) || 'en' : 'en';
        campaignId = await createNewCampaignForUser({ id: userId, name }, locale);
    } else if (role.isPlayer) {
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
    
    if (!campaignId && role.isPlayer) {
         throw new Error("Could not determine a campaign to assign to the user.");
    }

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

    await setDoc(newUserRef, newUser);
    return newUser;
};

export const findOrCreateUserFromOAuth = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
    const appUser = await getUserById(firebaseUser.uid);

    if (appUser) {
        return appUser;
    } else {
        return await createUserInFirestore({
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
        const campaignsQuery = query(collection(db, CAMPAIGNS_COLLECTION), where("ownerId", "==", user.id));
        const campaignsSnapshot = await getDocs(campaignsQuery);

        for (const campaignDoc of campaignsSnapshot.docs) {
            const campaignId = campaignDoc.id;

            const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("campaignId", "==", campaignId));
            const charactersSnapshot = await getDocs(charactersQuery);
            const characterIds = charactersSnapshot.docs.map(d => d.id);
            charactersSnapshot.forEach(doc => batch.delete(doc.ref));

            if (characterIds.length > 0) {
                const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("characterId", "in", characterIds));
                const commentsSnapshot = await getDocs(commentsQuery);
                commentsSnapshot.forEach(doc => batch.delete(doc.ref));
            }

            const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
            const threadsSnapshot = await getDocs(threadsQuery);
            threadsSnapshot.forEach(doc => batch.delete(doc.ref));
            
            const mapCellsQuery = query(collection(db, `campaigns/${campaignId}/mapCells`));
            const mapCellsSnapshot = await getDocs(mapCellsQuery);
            mapCellsSnapshot.forEach(cellDoc => batch.delete(cellDoc.ref));

            batch.delete(campaignDoc.ref);
        }
    }

    const userRef = doc(db, USERS_COLLECTION, user.id);
    batch.delete(userRef);

    await batch.commit();

    // Finally, delete the user from Firebase Auth
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === user.id) {
        await currentUser.delete();
    }
};
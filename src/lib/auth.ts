

import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";
import { User, Character, NarrativeComment } from './firebase/types';
import { createNewCampaignForUser } from "./firebase/campaigns";
import { app, auth } from "./config";


// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";
const CHARACTERS_COLLECTION = "characters";
const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";
const COMMENTS_COLLECTION = "narrativeComments";
const CAMPAIGNS_COLLECTION = "campaigns";
const db = getFirestore(app);


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
    role: { isGm: boolean, isPlayer: boolean };
    campaignSecret?: string;
    uid: string; // UID from Firebase Auth is mandatory
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { uid, name, email, role, campaignSecret } = input;
    
    // 1. Check if user already exists
    const existingUser = await getUserById(uid);
    if (existingUser) {
        // This case can happen with OAuth if the user exists but setupSession failed before.
        // Or if there's a race condition. We'll just return the existing user.
        return existingUser;
    }

    let campaignId = '';

    // 2. Handle GM Role: Create a new campaign for the user.
    if (role.isGm) {
        const locale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as 'en' | 'es' | null) || 'en' : 'en';
        campaignId = await createNewCampaignForUser({ id: uid, name }, locale);
    } else if (role.isPlayer) {
    // 3. Handle Player-only Role: Find the campaign via secret code.
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

    // 4. Define and Save New User Data using the UID as the document ID
    const newUserRef = doc(db, USERS_COLLECTION, uid);
    const newUser: User = {
        id: uid,
        name,
        email: email.toLowerCase(),
        role,
        avatar: '/ui/avatar/avatar.jpg',
        campaignId: campaignId,
        enabled: true,
    };
    
    await setDoc(newUserRef, newUser);

    return newUser;
};

export const findOrCreateUser = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
    const appUser = await getUserById(firebaseUser.uid);

    if (appUser) {
        // If user profile exists, just return it.
        return appUser;
    } else {
        // This is a new user signing in via OAuth for the first time.
        // We call the main createUser function to ensure consistent logic.
        return await createUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Adventurer',
            email: firebaseUser.email!,
            role: { isGm: true, isPlayer: true }, // Default to dual roles for new OAuth users
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

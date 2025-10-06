
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";
import { User, Character, NarrativeComment } from './firebase/types';
import { createNewCampaignForUser } from "./firebase/campaigns";
import { db, auth } from "./firebase/config";


// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";
const CHARACTERS_COLLECTION = "characters";
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
    uid: string;
    name: string;
    email: string;
    role: { isGm: boolean, isPlayer: boolean };
    campaignSecret?: string;
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { uid, name, email, role, campaignSecret } = input;
    
    let campaignId = '';

    if (role.isGm) {
        const locale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as 'en' | 'es' | null) || 'en' : 'en';
        campaignId = await createNewCampaignForUser({ id: uid, name }, locale);
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

export const findOrCreateUser = async (firebaseUser: FirebaseAuthUser, extraData: { name?: string; role?: {isGm: boolean, isPlayer: boolean}, campaignSecret?: string} = {}): Promise<User> => {
    const appUser = await getUserById(firebaseUser.uid);

    if (appUser) {
        return appUser;
    }

    const { name, role, campaignSecret } = extraData;

    return await createUser({
        uid: firebaseUser.uid,
        name: name || firebaseUser.displayName || 'New Adventurer',
        email: firebaseUser.email!,
        role: role || { isGm: true, isPlayer: true }, 
        campaignSecret: campaignSecret
    });
};

export const deleteUserAndAssociatedData = async (user: User): Promise<void> => {
    const batch = writeBatch(db);

    if (user.role.isGm && user.campaignId) {
        console.log(`User is GM. Preparing to delete campaign ${user.campaignId}`);
        const campaignId = user.campaignId;

        // Delete all characters associated with the campaign
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("campaignId", "==", campaignId));
        const charactersSnapshot = await getDocs(charactersQuery);
        if (!charactersSnapshot.empty) {
            console.log(`Found ${charactersSnapshot.size} characters to delete.`);
            charactersSnapshot.forEach(doc => batch.delete(doc.ref));
        }

        // Delete all threads in the subcollection
        const threadsRef = collection(db, `campaigns/${campaignId}/threads`);
        const threadsSnapshot = await getDocs(threadsRef);
        if (!threadsSnapshot.empty) {
            console.log(`Found ${threadsSnapshot.size} threads to delete.`);
            threadsSnapshot.forEach(doc => batch.delete(doc.ref));
        }
        
        // Delete all map data in subcollections
        const gridMapQuery = query(collection(db, `campaigns/${campaignId}/gridMap`));
        const gridMapSnapshot = await getDocs(gridMapQuery);
        for (const cellDoc of gridMapSnapshot.docs) {
             const localesQuery = query(collection(db, `campaigns/${campaignId}/gridMap/${cellDoc.id}/locales`));
             const localesSnapshot = await getDocs(localesQuery);
             localesSnapshot.forEach(lDoc => batch.delete(lDoc.ref));
             
             const npcsQuery = query(collection(db, `campaigns/${campaignId}/gridMap/${cellDoc.id}/npcs`));
             const npcsSnapshot = await getDocs(npcsQuery);
             npcsSnapshot.forEach(nDoc => batch.delete(nDoc.ref));

             const hooksQuery = query(collection(db, `campaigns/${campaignId}/gridMap/${cellDoc.id}/hooks`));
             const hooksSnapshot = await getDocs(hooksQuery);
             hooksSnapshot.forEach(hDoc => batch.delete(hDoc.ref));
             
             batch.delete(cellDoc.ref);
        }
        console.log(`Cleaned up map data for campaign ${campaignId}.`);

        // Finally, delete the campaign document itself
        const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
        batch.delete(campaignRef);
        console.log(`Campaign document ${campaignId} queued for deletion.`);
        
    } else if (user.role.isPlayer) {
        // If user is just a player, delete their character(s) from the campaign
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("userId", "==", user.id), where("campaignId", "==", user.campaignId));
        const charactersSnapshot = await getDocs(charactersQuery);
         if (!charactersSnapshot.empty) {
            console.log(`User is Player. Found ${charactersSnapshot.size} character(s) to delete.`);
            charactersSnapshot.forEach(doc => batch.delete(doc.ref));
        }
    }


    // Delete the user document
    const userRef = doc(db, USERS_COLLECTION, user.id);
    batch.delete(userRef);
    console.log(`User document ${user.id} queued for deletion.`);

    await batch.commit();
    console.log("Firestore batch commit successful.");

    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === user.id) {
        await currentUser.delete();
        console.log("Firebase Auth user deleted successfully.");
    }
};

    
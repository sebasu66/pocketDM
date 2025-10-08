
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db, auth } from './config';
import { User, Character } from './types';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, User as FirebaseAuthUser, signInAnonymously } from "firebase/auth";
import { createNewCampaignForUser } from "./campaigns";

// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";
const CHARACTERS_COLLECTION = "characters";
const CAMPAIGNS_COLLECTION = "campaigns";


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export const signInWithGoogle = async (): Promise<void> => {
    // We will exclusively use redirect method for better cross-device compatibility
    // The result will be handled by the AuthProvider on page load.
    await signInWithRedirect(auth, googleProvider);
};

export const handleGoogleRedirectResult = async (): Promise<FirebaseAuthUser | null> => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            return result.user;
        }
        return null;
    } catch (error) {
        console.error("Error handling Google redirect result:", error);
        return null;
    }
}

/**
 * Signs in a user without a password for development.
 * This is insecure and should only be used in a controlled dev environment.
 */
export const signInDevUser = async (userId: string): Promise<void> => {
    // For development, we can use anonymous sign-in to get a valid auth state,
    // but we will manage user data separately based on the email/ID provided.
    // This is a simplification; a real "passwordless" flow would use custom tokens.
    if (!auth.currentUser) {
        await signInAnonymously(auth);
    }
    // The actual user data is then fetched and set in the AuthContext,
    // bypassing the need for a password here.
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
    email: string | null;
    role: { isGm: boolean, isPlayer: boolean };
    campaignSecret?: string;
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { uid, name, email, role, campaignSecret } = input;
    
    let campaignId = '';

    if (role.isGm) {
        const locale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as 'en' | 'es' | null) || 'en' : 'en';
        // The campaign ID is the same as the GM's user ID for simplicity
        campaignId = await createNewCampaignForUser({ id: uid, name }, locale);
    } else if (role.isPlayer) {
        if (!campaignSecret) {
            throw new Error("A secret code is required to join a campaign as a player.");
        }
        const campaignsRef = collection(db, CAMPAIGNS_COLLECTION);
        const q = query(campaignsRef, where("secretCode", "==", campaignSecret));
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
        email: email ? email.toLowerCase() : `anonymous-${uid}@demo.local`,
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

    // Default role for new OAuth users is Player.
    // If they have a secret code, they join a campaign. If not, we can assume GM for now.
    const isPlayerWithCode = !!extraData.campaignSecret;
    const role = extraData.role || { isGm: !isPlayerWithCode, isPlayer: isPlayerWithCode };
    const { name, campaignSecret } = extraData;

    return await createUser({
        uid: firebaseUser.uid,
        name: name || firebaseUser.displayName || 'New Adventurer',
        email: firebaseUser.email!,
        role, 
        campaignSecret: campaignSecret
    });
};

export const deleteUserAndAssociatedData = async (user: User): Promise<void> => {
    const batch = writeBatch(db);

    if (user.role.isGm && user.campaignId) {
        console.log(`User is GM. Preparing to delete campaign ${user.campaignId}`);
        const campaignId = user.campaignId;

        // Delete all characters associated with the campaign
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("campaign_id", "==", campaignId));
        const charactersSnapshot = await getDocs(charactersQuery);
        if (!charactersSnapshot.empty) {
            console.log(`Found ${charactersSnapshot.size} characters to delete.`);
            charactersSnapshot.forEach(doc => batch.delete(doc.ref));
        }
        
        // Note: Narrative nodes are in a subcollection and need to be handled carefully.
        // For now, we are focusing on top-level collections. Deleting subcollections
        // is best handled by a backend Cloud Function upon campaign document deletion.

        // Finally, delete the campaign document itself
        const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
        batch.delete(campaignRef);
        console.log(`Campaign document ${campaignId} queued for deletion.`);
        
    } else if (user.role.isPlayer) {
        // If user is just a player, delete their character(s) from the campaign
        const charactersQuery = query(collection(db, CHARACTERS_COLLECTION), where("player_id", "==", user.id), where("campaign_id", "==", user.campaignId));
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

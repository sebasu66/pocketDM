

import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc } from "firebase/firestore";
import { db, auth } from './firebase/config';
import { User } from './firebase/types';
import { GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";
import { createNewCampaignForUser } from "./firebase/campaigns";

// Re-export User type for convenience
export type { User };

const USERS_COLLECTION = "users";
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
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { name, email, password, role, campaignSecret } = input;

    // 1. Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    let campaignId = '';

    // 2. Handle Player Role
    if (role.isPlayer && !role.isGm) { // Only a player
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

    // 3. Create User Document first to get an ID
    const newUserRef = doc(collection(db, USERS_COLLECTION));
    
    // 4. Handle GM Role (always creates a new campaign)
    if (role.isGm) {
        const newCampaignId = await createNewCampaignForUser({ id: newUserRef.id, name });
        // If the user is ONLY a GM, this is their campaign. 
        // If they are also a player joining another campaign, they still get their own.
        if (!campaignId) {
            campaignId = newCampaignId;
        }
    }
    
    if (!campaignId && role.isPlayer) {
         throw new Error("Could not determine a campaign to assign to the user.");
    }

    // 5. Define New User Data
    const newUser: User = {
        id: newUserRef.id,
        name,
        email: email.toLowerCase(),
        role,
        avatar: `https://picsum.photos/seed/${newUserRef.id}/100/100`,
        campaignId: campaignId, // Assign the determined campaign ID
        enabled: true,
    };
    
    // Add password for manual auth
    const finalUserData: any = { ...newUser };
    if (password) {
        finalUserData.password = password;
    }

    await setDoc(newUserRef, finalUserData);

    return newUser;
};

export const findOrCreateUserFromOAuth = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        // User exists, just return their data.
        return { id: docSnap.id, ...docSnap.data() } as User;
    } else {
        // This is a new user signing in via OAuth.
        // Default to creating a GM with their own campaign.
        const newCampaignId = await createNewCampaignForUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New GM'
        });

        const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New Adventurer',
            email: firebaseUser.email || '',
            // Default to both roles for flexibility
            role: { isGm: true, isPlayer: true },
            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
            campaignId: newCampaignId, // Assign their newly created campaign
            enabled: true,
        };
        await setDoc(userRef, newUser);
        return newUser;
    }
};

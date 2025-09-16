

import { doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore"; 
import { db } from "./config";
import { Campaign } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    console.log(`Fetching campaign with id: ${id}`);
    
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().enabled) {
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
   
    return null;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<void> => {
    const docRef = doc(db, "campaigns", id);
    await updateDoc(docRef, campaignData);
}

export const createNewCampaignForUser = async (user: {id: string, name: string}): Promise<string> => {
    const newCampaignRef = doc(collection(db, "campaigns"));
    const newCampaignId = newCampaignRef.id;

    const newCampaignData: Omit<Campaign, 'id'> = {
        title: `${user.name}'s Campaign`,
        description: `A new adventure awaits, led by ${user.name}.`,
        bannerUrl: `https://picsum.photos/seed/${newCampaignId}/1200/400`,
        bannerAiHint: 'fantasy landscape',
        systemPrompt: "You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.",
        enabled: true,
        secretCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        ownerId: user.id,
    };

    await setDoc(newCampaignRef, newCampaignData);

    // Create the initial narrative thread for the new campaign
    const initialThreadData = { ...initialThreadEn, campaignId: newCampaignId };
    const threadRef = doc(db, "narrativeThreads", `${newCampaignId}-1`);
    await setDoc(threadRef, initialThreadData);

    return newCampaignId;
}

export const generateNewSecretCode = async (campaignId: string): Promise<string> => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateCampaign(campaignId, { secretCode: newCode });
    return newCode;
};

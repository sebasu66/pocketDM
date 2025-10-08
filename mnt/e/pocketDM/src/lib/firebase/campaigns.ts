
import { doc, getDoc, updateDoc, setDoc, collection, writeBatch, addDoc, Timestamp } from "firebase/firestore"; 
import { db } from "./config";
import { Campaign } from "./types";

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    if (!id) {
        console.warn("[Campaigns] getCampaign called with no ID.");
        return null;
    }
    console.log(`[Campaigns] Fetching campaign with id: ${id}`);
    
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`[Campaigns] Found campaign: ${data.campaign_name}`);
        return { 
            id: docSnap.id,
            ...data
         } as Campaign;
    }
   
    console.warn(`[Campaigns] Campaign with id ${id} not found.`);
    return null;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<void> => {
    const docRef = doc(db, "campaigns", id);
    await updateDoc(docRef, { ...campaignData, updated_at: Timestamp.now() });
}

export const createNewCampaignForUser = async (user: {id: string, name: string}, locale: 'en' | 'es' = 'en'): Promise<string> => {
    const newCampaignId = user.id; 
    console.log(`[Campaigns] Starting creation for new campaign with ID: ${newCampaignId} for user ${user.name}.`);
    
    const newCampaignRef = doc(db, "campaigns", newCampaignId);

    const newCampaignData: Partial<Campaign> = {
        id: newCampaignId,
        dm_id: user.id,
        campaign_name: `${user.name}'s Adventure`,
        description: `An epic adventure in the frozen lands of Rassilon, led by ${user.name}.`,
        setting: 'hellfrost',
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        status: 'creating',
        narrative_status: 'pending',
        character_ids: [],
        world_seed: Math.random().toString(36).substring(2, 15),
        difficulty: 'normal',
        max_players: 4,
        secretCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    
    await setDoc(newCampaignRef, newCampaignData);
    console.log(`[Campaigns] Campaign document for ${newCampaignId} created with status='creating'.`);

    return newCampaignId;
}

export const generateNewSecretCode = async (campaignId: string): Promise<string> => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateCampaign(campaignId, { secretCode: newCode });
    return newCode;
};

export const requestCampaignReset = async (campaignId: string): Promise<void> => {
    console.log(`[Campaigns] Requesting reset for campaign: ${campaignId}`);
    const campaignRef = doc(db, "campaigns", campaignId);
    await updateDoc(campaignRef, {
      status: "creating", // Re-trigger the creation process
      narrative_status: "pending",
      updated_at: Timestamp.now(),
    });
};

    
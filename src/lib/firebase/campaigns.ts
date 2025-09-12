
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./config";
import { Campaign } from "./types";

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    console.log(`Fetching campaign with id: ${id}`);
    
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
   
    return null;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<void> => {
    const docRef = doc(db, "campaigns", id);
    await updateDoc(docRef, campaignData);
}

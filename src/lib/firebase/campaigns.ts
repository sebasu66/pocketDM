
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "./config";
import { Campaign } from "./types";

// This is mock data for now. In a real app, you'd fetch this from Firestore.
const mockCampaigns: Campaign[] = [
    {
        id: "1",
        title: "The Whispering Shadows",
        description: "A realm teetering on the brink of an ancient, creeping darkness. Once a safe haven for elves, dwarves, gnomes and other creatures, humans started settling in thousands of years ago through war and conquest. The elves live exiles in the north.",
        bannerUrl: "https://picsum.photos/1200/400?random=10",
        bannerAiHint: "epic fantasy landscape"
    }
];

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    console.log(`Fetching campaign with id: ${id}`);
    // For now, we'll return mock data.
    const campaign = mockCampaigns.find(c => c.id === id);
    if (campaign) {
        return Promise.resolve(campaign);
    }

    // This is how you would fetch from Firestore in a real scenario:
    /*
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
    */
   
    return null;
};

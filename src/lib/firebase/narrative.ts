
import { doc, getDoc, collection, addDoc, query, where, getDocs, writeBatch, deleteDoc, setDoc, getCountFromServer, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread, Campaign, NarrativeComment } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";
import { initialThreadEs } from "./data/initial-thread-es";
import { populateCampaignMapData } from "./seed";
import { rassilonGridMapSummary } from "./data/seed-reference";

const DEV_LOG_COLLECTION = "devLog";
const CAMPAIGNS_COLLECTION = "campaigns";
const THREADS_SUBCOLLECTION = "threads";


export const getNarrativeThreadsByCampaign = async (campaignId: string): Promise<NarrativeThread[]> => {
    const threadsRef = collection(db, CAMPAIGNS_COLLECTION, campaignId, THREADS_SUBCOLLECTION);
    const q = query(threadsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    const threads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
    
    return threads;
};


export const getNarrativeThreadById = async (campaignId: string, threadId: string): Promise<NarrativeThread | null> => {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId, THREADS_SUBCOLLECTION, threadId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data } as NarrativeThread;
    }
    return null;
}

export const addNarrativeThread = async (campaignId: string, threadData: Partial<Omit<NarrativeThread, 'id' | 'comments' | 'createdAt'>>): Promise<string> => {
    const threadsRef = collection(db, CAMPAIGNS_COLLECTION, campaignId, THREADS_SUBCOLLECTION);
    
    const finalThreadData: Omit<NarrativeThread, 'id'> = {
        title: threadData.title || "Untitled",
        narrative: threadData.narrative || "",
        authorId: threadData.authorId || "unknown",
        createdAt: Timestamp.now(),
        comments: [], // Start with an empty comments array
        ...threadData
    };
    
    const docRef = await addDoc(threadsRef, finalThreadData);
    return docRef.id;
};


export const deleteNarrativeThread = async (campaignId: string, threadId: string): Promise<void> => {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId, THREADS_SUBCOLLECTION, threadId);
    await deleteDoc(docRef);
};


export const restartCampaignNarrative = async (campaignId: string, locale: 'en' | 'es' = 'en'): Promise<void> => {
    console.log(`[Narrative Service] Restarting campaign ${campaignId} in ${locale}.`);

    const batch = writeBatch(db);
    const threadsRef = collection(db, CAMPAIGNS_COLLECTION, campaignId, THREADS_SUBCOLLECTION);
    const threadsSnapshot = await getDocs(threadsRef);

    if (!threadsSnapshot.empty) {
        console.log(`[Narrative Service] Found ${threadsSnapshot.docs.length} threads. Queueing for deletion.`);
        threadsSnapshot.forEach(threadDoc => {
            batch.delete(threadDoc.ref);
        });
    } else {
        console.log(`[Narrative Service] No threads found for campaign ${campaignId}.`);
    }

    // Add the new initial thread back, localized
    console.log(`[Narrative Service] Creating new initial thread in ${locale}.`);
    const initialThreadData = locale === 'es' ? initialThreadEs : initialThreadEn;
    const newThreadRef = doc(threadsRef); // Auto-generate ID for the new thread
    batch.set(newThreadRef, { 
        ...initialThreadData, 
        createdAt: Timestamp.now(),
        comments: [] 
    });
    
    await batch.commit();
    console.log(`[Narrative Service] Campaign ${campaignId} restarted successfully.`);
}

// --- TEST UTILITIES ---

const deleteCampaignForTest = async (campaignId: string, log: (message: string) => void) => {
    log(`[TEST] Deleting test campaign: ${campaignId}`);
    const batch = writeBatch(db);
    
    const threadsRef = collection(db, `campaigns/${campaignId}/threads`);
    const threadsSnapshot = await getDocs(threadsRef);
    threadsSnapshot.forEach(doc => batch.delete(doc.ref));

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

    const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    batch.delete(campaignRef);

    await batch.commit();
    log(`[TEST] Test campaign ${campaignId} deleted successfully.`);
};

export const runCampaignSeedingTest = async () => {
    const testCampaignId = `test-campaign-${Date.now()}`;
    const logMessages: string[] = [];
    const log = (message: string) => {
        console.log(message);
        logMessages.push(message);
    };

    log(`[TEST] Starting test with campaign ID: ${testCampaignId}`);

    try {
        log('[TEST] Creating test campaign document...');
        const campaignRef = doc(db, CAMPAIGNS_COLLECTION, testCampaignId);
        await setDoc(campaignRef, {
            title: "Test Campaign",
            ownerId: "test-user",
            enabled: true,
        });

        log('[TEST] Populating map data...');
        await populateCampaignMapData(testCampaignId);

        log('[TEST] Verifying created data...');
        const gridMapQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap`));
        const gridMapSnapshot = await getDocs(gridMapQuery);
        const cellCount = gridMapSnapshot.size;
        
        log(`[TEST] Found ${cellCount} cells in gridMap.`);
        if (cellCount !== rassilonGridMapSummary.length) {
            throw new Error(`Verification failed: Expected ${rassilonGridMapSummary.length} map cells, but found ${cellCount}.`);
        }

        const sampleCellId = 'A10';
        const localesQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/locales`));
        const npcsQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/npcs`));
        const hooksQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/hooks`));
        
        const localesSnapshot = await getCountFromServer(localesQuery);
        const npcsSnapshot = await getCountFromServer(npcsQuery);
        const hooksSnapshot = await getCountFromServer(hooksQuery);

        log(`[TEST] Cell ${sampleCellId} contains: ${localesSnapshot.data().count} locales, ${npcsSnapshot.data().count} NPCs, ${hooksSnapshot.data().count} hooks.`);

        if (localesSnapshot.data().count === 0 || npcsSnapshot.data().count === 0 || hooksSnapshot.data().count === 0) {
             throw new Error(`Verification failed: Sample cell ${sampleCellId} is missing one or more subcollections.`);
        }
        
        log("[TEST] SUCCESS: Campaign seeding test passed!");
        await addDoc(collection(db, DEV_LOG_COLLECTION), {
            type: 'seeding_test',
            status: 'SUCCESS',
            timestamp: Date.now(),
            log: logMessages
        });

    } catch (error: any) {
        log(`[TEST] FAILED: Campaign seeding test failed. ${error.message}`);
        await addDoc(collection(db, DEV_LOG_COLLECTION), {
            type: 'seeding_test',
            status: 'FAILURE',
            timestamp: Date.now(),
            log: logMessages
        });
    } finally {
        await deleteCampaignForTest(testCampaignId, log);
    }
};

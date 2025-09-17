

import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy, writeBatch, deleteDoc, setDoc,getCountFromServer } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread, Campaign } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";
import { initialThreadEs } from "./data/initial-thread-es";
import { createNewCampaignForUser } from "./campaigns";
import { populateCampaignMapData } from "./seed";
import { rassilonGridMapSummary } from "./data/seed-reference";

const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";
const COMMENTS_COLLECTION = "narrativeComments";
const CAMPAIGNS_COLLECTION = "campaigns";
const CHARACTERS_COLLECTION = "characters";

export const getNarrativeThreadsByCampaign = async (campaignId: string): Promise<NarrativeThread[]> => {
    const q = query(
        collection(db, NARRATIVE_THREADS_COLLECTION),
        where("campaignId", "==", campaignId),
        orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
};


export const getNarrativeThreadById = async (id: string): Promise<NarrativeThread | null> => {
    const docRef = doc(db, NARRATIVE_THREADS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as NarrativeThread;
    }
    return null;
}

export const addNarrativeThread = async (threadData: Omit<NarrativeThread, 'id'>): Promise<string> => {
    // Get the current number of threads for the campaign to create a sequential ID
    const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", threadData.campaignId));
    const snapshot = await getCountFromServer(threadsQuery);
    const newThreadNumber = snapshot.data().count + 1;
    const newThreadId = `${threadData.campaignId}-${newThreadNumber}`;

    // Use setDoc with the custom ID
    const threadRef = doc(db, NARRATIVE_THREADS_COLLECTION, newThreadId);
    await setDoc(threadRef, threadData);
    
    return newThreadId;
};

export const deleteNarrativeThread = async (threadId: string): Promise<void> => {
    const docRef = doc(db, NARRATIVE_THREADS_COLLECTION, threadId);
    await deleteDoc(docRef);
};


export const restartCampaignNarrative = async (campaignId: string, locale: 'en' | 'es' = 'en'): Promise<void> => {
    console.log(`[Narrative Service] Restarting campaign ${campaignId} in ${locale}.`);

    const batch = writeBatch(db);
    // 1. Get all threads for the campaign to delete their comments
    const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
    const threadsSnapshot = await getDocs(threadsQuery);

    if (!threadsSnapshot.empty) {
        console.log(`[Narrative Service] Found ${threadsSnapshot.docs.length} threads. Preparing to delete comments and threads.`);
        
        // 2. For each thread, find and queue deletion of all its comments
        for (const threadDoc of threadsSnapshot.docs) {
            const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("threadId", "==", threadDoc.id));
            const commentsSnapshot = await getDocs(commentsQuery);
            if (!commentsSnapshot.empty) {
                console.log(`[Narrative Service] Queueing ${commentsSnapshot.docs.length} comments for deletion for thread ${threadDoc.id}.`);
                commentsSnapshot.forEach(commentDoc => {
                    batch.delete(commentDoc.ref);
                });
            }
            // Also queue the thread itself for deletion
            batch.delete(threadDoc.ref);
        }
    } else {
        console.log(`[Narrative Service] No threads found for campaign ${campaignId}. Proceeding to create initial thread.`);
    }

    // 4. Add the new initial thread back, localized
    console.log(`[Narrative Service] Creating new initial thread in ${locale}.`);
    const initialThread = locale === 'es' ? initialThreadEs : initialThreadEn;
    const firstThreadId = `${campaignId}-1`;
    const threadRef = doc(db, NARRATIVE_THREADS_COLLECTION, firstThreadId);
    batch.set(threadRef, { ...initialThread, campaignId, createdAt: Date.now() });

    // 5. Commit all deletions and the new thread creation
    await batch.commit();
    console.log(`[Narrative Service] Campaign ${campaignId} restarted successfully with initial thread ID ${firstThreadId}.`);
}


// --- TEST UTILITIES ---

const deleteCampaignForTest = async (campaignId: string) => {
    console.log(`[TEST] Deleting test campaign: ${campaignId}`);
    const batch = writeBatch(db);

    const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
    const threadsSnapshot = await getDocs(threadsQuery);
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
    console.log(`[TEST] Test campaign ${campaignId} deleted successfully.`);
};

export const runCampaignSeedingTest = async () => {
    const testCampaignId = `test-campaign-${Date.now()}`;
    console.log(`[TEST] Starting test with campaign ID: ${testCampaignId}`);

    try {
        // 1. Create a test campaign
        console.log('[TEST] Creating test campaign document...');
        const campaignRef = doc(db, CAMPAIGNS_COLLECTION, testCampaignId);
        await setDoc(campaignRef, {
            title: "Test Campaign",
            ownerId: "test-user",
            enabled: true,
        });

        // 2. Populate its map data
        console.log('[TEST] Populating map data...');
        await populateCampaignMapData(testCampaignId);

        // 3. Verify the data
        console.log('[TEST] Verifying created data...');
        const gridMapQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap`));
        const gridMapSnapshot = await getDocs(gridMapQuery);
        const cellCount = gridMapSnapshot.size;
        
        console.log(`[TEST] Found ${cellCount} cells in gridMap.`);
        if (cellCount !== rassilonGridMapSummary.length) {
            throw new Error(`Verification failed: Expected ${rassilonGridMapSummary.length} map cells, but found ${cellCount}.`);
        }

        // Verify subcollections in a sample cell
        const sampleCellId = 'A10';
        const localesQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/locales`));
        const npcsQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/npcs`));
        const hooksQuery = query(collection(db, `campaigns/${testCampaignId}/gridMap/${sampleCellId}/hooks`));
        
        const localesSnapshot = await getCountFromServer(localesQuery);
        const npcsSnapshot = await getCountFromServer(npcsQuery);
        const hooksSnapshot = await getCountFromServer(hooksQuery);

        console.log(`[TEST] Cell ${sampleCellId} contains: ${localesSnapshot.data().count} locales, ${npcsSnapshot.data().count} NPCs, ${hooksSnapshot.data().count} hooks.`);

        if (localesSnapshot.data().count === 0 || npcsSnapshot.data().count === 0 || hooksSnapshot.data().count === 0) {
             throw new Error(`Verification failed: Sample cell ${sampleCellId} is missing one or more subcollections.`);
        }
        
        console.log("%c[TEST] SUCCESS: Campaign seeding test passed!", "color: lightgreen; font-weight: bold;");

    } catch (error) {
        console.error("%c[TEST] FAILED: Campaign seeding test failed.", "color: red; font-weight: bold;", error);
    } finally {
        // 4. Clean up
        await deleteCampaignForTest(testCampaignId);
    }
};

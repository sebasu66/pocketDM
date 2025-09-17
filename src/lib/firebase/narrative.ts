

import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy, writeBatch, deleteDoc, setDoc,getCountFromServer } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";
import { initialThreadEs } from "./data/initial-thread-es";

const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";
const COMMENTS_COLLECTION = "narrativeComments";

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


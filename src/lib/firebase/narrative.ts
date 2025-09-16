
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";
import { initialThreadEs } from "./data/initial-thread-es";

const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";

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
    const docRef = await addDoc(collection(db, NARRATIVE_THREADS_COLLECTION), threadData);
    return docRef.id;
};

export const deleteNarrativeThread = async (threadId: string): Promise<void> => {
    const docRef = doc(db, NARRATIVE_THREADS_COLLECTION, threadId);
    await deleteDoc(docRef);
};


export const restartCampaignNarrative = async (campaignId: string, locale: 'en' | 'es' = 'en'): Promise<void> => {
    const batch = writeBatch(db);

    // 1. Find all narrative threads for the campaign
    const threadsQuery = query(
        collection(db, NARRATIVE_THREADS_COLLECTION),
        where("campaignId", "==", campaignId)
    );
    const threadsSnapshot = await getDocs(threadsQuery);

    if (!threadsSnapshot.empty) {
        const threadIds = threadsSnapshot.docs.map(d => d.id);

        // 2. For each thread, find its comments and add them to the batch for deletion
        for (const threadId of threadIds) {
            const commentsQuery = query(
                collection(db, "narrativeComments"),
                where("threadId", "==", threadId)
            );
            const commentsSnapshot = await getDocs(commentsQuery);
            commentsSnapshot.forEach(commentDoc => {
                batch.delete(commentDoc.ref);
            });
        }

        // 3. Add all threads to the batch for deletion
        threadsSnapshot.forEach(threadDoc => {
            batch.delete(threadDoc.ref);
        });
    }

    // 4. Add the new initial thread back, localized
    const initialThread = locale === 'es' ? initialThreadEs : initialThreadEn;
    const newThreadRef = doc(collection(db, NARRATIVE_THREADS_COLLECTION));
    batch.set(newThreadRef, { ...initialThread, campaignId });

    // 5. Commit the entire batch operation
    await batch.commit();
}

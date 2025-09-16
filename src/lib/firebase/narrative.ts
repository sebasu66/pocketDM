
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy, writeBatch, deleteDoc } from "firebase/firestore";
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
    const docRef = await addDoc(collection(db, NARRATIVE_THREADS_COLLECTION), threadData);
    return docRef.id;
};

export const deleteNarrativeThread = async (threadId: string): Promise<void> => {
    const docRef = doc(db, NARRATIVE_THREADS_COLLECTION, threadId);
    await deleteDoc(docRef);
};


export const restartCampaignNarrative = async (campaignId: string, locale: 'en' | 'es' = 'en'): Promise<void> => {
    const batch = writeBatch(db);

    // 1. Delete all comments associated with the campaign's threads
    const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
    const threadsSnapshot = await getDocs(threadsQuery);
    
    // We need to fetch all comments for all threads.
    // Firestore client-side SDK doesn't support collection group queries with complex `where` clauses or deleting collections directly.
    // So we iterate.
    if (!threadsSnapshot.empty) {
        for (const threadDoc of threadsSnapshot.docs) {
            const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("threadId", "==", threadDoc.id));
            const commentsSnapshot = await getDocs(commentsQuery);
            commentsSnapshot.forEach(commentDoc => {
                batch.delete(commentDoc.ref);
            });
        }
    }

    // 2. Delete all the narrative threads themselves
    threadsSnapshot.forEach(threadDoc => {
        batch.delete(threadDoc.ref);
    });

    // 3. Add the new initial thread back, localized
    const initialThread = locale === 'es' ? initialThreadEs : initialThreadEn;
    const newThreadRef = doc(collection(db, NARRATIVE_THREADS_COLLECTION));
    batch.set(newThreadRef, { ...initialThread, campaignId });

    // 4. Commit the entire batch operation
    await batch.commit();
}

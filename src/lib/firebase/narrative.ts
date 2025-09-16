
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
    console.log(`[Narrative Service] Restarting campaign ${campaignId} in ${locale}.`);

    // 1. Get all threads for the campaign
    const threadsQuery = query(collection(db, NARRATIVE_THREADS_COLLECTION), where("campaignId", "==", campaignId));
    const threadsSnapshot = await getDocs(threadsQuery);

    if (!threadsSnapshot.empty) {
        console.log(`[Narrative Service] Found ${threadsSnapshot.docs.length} threads to delete.`);
        // 2. For each thread, delete all its comments
        for (const threadDoc of threadsSnapshot.docs) {
            const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("threadId", "==", threadDoc.id));
            const commentsSnapshot = await getDocs(commentsQuery);
            if (!commentsSnapshot.empty) {
                console.log(`[Narrative Service] Found ${commentsSnapshot.docs.length} comments for thread ${threadDoc.id}. Deleting...`);
                const deleteCommentsBatch = writeBatch(db);
                commentsSnapshot.forEach(commentDoc => {
                    deleteCommentsBatch.delete(commentDoc.ref);
                });
                await deleteCommentsBatch.commit();
                 console.log(`[Narrative Service] Deleted comments for thread ${threadDoc.id}.`);
            }
        }

        // 3. Once all comments are gone, delete all the threads
        console.log(`[Narrative Service] Deleting all threads...`);
        const deleteThreadsBatch = writeBatch(db);
        threadsSnapshot.forEach(threadDoc => {
            deleteThreadsBatch.delete(threadDoc.ref);
        });
        await deleteThreadsBatch.commit();
        console.log(`[Narrative Service] All old threads deleted.`);
    } else {
        console.log(`[Narrative Service] No threads found for campaign ${campaignId}. Proceeding to create initial thread.`);
    }

    // 4. Add the new initial thread back, localized
    console.log(`[Narrative Service] Creating new initial thread in ${locale}.`);
    const initialThread = locale === 'es' ? initialThreadEs : initialThreadEn;
    await addDoc(collection(db, NARRATIVE_THREADS_COLLECTION), { ...initialThread, campaignId });
    console.log(`[Narrative Service] Campaign ${campaignId} restarted successfully.`);
}

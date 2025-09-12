
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread } from "./types";

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


export const restartCampaignNarrative = async (campaignId: string): Promise<void> => {
    const batch = writeBatch(db);

    // Find all narrative threads for the campaign
    const threadsQuery = query(
        collection(db, NARRATIVE_THREADS_COLLECTION),
        where("campaignId", "==", campaignId)
    );
    const threadsSnapshot = await getDocs(threadsQuery);

    if (threadsSnapshot.empty) {
        console.log("No narrative threads to delete.");
        return;
    }

    const threadIds = threadsSnapshot.docs.map(d => d.id);

    // Find all comments for those threads
    const commentsQuery = query(
        collection(db, "narrativeComments"),
        where("threadId", "in", threadIds)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    // Delete all comments
    commentsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Delete all threads
    threadsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

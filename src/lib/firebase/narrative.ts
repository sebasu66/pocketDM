
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { NarrativeThread } from "./types";

const NARRATIVE_THREADS_COLLECTION = "narrativeThreads";

export const getNarrativeThreadById = async (id: string): Promise<NarrativeThread | null> => {
    const docRef = doc(db, NARRATIVE_THREADS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as NarrativeThread;
    }
    return null;
}

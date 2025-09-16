
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { Concepto } from "./types";

export const getReferenceItem = async (collectionName: string, documentId: string): Promise<Concepto | null> => {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Concepto;
        } else {
            console.log(`No document found in ${collectionName} with id ${documentId}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching document from ${collectionName}:`, error);
        return null;
    }
};

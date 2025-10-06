
import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";
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

export const searchReference = async (searchTerm: string): Promise<Concepto[]> => {
    if (!searchTerm) return [];

    const collectionsToSearch = [
        'razas',
        'characterCategories',
        'habilidades',
        'edges',
        'hindrances',
        'hellfrost_items',
        'conjuros',
        'conceptos',
        'archetypes',
    ];

    try {
        const lowercasedTerm = searchTerm.toLowerCase();
        const results: Concepto[] = [];

        for (const collectionName of collectionsToSearch) {
            const q = query(
                collection(db, collectionName),
                where('name', '>=', lowercasedTerm),
                where('name', '<=', lowercasedTerm + '\uf8ff'),
                limit(5)
            );
            
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, collection: collectionName, ...doc.data() } as Concepto);
            });
        }
        
        return results;

    } catch (error) {
        console.error("Error searching reference:", error);
        return [];
    }
}

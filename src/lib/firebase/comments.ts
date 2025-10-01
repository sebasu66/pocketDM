

import { query, collection, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./config";
import { NarrativeComment, User } from "./types";
import { getUserById } from "./auth";

export type NarrativeCommentWithAuthor = NarrativeComment & { author: User };

const COMMENTS_COLLECTION = "narrativeComments";

export const getCommentsByThreadId = async (threadId: string): Promise<NarrativeCommentWithAuthor[]> => {
    const q = query(
        collection(db, COMMENTS_COLLECTION), 
        where("threadId", "==", threadId)
    );
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeComment));

    // Sort client-side
    comments.sort((a, b) => a.createdAt - b.createdAt);

    const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
            const author = await getUserById(comment.authorId);
            const finalAuthor = author || { id: 'unknown', name: 'Unknown Author', email: '', role: { isGm: false, isPlayer: true }, avatar: '', campaignId: '', enabled: true };
            return { ...comment, author: finalAuthor };
        })
    );
    
    return commentsWithAuthors;
};


export const addNarrativeComment = async (commentData: Omit<NarrativeComment, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
    return docRef.id;
}

    
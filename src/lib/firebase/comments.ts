
import { doc, updateDoc, arrayUnion, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";
import type { NarrativeComment, NarrativeThread } from "./types";
import { v4 as uuidv4 } from 'uuid';

/**
 * Adds a new comment to the `comments` array of a specific thread document.
 * @param campaignId The ID of the campaign containing the thread.
 * @param threadId The ID of the thread to add the comment to.
 * @param commentData The comment data to add (authorId, text, etc.).
 * @returns The newly created comment object with its generated ID and ISO timestamp.
 */
export const addCommentToThread = async (
    campaignId: string,
    threadId: string,
    commentData: Omit<NarrativeComment, 'id' | 'createdAt'>
): Promise<NarrativeComment> => {
    
    const threadRef = doc(db, "campaigns", campaignId, "threads", threadId);

    const newComment: NarrativeComment = {
        ...commentData,
        id: uuidv4(),
        createdAt: Timestamp.now(),
    };

    await updateDoc(threadRef, {
        comments: arrayUnion(newComment)
    });

    return newComment;
};

/**
 * Retrieves all comments for a given thread by fetching the thread document.
 * This function is less efficient than getting comments directly from the thread object
 * but can be useful if you only have the IDs.
 * @param campaignId The ID of the campaign.
 * @param threadId The ID of the thread.
 * @returns An array of comments for that thread.
 */
export const getCommentsByThreadId = async (campaignId: string, threadId: string): Promise<NarrativeComment[]> => {
    const threadRef = doc(db, "campaigns", campaignId, "threads", threadId);
    const docSnap = await getDoc(threadRef);

    if (docSnap.exists()) {
        const threadData = docSnap.data() as NarrativeThread;
        return threadData.comments || [];
    }
    
    return [];
};

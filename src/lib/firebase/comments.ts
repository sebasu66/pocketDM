
import { doc, addDoc, collection, getDocs, Timestamp, query, where, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "./config";
import { v4 as uuidv4 } from 'uuid';

export interface CharacterComment {
    id?: string;
    character_id: string;
    player_id: string;
    text: string;
    timestamp: Timestamp;
    current_node_id?: string;
    location_id?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    dm_response_node_id?: string;
    processed_at?: Timestamp;
    error_message?: string;
    retry_count?: number;
}

/**
 * Adds a new comment to character_comments collection for DM processing
 * @param commentData The comment data to add
 * @returns The newly created comment document ID
 */
export const addCharacterComment = async (
    commentData: Omit<CharacterComment, 'id' | 'timestamp' | 'status'>
): Promise<string> => {

    const commentsRef = collection(db, "character_comments");

    const newComment: Omit<CharacterComment, 'id'> = {
        ...commentData,
        timestamp: Timestamp.now(),
        status: 'pending',
        retry_count: 0
    };

    const docRef = await addDoc(commentsRef, newComment);

    return docRef.id;
};

/**
 * Listen to a specific character comment for status changes
 * @param commentId The comment ID to listen to
 * @param callback Function to call when comment updates
 * @returns Unsubscribe function
 */
export const listenToCommentStatus = (
    commentId: string,
    callback: (comment: CharacterComment) => void
): Unsubscribe => {
    const commentRef = doc(db, "character_comments", commentId);

    return onSnapshot(commentRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() } as CharacterComment);
        }
    });
};

/**
 * Get all comments for a specific character
 * @param characterId The character ID
 * @returns Array of comments
 */
export const getCharacterComments = async (characterId: string): Promise<CharacterComment[]> => {
    const commentsRef = collection(db, "character_comments");
    const q = query(commentsRef, where("character_id", "==", characterId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CharacterComment));
};

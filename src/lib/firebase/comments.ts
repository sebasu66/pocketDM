
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./config";
import { NarrativeComment, User, Character } from "./types";
import { getUserById } from "../auth"; // Using mock auth for now

export type NarrativeCommentWithAuthor = NarrativeComment & { author: User };

const mockComments: NarrativeComment[] = [
    {
        id: "comment-1",
        threadId: "thread-1",
        authorId: "2", // Alice's user ID
        characterId: "char-1", // Grom's ID
        createdAt: new Date('2024-07-29T11:00:00Z').getTime(),
        text: "Grom steps forward, his hand resting on the pommel of his axe. 'We seek refuge and supplies, Captain. And perhaps a worthy tale or two.'",
        hiddenText: "I'm keeping an eye on the captain. She seems too calm."
    },
    {
        id: "comment-2",
        threadId: "thread-1",
        authorId: "3", // Bob's user ID (hypothetical)
        characterId: "char-2", // Lyra's ID
        createdAt: new Date('2024-07-29T11:05:00Z').getTime(),
        text: "Lyra scans the guards, her eyes trying to gauge their intentions. She subtly readies a minor illusion spell, just in case."
    }
];

export const getCommentsByThreadId = async (threadId: string): Promise<NarrativeCommentWithAuthor[]> => {
    // Mock implementation
    const commentsForThread = mockComments.filter(c => c.threadId === threadId);
    
    // Enrich with author data
    const commentsWithAuthors = commentsForThread.map(comment => {
        const author = getUserById(comment.authorId);
        // In a real app, handle the case where author might not be found
        if (!author) {
            throw new Error(`Author with ID ${comment.authorId} not found for comment ${comment.id}`);
        }
        return { ...comment, author };
    });

    return Promise.resolve(commentsWithAuthors);

    // Real Firestore implementation:
    /*
    const q = query(collection(db, "narrativeComments"), where("threadId", "==", threadId));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeComment));

    // Enrich comments with author data - this would require another fetch per author
    // or denormalizing author data onto the comment document.
    const commentsWithAuthors = await Promise.all(comments.map(async (comment) => {
        const author = await getUserById(comment.authorId); // Assuming getUserById can fetch from Firestore
        if (!author) {
             throw new Error(`Author with ID ${comment.authorId} not found for comment ${comment.id}`);
        }
        return { ...comment, author };
    }));
    return commentsWithAuthors;
    */
};

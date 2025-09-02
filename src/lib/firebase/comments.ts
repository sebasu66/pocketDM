
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./config";
import { NarrativeComment, User } from "./types";
import { getUserById } from "../auth";

export type NarrativeCommentWithAuthor = NarrativeComment & { author: User };

const COMMENTS_COLLECTION = "narrativeComments";

export const getCommentsByThreadId = async (threadId: string): Promise<NarrativeCommentWithAuthor[]> => {
    const q = query(
        collection(db, COMMENTS_COLLECTION), 
        where("threadId", "==", threadId),
        orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeComment));

    const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
            const author = await getUserById(comment.authorId);
            if (!author) {
                // In a real app, you might want to handle this more gracefully,
                // maybe with a placeholder user.
                throw new Error(`Author with ID ${comment.authorId} not found for comment ${comment.id}`);
            }
            return { ...comment, author };
        })
    );
    
    return commentsWithAuthors;
};

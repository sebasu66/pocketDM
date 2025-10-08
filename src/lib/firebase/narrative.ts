
import { collection, query, orderBy, limit, onSnapshot, Unsubscribe, Timestamp, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "./config";
import type { NarrativeNode } from './types';

export type { NarrativeNode };


/**
 * Listen to narrative nodes for a specific character (real-time)
 * @param characterId The character ID
 * @param onUpdate Callback when narrative updates
 * @param limitCount Number of nodes to fetch (default 20)
 * @returns Unsubscribe function
 */
export const listenToCharacterNarrative = (
    characterId: string,
    onUpdate: (nodes: NarrativeNode[]) => void,
    limitCount: number = 20
): Unsubscribe => {
    console.log(`[Narrative] Setting up listener for character_narrative/${characterId}/nodes`);
    const nodesRef = collection(db, 'character_narrative', characterId, 'nodes');

    const q = query(
        nodesRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const nodes = snapshot.docs.map(doc => doc.data() as NarrativeNode);
        console.log(`[Narrative] Received ${nodes.length} nodes for character ${characterId}`);
        // Reverse to get chronological order (oldest first)
        onUpdate(nodes.reverse());
    }, (error) => {
        console.error(`[Narrative] Error listening to character ${characterId}:`, error);
    });
};

/**
 * Add player comment to a narrative node
 * @param characterId The character ID
 * @param nodeId The narrative node ID
 * @param commentText The comment text
 */
export const addPlayerCommentToNode = async (
    characterId: string,
    nodeId: string,
    commentText: string
): Promise<void> => {
    const nodeRef = doc(db, 'character_narrative', characterId, 'nodes', nodeId);

    await updateDoc(nodeRef, {
        player_comment: {
            text: commentText,
            timestamp: Timestamp.now()
        }
    });
};

/**
 * Get the latest narrative node for a character.
 * This is a one-time fetch, not a listener.
 * @param characterId The character ID
 * @returns The latest narrative node or null
 */
export const getLatestNarrativeNode = async (characterId: string): Promise<NarrativeNode | null> => {
    const nodesRef = collection(db, 'character_narrative', characterId, 'nodes');
    const q = query(
        nodesRef,
        orderBy('timestamp', 'desc'),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    } else {
        return snapshot.docs[0].data() as NarrativeNode;
    }
};

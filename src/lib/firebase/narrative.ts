import { collection, query, orderBy, limit, onSnapshot, Unsubscribe, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface NarrativeNode {
    node_id: string;
    timestamp: Timestamp;

    // Location Context
    location: {
        location_id: string;
        location_name: string;
        cell_id: string;
    };

    // Narrative Content
    narrative_html: string;
    narrative_plain: string;

    // Audio
    audio_url: string | null;
    audio_status: 'pending' | 'ready' | 'failed';

    // Quick Actions
    quick_options: Array<{
        text: string;
        action_type: string;
        icon?: string;
    }>;

    // Who's Present
    visible_characters: string[];
    visible_npcs: string[];
    visible_monsters: string[];

    // Player Interaction
    player_comment: {
        text: string;
        timestamp: Timestamp;
    } | null;

    // Metadata
    summary: string | null;
    is_summarized: boolean;
}

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
    const nodesRef = collection(db, 'character_narrative', characterId, 'nodes');

    const q = query(
        nodesRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const nodes = snapshot.docs.map(doc => doc.data() as NarrativeNode);
        // Reverse to get chronological order (oldest first)
        onUpdate(nodes.reverse());
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
 * Get the latest narrative node for a character
 * @param characterId The character ID
 * @returns The latest narrative node or null
 */
export const getLatestNarrativeNode = async (characterId: string): Promise<NarrativeNode | null> => {
    return new Promise((resolve) => {
        const nodesRef = collection(db, 'character_narrative', characterId, 'nodes');

        const q = query(
            nodesRef,
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            unsubscribe(); // Unsubscribe immediately after getting data

            if (snapshot.empty) {
                resolve(null);
            } else {
                resolve(snapshot.docs[0].data() as NarrativeNode);
            }
        });
    });
};

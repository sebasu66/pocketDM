
'use server';

/**
 * @fileOverview This is the dedicated Database Interaction Service.
 * Its purpose is to fetch all necessary data from Firestore and assemble it
 * into a structured "world state" object for other services to use.
 */

import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getNarrativeThreadsByCampaign } from '@/lib/firebase/narrative';

/**
 * Fetches the complete narrative and character state for a given campaign.
 * This function acts as a centralized data loader for the AI services.
 * @param campaignId The ID of the campaign to fetch data for.
 * @returns A structured object representing the current state of the world.
 */
export async function getWorldState(campaignId: string) {
    try {
        console.log(`[DB Service] Fetching world state for campaign: ${campaignId}`);

        // 1. Fetch all characters in the campaign
        const allCharacters = await getCharactersByCampaign(campaignId);
        console.log(`[DB Service] Found ${allCharacters.length} characters.`);

        // 2. Fetch all narrative threads for the campaign
        const allThreads = await getNarrativeThreadsByCampaign(campaignId);
        console.log(`[DB Service] Found ${allThreads.length} narrative threads.`);

        // 3. For each thread, fetch its comments and enrich them
        const threadsWithComments = await Promise.all(allThreads.map(async (thread) => {
            const comments = await getCommentsByThreadId(thread.id);
            const enrichedComments = await Promise.all(comments.map(async (comment) => {
                const character = allCharacters.find(c => c.id === comment.characterId);
                // Use character name if available, otherwise fall back to the user's name
                const authorName = character?.name || comment.author.name || 'Unknown';
                return {
                    authorName: authorName,
                    text: comment.text,
                };
            }));
            return {
                title: thread.title,
                content: thread.content,
                comments: enrichedComments,
            };
        }));
        console.log(`[DB Service] Enriched threads with comments.`);

        // 4. Assemble the final narrative state object
        const narrativeState = {
            characters: allCharacters.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                class: c.class,
            })),
            threads: threadsWithComments,
        };
        console.log('[DB Service] Successfully constructed world state.');
        return narrativeState;

    } catch (error: any) {
        console.error("[DB Service] Error fetching world state:", error);
        throw new Error(`Failed to get world state from database: ${error.message}`);
    }
}

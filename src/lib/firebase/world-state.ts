
'use server';

/**
 * @fileOverview This is a deprecated service.
 * The new architecture fetches narrative data per-character on the client-side.
 * This file may be removed in future versions.
 */

import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { getUserById } from '@/lib/firebase/auth';

/**
 * @deprecated The world state is now constructed on the client.
 */
export async function getWorldState(campaignId: string) {
    console.warn("[DB Service] getWorldState is deprecated and should not be used.");
    try {
        const allCharacters = await getCharactersByCampaign(campaignId);
        return {
            characters: allCharacters.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                class: c.class || 'Adventurer',
            })),
            threads: [], // Threads are no longer fetched globally
        };

    } catch (error: any) {
        console.error("[DB Service] Error fetching deprecated world state:", error);
        throw new Error(`Failed to get world state from database: ${error.message}`);
    }
}

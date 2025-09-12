
'use server';

/**
 * @fileOverview This file acts as an orchestrator for the story generation process.
 * It uses a dedicated database service to fetch the world state and a dedicated
 * AI service to generate the next part of the story.
 *
 * - generateStory - A function that handles the story generation process.
 * - StoryInput - The input type for the generateStory function.
 * - StoryOutput - The return type for the generateStory function.
 */

import { z } from 'zod';
import { generateNarrative } from '@/ai/services/narrative-generator';
import { getWorldState } from '@/lib/firebase/world-state';

const StoryInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  apiKey: z.string().describe("The Gemini API key."),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

const StoryOutputSchema = z.object({
    nextPost: z.string().describe("The next post in the narrative, continuing the story."),
});
export type StoryOutput = z.infer<typeof StoryOutputSchema>;


export async function generateStory(input: StoryInput): Promise<StoryOutput> {
    try {
        console.log(`[Orchestrator] Starting story generation for campaign: ${input.campaignId}`);

        // 1. Use the DB Interaction Service to get the world state
        console.log(`[Orchestrator] Fetching world state from database...`);
        const narrativeState = await getWorldState(input.campaignId);
        console.log(`[Orchestrator] Successfully fetched world state.`);

        // 2. Use the AI Interaction Service to generate the narrative
        console.log(`[Orchestrator] Passing world state to AI service...`);
        const result = await generateNarrative({
            apiKey: input.apiKey,
            systemPrompt: input.systemPrompt,
            campaignId: input.campaignId,
            narrativeState: narrativeState,
        });
        console.log(`[Orchestrator] Received response from AI service.`);

        return result;

    } catch (error: any) {
        console.error("[Orchestrator] Error during story generation:", error);
        // Re-throw the error with a more specific message so the client can catch it
        throw new Error(`Story generation failed: ${error.message}`);
    }
}

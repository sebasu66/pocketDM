
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
import { generateNarrative, NarrativeServiceOutput } from '@/ai/services/narrative-generator';
import { getWorldState } from '@/lib/firebase/world-state';

const StoryInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  apiKey: z.string().describe("The Gemini API key."),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

export type StoryOutput = NarrativeServiceOutput;

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
    try {
        console.log(`[Orchestrator] Starting story generation for campaign: ${input.campaignId}`);

        // 1. Fetch world state
        console.log(`[Orchestrator] Fetching world state...`);
        const narrativeState = await getWorldState(input.campaignId);
        
        // 2. Generate narrative text
        console.log(`[Orchestrator] Generating narrative text...`);
        const narrativeResult = await generateNarrative({
            apiKey: input.apiKey,
            systemPrompt: input.systemPrompt,
            campaignId: input.campaignId,
            narrativeState: narrativeState,
        });
        
        return narrativeResult;

    } catch (error: any) {
        console.error("[Orchestrator] Error during story generation:", error);
        throw new Error(`Story generation failed: ${error.message}`);
    }
}

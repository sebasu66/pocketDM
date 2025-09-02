'use server';

/**
 * @fileOverview A dungeon master AI agent for generating narrative content.
 * 
 * - generateStory - A function that handles the story generation process.
 * - StoryInput - The input type for the generateStory function.
 * - StoryOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { z } from 'zod';

const getCharactersTool = ai.defineTool(
  {
    name: 'getCharacters',
    description: 'Get a list of all player characters in the current campaign. Use this to understand who is in the party.',
    inputSchema: z.object({ campaignId: z.string() }),
    outputSchema: z.any(),
  },
  async ({ campaignId }) => {
    return await getCharactersByCampaign(campaignId);
  }
);


const StoryInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  narrativeHistory: z.string().describe("The history of the narrative so far, including player actions."),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

const StoryOutputSchema = z.object({
    nextPost: z.string().describe("The next post in the narrative, continuing the story."),
});
export type StoryOutput = z.infer<typeof StoryOutputSchema>;


const storyPrompt = ai.definePrompt({
    name: 'storyPrompt',
    input: { schema: StoryInputSchema },
    output: { schema: StoryOutputSchema },
    tools: [getCharactersTool],
    prompt: `
        {{systemPrompt}}

        You have access to tools that can provide you with information about the characters in the campaign.
        Use them if you need to.

        Based on the following narrative history, write the next logical and engaging post for the story.
        Your response should be a compelling continuation of the events.

        Narrative History:
        ---
        {{narrativeHistory}}
        ---
    `,
});

const generateStoryFlow = ai.defineFlow(
    {
        name: 'generateStoryFlow',
        inputSchema: StoryInputSchema,
        outputSchema: StoryOutputSchema,
    },
    async (input) => {
        const { output } = await storyPrompt(input);
        return output!;
    }
);

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
    return await generateStoryFlow(input);
}

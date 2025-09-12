
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
import {googleAI} from '@genkit-ai/googleai';

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

// Simplified schemas for the AI prompt context
const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  class: z.string().optional(),
});

const CommentSchema = z.object({
  authorName: z.string(),
  text: z.string(),
});

const ThreadSchema = z.object({
  title: z.string(),
  content: z.string(),
  comments: z.array(CommentSchema),
});


const StoryInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  narrativeState: z.object({
      characters: z.array(CharacterSchema),
      threads: z.array(ThreadSchema),
  }).describe("The entire state of the narrative so far, including all characters and a chronological list of threads and their comments."),
  apiKey: z.string().describe("The Gemini API key."),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

const StoryOutputSchema = z.object({
    nextPost: z.string().describe("The next post in the narrative, continuing the story."),
});
export type StoryOutput = z.infer<typeof StoryOutputSchema>;


const generateStoryFlow = ai.defineFlow(
    {
        name: 'generateStoryFlow',
        inputSchema: StoryInputSchema,
        outputSchema: StoryOutputSchema,
    },
    async (input) => {
        const { campaignId, systemPrompt, narrativeState, apiKey } = input;
        
        if (!apiKey) {
            throw new Error("Gemini API key is required.");
        }

        const storyPrompt = ai.definePrompt({
            name: 'storyPrompt',
            input: { schema: StoryInputSchema },
            output: { schema: StoryOutputSchema },
            tools: [getCharactersTool],
            prompt: `
                {{systemPrompt}}

                You have access to tools that can provide you with information about the characters in the campaign.
                Use them if you need to.

                Here is the current state of the campaign (Campaign ID: {{campaignId}}).

                ## Player Characters in the party:
                {{#each narrativeState.characters}}
                - **{{this.name}} ({{this.class}}):** {{this.description}}
                {{/each}}

                ## Narrative History:
                {{#each narrativeState.threads}}
                ---
                ### GM Post: {{this.title}}
                {{{this.content}}}

                **Player Responses:**
                {{#each this.comments}}
                - **{{this.authorName}}:** {{this.text}}
                {{/each}}
                {{/each}}
                ---

                Based on this entire history, write the next logical and engaging post for the story.
                Your response should be a compelling continuation of the events.
            `,
            model: googleAI({apiKey}),
        });

        const { output } = await storyPrompt(input);
        return output!;
    }
);

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
    return await generateStoryFlow(input);
}

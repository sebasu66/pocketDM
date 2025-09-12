
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
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getNarrativeThreadsByCampaign } from '@/lib/firebase/narrative';
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

const NarrativeStateSchema = z.object({
    characters: z.array(CharacterSchema),
    threads: z.array(ThreadSchema),
});

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


const generateStoryFlow = ai.defineFlow(
    {
        name: 'generateStoryFlow',
        inputSchema: StoryInputSchema,
        outputSchema: StoryOutputSchema,
    },
    async (input) => {
      try {
        const { apiKey, campaignId, systemPrompt } = input;
        
        if (!apiKey) {
            throw new Error("Gemini API key is required.");
        }

        // --- Direct Database Access ---
        console.log(`[AI Flow] Fetching data for campaign: ${campaignId}`);
        const allCharacters = await getCharactersByCampaign(campaignId);
        const allThreads = await getNarrativeThreadsByCampaign(campaignId);

        const threadsWithComments = await Promise.all(allThreads.map(async (thread) => {
            const comments = await getCommentsByThreadId(thread.id);
            const enrichedComments = comments.map(c => ({
                authorName: c.character?.name || c.author?.name || 'Unknown',
                text: c.text,
            }));
            return {
                title: thread.title,
                content: thread.content,
                comments: enrichedComments,
            };
        }));

        const narrativeState = {
            characters: allCharacters.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                class: c.class,
            })),
            threads: threadsWithComments,
        };
        console.log('[AI Flow] Successfully constructed narrative state from database.');
        // --- End Direct Database Access ---


        const storyPrompt = ai.definePrompt({
            name: 'storyPrompt',
            input: { schema: z.object({
                campaignId: z.string(),
                systemPrompt: z.string(),
                narrativeState: NarrativeStateSchema
            }) },
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
        
        console.log("[AI Flow] Sending prompt to Gemini...");
        const { output } = await storyPrompt({
            campaignId,
            systemPrompt,
            narrativeState,
        });
        
        if (!output) {
            throw new Error("AI returned no output.");
        }
        console.log("[AI Flow] Received response from Gemini.");
        
        return output;

      } catch (error: any) {
        console.error("Error in generateStoryFlow:", error);
        // Re-throw the error so the client can catch it
        throw new Error(`AI generation failed: ${error.message}`);
      }
    }
);

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
    return await generateStoryFlow(input);
}


'use strict';

/**
 * @fileOverview This service is responsible for all direct interactions with the GenAI model.
 * It is completely decoupled from the database. It receives a structured world state
 * and returns a narrative continuation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

// Schemas defining the structure of the data the AI will work with.
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

const NarrativeServiceInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  apiKey: z.string().describe("The Gemini API key."),
  narrativeState: NarrativeStateSchema,
});
export type NarrativeServiceInput = z.infer<typeof NarrativeServiceInputSchema>;

const NarrativeServiceOutputSchema = z.object({
    nextPost: z.string().describe("The next post in the narrative, continuing the story."),
    characterFilterList: z.string().optional().describe("A comma-separated list of character IDs who should see this post. If empty or omitted, all players can see it."),
    audioUrl: z.string().optional().describe("The public URL of the generated audio file for this narrative post."),
});
export type NarrativeServiceOutput = z.infer<typeof NarrativeServiceOutputSchema>;


const generateNarrativeFlow = ai.defineFlow(
    {
        name: 'generateNarrativeFlow',
        inputSchema: NarrativeServiceInputSchema,
        outputSchema: z.object({
            nextPost: z.string(),
            characterFilterList: z.string().optional(),
        }),
    },
    async (input) => {
      try {
        const { apiKey, campaignId, systemPrompt, narrativeState } = input;
        
        if (!apiKey) {
            throw new Error("Gemini API key is required.");
        }
        
        console.log("[AI Service] Defining prompt for Gemini...");
        const storyPrompt = ai.definePrompt({
            name: 'storyPrompt',
            input: { schema: z.object({
                campaignId: z.string(),
                systemPrompt: z.string(),
                narrativeState: NarrativeStateSchema
            }) },
            output: { schema: z.object({
                nextPost: z.string().describe("The next post in the narrative, continuing the story."),
                characterFilterList: z.string().optional().describe("A comma-separated list of character IDs who should see this post. If empty or omitted, all players can see it."),
            }) },
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
                Your response should be a compelling continuation of the events. When appropriate, use the characterFilterList field to direct the narrative to specific characters.
                The post should be just the narrative text, without any titles or headers.
            `,
            model: googleAI({apiKey}),
        });
        
        console.log("[AI Service] Sending prompt to Gemini...");
        const { output } = await storyPrompt({
            campaignId,
            systemPrompt,
            narrativeState,
        });
        
        if (!output) {
            throw new Error("AI returned no output.");
        }
        console.log("[AI Service] Received response from Gemini.");
        
        return output;

      } catch (error: any) {
        console.error("[AI Service] Error during AI generation:", error);
        // Re-throw the error so the orchestrator can handle it
        throw new Error(`AI generation failed: ${error.message}`);
      }
    }
);

export async function generateNarrative(input: NarrativeServiceInput): Promise<NarrativeServiceOutput> {
    return await generateNarrativeFlow(input);
}

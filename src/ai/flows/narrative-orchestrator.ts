
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
import { generateAudio } from '@/ai/flows/tts-flow';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { admin } from '@/lib/firebase/admin-config';


const StoryInputSchema = z.object({
  campaignId: z.string().describe("The ID of the current campaign."),
  systemPrompt: z.string().describe("Instructions for the AI on how to behave."),
  apiKey: z.string().describe("The Gemini API key."),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

export type StoryOutput = NarrativeServiceOutput;

const uploadAudioToStorage = async (audioDataUri: string, campaignId: string, threadId: string): Promise<string> => {
    const bucket = getStorage(admin).bucket();
    const file = bucket.file(`campaigns/${campaignId}/narrative/${threadId}.wav`);
    
    const base64Data = audioDataUri.split(';base64,').pop();
    if (!base64Data) {
        throw new Error('Invalid audio data URI');
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    await file.save(buffer, {
        metadata: {
            contentType: 'audio/wav',
        },
    });

    // Make the file public and get the URL
    await file.makePublic();
    return file.publicUrl();
}

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
        
        // 3. Generate audio from the narrative text
        console.log(`[Orchestrator] Generating audio for narrative...`);
        const plainTextNarrative = narrativeResult.nextPost.replace(/<[^>]*>?/gm, '');
        const audioResult = await generateAudio(plainTextNarrative);

        // 4. Upload audio to Firebase Storage
        console.log(`[Orchestrator] Uploading audio to storage...`);
        const threadId = `thread-${Date.now()}`;
        const publicAudioUrl = await uploadAudioToStorage(audioResult.audioDataUri, input.campaignId, threadId);
        console.log(`[Orchestrator] Audio uploaded to ${publicAudioUrl}`);

        // 5. Combine results and return
        const finalResult: StoryOutput = {
            ...narrativeResult,
            audioUrl: publicAudioUrl,
        };

        return finalResult;

    } catch (error: any) {
        console.error("[Orchestrator] Error during story generation:", error);
        throw new Error(`Story generation failed: ${error.message}`);
    }
}

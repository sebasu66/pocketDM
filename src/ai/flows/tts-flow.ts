
'use server';

/**
 * @fileOverview A flow for generating audio from text using Text-to-Speech.
 *
 * - generateAudio - A function that converts text to a WAV audio data URI.
 * - AudioInputSchema - The input type for the generateAudio function.
 * - AudioOutputSchema - The return type for the generateAudio function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

export const AudioInputSchema = z.string().describe("The text to be converted to speech.");
export type AudioInput = z.infer<typeof AudioInputSchema>;

export const AudioOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type AudioOutput = z.infer<typeof AudioOutputSchema>;


async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: AudioInputSchema,
    outputSchema: AudioOutputSchema,
  },
  async (text) => {
    console.log('[TTS Flow] Starting audio generation.');
    
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }
    console.log('[TTS Flow] Received audio data from model.');

    // The media.url is a base64 encoded string of raw PCM data, we need to convert it to a WAV data URI
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);
    console.log('[TTS Flow] Converted PCM data to WAV format.');

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);


export async function generateAudio(text: AudioInput): Promise<AudioOutput> {
  return await textToSpeechFlow(text);
}

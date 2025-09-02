
import { NextResponse } from 'next/server';
import { getNarrativeThreadsByCampaign } from '@/lib/firebase/narrative';
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';
import { EnrichedThread, Character } from '@/lib/firebase/types';

export async function GET(
  request: Request,
  { params }: { params: { campaignId: string } }
) {
  const { campaignId } = params;

  if (!campaignId) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  try {
    // This is a simplified version for an external API.
    // In a real app, you'd add authentication/authorization here.
    
    const [threads, characters] = await Promise.all([
      getNarrativeThreadsByCampaign(campaignId),
      getCharactersByCampaign(campaignId)
    ]);
    
    const charactersById = characters.reduce((acc, char) => {
        acc[char.id] = char;
        return acc;
    }, {} as Record<string, Character>);

    const enrichedThreads = await Promise.all(
      threads.map(async (thread) => {
        const comments = await getCommentsByThreadId(thread.id);
        const enrichedComments = comments.map(comment => ({
            ...comment,
            character: comment.characterId ? charactersById[comment.characterId] : null
        }));

        return { ...thread, comments: enrichedComments };
      })
    );

    return NextResponse.json(enrichedThreads);

  } catch (error: any) {
    console.error(`Failed to fetch narrative for campaign ${campaignId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch narrative data', details: error.message }, { status: 500 });
  }
}


// /src/app/api/narrative/[campaignId]/route.ts

import { NextResponse } from 'next/server';
import { getNarrativeThreadsByCampaign } from '@/lib/firebase/narrative';
import { getCommentsByThreadId } from '@/lib/firebase/comments';
import { getCharactersByCampaign } from '@/lib/firebase/characters';

// GET all narrative data for a campaign
export async function GET(request: Request, { params }: { params: { campaignId: string } }) {
  try {
    const campaignId = params.campaignId;
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    const [threadsFromDb, charactersFromDb] = await Promise.all([
      getNarrativeThreadsByCampaign(campaignId),
      getCharactersByCampaign(campaignId)
    ]);
    
    const activePlayers = charactersFromDb.filter(c => c.isActive);

    const enrichedThreads = await Promise.all(
      threadsFromDb.map(async (thread) => {
        const threadComments = await getCommentsByThreadId(thread.id);
        const enrichedComments = await Promise.all(
          threadComments.map(async (comment) => {
            const character = charactersFromDb.find(c => c.id === comment.characterId);
            return { ...comment, character: character || null };
          })
        );
        return { ...thread, comments: enrichedComments };
      })
    );

    return NextResponse.json({
        threads: enrichedThreads,
        characters: charactersFromDb,
        activePlayers: activePlayers
    });

  } catch (error: any) {
    console.error(`[API_NARRATIVE_GET] ${error.message}`);
    return NextResponse.json({ error: 'Failed to fetch narrative data' }, { status: 500 });
  }
}


// /src/app/api/characters/route.ts
import { NextResponse } from 'next/server';
import { getCharactersByCampaign } from '@/lib/firebase/characters';

// GET all characters for a campaign
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');
  const userId = searchParams.get('userId');

  if (!campaignId) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  try {
    const characters = await getCharactersByCampaign(campaignId, userId || undefined);
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}


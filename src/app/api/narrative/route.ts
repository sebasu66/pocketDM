
// /src/app/api/narrative/route.ts
import { NextResponse } from 'next/server';
import { addNarrativeThread } from '@/lib/firebase/narrative';

// CREATE a new narrative thread
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const threadId = await addNarrativeThread(body);
    return NextResponse.json({ id: threadId, message: 'Narrative thread created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create narrative thread' }, { status: 500 });
  }
}


// /src/app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { addNarrativeComment } from '@/lib/firebase/comments';

// CREATE a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const commentId = await addNarrativeComment(body);
    return NextResponse.json({ id: commentId, message: 'Comment created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

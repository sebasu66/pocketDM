
// /src/app/api/characters/[id]/route.ts
import { NextResponse } from 'next/server';
import { getCharacter, updateCharacter, deleteCharacter } from '@/lib/firebase/characters';

// GET a single character
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const character = await getCharacter(id);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
  }
}

// UPDATE a character
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    await updateCharacter(id, body);
    return NextResponse.json({ message: 'Character updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update character' }, { status: 500 });
  }
}

// DELETE a character
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteCharacter(id);
    return NextResponse.json({ message: 'Character deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete character' }, { status: 500 });
  }
}

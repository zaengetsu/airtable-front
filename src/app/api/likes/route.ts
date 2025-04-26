import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Airtable } from '@/lib/airtable';

const airtable = new Airtable();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { projectId, userId } = await request.json();
    if (!projectId || !userId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const like = await airtable.toggleLike(projectId, userId);
    return NextResponse.json(like);
  } catch (error) {
    console.error('Erreur lors de la gestion du like:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la gestion du like' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    if (!projectId || !userId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const hasLiked = await airtable.hasUserLiked(projectId, userId);
    return NextResponse.json({ hasLiked });
  } catch (error) {
    console.error('Erreur lors de la vérification du like:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du like' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { likeProject } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const result = await likeProject(projectId);
    return NextResponse.json(result);
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

    if (!projectId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const project = await fetchProjectById(projectId);
    return NextResponse.json({ hasLiked: project.likes > 0 });
  } catch (error) {
    console.error('Erreur lors de la vérification du like:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du like' },
      { status: 500 }
    );
  }
} 
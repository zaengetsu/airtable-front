import { NextResponse } from 'next/server';
import { AirtableService } from '@/lib/airtable';

const airtable = new AirtableService();

export async function POST(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // TODO: Récupérer l'ID de l'utilisateur à partir du token
    const userId = 'user-id-from-token';
    const { liked } = await airtable.toggleLike(params.projectID, userId);
    return NextResponse.json({ liked });
  } catch (error) {
    console.error('Erreur lors de la gestion du like:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
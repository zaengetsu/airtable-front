import { NextResponse } from 'next/server';
import { AirtableService } from '@/lib/airtable';

const airtable = new AirtableService();

export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const project = await airtable.getProjectById(params.projectID);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    // TODO: Implémenter la mise à jour du projet dans Airtable
    return NextResponse.json({ message: 'Projet mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // TODO: Implémenter la suppression du projet dans Airtable
    return NextResponse.json({ message: 'Projet supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
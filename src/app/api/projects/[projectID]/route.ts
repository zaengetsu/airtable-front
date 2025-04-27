import { NextResponse } from 'next/server';
import { fetchProjectById, updateProject, deleteProject } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const project = await fetchProjectById(params.projectID);
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
    const updatedProject = await updateProject(params.projectID, body);
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du projet' }, { status: 500 });
    }

    return NextResponse.json(updatedProject);
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

    await deleteProject(params.projectID);
    return NextResponse.json({ message: 'Projet supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
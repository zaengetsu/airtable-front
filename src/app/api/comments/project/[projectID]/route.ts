import { NextResponse } from 'next/server';
import { AirtableService } from '@/lib/airtable';

const airtable = new AirtableService();

export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const comments = await airtable.getCommentsByProject(params.projectID);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
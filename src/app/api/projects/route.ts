import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${API_URL}/api/projects`);
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Données reçues:', body);

    // Récupérer le token du header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Validation des champs requis
    if (!body.name || !body.description || !body.category || !body.promotion) {
      return NextResponse.json(
        { error: 'Les champs name, description, category et promotion sont requis' },
        { status: 400 }
      );
    }

    // Formatage des dates
    const formattedBody = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: body.endDate ? new Date(body.endDate).toISOString().split('T')[0] : null,
      isHidden: body.isHidden || false,
      likes: 0
    };

    console.log('Données formatées:', formattedBody);

    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(formattedBody)
    });

    console.log('Réponse du serveur:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur du serveur:', error);
      return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Données retournées:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
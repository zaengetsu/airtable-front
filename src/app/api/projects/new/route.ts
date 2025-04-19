import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Afficher tous les headers reçus
    console.log('Tous les headers reçus:', Object.fromEntries(request.headers.entries()));
    
    // Récupérer le token de l'en-tête Authorization
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header reçu:', authHeader);
    
    if (!authHeader) {
      console.log('Token manquant dans les headers');
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Vérifier le format du token
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Format de token invalide:', authHeader);
      return NextResponse.json({ error: 'Format de token invalide' }, { status: 401 });
    }

    // Transmettre la requête au backend avec les mêmes headers
    console.log('Envoi de la requête au backend avec le header:', authHeader);
    const response = await fetch('http://localhost:4000/api/projects/new', {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log('Réponse du backend:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur du backend:', error);
      return NextResponse.json({ error: error.error || 'Erreur lors du chargement des données' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
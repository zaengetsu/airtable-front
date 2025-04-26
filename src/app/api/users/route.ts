import { NextResponse } from 'next/server';
import { airtableService } from '@/lib/airtable';

export async function GET() {
  try {
    const users = await airtableService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
} 
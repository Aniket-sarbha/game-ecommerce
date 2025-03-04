import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// For App Router
export async function GET() {
  try {
    const games = await prisma.Game.findMany({
      select: {
        gameId: true,
        gameName: true,
      },
      orderBy: {
        gameId: 'asc',
      },
    });
    
    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
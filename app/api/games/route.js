import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// For App Router
export async function GET(request) {
  try {
    // Get the URL search params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '6');
    
    // Calculate skip value
    const skip = (page - 1) * pageSize;
    
    // Get paginated games
    const games = await prisma.game.findMany({
      select: {
        gameId: true,
        gameName: true,
      },
      orderBy: {
        gameId: 'asc',
      },
      skip: skip,
      take: pageSize,
    });
    
    // Get total count for pagination
    const totalGames = await prisma.game.count();
    const totalPages = Math.ceil(totalGames / pageSize);
    
    return NextResponse.json({ 
      games, 
      pagination: {
        totalGames,
        totalPages,
        currentPage: page,
        pageSize
      }
    }, { status: 200 });
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
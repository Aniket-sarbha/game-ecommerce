import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient to avoid multiple connections
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure we don't create multiple instances during development hot reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Set Cache-Control headers
const setCacheHeaders = (response) => {
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
};

// For App Router
export async function GET(request) {
  try {
    // Get the URL search params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '6');
    
    // Calculate skip value
    const skip = (page - 1) * pageSize;
    
    // Run both queries in parallel with Promise.all
    const [games, totalGames] = await Promise.all([
      prisma.game.findMany({
        select: {
          gameId: true,
          gameName: true,
        },
        orderBy: {
          gameId: 'asc',
        },
        skip: skip,
        take: pageSize,
      }),
      prisma.game.count()
    ]);
    
    const totalPages = Math.ceil(totalGames / pageSize);
    
    const response = NextResponse.json({ 
      games, 
      pagination: {
        totalGames,
        totalPages,
        currentPage: page,
        pageSize
      }
    }, { status: 200 });
    
    // Add caching headers
    return setCacheHeaders(response);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
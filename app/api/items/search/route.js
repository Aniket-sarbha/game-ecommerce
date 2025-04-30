import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  try {
    const skip = (page - 1) * limit;
    
    const items = await prisma.storeItem.findMany({
      where: {
        isActive: true,
        store: {
          isActive: true
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            productId: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      skip,
      take: limit
    });
    
    const totalItems = await prisma.storeItem.count({
      where: {
        isActive: true,
        store: {
          isActive: true
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            productId: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
    
    return NextResponse.json({
      items,
      pagination: {
        total: totalItems,
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit)
      }
    });
  } catch (error) {
    console.error('Failed to search items:', error);
    return NextResponse.json(
      { error: 'Failed to search items' },
      { status: 500 }
    );
  }
}
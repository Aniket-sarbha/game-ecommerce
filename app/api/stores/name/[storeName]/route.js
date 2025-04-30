import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { storeName } = params;
  
  try {
    // Find store by name
    const store = await prisma.store.findUnique({
      where: {
        name: storeName,
        isActive: true
      },
      include: {
        storeItems: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            productId: true,
            name: true,
            price: true,
            mrp: true,
            image: true
          }
        }
      }
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or inactive' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(store);
  } catch (error) {
    console.error(`Failed to fetch store ${storeName}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch store information' },
      { status: 500 }
    );
  }
}
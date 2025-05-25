import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = params;
  
  try {    // First find the store by slug (name)
    const store = await prisma.store.findUnique({
      where: {
        name: slug,
        isActive: false
      },
      select: {
        id: true
      }
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or inactive' },
        { status: 404 }
      );
    }
    
    // Get store items using the store ID
    const storeItems = await prisma.storeItem.findMany({
      where: {
        storeId: store.id,
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
    });
    
    return NextResponse.json(storeItems);
  } catch (error) {
    console.error(`Failed to fetch items for store ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch store items' },
      { status: 500 }
    );
  }
}

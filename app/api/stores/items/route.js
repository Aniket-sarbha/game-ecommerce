import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { storeId } = params;
  
  try {
    // Validate storeId is a number
    const id = parseInt(storeId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid store ID' },
        { status: 400 }
      );
    }
    
    // Check if store exists and is active
    const store = await prisma.store.findUnique({
      where: {
        id,
        isActive: true
      }
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or inactive' },
        { status: 404 }
      );
    }
    
    // Get store items
    const storeItems = await prisma.storeItem.findMany({
      where: {
        storeId: id,
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
    console.error(`Failed to fetch items for store ${storeId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch store items' },
      { status: 500 }
    );
  }
}
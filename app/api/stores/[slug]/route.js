// app/api/stores/[slug]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = await params;
  
  try {
    const store = await prisma.store.findUnique({
      where: {
        name: slug
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        image: true,
        backgroundImage: true,
        description: true,
        userId: true,      
        serverId: true,    
        server: true,      
        storeItems: {
          where: {
            isActive: true  // Only fetch active items
          },
          select: {
            id: true,
            productId: true,
            name: true,
            price: true,
            mrp: true,
            image: true
          }
        },
        sellerOffers: {
          where: {
            isActive: true // Only fetch active offers
          },
          select: {
            id: true,
            price: true,
            description: true,
            sellerId: true,
            seller: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(store);
  } catch (error) {
    console.error('Failed to fetch store by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}
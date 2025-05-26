// app/api/seller-offers/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAdmin } from '@/lib/roles';

// GET - Get all seller offers for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role or higher
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { message: 'Access denied. Admin role required to manage seller offers.' },
        { status: 403 }
      );
    }
    
    const sellerOffers = await prisma.sellerOffer.findMany({
      where: {
        sellerId: session.user.id
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(sellerOffers);
  } catch (error) {
    console.error('Failed to fetch seller offers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch seller offers' },
      { status: 500 }
    );
  }
}  // POST - Create a new seller offer
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role or higher
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { message: 'Access denied. Admin role required to create seller offers.' },
        { status: 403 }
      );
    }
      const body = await request.json();
    const { storeId, storeItemId, price, description } = body;
    
    // Validate required fields
    if (!storeId || isNaN(parseInt(storeId))) {
      return NextResponse.json(
        { message: 'Store ID is required and must be a number' },
        { status: 400 }
      );
    }
    
    if (!storeItemId || isNaN(parseInt(storeItemId))) {
      return NextResponse.json(
        { message: 'Store Item ID is required and must be a number' },
        { status: 400 }
      );
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { message: 'Price is required and must be a positive number' },
        { status: 400 }
      );
    }
    
    // Check if the store exists
    const store = await prisma.store.findUnique({
      where: { id: parseInt(storeId) }
    });
    
    if (!store) {
      return NextResponse.json(
        { message: 'Store not found' },
        { status: 404 }
      );
    }
    
    // Check if an offer from this seller for this store already exists
    const existingOffer = await prisma.sellerOffer.findFirst({
      where: {
        sellerId: session.user.id,
        storeId: parseInt(storeId)
      }
    });
    
    if (existingOffer) {
      return NextResponse.json(
        { message: 'You already have an offer for this store. Please edit the existing offer instead.' },
        { status: 400 }
      );
    }      // Get store item info
    const storeItem = await prisma.storeItem.findUnique({
      where: { id: parseInt(storeItemId) }
    });
    
    if (!storeItem) {
      return NextResponse.json(
        { message: 'Store item not found' },
        { status: 404 }
      );
    }
    
    // Create the new offer
    const newOffer = await prisma.sellerOffer.create({
      data: {
        sellerId: session.user.id,
        storeId: parseInt(storeId),
        storeItemId: parseInt(storeItemId),
        price: parseFloat(price),
        mrp: storeItem.mrp,
        currency: "INR",
        description: description || null,
        isActive: true
      }
    });
    
    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Failed to create seller offer:', error);
    return NextResponse.json(
      { message: 'Failed to create seller offer' },
      { status: 500 }
    );
  }
}

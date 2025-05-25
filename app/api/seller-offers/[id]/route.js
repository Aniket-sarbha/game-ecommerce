// app/api/seller-offers/[id]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET a single seller offer by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const sellerOffer = await prisma.sellerOffer.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    if (!sellerOffer) {
      return NextResponse.json(
        { message: 'Seller offer not found' },
        { status: 404 }
      );
    }
      // Only allow the seller who created the offer to view it
    if (sellerOffer.sellerId !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to view this offer' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(sellerOffer);
  } catch (error) {
    console.error('Failed to fetch seller offer:', error);
    return NextResponse.json(
      { message: 'Failed to fetch seller offer' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing seller offer
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find the offer
    const existingOffer = await prisma.sellerOffer.findUnique({
      where: { id }
    });
    
    if (!existingOffer) {
      return NextResponse.json(
        { message: 'Seller offer not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the seller who created the offer
    if (existingOffer.sellerId !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to update this offer' },
        { status: 403 }
      );
    }
      const body = await request.json();
    const { price, mrp, currency, description, isActive } = body;
    
    // Validate price
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
      return NextResponse.json(
        { message: 'Price must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate MRP
    if (mrp !== undefined && (isNaN(parseFloat(mrp)) || parseFloat(mrp) <= 0)) {
      return NextResponse.json(
        { message: 'MRP must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate price <= mrp
    if (price !== undefined && mrp !== undefined && parseFloat(price) > parseFloat(mrp)) {
      return NextResponse.json(
        { message: 'Price cannot be greater than MRP' },
        { status: 400 }
      );
    }
    
    // Validate currency
    if (currency !== undefined) {
      const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
      if (!validCurrencies.includes(currency)) {
        return NextResponse.json(
          { message: 'Valid currency is required' },
          { status: 400 }
        );
      }
    }
      // Update the offer
    const updatedOffer = await prisma.sellerOffer.update({
      where: { id },
      data: {
        price: price !== undefined ? parseFloat(price) : undefined,
        mrp: mrp !== undefined ? parseFloat(mrp) : undefined,
        currency: currency !== undefined ? currency : undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    });
    
    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error('Failed to update seller offer:', error);
    return NextResponse.json(
      { message: 'Failed to update seller offer' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a seller offer
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find the offer
    const existingOffer = await prisma.sellerOffer.findUnique({
      where: { id }
    });
    
    if (!existingOffer) {
      return NextResponse.json(
        { message: 'Seller offer not found' },
        { status: 404 }
      );
    }
      // Check if the user is the seller who created the offer
    if (existingOffer.sellerId !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this offer' },
        { status: 403 }
      );
    }
    
    // Delete the offer
    await prisma.sellerOffer.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Seller offer deleted successfully' });
  } catch (error) {
    console.error('Failed to delete seller offer:', error);
    return NextResponse.json(
      { message: 'Failed to delete seller offer' },
      { status: 500 }
    );
  }
}

// app/api/stores/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {    const stores = await prisma.store.findMany({
      where: {
        isActive: false
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        image: true,
        userId: true,
        serverId: true,
        server: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
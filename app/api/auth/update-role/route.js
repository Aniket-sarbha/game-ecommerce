// app/api/auth/update-role/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Get the current user from the session
    const session = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If no active session or user, return unauthorized
    if (!session || !session.sub) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Parse request body
    const { role } = await request.json();
    
    // Validate input
    if (!role || !['buyer', 'seller'].includes(role)) {
      return NextResponse.json({
        success: false,
        message: "Valid role (buyer or seller) is required"
      }, { status: 400 });
    }

    // Update user role in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.sub },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update role" 
    }, { status: 500 });
  }
}

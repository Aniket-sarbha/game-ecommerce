// app/api/auth/change-password/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { hash, compare } from 'bcrypt';
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
    const { currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "Current password and new password are required"
      }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        message: "New password must be at least 8 characters long"
      }, { status: 400 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { password: true }
    });

    if (!user || !user.password) {
      return NextResponse.json({
        success: false,
        message: "User not found or user was registered through OAuth"
      }, { status: 400 });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Current password is incorrect"
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update the password
    await prisma.user.update({
      where: { id: session.sub },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });
    
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}
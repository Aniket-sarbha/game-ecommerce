// app/api/admin/users/[id]/role/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateUserRole, USER_ROLES } from '@/lib/roles';

export async function PUT(request, { params }) {
  try {
    // Get the current user from the session
    const session = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Check if user is authenticated
    if (!session || !session.sub) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Parse request body
    const { role } = await request.json();
    
    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      return NextResponse.json({
        success: false,
        message: "Invalid role specified"
      }, { status: 400 });
    }

    // Update user role
    const updatedUser = await updateUserRole(params.id, role, session.sub);

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    
    if (error.message.includes('Only superadmins') || error.message.includes('Cannot change role')) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 403 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to update user role"
    }, { status: 500 });
  }
}

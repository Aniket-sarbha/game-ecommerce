// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAllUsersWithRoles, isSuperAdmin } from '@/lib/roles';

export async function GET(request) {
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

    // Check if user is superadmin
    const userIsSuperAdmin = await isSuperAdmin(session.sub);
    if (!userIsSuperAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Access denied. Superadmin role required." 
      }, { status: 403 });
    }

    // Get all users with their roles
    const users = await getAllUsersWithRoles(session.sub);

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch users"
    }, { status: 500 });
  }
}

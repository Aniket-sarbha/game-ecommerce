// app/api/auth/refresh-session/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserByEmail } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get fresh user data from database
    const dbUser = await getUserByEmail(session.user.email);
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      role: dbUser.role,
      message: 'Session refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing session:', error);
    return NextResponse.json({ error: 'Failed to refresh session' }, { status: 500 });
  }
}

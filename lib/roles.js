// lib/roles.js
import prisma from './prisma';

// Role constants
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN'
};

// Check if user has specific role
export async function hasRole(userId, role) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

// Check if user is admin or higher
export async function isAdmin(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPERADMIN;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

// Check if user is superadmin
export async function isSuperAdmin(userId) {
  return await hasRole(userId, USER_ROLES.SUPERADMIN);
}

// Get user with role
export async function getUserWithRole(userId) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  } catch (error) {
    console.error('Error getting user with role:', error);
    return null;
  }
}

// Update user role (only superadmins can do this)
export async function updateUserRole(targetUserId, newRole, requestingUserId) {
  try {
    // Check if requesting user is superadmin
    const isSuperAdminUser = await isSuperAdmin(requestingUserId);
    if (!isSuperAdminUser) {
      throw new Error('Only superadmins can change user roles');
    }

    // Prevent changing role of another superadmin
    const targetUser = await getUserWithRole(targetUserId);
    if (targetUser?.role === USER_ROLES.SUPERADMIN && targetUserId !== requestingUserId) {
      throw new Error('Cannot change role of another superadmin');
    }

    // Update the role
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Get all users with their roles (superadmin only)
export async function getAllUsersWithRoles(requestingUserId) {
  try {
    const isSuperAdminUser = await isSuperAdmin(requestingUserId);
    if (!isSuperAdminUser) {
      throw new Error('Only superadmins can view all users');
    }

    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            sellerOffers: true
          }
        }
      },
      orderBy: [
        { role: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  } catch (error) {
    console.error('Error getting all users with roles:', error);
    throw error;
  }
}

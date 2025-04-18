import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // Get the current user session using getToken instead of getServerSession
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // If no active session or user, return unauthorized
  if (!session || !session.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch orders for the current user, using session.sub as the userId
    const orders = await prisma.order.findMany({
      where: {
        userId: session.sub // Using sub claim which contains the user ID
      },
      include: {
        store: {
          select: {
            name: true,
            image: true
          }
        },
        orderItems: {
          include: {
            storeItem: {
              select: {
                name: true,
                image: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}
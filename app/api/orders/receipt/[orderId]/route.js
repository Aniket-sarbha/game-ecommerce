import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  // Get the current user session using getToken instead of getServerSession
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  const { orderId } = params;

  // If no active session or user, return unauthorized
  if (!session || !session.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the specific order, ensuring it belongs to the current user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
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
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate receipt data
    const receiptData = {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      customerName: order.user.name || "Customer",
      customerEmail: order.user.email,
      storeName: order.store.name,
      items: order.orderItems.map(item => ({
        name: item.storeItem.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        subtotal: parseFloat(item.price) * item.quantity
      })),
      totalAmount: parseFloat(order.totalAmount),
      paymentMethod: order.paymentMethod,
      status: order.status
    };

    return NextResponse.json({ receipt: receiptData }, { status: 200 });
  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt" },
      { status: 500 }
    );
  }
}
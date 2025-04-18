import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    // Get the request body with order data
    const orderData = await request.json();
    
    // Get user session
    const session = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Check if user is authenticated
    if (!session || !session.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.sub;
    
    // Create a new order record
    const order = await prisma.order.create({
      data: {
        userId: userId,
        storeId: orderData.storeId,
        totalAmount: orderData.amount,
        status: "completed",
        paymentMethod: "upi",
        orderNumber: orderData.transactionId,
        orderItems: {
          create: [
            {
              storeItemId: orderData.itemId || 1, // Default to 1 if not provided
              quantity: 1,
              price: orderData.amount
            }
          ]
        }
      },
      include: {
        orderItems: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Order created successfully", 
      orderId: order.id 
    });
    
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
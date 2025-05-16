import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function POST(request) {  try {
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
    
    // Find the store item by productId instead of using the ID directly
    const storeItem = await prisma.storeItem.findFirst({
      where: {
        productId: orderData.productId
      }
    });
    
    if (!storeItem) {
      return NextResponse.json({ 
        error: "Product not found", 
        details: `No product with productId: ${orderData.productId}`
      }, { status: 404 });
    }
    
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
              storeItemId: storeItem.id, // Use the database ID for the relation
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
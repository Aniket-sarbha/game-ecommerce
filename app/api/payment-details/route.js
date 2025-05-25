// app/api/payment-details/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // Get transaction ID from query params
    const { searchParams } = new URL(request.url);
    const txnId = searchParams.get('txnId');
    
    if (!txnId) {
      return NextResponse.json(
        { success: false, error: "Missing transaction ID" },
        { status: 400 }
      );
    }
    
    console.log("API: Fetching payment details for transaction:", txnId);

    // Fetch payment details from your payment gateway
    try {
      const response = await axios.get(
        `https://gateway.mobalegends.in/api/payments/status/${txnId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.UNIFYPAY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API: Payment gateway response:", response.data);
      
      // Extract store ID from pInfo
      const storeId = response.data.pInfo ? parseInt(response.data.pInfo.replace(/Order for Store (\d+).*/, '$1')) : null;
      
      // Check if this was a seller offer
      const isSellerOffer = response.data.pInfo ? response.data.pInfo.includes('(Seller Offer)') : false;
      
      // Get seller offer ID from udf3 if available
      const sellerOfferId = isSellerOffer ? response.data.udf3 : null;
      
      // Get store name from the database
      let storeName = null;
      if (storeId) {
        const store = await prisma.store.findUnique({
          where: { id: storeId },
          select: { name: true }
        });
        storeName = store?.name;
      }

      if (!storeName) {
        console.warn("API: Store not found for ID:", storeId);
      }

      // Return formatted payment details      
      return NextResponse.json({
        success: true,
        data: {
          transactionId: response.data.transactionId || txnId,
          amount: response.data.amount,
          userId: response.data.udf1 || response.data.customerName,
          upiId: response.data.upiId,
          storeId: storeId,
          storeName: storeName,
          productId: response.data.productId,
          serverId: response.data.udf2,
          sellerOfferId: sellerOfferId,
          isSellerOffer: isSellerOffer,
          promoCode: isSellerOffer ? null : response.data.udf3,
          status: response.data.status,
          paymentDate: response.data.paymentDate || new Date().toISOString(),
        },
      });
      
    } catch (gatewayError) {
      console.error("API: Payment gateway error:", gatewayError.message);
      console.error(
        "API: Payment gateway response:",
        gatewayError.response?.data
      );

      // Return error response when gateway call fails
      return NextResponse.json(
        {
          success: false,
          error: "Payment gateway error: " + (gatewayError.response?.data || gatewayError.message),
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("API: General error:", error.message);
    console.error("API: Error stack:", error.stack);

    return NextResponse.json(
      {
        success: false,
        error: "Server error: " + error.message,
      },
      { status: 500 }
    );
  }
}
// app/api/payment-details/route.js
import { NextResponse } from "next/server";
import axios from "axios";

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
    // Replace with your actual payment gateway API call
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
      
      // Return formatted payment details
      return NextResponse.json({
        success: true,
        data: {
          transactionId: response.data.transactionId || txnId,
          amount: response.data.amount,
          userId: response.data.udf1 || response.data.customerName,
          upiId: response.data.upiId,
          storeId: response.data.pInfo ? response.data.pInfo.replace('Order for Store ', '') : null,
          serverId: response.data.udf2,
          promoCode: response.data.udf3,
          status: response.data.status,
          paymentDate: response.data.paymentDate || new Date().toISOString(),
          // Include any other relevant fields
        },
      });
      
    } catch (gatewayError) {
      console.error("API: Payment gateway error:", gatewayError.message);
      console.error(
        "API: Payment gateway response:",
        gatewayError.response?.data
      );

      // If API call fails, use data from the database or any other fallback
      // For demonstration, we're using mock data
      
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
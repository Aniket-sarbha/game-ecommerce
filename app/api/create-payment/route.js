import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {

  try {
    console.log("API: Payment request received");
    const body = await request.json();    // Extract request data
    const {
      amount,
      upiId,
      transactionId,
      userId,
      serverId,
      server,
      promoCode,
      storeId,
      storeName,
      productId  
    } = body;    console.log("API: Request data:", {
      amount,
      upiId,
      transactionId,
      userId,
      serverId,
      server,
      promoCode,
      storeId,
      storeName,
      productId
    });

    // Validate required fields
    if (!amount || !upiId || !transactionId || !storeId) {
      console.error("API: Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 0) {
      console.error("API: Amount too low");
      return NextResponse.json(
        { success: false, error: "Amount must be at least 1 INR" },
        { status: 400 }
      );
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      console.error("API: Invalid UPI ID format");
      return NextResponse.json(
        { success: false, error: "Invalid UPI ID format" },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!process.env.UNIFYPAY_API_KEY) {
      console.error("API: Missing UNIFYPAY_API_KEY environment variable");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing API key",
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("API: Missing NEXT_PUBLIC_BASE_URL environment variable");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing base URL",
        },
        { status: 500 }
      );
    }    const paymentData = {
      apiKey: process.env.UNIFYPAY_API_KEY,
      amount: parseFloat(amount),
      merchantName: process.env.MERCHANT_NAME ,
      upiId: upiId,
      client_txn_id: transactionId,
      customerName: userId || "Guest User",
      customerEmail: "", // Optional
      customerMobile: "", // Optional
      storeName: storeName,
      storeId: storeId,
      productId: productId,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback?storeId=${storeId}&productId=${productId}&storeName=${storeName}`,
      pInfo: `Order for Store ${storeId}`,
      udf1: userId || "",
      udf2: serverId || server || "",
      udf3: promoCode || "",
    };

    console.log("API: Sending request to payment gateway with data:", {
      ...paymentData,
      apiKey: "[REDACTED]", // Don't log the actual API key
    });    // Create payment using the payment gateway API
    try {
      const response = await axios.post(
        "https://gateway.mobalegends.in/api/payments/create",
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API: Payment gateway response:", response.data);

      // Check the correct path for paymentUrl
      if (!response.data.data?.paymentUrl) {
        console.error(
          "API: Payment gateway response missing paymentUrl:",
          response.data
        );
        return NextResponse.json(
          { success: false, error: "Invalid response from payment gateway" },
          { status: 500 }
        );
      }      // Return payment URL to client - make sure to use the correct path
      return NextResponse.json({
        success: true,
        data: {
          transactionId: transactionId,
          paymentUrl: response.data.data.paymentUrl,
        },
      });

    } catch (gatewayError) {
      console.error("API: Payment gateway error:", gatewayError.message);
      console.error(
        "API: Payment gateway response:",
        gatewayError.response?.data
      );

      return NextResponse.json(
        {
          success: false,
          error:
            gatewayError.response?.data?.message ||
            "Payment gateway error: " + gatewayError.message,
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
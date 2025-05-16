// app/api/external-order/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    // Get the request body with order data
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.pack || !orderData.usesrid || !orderData.server || !orderData.trxid) {
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          details: "Required fields: pack, usesrid, server, trxid" 
        }, 
        { status: 400 }
      );
    }

    console.log("Processing external order with data:", orderData);
    
    try {
      // Make call to external API
      const response = await axios.post(
        "https://smallpack.auraofficialstore.com:5000/api-yok",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("External API response:", response.data);

      // Return the response from the external API
      return NextResponse.json(response.data);
      
    } catch (apiError) {
      console.error("External API error:", apiError.message);
      console.error(
        "External API response:",
        apiError.response?.data
      );

      return NextResponse.json(
        {
          error: "External API error",
          details: apiError.response?.data || apiError.message
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Server error:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Server error",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// File: app/api/generate-receipt/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
    fontSize: 9,
  },
  widthItem: {
    width: '40%',
  },
  widthQty: {
    width: '15%',
  },
  widthPrice: {
    width: '20%',
  },
  widthAmount: {
    width: '25%',
  },
  footer: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 20,
  },
});

// Create Receipt Document Component with proper null checking
const ReceiptDocument = ({ transactionData = {} }) => (
  <Document title={`Receipt - ${transactionData.transactionId || 'Unknown'}`}>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>PAYMENT RECEIPT</Text>
      
      {/* Merchant Info */}
      <View style={styles.section}>
        <Text style={styles.header}>From:</Text>
        <Text style={styles.text}>{transactionData.merchantName || 'Moba Legends'}</Text>
      </View>
      
      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.header}>To:</Text>
        <Text style={styles.text}>User ID: {transactionData.userId || 'N/A'}</Text>
        {transactionData.customerEmail && (
          <Text style={styles.text}>Email: {transactionData.customerEmail}</Text>
        )}
        {transactionData.customerMobile && (
          <Text style={styles.text}>Mobile: {transactionData.customerMobile}</Text>
        )}
      </View>
      
      {/* Transaction Details */}
      <View style={styles.section}>
        <Text style={styles.header}>Payment Details:</Text>
        <Text style={styles.text}>Transaction ID: {transactionData.transactionId || 'Unknown'}</Text>
        <Text style={styles.text}>Gateway Transaction ID: {transactionData.gatewayTxnId || 'N/A'}</Text>
        <Text style={styles.text}>Date: {new Date().toLocaleString()}</Text>
        <Text style={styles.text}>Payment Method: UPI</Text>
        <Text style={styles.text}>UPI ID: {transactionData.upiId || 'N/A'}</Text>
        <Text style={styles.text}>Status: {(transactionData.status || 'COMPLETED').toUpperCase()}</Text>
      </View>
      
      {/* Game Details */}
      <View style={styles.section}>
        <Text style={styles.header}>Game Details:</Text>
        <Text style={styles.text}>Server ID: {transactionData.serverId || 'N/A'}</Text>
        <Text style={styles.text}>Server: {transactionData.server || 'N/A'}</Text>
        <Text style={styles.text}>Store ID: {transactionData.storeId || 'N/A'}</Text>
        <Text style={styles.text}>Promo Code: {transactionData.promoCode || 'N/A'}</Text>
        <Text style={styles.text}>Description: {transactionData.pInfo || 'Game Purchase'}</Text>
      </View>
      
      {/* Items Table */}
      <View style={styles.section}>
        <Text style={styles.header}>Order Summary:</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.widthItem]}>Item</Text>
            <Text style={[styles.tableCell, styles.widthQty]}>Qty</Text>
            <Text style={[styles.tableCell, styles.widthPrice]}>Price</Text>
            <Text style={[styles.tableCell, styles.widthAmount]}>Amount</Text>
          </View>
          
          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.widthItem]}>
              {transactionData.pInfo || `Game Credits (Store ${transactionData.storeId || 'N/A'})`}
            </Text>
            <Text style={[styles.tableCell, styles.widthQty]}>1</Text>
            <Text style={[styles.tableCell, styles.widthPrice]}>INR {transactionData.amount || '0'}</Text>
            <Text style={[styles.tableCell, styles.widthAmount]}>INR {transactionData.amount || '0'}</Text>
          </View>
          
          {/* Total Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.widthItem, styles.tableHeader]}></Text>
            <Text style={[styles.tableCell, styles.widthQty, styles.tableHeader]}></Text>
            <Text style={[styles.tableCell, styles.widthPrice, styles.tableHeader]}>Total:</Text>
            <Text style={[styles.tableCell, styles.widthAmount, styles.tableHeader]}>
              INR {transactionData.amount || '0'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.section}>
        <Text style={styles.footer}>Thank you for your purchase!</Text>
        <Text style={styles.footer}>This is a computer-generated receipt and does not require a signature.</Text>
      </View>
    </Page>
  </Document>
);

export async function GET(request) {
  try {
    // Get transaction ID from URL parameters
    const { searchParams } = new URL(request.url);
    const txnId = searchParams.get("txnId");

    if (!txnId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }
   
  
    
    // Try to fetch data from API
    try {
      console.log(`Fetching transaction data for ID: ${txnId}`);
      const response = await axios.get(
        `https://gateway.mobalegends.in/api/payments/transaction/${txnId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.UNIFYPAY_API_KEY}`
          },
        }
      );
      
      if (response.data) {
        console.log("API response:", response.data);
        // Merge API data with default values
        transactionData = {
          ...transactionData,
          ...response.data
        };
      }
      
    } catch (error) {
      console.error("Error fetching transaction data:", error.message);
      
      // Use URL parameters to enhance our default data
      console.log("Using URL parameters for receipt generation");
      
      // Map all relevant URL parameters to transaction data
      for (const [key, value] of searchParams.entries()) {
        if (value && key !== "txnId") {
          transactionData[key] = value;
        }
      }
      
      // Special handling for specific parameters
      if (searchParams.get("transactionId")) {
        transactionData.transactionId = searchParams.get("transactionId");
      }
      
      if (searchParams.get("amount")) {
        transactionData.amount = searchParams.get("amount");
      }
      
      if (searchParams.get("userId")) {
        transactionData.userId = searchParams.get("userId");
      }
      
      if (searchParams.get("storeId")) {
        transactionData.storeId = searchParams.get("storeId");
        transactionData.pInfo = `Order for Store ${searchParams.get("storeId")}`;
      }
    }

    console.log("Using transaction data for PDF:", transactionData);

    // Generate PDF using React-PDF
    const pdfBuffer = await renderToBuffer(
      <ReceiptDocument transactionData={transactionData} />
    );

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${txnId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Receipt generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate receipt: " + error.message,
      },
      { status: 500 }
    );
  }
}
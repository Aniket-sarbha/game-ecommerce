"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader, Download } from 'lucide-react';
import Link from 'next/link';
import { pdf } from '@react-pdf/renderer';
import axios from 'axios';
import PaymentReceipt from '../stores/[slug]/components/PaymentReceipt';

// Component that uses useSearchParams safely inside Suspense boundary
function PaymentCallbackContent() {  
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [externalOrderStatus, setExternalOrderStatus] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const txnStatus = urlParams.get('status');
    console.log("URL parameters using URLSearchParams:", Object.fromEntries(urlParams.entries()));
    console.log("Status using URLSearchParams:", txnStatus);
    console.log("Store ID:", urlParams.get('storeId'));
    console.log("Product ID:", urlParams.get('productId'));
    
    if (txnStatus === 'SUCCESS') {
      setStatus('success');
      setMessage('Your payment was successful! Thank you for your purchase.');
      
      // Save order to database when payment is successful
      saveOrderToDatabase(urlParams);
      
    } else if (txnStatus && txnStatus.toUpperCase() === 'SUCCESS') {
      setStatus('success');
      setMessage('Your payment was successful! Thank you for your purchase.');
      
      // Save order to database when payment is successful
      saveOrderToDatabase(urlParams);
      
    } else if (txnStatus === 'failed' || txnStatus === 'FAILED') {
      setStatus('failed');
      setMessage('Your payment was not successful. Please try again.');
    } else if (txnStatus === 'pending' || txnStatus === 'PENDING') {
      setStatus('pending');
      setMessage('Your payment is being processed. We will update you once completed.');
    } else {
      setStatus('unknown');
      setMessage('Payment status unknown. Please contact support if you have questions.');
    }
  }, [searchParams]);
  // Function to save order to database and process external API
  const saveOrderToDatabase = async (urlParams) => {
    try {
      // Get necessary data from URL parameters
      const transactionId = urlParams.get('transactionId') || urlParams.get('clientTrxId');
      const amount = parseFloat(urlParams.get('amount') || '0');
      const merchantName = urlParams.get('merchantName');
      const customerName = urlParams.get('customerName');
      const udf1 = urlParams.get('udf1'); // User ID 
      const udf2 = urlParams.get('udf2'); // Server ID or Server
      const udf3 = urlParams.get('udf3'); // Optional promo code
      
      // Get store ID from the merchant name or from URL params if available
      const storeId = parseInt(urlParams.get('storeId') || '1');
      
      // Get product ID if available - don't convert to integer since it's a string in the schema
      const productId = urlParams.get('productId') || '';
      
      console.log("Using store ID:", storeId);
      console.log("Using product ID:", productId);
      console.log("User ID from udf1:", udf1);
      console.log("Server/ServerId from udf2:", udf2);
      
      // Create order data for local database
      const orderData = {
        transactionId,
        storeId,
        productId,
        amount,
        merchantName,
        customerName,
        userId: udf1
      };
      
      console.log("Saving order data:", orderData);
      
      // Call the API to save the order to local database
      const orderResponse = await axios.post('/api/orders/create', orderData);
      
      if (orderResponse.data.success) {
        console.log("Order saved successfully:", orderResponse.data);
        setOrderSaved(true);
        
        // After local order is saved, call the external API
        try {
          // Determine server value - default to "asia" if not provided
          const server = udf2 || "asia";
          
          // Call the external API with the required format
          const externalOrderData = {
            pack: productId, // Use the product ID as the "pack" parameter
            usesrid: udf1 || customerName, // Use the user ID or customer name
            serverid: "", // This field is empty in the example
            server: server, // Use the server from udf2 or default to "asia"
            trxid: transactionId // Use the transaction ID
          };
          
          console.log("Calling external API with data:", externalOrderData);
          
          const externalResponse = await axios.post('/api/external-order', externalOrderData);
          
          console.log("External API response:", externalResponse.data);
          
          if (externalResponse.data.status_code === 200 && externalResponse.data.response.status === "true") {
            console.log("External order processed successfully:", externalResponse.data.response.data);
            setExternalOrderStatus({
              success: true,
              orderId: externalResponse.data.response.data.id,
              message: externalResponse.data.response.msg
            });
          } else {
            console.error("External API returned error:", externalResponse.data);
            setExternalOrderStatus({
              success: false,
              message: externalResponse.data.response?.msg || "Failed to process order"
            });
          }
        } catch (externalError) {
          console.error("Error calling external API:", externalError);
          setExternalOrderStatus({
            success: false,
            message: "Error connecting to service provider"
          });
        }
      } else {
        console.error("Failed to save order:", orderResponse.data);
      }
    } catch (error) {
      console.error("Error saving order to database:", error);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Get transaction ID from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const txnId = urlParams.get('transactionId') || urlParams.get('txnId');
      
      if (!txnId) {
        alert('Transaction ID not found');
        setIsGeneratingPdf(false);
        return;
      }
      
      // Fetch payment details from your API
      const response = await axios.get(`/api/payment-details?txnId=${txnId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch payment details');
      }
      
      const paymentData = response.data.data;
      console.log("Payment data from API:", paymentData);
      
      // Generate PDF with the payment data
      const blob = await pdf(
        <PaymentReceipt data={paymentData} />
      ).toBlob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${txnId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt. Please try again later.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-6 text-center">
          {status === 'loading' && (
            <Loader size={60} className="animate-spin text-indigo-500 mx-auto mb-4" />
          )}
          {status === 'success' && (
            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          )}
          {status === 'failed' && (
            <XCircle size={60} className="text-red-500 mx-auto mb-4" />
          )}
          {status === 'pending' && (
            <Loader size={60} className="text-yellow-500 mx-auto mb-4" />
          )}
          {status === 'unknown' && (
            <div className="text-gray-400 mx-auto mb-4 text-5xl">?</div>
          )}
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' ? 'Processing...' : 
             status === 'success' ? 'Payment Successful!' :
             status === 'failed' ? 'Payment Failed' :
             status === 'pending' ? 'Payment Pending' : 'Unknown Status'}
          </h2>
          
          <p className="text-gray-300 mb-6">{message}</p>
          
          {status === 'success' && (
            <div className="bg-gray-700 p-3 rounded-lg mb-6 text-left">
              <h3 className="text-white font-semibold mb-2">Order Details:</h3>
              <p className="text-gray-300 text-sm">
                Store ID: <span className="text-indigo-300">{new URLSearchParams(window.location.search).get('storeId') || 'N/A'}</span>
              </p>
              <p className="text-gray-300 text-sm">
                Product ID: <span className="text-indigo-300">{new URLSearchParams(window.location.search).get('productId')}</span>
              </p>              <p className="text-gray-300 text-sm">
                Transaction ID: <span className="text-indigo-300">{new URLSearchParams(window.location.search).get('transactionId') || new URLSearchParams(window.location.search).get('clientTrxId') || 'N/A'}</span>
              </p>
            </div>
          )}
          
          {status === 'success' && externalOrderStatus && (
            <div className={`mb-6 p-4 rounded-lg ${externalOrderStatus.success ? 'bg-green-900/50 border border-green-600' : 'bg-yellow-900/50 border border-yellow-600'}`}>
              <p className={`text-sm ${externalOrderStatus.success ? 'text-green-200' : 'text-yellow-200'}`}>
                {externalOrderStatus.success ? 
                  `Order processed successfully! Order ID: ${externalOrderStatus.orderId}` : 
                  `Order processing: ${externalOrderStatus.message}`}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'success' && (
              <button
                onClick={handleDownloadReceipt}
                disabled={isGeneratingPdf}
                className="block w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <span className="flex items-center justify-center">
                    <Loader size={18} className="mr-2 animate-spin" />
                    Generating receipt...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Download size={18} className="mr-2" />
                    Download Receipt
                  </span>
                )}
              </button>
            )}
            
            <Link 
              href="/"
              className="block w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Return to Home
            </Link>
            
            <Link 
              href="/account"
              className="block w-full px-4 py-3 text-sm font-medium text-indigo-300 bg-transparent border border-indigo-600 rounded-lg hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Go to Account
            </Link>
            
            {status === 'failed' && (
              <Link
                href="/payment"
                className="block w-full px-4 py-3 text-sm font-medium text-indigo-300 bg-transparent border border-indigo-600 rounded-lg hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Try Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader size={40} className="animate-spin mx-auto mb-4" />
          <p>Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}

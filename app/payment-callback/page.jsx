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
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const txnStatus = urlParams.get('status');    console.log("URL parameters using URLSearchParams:", Object.fromEntries(urlParams.entries()));
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
  }, [searchParams]);  // Function to save order to database
  const saveOrderToDatabase = async (urlParams) => {
    try {
      // Get necessary data from URL parameters
      const transactionId = urlParams.get('transactionId') || urlParams.get('clientTrxId');
      const amount = parseFloat(urlParams.get('amount') || '0');
      const merchantName = urlParams.get('merchantName');
      const customerName = urlParams.get('customerName');
      const udf1 = urlParams.get('udf1'); // This might contain user ID or additional info
      
      // Get store ID from the merchant name or from URL params if available
      // This is a simple example - you may need to map the merchant name to a store ID in your database
      const storeId = parseInt(urlParams.get('storeId') || '1');
      
      // Get product ID if available
      const productId = parseInt(urlParams.get('productId') || '1');
      
      console.log("Using store ID:", storeId);
      console.log("Using product ID:", productId);
      
      // Create order data
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
      
      // Call the API to save the order
      const response = await axios.post('/api/orders/create', orderData);
      
      if (response.data.success) {
        console.log("Order saved successfully:", response.data);
        setOrderSaved(true);
      } else {
        console.error("Failed to save order:", response.data);
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
              </p>              <p className="text-gray-300 text-sm">
                Product ID: <span className="text-indigo-300">{new URLSearchParams(window.location.search).get('productId')}</span>
              </p>
              <p className="text-gray-300 text-sm">
                Transaction ID: <span className="text-indigo-300">{new URLSearchParams(window.location.search).get('transactionId') || new URLSearchParams(window.location.search).get('clientTrxId') || 'N/A'}</span>
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
            >              Return to Home
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
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <Loader size={40} className="animate-spin mx-auto mb-4" />
        <p>Loading payment details...</p>
      </div>
    </div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
// app/payment/callback/page.js
'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { checkPaymentStatus } from '../../actions/payment';

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  useEffect(() => {
    async function verifyPayment() {
      // Get transaction ID from URL params or localStorage
      const transactionId = searchParams.get('transaction_id') || localStorage.getItem('current_transaction');
      
      if (!transactionId) {
        setStatus('error');
        return;
      }
      
      const result = await checkPaymentStatus(transactionId);
      
      if (result.success) {
        setPaymentDetails(result.data);
        setStatus(result.data.status === 'SUCCESS' ? 'success' : 'failed');
      } else {
        setStatus('error');
      }
      
      // Clear the stored transaction
      localStorage.removeItem('current_transaction');
    }
    
    verifyPayment();
  }, [searchParams]);

  const goToHome = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="px-6 py-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Payment Status</h2>
        </div>
        
        <div className="p-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Verifying your payment...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-6">
              <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-6">Your payment has been processed successfully.</p>
              
              {paymentDetails && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white font-medium">₹{paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Transaction ID:</span>
                    <span className="text-white font-medium">{paymentDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Payment Method:</span>
                    <span className="text-white font-medium">{paymentDetails.paymentMethod || 'UPI'}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={goToHome}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              >
                Continue
              </button>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="text-center py-6">
              <XCircle size={64} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold text-white mb-2">Payment Failed</h2>
              <p className="text-gray-400 mb-6">Your payment could not be processed successfully.</p>
              
              <button
                onClick={goToHome}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mb-3"
              >
                Try Again
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-6">
              <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
              <h2 className="text-xl font-bold text-white mb-2">Verification Error</h2>
              <p className="text-gray-400 mb-6">We couldn't verify your payment status.</p>
              
              <button
                onClick={goToHome}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>

        {status !== 'loading' && (
          <div className="px-6 py-4 bg-gray-700 border-t border-gray-600 flex justify-between">
            <button
              onClick={goToHome}
              className="text-gray-300 hover:text-white flex items-center text-sm"
            >
              <ArrowLeft size={14} className="mr-1" />
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
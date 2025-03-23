// app/actions/payment.js

'use server'

import axios from 'axios';

export async function createPayment(paymentData) {
  try {
    const response = await axios.post('https://unifypay.com/api/payments/create', {
      apiKey: process.env.UNIFYPAY_API_KEY,
      amount: paymentData.amount,
      merchantName: "Your Game Store",
      upiId: paymentData.upiId,
      client_txn_id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerName: paymentData.userId,
      customerEmail: paymentData.email || "",
      customerMobile: paymentData.mobile || "",
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      pInfo: `Server Credit: ${paymentData.server}`,
      udf1: paymentData.promoCode || "",
      udf2: paymentData.server,
      udf3: paymentData.userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    // Improved error handling for network-related issues
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      console.error('Network error: Unable to connect to payment gateway', error);
      return { 
        success: false, 
        error: 'Unable to connect to payment gateway. Please check your internet connection and try again later.'
      };
    }
    
    console.error('Error creating payment:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

export async function checkPaymentStatus(transactionId) {
  try {
    const response = await axios.get(`https://unifypay.com/api/payments/status/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.UNIFYPAY_API_KEY}`
      }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    // Improved error handling for network-related issues
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      console.error('Network error: Unable to connect to payment gateway', error);
      return { 
        success: false, 
        error: 'Unable to connect to payment gateway. Please check your internet connection and try again later.'
      };
    }
    
    console.error('Error checking payment status:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
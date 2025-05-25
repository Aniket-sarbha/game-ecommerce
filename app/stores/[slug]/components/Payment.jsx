"use client"

import React, { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { User, Globe, Tag, CreditCard, ChevronDown, Check, Loader, Shield, Lock, IndianRupee } from "lucide-react"
import axios from "axios"

export default function PaymentComponent({ storeData, amount, selectedProductId, sellerOffer }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState(null)
  const [paymentError, setPaymentError] = useState(null)
  const dropdownRef = useRef(null)
  
  // Format price with currency
  const formatPrice = (price, currency = 'INR') => {
    const currencyFormats = {
      'INR': { locale: 'en-IN', currency: 'INR' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'de-DE', currency: 'EUR' },
      'GBP': { locale: 'en-GB', currency: 'GBP' }
    };
    
    const format = currencyFormats[currency] || currencyFormats['INR'];
    
    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency: format.currency,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Server options
  const servers = [
    { label: "Asia Server", value: "asia" },
    { label: "Europe Server", value: "europe" },
    { label: "North America Server", value: "na" },
    { label: "South America Server", value: "sa" },
    { label: "Oceania Server", value: "oceania" },
  ]

  // Form validation using React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      userId: "",
      serverId: "",
      server: "",
      promoCode: "",
      upiId: "",
      amount: amount,
    },
  })

  // Update amount when it changes from props
  useEffect(() => {
    if (amount) {
      setValue("amount", amount);
    }
  }, [amount, setValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServerDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle server selection
  const handleServerSelect = (server) => {
    setSelectedServer(server)
    setValue("server", server.value)
    setServerDropdownOpen(false)
  }

  // Validate UPI ID format
  const validateUpiId = (value) => {
    const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/
    return upiRegex.test(value) || "Please enter a valid UPI ID (e.g., username@bankname)"
  }
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setPaymentError(null);
  
    try {      
      console.log("Payment submission data:", {
        amount: data.amount,
        upiId: data.upiId,
        userId: data.userId || '',
        serverId: data.serverId || '',
        server: data.server || '',
        promoCode: data.promoCode || '',
        storeId: storeData.id,
        storeName: storeData.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        productId: selectedProductId,
        sellerOfferId: sellerOffer ? sellerOffer.id : null,
        sellerName: sellerOffer ? sellerOffer.seller.name : null
      });
  
      // Generate a unique transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        // Call our backend API to create the payment      
      console.log("Sending request to /api/create-payment...");
      const response = await axios.post('/api/create-payment', {
        amount: data.amount,
        upiId: data.upiId,
        transactionId: transactionId,
        userId: data.userId || '',
        serverId: data.serverId || '',
        server: data.server || '',
        promoCode: data.promoCode || '',
        storeId: storeData.id,
        storeName: storeData.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        productId: selectedProductId,
        sellerOfferId: sellerOffer ? sellerOffer.id : null,
        sellerName: sellerOffer?.seller?.name || null
      });
      
      console.log("Backend response:", response.data);
      
      if (response.data.success && response.data.data && response.data.data.paymentUrl) {
        console.log("Success! Redirecting to:", response.data.data.paymentUrl);
        window.location.href = response.data.data.paymentUrl;
      } else {
        console.error("Payment failed - Invalid response structure:", response.data);
        throw new Error(response.data.error || "Payment initialization failed - Invalid response format");
      }
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      // More descriptive error message
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "There was a problem processing your payment";
        
      console.error("Final error message:", errorMessage);
      setPaymentError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!storeData) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader size={24} className="animate-spin text-indigo-500" />
      </div>
    )
  }
  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 glass-effect shadow-purple-900/20">
      <div className="px-6 py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <h2 className="text-xl font-bold text-gray-100">Payment Details</h2>
        <p className="text-sm text-gray-400 mt-1">Enter your information to complete the payment.</p>
      </div>

      <div className="p-6">        {/* Seller Offer Information */}
        {sellerOffer && (
          <div className="mb-6 p-3 bg-gray-800/80 border border-gray-700 rounded-md">
            <div className="flex items-center">
              {sellerOffer.seller?.image && (
                <div className="flex-shrink-0 h-8 w-8 mr-3 rounded-full overflow-hidden">
                  <img 
                    src={sellerOffer.seller.image} 
                    alt={sellerOffer.seller.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ""; // Fallback image
                    }}
                  />
                </div>
              )}
              <div>
                <div className="text-indigo-400 text-sm font-medium">Offer by {sellerOffer.seller?.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium text-white">{formatPrice(sellerOffer.price, sellerOffer.currency)}</span>
                  {sellerOffer.mrp > sellerOffer.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(sellerOffer.mrp, sellerOffer.currency)}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-green-900/30 text-green-300 rounded-full">
                        {Math.round(((sellerOffer.mrp - sellerOffer.price) / sellerOffer.mrp) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
                {sellerOffer.description && (
                  <p className="text-gray-300 text-xs mt-1">{sellerOffer.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {paymentError && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <p className="text-sm text-red-200">{paymentError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            {(storeData.userId || storeData.serverId || storeData.server) && (
              <h3 className="text-sm font-medium text-indigo-400 flex items-center">
                <User size={16} className="mr-2" />
                User Information
              </h3>
            )}

            {/* User ID Field - Only show if required */}
            {storeData.userId && (
              <div className="space-y-1">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-300">
                  User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID"
                    className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.userId ? "border-red-500" : "border-gray-700"
                    } text-white placeholder-gray-500`}
                    {...register("userId", {
                      required: "User ID is required",
                      minLength: {
                        value: 3,
                        message: "User ID must be at least 3 characters",
                      },
                    })}
                    aria-invalid={errors.userId ? "true" : "false"}
                  />
                </div>
                {errors.userId && (
                  <p className="mt-1 text-sm text-red-400" role="alert">
                    {errors.userId.message}
                  </p>
                )}
              </div>
            )}

            {/* Server ID Field - Only show if required */}
            {storeData.serverId && (
              <div className="space-y-1">
                <label htmlFor="serverId" className="block text-sm font-medium text-gray-300">
                  Server ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="serverId"
                    type="text"
                    placeholder="Enter your server ID"
                    className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.serverId ? "border-red-500" : "border-gray-700"
                    } text-white placeholder-gray-500`}
                    {...register("serverId", {
                      required: "Server ID is required",
                    })}
                    aria-invalid={errors.serverId ? "true" : "false"}
                  />
                </div>
                {errors.serverId && (
                  <p className="mt-1 text-sm text-red-400" role="alert">
                    {errors.serverId.message}
                  </p>
                )}
              </div>
            )}

            {/* Server Selection Field - Only show if required */}
            {storeData.server && (
              <div className="space-y-1" ref={dropdownRef}>
                <label htmlFor="server" className="block text-sm font-medium text-gray-300">
                  Server Selection
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <button
                    type="button"
                    className={`w-full pl-10 pr-10 py-2 text-left bg-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.server ? "border-red-500" : "border-gray-700"
                    } ${!selectedServer ? "text-gray-500" : "text-white"}`}
                    onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={serverDropdownOpen}
                  >
                    {selectedServer ? selectedServer.label : "Select a server"}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-500" />
                    </span>
                  </button>

                  {serverDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-700">
                      <ul className="py-1" role="listbox" aria-labelledby="server-selection">
                        {servers.map((server) => (
                          <li
                            key={server.value}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 flex items-center ${
                              selectedServer && selectedServer.value === server.value
                                ? "bg-indigo-900 text-indigo-200"
                                : "text-white"
                            }`}
                            role="option"
                            aria-selected={selectedServer && selectedServer.value === server.value}
                            onClick={() => handleServerSelect(server)}
                          >
                            {selectedServer && selectedServer.value === server.value && (
                              <Check size={16} className="mr-2 text-indigo-400" />
                            )}
                            {server.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <input
                    type="hidden"
                    id="server"
                    {...register("server", {
                      required: storeData.server ? "Please select a server" : false,
                    })}
                  />
                </div>
                {errors.server && (
                  <p className="mt-1 text-sm text-red-400" role="alert">
                    {errors.server.message}
                  </p>
                )}
              </div>
            )}            {/* Amount Field (Always shown) */}
            <div className="space-y-1">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                Amount ({sellerOffer ? sellerOffer.currency : 'INR'})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {sellerOffer && sellerOffer.currency !== 'INR' ? (
                    <span className="text-gray-500 font-medium">
                      {sellerOffer.currency === 'USD' ? '$' : 
                       sellerOffer.currency === 'EUR' ? '€' : 
                       sellerOffer.currency === 'GBP' ? '£' : '₹'}
                    </span>
                  ) : (
                    <IndianRupee size={16} className="text-gray-500" />
                  )}
                </div>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.amount ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-500`}                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 1,
                      message: `Amount must be at least 1 ${sellerOffer ? sellerOffer.currency : 'INR'}`,
                    },
                  })}
                  aria-invalid={errors.amount ? "true" : "false"}
                  readOnly={true} // Make amount field readonly
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Promo Code Field (Optional) */}
            <div className="space-y-1">
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-300">
                Promo Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={16} className="text-gray-500" />
                </div>
                <input
                  id="promoCode"
                  type="text"
                  placeholder="Enter promo code (optional)"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder-gray-500"
                  {...register("promoCode")}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter a valid promo code to get discounts.</p>
            </div>

            <h3 className="text-sm font-medium text-indigo-400 flex items-center pt-2">
              <CreditCard size={16} className="mr-2" />
              Payment Method
            </h3>

            {/* UPI ID Field */}
            <div className="space-y-1">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">
                UPI ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={16} className="text-gray-500" />
                </div>
                <input
                  id="upiId"
                  type="text"
                  placeholder="username@bankname"
                  className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.upiId ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-500`}
                  {...register("upiId", {
                    required: "UPI ID is required",
                    validate: validateUpiId,
                  })}
                  aria-invalid={errors.upiId ? "true" : "false"}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter your UPI ID in the format: username@bankname</p>
              {errors.upiId && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.upiId.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader size={18} className="mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>

      <div className="px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center text-gray-400">
          <Shield size={14} className="mr-1" />
          <p className="text-xs">Secure Payment</p>
        </div>
        <div className="flex items-center text-gray-400">
          <Lock size={14} className="mr-1" />
          <p className="text-xs">Encrypted</p>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { User, Globe, Tag, CreditCard, ChevronDown, Check, Loader, Shield, Lock } from "lucide-react"

export default function PaymentComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState(null)
  const dropdownRef = useRef(null)

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
    watch,
  } = useForm({
    defaultValues: {
      userId: "",
      server: "",
      promoCode: "",
      upiId: "",
    },
  })

  // Close dropdown when clicking outside
  React.useEffect(() => {
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

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log(data)
      alert("Payment initiated successfully!")
    } catch (error) {
      alert("There was a problem processing your payment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=" max-w-md mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
      <div className="px-6 py-5 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Payment Details</h2>
        <p className="text-sm text-gray-400 mt-1">Enter your information to complete the payment.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <h3 className="text-sm font-medium text-indigo-400 flex items-center">
              <User size={16} className="mr-2" />
              User Information
            </h3>

            {/* User ID Field */}
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

            {/* Server Selection Field */}
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
                    required: "Please select a server",
                  })}
                />
              </div>
              {errors.server && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                  {errors.server.message}
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

      <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
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


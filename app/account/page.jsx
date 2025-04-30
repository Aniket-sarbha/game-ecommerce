"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Clock, ShieldCheck, LogOut, Download, ShoppingBag, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change state
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeResult, setPasswordChangeResult] = useState({ type: "", message: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Fetch order history when tab changes to "orders"
  useEffect(() => {
    if (activeTab === "orders" && session?.user) {
      fetchOrderHistory();
    }
  }, [activeTab, session?.user]);
  
  // Function to fetch order history
  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/history");
      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password form when it's closed
  useEffect(() => {
    if (!showChangePasswordForm) {
      resetPasswordForm();
    }
  }, [showChangePasswordForm]);
  
  // Function to handle change password form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    
    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Submit form
    setIsChangingPassword(true);
    setPasswordChangeResult({ type: "", message: "" });
    
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setPasswordChangeResult({
          type: "success",
          message: data.message || "Password changed successfully"
        });
        resetPasswordForm();
        // Keep the form open to show the success message
      } else {
        setPasswordChangeResult({
          type: "error",
          message: data.message || "Failed to change password"
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeResult({
        type: "error",
        message: "An error occurred. Please try again."
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Function to reset password form
  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
    setPasswordChangeResult({ type: "", message: "" });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };
  
  // Function to download receipt
  const downloadReceipt = async (orderId, orderNumber) => {
    try {
      const response = await fetch(`/api/orders/receipt/${orderId}`);
      if (!response.ok) throw new Error("Failed to generate receipt");
      
      const data = await response.json();
      
      // Create receipt content
      const receiptContent = generateReceiptHTML(data.receipt);
      
      // Create downloadable blob
      const blob = new Blob([receiptContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };
  
  // Function to generate receipt HTML
  const generateReceiptHTML = (receipt) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receipt.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
          .receipt-info { margin-bottom: 20px; }
          .receipt-info p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
          th { background-color: #f8f9fa; }
          .total { font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Receipt</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="receipt-info">
          <p><strong>Order Number:</strong> ${receipt.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(receipt.orderDate).toLocaleString()}</p>
          <p><strong>Store:</strong> ${receipt.storeName}</p>
          <p><strong>Customer:</strong> ${receipt.customerName}</p>
          <p><strong>Email:</strong> ${receipt.customerEmail}</p>
          <p><strong>Payment Method:</strong> ${receipt.paymentMethod.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Status:</strong> ${receipt.status.toUpperCase()}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <p>Total Amount: $${receipt.totalAmount.toFixed(2)}</p>
        </div>
        
        <div class="footer">
          <p>This is an electronic receipt for your purchase.</p>
        </div>
      </body>
      </html>
    `;
  };
  
  // Handle if user is not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with user info */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/80 shadow-lg">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left text-white flex-1">
                <h1 className="text-2xl font-bold">{session.user.name || "User"}</h1>
                <p className="opacity-90 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                  <Mail size={16} /> 
                  {session.user.email}
                </p>
                <p className="text-sm opacity-80 mt-1">Member since {formatDate(session.user?.createdAt || new Date())}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <User size={16} /> Profile
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "orders"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag size={16} /> Order History
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "security"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Security
                </span>
              </button>
            </nav>
          </div>
          
          {/* Content area */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{session.user.name || "Not provided"}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{session.user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order History</h2>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your order history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  // Empty state for no orders
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 text-lg">No orders yet</h3>
                    <p className="text-gray-400 mt-1">Your order history will appear here</p>
                    
                    <div className="mt-6">
                      <Link href="/">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Browse Games
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Order history list
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-3 md:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                              {order.store.image ? (
                                <img 
                                  src={order.store.image} 
                                  alt={order.store.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-800 font-bold">
                                  {order.store.name ? order.store.name[0].toUpperCase() : 'S'}
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{order.store.name}</h3>
                                <p className="text-sm text-gray-500">Order #{order.orderNumber.substring(0, 8)}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                              <p>Status: <span className="font-medium text-green-600 capitalize">{order.status}</span></p>
                              <p className="font-medium">Total: ₹ {parseFloat(order.totalAmount).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <button 
                              onClick={() => downloadReceipt(order.id, order.orderNumber)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Download size={16} />
                              Download Receipt
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Items:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                {item.storeItem.image ? (
                                  <img 
                                    src={item.storeItem.image} 
                                    alt={item.storeItem.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                    <ShoppingBag size={14} />
                                  </div>
                                )}
                                <div className="text-sm">
                                  <p className="font-medium line-clamp-1">{item.storeItem.name}</p>
                                  <p className="text-xs text-gray-500">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Security</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-gray-700">
                      Manage your account security settings, change password and set up two-factor authentication.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Password</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      Change your password to keep your account secure.
                    </p>
                    
                    {!showChangePasswordForm ? (
                      <button 
                        onClick={() => setShowChangePasswordForm(true)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        Change Password
                      </button>
                    ) : (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {passwordChangeResult.message && (
                          <div className={`mb-4 p-3 rounded-md ${
                            passwordChangeResult.type === "success" 
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            <div className="flex items-center gap-2">
                              {passwordChangeResult.type === "success" ? (
                                <Check size={18} className="text-green-500" />
                              ) : (
                                <AlertCircle size={18} className="text-red-500" />
                              )}
                              <span>{passwordChangeResult.message}</span>
                            </div>
                          </div>
                        )}
                        
                        <form onSubmit={handleChangePassword}>
                          <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  id="currentPassword"
                                  name="currentPassword"
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className={`w-full px-3 py-2 border ${
                                    passwordErrors.currentPassword ? "border-red-300" : "border-gray-300"
                                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900`}
                                  placeholder="Enter your current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                >
                                  {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                              {passwordErrors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                              )}
                            </div>
                            
                            {/* New Password */}
                            <div>
                              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  id="newPassword"
                                  name="newPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className={`w-full px-3 py-2 border ${
                                    passwordErrors.newPassword ? "border-red-300" : "border-gray-300"
                                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900`}
                                  placeholder="Enter your new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                >
                                  {showNewPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                              {passwordErrors.newPassword ? (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                              ) : (
                                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                              )}
                            </div>
                            
                            {/* Confirm Password */}
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className={`w-full px-3 py-2 border ${
                                    passwordErrors.confirmPassword ? "border-red-300" : "border-gray-300"
                                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900`}
                                  placeholder="Confirm your new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                              {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                              <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                              >
                                {isChangingPassword ? (
                                  <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                  </span>
                                ) : "Update Password"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowChangePasswordForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Device Management</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      See the devices where you're currently logged in.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Current Device</p>
                          <p className="text-xs text-gray-500">Last active just now</p>
                        </div>
                        <div className="bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full">
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
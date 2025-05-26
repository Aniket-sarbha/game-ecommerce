"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Clock, ShieldCheck, Store, LogOut, Eye, EyeOff, Check, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  
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
    // Seller offers state
  const [stores, setStores] = useState([]);
  const [sellerOffers, setSellerOffers] = useState([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeItems, setStoreItems] = useState([]);
  const [selectedStoreItem, setSelectedStoreItem] = useState(null);
  const [isLoadingStoreItems, setIsLoadingStoreItems] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState("");  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [currentEditingOfferId, setCurrentEditingOfferId] = useState(null);
    // Admin/SuperAdmin state
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userManagementError, setUserManagementError] = useState("");
  const [userManagementSuccess, setUserManagementSuccess] = useState("");
  
  // Helper function to check if user has admin role
  const isAdmin = () => {
    return session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';
  };
  
  // Helper function to check if user has superadmin role
  const isSuperAdmin = () => {
    return session?.user?.role === 'SUPERADMIN';
  };
  
  // Reset password form when it's closed
  useEffect(() => {
    if (!showChangePasswordForm) {
      resetPasswordForm();
    }
  }, [showChangePasswordForm]);
    // Load stores and seller offers when tab changes
  useEffect(() => {
    if (activeTab === "seller-offers") {
      fetchStores();
      fetchSellerOffers();
    }
  }, [activeTab, session]);
  // Load users when user management tab is active
  useEffect(() => {
    if (activeTab === "user-management" && isSuperAdmin()) {
      fetchUsers();
    }
  }, [activeTab, session]);  // Fetch all users for user management
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setUserManagementError("");
      const response = await fetch("/api/admin/users");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      
      const data = await response.json();
      
      // Handle the correct response format - API returns { success: true, users: [...] }
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Users data is not in expected format:", data);
        setUsers([]);
        setUserManagementError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserManagementError(error.message || "Failed to load users. Please try again.");
      setUsers([]); // Ensure users is always an array
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      setUserManagementError("");
      setUserManagementSuccess("");
      
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserManagementSuccess(`User role updated to ${newRole} successfully!`);
        fetchUsers(); // Refresh the users list
      } else {
        setUserManagementError(data.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setUserManagementError("An error occurred. Please try again.");
    }
  };
    // Fetch all stores
  const fetchStores = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch("/api/stores");
      if (!response.ok) throw new Error("Failed to fetch stores");
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoadingStores(false);
    }
  };
  
  // Fetch seller's offers
  const fetchSellerOffers = async () => {
    try {
      setIsLoadingOffers(true);
      const response = await fetch("/api/seller-offers");
      if (!response.ok) throw new Error("Failed to fetch seller offers");
      const data = await response.json();
      setSellerOffers(data);
    } catch (error) {
      console.error("Error fetching seller offers:", error);
    } finally {
      setIsLoadingOffers(false);
    }
  };
  // Fetch store items when a store is selected
  const fetchStoreItems = async (storeId) => {
    if (!storeId) return [];
    
    try {
      setIsLoadingStoreItems(true);
      setStoreItems([]);
      setSelectedStoreItem(null);
      
      // Find the store name using the ID
      const store = stores.find(s => s.id === storeId);
      if (!store) throw new Error("Store not found");
      
      const response = await fetch(`/api/stores/${store.name}/items`);
      if (!response.ok) throw new Error("Failed to fetch store items");
      const data = await response.json();
      setStoreItems(data);
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching store items:", error);
      return []; // Return empty array on error
    } finally {
      setIsLoadingStoreItems(false);
    }
  };
  // Function to handle offer submission
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStore) {
      setOfferError("Please select a store");
      return;
    }
    
    if (!selectedStoreItem) {
      setOfferError("Please select a store item");
      return;
    }
    
    if (!offerPrice || isNaN(offerPrice) || parseFloat(offerPrice) <= 0) {
      setOfferError("Please enter a valid price");
      return;
    }
    
    setIsSubmittingOffer(true);
    setOfferError("");
    setOfferSuccess("");
    
    try {
      const offerData = {
        storeId: selectedStore.id,
        storeItemId: selectedStoreItem.id,
        price: parseFloat(offerPrice),
        mrp: selectedStoreItem.mrp,
        currency: "INR",
        description: offerDescription,
        id: isEditingOffer ? currentEditingOfferId : undefined
      };
      
      const url = isEditingOffer ? `/api/seller-offers/${currentEditingOfferId}` : "/api/seller-offers";
      const method = isEditingOffer ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOfferSuccess(isEditingOffer ? "Offer updated successfully!" : "Offer created successfully!");
        resetOfferForm();
        fetchSellerOffers();
      } else {
        setOfferError(data.message || "Failed to save offer");
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      setOfferError("An error occurred. Please try again.");
    } finally {
      setIsSubmittingOffer(false);
    }
  };
  
  // Function to handle offer deletion
  const handleDeleteOffer = async (offerId) => {
    if (!confirm("Are you sure you want to delete this offer?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/seller-offers/${offerId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchSellerOffers();
        setOfferSuccess("Offer deleted successfully!");
      } else {
        const data = await response.json();
        setOfferError(data.message || "Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      setOfferError("An error occurred. Please try again.");
    }
  };  // Function to handle editing an offer
  const handleEditOffer = async (offer) => {
    const store = stores.find(s => s.id === offer.storeId);
    setSelectedStore(store);
    
    // Fetch store items for this store
    if (store) {
      const fetchedItems = await fetchStoreItems(store.id);
      
      // If we have a storeItemId, set the selected store item
      if (offer.storeItemId && fetchedItems.length > 0) {
        const item = fetchedItems.find(item => item.id === offer.storeItemId);
        setSelectedStoreItem(item || null);
      }
    }
    
    setOfferPrice(offer.price.toString());
    setOfferDescription(offer.description || "");
    setIsEditingOffer(true);
    setCurrentEditingOfferId(offer.id);
  };
    
  // Reset offer form
  const resetOfferForm = () => {
    setSelectedStore(null);
    setSelectedStoreItem(null);
    setStoreItems([]);
    setOfferPrice("");
    setOfferDescription("");
    setIsEditingOffer(false);
    setCurrentEditingOfferId(null);
  };
  
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

  // Helper function to calculate discount percentage
  const calculateDiscount = (price, mrp) => {
    if (!price || !mrp || price >= mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  // Format price with currency
  const formatPriceWithCurrency = (price, currency = "INR") => {
    if (!price) return "";
    
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0
    });
    
    return formatter.format(price);
  };

  // Format price without currency symbol, consistent with existing function
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format store name
  const formatStoreName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
              
              {/* Show seller offers tab only to admins and superadmins */}
              {isAdmin() && (
                <button
                  onClick={() => setActiveTab("seller-offers")}
                  className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "seller-offers"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Store size={16} /> Seller Offers
                  </span>
                </button>
              )}
              
              {/* Show user management tab only to superadmins */}
              {isSuperAdmin() && (
                <button
                  onClick={() => setActiveTab("user-management")}
                  className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "user-management"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <User size={16} /> User Management
                  </span>
                </button>
              )}
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
              {activeTab === "seller-offers" && isAdmin() && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Store Offers</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-gray-700">
                      Create custom offers for different games. Buyers will see your offers when they browse these stores.
                    </p>
                  </div>
                  
                  {/* Create or Edit Offer Form */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      {isEditingOffer ? "Edit Offer" : "Create New Offer"}
                    </h3>
                    
                    {offerError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={18} className="text-red-500" />
                          <span>{offerError}</span>
                        </div>
                      </div>
                    )}
                    
                    {offerSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                        <div className="flex items-center gap-2">
                          <Check size={18} className="text-green-500" />
                          <span>{offerSuccess}</span>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleOfferSubmit}>
                      <div className="space-y-4">                        {/* Store Selection */}
                        <div>
                          <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Store
                          </label>
                          <select
                            id="store"
                            value={selectedStore?.id || ""}
                            onChange={(e) => {
                              const storeId = e.target.value;
                              const store = stores.find(s => s.id === parseInt(storeId));
                              setSelectedStore(store || null);
                              if (storeId) {
                                fetchStoreItems(parseInt(storeId));
                              } else {
                                setStoreItems([]);
                                setSelectedStoreItem(null);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            disabled={isEditingOffer}
                          >
                            <option value="">Select a store</option>
                            {stores.map((store) => (
                              <option key={store.id} value={store.id}>
                                {formatStoreName(store.name)}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Store Items Dropdown */}
                        <div>
                          <label htmlFor="storeItem" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Store Item
                          </label>
                          <select
                            id="storeItem"
                            value={selectedStoreItem?.id || ""}
                            onChange={(e) => {
                              const itemId = e.target.value;
                              const item = storeItems.find(item => item.id === parseInt(itemId));
                              setSelectedStoreItem(item || null);
                              if (item) {
                                setOfferPrice(item.price.toString());
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            disabled={isLoadingStoreItems || !selectedStore || storeItems.length === 0}
                          >
                            <option value="">Select an item</option>
                            {isLoadingStoreItems ? (
                              <option disabled>Loading items...</option>
                            ) : storeItems.length > 0 ? (
                              storeItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))
                            ) : selectedStore ? (
                              <option disabled>No items available</option>
                            ) : null}
                          </select>
                          {isLoadingStoreItems && (
                            <p className="mt-1 text-xs text-blue-500">Loading store items...</p>
                          )}
                        </div>                        {/* Price */}
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Offer Price (INR)
                          </label>
                          <input
                            id="price"
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            placeholder="Enter your offer price"
                            min="1"
                            step="0.01"
                          />
                          <p className="mt-1 text-xs text-gray-500">Set the price you want to offer to buyers</p>
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Offer Description <span className="text-gray-400">(Optional)</span>
                          </label>
                          <textarea
                            id="description"
                            value={offerDescription}
                            onChange={(e) => setOfferDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            placeholder="Describe your offer to buyers"
                            rows="3"
                          ></textarea>
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={isSubmittingOffer}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                          >
                            {isSubmittingOffer ? (
                              <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isEditingOffer ? "Updating..." : "Creating..."}
                              </span>
                            ) : isEditingOffer ? "Update Offer" : "Create Offer"}
                          </button>
                          
                          {isEditingOffer && (
                            <button
                              type="button"
                              onClick={resetOfferForm}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              Cancel Editing
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  {/* Current Offers */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Your Current Offers</h3>
                    
                    {isLoadingOffers ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    ) : sellerOffers.length === 0 ? (
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <p className="text-gray-500">You haven't created any offers yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {sellerOffers.map((offer) => {
                          const store = stores.find(s => s.id === offer.storeId);
                          return (
                            <div key={offer.id} className="py-3 first:pt-0 last:pb-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>                                  <h4 className="font-medium text-gray-800">
                                    {store ? formatStoreName(store.name) : `Store #${offer.storeId}`}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                    <p className="text-sm text-gray-600">
                                      Price: <span className="font-medium text-blue-600">{formatPriceWithCurrency(offer.price, offer.currency)}</span>
                                    </p>
                                    {offer.mrp > offer.price && (
                                      <>
                                        <p className="text-sm text-gray-500">
                                          <span className="line-through">{formatPriceWithCurrency(offer.mrp, offer.currency)}</span>
                                        </p>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                          {calculateDiscount(offer.price, offer.mrp)}% off
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {offer.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      "{offer.description}"
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2 sm:ml-auto">
                                  <button
                                    onClick={() => handleEditOffer(offer)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit offer"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOffer(offer.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete offer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Discount and MRP Display */}
                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="text-sm text-gray-500">
                                  MRP: <span className="font-medium text-gray-800">{formatPrice(offer.mrp)}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  Discount: <span className="font-medium text-green-600">{calculateDiscount(offer.price, offer.mrp)}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "user-management" && isSuperAdmin() && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
                
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800">
                      <strong>SuperAdmin Access:</strong> You can assign admin roles to users. Admin users can create and manage seller offers.
                    </p>
                  </div>
                  
                  {userManagementError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-500" />
                        <span>{userManagementError}</span>
                      </div>
                    </div>
                  )}
                  
                  {userManagementSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>{userManagementSuccess}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Users List */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-medium text-gray-800">All Users</h3>
                    </div>
                      {isLoadingUsers ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    ) : !Array.isArray(users) || users.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {!Array.isArray(users) ? "Error loading users" : "No users found."}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {users.map((user) => (
                          <div key={user.id} className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    {user.image ? (
                                      <img
                                        src={user.image}
                                        alt={user.name || "User"}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {user.name || "Unknown User"}
                                    </h4>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-700">Current Role</p>
                                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                    user.role === 'SUPERADMIN' 
                                      ? 'bg-purple-100 text-purple-800'
                                      : user.role === 'ADMIN'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </div>
                                
                                {/* Role change dropdown - don't allow changing superadmin roles */}
                                {user.role !== 'SUPERADMIN' && user.id !== session?.user?.id && (
                                  <select
                                    value={user.role}
                                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                  </select>
                                )}
                                
                                {user.role === 'SUPERADMIN' && (
                                  <span className="text-xs text-gray-500 px-3 py-1">
                                    Protected
                                  </span>
                                )}
                                
                                {user.id === session?.user?.id && (
                                  <span className="text-xs text-gray-500 px-3 py-1">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Member since {formatDate(user.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
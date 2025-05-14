"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Clock, ShieldCheck, LogOut, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
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
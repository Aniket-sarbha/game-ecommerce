"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '@/app/login/components/LoginSignup.module.css';
import { UserRound, Store, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RoleSelection() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
    
    // If user already has a role, redirect them to the homepage
    if (session?.user?.role && session.user.role !== 'pending') {
      router.replace('/');
    }
  }, [session, status, router]);

  // Show loading state if session is still loading
  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.authCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  const handleContinue = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Update the user's role in the database
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update role');
      }

      // Update the session with the new role
      await update({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
        },
      });

      // Small delay before redirect to ensure the session is updated
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      console.error('Error updating role:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Choose Your Role</h1>
        <p className={styles.subtitle}>Select how you want to use our platform</p>

        {error && (
          <div className={`${styles.notification} ${styles.error}`} role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 w-full mt-6">
          <button
            type="button"
            onClick={() => handleRoleSelect('buyer')}
            className={`flex items-center p-4 border border-gray-700 rounded-lg transition-all duration-200 hover:border-indigo-500 ${
              selectedRole === 'buyer' ? 'bg-indigo-900/30 border-indigo-500' : 'bg-gray-900/30'
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Buyer</h3>
              <p className="text-sm text-gray-400">Purchase games, vouchers, and in-game currency</p>
            </div>
            {selectedRole === 'buyer' && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('seller')}
            className={`flex items-center p-4 border border-gray-700 rounded-lg transition-all duration-200 hover:border-purple-500 ${
              selectedRole === 'seller' ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-900/30'
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
              <Store size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Seller</h3>
              <p className="text-sm text-gray-400">Manage your store and sell digital products</p>
            </div>
            {selectedRole === 'seller' && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            )}
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className={`${styles.authButton} mt-8 ${!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className={styles.spinnerContainer}>
              <span className={styles.spinner}></span>
              <span>Processing</span>
            </span>
          ) : (
            <>
              Continue
              <ArrowRight className={styles.buttonIcon} size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

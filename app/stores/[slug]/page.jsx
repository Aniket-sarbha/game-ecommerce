//app/stores/[slug]/page.jsx

"use client";
import Navbar from "@/app/components/Navbar";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Banner from "./components/Banner";
import Payment from "./components/Payment";
import ProductSelection from "./components/ProductSelection";
import Footer from "@/app/components/Footer";
import { useParams } from 'next/navigation';

const Page = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for selected product and amount
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductAmount, setSelectedProductAmount] = useState(100);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/stores/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }

        const data = await response.json();
        setStoreData(data);
        
        // Initialize with the first product if available
        if (data.storeItems && data.storeItems.length > 0) {
          setSelectedProductId(data.storeItems[0].id);
          setSelectedProductAmount(data.storeItems[0].price);
        }
      } catch (err) {
        console.error('Error fetching store:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchStoreData();
    }
  }, [slug]);

  // Handle product selection
  const handleProductSelect = (productId) => {
    if (storeData && storeData.storeItems) {
      const selectedProduct = storeData.storeItems.find(item => item.id === productId);
      if (selectedProduct) {
        setSelectedProductId(productId);
        setSelectedProductAmount(selectedProduct.price);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#030303] min-h-screen">
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center mt-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-indigo-400 border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center mt-20">
          <div className="text-center p-6 rounded-lg glass-effect bg-red-900/30 border border-red-700 shadow-lg">
            <h3 className="text-lg font-medium mb-2 text-red-200">Something went wrong</h3>
            <p className="text-red-300">{error || 'Store not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`${styles.pageContainer} min-h-screen pt-20`}>
      <div>
        <Navbar />
      </div>
      <div>
        <Banner storeData={storeData} />
      </div>
      
      <div className="w-full px-4 md:px-8 lg:px-16 my-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-7/12">
            <ProductSelection 
              storeData={storeData} 
              selectedProductId={selectedProductId}
              onProductSelect={handleProductSelect}
            />
          </div>
          <div className="w-full md:w-5/12">
            <Payment 
              storeData={storeData} 
              amount={selectedProductAmount}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
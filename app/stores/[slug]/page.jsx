//app/stores/[slug]/page.jsx

"use client";
import Navbar from "@/app/components/Navbar";
import React, { useEffect, useState } from "react";
import "./page.module.css";
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

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/stores/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }

        const data = await response.json();
        setStoreData(data);
      } catch (err) {
        console.error('Error fetching store:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(slug);
    

    if (slug) {
      fetchStoreData();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error || !storeData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center mt-20">
          <div className="text-center p-4 rounded-lg bg-red-50 text-red-600">
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p>{error || 'Store not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <Banner storeData = {storeData} />
          {/* {store.image} */}
        </div>
        <div className="bg-gray-800">
        </div>
        <div className="w-full px-4 md:px-8 lg:px-16 my-4">
          <div className="flex flex-col md:flex-row ">
            <div className="w-full md:w-0.1 ">
              <ProductSelection storeData = {storeData} />
            </div>
            <div className="w-full md:w-0.1">
              <Payment storeData = {storeData} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
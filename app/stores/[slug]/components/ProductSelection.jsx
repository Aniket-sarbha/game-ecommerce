// app/stores/[slug]/components/ProductSelection.jsx
"use client";

import React, { useState } from 'react';

const ProductSelection = ({ storeData, selectedProductId, onProductSelect }) => {
  const [activeTab, setActiveTab] = useState('store'); // 'store' or 'sellers'
    // Format price to currency display
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
  };

  // Calculate discount percentage
  const calculateDiscount = (price, mrp) => {
    const discount = ((mrp - price) / mrp) * 100;
    return Math.round(discount);
  };
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-6 glass-effect shadow-purple-900/20">
      <h2 className="text-xl font-semibold mb-5 text-gray-100 gradient-text">Select Product</h2>
      
      {/* Tabs for Store Items and Seller Offers */}
      <div className="flex mb-5 border-b border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'store'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('store')}
        >
          Store Items
        </button>
        
        {storeData.sellerOffers && storeData.sellerOffers.length > 0 && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'sellers'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('sellers')}
          >
            Seller Offers ({storeData.sellerOffers.length})
          </button>
        )}
      </div>
      
      {/* Store Items */}
      {activeTab === 'store' && (
        storeData.storeItems.length === 0 ? (
          <div className="text-center p-6 bg-gray-800/70 rounded-md border border-gray-700">
            <p className="text-gray-300">No products available for this store</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {storeData.storeItems.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.03] ${
                  selectedProductId === item.productId 
                    ? 'border-indigo-500 bg-gray-800 shadow-glow' 
                    : 'border-gray-700 bg-gray-800/70 hover:border-indigo-400'
                }`}
                onClick={() => onProductSelect(item.productId)}
              >
                <div className="flex flex-col items-center">
                  {item.image && (
                    <div className="w-full h-24 mb-3 rounded overflow-hidden bg-gray-700">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = ""; // Fallback image
                        }}
                      />
                    </div>
                  )}
                  <div className="w-full text-center">
                    <h3 className="font-medium text-gray-100 text-sm truncate">{item.name}</h3>
                    <div className="flex flex-wrap justify-center items-center mt-2">
                      <span className="font-semibold text-gray-50 text-sm">{formatPrice(item.price)}</span>
                      {item.mrp > item.price && (
                        <div className="flex items-center mt-1 w-full justify-center">
                          <span className="text-xs text-gray-400 line-through mr-1">{formatPrice(item.mrp)}</span>
                          <span className="text-xs text-indigo-400">
                            {calculateDiscount(item.price, item.mrp)}% off
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProductId === item.productId ? 'border-indigo-500 bg-indigo-500 shadow-glow' : 'border-gray-500'
                      }`}>
                        {selectedProductId === item.productId && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      {/* Seller Offers */}
      {activeTab === 'sellers' && (
        storeData.sellerOffers && storeData.sellerOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeData.sellerOffers.map((offer) => (
              <div 
                key={offer.id}
                className="border border-gray-700 bg-gray-800/70 rounded-lg p-4 hover:border-indigo-400 transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  {offer.seller.image && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={offer.seller.image} 
                        alt={offer.seller.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = ""; // Fallback image
                        }}
                      />
                    </div>
                  )}                  <div className="flex-1">                    <h3 className="font-medium text-gray-100">{offer.seller.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-indigo-400">{formatPrice(offer.price, offer.currency)}</p>
                      {offer.mrp && offer.mrp > offer.price && (
                        <>
                          <p className="text-sm text-gray-400 line-through">{formatPrice(offer.mrp, offer.currency)}</p>
                          <span className="text-xs px-1.5 py-0.5 bg-green-900/30 text-green-300 rounded-full">
                            {calculateDiscount(offer.price, offer.mrp)}% off
                          </span>
                        </>
                      )}
                    </div>
                    
                    {offer.description && (
                      <p className="mt-2 text-sm text-gray-300">{offer.description}</p>
                    )}
                      <button 
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                      onClick={() => {
                        // Find the store item for this store
                        const storeItem = storeData.storeItems[0]; // Default to first item
                        onProductSelect(storeItem.productId, offer);
                      }}
                    >
                      Select Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-800/70 rounded-md border border-gray-700">
            <p className="text-gray-300">No seller offers available for this store</p>
          </div>
        )
      )}
    </div>
  );
};

export default ProductSelection;
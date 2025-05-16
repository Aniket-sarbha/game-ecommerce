// app/stores/[slug]/components/ProductSelection.jsx
"use client";

import React from 'react';

const ProductSelection = ({ storeData, selectedProductId, onProductSelect }) => {
  // Format price to currency display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
      
      {storeData.storeItems.length === 0 ? (
        <div className="text-center p-6 bg-gray-800/70 rounded-md border border-gray-700">
          <p className="text-gray-300">No products available for this store</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {storeData.storeItems.map((item) => (            <div 
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
                  <div className="mt-2 flex justify-center">                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedProductId === item.productId ? 'border-indigo-500 bg-indigo-500 shadow-glow' : 'border-gray-500'
                    }`}>
                      {selectedProductId === item.id && (
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
      )}
    </div>
  );
};

export default ProductSelection;
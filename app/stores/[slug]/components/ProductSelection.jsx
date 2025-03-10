"use client"

import React, { useState, useEffect } from 'react';
import { BadgeCheck, Package, Star, Trophy } from 'lucide-react';

const ProductSelection = () => {
  // State to store diamonds for each product
  const [productDiamonds, setProductDiamonds] = useState({});

  // Function to generate a deterministic random number based on product ID
  const generateDeterministicNumber = (productId, seed) => {
    const hash = (productId * 9301 + 49297) % 233280;
    const random = hash / 233280;
    return Math.floor(random * 20) + 1;
  };

  // Product data with enhanced information
  const products = [
    { 
      id: 1, 
      name: 'Basic Package', 
      icon: Package,
      description: 'Perfect for getting started',
      recommended: false
    },
    { 
      id: 2, 
      name: 'Pro Package', 
      icon: Star,
      description: 'Most popular choice',
      recommended: true
    },
    { 
      id: 3, 
      name: 'Elite Package', 
      icon: Trophy,
      description: 'Advanced features',
      recommended: false
    },
    { 
      id: 4, 
      name: 'Ultimate Package', 
      icon: BadgeCheck,
      description: 'Complete solution',
      recommended: false
    }
  ];

  // Initialize diamonds on component mount
  useEffect(() => {
    const initialDiamonds = {};
    products.forEach(product => {
      const firstNumber = generateDeterministicNumber(product.id, 1);
      const secondNumber = generateDeterministicNumber(product.id, 2);
      initialDiamonds[product.id] = { firstNumber, secondNumber };
    });
    setProductDiamonds(initialDiamonds);
  }, []);

  // State to store selected product and screen size
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initial screen size
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-gray-900">
          Choose Your Perfect Plan
        </h2>
        
        {/* Responsive grid layout */}
        <div className={`
          grid 
          ${isMobile 
            ? 'grid-cols-1 gap-4' 
            : 'grid-cols-2 gap-6'}
        `}>
          {products.map((product) => {
            // Get deterministic diamonds
            const diamonds = productDiamonds[product.id] || { firstNumber: 0, secondNumber: 0 };
            const { firstNumber, secondNumber } = diamonds;
            const totalDiamonds = firstNumber + secondNumber;

            // Dynamic icon and styling
            const ProductIcon = product.icon;

            return (
              <div 
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`
                  group
                  relative
                  cursor-pointer 
                  p-4 sm:p-6 
                  rounded-xl 
                  border-2 
                  transition-all 
                  duration-300 
                  transform 
                  hover:-translate-y-2 
                  ${selectedProduct === product.id 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}
                  ${isMobile ? 'text-center' : ''}
                `}
              >
                {product.recommended && (
                  <div className="absolute top-0 right-0 m-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className={`
                  flex 
                  ${isMobile 
                    ? 'flex-col items-center' 
                    : 'items-center'}
                  mb-4
                `}>
                  <ProductIcon 
                    className={`
                      ${isMobile ? 'mb-2 mx-auto' : 'mr-4'}
                      ${selectedProduct === product.id 
                        ? 'text-blue-600' 
                        : 'text-gray-500 group-hover:text-blue-500'}
                    `} 
                    size={isMobile ? 48 : 36} 
                  />
                  <h3 className={`
                    text-xl font-bold text-gray-800
                    ${isMobile ? 'text-center' : ''}
                  `}>
                    {product.name}
                  </h3>
                </div>
                
                <p className={`
                  text-sm text-gray-600 mb-4
                  ${isMobile ? 'text-center' : ''}
                `}>
                  {product.description}
                </p>
                
                <div className={`
                  text-2xl font-bold text-blue-600
                  ${isMobile ? 'text-center' : ''}
                `}>
                  {firstNumber} + {secondNumber} = {totalDiamonds} Diamonds
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
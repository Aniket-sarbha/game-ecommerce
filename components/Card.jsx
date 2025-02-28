"use client";

import React, { useState, useEffect } from 'react';

/**
 * Card component that fetches data and displays it in a visually appealing format.
 * 
 * @param {Object} props - Component props.
 * @param {string|number} props.id - Card ID to fetch data for.
 * @param {string} [props.defaultTitle] - Default title to show while loading or if data fails.
 * @param {string} [props.defaultImageUrl] - Default image URL to use if none is provided from API.
 * @param {Function} [props.onClick] - Optional click handler for the card.
 * @returns {React.Component} Card component.
 */
const Card = ({ 
  id, 
  defaultTitle = "Dragon's Dogma 2", 
  defaultImageUrl = "images/download.jpeg", 
  onClick 
}) => {
  // State to store the fetched card data
  const [cardData, setCardData] = useState(null);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to track error status
  const [error, setError] = useState(null);

  // Effect to fetch card data when the component mounts or when id changes
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true);
      try {
        // Use proper template literal syntax for the API endpoint
        const response = await fetch(`/api/cards/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch card data');
        }
        
        const data = await response.json();
        
        // Since the API returns only gameID and gameName, ensure image is set to default if missing
        if (!data.image || data.image.trim() === '') {
          data.image = defaultImageUrl;
        }
        
        setCardData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching card:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCardData();
    }
  }, [id, defaultImageUrl]);

  // Display a loading state
  if (isLoading) {
    return (
      <div className="w-60  rounded-lg overflow-hidden bg-gray-100 shadow-md p-4 animate-pulse">
        <div className="h-[275] bg-gray-200 rounded mb-4"></div>
        <div className="h-5 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="w-full max-w-xs rounded-lg overflow-hidden bg-red-50 shadow-md p-4">
        <p className="text-red-500">Error loading card: {error}</p>
      </div>
    );
  }

  // When data is successfully loaded, render the card
  return (
    <div 
      className="w-60 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      
      <div className="w-auto h-[275] ">
        <img 
          src={cardData?.image || defaultImageUrl} 
          alt={`${cardData?.gameName || 'Card'} image`} 
          className="w-full h-full object-fit"
        />
      </div>
      <div className="flex p-4 font-bold text-lg justify-center bg-gradient-to-r from-black via-red-900 to-red-600">
        {cardData?.gameName || defaultTitle}
      </div>
    </div>
  );
};

export default Card;
// app/stores/slug]/components/Banner.jsx

"use client";

import React from 'react';

const Banner = ({storeData}) => {

  const formattedName = decodeURIComponent(storeData.name)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    
  return (
    <div 
      className="mt-[10rem] relative max-w-6xl h-[50vh] mx-auto overflow-hidden rounded-xl shadow-lg"
      role="banner"
      aria-label={`Profile hero for ${storeData.name}`}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* Image with lazy loading for performance */}
        <img
          src={storeData.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          aria-hidden="true"
        />
        {/* Semi-transparent dark overlay */}
        <div 
          className="absolute inset-0 bg-black/40"
          aria-hidden="true"
        ></div>
      </div>

      {/* Profile container positioned at bottom left */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col sm:flex-row items-center sm:items-start max-w-full sm:max-w-md px-4 sm:px-0">
        {/* Profile image with rounded corners - added flex-shrink-0 to prevent shrinking */}
        <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex-shrink-0 rounded-lg overflow-hidden border-2 border-white shadow-lg transition-transform duration-300 hover:scale-105">
          <img 
            src={storeData.image} 
            alt={`${storeData.name}'s profile`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
            }}
          />
        </div>
        
        {/* Name and bio - improved text handling for long names */}
        <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left overflow-hidden">
          <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-3 transition-colors duration-300 hover:text-gray-200">
             {formattedName}
          </h1>
          <p className="text-xs md:text-sm text-white/90 max-w-[250px] md:max-w-[300px] drop-shadow-md">
            {storeData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
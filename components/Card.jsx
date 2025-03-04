"use client";

import React from "react";

const Card = ({ id, defaultTitle, defaultImageUrl, onClick }) => {
  return (
    <div 
      className="w-60 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-auto h-[275] ">
        <img 
          src={defaultImageUrl} 
          alt={`${defaultTitle} image`} 
          className="w-full h-full object-fit"
        />
      </div>
      <div className="flex p-4 font-bold text-lg justify-center bg-gradient-to-r from-black via-red-900 to-red-600">
        {defaultTitle}
      </div>
    </div>
  );
};

export default Card;
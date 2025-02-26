"use client";

import React, { useState } from "react";

const Popularitems = () => {
  const [startIndex, setStartIndex] = useState(0);

  // Array of photo URLs - replace these with your actual image URLs
  const photoUrls = [
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/500px.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/adobe.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/airbnb.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/amazon.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/android.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/apple.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/behance.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/bootstrap.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/cloudflare.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/codepen.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/dribbble.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/dropbox.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/facebook.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/github.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/gitlab.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/google.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/instagram.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/linkedin.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/spotify.svg",
    "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/twitter.svg",
  ];

  // Create an array of 20 images using the photoUrls
  const images = photoUrls.map((url, i) => ({
    id: i + 1,
    src: url,
    alt: `Image ${i + 1}`,
  }));

  const totalImages = images.length;
  const visibleImages = 7;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 bg-white rounded-3xl p-4 bg-gradient-to-r from-black via-gray-900 to-red-900">
      <div className="relative">
        <div className="flex items-center mb-4 justify-center">
          <h2 className="text-xl font-bold text-white">Most Popular Items</h2>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${startIndex * (100 / visibleImages)}%)`,
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="flex-none px-1"
                style={{ width: `${100 / visibleImages}%` }}
              >
                <div className="border overflow-hidden bg-gray-100 h-full flex flex-col rounded-3xl">
                  <div className="flex-grow flex items-center justify-center p-4">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="p-2 text-center text-sm font-medium bg-gray-50">
                    {image.alt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(totalImages / visibleImages) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * visibleImages)}
                className={`mx-1 w-3 h-3 rounded-full ${
                  i * visibleImages <= startIndex &&
                  startIndex < (i + 1) * visibleImages
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Popularitems;

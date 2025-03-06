"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardsGrid from "./CardsGrid";

// Constants

const ImageGallery = () => {
  const [activeTab, setActiveTab] = useState("nature");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageCache, setImageCache] = useState(new Set());

  // Set default values since we removed the gallery images
  const filteredImages = [];
  const totalPages = 1;
  const currentImages = [];

  // Handle tab change
  const handleTabChange = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    setCurrentPage(1);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setIsLoading(true);
    setCurrentPage(page);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Preload images for better UX
  const preloadImages = useCallback(
    (images) => {
      images.forEach((image) => {
        if (!imageCache.has(image.src)) {
          const img = new Image();
          img.src = image.src;
          img.onload = () => {
            setImageCache((prev) => new Set(prev).add(image.src));
          };
          img.onerror = () => {
            setError(`Failed to load image: ${image.alt}`);
          };
        }
      });
    },
    [imageCache]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePageChange(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        handlePageChange(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, totalPages]);

  // Preload images when tab or page changes
  useEffect(() => {
    preloadImages(currentImages);
  }, [activeTab, currentPage, preloadImages, currentImages]);

  // Debounced window resize handler
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        // Adjust layout if needed based on screen size
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle image load error
  const handleImageError = (e) => {
    const target = e.target;
    target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13"; // Fallback image
    target.alt = "Image failed to load";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8  mt-8  ">
      {/* Tab Navigation */}
      <div className="justify-center flex ">
        <div
          className="mb-8 bg-white flex justify-center rounded-3xl max-w-4xl"
          aria-label="Gallery categories"
        >
          <div
            role="tablist"
            className="flex flex-wrap border-b border-gray-200 rounded-3xl"
          >
            <button
              role="tab"
              aria-selected={activeTab === "nature"}
              aria-controls="nature-panel"
              id="nature-tab"
              className="py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300"
              onClick={() => handleTabChange("nature")}
            >
              Games
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "architecture"}
              aria-controls="architecture-panel"
              id="architecture-tab"
              className="py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300"
              onClick={() => handleTabChange("architecture")}
            >
              Voucher
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "food"}
              aria-controls="food-panel"
              id="food-tab"
              className="py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 "
              onClick={() => handleTabChange("food")}
            >
              PLN
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "travel"}
              aria-controls="travel-panel"
              id="travel-tab"
              className="py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 "
              onClick={() => handleTabChange("travel")}
            >
              Live Aps
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            className="ml-2 text-red-700 font-bold"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="relative">
        {/* Nature Tab Panel */}
        <section
          id="nature-panel"
          role="tabpanel"
          aria-labelledby="nature-tab"
          className={activeTab === "nature" ? "block" : "hidden"}
        >
          <div>
            <CardsGrid />
          </div>
        </section>

        {/* Architecture Tab Panel */}
        <section
          id="architecture-panel"
          role="tabpanel"
          aria-labelledby="architecture-tab"
          className={activeTab === "architecture" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative pb-[66.67%] bg-gray-100">
                  <img
                    src={`${image.src}?w=600&auto=format&q=75`}
                    alt={image.alt}
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{image.alt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Food Tab Panel */}
        <section
          id="food-panel"
          role="tabpanel"
          aria-labelledby="food-tab"
          className={activeTab === "food" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative pb-[66.67%] bg-gray-100">
                  <img
                    src={`${image.src}?w=600&auto=format&q=75`}
                    alt={image.alt}
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{image.alt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Travel Tab Panel */}
        <section
          id="travel-panel"
          role="tabpanel"
          aria-labelledby="travel-tab"
          className={activeTab === "travel" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative pb-[66.67%] bg-gray-100">
                  <img
                    src={`${image.src}?w=600&auto=format&q=75`}
                    alt={image.alt}
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{image.alt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImageGallery;

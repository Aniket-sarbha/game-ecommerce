"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import CardsGrid from "./CardsGrid";

// Constants
const IMAGES_PER_PAGE = 9;

const ImageGallery = () => {
  const [activeTab, setActiveTab] = useState("nature");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageCache, setImageCache] = useState(new Set());

  // Separate states for each tab's data
  const [natureImages, setNatureImages] = useState([]);
  const [architectureImages, setArchitectureImages] = useState([]);
  const [foodImages, setFoodImages] = useState([]);
  const [travelImages, setTravelImages] = useState([]);

  // Get current tab's images based on active tab
  const getCurrentTabImages = () => {
    switch (activeTab) {
      case "nature":
        return natureImages;
      case "architecture":
        return architectureImages;
      case "food":
        return foodImages;
      case "travel":
        return travelImages;
      default:
        return [];
    }
  };

  // Get the filtered images for the current tab
  const filteredImages = getCurrentTabImages();
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  // Get current page images
  const currentImages = filteredImages.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  // Fetch data for each tab
  const fetchTabData = async (tab) => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace these with your actual API calls to different schemas
      switch (tab) {
        case "nature":
          // Fetch nature images from API
          const natureData = await fetchNatureData();
          setNatureImages(natureData);
          break;
        case "architecture":
          // Fetch architecture images from API
          const architectureData = await fetchArchitectureData();
          setArchitectureImages(architectureData);
          break;
        case "food":
          // Fetch food images from API
          const foodData = await fetchFoodData();
          setFoodImages(foodData);
          break;
        case "travel":
          // Fetch travel images from API
          const travelData = await fetchTravelData();
          setTravelImages(travelData);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to load ${tab} images: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API functions - replace with your actual API calls
  const fetchNatureData = async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array(12)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              src: `https://images.unsplash.com/photo-${1470071459604 + i}`,
              alt: `Nature image ${i + 1}`,
            }))
        );
      }, 500);
    });
  };

  const fetchArchitectureData = async () => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array(12)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              src: `https://images.unsplash.com/photo-${1616128618694 + i}`,
              alt: `Architecture image ${i + 1}`,
            }))
        );
      }, 500);
    });
  };

  const fetchFoodData = async () => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array(12)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              src: `https://images.unsplash.com/photo-${1504674900247 + i}`,
              alt: `Food image ${i + 1}`,
            }))
        );
      }, 500);
    });
  };

  const fetchTravelData = async () => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array(12)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              src: `https://images.unsplash.com/photo-${1530521954074 + i}`,
              alt: `Travel image ${i + 1}`,
            }))
        );
      }, 500);
    });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);

    // Fetch data if not already loaded
    if (
      (tab === "nature" && natureImages.length === 0) ||
      (tab === "architecture" && architectureImages.length === 0) ||
      (tab === "food" && foodImages.length === 0) ||
      (tab === "travel" && travelImages.length === 0)
    ) {
      fetchTabData(tab);
    }
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

  // Initial data loading
  useEffect(() => {
    fetchTabData("nature");
  }, []);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="mb-8 flex justify-center" aria-label="Gallery categories">
        <div role="tablist" className="flex flex-wrap border-b border-gray-200">
          <button
            role="tab"
            aria-selected={activeTab === "nature"}
            aria-controls="nature-panel"
            id="nature-tab"
            className={`py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 ${
              activeTab === "nature"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("nature")}
          >
            Nature
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "architecture"}
            aria-controls="architecture-panel"
            id="architecture-tab"
            className={`py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 ${
              activeTab === "architecture"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("architecture")}
          >
            Architecture
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "food"}
            aria-controls="food-panel"
            id="food-tab"
            className={`py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 ${
              activeTab === "food"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("food")}
          >
            Food
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "travel"}
            aria-controls="travel-panel"
            id="travel-tab"
            className={`py-3 px-6 font-medium text-sm focus:outline-none transition-all duration-300 ${
              activeTab === "travel"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("travel")}
          >
            Travel
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Tab Content */}
      <div className="relative">
        {/* Nature Tab Panel - Kept as is per requirement */}
        <section
          id="nature-panel"
          role="tabpanel"
          aria-labelledby="nature-tab"
          className={activeTab === "nature" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <div
                key={image.id}
                className="relative flex items-center justify-center"
              >
                {/* <CardsGrid id = {1}/> */}
              </div>
            ))}
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

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="mx-4 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 mx-1 rounded-full focus:outline-none transition-colors duration-300 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;

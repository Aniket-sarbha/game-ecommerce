"use client";

import React, { useState, Suspense, lazy } from "react";


// Use lazy loading for CardsGrid
const CardsGrid = lazy(() => import("./CardsGrid"));

// Simple fallback for lazy loaded components
const TabLoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-white text-xl">Loading tab content...</div>
  </div>
);

const ImageGallery = () => {
  const [activeTab, setActiveTab] = useState("nature");

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
      {/* Tab Navigation */}
      <div className="justify-center flex">
        <div
          className="mb-8 bg-white flex justify-center rounded-3xl max-w-4xl"
          aria-label="Gallery categories"
        >
          <div
            role="tablist"
            className="flex border-b border-gray-200 rounded-3xl"
          >
            <button
              role="tab"
              aria-selected={activeTab === "nature"}
              aria-controls="nature-panel"
              id="nature-tab"
              className={`py-3 px-6 font-medium text-sm  transition-all duration-300  ${
                activeTab === "nature" ? "bg-red-500 text-white rounded-3xl" : ""
              }`}
              onClick={() => handleTabChange("nature")}
            >
              Games
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "architecture"}
              aria-controls="architecture-panel"
              id="architecture-tab"
              className={`py-3 px-6 font-medium text-sm  transition-all duration-300 ${
                activeTab === "architecture" ? "bg-red-500 text-white rounded-3xl" : ""
              }`}
              onClick={() => handleTabChange("architecture")}
            >
              Voucher
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "food"}
              aria-controls="food-panel"
              id="food-tab"
              className={`py-3 px-6 font-medium text-sm  transition-all duration-300 ${
                activeTab === "food" ? "bg-red-500 text-white rounded-3xl" : ""
              }`}
              onClick={() => handleTabChange("food")}
            >
              PLN
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "travel"}
              aria-controls="travel-panel"
              id="travel-tab"
              className={`py-3 px-6 font-medium text-sm  transition-all duration-300 ${
                activeTab === "travel" ? "bg-red-500 text-white rounded-3xl" : ""
              }`}
              onClick={() => handleTabChange("travel")}
            >
              Live Apps
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {/* Nature Tab Panel */}
        <section
          id="nature-panel"
          role="tabpanel"
          aria-labelledby="nature-tab"
          className={activeTab === "nature" ? "block" : "hidden"}
        >
          <Suspense fallback={<TabLoadingFallback />}>
            <CardsGrid />
          </Suspense>
        </section>

        {/* Other tab panels would use similar pattern */}
        <section
          id="architecture-panel"
          role="tabpanel"
          aria-labelledby="architecture-tab"
          className={activeTab === "architecture" ? "block" : "hidden"}
        >
          <div className="flex justify-center items-center h-64">
            <p className="text-white">Voucher content coming soon</p>
          </div>
        </section>

        <section
          id="food-panel"
          role="tabpanel"
          aria-labelledby="food-tab"
          className={activeTab === "food" ? "block" : "hidden"}
        >
          <div className="flex justify-center items-center h-64">
            <p className="text-white">PLN content coming soon</p>
          </div>
        </section>

        <section
          id="travel-panel"
          role="tabpanel"
          aria-labelledby="travel-tab"
          className={activeTab === "travel" ? "block" : "hidden"}
        >
          <div className="flex justify-center items-center h-64">
            <p className="text-white">Live Apps content coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImageGallery;
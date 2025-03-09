"use client";

import { useState, useEffect } from "react";
import Card from "./Card";

const CardsGrid = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust the number of cards per page

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");

        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }

        const data = await response.json();
        setStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-4 rounded-lg bg-red-50 text-red-600">
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No stores found</h3>
          <p className="text-gray-500">Check back later for new stores</p>
        </div>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(stores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStores = stores.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
        {paginatedStores.map((store) => (
          <Card key={store.id} store={store} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-6 w-full">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="min-w-[80px] px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium text-sm sm:text-base px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="min-w-[80px] px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CardsGrid;

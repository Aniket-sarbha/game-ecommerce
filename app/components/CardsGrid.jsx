"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CardsGrid() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const response = await fetch(`/api/games?page=${currentPage}&pageSize=${pageSize}`);

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data.games);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError("Error loading games. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [currentPage]); // Re-fetch when page changes

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="max-w-6xl flex flex-col justify-center items-center mx-auto mt-8">
        <div className="grid grid-cols-2 gap-3 p-4 xs:grid-cols-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-3 xl:gap-6">
          {/* Generate skeleton cards based on pageSize */}
          {Array(pageSize).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col items-center mb-4 overflow-hidden border-2 border-gray-700 shadow-lg rounded-lg">
              {/* Image skeleton */}
              <div className="w-full aspect-[0.9] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
              
              {/* Title skeleton */}
              <div className="m-1 text-center w-full p-2">
                <div className="h-4 w-3/4 mx-auto rounded-md bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Skeleton pagination */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center rounded-md bg-gray-800 p-1">
            <div className="w-20 h-7 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded-sm"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="text-center p-8 text-white">{error}</div>;

  return (
    <>
      <div className="max-w-6xl flex flex-col justify-center items-center mx-auto mt-8">
        <div className="grid grid-cols-2 gap-3 p-4 xs:grid-cols-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-3 xl:gap-6">
          {games.map((game) => (
            <div key={game.gameId} className="flex flex-col items-center mb-4 overflow-hidden border-2 border-white shadow-lg transition-transform duration-300 hover:scale-105 rounded-lg cursor-pointer">
              <div>
                <div className="w-full aspect-[0.9]">
                  <img
                    src="/images/download.jpeg"
                    alt={`${game.gameName} image`}
                    className="w-full h-full object-fit"
                  />
                </div>
              </div>
              <div className="m-1 text-center w-full">
                <h3 className="text-white text-sm sm:text-base px-2">
                  {game.gameName}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Compact Pagination controls */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center rounded-md bg-gray-800 p-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded-sm focus:outline-none ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-xs text-white">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded-sm focus:outline-none ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Only show page number buttons if there are not too many pages */}
          {totalPages > 1 && totalPages <= 5 && (
            <div className="ml-4 inline-flex rounded-md bg-gray-800 p-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-6 h-6 mx-0.5 rounded-sm text-xs focus:outline-none transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-white hover:bg-gray-700"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
          
          {/* For many pages, use a more compact approach */}
          {totalPages > 5 && (
            <div className="ml-4 inline-flex rounded-md bg-gray-800 p-1">
              {/* First page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`w-6 h-6 mx-0.5 rounded-sm text-xs focus:outline-none ${
                  currentPage === 1 ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700"
                }`}
              >
                1
              </button>
              
              {/* Ellipsis for skipped pages at beginning */}
              {currentPage > 3 && (
                <span className="w-6 h-6 flex items-center justify-center text-white">...</span>
              )}
              
              {/* Current page and adjacent pages */}
              {Array.from(
                { length: Math.min(3, totalPages) }, 
                (_, i) => Math.min(Math.max(currentPage - 1 + i, 2), totalPages - 1)
              )
                .filter((page, i, arr) => arr.indexOf(page) === i && page > 1 && page < totalPages)
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-6 h-6 mx-0.5 rounded-sm text-xs focus:outline-none ${
                      currentPage === page ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              
              {/* Ellipsis for skipped pages at end */}
              {currentPage < totalPages - 2 && (
                <span className="w-6 h-6 flex items-center justify-center text-white">...</span>
              )}
              
              {/* Last page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`w-6 h-6 mx-0.5 rounded-sm text-xs focus:outline-none ${
                  currentPage === totalPages ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700"
                }`}
              >
                {totalPages}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
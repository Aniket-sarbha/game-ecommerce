"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CardsGrid() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;
  
  // Use AbortController for fetch requests
  const fetchGames = useCallback(async (page) => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    try {
      setLoading(true);
      const response = await fetch(
        `/api/games?page=${page}&pageSize=${pageSize}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }

      const data = await response.json();
      setGames(data.games);
      setTotalPages(data.pagination.totalPages);
      
      // Cache the results in sessionStorage
      sessionStorage.setItem(
        `games_page_${page}`, 
        JSON.stringify({
          games: data.games,
          pagination: data.pagination,
          timestamp: Date.now()
        })
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError("Error loading games. Please try again later.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
    
    return controller;
  }, [pageSize]);

  // Use session storage for caching
  useEffect(() => {
    let controller;
    
    const loadGames = async () => {
      // Try to get cached data first
      const cachedData = sessionStorage.getItem(`games_page_${currentPage}`);
      
      if (cachedData) {
        const { games, pagination, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        
        // Use cache if it's less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          setGames(games);
          setTotalPages(pagination.totalPages);
          setLoading(false);
          return;
        }
      }
      
      // Fetch fresh data if cache is missing or stale
      controller = await fetchGames(currentPage);
    };

    loadGames();
    
    // Cleanup function to abort fetch if component unmounts or dependencies change
    return () => {
      if (controller) controller.abort();
    };
  }, [currentPage, fetchGames]);

  // Prefetch next page data when user is close to pagination
  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const cachedData = sessionStorage.getItem(`games_page_${nextPage}`);
      
      if (!cachedData) {
        // Use a small timeout to avoid immediate loading
        const timer = setTimeout(() => {
          fetch(`/api/games?page=${nextPage}&pageSize=${pageSize}`)
            .then(res => res.json())
            .then(data => {
              sessionStorage.setItem(
                `games_page_${nextPage}`, 
                JSON.stringify({
                  games: data.games,
                  pagination: data.pagination,
                  timestamp: Date.now()
                })
              );
            })
            .catch(err => console.log("Prefetch error:", err));
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentPage, totalPages, pageSize]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Get the grid element and scroll to it instead of the page top
    const gridElement = document.querySelector('.grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Use loading spinner for loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 flex justify-center items-center min-h-[400px]">
        <div className="loader-container">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-white">Loading games...</p>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="text-center p-8 text-white">{error}</div>;

  return (
    <>
      <div className="max-w-6xl flex flex-col justify-center items-center mx-auto mt-8">
        <div className="grid grid-cols-3 gap-2 p-3 xs:grid-cols-4 sm:grid-cols-5 sm:gap-3 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-6 xl:gap-4">
          {games.map((game) => (
            <div key={game.gameId} className="flex flex-col items-center mb-2 overflow-hidden border border-blue-300/50 bg-gray-900/80 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-700/40 hover:border-blue-400 rounded-lg cursor-pointer max-w-[150px]">
              <div className="w-full">
                <div className="w-full aspect-[0.8] relative">
                  <img
                    src="/images/download.jpeg"
                    alt={`${game.gameName} image`}
                    className="w-full h-full object-cover brightness-[1.02] hover:brightness-110 transition-all"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-20"></div>
                </div>
              </div>
              <div className="py-1 px-0.5 text-center w-full bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="text-white text-xs sm:text-sm px-1 flex justify-center font-medium ">
                  {game.gameName}
                </div>
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
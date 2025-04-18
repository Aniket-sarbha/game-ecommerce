"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const StoreCard = ({ name, image }) => {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  // Format the store name for display (capitalize and replace underscores with spaces)
  const formattedName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleCardClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      // If user is logged in, navigate to store page
      router.push(`/stores/${encodeURIComponent(name)}`);
    } else {
      // If user is not logged in, redirect to login page
      router.push(`/login?callbackUrl=${encodeURIComponent(`/stores/${encodeURIComponent(name)}`)}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group flex-shrink-0 w-[180px] md:w-[220px] mx-3 perspective-800 cursor-pointer"
    >
      <div className="relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-10 group-hover:scale-105">
        {/* Card body with 3D effect */}
        <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50">
          {/* Colorful top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Image with overlay */}
          <div className="relative h-28 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${image || "/images/placeholder-game.webp"})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            
            {/* Game icon in circle */}
            <div className="absolute -bottom-6 right-4 w-12 h-12 rounded-full bg-gray-900 p-0.5 border-2 border-purple-500 shadow-lg shadow-purple-500/20">
              <div 
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image || "/images/placeholder-game.webp"})` }}
              ></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 pt-2">
            <h3 className="font-bold text-white truncate text-sm">
              {formattedName}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">Game Store</span>
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                {isAuthenticated ? "Explore" : "Login to view"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Reflection effect */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-purple-500/10 to-transparent blur-sm transform translate-y-1"></div>
      </div>
    </div>
  );
};

const Popularitems = () => {
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const fetchRandomStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("Failed to fetch stores");
        
        const allStores = await response.json();
        
        // Get 20 random stores
        const shuffled = [...allStores].sort(() => 0.5 - Math.random());
        const randomStores = shuffled.slice(0, 20);
        
        setStoreList(randomStores);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setIsLoading(false);
      }
    };

    fetchRandomStores();
  }, []);

  // Auto-scrolling animation
  useEffect(() => {
    const startScrolling = () => {
      if (!scrollContainerRef.current || !isAutoScrolling) return;
      
      const scroll = () => {
        if (!scrollContainerRef.current || !isAutoScrolling) return;
        
        // Scroll 1 pixel per frame for smooth motion
        scrollContainerRef.current.scrollLeft += 1;
        
        // Reset scroll position when reaching the end to create infinite scroll effect
        if (scrollContainerRef.current.scrollLeft >= 
            (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)) {
          // Jump back to start (will appear seamless if we duplicate some cards)
          scrollContainerRef.current.scrollLeft = 0;
        }
        
        animationRef.current = requestAnimationFrame(scroll);
      };
      
      animationRef.current = requestAnimationFrame(scroll);
    };
    
    // Start scrolling after a small delay to allow component to fully render
    const timeoutId = setTimeout(() => {
      startScrolling();
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScrolling, storeList]);

  // Toggle auto-scrolling on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Prepare items for continuous scrolling effect
  // Duplicate first items at the end to create seamless loop effect
  const prepareItems = (items) => {
    if (!items || items.length === 0) return [];
    // Add duplicate items at the end for seamless looping
    return [...items, ...items.slice(0, 5)];
  };
  
  const displayItems = isLoading ? [] : prepareItems(storeList);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 relative">
      {/* Background blur effect for glass morphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
      
      {/* Glass container */}
      <div className="relative rounded-3xl p-6 backdrop-blur-lg bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-800/50 shadow-xl">
        {/* Glass shine effect */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center mb-6 justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="mr-2">🔥</span>
              Most Popular Items
              <div className="ml-3 h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </h2>
            
            <div className="flex gap-2">
              <button 
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-all shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-all shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div 
            className="overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={scrollContainerRef}
              className="flex pb-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                // Loading skeleton
                Array(8).fill(0).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-[180px] md:w-[220px] mx-3">
                    <div className="rounded-xl bg-gray-800/70 overflow-hidden animate-pulse">
                      <div className="h-1.5 w-full bg-gray-700/70"></div>
                      <div className="h-28 bg-gray-700/50"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-700/70 rounded w-3/4 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-700/70 rounded w-1/3"></div>
                          <div className="h-6 bg-purple-700/30 rounded-full w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : displayItems.length > 0 ? (
                displayItems.map((store, index) => (
                  <StoreCard 
                    key={`${store.id}-${index}`} // Unique key for duplicated items
                    name={store.name}
                    image={store.image} 
                  />
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No stores available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* 3D perspective utilities */
        .perspective-800 {
          perspective: 800px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-10:hover {
          transform: rotateY(10deg);
        }
      `}</style>
    </div>
  );
};

export default Popularitems;

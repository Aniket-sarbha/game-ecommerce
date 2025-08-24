"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Star, Zap, TrendingUp, Gamepad2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Card from "@/app/components/Card";
import AnimatedGrid from "@/app/components/AnimatedGrid";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  
  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stores");
        
        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        
        const data = await response.json();
        setStores(data);
        setFilteredStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, []);
  
  // Filter and search functionality
  useEffect(() => {
    let filtered = [...stores];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter (if categories are implemented in the future)
    if (selectedCategory !== "all") {
      // This can be extended when categories are added to the database
      filtered = filtered.filter((store) => store.category === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "popularity":
          // This would require a popularity field in the database
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredStores(filtered);
  }, [stores, searchQuery, selectedCategory, sortBy]);
  
  // Format store name for display
  const formatStoreName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#030303] pt-20">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center p-8 rounded-lg glass-effect bg-red-900/30 border border-red-700 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-red-200">Something went wrong</h2>
              <p className="text-red-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      {/* Animated Background */}
      <AnimatedGrid />
      
      <div className="min-h-screen bg-[#030303] pt-20 relative">
        {/* Background Accents */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#1a1a1a_0%,#0d0d0d_60%,#050505_100%)]" />
          <div className="absolute inset-0 opacity-40 mix-blend-plus-lighter bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.12),transparent_55%)]" />
        </div>
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-medium">Game Stores</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Browse All
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}Game Stores
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover amazing deals on your favorite games. Find discounted currencies, 
                items, and exclusive offers from top gaming platforms.
              </p>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="popularity">Sort by Popularity</option>
                  </select>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between mb-8 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>
                    <span className="font-semibold text-white">{filteredStores.length}</span> stores available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Top rated gaming platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Instant delivery</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-indigo-400 border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <p className="text-gray-300 text-lg">Loading game stores...</p>
              </div>
            </div>
          )}
          
          {/* Stores Grid/List */}
          {!loading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {filteredStores.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto w-16 h-16 mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No stores found</h3>
                  <p className="text-gray-400">
                    {searchQuery
                      ? `No stores match "${searchQuery}". Try adjusting your search.`
                      : "No stores are currently available."}
                  </p>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {filteredStores.map((store) => (
                        <Card key={store.id} store={store} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredStores.map((store) => (
                        <div
                          key={store.id}
                          className="group flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800/70 transition-all cursor-pointer"
                          onClick={() => window.location.href = `/stores/${encodeURIComponent(store.name)}`}
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <div
                              style={{ backgroundImage: `url(${store.image})` }}
                              className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                              {formatStoreName(store.name)}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Click to explore store and find great deals
                            </p>
                          </div>
                          <div className="flex items-center text-indigo-400">
                            <span className="text-sm font-medium mr-2">Explore</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default StoresPage;

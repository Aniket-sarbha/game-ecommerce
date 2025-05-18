"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Menu, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image"; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Reset image error state when session changes
  useEffect(() => {
    if (session) {
      setImageError(false);
    }
  }, [session]);

  // Log session data for debugging
  // useEffect(() => {
  //   if (session) {
  //     console.log("Session user data:", session.user);
  //   }
  // }, [session]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Search for stores as user types
  useEffect(() => {
    const fetchStores = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("Failed to fetch stores");

        const stores = await response.json();
        const filteredStores = stores
          .filter((store) =>
            store.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 6); // Limit to 6 results

        setSearchResults(filteredStores);
      } catch (error) {
        console.error("Error searching stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchStores();
    }, 300); // Add debounce to prevent excessive API calls

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close search results and profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      
      // Only close profile menu if clicking outside AND not clicking the toggle button itself
      if (profileRef.current && 
          !profileRef.current.contains(event.target) &&
          !event.target.closest('[aria-haspopup="true"]')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigating to a store page
  const navigateToStore = (storeName) => {
    setSearchQuery("");
    setShowResults(false);
    router.push(`/stores/${encodeURIComponent(storeName)}`);
  };

  // Handle user logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Format store name for display
  const formatStoreName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Highlight matching text in search results
  const highlightMatch = (text) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-100 text-gray-900 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pt-4">
      {/* Navbar */}
      <nav className="justify-center max-w-5xl mx-auto">
        {/* Desktop Navigation - Rounded top when menu is open, fully rounded when closed */}
        <div
          className={`bg-gradient-to-r from-black via-gray-900 to-red-900 ${
            isMenuOpen ? "rounded-t-md" : "rounded-3xl"
          } shadow-lg shadow-purple-900/20 glass-effect`}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="ml-2 text-white font-bold text-xl gradient-text">
                    Yokcash
                  </span>
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div
                className="hidden md:block flex-1 max-w-sm mx-4"
                ref={searchRef}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search
                      className={`h-5 w-5 ${
                        isLoading
                          ? "text-blue-400 animate-pulse"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:text-white focus:placeholder-gray-400 transition duration-200 ease-in-out rounded-full"
                    aria-label="Search"
                  />

                  {/* Search Results Dropdown */}
                  {showResults && (
                    <div className="absolute mt-2 w-full bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl max-h-[320px] overflow-auto z-50 border border-gray-700 transform transition-all duration-200">
                      {isLoading && (
                        <div className="py-4 px-3 text-center">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
                          <p className="mt-2 text-sm text-gray-400">
                            Searching stores...
                          </p>
                        </div>
                      )}

                      {!isLoading && searchResults.length > 0 && (
                        <ul className="py-2">
                          {searchResults.map((store) => (
                            <li
                              key={store.id}
                              className="px-4 py-2.5 hover:bg-gradient-to-r from-gray-800 to-gray-700 cursor-pointer transition-colors duration-150 group"
                              onClick={() => navigateToStore(store.name)}
                            >
                              <div className="flex items-center gap-3">
                                {store.image && (
                                  <div
                                    className="w-8 h-8 bg-cover bg-center rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-indigo-500 transition-all duration-200 shadow-sm"
                                    style={{
                                      backgroundImage: `url(${store.image})`,
                                    }}
                                  ></div>
                                )}
                                <div>
                                  <p className="text-gray-100 font-medium">
                                    {highlightMatch(
                                      formatStoreName(store.name)
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Click to view store
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {!isLoading &&
                        searchQuery.trim().length >= 2 &&
                        searchResults.length === 0 && (
                          <div className="py-4 px-3 text-center">
                            <p className="text-sm text-gray-400">
                              No stores found matching "{searchQuery}"
                            </p>
                          </div>
                        )}

                      {!isLoading && searchQuery.trim().length < 2 && (
                        <div className="py-4 px-3 text-center">
                          <p className="text-sm text-gray-400">
                            Type at least 2 characters to search
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Navigation Items - Profile or Login */}
              <div className="hidden md:flex items-center space-x-4 relative" ref={profileRef}>
                {isAuthenticated ? (
                  <>
                    <div className="relative">
                      <button
                        onClick={toggleProfileMenu}
                        className="flex items-center space-x-2 cursor-pointer focus:outline-none group relative bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all duration-200"
                        aria-expanded={showProfileMenu}
                        aria-haspopup="true"
                      >
                        <div 
                          className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/40 group-hover:border-indigo-400 transition-all duration-200 shadow-glow"
                        >
                          {session?.user?.image && !imageError ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || "Profile"}
                              className="w-full h-full object-cover"
                              onError={() => setImageError(true)}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                              {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-200 hidden sm:inline-block">
                          {session?.user?.name?.split(' ')[0] || "Account"} ▼
                        </span>
                      </button>

                      {/* Profile Dropdown Menu */}
                      {showProfileMenu && (
                        <div 
                          className="fixed right-4 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-1 z-[999] border border-gray-700 glass-effect"
                          style={{
                            top: "4rem", 
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)"
                          }}
                        >                          <div className="px-4 py-2 border-b border-gray-700">
                            <p className="text-sm font-medium text-gray-100 truncate">
                              {session?.user?.name || "User"}
                            </p>
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400 truncate">
                                {session?.user?.email || ""}
                              </p>
                              {session?.user?.role && session.user.role !== 'pending' && (
                                <p className="text-xs text-indigo-400 mt-1">
                                  Role: {session.user.role === 'buyer' ? 'Buyer' : 'Seller'}
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            href="/account"
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                          >
                            <Settings size={16} />
                            My Account
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* Direct Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-200"
                      aria-label="Log out"
                    >
                      <LogOut size={18} />
                      <span className="sr-only md:not-sr-only md:inline-block text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-indigo-300 transition-colors"
                    href="/login"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="ml-2 inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-indigo-900/30 transition duration-150 ease-in-out"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-black via-gray-900 to-red-900 rounded-b-lg shadow-lg glass-effect">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-2 py-2" ref={searchRef}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search
                      className={`h-5 w-5 ${
                        isLoading
                          ? "text-blue-400 animate-pulse"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="Search stores..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:text-white focus:placeholder-gray-400 transition duration-200 rounded-full"
                    aria-label="Search"
                  />

                  {/* Mobile Search Results Dropdown */}
                  {showResults && (
                    <div className="absolute mt-2 w-full bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl max-h-[320px] overflow-auto z-50 border border-gray-700 transform transition-all duration-200">
                      {isLoading && (
                        <div className="py-4 px-3 text-center">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
                          <p className="mt-2 text-sm text-gray-400">
                            Searching stores...
                          </p>
                        </div>
                      )}

                      {!isLoading && searchResults.length > 0 && (
                        <ul className="py-2">
                          {searchResults.map((store) => (
                            <li
                              key={store.id}
                              className="px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 cursor-pointer transition-colors duration-150 group"
                              onClick={() => navigateToStore(store.name)}
                            >
                              <div className="flex items-center gap-3">
                                {store.image && (
                                  <div
                                    className="w-8 h-8 bg-cover bg-center rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-indigo-500 transition-all duration-200 shadow-sm"
                                    style={{
                                      backgroundImage: `url(${store.image})`,
                                    }}
                                  ></div>
                                )}
                                <div>
                                  <p className="text-gray-100 font-medium">
                                    {highlightMatch(
                                      formatStoreName(store.name)
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Click to view store
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {!isLoading &&
                        searchQuery.trim().length >= 2 &&
                        searchResults.length === 0 && (
                          <div className="py-4 px-3 text-center">
                            <p className="text-sm text-gray-400">
                              No stores found matching "{searchQuery}"
                            </p>
                          </div>
                        )}

                      {!isLoading && searchQuery.trim().length < 2 && (
                        <div className="py-4 px-3 text-center">
                          <p className="text-sm text-gray-400">
                            Type at least 2 characters to search
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex flex-col space-y-2 px-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-700 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/40">
                        {session?.user?.image && !imageError ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "Profile"}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
                          </div>
                        )}
                      </div>                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {session?.user?.name || "User"}
                        </p>
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-300 truncate">
                            {session?.user?.email || ""}
                          </p>
                          {session?.user?.role && session.user.role !== 'pending' && (
                            <p className="text-xs text-indigo-400 mt-0.5">
                              Role: {session.user.role === 'buyer' ? 'Buyer' : 'Seller'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="text-gray-200 hover:bg-indigo-900/30 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left flex items-center gap-2"
                    >
                      <Settings size={16} />
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-200 hover:bg-indigo-900/30 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-200 hover:bg-indigo-900/30 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

"use client";

import React, { useState } from 'react';
import { Search, X, Menu, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] mt-4">
      {/* Navbar */}
      <nav className="justify-center max-w-5xl mx-auto">
        {/* Desktop Navigation - Rounded top when menu is open, fully rounded when closed */}
        <div className={`bg-gradient-to-r from-black via-gray-900 to-red-900 ${isMenuOpen ? 'rounded-t-md' : 'rounded-3xl'}`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-2 text-white font-bold text-xl">Yokcash</span>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:block flex-1 max-w-sm mx-4 ">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition duration-150 ease-in-out rounded-full"
                    aria-label="Search"
                  />
                </div>
              </div>

              {/* Desktop Navigation Items */}
              <Link className="hidden md:flex items-center space-x-4 cursor-pointer" href={'/login'} >
               <User/>
              </Link>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-white/20 transition duration-150 ease-in-out"
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
          <div className="md:hidden bg-gradient-to-r from-black via-gray-900 to-red-900 rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-2 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 rounded-full"
                    aria-label="Search"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex flex-col space-y-2 px-2">
                <button className="text-white hover:bg-white/20 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left">
                  Login
                </button>
                <button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-full transition duration-150 ease-in-out w-full text-left">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

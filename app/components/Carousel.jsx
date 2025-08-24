"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Gamepad2, Trophy, Zap } from "lucide-react";

const allGameStores = [
  {
    id: 17,
    name: "Azur Lane",
    description: "Naval Warfare RPG",
    backgroundImage: "https://images2.alphacoders.com/840/840787.jpg",
    features: ["Naval Combat", "Anime Style", "Collection"],
    accent: "#03a9f4",
    storeid: "azur-lane"
  },
  {
    id: 74,
    name: "Honkai Impact 3rd",
    description: "Action RPG Adventure",
    backgroundImage: "https://wallpapers.com/images/high/honkai-impact-seele-fanart-zei4ynjucfh0jyp2.webp",
    features: ["Action Combat", "Story Rich", "Anime Style"],
    accent: "#9c27b0",
    storeid: "honkai-impact-3"
  },
  {
    id: 75,
    name: "Honkai: Star Rail",
    description: "Space Fantasy RPG",
    backgroundImage: "https://sin1.contabostorage.com/b1d79b8bbee7475eab6c15cd3d13cd4d:vogapin/p/1699245737GxXsAAlcGa.webp",
    features: ["Turn-Based", "Space Adventure", "Story Driven"],
    accent: "#ff5722",
    storeid: "honkai-star-rail"
  },
  {
    id: 143,
    name: "Punishing: Gray Raven",
    description: "Stylish Action RPG",
    backgroundImage: "https://c4.wallpaperflare.com/wallpaper/938/130/497/punishing-gray-raven-science-fiction-cyborg-anime-girls-seymour-hd-wallpaper-preview.jpg",
    features: ["Fast Combat", "Sci-Fi Story", "Stylish Action"],
    accent: "#607d8b",
    storeid: "punishing-gray-raven"
  },
  {
    id: 177,
    name: "Tower of Fantasy",
    description: "Open World MMORPG",
    backgroundImage: "https://wallpaperaccess.com/full/8643181.jpg",
    features: ["Open World", "MMO Experience", "Sci-Fi Setting"],
    accent: "#00bcd4",
    storeid: "tower-of-fantasy"
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [gameStores, setGameStores] = useState([]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gameStores.length);
  }, [gameStores.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + gameStores.length) % gameStores.length
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  };

  useEffect(() => {
    let intervalId;

    if (!isPaused && !isHovered && gameStores.length > 0) {
      intervalId = setInterval(nextSlide, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPaused, isHovered, nextSlide, gameStores.length]);

  useEffect(() => {
    setGameStores(allGameStores);
  }, []);

  return (
    <div className=" mb-[7rem] px-4 max-w-[1400px] mx-auto">
      <div
        className="relative w-full h-[600px] rounded-[2rem] overflow-hidden group shadow-2xl"
        onMouseEnter={() => {
          setIsPaused(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setIsHovered(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Slide Container */}
        <div className="relative h-full">
          {gameStores.map((store, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                index === currentIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${store.backgroundImage})`,
                }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              {/* Background Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,255,255,0.3)_0%,_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.2)_0%,_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(255,255,255,0.1)_60deg,_transparent_120deg)]"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-between px-12 py-8">
                {/* Left Content */}
                <div className="flex-1 text-white space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8 Rating</span>
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tight">
                      {store.name}
                    </h2>
                    <p className="text-xl text-white/90 font-medium">
                      {store.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3">
                    {store.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      className="px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Shop Now
                      </div>
                    </button>
                    <button 
                      className="px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Right Content - Game Stats */}
                <div className="hidden lg:flex flex-col items-end space-y-6 text-white">
                  <div className="text-right space-y-2">
                    <div className="flex">
                      <span className="text-3xl font-bold">Top Game</span>
                    </div>
                    <p className="text-white/80">Most Popular This Month</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Active Players</span>
                        <span className="font-bold">50M+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Rating</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Downloads</span>
                        <span className="font-bold">1B+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Badge */}
              <div className="absolute top-6 right-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium text-sm">Trending</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {gameStores.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-10 h-3 bg-white shadow-lg"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        {gameStores.map((store, index) => (
          <button
            key={store.id}
            onClick={() => setCurrentIndex(index)}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              index === currentIndex
                ? "bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 shadow-xl"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
            style={{
              background: index === currentIndex 
                ? `linear-gradient(135deg, ${store.accent}20, ${store.accent}10)` 
                : undefined
            }}
          >
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-white">
                {store.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

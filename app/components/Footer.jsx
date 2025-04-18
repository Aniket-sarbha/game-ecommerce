import React from 'react';
import Link from 'next/link';
import { 
  Youtube, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Music, // Replacing TikTok with Music icon
  CreditCard, 
  Github,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Heart
} from 'lucide-react';
import { cn } from '@/utils/cn';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-950 to-black text-gray-300 border-t border-gray-800 pt-12 pb-6  overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-purple-900/5 pointer-events-none"></div>
      
      {/* Background pattern */}
      <div className="absolute opacity-5 top-0 left-0 w-full h-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Yokcash
              </h2>
            </div>
            <p className="text-gray-400 max-w-xs font-light">
              Enjoy the experience of purchasing Vouchers and automatic Game Top Up whenever and wherever you want.
            </p>
            
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-indigo-600 transition-all duration-200 text-gray-300 hover:text-white hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-indigo-600 transition-all duration-200 text-gray-300 hover:text-white hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-indigo-600 transition-all duration-200 text-gray-300 hover:text-white hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-indigo-600 transition-all duration-200 text-gray-300 hover:text-white hover:scale-110">
                <Music size={18} /> {/* Using Music icon for TikTok */}
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-indigo-600 transition-all duration-200 text-gray-300 hover:text-white hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick links section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">Quick Links</span>
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">All Games</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Check Transaction</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">List of Services</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">Information</span>
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all">→</span>
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">Contact Us</span>
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">123 Gaming Street, Digital City, 10001</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-400">support@yokcash.com</span>
                </div>
              </li>
            </ul>

            {/* Payment methods */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center backdrop-blur-sm">
                  <CreditCard size={16} className="text-gray-300" />
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xs font-medium text-gray-300">VISA</span>
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xs font-medium text-gray-300">MC</span>
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xs font-medium text-gray-300">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} Yokcash. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="flex items-center text-xs">
              Made with <Heart size={12} className="mx-1 text-red-500" /> by the Yokcash Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
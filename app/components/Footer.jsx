import React from 'react';
import { Youtube, MapIcon as WhatsappIcon, Facebook, Instagram, BookIcon as TiktokIcon } from 'lucide-react';

function Footer() {
  return (
      <footer className="bg-gradient-to-r from-black via-red-900 to-red-600 ">
        <div className="max-w-7xl mx-auto px-4 pt-7 pb-3 text-white">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="text-2xl font-bold">Yokcash</div>
              <p className="text-gray-300">
                Enjoy the experience of purchasing Vouchers and automatic Game Top Up whenever and wherever you want.
              </p>
            </div>

            {/* Resellers section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resellers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-red-300">Home page</a></li>
                <li><a href="#" className="hover:text-red-300">All Games</a></li>
                <li><a href="#" className="hover:text-red-300">Check Transaction</a></li>
                <li><a href="#" className="hover:text-red-300">List of Services</a></li>
              </ul>
            </div>

            {/* Information section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-red-300">FIRE</a></li>
                <li><a href="#" className="hover:text-red-300">About Us</a></li>
                <li><a href="#" className="hover:text-red-300">Blog</a></li>
                <li><a href="#" className="hover:text-red-300">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-red-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-red-300">FAQ</a></li>
              </ul>
            </div>

            {/* Follow Us & Payment section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-red-300"><Youtube size={24} /></a>
                  <a href="#" className="hover:text-red-300"><WhatsappIcon size={24} /></a>
                  <a href="#" className="hover:text-red-300"><Facebook size={24} /></a>
                  <a href="#" className="hover:text-red-300"><Instagram size={24} /></a>
                  <a href="#" className="hover:text-red-300"><TiktokIcon size={24} /></a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                <div className="grid grid-cols-3 gap-2">
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-4 border-t border-gray-700 text-center text-gray-300">
            <p>Yokcash - All Rights Reserved</p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
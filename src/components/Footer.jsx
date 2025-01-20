import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0D3B66] text-white pt-12 pb-5">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[0.5fr_0.5fr_0.5fr_3fr] gap-4 mb-10">

        {/* Shop Section */}
        <div>
          <h3 className="text-md font-semibold mb-2">Shop</h3>
          <ul className="text-xs font-light">
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Products</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Games</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Collectibles</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Brands</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-md font-semibold mb-2">Support</h3>
          <ul className="text-xs font-light">
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Get Help</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">DataBlitz Care</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">FAQs</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-md font-semibold mb-2">Company</h3>
          <ul className="text-xs font-light">
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">About Us</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Values</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Careers</a></li>
            <li><a href="#" className="hover:text-[#f4f4f4] text-[0.625rem]">Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription Section */}
        <div className='ml-40'>
          <h3 className="text-md font-semibold mb-2">Subscribe to our Newsletter</h3>
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-3/4 p-1.5 mb-4 rounded text-black h-8 text-xs"
          />
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-xs font-light">
              I want to subscribe to newsletter from Loop. You can unsubscribe anytime. See our <a href="#" className="text-[#f4f4f4]">privacy policy</a>.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="px-6 py-4 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-6">
          <a href="#" className="hover:text-[#f4f4f4]"><FaFacebook size={24} /></a>
          <a href="#" className="hover:text-[#f4f4f4]"><FaInstagram size={24} /></a>
          <a href="#" className="hover:text-[#f4f4f4]"><FaTwitter size={24} /></a>
        </div>

        <div className="text-center sm:text-left text-xs">
          <span className="block sm:inline text-[0.625rem]">Copyright ©2024 Loop. All rights reserved</span>
          <span className="hidden sm:inline"> | </span>
          <a href="#" className="text-[#f4f4f4] text-[0.625rem]">Terms of Use</a> |
          <a href="#" className="text-[#f4f4f4] text-[0.625rem]"> Privacy Policy</a> |
          <a href="#" className="text-[#f4f4f4] text-[0.625rem]"> Cookie Settings</a> |
          <a href="#" className="text-[#f4f4f4] text-[0.625rem]"> Legal Terms</a>
        </div>

        <div className="flex items-center space-x-2">
          <img src="/footer/Globe.png" alt="Globe" className="h-6 w-6" />
          <span className="text-[#f4f4f4] text-sm">Philippines</span>
        </div>
      </div>
    </footer>
  );
}
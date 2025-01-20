"use client";

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Add react-icons for show/hide functionality

export default function Changepassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = passwordMatch && password.length > 0 && confirmPassword.length > 0;

  return (
    <div className="w-3/4 mx-auto">
      {/* Privacy Settings Label */}
      <h1 className="font-bold text-lg text-left">Privacy Settings</h1>

      {/* Empty Line */}
      <div className="h-4"></div>

      {/* Separator Line */}
      <div className="border-t border-gray-300"></div>

      {/* Empty Line */}
      <div className="h-4"></div>
      
      {/* Shield Logo at the center */}
      <div className="flex justify-center mt-16">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-24 h-24 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2C6.48 2 2 5.58 2 9.5 2 12.5 5 15 7.5 16.1V22l4.5-1.5 4.5 1.5V16.1c2.5-1.1 5-3.6 5-6.6 0-3.92-4.48-7.5-10-7.5z"
          />
        </svg>
      </div>

      {/* Password input field */}
      <div className="mt-8">
        <label htmlFor="password" className="block text-md font-medium text-left">
          Write your password
        </label>
        <div className="relative mt-2">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}  // Changed to onClick for better UX
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Confirm password input field */}
      <div className="mt-6">
        <label htmlFor="confirmPassword" className="block text-md font-medium text-left">
          Confirm your password
        </label>
        <div className="relative mt-2">
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${!passwordMatch ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}  // Added onClick for Confirm password field
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
        {!passwordMatch && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Confirmation button */}
      <div className="mt-6">
        <button
          className={`w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid}
        >
          Confirm
        </button>
      </div>
      <div className="h-4"></div>
      <div className="h-4"></div>
      <h2 className="font-bold text-lg text-left">Q1. Why am I asked to verify my account?</h2>
      <h5 className="font-medium text-lg text-left">A. Your account security is important to us. LOOP asks for additional verification
        to let no one but you into your account. This is to ensure that your account is safe and secure.
      </h5>
      {/* Empty Line */}
      <div className="h-4"></div>
      <h2 className="font-bold text-lg text-left">Q2. What can I do if I am unable to verify your account?</h2>
      <h5 className="font-medium text-lg text-left">A. Please contact LOOP customer service for assistace in 
        retrieving your account.</h5>
      <div className="h-4"></div>
    </div>
  );
}

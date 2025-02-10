"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Changepassword() {
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for password values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for error and success messages
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handlers for password input changes
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
  };

  // Toggle visibility for each field
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Verify the current password
  const verifyCurrentPassword = async () => {
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword }),
      });

      if (!response.ok) {
        throw new Error("Incorrect current password");
      }

      return true; // Current password is correct
    } catch (err) {
      setError("Incorrect current password.");
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Verify the current password before updating
    const isCurrentPasswordCorrect = await verifyCurrentPassword();
    if (!isCurrentPasswordCorrect) {
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setError("");
    } catch (err) {
      setError("Failed to update password.");
      setSuccess("");
    }
  };

  // Check if the form is valid
  const isFormValid = newPassword.length > 0 && confirmPassword.length > 0 && passwordMatch;

  return (
    <div className="w-3/4 mx-auto p-6">
      {/* Privacy Settings Label */}
      <h1 className="font-bold text-lg text-left mb-4">Privacy Settings</h1>

      {/* Separator Line */}
      <div className="border-t border-gray-300 mb-4"></div>

      {/* Shield Logo (Tailwind CSS) */}
      <div className="flex justify-center mt-16">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Password Field */}
      <div className="mt-8">
        <label htmlFor="currentPassword" className="block text-md font-medium text-left mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current password"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleCurrentPasswordVisibility}
          >
            {showCurrentPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
      </div>

      {/* New Password Field */}
      <div className="mt-6">
        <label htmlFor="newPassword" className="block text-md font-medium text-left mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="mt-6">
        <label htmlFor="confirmPassword" className="block text-md font-medium text-left mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !passwordMatch ? "border-red-500" : ""
            }`}
            placeholder="Confirm new password"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
        {!passwordMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
      </div>

      {/* Confirmation Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid}
        >
          Confirm
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="font-bold text-lg text-left">Q1. Why am I asked to verify my account?</h2>
        <p className="font-medium text-lg text-left">
          A. Your account security is important to us. LOOP asks for additional verification to ensure that only you can access your account.
        </p>
        <div className="h-4"></div>
        <h2 className="font-bold text-lg text-left">Q2. What can I do if I am unable to verify my account?</h2>
        <p className="font-medium text-lg text-left">
          A. Please contact LOOP customer service for assistance in retrieving your account.
        </p>
      </div>
    </div>
  );
}
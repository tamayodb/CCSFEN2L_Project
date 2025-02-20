"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Changepassword() {
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState("");
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
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Verify the current password
      const verifyResponse = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword }),
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyResult.message || "Incorrect current password");
      }

      // If current password is correct, proceed to update
      const updateResponse = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  // Check if the form is valid
  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    passwordMatch;

  return (
    <div className="w-3/4 mx-auto p-6">
      <h1 className="font-bold text-lg text-left mb-4">Privacy Settings</h1>
      <div className="border-t border-gray-300 mb-4"></div>
      <div className="mt-8">
        <label htmlFor="currentPassword" className="block text-md font-medium text-left mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current password"
            autoComplete="new-password" // Prevents autofill
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleCurrentPasswordVisibility}>
            {showCurrentPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
      </div>
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleNewPasswordVisibility}>
            {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
      </div>
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>
        {!passwordMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
      </div>
      <div className="mt-6">
        <button onClick={handleSubmit} className={`w-full py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isFormValid}>
          Confirm
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
    </div>
  );
}

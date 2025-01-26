"use client";

import React, { useState } from 'react';

export default function Privacy() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

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

      {/* Request Account Deletion */}
      <div className="flex items-center">
        <label className="text-md font-medium text-left flex-grow">Request Account Deletion</label>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>

      {/* Confirmation Prompt */}
      {showConfirmation && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-gray-700 text-left">
            Are you sure you want to delete your account?
          </p>
          <div className="mt-2 flex space-x-4">
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              onClick={handleCancel}
            >
              Confirm
            </button>
            <button
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

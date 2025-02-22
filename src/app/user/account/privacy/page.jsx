"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Privacy() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmation(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Get the JWT token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You need to be logged in to delete your account');
      }

      // Call the delete account API
      const response = await fetch('/api/user/deletion', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear user data from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to homepage or confirmation page
      router.push('/login');
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
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
          disabled={isDeleting}
        >
          Delete
        </button>
      </div>

      {/* Confirmation Prompt */}
      {showConfirmation && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-gray-700 text-left mb-3">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
          
          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:bg-red-300"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 disabled:bg-gray-300"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
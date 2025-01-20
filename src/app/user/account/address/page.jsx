"use client";

import { useState } from 'react';
import { UserCircle, Plus, Edit2, Trash } from 'lucide-react';

export default function Address() {
  const [emails, setEmails] = useState([
    'address1@example.com',
    'address2@example.com'
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [newAddressToAdd, setNewAddressToAdd] = useState(''); // State for the "Add New Address" field
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewAddress(emails[index]);
  };

  const handleSave = () => {
    if (!newAddress.trim()) return; // Prevent saving empty addresses
    const updatedEmails = [...emails];
    updatedEmails[editIndex] = newAddress.trim();
    setEmails(updatedEmails);
    setEditIndex(null);
    setNewAddress('');
  };

  const handleDelete = (index) => {
    if (isDeleting) {
      const updatedEmails = emails.filter((_, i) => i !== index);
      setEmails(updatedEmails);
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
    }
  };

  const handleAdd = () => {
    if (!newAddressToAdd.trim()) return; // Prevent adding empty addresses
    setEmails([...emails, newAddressToAdd.trim()]);
    setNewAddressToAdd('');
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-bold">
                MY ADDRESS
              </label>
            </div>

            {/* Address Input Fields */}
            {emails.map((email, index) => (
              <div key={index} className="flex gap-4 items-center mb-4">
                {/* Conditionally render label or input */}
                {editIndex === index ? (
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter address"
                  />
                ) : (
                  <span className="w-full text-sm text-gray-800">{email}</span>
                )}
                <div className="flex gap-2">
                  {editIndex === index ? (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-3 py-1 text-sm border rounded-md bg-green-500 text-white hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1 text-sm border rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    {isDeleting ? 'Confirm Delete' : <Trash className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Address */}
            <div className="flex gap-4 items-center mb-4">
              <input
                type="text"
                value={newAddressToAdd}
                onChange={(e) => setNewAddressToAdd(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add new address"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="px-3 py-1 text-sm border rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

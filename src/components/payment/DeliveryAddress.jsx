import React from "react";

export default function DeliveryAddress({ name, contactNumber, address }) {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 flex items-center justify-between bg-white px-8">
      <div>
        {/* Header */}
        <div className="text-sm text-gray-500 font-medium mb-2 tracking-widest">
          Delivery Address
        </div>

        {/* Name and Contact */}
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-gray-600 text-xs">{contactNumber}</div>

        {/* Address */}
        <div className="text-gray-600 text-xs mt-1">{address}</div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Default */}
        <div className="text-xs text-gray-500 font-medium border border-gray-400 rounded-md px-2 py-1">
          Default
        </div>

        {/* Change Button */}
        <button className="text-yellow-500 text-xs font-medium hover:underline focus:outline-none">
          Change
        </button>
      </div>
    </div>
  );
}

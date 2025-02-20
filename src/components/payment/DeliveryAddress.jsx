import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DeliveryAddress() {
  const [addressData, setAddressData] = useState({
    name: "No Name Available",
    contactNumber: "No Contact Available",
    address: "No Address Available",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      try {
        const res = await fetch("/api/payment/deliveryaddress", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched Address Data:", data);

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch address");
        }

        // Ensure address is properly formatted
        const formattedAddress = data.address
          ? `${data.address.street_num || ""} ${data.address.barangay || ""}, ${data.address.city || ""} ${data.address.zip_code || ""}`.trim()
          : "No Address Available";

        setAddressData({
          name: data.username || "No Name Available",  // Use `username` instead of `name`
          contactNumber: data.contact_num || "No Contact Available",
          address: formattedAddress,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAddress();
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 flex items-center justify-between bg-white px-8">
      <div>
        {/* Header */}
        <div className="text-sm text-gray-500 font-medium mb-2 tracking-widest">
          Delivery Address
        </div>

        {/* Name and Contact */}
        <div className="font-semibold text-gray-800">{addressData.name}</div>
        <div className="text-gray-600 text-xs">{addressData.contactNumber}</div>

        {/* Address */}
        <div className="text-gray-600 text-xs mt-1">{addressData.address}</div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Default */}
        <div className="text-xs text-gray-500 font-medium border border-gray-400 rounded-md px-2 py-1">
          Default
        </div>

        {/* Change Button */}
        <Link
          href="/user/account/profile"
          className="text-yellow-500 text-xs font-medium hover:underline focus:outline-none"
        >
          Change
        </Link>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Page() {
  const router = useRouter(); // Initialize the router
  const [cartItems, setCartItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirect to login or handle accordingly");
        return;
      }
    
      try {
        const response = await fetch("/api/cart/View", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }    

    async function fetchRecentlyViewed() {
      try {
        const response = await fetch("/api/cart/View");
        const data = await response.json();
        console.log("Recently Viewed Data:", data); // Check the data format here
        setRecentlyViewed(data.slice(0, 6)); // If the data is correctly formatted, this will work
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    }    

    fetchCart();
    fetchRecentlyViewed();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev, [id]: !prev[id] };
      calculateTotal(newSelection);
      return newSelection;
    });
  };

  const handleCheckAll = () => {
    const allChecked = cartItems.every((item) => selectedItems[item.id]);
    const newSelection = cartItems.reduce((acc, item) => {
      acc[item.id] = !allChecked;
      return acc;
    }, {});
    setSelectedItems(newSelection);
    calculateTotal(newSelection);
  };

  const calculateTotal = (selection) => {
    const sum = cartItems.reduce((acc, item) => {
      if (selection[item.id]) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotal(sum);
  };

  // Function to handle the checkout and navigate to the payment page
  const handleCheckout = () => {
    const selectedCartItems = cartItems
    .filter((item) => selectedItems[item.id])
    .map((item) => ({
      id: item.id,
      qty: item.quantity, // Extract quantity
    }));
    
    if (selectedCartItems.length === 0) {
      setErrorMessage("Please select at least one item to checkout."); // Set error message if no items are selected
      return;
    }
  
    // Reset error message if items are selected
    setErrorMessage("");
    
    const encodedData = encodeURIComponent(JSON.stringify(selectedCartItems));
    router.push(`/payment?cart=${encodedData}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      onChange={handleCheckAll}
                      checked={cartItems.every((item) => selectedItems[item.id])}
                    />
                  </th>
                  <th className="py-2">Product</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td className="py-4 flex items-center space-x-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                      <p>{item.name}</p>
                    </td>
                    <td className="py-4">₱{item.price.toLocaleString()}</td>
                    <td className="py-4">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Total</h2>
          <p className="text-lg font-bold">₱{total.toLocaleString()}</p>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p> // Display error message if there are no selected items
          )}
          <button
            onClick={handleCheckout} // Add the handleCheckout function to the button
            className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md w-full"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Recently Ordered */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-6">Recently Ordered</h2>
        {recentlyViewed.length === 0 ? (
          <p>No recently viewed items available.</p> // Handle empty data
        ) : (
          <div className="flex justify-between gap-6">
            {recentlyViewed.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                style={{ width: "23%" }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-contain mb-4"
                />
                <p className="text-sm font-bold text-gray-800 mb-2">{item.name}</p>
                <p className="text-sm text-blue-600 font-semibold">
                  ₱{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
        <div>
          <AssuranceSection />
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Page() {
  const router = useRouter(); // Initialize the router
  const [cartItems, setCartItems] = useState([]);
  const [recentlyOrdered, setRecentlyOrdered] = useState([]);
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

    async function fetchRecentlyOrdered() {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
    
      try {
        const response = await fetch("/api/fetchOrders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch recently ordered products: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Recently Ordered Products:", data);
    
        // Set state with the data (assuming you want to show all products per order)
        setRecentlyOrdered(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching recently ordered products:", error);
      }
    }           

    fetchCart();
    fetchRecentlyOrdered();
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
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirect to login or handle accordingly");
      return;
    }
  
    const selectedCartItems = cartItems
      .filter((item) => selectedItems[item.id])
      .map((item) => ({
        id: item.id,
        qty: item.quantity,
      }));
  
    if (selectedCartItems.length === 0) {
      setErrorMessage("Please select at least one item to checkout.");
      return;
    }
  
    setErrorMessage(""); // Reset error message
  
    try {
      // Make a DELETE request to remove selected items from the database
      const response = await fetch("/api/cart/RemoveMultiple", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_ids: selectedCartItems.map((item) => item.id),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove selected items from cart.");
      }
  
      // Remove the selected items from state
      setCartItems((prevItems) =>
        prevItems.filter((item) => !selectedItems[item.id])
      );
  
      setSelectedItems({}); // Reset selection after removing items
  
      // Proceed to payment page
      const encodedData = encodeURIComponent(JSON.stringify(selectedCartItems));
      router.push(`/payment?cart=${encodedData}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      setErrorMessage("Failed to complete checkout. Please try again.");
    }
  };  

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirect to login or handle accordingly");
      return;
    }
  
    try {
      const response = await fetch("/api/cart/Remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
  
      // Update cartItems state after successful deletion
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  
      // Optionally recalculate total after removing an item
      setSelectedItems((prevSelected) => {
        const updatedSelection = { ...prevSelected };
        delete updatedSelection[productId];
        calculateTotal(updatedSelection);
        return updatedSelection;
      });
  
      console.log("Item removed successfully");
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };  

  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return updatedItems;
    });
  };
  
  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updatedItems;
    });
  };
  
  // Recalculate total when cartItems or selectedItems change
  useEffect(() => {
    calculateTotal(selectedItems);
  }, [cartItems, selectedItems]);  

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
                  <th className="py-2 text-center">Quantity</th>
                  <th className="py-2"></th>
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
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-500">₱{item.price.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-xs text-gray-500 hover:underline mt-1"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                    <td className="py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg shadow-md h-40 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Total</h2>
            <p className="text-lg font-bold">₱{total.toLocaleString()}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Taxes and shipping are calculated at payment.
          </p>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <button
            onClick={handleCheckout}
            className="mt-auto bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md w-full"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Recently Ordered */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-6">Recently Ordered</h2>
        {recentlyOrdered.length === 0 ? (
          <p>No recently viewed items available.</p> // Handle empty data
        ) : (
          <div className="flex justify-between gap-6">
            {recentlyOrdered.map((item) => (
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

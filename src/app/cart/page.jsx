"use client";
import React, { useEffect, useState } from "react";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link";

export default function Page() {
  const router = useRouter(); // Initialize the router
  const [cartItems, setCartItems] = useState([]);
  const [recentlyOrdered, setRecentlyOrdered] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [stockStatus, setStockStatus] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

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
    
    fetchCart();
  }, []);

  useEffect(() => {
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

  const handleIncreaseQuantity = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found, redirect to login or handle accordingly");
        return;
    }
    
    setIsUpdating(true);
    
    try {
        // Make the API call first to check stock availability
        const response = await fetch("/api/cart/Update", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ product_id: id, action: "increase" }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update state only after successful API call
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity: data.quantity } : item
                )
            );
            
            // Update stock status for this product
            if (data.availableStock) {
                setStockStatus(prev => ({
                    ...prev,
                    [id]: {
                        availableStock: data.availableStock,
                        isOutOfStock: data.isOutOfStock || false,
                        message: data.message
                    }
                }));
            }
        } else {
            // If operation failed due to stock issues
            if (data.isOutOfStock) {
                setStockStatus(prev => ({
                    ...prev,
                    [id]: {
                        availableStock: data.availableStock || 0,
                        isOutOfStock: true,
                        message: data.message || 'Out of stock'
                    }
                }));
            }
        }
      } catch (error) {
          console.error("Error updating cart quantity:", error);
      } finally {
          setIsUpdating(false);
      }
  };

  const handleDecreaseQuantity = async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
          console.error("No token found, redirect to login or handle accordingly");
          return;
      }
      
      setIsUpdating(true);
      
      try {
          const response = await fetch("/api/cart/Update", {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ product_id: id, action: "decrease" }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
              setCartItems((prevItems) =>
                  prevItems.map((item) =>
                      item.id === id && item.quantity > 1
                          ? { ...item, quantity: data.quantity }
                          : item
                  )
              );
              
              // Update stock status for this product - decreasing always frees up stock
              if (data.availableStock) {
                  setStockStatus(prev => ({
                      ...prev,
                      [id]: {
                          availableStock: data.availableStock,
                          isOutOfStock: false,
                          message: null
                      }
                  }));
              }
          }
      } catch (error) {
          console.error("Error updating cart quantity:", error);
      } finally {
          setIsUpdating(false);
      }
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
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some items to your cart to continue shopping</p>
              </div>
            ) : (
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
                            disabled={item.quantity <= 1 || isUpdating}
                          >
                            -
                          </button>
                          
                          <span>{item.quantity}</span>
                          
                          <button
                            className={`px-2 py-1 rounded ${
                              stockStatus[item.id]?.isOutOfStock 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-gray-200'
                            }`}
                            onClick={() => handleIncreaseQuantity(item.id)}
                            disabled={isUpdating || (stockStatus[item.id]?.isOutOfStock)}
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
            )}
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
        <h2 className="text-lg font-bold mb-6">Buy Again</h2>
        {recentlyOrdered.length === 0 ? (
          <p>No recently ordered items available.</p> // Handle empty data
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recentlyOrdered.map((item, index) => (
              <div
                key={item.productID || index}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                style={{ minHeight: "200px" }} // Fixed minimum height without width constraint
              >
                <Link legacyBehavior href={`/${item.type.toLowerCase()}/${item.productId}/`} passHref>
                  <a className="flex justify-center items-center h-24 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </a>
                </Link>
                <p className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 h-10">
                  {item.name}
                </p>
                <p className="text-sm text-blue-600 font-semibold">
                  ₱{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
          <AssuranceSection />
        </div>
    </div>
  );
}

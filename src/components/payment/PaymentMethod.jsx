// /components/payment/PaymentMethod.js
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const PaymentComponent = ({ products = [], shippingFee = 0, address }) => {
  const totalProductPrice = products.reduce((total, product) => total + product.price * product.qty, 0);
  const finalPrice = totalProductPrice + shippingFee;

  const [activeTab, setActiveTab] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState("");  // State for storing user ID

  const tabs = ["COD", "Credit/Debit Card", "Payment Center/E-Wallet", "Online Banking", "Linked Bank Account"];

  useEffect(() => {
    // Fetch and decrypt JWT token to get user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT token
      setUserId(decodedToken.id);  // Assuming JWT contains user ID under 'id'
    } else {
      setErrorMessage("Unauthorized: No token found");
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const placeOrder = async () => {
    if (activeTab !== "COD") {
      setErrorMessage("Only Cash on Delivery is supported.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const orderData = {
        user_id: userId,
        product_id: products.map((p) => p.id),
        quantity: products.map((p) => p.qty),
        address,
        totalAmount: finalPrice,
        paymentMode: "COD",
      };

      const response = await fetch("/api/payment/paymentgateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }
      setSuccessMessage("Order placed successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 bg-white p-8 rounded-lg shadow-md w-full max-w-7xl mx-auto my-5">
      <div className="tracking-widest font-medium text-sm mb-2 text-gray-500">Payment Option</div>
      <div className="flex justify-center mb-5 space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab ? "bg-[#F4D35E] text-black" : "bg-white text-gray-500 border border-[#F4D35E] hover:bg-gray-100"}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "COD" && <p className="text-sm">You will pay the courier upon delivery.</p>}

      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

      <div className="w-full h-[2px] bg-[#F4D35E] my-6"></div>

      <div className="mt-6 flex justify-between items-start">
        <div className="w-1/3"></div>
        <div className="w-1/3"></div>
        <div className="w-1/3 space-y-4 text-right">
          <div className="flex justify-between items-center">
            <div className="text-sm">Product Subtotal:</div>
            <div className="text-sm font-semibold">₱{totalProductPrice.toLocaleString()}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">Shipping Subtotal:</div>
            <div className="text-sm font-semibold">₱{shippingFee.toLocaleString()}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-[#0D3B66]">Total Payment:</div>
            <div className="text-lg font-semibold text-[#0D3B66]">₱{finalPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={placeOrder}
          className="py-3 px-8 bg-[#F4D35E] text-[#0D3B66] font-semibold rounded-lg shadow-md hover:bg-[#F1C232] transition duration-300 w-1/4"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;

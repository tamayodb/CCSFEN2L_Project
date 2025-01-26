"use client";
import React, { useState, useEffect } from "react";

const PaymentComponent = ({ products = [], shippingFee = 0, totalPrice }) => {
  const totalProductPrice = products.reduce((total, product) => total + (product.price * product.qty), 0);
  const finalPrice = totalProductPrice + shippingFee;

  const [activeTab, setActiveTab] = useState("COD");
  const [selectedWallet, setSelectedWallet] = useState("");

  const tabs = [
    "COD",
    "Credit/Debit Card",
    "Payment Center/E-Wallet",
    "Online Banking",
    "Linked Bank Account",
  ];

  const wallets = [
    { id: "GCash", label: "GCash", logo: "/payment/Gcashlogo.png" },
    { id: "Maya", label: "Maya", logo: "/payment/Mayalogo.png" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedWallet("");
  };

  const handleWalletSelection = (wallet) => {
    setSelectedWallet(wallet);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "COD":
        return <p className="text-sm">You will pay the courier upon delivery.</p>;
      // Add other cases for different payment methods
    }
  };

  return (
    <div className="border border-gray-300 bg-white p-8 rounded-lg shadow-md w-full max-w-7xl mx-auto my-5">
      <div className="tracking-widest font-medium text-sm mb-2 text-gray-500">Payment Option</div>
      <div className="flex justify-center mb-5 space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap 
              ${activeTab === tab
                ? "bg-[#F4D35E] text-black"
                : "bg-white text-gray-500 border border-[#F4D35E] hover:bg-gray-100"
              }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">{renderTabContent()}</div>

      <div className="w-full h-[2px] bg-[#F4D35E] my-6"></div>

      {/* Payment Summary */}
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
        <button className="py-3 px-8 bg-[#F4D35E] text-[#0D3B66] font-semibold rounded-lg shadow-md hover:bg-[#F1C232] transition duration-300 w-1/4">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;

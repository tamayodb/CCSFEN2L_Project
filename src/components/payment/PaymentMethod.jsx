"use client";
import React, { useState } from "react";

const PaymentComponent = ({ products = [], shippingFee = 0 }) => {
  // Calculate total product price, safely handling undefined or empty products array
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
    setSelectedWallet(""); // Reset selected wallet when switching tabs
  };

  const handleWalletSelection = (wallet) => {
    setSelectedWallet(wallet);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "COD":
        return <p className="text-sm">You will pay the courier upon delivery.</p>;
      case "Credit/Debit Card":
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Expiration Date (MM/YY)"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        );
      case "Payment Center/E-Wallet":
        return (
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <label
                key={wallet.id}
                className="flex items-center space-x-4 text-sm border border-gray-300 rounded-md p-2 hover:shadow-md cursor-pointer"
              >
                <input
                  type="radio"
                  name="wallet"
                  value={wallet.id}
                  checked={selectedWallet === wallet.id}
                  onChange={() => handleWalletSelection(wallet.id)}
                  className="form-radio text-blue-500"
                />
                <img
                  src={wallet.logo}
                  alt={`${wallet.label} Logo`}
                  className="h-8 w-8"
                />
                <span className="font-medium">{wallet.label}</span>
              </label>
            ))}
            {selectedWallet && (
              <p className="text-sm mt-2">
                Selected Wallet:{" "}
                <span className="font-semibold">{selectedWallet}</span>
              </p>
            )}
          </div>
        );
      case "Online Banking":
        return (
          <div className="space-y-4">
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Your Bank</option>
              <option value="BPI">BPI</option>
              <option value="BDO">BDO</option>
              <option value="Metrobank">Metrobank</option>
              <option value="UnionBank">UnionBank</option>
            </select>
            <p className="text-sm">
              Once you confirm, you'll be redirected to your bank's website to
              complete the payment.
            </p>
          </div>
        );
      case "Linked Bank Account":
        return (
          <p className="text-xs">
            No linked bank accounts found. Please link a bank account in your
            profile settings to use this option.
          </p>
        );
      default:
        return null;
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

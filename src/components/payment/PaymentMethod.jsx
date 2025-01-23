"use client"
import React, { useState } from 'react';

const PaymentComponent = ({ productPrice }) => {
  const shippingFee = 40; // Fixed shipping fee
  const totalPrice = productPrice + shippingFee;

  const [activeTab, setActiveTab] = useState('COD');
  const [selectedWallet, setSelectedWallet] = useState('');

  const tabs = ['COD', 'Credit/Debit Card', 'Payment Center/E-Wallet', 'Online Banking', 'Linked Bank Account'];

  const wallets = [
    { id: 'GCash', label: 'GCash' },
    { id: 'Maya', label: 'Maya' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedWallet('');
  };

  const handleWalletSelection = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
      <div className="flex justify-between mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 
              ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Payment Center/E-Wallet' && (
        <div className="flex flex-col space-y-4">
          {wallets.map((wallet) => (
            <label key={wallet.id} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="wallet"
                value={wallet.id}
                checked={selectedWallet === wallet.id}
                onChange={() => handleWalletSelection(wallet.id)}
                className="form-radio text-blue-500"
              />
              <span>{wallet.label}</span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm">Product Subtotal: <span className="font-semibold">₱{productPrice.toFixed(2)}</span></p>
        <p className="text-sm">Shipping Subtotal: <span className="font-semibold">₱{shippingFee.toFixed(2)}</span></p>
        <p className="mt-4 text-lg font-semibold text-green-500">Total Payment: <span>₱{totalPrice.toFixed(2)}</span></p>
      </div>

      <button className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
        Place Order
      </button>
    </div>
  );
};

export default PaymentComponent;

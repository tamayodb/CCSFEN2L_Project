"use client";

import React, { useState } from "react";

export default function Payment() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [savedCards, setSavedCards] = useState([]);
  const [savedBanks, setSavedBanks] = useState([]);

  const handleAddCardClick = () => {
    setShowCardForm(true);
  };

  const handleAddBankClick = () => {
    setShowBankForm(true);
  };

  const handleCancelCard = () => {
    setShowCardForm(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  const handleCancelBank = () => {
    setShowBankForm(false);
    setBankName("");
    setAccountNumber("");
  };

  const handleSaveCard = () => {
    const newCard = { cardNumber, expiry, cvv };
    setSavedCards([...savedCards, newCard]);
    console.log("Card saved:", newCard);
    setShowCardForm(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  const handleSaveBank = () => {
    const newBank = { bankName, accountNumber };
    setSavedBanks([...savedBanks, newBank]);
    console.log("Bank account saved:", newBank);
    setShowBankForm(false);
    setBankName("");
    setAccountNumber("");
  };

  const handleDeleteCard = (index) => {
    const updatedCards = savedCards.filter((_, i) => i !== index);
    setSavedCards(updatedCards);
  };

  const handleDeleteBank = (index) => {
    const updatedBanks = savedBanks.filter((_, i) => i !== index);
    setSavedBanks(updatedBanks);
  };

  const handleEditCard = (index) => {
    const cardToEdit = savedCards[index];
    setCardNumber(cardToEdit.cardNumber);
    setExpiry(cardToEdit.expiry);
    setCvv(cardToEdit.cvv);
    setShowCardForm(true);
    handleDeleteCard(index);
  };

  const handleEditBank = (index) => {
    const bankToEdit = savedBanks[index];
    setBankName(bankToEdit.bankName);
    setAccountNumber(bankToEdit.accountNumber);
    setShowBankForm(true);
    handleDeleteBank(index);
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <h1 className="font-bold text-lg text-left">Banks and Cards</h1>
        <div className="border-t border-gray-300 my-4"></div>

        {/* Card Section */}
        <div className="flex items-center">
          <label className="text-md font-medium text-left flex-grow">Credit/Debit Card</label>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={handleAddCardClick}
          >
            Add a New Card
          </button>
        </div>
        {showCardForm && (
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter card number"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="MM/YY"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter CVV"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400"
                onClick={handleCancelCard}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                onClick={handleSaveCard}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Saved Cards */}
        <div className="mt-6">
          {savedCards.length > 0 ? (
            <ul className="mt-2">
              {savedCards.map((card, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span>{card.cardNumber} (Exp: {card.expiry})</span>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                      onClick={() => handleEditCard(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteCard(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">You don't have cards yet.</p>
          )}
        </div>

        {/* Add bank account section */}
        <div className="mt-6">
          <div className="flex items-center">
            <label className="text-md font-medium text-left flex-grow">My Bank Accounts</label>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={handleAddBankClick}
            >
              Add a Bank Account
            </button>
          </div>

          {/* Add Bank Form */}
          {showBankForm && (
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter bank name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter account number"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400"
                  onClick={handleCancelBank}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  onClick={handleSaveBank}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Saved Banks */}
          <div className="mt-6">
            {savedBanks.length > 0 ? (
              <ul className="mt-2">
                {savedBanks.map((bank, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span>{bank.bankName} (Account: {bank.accountNumber})</span>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                        onClick={() => handleEditBank(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                        onClick={() => handleDeleteBank(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">You don't have bank accounts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

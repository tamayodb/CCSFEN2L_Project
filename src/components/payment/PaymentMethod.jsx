"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

const PaymentComponent = ({ products = [], shippingFee = 0, address }) => {
  const totalProductPrice = products.reduce((total, product) => total + product.price * product.qty, 0);
  const finalPrice = totalProductPrice + shippingFee;

  const [activeTab, setActiveTab] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [addressData, setAddressData] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });

  const tabs = ["COD", "Credit/Debit Card", "Payment Center/E-Wallet", "Online Banking", "Linked Bank Account"];

  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Unauthorized: No token found");
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

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch address");
        }

        const formattedAddress = data.address
          ? `${data.address.street_num || ""} ${data.address.barangay || ""}, ${data.address.city || ""} ${data.address.zip_code || ""}`.trim()
          : "";

        setAddressData({
          name: data.name || "",
          contactNumber: data.contact_num || "",
          address: formattedAddress,
        });
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    fetchAddress();
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

    if (!addressData.name || !addressData.contactNumber || !addressData.address) {
      setErrorMessage("Please provide your name, contact number, and address before placing an order.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const orderData = {
        user_id: userId,
        cart: JSON.stringify(products.map((p) => ({ id: p.id, qty: p.qty }))),
        address: addressData.address,
        totalAmount: finalPrice,
        paymentMode: "Cash on Delivery",
      };

      const response = await fetch("/api/payment/paymentgateway", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }
      setSuccessMessage("Order placed successfully!");
      
      router.push("/orders/all");

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isPlaceOrderDisabled = !addressData.name || !addressData.contactNumber || !addressData.address;

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
          disabled={isLoading || isPlaceOrderDisabled}
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div>

      {isPlaceOrderDisabled && (
        <p className="text-red-500 text-sm mt-2">
          Please provide your name, contact number, and address before placing an order.
        </p>
      )}
    </div>
  );
};

export default PaymentComponent;
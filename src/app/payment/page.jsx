"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DeliveryAddress from "@/components/payment/DeliveryAddress";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import PaymentComponent from "@/components/payment/PaymentMethod";
import ProductOrderComponent from "@/components/payment/ProdOrderComponent";

export default function Payment() {
  const [products] = useState([
    { id: 1, itemName: "Logitech G915 X", qty: 1, price: 53795, image: "/homepage/product_sample.webp" },
    { id: 2, itemName: "Razer DeathAdder", qty: 1, price: 7495, image: "/homepage/product_sample.webp" },
    { id: 3, itemName: "SteelSeries Headset", qty: 1, price: 14995, image: "/homepage/product_sample.webp" },
  ]);

  const [shippingFee] = useState(200);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const totalProductPrice = products.reduce(
      (total, product) => total + product.price * product.qty,
      0
    );
    const updatedTotalPrice = totalProductPrice + shippingFee;
    setTotalPrice(updatedTotalPrice);
  }, [products, shippingFee]); // Ensure price updates when products or shippingFee change

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-gray-500 flex items-center space-x-2 tracking-widest">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/user/purchase" className="hover:text-gray-700">My Cart</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">Payment</span>
        </div>
      </div>

      <div className="my-5">
        <DeliveryAddress
          name="John Doe"
          contactNumber="+63 999 888 7654"
          address="Ionia Hueco Mundo Street, Barangay 63, New Sampaloc City, Metro Manila"
        />
      </div>

      <div>
        <ProductOrderComponent products={products} shippingFee={shippingFee} />
      </div>

      <div>
        <PaymentComponent products={products} shippingFee={shippingFee} totalPrice={totalPrice} />
      </div>

      <div className="mt-16">
        <AssuranceSection />
      </div>
    </div>
  );
}

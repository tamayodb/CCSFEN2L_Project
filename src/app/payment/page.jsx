"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DeliveryAddress from "@/components/payment/DeliveryAddress";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import PaymentComponent from "@/components/payment/PaymentMethod";
import ProductOrderComponent from "@/components/payment/ProdOrderComponent";

export default function Payment() {
  // Sample product data
  const [products] = useState([
    {
      id: 1,
      itemName: "Logitech G915 X Lightspeed TKL Wireless Gaming Keyboard",
      qty: 1,
      price: 11795,
      image: "/homepage/product_sample.webp", // Replace with actual image path
    },
    {
      id: 2,
      itemName: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
      qty: 1,
      price: 7495,
      image: "/homepage/product_sample.webp", // Replace with actual image path
    },
    {
      id: 3,
      itemName: "SteelSeries Arctis Nova Pro Wireless Gaming Headset",
      qty: 1,
      price: 14995,
      image: "/homepage/product_sample.webp", // Replace with actual image path
    },
  ]);

  const [shippingFee] = useState(200);
  const [totalPrice, setTotalPrice] = useState(0);

  // Recalculate total price whenever products or shipping fee changes
  useEffect(() => {
    const totalProductPrice = products.reduce(
      (total, product) => total + product.price * product.qty,
      0
    );
    setTotalPrice(totalProductPrice + shippingFee);
  }, [products, shippingFee]); // Recalculate whenever products or shippingFee changes

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Link Reference Header */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-gray-500 flex items-center space-x-2 tracking-widest">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/user/purchase" className="hover:text-gray-700">
            My Cart
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">Payment</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="my-5">
        <DeliveryAddress
          name="John Doe"
          contactNumber="+63 999 888 7654"
          address="Ionia Hueco Mundo Street, Barangay 63, New Sampaloc City, Metro Manila, Metro Manila, 1400"
        />
      </div>

      {/* Product Ordered */}
      <div>
        <ProductOrderComponent
          products={products} // Pass sample products to ProductOrderComponent
          shippingFee={shippingFee}
        />
      </div>

      {/* Payment Method */}
      <div>
        <PaymentComponent totalPrice={totalPrice} /> {/* Pass total price to PaymentComponent */}
      </div>

      {/* Assurance Section */}
      <div className="mt-16">
        <AssuranceSection></AssuranceSection>
      </div>
    </div>
  );
}

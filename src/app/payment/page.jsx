"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DeliveryAddress from "@/components/payment/DeliveryAddress";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import PaymentComponent from "@/components/payment/PaymentMethod";
import ProductOrderComponent from "@/components/payment/ProdOrderComponent";

export default function Payment() {
  const searchParams = useSearchParams();
  const cartData = searchParams.get("cart");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingFee] = useState(200);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!cartData) return;

      try {
        const decodedCart = JSON.parse(decodeURIComponent(cartData));
        console.log("Decoded Cart Data:", decodedCart);

        const productDetails = await Promise.all(
          decodedCart.map(async (item) => {
            const res = await fetch(`/api/payment/${item.id}`);
            const data = await res.json();
            return { ...data, qty: item.qty };
          })
        );

        setProducts(productDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cartData]);

  useEffect(() => {
    if (products.length > 0) {
      const totalProductPrice = products.reduce(
        (total, product) => total + product.price * product.qty,
        0
      );
      setTotalPrice(totalProductPrice + shippingFee);
    }
  }, [products, shippingFee]);

  if (loading) {
    return <div className="text-center py-10">Loading payment details...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-gray-500 flex items-center space-x-2 tracking-widest">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/user/purchase" className="hover:text-gray-700">My Cart</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">Payment</span>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="my-5">
        <DeliveryAddress
          name="John Doe"
          contactNumber="+63 999 888 7654"
          address="Ionia Hueco Mundo Street, Barangay 63, New Sampaloc City, Metro Manila"
        />
      </div>

      {/* Product Order Summary */}
      <div>
        <ProductOrderComponent products={products} shippingFee={shippingFee} />
      </div>

      {/* Payment Component */}
      <div>
        <PaymentComponent products={products} shippingFee={shippingFee} totalPrice={totalPrice} />
      </div>

      {/* Assurance Section */}
      <div className="mt-16">
        <AssuranceSection />
      </div>
    </div>
  );
}

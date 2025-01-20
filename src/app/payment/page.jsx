import React from "react";
import Link from "next/link";
import DeliveryAddress from "@/components/payment/DeliveryAddress";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import PaymentComponent from "@/components/payment/PaymentMethod";

export default function Payment() {
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

      {/* Payment Method */}
      <div>
        <PaymentComponent productPrice={11795} />
      </div>

      {/* Assurance Section */}
      <div className="mt-16">
        <AssuranceSection></AssuranceSection>
      </div>
    </div>
  );
}

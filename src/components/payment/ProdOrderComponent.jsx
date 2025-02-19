"use client";
import React from "react";
import ProductRow from "../../components/payment/ProductRow";

const ProdOrderComponent = ({ products = [] }) => {
  const shippingCost = 40;

  // Calculate total price
  const totalPrice = products.reduce((total, product) => total + product.price * product.qty, 0) + shippingCost;

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-300">
      <div className="mx-2">
        <h2 className="tracking-widest font-medium text-sm mb-2 text-gray-500">
          Products Ordered
        </h2>

        {/* Map through products */}
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductRow
              key={product.id || index} // Use product.id or fallback to index
              itemName={product.itemName}
              qty={product.qty}
              price={product.price}
              image={product.image}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}

        <div className="border-t-2 border-[#F4D35E] my-4"></div>

        {/* Shipping Option */}
        <div className="flex justify-end pt-4 space-y-4">
          <p className="font-medium text-sm">
            Shipping Option:{" "}
            <span className="text-[#0D3B66] font-semibold">Standard (₱{shippingCost})</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProdOrderComponent;

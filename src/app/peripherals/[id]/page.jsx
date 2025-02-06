"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function SpecificPeripheral({ params }) {
  const { id } = params; // Extract ObjectID from URL slug
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white p-6 rounded-lg shadow-xl">
            {product.photo ? (
              <Image
                src={product.photo}
                alt={product.productName}
                width={600}
                height={600}
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                <span className="text-gray-600 text-sm">No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">{product.productName}</h1>
            <p className="text-xl text-gray-600">Category: {product.tags?.join(", ") || "N/A"}</p>

            <p>
              <span className="mt-4 text-2xl font-bold text-blue-600">₱{product.price}.00</span>
              <span className={`ml-4 ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </p>

            <p className="text-gray-600">{product.description?.join(" ")}</p>

            <hr className="border-gray-300 my-4 w-full" />

            {/* Quantity and Actions */}
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={handleDecrease}
                  className="bg-gray-200 px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="bg-[#f9fafb] w-16 text-center focus:outline-none"
                />
                <button
                  onClick={handleIncrease}
                  className="bg-gray-200 px-4 py-2 rounded-r-lg text-gray-700 hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <div className="flex space-x-6">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600">
                  Add to Cart
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-[#f9fafb] p-4 rounded-lg mt-6 space-y-4 border border-gray-200 w-full">
              <div className="flex items-center space-x-4">
                <Image src="/homepage/freedelivery.png" alt="Free Delivery" width={30} height={30} />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <span className="text-gray-500 text-sm hover:underline">
                    Enter your postal code for Delivery Availability
                  </span>
                </div>
              </div>

              <hr className="border-gray-300 my-4 w-full" />

              <div className="flex items-center space-x-4">
                <Image src="/homepage/returndelivery.png" alt="Return Delivery" width={30} height={30} />
                <div>
                  <p className="font-semibold">Return Delivery</p>
                  <p className="text-sm text-gray-600">Free 30 Days Delivery Returns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Description</h2>
          <p className="text-gray-700 mt-3">{product.description?.join(" ")}</p>
        </div>
      </main>
    </div>
  );
}

"use client"
import React from 'react'
import Image from "next/image";
import { peripheralProducts } from "@/utils/peripherals/constantsPeripherals";

export default function SpecificPeripheral({params}) {
  // Use React's `use` to unwrap the params Promise
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  // Find the product by ID (slug)
  const product = peripheralProducts.find((item) => item.slug === id);

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          {/* Product Details Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500 mt-2">Logitech | Peripherals</p>

            <p className="text-lg font-semibold text-gray-700 mt-4">
              Price: <span className="text-blue-500">₱{product.price}</span>
            </p>
            <p className="mt-2">
              Stock:{" "}
              <span className="text-green-500 font-semibold">
                {product.stock}
              </span>
            </p>

            <div className="mt-4">
              <label htmlFor="quantity" className="block font-medium">
                Quantity:
              </label>
              <select
                id="quantity"
                className="mt-2 border border-gray-300 rounded-md p-2"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex space-x-4">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md">
                Add to Cart
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800">Description</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>
      </main>
    </div>
  );
}

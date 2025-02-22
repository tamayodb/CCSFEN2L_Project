"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function SpecificCollectible() {
  const params = useParams();
  const router = useRouter();
  const category = "collectibles"; // ✅ Hardcoded category
  const [id, setId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const descriptionRef = useRef(null); // 🔹 Ref for long description scroll

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${category}/${id}`);
        if (!res.ok) throw new Error("❌ Product not found");

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

  const handleProceedToPayment = () => {
    if (!product) return;
    const cartData = [{
      id: id,
      qty: quantity
    }];

    const encodedData = encodeURIComponent(JSON.stringify(cartData));
    router.push(`/payment?cart=${encodedData}`);
  };

  const handleShowMore = () => {
    descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading game details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">Collectible not found.</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
          console.error("No token found, redirect to login or handle accordingly");
          return;
      }
  
        try {
            const response = await fetch("/api/cart/Add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: product._id,
                    quantity: quantity,
                }),
            });
  
            const data = await response.json();
  
            if (!response.ok) throw new Error(data.message || "Failed to add to cart");
  
            console.log("Item added by user_id:", data.user_id);
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart!',
                text: 'Your item has been successfully added.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            {product.photo ? (
              <Image
                src={product.photo[0]}
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

          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">{product.productName}</h1>
            <p className="text-xl text-gray-600">Category: {category}</p>
            <p>
              <span className="mt-4 text-2xl font-bold text-blue-600">₱{product.price}.00</span>
              <span className={`ml-4 ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </p>

            {/* Short Description */}
            <p className="text-gray-600">
              {product.description?.slice(0, 2).join(" ")}{" "}
              {product.description?.length > 2 && (
                <button
                  onClick={handleShowMore}
                  className="text-blue-500 underline ml-2"
                >
                  Show more
                </button>
              )}
            </p>

            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
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
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-gray-200 px-4 py-2 rounded-r-lg text-gray-700 hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <div className="flex space-x-6">
                <button
                onClick={handleAddToCart}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600"
                >
                  Add to Cart
                </button>
                <button onClick={handleProceedToPayment} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div ref={descriptionRef} className="mt-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Description</h2>
          <p className="text-gray-700 mt-3">{product.description?.join(" ")}</p>
        </div>
      </main>
    </div>
  );
}

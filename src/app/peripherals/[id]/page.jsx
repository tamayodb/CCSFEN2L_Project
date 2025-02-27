"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from 'sweetalert2';
import { FaStar, FaRegStar } from "react-icons/fa";

export default function SpecificProduct() {
  const params = useParams();
  const router = useRouter();

  const category = "peripherals";
  const [id, setId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const descriptionRef = useRef(null);

  const [review, setReview] = useState([]);

  useEffect(() => {
    if (!id) return; // Ensure id is defined before fetching
  
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/review/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
  
        const data = await response.json();
        
        setReview(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReview([]); 
      }
    }
  
    fetchReviews();
  }, [id]); 

  // Get recently viewed product IDs from sessionStorage on mount
  useEffect(() => {
    const storedIds = JSON.parse(sessionStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewedIds(storedIds);
  }, []);

  // Set product ID from params
  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);

  // Fetch product details
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${category}/${id}`);
        if (!res.ok) throw new Error("❌ Product not found");

        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.photo?.[0] || null);
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

  // Update recently viewed product IDs
  useEffect(() => {
    if (!id) return;

    let updatedIds = JSON.parse(sessionStorage.getItem("recentlyViewed") || "[]");

    // Remove duplicate
    updatedIds = updatedIds.filter((itemId) => itemId !== id);

    // Add the new product ID at the beginning
    updatedIds.unshift(id);

    // Keep only the last 5 items
    if (updatedIds.length > 5) {
      updatedIds = updatedIds.slice(0, 5);
    }

    // Store in sessionStorage
    sessionStorage.setItem("recentlyViewed", JSON.stringify(updatedIds));
    setRecentlyViewedIds(updatedIds);
  }, [id]);

  // Fetch recently viewed product details
  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      if (recentlyViewedIds.length === 0) return;

      try {
        const productsData = await Promise.all(
          recentlyViewedIds.map(async (productId) => {
            const res = await fetch(`/api/product/${category}/${productId}`);
            if (!res.ok) return null;
            return res.json();
          })
        );

        // Filter out null responses
        setRecentlyViewedProducts(productsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    };

    fetchRecentlyViewedProducts();
  }, [recentlyViewedIds]);

  const handleShowMore = () => {
    descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

        if (!response.ok) {
            throw new Error(data.message || "Failed to add to cart");
        }

        // ✅ Check if the server returned a warning about the quantity limit
        if (data.warning) {
            Swal.fire({
                icon: "warning",
                title: "Limit Reached",
                text: `${data.message} Please check your cart items.`,
            });
            return; // Stop execution, do NOT update the cart
        }

        // ✅ If no warning, proceed with success message
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


  const getAverageRating = () => {
    if (!Array.isArray(review) || review.length === 0) return "No ratings yet";
  
    const total = review.reduce((sum, review) => sum + review.rating, 0);
    return (total / review.length).toFixed(1);
  };
  
  const renderStars = () => {
    const avg = parseFloat(getAverageRating());
    return [...Array(5)].map((_, index) => (
      index < avg ? <FaStar key={index} className="text-yellow-500" /> : <FaRegStar key={index} className="text-gray-400" />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="bg-white p-6 rounded-lg shadow-xl flex">
            <div className="flex flex-col space-y-2 mr-4">
              {product.photo?.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className={`cursor-pointer rounded-lg border-2 ${selectedImage === img ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            <div>
              {selectedImage ? (
                <Image
                  src={selectedImage}
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">{product.productName}</h1>
            <div className="flex items-center">
                {renderStars()} <span className="ml-2 text-gray-700">({getAverageRating()})</span>
            </div>
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

        {/* Quantity and Actions */}
        <div className="flex items-center mt-4 space-x-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center border border-gray-300 rounded-lg relative">
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
                    onClick={() => {
                      if (quantity < product.quantity) {
                        setQuantity((prev) => prev + 1);
                      }
                    }}
                    className={`bg-gray-200 px-4 py-2 rounded-r-lg text-gray-700 hover:bg-gray-300 ${quantity >= product.quantity ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>
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
            {quantity >= product.quantity && (
                  <p className="text-red-500 text-sm mt-1">You have reached the maximum available quantity.</p>
                )}
          </div>
        </div>

        {/* 🔹 Long Description */}
         <div ref={descriptionRef} className="mt-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Description</h2>
          <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
            {product.description?.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>


        {/* Recently Viewed Products */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
            {recentlyViewedProducts.map((item) => (
              <Link key={item.id || item._id} href={`/peripherals/${item.id || item._id}`}>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Image
                    src={item.photo?.[0] || "/placeholder.jpg"}
                    alt={item.productName}
                    width={200}
                    height={200}
                    className="object-cover rounded-lg w-[200px] h-[200px]"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-900 line-clamp-3">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600">₱{item.price}.00</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

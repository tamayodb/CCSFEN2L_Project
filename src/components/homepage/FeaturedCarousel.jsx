"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import FeaturedCarouselItem from "@/components/homepage/FeaturedCarouselItem"; // Updated import

const FeaturedCarousel = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null); // Ref for carousel navigation

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        const response = await axios.get(
          `/api/homepage/featuredProducts?category=${category}`
        );

        const categoryProducts = response.data?.products || [];
        setProducts(
          categoryProducts.slice(0, 10).map((product) => ({
            ...product,
            photo:
              typeof product.photo === "string" && product.photo.startsWith("http")
                ? product.photo
                : "/fallback-image.jpg", // Ensure valid image URL
            description: product.description
              ? String(product.description).split("•").map((line) => line.trim())
              : [],
          }))
        );
      } catch (err) {
        setError(`Failed to fetch ${category} carousel items`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading {category} carousel...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>No products found for {category}.</p>;

  return (
    <div className="relative mt-10 w-full md:w-[70%] mx-auto">
      <h1 className="text-2xl font-bold text-center tracking-widest">
        Featured {category}
      </h1>
      <AliceCarousel
        ref={carouselRef}
        autoPlay
        autoPlayInterval={3000}
        infinite
        disableButtonsControls
        disableDotsControls={false}
        responsive={{
          0: { items: 1 },
          768: { items: 1 },
          1024: { items: 1 },
        }}
      >
        {products.map((product, index) => (
          <FeaturedCarouselItem 
            key={index} 
            name={product.name} 
            price={product.price} 
            photo={product.photo} 
            description={product.description} 
            rating={product.rating} 
            sold={product.sold}
          />
        ))}
      </AliceCarousel>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white rounded-md p-3 hover:bg-blue-700"
        onClick={() => carouselRef.current?.slidePrev()}
      >
        ◀
      </button>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white rounded-md p-3 hover:bg-blue-700"
        onClick={() => carouselRef.current?.slideNext()}
      >
        ▶
      </button>
    </div>
  );
};

export default FeaturedCarousel;

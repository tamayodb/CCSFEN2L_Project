"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import FeaturedCarouselItem from "@/components/homepage/FeaturedCarouselItem";

const FeaturedCarousel = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        const response = await axios.get(`/api/homepage/featuredProducts?category=${category}`);
        console.log("API Response:", response.data);

        const categoryProducts = response.data?.products || [];
        console.log("Fetched Products:", categoryProducts);

        setProducts(
          categoryProducts.slice(0, 10).map((product) => ({
            name: product.productName || "No Name Available",
            price: product.price || "N/A",
            image: Array.isArray(product.photo) && product.photo.length > 0
              ? product.photo[0]
              : "/fallback-image.jpg",
            rating: product.rating || "No rating",
            sold: product.sold || 0,
            description: Array.isArray(product.description) ? product.description : [],
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

  if (loading) return <p className="text-center text-gray-500">Loading {category} carousel...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (products.length === 0) return <p className="text-center text-gray-500">No products found for {category}.</p>;

  return (
    <div className="relative mt-10 w-[70%] mx-auto">
      <h1 className="text-2xl font-bold text-center tracking-widest mb-4">
        Featured {category}
      </h1>

      <div className="relative">
        <AliceCarousel
          ref={carouselRef}
          autoPlay
          autoPlayInterval={3000}
          infinite
          disableButtonsControls
          disableDotsControls={false}
          responsive={{
            0: { items: 1 },
            1024: { items: 1 }, // One item per slide
          }}
          itemClass="flex justify-center items-center h-[450px] md:h-[400px]"
        >
          {products.map((product, index) => (
            <FeaturedCarouselItem 
              key={index} 
              {...product} 
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
    </div>
  );
};

export default FeaturedCarousel;

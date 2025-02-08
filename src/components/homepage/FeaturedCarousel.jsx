"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import ProductCarouselItem from "@/components/homepage/ProductCarouselItem";

const FeaturedCarousel = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              Array.isArray(product.photo) && product.photo.length > 0
                ? product.photo[0]
                : "/fallback-image.jpg", // Fallback image
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
        autoPlay
        autoPlayInterval={3000}
        infinite
        disableButtonsControls={false}
        disableDotsControls={false}
        responsive={{
          0: { items: 1 }, // Shows only ONE item at a time
          768: { items: 1 },
          1024: { items: 1 },
        }}
        renderPrevButton={() => (
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white rounded-md p-3 hover:bg-blue-700">
            ◀
          </button>
        )}
        renderNextButton={() => (
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white rounded-md p-3 hover:bg-blue-700">
            ▶
          </button>
        )}
      >
        {products.map((product, index) => (
          <ProductCarouselItem key={index} {...product} />
        ))}
      </AliceCarousel>
    </div>
  );
};

export default FeaturedCarousel;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "./CardWithDetails";

const NewArrivals = () => {
  const [activeCategory, setActiveCategory] = useState("Peripherals");
  const [products, setProducts] = useState({});
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/homepage/newArrivals");
        console.log("Fetched Data:", response.data);

        // Ensure each product has a valid image (first photo in the array or fallback)
        const formattedData = Object.fromEntries(
          Object.entries(response.data).map(([category, items]) => [
            category,
            items.map((product) => ({
              ...product,
              photo:
                Array.isArray(product.photo) && product.photo.length > 0
                  ? product.photo[0]
                  : "/fallback-image.jpg", // Use first image or fallback
            })),
          ])
        );

        setProducts(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 mb-16">
      <h2 className="text-3xl font-bold text-black tracking-widest text-center pb-4 pt-2">
        NEW ARRIVALS
      </h2>

      {/* Category Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {Object.keys(products).map((category) => (
          <button
            key={category}
            className={`py-2 px-6 rounded-md font-medium ${
              activeCategory === category
                ? "bg-[#0D3B66] text-white"
                : "bg-white text-[#0D3B66] border-2 border-[#0D3B66] hover:bg-[#0D3B66] hover:text-white"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div ref={carouselRef} className="flex overflow-x-scroll scrollbar-hide mx-24">
        {products[activeCategory]?.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-48 mb-10">
            <ProductCard
              name={product.productName}
              price={product.price}
              image={product.photo}
              category={activeCategory} // Pass category for dynamic routing
              id={product._id} // Pass MongoDB Object ID
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;

'use client';
import React, { useEffect, useState } from "react";
import PeripheralGrid from "@/components/peripherals/peripheralGrid";

export default function Peripherals() {
  const [products, setProducts] = useState([]); // All products from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [brands, setBrands] = useState([]); // Unique brands list
  const [filters, setFilters] = useState({
    category: [],
    brand: "",
    price: 100000,
    ratings: [],
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product/peripherals"); // Fetch from API
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Set initial filtered products

        // Extract unique brands from `tag.brand`
        const uniqueBrands = [...new Set(data.map((p) => p.tag?.brand).filter(Boolean))];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // 🔹 Apply Filters whenever filters change
  useEffect(() => {
    let filtered = products;

    // ✅ Filter by Category (Matches at least one selected category)
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) =>
        product.tag.category.some((cat) => filters.category.includes(cat))
      );
    }

    // ✅ Filter by Brand
    if (filters.brand) {
      filtered = filtered.filter((product) => product.tag?.brand === filters.brand);
    }

    // ✅ Filter by Price
    filtered = filtered.filter((product) => product.price <= filters.price);

    // ✅ Filter by Ratings
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((product) =>
        filters.ratings.some((rating) => product.rating >= rating)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // 🔹 Handle Category Change
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  // 🔹 Handle Brand Change
  const handleBrandChange = (event) => {
    setFilters((prev) => ({ ...prev, brand: event.target.value }));
  };

  // 🔹 Handle Price Change
  const handlePriceChange = (event) => {
    setFilters((prev) => ({ ...prev, price: parseInt(event.target.value) }));
  };

  // 🔹 Handle Ratings Change
  const handleRatingsChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Filters Section */}
          <aside className="col-span-1 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Category</h3>
              <ul className="space-y-2 mt-2">
                {[
                  "Mouse",
                  "Keyboard",
                  "Headset",
                  "Microphone",
                  "Webcam",
                  "Laptop",
                  "Mouse Pad",
                  "Gaming Chairs",
                  "Speaker",
                  "Monitor",
                ].map((category) => (
                  <li key={category}>
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label className="ml-2">{category}</label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Brand</h3>
              <select
                value={filters.brand}
                onChange={handleBrandChange}
                className="w-full border rounded p-2 bg-white"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Price</h3>
              <input
                type="range"
                min="30"
                max="100000"
                value={filters.price}
                onChange={handlePriceChange}
                className="w-full mt-2"
              />
              <p>Up to: ₱{filters.price}</p>
            </div>

            {/* Ratings Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Ratings</h3>
              <ul className="space-y-2 mt-2">
                {[5, 4, 3, 2].map((stars) => (
                  <li key={stars}>
                    <input
                      type="checkbox"
                      checked={filters.ratings.includes(stars)}
                      onChange={() => handleRatingsChange(stars)}
                    />
                    <label className="ml-2">{stars} Stars & Up</label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Peripherals Grid */}
          <section className="col-span-3">
            <PeripheralGrid products={filteredProducts} />
          </section>
        </div>
      </main>
    </div>
  );
}
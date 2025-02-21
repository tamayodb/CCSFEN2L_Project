"use client";
import React, { useEffect, useState } from "react";
import SearchGrid from "@/components/search/searchGrid";
import { usePathname } from "next/navigation";

export default function SearchPage() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([]); // All products from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [brands, setBrands] = useState([]); // Unique brands list
  const [types, setTypes] = useState([]); // Unique brands list
  const [categories, setCategories] = useState([]); // Unique categories list
  const [platforms, setPlatforms] = useState([]); // Unique platforms list
  const [filters, setFilters] = useState({
    category: [],
    brand: "",
    type: [],
    price: 100000,
    ratings: [],
    platform: []
  });

  // Fetch products from API
  useEffect(() => {
    const searchTerm = decodeURIComponent(pathname.split("/search/")[1] || "");
    setSearchQuery(searchTerm);
    if (!searchTerm) return; // Avoid fetching when empty
  
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
  
        const uniqueBrands = [...new Set(data.map((p) => p.tag?.brand).filter(Boolean))];
        setBrands(uniqueBrands);
  
        const uniqueCategories = [...new Set(data.flatMap((p) => p.tag?.category || []))];
        setCategories(uniqueCategories);

        const uniqueTypes = [...new Set(data.flatMap((p) => p.tag?.type || []))];
        setTypes(uniqueTypes);

        const uniquePlatforms = [...new Set(data.flatMap((p) => p.tag?.platform || []))];
        setPlatforms(uniquePlatforms);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  
    fetchProducts();
  }, [pathname]); // Reacts only to URL changes
  

  // Apply Filters whenever filters change
  useEffect(() => {
    let filtered = products;

    // ✅ Filter by Type
    if (filters.type.length > 0) {
      filtered = filtered.filter((product) =>
        [].concat(product.tag?.type || []).some((t) => filters.type.includes(t))
      );
    }

    // ✅ Filter by Category
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) =>
        [].concat(product.tag?.category || []).some((cat) => filters.category.includes(cat))
      );
    }
  
    // ✅ Filter by Brand
    if (filters.brand) {
      filtered = filtered.filter((product) => product.tag?.brand === filters.brand);
    }

    // ✅ Filter by Price
    filtered = filtered.filter((product) => product.price <= filters.price);

    if (filters.platform.length > 0) {
      filtered = filtered.filter((product) =>
        [].concat(product.tag?.platform || []).some((p) => filters.platform.includes(p))
      );
    }    

    // ✅ Filter by Ratings
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((product) =>
        product.rating && filters.ratings.some((rating) => product.rating >= rating)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // 🔹 Handle Type Change
  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((p) => p !== type)
        : [...prev.type, type],
    }));
  };

  // 🔹 Handle Category Change
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((cat) => cat !== category)
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

  const handlePlatformChange = (platform) => {
    setFilters((prev) => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter((p) => p !== platform)
        : [...prev.platform, platform],
    }));
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
        <h1 className="text-2xl font-semibold mb-6">
          Search Results for: <span className="text-blue-600">{searchQuery || "All Products"}</span>
        </h1>

        <div className="grid grid-cols-4 gap-6">
          {/* Filters Section */}
          <aside className="col-span-1 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Type Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Types</h3>
              <ul className="space-y-2 mt-2">
                {types.map((type) => (
                  <li key={type}>
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => handleTypeChange(type)}
                    />
                    <label className="ml-2">{type}</label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Categories</h3>
              <ul className="space-y-2 mt-2">
                {categories.map((category) => (
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

            {/* Platform Filter */}
            <div className="mb-4">
              <h3 className="font-medium">Platform</h3>
              <ul className="space-y-2 mt-2">
                {platforms.map((platform) => (
                  <li key={platform}>
                    <input
                      type="checkbox"
                      checked={filters.platform.includes(platform)}
                      onChange={() => handlePlatformChange(platform)}
                    />
                    <label className="ml-2">{platform}</label>
                  </li>
                ))}
              </ul>
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

          {/* Search Results Grid */}
          <section className="col-span-3">
            {filteredProducts.length > 0 ? (
              <SearchGrid products={filteredProducts} />
            ) : (
              <p className="text-gray-600 text-lg">No products found matching your search.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

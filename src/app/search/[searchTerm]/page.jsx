"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchGrid from "@/components/search/searchGrid";

export default function SearchPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: [],
    price: [0, 10000],
    ratings: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract search term from the URL
  useEffect(() => {
    const searchTerm = decodeURIComponent(pathname.split("/search/")[1] || "");
    setSearchQuery(searchTerm);
  }, [pathname]);

  // Fetch products dynamically from the API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        
        if (!res.ok) {
          // Log a non-200 response status
          console.error(`Failed to fetch products. Status: ${res.status}`);
          return;
        }
        
        const data = await res.json();
        
        // Ensure 'data' is an array before filtering
        let filtered = Array.isArray(data) ? data : [];

        // Apply search query filter
        if (searchQuery) {
          const lowercasedQuery = searchQuery.toLowerCase();
          filtered = filtered.filter((product) =>
            product.productName.toLowerCase().includes(lowercasedQuery)
          );
        }

        // Apply category filter
        if (filters.category.length > 0) {
          filtered = filtered.filter((product) =>
            filters.category.includes(product.tag.type)
          );
        }

        // Apply price range filter
        filtered = filtered.filter(
          (product) =>
            product.price >= filters.price[0] && product.price <= filters.price[1]
        );

        // Apply ratings filter
        if (filters.ratings.length > 0) {
          filtered = filtered.filter((product) =>
            filters.ratings.includes(product.rating)
          );
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Search Results for: <span className="text-blue-600">{searchQuery || "All Products"}</span>
        </h1>
        <section>
          {loading ? (
            <p className="text-gray-600 text-lg">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <SearchGrid products={filteredProducts} />
          ) : (
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
          )}
        </section>
      </main>
    </div>
  );
}

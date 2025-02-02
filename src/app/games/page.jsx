'use client'
import React, { useState, useEffect } from 'react'
import GamesGrid from "@/components/games/gamesGrid";

export default function Games() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product/games"); // Fetch from your API route
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Filters Section */}
          <aside className="col-span-1 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="mb-4">
              <h3 className="font-medium">Platform</h3>
              <ul className="space-y-2 mt-2">
                <li><input type="checkbox" id="XBOX" /> <label htmlFor="XBOX">XBOX</label></li>
                <li><input type="checkbox" id="PlayStation" /> <label htmlFor="PlayStation">PlayStation</label></li>
                <li><input type="checkbox" id="PC/Android" /> <label htmlFor="PC/Android">PC/Android</label></li>
                <li><input type="checkbox" id="Nintendo Switch" /> <label htmlFor="Nintendo Switch">Nintendo Switch</label></li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Categories</h3>
              <ul className="space-y-2 mt-2">
                <li><input type="checkbox" id="Action" /> <label htmlFor="Action">Action</label></li>
                <li><input type="checkbox" id="Adventure" /> <label htmlFor="Adventure">Adventure</label></li>
                <li><input type="checkbox" id="Casual" /> <label htmlFor="Casual">Casual</label></li>
                <li><input type="checkbox" id="Fighting" /> <label htmlFor="Fighting">Fighting</label></li>
                <li><input type="checkbox" id="Puzzle" /> <label htmlFor="Puzzle">Puzzle</label></li>
                <li><input type="checkbox" id="Rhythm" /> <label htmlFor="Rhythm">Rhythm</label></li>
                <li><input type="checkbox" id="Racing" /> <label htmlFor="Racing">Racing</label></li>
                <li><input type="checkbox" id="Sports" /> <label htmlFor="Sports">Sports</label></li>
                <li><input type="checkbox" id="Simulation" /> <label htmlFor="Simulation">Simulation</label></li>
                <li><input type="checkbox" id="Shooter" /> <label htmlFor="Shooter">Shooter</label></li>
                <li><input type="checkbox" id="Sci-Fi" /> <label htmlFor="Sci-Fi">Sci-Fi</label></li>
                <li><input type="checkbox" id="Role-Playing" /> <label htmlFor="Role-Playing">Role-Playing</label></li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Price</h3>
              <input type="range" min="30" max="8999" className="w-full mt-2" />
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Ratings</h3>
              <ul className="space-y-2 mt-2">
                {[5, 4, 3, 2].map((stars) => (
                  <li key={stars}>
                    <input type="checkbox" id={`stars-${stars}`} />
                    <label htmlFor={`stars-${stars}`}> {stars} Stars & Up</label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Games Grid */}
          <section className="col-span-3">
            <GamesGrid products = {products} />
          </section>
        </div>
      </main>
    </div>
  );
}

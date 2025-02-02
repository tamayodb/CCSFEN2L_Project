'use client'
import React, { useEffect, useState } from "react";
import PeripheralGrid from "@/components/peripherals/peripheralGrid";

export default function Peripherals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product/peripherals"); // Fetch from your API route
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
              <h3 className="font-medium">Category</h3>
              <ul className="space-y-2 mt-2">
                <li><input type="checkbox" id="Mouse" /> <label htmlFor="Mouse">Mouse</label></li>
                <li><input type="checkbox" id="Keyboard" /> <label htmlFor="Keyboard">Keyboards</label></li>
                <li><input type="checkbox" id="Headset" /> <label htmlFor="Headset">Headsets</label></li>
                <li><input type="checkbox" id="Microphone" /> <label htmlFor="Microphone">Microphones</label></li>
                <li><input type="checkbox" id="Webcam" /> <label htmlFor="Webcam">Webcams</label></li>
                <li><input type="checkbox" id="Mouse Pad" /> <label htmlFor="Mouse Pad">Gamepads</label></li>
                <li><input type="checkbox" id="Gaming Chairs" /> <label htmlFor="Gaming Chairs">Gaming Chairs</label></li>
                <li><input type="checkbox" id="Speaker" /> <label htmlFor="Speaker">Speaker</label></li>
                <li><input type="checkbox" id="Monitor" /> <label htmlFor="Monitor">Monitor</label></li>
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

          {/* Peripherals Grid */}
          <section className="col-span-3">
            <PeripheralGrid products={products} /> {/* Pass fetched products */}
          </section>
        </div>
      </main>
    </div>
  );
}

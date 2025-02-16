"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const CategoryCatalog = () => {
  const router = useRouter();

  const categories = [
    { name: "Games", image: "/homepage/games_samplepic2.webp", description: "Explore a world of entertainment and adventure.", path: "/games" },
    { name: "Accessories", image: "/homepage/accessories_samplepic.webp", description: "Perfect accessories to complement your lifestyle.", path: "/peripherals" },
    { name: "Peripherals", image: "/homepage/peripherals_samplepic.webp", description: "Enhance your setup with the best peripherals.", path: "/peripherals" },
    { name: "Collectibles", image: "/homepage/cards_samplepic.jpg", description: "Collect and display unique items.", path: "/collectibles" },
    { name: "Plush", image: "/homepage/plush_samplepic2.jpeg", description: "Soft and cuddly plush toys for everyone.", path: "/collectibles" },
    { name: "Action Figures", image: "/homepage/actionfig_samplepic.webp", description: "Discover detailed action figures for all ages.", path: "/collectibles" },
    { name: "Amiibo", image: "/homepage/amiibo_samplepic2.webp", description: "Expand your gaming experience with Amiibo.", path: "/collectibles" },
  ];

  const handleClick = (path) => {
    router.push(path);
  };

  return (
    <div className="pt-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ gridAutoRows: "130px" }}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`relative group rounded-md overflow-hidden shadow hover:shadow-md transition-shadow duration-300 cursor-pointer ${
                index % 2 === 0 ? "row-span-2" : "row-span-1"
              }`}
              style={{ height: category.name === "Plush" || category.name === "Amiibo" ? "130px" : "auto" }}
              onClick={() => handleClick(category.path)}
            >
              {/* Image with sizes optimization */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Static Title */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">{category.name}</span>
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                <span className="text-white text-sm font-semibold mb-1">{category.name}</span>
                <p className="text-white text-xs text-center">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCatalog;

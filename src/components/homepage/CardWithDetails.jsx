"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Corrected import for Next.js App Router

const ProductCard = ({ name, price, image, category, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${category.toLowerCase()}/${id}`);
  };

  return (
    <div
      className="h-60 w-40 bg-white rounded-lg shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition duration-200"
      onClick={handleClick}
    >
      {/* Product Image */}
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="w-full h-32 object-contain"
      />
      {/* Product Info */}
      <div className="mt-2 flex-grow">
        <h3
          className="text-xs font-light text-gray-700 text-left overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
          }}
        >
          {name}
        </h3>
      </div>
      {/* Price */}
      <p className="font-bold text-[#0D3B66] mt-2 text-left">
        ₱{price.toLocaleString()}
      </p>
    </div>
  );
};

export default ProductCard;

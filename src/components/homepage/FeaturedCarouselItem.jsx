"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const FeaturedCarouselItem = ({ id, name, price, photo, description, category }) => {
  // Ensure category is lowercase and pluralized correctly
  const formattedCategory = category.toLowerCase();

  return (
    <Link href={`/${formattedCategory}/${id}`} passHref>
      <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl px-6 md:px-20 cursor-pointer hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 h-[300px] md:h-[400px] relative">
          <Image
            src={photo}
            alt={name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-2 w-full md:w-1/2 px-6">
          <h2 className="text-xl md:text-xl font-bold truncate">{name}</h2>
          <p className="text-2xl font-semibold text-gray-900">₱ {price}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{description.join(" ")}</p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCarouselItem;

import Image from "next/image";
import React from "react";

const FeaturedCarouselItem = ({ image, name, price, description }) => {
  return (
    <div className="flex items-center bg-white rounded-2xl px-6 md:px-10 shadow-lg w-full md:w-[80%] h-[400px] overflow-hidden mx-auto">
      {/* Product Image */}
      <div className="relative w-1/2 h-full">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
          priority
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col space-y-2 px-6">
        <h2 className="text-lg md:text-xl font-bold truncate">{name}</h2>
        <p className="text-2xl font-semibold text-gray-900">₱ {price.toLocaleString()}</p>

        {/* Trimmed Description */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
      </div>
    </div>
  );
};

export default FeaturedCarouselItem;

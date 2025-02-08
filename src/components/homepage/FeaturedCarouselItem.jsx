import React from "react";
import Image from "next/image";

const FeaturedCarouselItem = ({ name, price, photo, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl px-6 md:px-20 shadow-lg w-full md:w-[700px] h-auto md:h-[450px] py-6">
      {/* Product Image (Left Side) */}
      <div className="flex-shrink-0 w-full md:w-1/2 h-[250px] md:h-[400px] flex justify-center items-center">
        <div className="relative w-full h-full">
          <Image
            src={photo}
            alt={name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-md"
            priority // Ensures fast loading
          />
        </div>
      </div>

      {/* Product Details (Right Side) */}
      <div className="flex flex-col justify-center space-y-4 w-full md:w-1/2 px-6">
        {/* Product Name */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h2>

        {/* Price */}
        <p className="text-xl md:text-2xl font-semibold text-gray-900">₱ {price}</p>

        {/* Description */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed text-justify space-y-2">
          {description.length > 0 ? (
            description.slice(0, 4).map((line, i) => <p key={i}>{line}</p>)
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarouselItem;

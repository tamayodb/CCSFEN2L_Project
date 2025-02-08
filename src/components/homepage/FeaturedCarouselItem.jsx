import React from "react";
import Image from "next/image";

const FeaturedCarouselItem = ({ name, price, photo, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl px-6 md:px-10 shadow-lg w-full md:w-[800px] h-[450px] md:h-[400px] py-8 gap-6">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full md:w-1/2 h-[250px] md:h-full flex justify-center items-center">
        <div className="relative w-full h-full">
          <Image
            src={photo}
            alt={name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-md"
            priority
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between space-y-3 w-full md:w-1/2 h-full px-4 md:px-6">
        {/* Product Name */}
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
          {name}
        </h2>

        {/* Price */}
        <p className="text-lg md:text-xl font-semibold text-gray-900">
          ₱ {price}
        </p>

        {/* Description (Fixed Height + Scrollable) */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed text-justify space-y-2 overflow-hidden h-[100px] md:h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {description.length > 0 ? (
            description.slice(0, 5).map((line, i) => (
              <p key={i} className="break-words">{line}</p>
            ))
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarouselItem;

import React from "react";

const FeaturedCarouselItem = ({ name, price, photo, description, rating, sold }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6 text-left bg-white shadow-lg rounded-lg w-[380px] md:w-[600px] h-[250px]">
      {/* Product Image (Left Side) */}
      <div className="w-1/3 flex justify-center">
        <img
          src={photo}
          alt={name}
          className="w-40 h-40 object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Product Details (Right Side) */}
      <div className="w-2/3 ml-4 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 truncate">{name}</h2> {/* Product Name */}
        <p className="text-xl font-semibold text-blue-900 mt-1">₱ {price}</p> {/* Price */}
        <p className="text-sm text-gray-500">{rating} ⭐ | {sold} sold</p> {/* Rating & Sold Count */}

        {/* Description List (Limited to 3 Lines) */}
        <ul className="list-disc list-inside mt-3 text-sm text-gray-700 space-y-1 max-h-[60px] overflow-hidden">
          {description.length > 0 
            ? description.slice(0, 3).map((line, i) => <li key={i} className="truncate">{line}</li>)
            : <li>No description available.</li>}
        </ul>
      </div>
    </div>
  );
};

export default FeaturedCarouselItem;

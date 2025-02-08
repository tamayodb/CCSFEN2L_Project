import React from "react";

const FeaturedCarouselItem = ({ name, price, photo, description, rating, sold }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {/* Product Image */}
      <img
        src={photo}
        alt={name}
        className="w-48 h-48 object-contain md:w-56 md:h-56 rounded-lg shadow-md"
        onError={(e) => (e.target.src = "/fallback-image.jpg")} // Handle broken images
      />

      {/* Product Details */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">{name}</h2> {/* Product Name */}
        <p className="text-2xl font-semibold text-blue-900 mt-1">₱ {price}</p> {/* Price */}
        <p className="text-sm text-gray-500">{rating} ⭐ | {sold} sold</p> {/* Rating & Sold Count */}

        {/* Description List */}
        <ul className="list-disc list-inside mt-3 text-sm text-gray-700 space-y-1">
          {description.length > 0 
            ? description.map((line, i) => <li key={i}>{line}</li>)
            : <li>No description available.</li>}
        </ul>
      </div>
    </div>
  );
};

export default FeaturedCarouselItem;

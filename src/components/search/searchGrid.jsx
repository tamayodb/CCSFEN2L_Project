import React from "react";
import SearchCard from "./searchCardWithDetails";

const SearchGrid = ({ products }) => {
  return (
    <div className="">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Search Results</h2>
        <p className="text-sm text-gray-600">
          Browse through our collection of products.
        </p>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <SearchCard
              key={product._id} // Use _id as the unique key
              name={product.productName} // Match MongoDB field
              price={product.price}
              image={product.photo[0] || "/homepage/product_sample.webp"} // Ensure a valid image
              slug={product._id} // Use ObjectID for navigation
              stock={product.stock}
              description={product.description}
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default SearchGrid;

import React from "react";

const PeripheralGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
          <img src={product.photo[0]} alt={product.productName} className="w-full h-48 object-cover mb-4" />
          <h3 className="text-lg font-semibold">{product.productName}</h3>
          <p className="text-gray-600">₱{product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default PeripheralGrid;
import React from "react";
import Image from "next/image"; // Import next/image

const ProductRow = ({ itemName, qty, price, image }) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-300 py-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={image}
            alt={itemName}
            fill // Fills the container
            className="rounded shadow-md object-cover" // Use object-cover directly in className
          />
        </div>
        <div className="ml-5">
          <h3 className="font-medium text-sm">{itemName}</h3>
        </div>
      </div>

      {/* Price and Quantity */}
      <div className="flex gap-10 items-center">
        <p className="font-medium text-[#0D3B66] tracking-wide text-xs">₱{price.toLocaleString()}</p>
        <p className="text-gray-700 font-medium text-xs">x{qty}</p>
      </div>
    </div>
  );
};

export default ProductRow;

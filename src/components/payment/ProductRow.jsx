import React from "react";
import Image from "next/image";

const ProductRow = ({ itemName, qty, price, image }) => {
  const fallbackImage = "/discover/dionela.jpg";

  return (
    <div className="flex items-center justify-between border-t border-gray-300 py-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={image || fallbackImage}
            alt={itemName || "Product image"}
            fill
            sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
            className="rounded shadow-md object-cover"
          />
        </div>
        <div className="ml-5">
          <h3 className="font-medium text-sm">{itemName || "No Name"}</h3>
        </div>
      </div>

      {/* Price and Quantity */}
      <div className="flex gap-10 items-center">
        <p className="font-medium text-[#0D3B66] tracking-wide text-xs">
          ₱{price.toLocaleString()}
        </p>
        <p className="text-gray-700 font-medium text-xs">x{qty}</p>
      </div>
    </div>
  );
};

export default ProductRow;

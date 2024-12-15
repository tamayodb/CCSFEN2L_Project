import React from "react";
import Image from "next/image";

const ProductCard = ({ name, price, image }) => {
  return (
    <div className="relative h-60 w-40 bg-white">
      <div className="product-card rounded-lg shadow-md p-4">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          style={{ width: "100%", height: "auto" }} // Makes image responsive
        />
        <div className="product-info">
          <h3 className="text-xs font-light">{name}</h3>
          <p className="font-bold text-[#0D3B66] mt-2">₱{price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

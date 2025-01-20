import React from "react";
import PeripheralCard from "./peripheralCardWithDetails";

const PeripheralGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product, index) => (
        <PeripheralCard
          key={index}
          name={product.name}
          price={product.price}
          image={product.image}
          slug={product.slug}
        />
      ))}
    </div>
  );
};

export default PeripheralGrid;

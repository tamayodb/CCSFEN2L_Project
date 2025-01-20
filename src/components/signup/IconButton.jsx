import React from "react";

const IconButton = ({ Icon, color }) => {
  return (
    <button
      className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white"
      style={{ border: "1px solid #ddd" }}
      aria-label="Icon Button"
    >
      <Icon size={30} color={color} />
    </button>
  );
};

export default IconButton;

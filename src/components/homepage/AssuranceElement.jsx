import React from "react";

export default function AssuranceElement({ src, title, description }) {
  return (
    <div className="flex items-center space-x-4">
      {/* Picture Logo */}
      <div className="flex-shrink-0">
        <img
          src={src}
          alt={title}
          className="h-8 w-8"
        />
      </div>

      {/* Title and Description */}
      <div className="flex flex-col">
        <h1 className="text-[0.625rem] font-bold">{title}</h1>
        <p className="text-[0.5rem] text-gray-600" style={{ maxWidth: "250px", wordWrap: "break-word" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

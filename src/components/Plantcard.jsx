import React from "react";

export default function PlantCard({ title, desc, image }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      
      {/* IMAGE (SAFE FALLBACK) */}
      <div className="h-32 bg-green-100 rounded-md flex items-center justify-center mb-4">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full object-contain"
          />
        ) : (
          <span className="text-green-700 font-semibold">
            🌿 {title}
          </span>
        )}
      </div>

      {/* TEXT */}
      <h3 className="text-lg font-bold text-green-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

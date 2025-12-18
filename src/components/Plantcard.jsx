import React from "react";

// PlantCard expects a full `plant` object and renders a safe card.
// Layout and styling are unchanged.
export default function PlantCard({ plant }) {
  if (!plant || !plant.image) return null;

  const title = plant.commonName || plant.name || "Unknown plant";
  const desc = plant.short || plant.scientificName || "";
  const image = plant.image;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      {/* IMAGE */}
      <div className="h-32 bg-green-100 rounded-md flex items-center justify-center mb-4">
        <img
          src={image}
          alt={title}
          className="h-full object-contain"
        />
      </div>

      {/* TEXT */}
      <h3 className="text-lg font-bold text-green-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

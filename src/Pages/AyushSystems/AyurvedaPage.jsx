import React from "react";
import { PLANTS } from "../../data/plants";

export default function AyurvedaPage({ onPlantClick }) {
  const ayurvedaPlants = PLANTS.filter((p) =>
    p.systems.includes("Ayurveda")
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🌿 Ayurveda Medicinal Plants
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ayurvedaPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onPlantClick(plant)}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={plant.image}
              className="w-full h-56 object-cover rounded-lg"
              alt={plant.commonName}
            />
            <h2 className="text-xl font-bold mt-3">{plant.commonName}</h2>
            <p className="italic text-gray-600">{plant.scientificName}</p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Uses:</strong> {plant.uses[0]}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

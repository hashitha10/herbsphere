// src/Pages/AyushSystems/YogaPage.jsx
import React from "react";
import { PLANTS } from "../../data/plants";

export default function YogaPage({ onPlantSelect }) {
  const yogaPlants = PLANTS.filter((p) =>
    p.systems.map(s => s.toLowerCase()).includes("yoga") ||
    p.systems.map(s => s.toLowerCase()).includes("yoga & naturopathy")
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
        Yoga & Naturopathy – Medicinal Plants
      </h1>

      {yogaPlants.length === 0 && (
        <p className="text-center text-red-600 text-xl">
          No Yoga & Naturopathy plants found in PLANTS data.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {yogaPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onPlantSelect(plant)}
            className="bg-white shadow-lg p-4 rounded-xl cursor-pointer hover:shadow-xl"
          >
            <img
              src={plant.image}
              className="h-40 w-full object-cover rounded"
              alt={plant.commonName}
            />
            <h2 className="mt-3 text-xl font-bold text-green-700">
              {plant.commonName}
            </h2>
            <p className="text-sm italic text-gray-600">
              {plant.scientificName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

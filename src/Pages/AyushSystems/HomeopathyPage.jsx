import React from "react";
import { PLANTS } from "../../data/plants";

export default function HomeopathyPage({ onPlantClick }) {
  const homeopathyPlants = PLANTS.filter((p) => p.systems.includes("Homeopathy"));

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-green-800 text-center">
        Homeopathy Medicinal Plants
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {homeopathyPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onPlantClick(plant)}
            className="bg-white shadow-lg p-4 rounded-xl cursor-pointer hover:shadow-xl"
          >
            <img src={plant.image} className="h-40 w-full object-cover rounded" />
            <h2 className="mt-3 text-xl font-bold text-green-700">{plant.commonName}</h2>
            <p className="text-sm italic text-gray-600">{plant.scientificName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

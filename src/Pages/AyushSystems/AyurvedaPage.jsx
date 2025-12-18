import React from "react";
import { PLANTS } from "../../data/plants";
import PlantCard from "../../components/PlantCard";

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
          <button
            key={plant.id}
            type="button"
            onClick={() => onPlantClick(plant)}
            className="text-left"
          >
            <PlantCard plant={plant} />
          </button>
        ))}
      </div>
    </div>
  );
}

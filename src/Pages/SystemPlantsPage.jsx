// src/Pages/SystemPlantsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { PLANTS } from "../data/plants";
import PlantCard from "../components/PlantCard";

export default function SystemPlantsPage({ onPlantSelect }) {
  const { name } = useParams();

  // Filter plants based on system name
  const list = PLANTS.filter((p) =>
    p.systems.map((s) => s.toLowerCase()).includes(name.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6 capitalize">
        {name} – Medicinal Plants
      </h1>

      {list.length === 0 ? (
        <p className="text-red-600 text-xl">No plants found in PLANTS data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((plant) => (
            <button
              key={plant.id}
              type="button"
              onClick={() => onPlantSelect(plant)}
              className="text-left"
            >
              <PlantCard plant={plant} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

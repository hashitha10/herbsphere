import React, { useState } from "react";
import { PLANTS } from "../data/plants";
import GardenScene from "../components/GardenScene";
import PlantModal from "../components/PlantModal";

export default function Explorer3DPage() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const systems = ["Ayurveda", "Yoga", "Unani", "Siddha", "Homeopathy"];

  const filteredPlants = selectedSystem
    ? PLANTS.filter((p) =>
        p.systems
          .map((s) => s.toLowerCase())
          .includes(selectedSystem.toLowerCase())
      )
    : PLANTS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-3">
            🌿 3D Herbal Garden Explorer
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Explore medicinal plants in an interactive 3D environment. Click on
            plants in the garden to learn more about their properties and uses.
          </p>
        </header>

        {/* System Filter */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedSystem(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedSystem
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            All Systems
          </button>
          {systems.map((sys) => (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedSystem === sys
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              {sys}
            </button>
          ))}
        </div>

        {/* 3D Garden Scene */}
        <div className="mb-8">
          <GardenScene
            onPlantSelect={(plantId) => {
              const plant = PLANTS.find((p) => p.id === plantId);
              if (plant) setSelectedPlant(plant);
            }}
            visiblePlants={filteredPlants}
          />
        </div>

        {/* Plant Grid Below */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-emerald-900 mb-4">
            {selectedSystem
              ? `${selectedSystem} Plants (${filteredPlants.length})`
              : `All Plants (${filteredPlants.length})`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPlants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition text-left"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={plant.image}
                    alt={plant.commonName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-emerald-950">
                    {plant.commonName}
                  </h3>
                  <p className="text-xs italic text-gray-600">
                    {plant.scientificName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Plant Modal */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}


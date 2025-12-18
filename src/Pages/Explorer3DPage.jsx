import React, { useState } from "react";
import { PLANTS } from "../data/plants";

export default function Explorer3DPage() {
  const [selectedPlant, setSelectedPlant] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-800 text-center">
        3D Plant Explorer
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Interactive visualization of medicinal plants (educational models)
      </p>

      {/* Plant selector */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {PLANTS.filter(p => p.model).map((plant) => (
          <button
            key={plant.id}
            onClick={() => setSelectedPlant(plant)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              selectedPlant?.id === plant.id
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-700 hover:bg-emerald-50"
            }`}
          >
            {plant.commonName}
          </button>
        ))}
      </div>

      {/* 3D Viewer */}
      <div className="mt-10 border rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 h-[420px] flex items-center justify-center shadow-sm">
        {!selectedPlant ? (
          <p className="text-gray-600 text-sm">
            Select a plant above to explore its 3D model
          </p>
        ) : (
          <div className="relative w-full h-full">
            <model-viewer
              src={selectedPlant.model}
              alt={selectedPlant.commonName}
              camera-controls
              auto-rotate
              auto-rotate-delay="0"
              rotation-per-second="30deg"
              camera-orbit="0deg 75deg 2.5m"
              min-camera-orbit="auto auto 1.8m"
              max-camera-orbit="auto auto 4m"
              field-of-view="30deg"
              exposure="1.1"
              shadow-intensity="1"
              environment-image="neutral"
              interaction-prompt="none"
              style={{ width: "100%", height: "100%" }}
            />

            <div className="absolute bottom-2 right-2 text-[0.7rem] bg-white/90 px-2 py-1 rounded border text-emerald-800">
              Representative educational 3D model
            </div>
          </div>
        )}
      </div>

      {/* Educational note */}
      <p className="mt-6 text-xs text-gray-500 text-center max-w-3xl mx-auto">
        Note: The 3D models shown here are representative visual aids used for
        learning and interaction. They are not intended to provide botanical or
        medical precision.
      </p>
    </div>
  );
}

import React, { useEffect, useState } from "react";


export default function PlantDetailModal({
  plantId,
  plants,
  onClose,
  onToggleFav,
  favorites,
}) {
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    setPlant(plants.find((p) => p.id === plantId));
  }, [plantId, plants]);

  if (!plant) return null;

  const isFav = favorites.includes(plant.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-lg">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <img src={plant.image} className="rounded-lg h-56 w-full object-cover" />

            <h2 className="mt-4 text-2xl font-bold">{plant.commonName}</h2>
            <p className="italic text-sm text-gray-500">{plant.scientificName}</p>

            <div className="mt-3">
              <p><strong>Family:</strong> {plant.family}</p>
              <p><strong>Uses:</strong> {plant.uses?.join(", ")}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg">Overview</h3>
            <p className="mt-2 text-gray-700">{plant.description}</p>

            <h4 className="font-semibold mt-5">3D & AR Viewer</h4>

            <model-viewer
              src={plant.model}
              ios-src={plant.usdz}
              alt={plant.commonName}
              ar
              ar-modes="scene-viewer quick-look webxr"
              auto-rotate
              camera-controls
              style={{ width: "100%", height: "360px" }}
            ></model-viewer>

            {plant.audio && (
              <>
                <h4 className="font-semibold mt-5">Audio Guide</h4>
                <audio controls src={plant.audio} className="w-full" />
              </>
            )}

            <h4 className="font-semibold mt-6">References</h4>
            <p className="text-sm text-gray-600">
              • Ministry of AYUSH  
              • CCRAS  
              • Siddha Pharmacopoeia of India  
              • Unani Pharmacopoeia  
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <button
            className="px-3 py-2 border rounded"
            onClick={() => onToggleFav(plant.id)}
          >
            {isFav ? "★ Favorited" : "☆ Add to Favorites"}
          </button>
          <button className="px-3 py-2 bg-gray-100 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

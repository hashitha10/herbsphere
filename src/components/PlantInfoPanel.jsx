import React from "react";

export default function PlantInfoPanel({ plant, onClose }) {
  if (!plant) return null;

  const hasModel = Boolean(plant.model);

  return (
    <aside className="fixed right-4 bottom-4 w-96 max-w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 z-50 border border-emerald-100">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">
            {plant.commonName}
          </h3>
          <p className="text-xs italic text-gray-600">
            {plant.scientificName}
          </p>
          {plant.short && (
            <p className="text-[0.75rem] text-gray-600 mt-1 leading-relaxed line-clamp-3">
              {plant.short}
            </p>
          )}
        </div>
        <button
          className="text-gray-500 text-sm hover:text-gray-700 rounded-full px-2 py-1 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="mt-3 rounded-xl overflow-hidden border border-emerald-100 bg-emerald-50/60 flex items-center justify-center">
        {hasModel ? (
          <model-viewer
            src={plant.model}
            ios-src={plant.usdz}
            alt={plant.commonName}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{ width: "100%", height: "240px" }}
          />
        ) : (
          <img
            loading="lazy"
            src={plant.image}
            alt={plant.commonName}
            className="w-full h-40 object-cover"
          />
        )}
      </div>

      {plant.description && (
        <p className="mt-3 text-[0.8rem] text-gray-700 leading-relaxed">
          {plant.description}
        </p>
      )}

      {Array.isArray(plant.uses) && plant.uses.length > 0 && (
        <div className="mt-3 text-[0.78rem] text-gray-700">
          <span className="font-semibold text-emerald-900">Key uses:</span>{" "}
          {plant.uses.join(", ")}
        </div>
      )}
    </aside>
  );
}

import React from 'react';

export default function PlantInfoPanel({ plant, onClose }) {
  if (!plant) return null;

  return (
    <div className="fixed right-6 bottom-6 w-96 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{plant.commonName}</h3>
          <p className="text-sm italic text-gray-600">{plant.scientificName}</p>
          <p className="text-xs text-gray-500 mt-1">{plant.short}</p>
        </div>
        <button className="text-gray-500" onClick={onClose}>✕</button>
      </div>

      {plant.model ? (
        <div className="mt-3 rounded overflow-hidden border">
          <model-viewer
            src={plant.model}
            ios-src={plant.usdz}
            alt={plant.commonName}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '260px' }}
          />
        </div>
      ) : (
        <img loading="lazy" src={`${plant.image}?w=800&q=80`} alt={plant.commonName} className="w-full h-40 object-cover rounded mt-3" />
      )}

      <p className="mt-3 text-sm text-gray-700">{plant.description}</p>

      <div className="mt-3 text-sm">
        <strong>Uses:</strong> {plant.uses?.join(', ')}
      </div>
    </div>
  );
}

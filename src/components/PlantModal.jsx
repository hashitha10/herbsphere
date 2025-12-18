import React, { useEffect, useRef, useState } from "react";
import { PLANT_CARE } from "../data/careData";

export default function PlantModal({ plant, onClose }) {
  const [viewerSrc, setViewerSrc] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [modelError, setModelError] = useState(null);

  const audioRef = useRef(null);
  const blobUrlRef = useRef(null);

  /* ===================== 3D MODEL LOADER (FIXED) ===================== */
  useEffect(() => {
    let mounted = true;

    async function loadModel() {
      // ALWAYS reset when plant changes
      setViewerSrc(null);
      setModelError(null);
      setLoadingModel(false);

      // If no model, stop here (IMPORTANT FIX)
      if (!plant?.model) {
        setModelError("3D model not available for this plant.");
        return;
      }

      try {
        setLoadingModel(true);
        const response = await fetch(plant.model);
        if (!response.ok) throw new Error("Failed to load model");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        if (mounted) setViewerSrc(url);
      } catch {
        setModelError("3D model unavailable.");
      } finally {
        setLoadingModel(false);
      }
    }

    loadModel();

    return () => {
      mounted = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [plant?.model]);

  if (!plant) return null;

  /* ===================== UI ===================== */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white max-w-5xl mx-auto my-10 rounded-xl shadow-xl z-10">
        {/* HEADER */}
        <div className="relative">
          <img
            src={plant.image}
            alt={plant.commonName}
            className="w-full h-56 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow"
          >
            ✕ Close
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-2xl font-bold">{plant.commonName}</h2>
            <p className="italic text-sm">{plant.scientificName}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT INFO */}
          <div>
            <p className="text-sm"><b>Family:</b> {plant.family || "—"}</p>
            <p className="text-sm mt-2">
              <b>Uses:</b> {(plant.uses || []).join(", ") || "—"}
            </p>
            <p className="text-sm mt-3">{plant.short}</p>
          </div>

          {/* RIGHT – 3D VIEWER */}
          <div className="md:col-span-2">
            <div className="h-[360px] border rounded-lg flex items-center justify-center bg-emerald-50">
              {loadingModel && (
                <p className="text-sm text-gray-600">Loading 3D model…</p>
              )}

              {!loadingModel && modelError && (
                <p className="text-sm text-red-600">{modelError}</p>
              )}

              {!loadingModel && viewerSrc && (
                <model-viewer
                  src={viewerSrc}
                  camera-controls
                  auto-rotate
                  exposure="1"
                  shadow-intensity="1"
                  style={{ width: "100%", height: "100%" }}
                />
              )}

              {!loadingModel && !viewerSrc && !modelError && (
                <p className="text-sm text-gray-500">
                  Select a plant to view its 3D model
                </p>
              )}
            </div>

            {/* HOW TO GROW */}
            {plant.howToGrow && (
              <div className="mt-4 p-3 bg-emerald-50 rounded">
                <h4 className="font-semibold">🌱 How to Grow</h4>
                <p className="text-sm mt-1">{plant.howToGrow}</p>
              </div>
            )}

            {/* CARE DATA */}
            {PLANT_CARE[plant.id] && (
              <div className="mt-4 p-3 bg-lime-50 rounded">
                <h4 className="font-semibold">🌿 Care Tips</h4>
                <ul className="list-disc pl-5 text-sm mt-2">
                  {(PLANT_CARE[plant.id].tips || []).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 px-6 pb-4 border-t">
          Educational demo only — not medical advice.
        </p>
      </div>
    </div>
  );
}

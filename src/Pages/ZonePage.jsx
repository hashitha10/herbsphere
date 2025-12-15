import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PLANTS } from "../data/plants";
import PlantCard from "../components/PlantCard";
import PlantModal from "../components/PlantModal";
import { AYUSH_INFO } from "../data/ayushInfo";

export default function ZonePage() {
  const { zoneName } = useParams();
  const zone = decodeURIComponent(zoneName);

  const [query, setQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Info block
  const zoneDetails = AYUSH_INFO[zone] || {
    intro: "Explore medicinal plants from this AYUSH system.",
    color: "from-gray-100 to-gray-50",
  };

  // Get plants belonging to this system
  const zonePlants = useMemo(() => {
    return PLANTS.filter((p) =>
      p.systems.map((s) => s.toLowerCase()).includes(zone.toLowerCase())
    );
  }, [zone]);

  // Search
  const filteredPlants = zonePlants.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.commonName.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q) ||
      p.short.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pb-16">

      {/* HEADER BLOCK */}
      <div
        className={`p-6 rounded-xl bg-gradient-to-r ${zoneDetails.color} shadow`}
      >
        <h1 className="text-3xl font-bold">{zone}</h1>
        <p className="mt-2 text-gray-700">{zoneDetails.intro}</p>

        <input
          type="text"
          placeholder="Search plants..."
          className="mt-4 px-4 py-2 w-full sm:w-1/2 border rounded-lg shadow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* PLANT GRID */}
      <div className="mt-6">
        {filteredPlants.length === 0 ? (
          <p className="text-gray-600 text-sm mt-4">
            No plants found in this system.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((p) => (
              <PlantCard
                key={p.id}
                plant={p}
                onClick={() => setSelectedPlant(p)} // ⭐ opens modal
              />
            ))}
          </div>
        )}
      </div>

      {/* ⭐ MODAL HERE ⭐ */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}

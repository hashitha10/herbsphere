// client/src/components/ZoneSelector.jsx
import React from "react";
import { Link } from "react-router-dom";

const zones = ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"];

export default function ZoneSelector() {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-6">
      {zones.map((z) => (
        <Link
          key={z}
          to={`/zone/${encodeURIComponent(z)}`}
          className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-800 transition"
        >
          {z}
        </Link>
      ))}
    </div>
  );
}

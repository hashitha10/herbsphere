import React from "react";
import { Link } from "react-router-dom";
import { PLANTS } from "../data/plants";

export default function HomePage({ onPlantClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-50">

      {/* ❗ HERO SECTION ONLY – NO NAVBAR HERE */}
      <section className="text-center py-20 px-4 bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Discover the Power of Medicinal Plants
        </h1>

        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          Explore, interact, and learn about ancient healing herbs through an immersive 3D experience.
        </p>

        {/* NEW CTA BUTTONS */}
        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/systemplants"
            className="px-8 py-4 bg-white text-green-800 text-lg font-bold rounded-xl shadow hover:bg-gray-100 transition"
          >
            🌿 Explore 3D Herbal Garden
          </Link>

          <Link
            to="/search"
            className="px-8 py-4 bg-yellow-300 text-green-900 text-lg font-bold rounded-xl shadow hover:bg-yellow-200 transition"
          >
            🔍 Search Medicinal Plants
          </Link>
        </div>
      </section>

      {/* FEATURED PLANTS */}
      <section className="max-w-7xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-left">
          🌱 Featured Plants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {PLANTS.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => onPlantClick(p)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden border"
            >
              <img
                src={p.image}
                className="w-full h-48 object-cover"
                alt={p.commonName}
              />

              <div className="p-5">
                <h3 className="text-xl font-bold text-green-900">{p.commonName}</h3>
                <p className="text-sm italic text-gray-600 mt-1">
                  {p.scientificName}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {p.systems.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 py-6 text-center bg-green-900 text-white">
        <p className="text-sm opacity-80">© 2025 HerbSphere 3D — All Rights Reserved</p>
      </footer>
    </div>
  );
}

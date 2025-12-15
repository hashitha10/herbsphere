import React from "react";
import { Link } from "react-router-dom";
import { PLANTS } from "../data/plants";

export default function HomePage({ onPlantClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-emerald-50">
      {/* ❗ HERO SECTION ONLY – NAVBAR IS RENDERED IN App.jsx */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-700 to-lime-600" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100/90">
            Virtual Herbal Garden • AYUSH Medicinal Plant Explorer
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">
            HerbSphere 3D: An Interactive Virtual AYUSH Medicinal Plant Explorer
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-emerald-50/95 leading-relaxed">
            Explore, interact, and learn about traditional healing herbs through an immersive,
            curriculum-ready 3D experience.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              to="/system/yoga"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-emerald-900 text-sm sm:text-base font-semibold shadow-md hover:bg-emerald-50 transition-colors"
            >
              🌿 Explore 3D Herbal Garden
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-amber-300 text-emerald-950 text-sm sm:text-base font-semibold shadow-md hover:bg-amber-200 transition-colors"
            >
              🔍 Search Medicinal Plants
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PLANTS */}
      <section className="max-w-6xl mx-auto mt-12 sm:mt-16 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900">
              🌱 Featured Medicinal Plants
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Tap a card to open a detailed sheet with 3D view, cultivation tips, and AYUSH notes.
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Curated subset of {PLANTS.length} plants from the virtual garden.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {PLANTS.slice(0, 6).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPlantClick(p)}
              className="group text-left bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-emerald-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={p.commonName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-80" />
                <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-black/30 backdrop-blur px-2 py-0.5 text-[0.65rem] text-emerald-50 border border-white/20">
                  ID #{p.id}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-emerald-950">
                    {p.commonName}
                  </h3>
                  <p className="text-xs italic text-gray-600">
                    {p.scientificName}
                  </p>
                </div>

                <p className="text-xs text-gray-700 line-clamp-2">
                  {p.short}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.systems.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.65rem] font-semibold border border-emerald-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-100 bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.7rem] text-gray-500">
            © 2025 HerbSphere 3D — Virtual Herbal Garden for AYUSH education.
          </p>
          <p className="text-[0.7rem] text-gray-400">
            Built with React, Vite, Tailwind CSS and @google/model-viewer.
          </p>
        </div>
      </footer>
    </div>
  );
}

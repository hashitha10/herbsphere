import { useMemo, useState } from "react";
import { PLANTS } from "../data/plants";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PLANTS;
    return PLANTS.filter((p) => {
      const systems = (p.systems || []).join(" ").toLowerCase();
      return (
        (p.commonName || "").toLowerCase().includes(q) ||
        (p.scientificName || "").toLowerCase().includes(q) ||
        (p.short || "").toLowerCase().includes(q) ||
        systems.includes(q)
      );
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900">
            🔍 Search Medicinal Plants
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Search by common name, scientific name, system, or a key phrase from the description.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <input
            className="flex-1 w-full px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            placeholder="Type to search (e.g. Tulsi, digestion, Ayurveda)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-[0.7rem] text-gray-500 px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-white/95 rounded-2xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col hover:shadow-lg transition"
            >
              <div className="h-36 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.commonName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-950">
                    {p.commonName}
                  </h3>
                  <p className="text-[0.7rem] italic text-gray-600">
                    {p.scientificName}
                  </p>
                  {p.short && (
                    <p className="mt-1 text-[0.72rem] text-gray-700 line-clamp-2">
                      {p.short}
                    </p>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(p.systems || []).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.65rem] font-semibold border border-emerald-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-gray-500">
            No plants match this query. Try searching by another system or common name.
          </p>
        )}
      </div>
    </div>
  );
}

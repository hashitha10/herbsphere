import { useState } from "react";
import { PLANTS } from "../data/plants";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filtered = PLANTS.filter(p =>
    p.commonName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        🔍 Search Herbal Plants
      </h1>

      <input
        className="block mx-auto mb-8 px-4 py-3 w-full max-w-xl border rounded-lg"
        placeholder="Search plant name..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4">
            <img
              src={p.image}
              alt={p.commonName}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="font-bold mt-2">{p.commonName}</h3>
            <p className="italic text-gray-600">{p.scientificName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

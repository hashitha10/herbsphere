import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import AyushPage from "./Pages/AyushPage";
import AyurvedaPage from "./Pages/AyushSystems/AyurvedaPage";
import SystemPlantsPage from "./Pages/SystemPlantsPage";
import Explorer3DPage from "./Pages/Explorer3DPage";
import SearchPage from "./Pages/SearchPage";
import QuizPage from "./Pages/QuizPage";
import AboutPage from "./Pages/AboutPage";

import PlantModal from "./components/PlantModal";

export default function App() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage onPlantClick={setSelectedPlant} />} />
        <Route path="/ayush" element={<AyushPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage onPlantClick={setSelectedPlant} />} />
        <Route
          path="/system/:name"
          element={<SystemPlantsPage onPlantSelect={setSelectedPlant} />}
        />
        <Route
          path="/explorer"
          element={<Explorer3DPage />}
        />
        <Route
          path="/search"
          element={<SearchPage onPlantClick={setSelectedPlant} />}
        />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onToggleFav={toggleFavorite}
          isFav={favorites.includes(selectedPlant.id)}
        />
      )}
    </>
  );
}

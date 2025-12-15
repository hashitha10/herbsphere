// src/components/PlantModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { PLANT_CARE } from "../data/careData";

/**
 * PlantModal
 * Props:
 *  - plant: object (required)
 *  - onClose: function (required)
 *  - onToggleFav: function (optional) -> receives plant.id
 *  - isFav: boolean (optional)
 */
export default function PlantModal({
  plant,
  onClose,
  onToggleFav = null,
  isFav = false,
}) {
  const [viewerSrc, setViewerSrc] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [modelError, setModelError] = useState(null);

  // Quiz state
  const [playingQuiz, setPlayingQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Audio state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const blobUrlRef = useRef(null);

  /* -------------------- LOAD 3D MODEL (as blob) -------------------- */
  useEffect(() => {
    let mounted = true;
    async function loadModel() {
      setViewerSrc(null);
      setModelError(null);
      if (!plant?.model) return;

      try {
        setLoadingModel(true);
        const resp = await fetch(plant.model);
        if (!resp.ok) throw new Error(`Failed to fetch model (${resp.status})`);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        if (mounted) setViewerSrc(url);
      } catch (err) {
        setModelError(err.message);
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

  /* -------------------- AUDIO HANDLERS -------------------- */
  // Ensure audio stops when modal unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    // reset audio UI when plant changes
    setIsPlaying(false);
    setAudioReady(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [plant?.id]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const p = audioRef.current.play();
      // play() returns a promise in modern browsers
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  }

  /* -------------------- FAVORITE HANDLER -------------------- */
  function handleToggleFav() {
    if (typeof onToggleFav === "function") onToggleFav(plant.id);
  }

  /* -------------------- QUIZ HANDLERS -------------------- */
  const hasQuiz = Array.isArray(plant.quiz) && plant.quiz.length > 0;

  function startQuiz() {
    setPlayingQuiz(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
  }

  function answerQuiz(option) {
    const q = plant.quiz[quizIndex];
    if (!q) return;
    if (option === q.a) setQuizScore((s) => s + 1);
    if (quizIndex + 1 >= plant.quiz.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
    }
  }

  function closeQuiz() {
    setPlayingQuiz(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
  }

  /* -------------------- RENDER QUIZ OVERLAY -------------------- */
  if (playingQuiz) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold">{plant.commonName} — Mini Quiz</h3>
            <button onClick={closeQuiz} className="text-gray-600">✕</button>
          </div>

          {!quizDone ? (
            <>
              <p className="mt-4 text-lg font-semibold">{plant.quiz[quizIndex].q}</p>
              <div className="mt-4 grid gap-3">
                {plant.quiz[quizIndex].o.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => answerQuiz(opt)}
                    className="py-2 px-4 bg-green-100 rounded-md text-left hover:bg-green-200"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-xl font-bold">Your score: {quizScore} / {plant.quiz.length}</p>
              <button onClick={closeQuiz} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">Close</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!plant) return null;

  /* -------------------- MAIN MODAL -------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      {/* backdrop click closes */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-5xl mx-auto mt-10 mb-10 shadow-2xl z-10">
        {/* header image + close */}
        <div className="relative">
          <img src={plant.image} alt={plant.commonName} className="w-full h-56 object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow">✕</button>
        </div>

        {/* content area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* left: basic info & controls */}
          <div>
            <h2 className="text-3xl font-bold">{plant.commonName}</h2>
            <p className="italic text-gray-600">{plant.scientificName}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {Array.isArray(plant.systems) && plant.systems.map((s) => (
                <span key={s} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{s}</span>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <p><strong>Family:</strong> {plant.family ?? "—"}</p>
              <p><strong>Uses:</strong> {(plant.uses || []).join(", ") || "—"}</p>
              <p className="mt-2">{plant.short}</p>
            </div>

            {/* favorite / quiz buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleToggleFav}
                className={`px-3 py-2 rounded-md border ${isFav ? "bg-yellow-100" : "bg-white"}`}
              >
                {isFav ? "★ Favorited" : "☆ Favorite"}
              </button>

              {hasQuiz && (
                <button onClick={startQuiz} className="px-3 py-2 rounded-md bg-green-600 text-white">
                  Mini Quiz
                </button>
              )}
            </div>

            {/* audio block */}
            {plant.audio && (
              <div className="mt-4 border rounded-md p-3 bg-white">
                <h4 className="font-semibold text-green-700">Audio Guide</h4>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="px-3 py-2 rounded-md border"
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                  <audio
                    ref={audioRef}
                    src={plant.audio}
                    onCanPlay={() => setAudioReady(true)}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: "none" }}
                    preload="metadata"
                  />
                  <div className="text-sm text-gray-600">
                    {!audioReady ? "Loading audio..." : "Audio ready"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* right: viewer + grow/care + lists */}
          <div className="md:col-span-2 space-y-5">
            {/* 3D viewer */}
            <div className="w-full h-[360px] border rounded-md bg-gray-50 flex items-center justify-center">
              {loadingModel ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 rounded-full border-green-400 border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-gray-600 text-sm">Loading 3D model…</p>
                </div>
              ) : modelError ? (
                <p className="text-red-600">{modelError}</p>
              ) : viewerSrc ? (
                // model-viewer should be included in index.html by script:
                // <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
                <model-viewer
                  src={viewerSrc}
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <p className="text-gray-500">3D model not available.</p>
              )}
            </div>

            {/* How to Grow */}
            {plant.howToGrow && (
              <div className="p-4 bg-green-50 border rounded-md">
                <h3 className="font-semibold text-green-700">🌱 How to Grow</h3>
                <p className="mt-2 text-gray-700">{plant.howToGrow}</p>
              </div>
            )}

            {/* Care tips */}
            {plant.careTips && (
              <div className="p-4 bg-green-50 border rounded-md">
                <h3 className="font-semibold text-green-700">🌿 Care Tips</h3>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  {String(plant.careTips)
                    .split(".")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => <li key={i}>{t}{t.endsWith(".") ? "" : "."}</li>)}
                </ul>
              </div>
            )}

            {/* PLANT_CARE data block (if provided) */}
            {PLANT_CARE[plant.id] && (
              <div className="p-4 bg-emerald-50 border rounded-md">
                <h3 className="font-semibold text-green-700">🌿 Grow & Care Guide</h3>
                <ul className="mt-2 text-gray-700">
                  {Object.entries(PLANT_CARE[plant.id]).map(([k, v]) =>
                    k === "tips" ? null : (
                      <li key={k}><strong>{capitalize(k)}:</strong> {v}</li>
                    )
                  )}
                </ul>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  {(PLANT_CARE[plant.id].tips || []).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}

            {/* Benefits / Constituents / Dosage */}
            <ListBlock title="Medicinal Benefits" list={plant.benefits} />
            <ListBlock title="Chemical Constituents" list={plant.constituents} />
            <ListBlock title="Dosage & Precautions" list={plant.dosage} red={plant.precautions} />

            {/* Fun fact */}
            {plant.funFact && (
              <div className="p-4 bg-green-50 border rounded-md">
                <h3 className="font-semibold text-green-700">Fun Fact</h3>
                <p className="mt-2 text-gray-700">{plant.funFact}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 px-6 pb-6">Source: AYUSH, CCRAS & traditional texts.</p>
      </div>
    </div>
  );
}

/* -------------------- small helpers -------------------- */
function ListBlock({ title, list = [], red = [] }) {
  if (!list || list.length === 0) return null;
  return (
    <div className="p-4 bg-white border rounded-md">
      <h3 className="font-semibold text-green-700">{title}</h3>
      <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
        {list.map((it, idx) => it && <li key={idx}>{String(it).trim()}</li>)}
        {Array.isArray(red) && red.map((it, idx) => <li key={`r-${idx}`} className="text-red-600">{it}</li>)}
      </ul>
    </div>
  );
}
function capitalize(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

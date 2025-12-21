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
  const hasAudio = Boolean(plant.audio);
  const transcript = plant.audioText || plant.short;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      {/* backdrop click closes */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white/95 rounded-2xl max-w-5xl mx-auto mt-10 mb-10 shadow-2xl z-10 border border-emerald-100">
        {/* header image + close */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={plant.image}
            alt={plant.commonName}
            className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white drop-shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
              Virtual Herbal Garden
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold">
              {plant.commonName}
            </h2>
            <p className="italic text-sm opacity-90">{plant.scientificName}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow hover:bg-white text-gray-700 text-sm"
          >
            ✕ Close
          </button>
        </div>

        {/* content area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* left: basic info & controls */}
          <div className="space-y-4">
            <div>
              <div className="mt-1 flex flex-wrap gap-2">
                {Array.isArray(plant.systems) &&
                  plant.systems.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[0.7rem] font-semibold rounded-full border border-emerald-100 tracking-wide"
                    >
                      {s}
                    </span>
                  ))}
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Family:</strong> {plant.family ?? "—"}
                </p>
                <p>
                  <strong>Primary uses:</strong>{" "}
                  {(plant.uses || []).join(", ") || "—"}
                </p>
                {plant.short && (
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-gray-700">
                    {plant.short}
                  </p>
                )}
              </div>
            </div>

            {/* favorite / quiz buttons */}
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                onClick={handleToggleFav}
                className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1.5 transition ${
                  isFav
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isFav ? "★ In favorites" : "☆ Add to favorites"}
              </button>

              {hasQuiz && (
                <button
                  onClick={startQuiz}
                  className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
                >
                  Plant mini‑quiz
                </button>
              )}
            </div>

            {/* audio + transcript block – transcript only while audio is playing */}
            <div className="mt-4 border rounded-md p-3 bg-emerald-50/60 border-emerald-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-emerald-800 text-sm">
                    Audio Guide
                  </h4>
                  <p className="text-[0.75rem] text-emerald-900/70">
                    Listen to a quick overview while you read the key notes.
                  </p>
                </div>

                <button
                  onClick={hasAudio ? togglePlay : undefined}
                  disabled={!hasAudio || !audioReady}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    hasAudio
                      ? isPlaying
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                  aria-label={
                    !hasAudio
                      ? "Audio not available"
                      : isPlaying
                      ? "Pause audio"
                      : "Play audio"
                  }
                >
                  {!hasAudio
                    ? "Audio not available"
                    : !audioReady
                    ? "Loading…"
                    : isPlaying
                    ? "⏸ Pause"
                    : "▶ Play"}
                </button>
              </div>

              {/* hidden audio element */}
              {hasAudio && (
                <audio
                  ref={audioRef}
                  src={plant.audio}
                  onCanPlay={() => setAudioReady(true)}
                  onEnded={() => setIsPlaying(false)}
                  style={{ display: "none" }}
                  preload="metadata"
                />
              )}

              {hasAudio && isPlaying && transcript && (
                <p className="mt-3 text-[0.82rem] leading-relaxed text-emerald-950/80 bg-white/60 rounded-md px-3 py-2 border border-emerald-100">
                  {transcript}
                </p>
              )}
            </div>
          </div>

          {/* right: viewer + grow/care + lists */}
          <div className="md:col-span-2 space-y-5">
            {/* 3D viewer */}
            <section className="w-full h-[360px] border rounded-xl bg-gradient-to-br from-emerald-50 to-lime-50 flex items-center justify-center overflow-hidden shadow-sm">
              {loadingModel ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 rounded-full border-emerald-400 border-t-transparent mx-auto" />
                  <p className="mt-2 text-gray-600 text-sm">
                    Loading 3D model…
                  </p>
                </div>
              ) : modelError ? (
                <div className="text-center text-sm text-red-700 px-4">
                  <p className="font-medium">3D model unavailable</p>
                  <p className="mt-1 text-red-600/80">{modelError}</p>
                </div>
              ) : viewerSrc ? (
                <div className="relative w-full h-full">
                  <model-viewer
                    src={viewerSrc}
                    camera-controls
                    auto-rotate
                    shadow-intensity="0.9"
                    exposure="1"
                    alt={plant.commonName}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute bottom-2 right-2 text-[0.65rem] text-emerald-900 bg-white/85 border border-emerald-100 rounded px-2 py-1 shadow-sm">
                    This 3D visualization is a representative educational model.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-600 text-sm">
                  <img
                    src={plant.image}
                    alt={plant.commonName}
                    className="h-40 w-40 object-contain rounded-lg shadow-sm bg-white"
                  />
                  <p className="text-xs text-gray-500">
                    3D model not available for this plant yet.
                  </p>
                </div>
              )}
            </section>

            {/* How to Grow */}
            {plant.howToGrow && (
              <section className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                <h3 className="font-semibold text-emerald-800 text-sm uppercase tracking-wide">
                  🌱 How to Grow
                </h3>
                <p className="mt-2 text-gray-800 text-sm leading-relaxed">
                  {plant.howToGrow}
                </p>
              </section>
            )}

            {/* Care tips */}
            {plant.careTips && (
              <section className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                <h3 className="font-semibold text-emerald-800 text-sm uppercase tracking-wide">
                  🌿 Care Tips
                </h3>
                <ul className="list-disc pl-6 mt-2 text-gray-800 text-sm space-y-1">
                  {String(plant.careTips)
                    .split(".")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => (
                      <li key={i}>{t.endsWith(".") ? t : `${t}.`}</li>
                    ))}
                </ul>
              </section>
            )}

            {/* PLANT_CARE data block (if provided) */}
            {PLANT_CARE[plant.id] && (
              <section className="p-4 bg-lime-50/90 border border-lime-100 rounded-xl">
                <h3 className="font-semibold text-emerald-900 text-sm uppercase tracking-wide">
                  🌿 Grow & Care Guide
                </h3>
                <ul className="mt-2 text-gray-800 text-sm space-y-1">
                  {Object.entries(PLANT_CARE[plant.id]).map(([k, v]) =>
                    k === "tips" ? null : (
                      <li key={k}>
                        <strong>{capitalize(k)}:</strong> {v}
                      </li>
                    )
                  )}
                </ul>
                <ul className="list-disc pl-6 mt-2 text-gray-700 text-sm space-y-1">
                  {(PLANT_CARE[plant.id].tips || []).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits / Constituents / Dosage */}
            <ListBlock title="Medicinal Benefits" list={plant.benefits} />
            <ListBlock
              title="Key Constituents"
              list={plant.constituents}
            />
            <ListBlock
              title="Dosage & Precautions"
              list={plant.dosage}
              red={plant.precautions}
            />

            {/* Fun fact */}
            {plant.funFact && (
              <section className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                <h3 className="font-semibold text-emerald-800 text-sm uppercase tracking-wide">
                  Did you know?
                </h3>
                <p className="mt-2 text-gray-800 text-sm leading-relaxed">
                  {plant.funFact}
                </p>
              </section>
            )}
          </div>
        </div>

        <p className="text-[0.7rem] text-gray-500 px-6 pb-5 border-t border-gray-100 pt-3 bg-gradient-to-r from-white via-emerald-50/40 to-white rounded-b-2xl">
          Educational demo — not a substitute for professional medical advice. Sources: Ministry of AYUSH,
          CCRAS & classical pharmacopoeias.
        </p>
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
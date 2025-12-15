import React from "react";

export default function QuizPage() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-emerald-50 via-white to-emerald-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/95 border border-emerald-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
          HerbSphere Quiz (Coming Soon)
        </h1>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          An interactive quiz module will appear here, drawing questions from the
          medicinal plant knowledge base (via the backend <code>/quiz</code> API)
          to support AYUSH practicals, self‑assessment and classroom evaluation.
        </p>
        <ul className="mt-4 text-sm text-gray-700 list-disc pl-6 space-y-1">
          <li>Plant‑specific MCQs aligned with Ayurveda, Siddha, Unani, Yoga and Homeopathy.</li>
          <li>Immediate feedback with explanations and key reference points.</li>
          <li>Light‑weight interface optimized for labs, mobiles and classrooms.</li>
        </ul>
        <p className="mt-5 text-xs text-gray-500">
          Backend support (<code>GET /api/quiz</code>) is already wired; only the
          interactive UI layer is intentionally deferred for this phase.
        </p>
      </div>
    </div>
  );
}

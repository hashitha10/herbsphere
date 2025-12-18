import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800">
          Learning AYUSH Systems with HerbSphere 3D
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          A conceptual guide to understanding traditional Indian medical systems
        </p>
      </header>

      {/* 1. AYUSH DECISION GUIDE */}
      <section className="mb-12 bg-emerald-50 border border-emerald-100 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
          AYUSH Decision Guide
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          AYUSH systems differ in philosophy and application. This guide helps
          learners understand which system is traditionally preferred based on
          health goals — without focusing on individual plants.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-100">
                <th className="p-2 border">Health Need</th>
                <th className="p-2 border">Recommended System</th>
                <th className="p-2 border">Why This System</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Stress & mental fatigue</td>
                <td className="p-2 border">Yoga & Naturopathy</td>
                <td className="p-2 border">
                  Mind–body balance through breath, posture, and lifestyle
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Digestion & metabolism</td>
                <td className="p-2 border">Ayurveda / Unani</td>
                <td className="p-2 border">
                  Focus on digestive balance and internal harmony
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Respiratory wellness</td>
                <td className="p-2 border">Unani / Siddha</td>
                <td className="p-2 border">
                  Traditional respiratory and rejuvenative approaches
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Skin & detox support</td>
                <td className="p-2 border">Ayurveda / Siddha</td>
                <td className="p-2 border">
                  Emphasis on purification and balance
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Individualized symptoms</td>
                <td className="p-2 border">Homeopathy</td>
                <td className="p-2 border">
                  Person-specific symptom-based treatment philosophy
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. LEARNING PATHS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
          Beginner Learning Paths
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          These paths guide first-time learners on how to explore each AYUSH
          system conceptually, without medical background.
        </p>

        <ul className="grid md:grid-cols-2 gap-4 text-sm">
          <li className="border rounded-lg p-4 bg-white">
            <strong>Ayurveda:</strong> Balance theory → digestion → daily
            routines → seasonal adaptation
          </li>
          <li className="border rounded-lg p-4 bg-white">
            <strong>Yoga & Naturopathy:</strong> Breathing → posture → sleep →
            lifestyle correction
          </li>
          <li className="border rounded-lg p-4 bg-white">
            <strong>Unani:</strong> Temperament theory → digestion →
            respiratory balance
          </li>
          <li className="border rounded-lg p-4 bg-white">
            <strong>Siddha:</strong> Rejuvenation concepts → respiratory care →
            longevity focus
          </li>
          <li className="border rounded-lg p-4 bg-white md:col-span-2">
            <strong>Homeopathy:</strong> Symptom observation →
            individualized remedy logic
          </li>
        </ul>
      </section>

      {/* 3. PLANT LEARNING MODE (EXPLAINED) */}
      <section className="mb-12 bg-emerald-50 border border-emerald-100 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
          Plant Learning Modes
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          HerbSphere 3D supports different levels of learning. Beginner mode
          focuses on basic understanding and traditional use, while Advanced
          mode introduces deeper system-level and scientific context. This
          layered approach helps learners progress gradually without being
          overwhelmed.
        </p>
      </section>

      {/* 4. 3D EXPLORER NOTE */}
      <section className="mb-12 bg-emerald-50 border border-emerald-100 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
          Role of 3D Visualization in Learning
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          The 3D models in HerbSphere 3D are designed as interactive learning
          aids. They help users visualize plant structure and form in a way that
          static images cannot. These models are representative and intended
          purely for educational exploration, not botanical precision or
          clinical diagnosis.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-xs text-gray-500 border-t pt-4">
        Educational platform for AYUSH learning. Not a substitute for
        professional medical advice.
      </footer>
    </div>
  );
}

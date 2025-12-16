import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">
            About HerbSphere 3D
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            An Interactive Virtual AYUSH Medicinal Plant Explorer
          </p>
        </header>

        <div className="bg-white/90 rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              Project Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              HerbSphere 3D is a comprehensive educational platform designed to
              explore and learn about medicinal plants used in AYUSH (Ayurveda,
              Yoga & Naturopathy, Unani, Siddha, and Homeopathy) systems of
              medicine. The platform combines traditional knowledge with modern
              interactive technology, featuring 3D models, audio guides, and
              detailed plant profiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              Objectives
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Provide an immersive 3D exploration experience for medicinal
                plants
              </li>
              <li>
                Educate users about traditional AYUSH medicinal systems and
                their plant-based remedies
              </li>
              <li>
                Offer detailed information including cultivation tips, medicinal
                benefits, and safety precautions
              </li>
              <li>
                Support academic learning and practical knowledge for students,
                practitioners, and enthusiasts
              </li>
              <li>
                Preserve and promote traditional knowledge through modern
                technology
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              AYUSH System Learning Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Use this guide to choose the right system to study or discuss during viva. Match the
              context (wellness vs. condition) to the system that excels there.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
              <div className="space-y-2">
                <h3 className="text-emerald-900 font-semibold">When to choose</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Ayurveda:</strong> Lifestyle balance, digestion, immunity, stress adaptation.</li>
                  <li><strong>Yoga &amp; Naturopathy:</strong> Mind-body fitness, breathing, sleep, metabolic reset.</li>
                  <li><strong>Unani:</strong> Temperament-based care, respiratory comfort, digestive tonics.</li>
                  <li><strong>Siddha:</strong> Traditional Tamil formulations, respiratory support, rejuvenation.</li>
                  <li><strong>Homeopathy:</strong> Micro-dosed remedies for individualized symptom patterns.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-emerald-900 font-semibold">Example use cases</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Digestion &amp; appetite:</strong> Ayurveda or Unani approaches.</li>
                  <li><strong>Immunity &amp; resilience:</strong> Ayurveda, Siddha tonics, or Yoga lifestyle.</li>
                  <li><strong>Stress, sleep, mood:</strong> Yoga &amp; Naturopathy; Homeopathy for tailored symptoms.</li>
                  <li><strong>Respiratory comfort:</strong> Unani or Siddha traditional support paths.</li>
                  <li><strong>Lifestyle disorders (mild):</strong> Ayurveda (diet/ritucharya) + Yoga (asanas/pranayama).</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Tip for viva: Start with the person’s goal (e.g., better sleep, lighter digestion, calm breathing)
              and map it to the system known for that focus. Avoid plant-level detail here; the plant cards already
              provide specifics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              3D Visualization in HerbSphere 3D
            </h2>
            <p className="text-gray-700 leading-relaxed">
              3D models in this project are representative educational visualizations. They help students
              explore shape, volume, and spatial context interactively. Botanical accuracy may vary, and models
              can be upgraded in future versions. Treat the models as learning aids—not diagnostic references.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>3D Model Viewer:</strong> Interactive 3D visualization
                of medicinal plants with camera controls
              </li>
              <li>
                <strong>Audio Guides:</strong> Listen to plant descriptions and
                key information
              </li>
              <li>
                <strong>System-Based Organization:</strong> Browse plants by
                AYUSH system (Ayurveda, Unani, Siddha, Homeopathy, Yoga &
                Naturopathy)
              </li>
              <li>
                <strong>Comprehensive Profiles:</strong> Detailed information
                including uses, constituents, dosage, and precautions
              </li>
              <li>
                <strong>Search Functionality:</strong> Quick search across plant
                names, scientific names, and descriptions
              </li>
              <li>
                <strong>Interactive Quizzes:</strong> Test knowledge with
                plant-specific mini quizzes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>React 19</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                  <li>@google/model-viewer</li>
                  <li>Three.js / React Three Fiber</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>MongoDB / Mongoose</li>
                  <li>RESTful API</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-3">
              Educational Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This platform is designed for educational purposes and is not
              intended as a substitute for professional medical advice. All
              information is sourced from traditional texts, Ministry of AYUSH
              resources, and classical pharmacopoeias. Users are encouraged to
              consult qualified practitioners before using any medicinal plants
              for therapeutic purposes.
            </p>
          </section>

          <section className="pt-4 border-t border-emerald-100">
            <p className="text-sm text-gray-600 text-center">
              © 2025 HerbSphere 3D — Virtual Herbal Garden for AYUSH education.
              Built with React, Vite, Tailwind CSS and @google/model-viewer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}



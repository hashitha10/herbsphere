// src/Pages/AyushPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Brain, HeartPulse, Leaf, Syringe } from "lucide-react";
import LotusIcon from "../components/icons/LotusIcon";

export default function AyushPage() {
  const systems = [
    {
      id: "ayurveda",
      title: "Ayurveda",
      desc: "Holistic healing: herbal therapies, diet and lifestyle.",
      color: "from-yellow-400 to-amber-600",
      icon: <LotusIcon size={48} className="text-white" />,
      link: "/ayurveda"
    },
    {
      id: "yoga",
      title: "Yoga & Naturopathy",
      desc: "Movement, breathwork and natural therapies.",
      color: "from-green-400 to-emerald-600",
      icon: <Leaf size={40} className="text-white" />,
      link: "/system/yoga"
    },
    {
      id: "unani",
      title: "Unani",
      desc: "Temperament-based traditional Persian medicine.",
      color: "from-blue-400 to-cyan-600",
      icon: <Brain size={40} className="text-white" />,
      link: "/system/unani"
    },
    {
      id: "siddha",
      title: "Siddha",
      desc: "Ancient Tamil medicine rooted in alchemy & herbs.",
      color: "from-purple-400 to-violet-600",
      icon: <HeartPulse size={40} className="text-white" />,
      link: "/system/siddha"
    },
    {
      id: "homeopathy",
      title: "Homeopathy",
      desc: "Micro-dosed remedies following 'like cures like'.",
      color: "from-pink-400 to-rose-600",
      icon: <Syringe size={40} className="text-white" />,
      link: "/system/homeopathy"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-green-800 text-center mb-6">
        AYUSH Systems
      </h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        Explore India’s traditional healing systems — learn about herbs, therapies, and healthy living.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {systems.map(s => (
          <Link key={s.id} to={s.link}>
            <div className="rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition">
              <div className={`h-36 flex items-center justify-center bg-gradient-to-br ${s.color}`}>
                {s.icon}
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-2xl font-semibold text-green-700">{s.title}</h3>
                <p className="text-gray-600 mt-2">{s.desc}</p>
                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Explore →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

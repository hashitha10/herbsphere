import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src="/herbsphere-logo.png" className="w-10 h-10" />
          <div>
            <div className="text-xl font-bold">HerbSphere 3D</div>
            <div className="text-xs opacity-80">
              Immersive AYUSH Explorer
            </div>
          </div>
        </Link>

        <div className="flex gap-4 items-center text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/ayush">AYUSH Dashboard</Link>
          <Link to="/search">Search</Link>

          <button
            onClick={() => alert("Quiz will be added soon 🚀")}
            className="px-4 py-2 bg-yellow-400 text-green-900 rounded-lg font-semibold"
          >
            Take Quiz
          </button>
        </div>

      </div>
    </nav>
  );
}

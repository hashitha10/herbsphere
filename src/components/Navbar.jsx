import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-emerald-900/95 text-white sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.svg"
              className="w-9 h-9 rounded-full bg-white/10 border border-emerald-500 object-contain"
              alt="HerbSphere logo"
            />
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">
                HerbSphere 3D
              </div>
              <div className="text-[0.7rem] uppercase tracking-[0.2em] text-emerald-100/80">
                Interactive AYUSH Medicinal Plant Explorer
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="hover:text-emerald-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/ayush"
              className="hover:text-emerald-200 transition-colors"
            >
              Systems
            </Link>
            <Link
              to="/ayush"
              className="hover:text-emerald-200 transition-colors"
            >
              3D Explorer
            </Link>
            <Link
              to="/search"
              className="hover:text-emerald-200 transition-colors"
            >
              Search
            </Link>
            <a
              href="#about"
              className="hover:text-emerald-200 transition-colors"
            >
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-emerald-800 bg-emerald-950/95">
          <div className="px-4 pt-2 pb-4 space-y-1 text-sm">
            <Link
              to="/"
              className="block px-3 py-1.5 rounded-md hover:bg-emerald-800/80"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/ayush"
              className="block px-3 py-1.5 rounded-md hover:bg-emerald-800/80"
              onClick={() => setOpen(false)}
            >
              Systems
            </Link>
            <Link
              to="/ayush"
              className="block px-3 py-1.5 rounded-md hover:bg-emerald-800/80"
              onClick={() => setOpen(false)}
            >
              3D Explorer
            </Link>
            <Link
              to="/search"
              className="block px-3 py-1.5 rounded-md hover:bg-emerald-800/80"
              onClick={() => setOpen(false)}
            >
              Search
            </Link>
            <a
              href="#about"
              className="block px-3 py-1.5 rounded-md hover:bg-emerald-800/80"
              onClick={() => setOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

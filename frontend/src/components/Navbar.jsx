import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isActive = (path) => location.pathname === path;

  const getInitials = () => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    toast.success("Logged out successfully!");
    navigate("/usertype");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center pulse-glow">
            <span className="text-xl">🔐</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">EvidenceLocker</h1>
            <p className="text-indigo-400 text-xs">Blockchain Secured</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            🏠 Home
          </Link>
          <Link
            to="/upload"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/upload")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            📤 Upload Evidence
          </Link>
          <Link
            to="/verify"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/verify")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            🔍 Verify Evidence
          </Link>

          {/* Profile Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {getInitials()}
              </div>
              <span className="text-white text-sm font-medium">
                {user.firstName || "User"}
              </span>
              <span className={`text-slate-400 text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-56 glass rounded-2xl p-2 shadow-2xl border border-slate-700/50 fade-in-up">
                <div className="px-3 py-2 mb-1 border-b border-slate-700/50">
                  <p className="text-white font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-slate-400 text-xs truncate">{user.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  <span>👤</span> View Profile
                </Link>

                <Link
                  to="/upload"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  <span>📤</span> Upload Evidence
                </Link>

                <Link
                  to="/verify"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  <span>🔍</span> Verify Evidence
                </Link>

                <div className="border-t border-slate-700/50 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 px-4 pb-4 border-t border-slate-700/50 pt-4">
          <Link
            to="/"
            className="text-slate-300 hover:text-white py-2"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            to="/upload"
            className="text-slate-300 hover:text-white py-2"
            onClick={() => setMenuOpen(false)}
          >
            📤 Upload Evidence
          </Link>
          <Link
            to="/verify"
            className="text-slate-300 hover:text-white py-2"
            onClick={() => setMenuOpen(false)}
          >
            🔍 Verify Evidence
          </Link>
          <Link
            to="/profile"
            className="text-slate-300 hover:text-white py-2"
            onClick={() => setMenuOpen(false)}
          >
            👤 Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 py-2 text-left"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
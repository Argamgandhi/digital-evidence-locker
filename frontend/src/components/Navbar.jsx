import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home",   path: "/"       },
    { label: "Upload", path: "/upload" },
    { label: "Verify", path: "/verify" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg">🔐</div>
          <span className="text-white font-bold text-lg">EvidenceLocker</span>
        </div>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path) ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div>
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/profile") ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{user.userType === "verification_authority" ? "🔏" : "👤"}</span>
              {user.firstName}
            </button>
          ) : (
            <button
              onClick={() => navigate("/usertype")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navigateTo = (path) => {
    setMobileMenuOpen(false); // Close automatically after link clicked
    navigate(path);
  }

  const baseLinks = [
    { label: "Home",   path: "/"       },
    { label: "Verify", path: "/verify" },
  ];

  if (!user || user.userType !== "verification_authority") {
    baseLinks.splice(1, 0, { label: "Upload", path: "/upload" });
  }

  const authLinks = [];
  if (user && user.userType === "verification_authority") {
    authLinks.push({ label: "Consensus", path: "/consensus"});
  }

  const navLinks = [...baseLinks, ...authLinks];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div onClick={() => navigateTo("/")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg">🔐</div>
          <span className="text-white font-bold text-lg">EvidenceLocker</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigateTo(link.path)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path) ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex">
          {user ? (
            <button
              onClick={() => navigateTo("/profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/profile") ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{user.userType === "verification_authority" ? "🔏" : "👤"}</span>
              {user.firstName}
            </button>
          ) : (
            <button
              onClick={() => navigateTo("/usertype")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white text-2xl"
            >
              ☰
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full border-b border-white/5 flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigateTo(link.path)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path) ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
          {user ? (
             <button
              onClick={() => navigateTo("/profile")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive("/profile") ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              👤 Profile ({user.firstName})
            </button>
          ) : (
             <button
              onClick={() => navigateTo("/usertype")}
              className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
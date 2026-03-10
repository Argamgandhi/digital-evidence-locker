import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const userTypes = [
  {
    id: "organization",
    icon: "🏛️",
    title: "Organisation",
    desc: "Government bodies, legal firms, law enforcement agencies",
    color: "from-blue-600 to-cyan-500",
    border: "border-blue-500/40",
    glow: "hover:shadow-blue-500/20",
  },
  {
    id: "professional",
    icon: "💼",
    title: "Professional",
    desc: "Lawyers, investigators, forensic experts, researchers",
    color: "from-indigo-600 to-violet-500",
    border: "border-indigo-500/40",
    glow: "hover:shadow-indigo-500/20",
  },
  {
    id: "personal",
    icon: "👤",
    title: "Personal",
    desc: "Individuals securing personal documents and files",
    color: "from-purple-600 to-pink-500",
    border: "border-purple-500/40",
    glow: "hover:shadow-purple-500/20",
  },
];

const UserType = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [hovering, setHovering] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem("userType", selected);
    navigate("/login");
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-3xl"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-12 fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl mb-6 pulse-glow float-animation">
            🔐
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              EvidenceLocker
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Tell us how you plan to use the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {userTypes.map((type, i) => (
            <div
              key={type.id}
              onClick={() => setSelected(type.id)}
              onMouseEnter={() => setHovering(type.id)}
              onMouseLeave={() => setHovering(null)}
              className={`relative glass rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${type.glow} hover:shadow-2xl fade-in-up ${
                selected === type.id
                  ? `${type.border} scale-105 shadow-2xl`
                  : "border-slate-700/50 hover:border-slate-500/50"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {selected === type.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4 transition-transform duration-200 ${
                  hovering === type.id ? "scale-110" : ""
                }`}
              >
                {type.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{type.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-12 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
              selected
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-border pulse-glow scale-100 hover:scale-105"
                : "bg-slate-700 opacity-50 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
          <p className="text-slate-500 text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserType;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserType = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const types = [
    {
      id: "organization",
      icon: "🏛️",
      label: "Organisation",
      desc: "Government bodies, legal firms, law enforcement agencies",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "professional",
      icon: "💼",
      label: "Professional",
      desc: "Lawyers, investigators, forensic experts, researchers",
      color: "from-indigo-600 to-indigo-800",
    },
    {
      id: "personal",
      icon: "👤",
      label: "Personal",
      desc: "Individuals securing personal documents and files",
      color: "from-purple-600 to-purple-800",
    },
    {
      id: "verification_authority",
      icon: "🔏",
      label: "Verification Authority",
      desc: "Authorised bodies who can verify & audit all uploaded evidence",
      color: "from-rose-600 to-rose-900",
    },
  ];

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem("userType", selected);
    navigate("/register");
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10 fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl mb-4 pulse-glow">
            🔐
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome to EvidenceLocker</h1>
          <p className="text-slate-400">Tell us how you plan to use the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {types.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2 ${
                selected === t.id
                  ? "border-indigo-500 bg-indigo-600/10 scale-105"
                  : "border-transparent hover:border-slate-600"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-3`}>
                {t.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{t.label}</h3>
              <p className="text-slate-400 text-sm">{t.desc}</p>
              {selected === t.id && (
                <div className="mt-3 text-indigo-400 text-sm font-semibold">✓ Selected</div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
            selected
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-border"
              : "bg-slate-700 cursor-not-allowed opacity-50"
          }`}
        >
          Continue →
        </button>

        <p className="text-center text-slate-500 text-sm mt-4">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-indigo-400 cursor-pointer hover:text-indigo-300">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserType;
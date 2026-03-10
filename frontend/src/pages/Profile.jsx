import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const userTypeLabels = {
  organization: {
    label: "Organisation",
    icon: "🏛️",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    desc: "Access for government bodies, legal firms and law enforcement agencies.",
  },
  professional: {
    label: "Professional",
    icon: "💼",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/30",
    desc: "Access for lawyers, investigators, forensic experts and researchers.",
  },
  personal: {
    label: "Personal",
    icon: "👤",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    desc: "Access for individuals securing personal documents and files.",
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = localStorage.getItem("userType") || "personal";
  const current = userTypeLabels[userType] || userTypeLabels.personal;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    toast.success("Logged out successfully!");
    navigate("/usertype");
  };

  const getInitials = () => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const infoItems = [
    { label: "First Name", value: user.firstName, icon: "👤" },
    { label: "Last Name", value: user.lastName, icon: "👤" },
    { label: "Email Address", value: user.email, icon: "📧" },
    { label: "Phone Number", value: user.phone || "Not provided", icon: "📱" },
    { label: "Date of Birth", value: user.dob || "Not provided", icon: "🎂" },
    { label: "Organisation", value: user.organisation || "Not provided", icon: "🏢" },
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-8 fade-in-up">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4 pulse-glow">
            {getInitials()}
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-400 mt-1">{user.email}</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mt-3 ${current.bg}`}>
            <span>{current.icon}</span>
            <span className={`text-sm font-semibold ${current.color}`}>
              {current.label} Account
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6 fade-in-up">
          {[
            { icon: "⛓️", label: "Blockchain", value: "Active" },
            { icon: "🔐", label: "Security", value: "SHA-256" },
            { icon: "✅", label: "Status", value: "Verified" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center card-hover">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-indigo-400 font-bold text-sm">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile Info Card */}
        <div className="glass rounded-2xl p-6 mb-6 fade-in-up">
          <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
            <span>📋</span> Profile Information
          </h2>
          <div className="space-y-4">
            {infoItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-slate-400 text-sm">{item.label}</span>
                </div>
                <span className="text-white text-sm font-medium">
                  {item.value || "Not provided"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Type Card */}
        <div className={`glass rounded-2xl p-6 mb-6 border ${current.bg} fade-in-up`}>
          <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <span>{current.icon}</span> Account Type
          </h2>
          <p className={`font-semibold text-lg ${current.color}`}>{current.label}</p>
          <p className="text-slate-400 text-sm mt-1">{current.desc}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3 fade-in-up">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 glow-border"
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-4 rounded-xl font-semibold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="glass rounded-2xl p-8 max-w-sm w-full text-center fade-in-up">
            <div className="text-5xl mb-4">🚪</div>
            <h3 className="text-white font-bold text-xl mb-2">Logout?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to logout from EvidenceLocker?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-500 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


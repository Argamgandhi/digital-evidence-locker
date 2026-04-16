import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState({ 
    totalUploads: 0, 
    totalUsers: 0, 
    recentUploads: [],
    verified: 0,
    pending: 0,
    rejected: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/upload/stats`)
      .then((res) => { if (res.data.success) setStats(res.data); })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-indigo-400 text-sm font-medium">⛓️ Powered by Ethereum Blockchain</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
            Secure Your Evidence<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              With Multi-Authority Consensus
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Upload digital evidence. Get an immutable blockchain record vetted by verified authorities. Tamper-proof, transparent, and permanent.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {(!user || user.userType !== "verification_authority") && (
              <button
                onClick={() => navigate(user ? "/upload" : "/usertype")}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-lg transition-all duration-200 glow-border"
              >
                Upload Evidence
              </button>
            )}
            <button
              onClick={() => navigate("/verify")}
              className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-xl text-lg transition-all duration-200"
            >
              Verify Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Blockchain Stats Dashboard */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">🔗 Live Consensus Statistics</h2>
          <p className="text-slate-400 text-sm">Real-time data from our deployed smart contract on Sepolia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-2xl p-6 text-center border border-purple-500/30">
              <div className="text-4xl font-extrabold text-purple-400 mb-2">
                1,000,000
              </div>
              <div className="text-white font-semibold">Total EVT Supply</div>
              <div className="text-slate-400 text-xs mt-1">In Circulation</div>
            </div>

          <div className="glass rounded-2xl p-6 text-center border border-green-500/30">
            <div className="text-4xl font-extrabold text-green-400 mb-2">
              {loadingStats ? "—" : (stats.verified || 0)}
            </div>
            <div className="text-white font-semibold">Verified Evidence</div>
          </div>

          <div className="glass rounded-2xl p-6 text-center border border-yellow-500/30">
            <div className="text-4xl font-extrabold text-yellow-500 mb-2">
              {loadingStats ? "—" : (stats.pending || 0)}
            </div>
            <div className="text-white font-semibold">Pending Review</div>
          </div>

          <div className="glass rounded-2xl p-6 text-center border border-red-500/30">
            <div className="text-4xl font-extrabold text-red-500 mb-2">
              {loadingStats ? "—" : (stats.rejected || 0)}
            </div>
            <div className="text-white font-semibold">Rejected</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-indigo-400 mb-2">
              {loadingStats ? "—" : (stats.totalUploads || 0)}
            </div>
            <div className="text-white font-semibold">Total Submissions</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-indigo-400 mb-2">
              {loadingStats ? "—" : (stats.totalUsers || 0)}
            </div>
            <div className="text-white font-semibold">Registered Users</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-rose-400 mb-2">Sepolia</div>
            <div className="text-white font-semibold">Network</div>
            <div className="text-slate-400 text-xs mt-1 font-mono break-all text-center">0xE27FA2f8fcAC28F6FC17485fE6edEACaf93EC2b5</div>
          </div>
        </div>

        {/* Cleaned up recent uploads block per request */}
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">How Verification Consensus Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { icon: "📤", title: "Upload & Hash", desc: "Select a file to compute its SHA-256 hash locally." },
            { icon: "☁️", title: "Store on IPFS", desc: "File is pinned securely on decentralized IPFS." },
            { icon: "⛓️", title: "Submit to Blockchain", desc: "Hash and metadata sent to Smart Contract." },
            { icon: "⚖️", title: "Authorities Vote", desc: "Authorities independently verify and cast their votes." },
            { icon: "✅", title: "Status Finalized", desc: "Final consensus reached based on the smart contract threshold." },
          ].map((step, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{step.icon}</div>
              <h3 className="text-white font-bold text-sm mb-2">{i+1}. {step.title}</h3>
              <p className="text-slate-400 text-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
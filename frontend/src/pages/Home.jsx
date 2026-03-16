import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "https://amiable-expression-production.up.railway.app";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState({ totalUploads: 0, totalUsers: 0, recentUploads: [] });
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
              Forever on Blockchain
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Upload digital evidence. Get an immutable blockchain record. Verify authenticity anytime — tamper-proof, transparent, and permanent.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate(user ? "/upload" : "/usertype")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-lg transition-all duration-200 glow-border"
            >
              Upload Evidence
            </button>
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
          <h2 className="text-2xl font-bold text-white mb-1">🔗 Live Blockchain Statistics</h2>
          <p className="text-slate-400 text-sm">Real-time data from our deployed smart contract on Sepolia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Uploads */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-5xl font-extrabold text-indigo-400 mb-2">
              {loadingStats ? "..." : stats.totalUploads}
            </div>
            <div className="text-white font-semibold">Total Evidence Uploaded</div>
            <div className="text-slate-400 text-sm mt-1">Recorded on blockchain</div>
          </div>

          {/* Total Users */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-5xl font-extrabold text-purple-400 mb-2">
              {loadingStats ? "..." : stats.totalUsers}
            </div>
            <div className="text-white font-semibold">Registered Members</div>
            <div className="text-slate-400 text-sm mt-1">Active on the platform</div>
          </div>

          {/* Contract Info */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-rose-400 mb-2">Sepolia</div>
            <div className="text-white font-semibold">Network</div>
            <div className="text-slate-400 text-xs mt-1 font-mono break-all">0x7Be61E...2e492</div>
          </div>
        </div>

        {/* Recent uploads on blockchain */}
        {stats.recentUploads && stats.recentUploads.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">🕐 Recent Blockchain Transactions</h3>
            <div className="space-y-3">
              {stats.recentUploads.map((u, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-sm">
                      📄
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{u.fileName}</div>
                      <div className="text-slate-400 text-xs font-mono">{u.fileHash?.slice(0, 24)}...</div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs text-right">
                    {new Date(u.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "📤", title: "Upload", desc: "Upload any file. We compute its SHA-256 hash and store it on the Ethereum blockchain permanently." },
            { icon: "🔍", title: "Verify", desc: "Enter the file hash or re-upload the file. We check the blockchain and confirm if it's authentic." },
            { icon: "⬇️", title: "Download", desc: "Use the file hash to retrieve and download the original file directly from IPFS at any time." },
          ].map((step, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to access file by hash - info box */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="glass rounded-2xl p-6 border border-indigo-500/20">
          <h3 className="text-white font-bold text-lg mb-3">🔑 How to Access a File Using Hash</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-300 text-sm mb-3">Every uploaded file gets a unique <span className="text-indigo-400 font-semibold">SHA-256 hash</span> — a 64-character fingerprint. You can use this hash to:</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Verify a file is authentic and untampered</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Download the original file from IPFS</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> View upload metadata (who, when, description)</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Share with Verification Authorities as proof</li>
              </ul>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2 font-semibold">EXAMPLE HASH</p>
              <p className="text-indigo-300 font-mono text-xs break-all mb-3">
                a3f9b2cc1d4e5f67890abc123def456789abcdef01234567890abcdef12345678
              </p>
              <p className="text-slate-400 text-xs mb-3">Go to <span className="text-white font-semibold">Verify</span> page → paste hash → click Verify Hash → download file</p>
              <button
                onClick={() => navigate("/verify")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Try Verifying Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
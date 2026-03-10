import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "🔒", title: "Tamper-Proof Storage", desc: "Files are hashed with SHA-256 and stored on the blockchain — any modification is instantly detected." },
  { icon: "⛓️", title: "Blockchain Immutability", desc: "Once recorded, evidence cannot be altered or deleted, ensuring a permanent audit trail." },
  { icon: "🌐", title: "Distributed Storage", desc: "Files are stored on IPFS — a decentralized network with no single point of failure." },
  { icon: "⏱️", title: "Timestamped Records", desc: "Every piece of evidence gets a blockchain timestamp proving exactly when it was submitted." },
  { icon: "🔍", title: "Instant Verification", desc: "Verify any file's authenticity in seconds by comparing its hash against the blockchain." },
  { icon: "📋", title: "Chain of Custody", desc: "Full audit trail of who uploaded what and when, powered by smart contracts." },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-8 fade-in-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Blockchain Network Active
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 fade-in-up glow-text leading-tight">
            Secure Digital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> Evidence</span>
            <br />on the Blockchain
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 fade-in-up">
            Store, protect, and verify digital evidence with cryptographic certainty.
            Powered by Ethereum smart contracts and IPFS distributed storage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up">
            <Link
              to="/upload"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 glow-border pulse-glow text-lg"
            >
              📤 Upload Evidence
            </Link>
            <Link
              to="/verify"
              className="px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200 text-lg"
            >
              🔍 Verify Evidence
            </Link>
          </div>

          {/* Floating Lock Icon */}
          <div className="mt-16 float-animation">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-5xl shadow-2xl glow-border">
              🔐
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: "SHA-256", label: "Encryption" },
            { value: "100%", label: "Tamper-Proof" },
            { value: "IPFS", label: "Distributed" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover">
              <p className="text-3xl font-bold text-indigo-400">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Why EvidenceLocker?</h2>
        <p className="text-slate-400 text-center mb-12">Built on cutting-edge blockchain technology for maximum security</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", icon: "📁", title: "Upload File", desc: "Select your evidence file to upload" },
            { step: "02", icon: "🔑", title: "Hash Generated", desc: "SHA-256 hash is computed from file" },
            { step: "03", icon: "🌐", title: "IPFS Storage", desc: "File stored on decentralized network" },
            { step: "04", icon: "⛓️", title: "Blockchain Record", desc: "Hash permanently stored on chain" },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover relative">
              <div className="text-indigo-400 font-bold text-sm mb-3">{item.step}</div>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="glass mt-16 px-6 py-8 text-center text-slate-400 text-sm">
        <p>🔐 Blockchain-Based Digital Evidence Locker | Built with Ethereum + IPFS + React</p>
        <p className="mt-1 text-xs">Group IBC12 — Secure. Immutable. Transparent.</p>
      </footer>
    </div>
  );
};

export default Home;
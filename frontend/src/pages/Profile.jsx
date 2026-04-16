import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import tokenABI from "../abi/EvidenceToken.json";

const BACKEND_URL = "http://localhost:5000"; 

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [uploads, setUploads] = useState([]);
  const [allUploads, setAllUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const isVerificationAuthority = user?.userType === "verification_authority";
  const [tab, setTab] = useState(isVerificationAuthority ? "all" : "my");
  const [evtBalance, setEvtBalance] = useState("100");

  const userTypeLabel = {
    professional:           { label: "Professional",           icon: "💼", color: "text-indigo-400" },
    organization:           { label: "Organisation",           icon: "🏛️", color: "text-blue-400"   },
    verification_authority: { label: "Verification Authority", icon: "🔏", color: "text-rose-400"   },
  };

  const typeInfo = userTypeLabel[user?.userType] || userTypeLabel.professional;

  const calculateEVT = useCallback(() => {
    if (isVerificationAuthority) {
      setEvtBalance("100"); // Base granted amount for authorities (they earn via consensus in future)
    } else {
      const deduction = uploads.length * 10;
      setEvtBalance((100 - deduction).toString());
    }
  }, [uploads, isVerificationAuthority]);

  const fetchMyUploads = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/upload/my-uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUploads(res.data.uploads);
    } catch {
      toast.error("Failed to load your uploads");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchAllUploads = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/upload/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setAllUploads(res.data.uploads);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchMyUploads();
    if (isVerificationAuthority) fetchAllUploads();
  }, [token, isVerificationAuthority, fetchMyUploads, fetchAllUploads, navigate]);

  useEffect(() => {
    calculateEVT();
  }, [calculateEVT]);

  const handleDownload = (fileHash) => {
    window.open(`${BACKEND_URL}/api/verify/download/${fileHash}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const displayList = tab === "my" ? uploads : allUploads;

  const getStatusBadge = (status) => {
    switch(status) {
      case "Submitted":
        return <span className="bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold">Submitted</span>;
      case "UnderReview":
        return <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">Under Review</span>;
      case "Verified":
        return <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Verified</span>;
      case "Rejected":
        return <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
      
        {/* EVT Token Balance Card */}
        <div className="glass rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between border border-purple-500/30 bg-purple-900/10">
          <div>
            <h2 className="text-xl font-bold text-purple-300 mb-1">Your EVT Balance: <span className="text-white">{evtBalance} EVT</span></h2>
            <p className="text-slate-400 text-sm">10 EVT charged per upload | 10 EVT rewarded per verified authority vote</p>
          </div>
          <div className="mt-4 sm:mt-0 text-4xl">💎</div>
        </div>

        {/* Profile Header */}
        <div className="glass rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl">
              {typeInfo.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className={`text-sm font-semibold ${typeInfo.color}`}>
                {typeInfo.label}
                {user?.organisation ? ` • ${user.organisation}` : ""}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {isVerificationAuthority && (
               <button
                 onClick={() => navigate("/consensus")}
                 className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition-colors"
               >
                 Consensus Panel
               </button>
            )}
            {!isVerificationAuthority && (
              <button
                onClick={() => navigate("/upload")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                + Upload New
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 glass hover:bg-red-600/20 text-slate-300 hover:text-red-400 rounded-xl text-sm font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Hash Access Info */}
        <div className="glass rounded-2xl p-5 mb-6 border border-indigo-500/20">
          <h3 className="text-white font-bold mb-2">🔑 How to Share or Access a File</h3>
          <p className="text-slate-400 text-sm">
            Copy the <span className="text-indigo-400 font-semibold">File Hash</span> from any upload below and share it with anyone. They can go to the{" "}
            <span onClick={() => navigate("/verify")} className="text-indigo-400 cursor-pointer hover:underline">
              Verify page
            </span>{" "}
            → paste the hash → verify authenticity and download the original file.
          </p>
        </div>

        {/* Tabs for Normal Users */}
        {!isVerificationAuthority && (
          <div className="glass rounded-xl p-1 flex gap-1 mb-6 w-fit">
            <button
              onClick={() => setTab("my")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "my" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              My Uploads ({uploads.length})
            </button>
          </div>
        )}

        {/* Uploads List */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-5">
            {tab === "all" ? "🔏 All Platform Uploads" : "📁 My Uploaded Evidence"}
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-400">No uploads yet.</p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
              >
                Upload Your First File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayList.map((upload, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-xl flex-shrink-0">
                        📄
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate flex gap-2 items-center">
                          {upload.fileName}
                          {getStatusBadge(upload.status)}
                        </p>
                        {upload.description && (
                          <p className="text-slate-400 text-xs truncate">{upload.description}</p>
                        )}
                        {tab === "all" && upload.User && (
                          <p className="text-rose-400 text-xs">
                            By: {upload.User.firstName} {upload.User.lastName} ({upload.User.email})
                          </p>
                        )}
                        <p className="text-slate-500 text-xs mt-1">
                          {upload.fileSize} • {new Date(upload.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(upload.fileHash)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        📋 Copy Hash
                      </button>
                      <button
                        onClick={() => handleDownload(upload.fileHash)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        ⬇️ Download
                      </button>
                      {upload.ipfsCID && (
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${upload.ipfsCID}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          🌐 View on IPFS
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-900/60 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400 text-xs font-mono truncate">{upload.fileHash}</span>
                    <button
                      onClick={() => copyToClipboard(upload.fileHash)}
                      className="text-indigo-400 hover:text-indigo-300 text-xs flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>

                  {upload.txHash && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-slate-500 text-xs">Tx:</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${upload.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-mono truncate"
                      >
                        {upload.txHash?.slice(0, 32)}...
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
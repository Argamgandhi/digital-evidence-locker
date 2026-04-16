import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000";

const ConsensusPanel = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, hash: null, reason: "" });

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/consensus/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPending(res.data.pending);
      }
    } catch (e) {
      toast.error("Could not load pending evidence.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user || user.userType !== "verification_authority") {
      navigate("/");
      return;
    }
    fetchPending();
  }, [user, navigate, fetchPending]);

  const handleVote = async (fileHash, approve, reason = "") => {
    try {
      toast.info("Submitting vote to blockchain...");
      const res = await axios.post(`${BACKEND_URL}/api/consensus/vote`, {
        fileHash,
        approve,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(`Vote cast successfully: ${approve ? "Approved" : "Rejected"}`);
        fetchPending();
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Error recording vote");
    }
  };

  const submitReject = () => {
    if (!rejectModal.reason) return toast.error("Please provide a reason to reject.");
    handleVote(rejectModal.hash, false, rejectModal.reason);
    setRejectModal({ open: false, hash: null, reason: "" });
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🔏 Consensus Panel</h1>
          <p className="text-slate-400">Review pending evidence and cast your authority vote.</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading pending evidence...</div>
          ) : pending.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No evidence currently pending review.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-sm">
                    <th className="py-3 px-4 font-semibold">File Details</th>
                    <th className="py-3 px-4 font-semibold">Uploader</th>
                    <th className="py-3 px-4 font-semibold">Votes</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pending.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="text-white font-semibold">{item.fileName}</div>
                        <div className="mt-2">
                          <button 
                            onClick={() => window.open(`${BACKEND_URL}/api/verify/download/${item.fileHash}`, "_blank")}
                            className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/30"
                          >⬇️ Download File to Verify</button>
                        </div>
                        <div className="text-indigo-400 font-semibold text-xs mt-1">
                          Status: {item.status}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top text-sm">
                        <div className="text-slate-300">{item.User?.firstName} {item.User?.lastName}</div>
                      </td>
                      <td className="py-4 px-4 align-top text-sm">
                        <div className="text-green-400">Approvals: {item.approvalCount}</div>
                        <div className="text-red-400 mt-1">Rejections: {item.rejectionCount}</div>
                      </td>
                      <td className="py-4 px-4 align-top text-right space-x-2">
                        <button
                          onClick={() => handleVote(item.fileHash, true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ open: true, hash: item.fileHash, reason: "" })}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {rejectModal.open && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
           <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Reject Evidence</h3>
              <p className="text-slate-400 text-sm mb-2">Hash: {rejectModal.hash.slice(0,24)}...</p>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white mb-4"
                rows="4" 
                placeholder="Enter rejection reason..."
                value={rejectModal.reason}
                onChange={e => setRejectModal({...rejectModal, reason: e.target.value})}
              ></textarea>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRejectModal({ open: false, hash: null, reason: "" })}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold"
                >Cancel</button>
                <button 
                  onClick={submitReject}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold"
                >Submit Reject</button>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default ConsensusPanel;

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "https://amiable-expression-production.up.railway.app";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);

      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.data.success) {
        setResult(response.data);
        toast.success("Evidence stored on blockchain!");
      } else {
        toast.error(response.data.error || "Upload failed");
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "Upload failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 flex items-center justify-center text-4xl mb-4">
            📤
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Upload Evidence</h1>
          <p className="text-slate-400">Store your file permanently on the blockchain</p>
        </div>

        {!result ? (
          <div className="glass rounded-2xl p-8">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-6 ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-600/10"
                  : "border-slate-600 hover:border-indigo-500 hover:bg-indigo-600/5"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-5xl mb-4">{isDragActive ? "📂" : "📁"}</div>
              {file ? (
                <div>
                  <p className="text-white font-semibold text-lg">{file.name}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-green-400 text-sm mt-2">File selected!</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium text-lg">
                    {isDragActive ? "Drop it here!" : "Drop your file here"}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">or click to browse</p>
                  <p className="text-slate-500 text-xs mt-1">Any file type supported</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this evidence..."
                rows={3}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
                loading || !file
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-border"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Storing on Blockchain...
                </span>
              ) : (
                "Store on Blockchain"
              )}
            </button>

            {loading && (
              <p className="text-slate-400 text-sm text-center mt-3">
                This may take 15-30 seconds while the transaction is confirmed...
              </p>
            )}
          </div>
        ) : (
          /* Success Result */
          <div className="glass rounded-2xl p-8 fade-in-up border border-green-500/30">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-green-400">Evidence Stored!</h2>
              <p className="text-slate-400 text-sm mt-1">
                Your file has been permanently recorded on the Ethereum blockchain
              </p>
            </div>

            <div className="space-y-3">
              {/* File Name */}
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">File Name</p>
                <p className="text-white text-sm font-medium">{result.fileName}</p>
              </div>

              {/* File Hash */}
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">File Hash (SHA-256) — Save this!</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-indigo-300 text-sm font-mono break-all flex-1">
                    {result.fileHash}
                  </p>
                  <button
                    onClick={() => copyToClipboard(result.fileHash)}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs flex-shrink-0"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Transaction Hash */}
              {result.txHash && (
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Blockchain Transaction Hash</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-green-300 text-sm font-mono break-all flex-1">
                      {result.txHash}
                    </p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-indigo-700 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}

              {/* IPFS CID */}
              {result.ipfsCID && (
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">IPFS CID</p>
                  <p className="text-slate-300 text-sm font-mono break-all">{result.ipfsCID}</p>
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="mt-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
              <p className="text-indigo-300 text-sm font-semibold mb-1">🔑 Save your File Hash!</p>
              <p className="text-slate-400 text-xs">
                Share this hash with anyone who needs to verify or download this file. They can go to the Verify page and paste this hash to confirm authenticity and download the original file.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setFile(null); setResult(null); setDescription(""); }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
              >
                Upload Another
              </button>
              <button
                onClick={() => window.location.href = "/profile"}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
              >
                View My Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
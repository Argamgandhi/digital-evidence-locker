import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "https://amiable-expression-production.up.railway.app";

const Verify = () => {
  const [file, setFile] = useState(null);
  const [hashInput, setHashInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("file");

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleVerifyFile = async () => {
    if (!file) return toast.error("Please select a file!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${BACKEND_URL}/api/verify/file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHash = async () => {
    if (!hashInput.trim()) return toast.error("Please enter a hash!");
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/verify/hash`,
        { fileHash: hashInput.trim() }
      );
      setResult(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600/20 flex items-center justify-center text-4xl mb-4">
            🔍
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Verify Evidence</h1>
          <p className="text-slate-400">Check if a file is authentic and untampered</p>
        </div>

        <div className="glass rounded-2xl p-2 flex gap-2 mb-6">
          <button
            onClick={() => { setMode("file"); setResult(null); }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              mode === "file"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Verify by File
          </button>
          <button
            onClick={() => { setMode("hash"); setResult(null); }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              mode === "hash"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Verify by Hash
          </button>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          {mode === "file" ? (
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? "border-purple-400 bg-purple-600/10"
                    : "border-slate-600 hover:border-purple-500 hover:bg-purple-600/5"
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
                      {isDragActive ? "Drop it here!" : "Drop the file to verify"}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">or click to browse</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleVerifyFile}
                disabled={loading || !file}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
                  loading || !file
                    ? "bg-slate-700 cursor-not-allowed opacity-50"
                    : "bg-purple-600 hover:bg-purple-500 glow-border"
                }`}
              >
                {loading ? "Verifying..." : "Verify File"}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Enter SHA-256 Hash
              </label>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Enter file hash here..."
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
              />
              <button
                onClick={handleVerifyHash}
                disabled={loading || !hashInput.trim()}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
                  loading || !hashInput.trim()
                    ? "bg-slate-700 cursor-not-allowed opacity-50"
                    : "bg-purple-600 hover:bg-purple-500 glow-border"
                }`}
              >
                {loading ? "Verifying..." : "Verify Hash"}
              </button>
            </div>
          )}
        </div>

        {result && (
          <div className={`glass rounded-2xl p-6 fade-in-up border ${
            result.isValid ? "border-green-500/30" : "border-red-500/30"
          }`}>
            <h3 className={`font-bold text-xl mb-4 ${
              result.isValid ? "text-green-400" : "text-red-400"
            }`}>
              {result.message}
            </h3>

            {result.isValid && result.data && (
              <div className="space-y-3">
                {[
                  { label: "File Name", value: result.data.fileName },
                  { label: "File Hash", value: result.data.fileHash },
                  { label: "Uploaded By", value: result.data.uploadedBy },
                  { label: "Timestamp", value: result.data.timestamp },
                  { label: "Description", value: result.data.description },
                  { label: "IPFS CID", value: result.data.ipfsCID },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                    <p className="text-white text-sm font-mono break-all">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {!result.isValid && (
              <div className="bg-red-900/20 rounded-xl p-4 mt-2">
                <p className="text-slate-300 text-sm">
                  This file was never uploaded or has been modified after upload.
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Hash checked: <span className="font-mono text-red-400">{result.data?.fileHash}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
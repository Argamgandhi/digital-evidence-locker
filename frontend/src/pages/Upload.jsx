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
    if (!file) return toast.error("Please select a file first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      const response = await axios.post(
        `${BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
      toast.success("Evidence stored on blockchain!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 flex items-center justify-center text-4xl mb-4">
            📤
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Upload Evidence</h1>
          <p className="text-slate-400">Store your file permanently on the blockchain</p>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
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
                  {isDragActive ? "Drop it here!" : "Drag and drop your file here"}
                </p>
                <p className="text-slate-400 text-sm mt-2">or click to browse files</p>
                <p className="text-slate-500 text-xs mt-3">Supports all file types</p>
              </div>
            )}
          </div>

          <div className="mt-6">
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

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
              loading || !file
                ? "bg-slate-700 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-500 glow-border pulse-glow"
            }`}
          >
            {loading ? "Storing on Blockchain..." : "Store on Blockchain"}
          </button>
        </div>

        {result && result.success && (
          <div className="glass rounded-2xl p-6 border border-green-500/30 fade-in-up">
            <h3 className="text-green-400 font-bold text-lg mb-4">
              Evidence Stored Successfully!
            </h3>
            <div className="space-y-3">
              {[
                { label: "File Name", value: result.data.fileName },
                { label: "SHA-256 Hash", value: result.data.fileHash },
                { label: "IPFS CID", value: result.data.ipfsCID },
                { label: "Transaction Hash", value: result.data.transactionHash },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white text-sm font-mono break-all">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-4 text-center">
              Save the file hash above to verify this evidence later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
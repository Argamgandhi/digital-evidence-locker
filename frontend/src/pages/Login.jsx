import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const userType = localStorage.getItem("userType") || "personal";

  const userTypeLabels = {
    organization: { label: "Organisation", icon: "🏛️", color: "text-blue-400" },
    professional: { label: "Professional", icon: "💼", color: "text-indigo-400" },
    personal: { label: "Personal", icon: "👤", color: "text-purple-400" },
  };

  const current = userTypeLabels[userType];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields!");
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl mb-4 pulse-glow">
            🔐
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Sign In</h1>
          <p className="text-slate-400 text-sm">
            Signing in as{" "}
            <span className={`font-semibold ${current.color}`}>
              {current.icon} {current.label}
            </span>
            {" — "}
            <span
              onClick={() => navigate("/usertype")}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              Change
            </span>
          </p>
        </div>

        <div className="glass rounded-2xl p-8 fade-in-up">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                loading
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-border"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              New to EvidenceLocker?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 transition-colors"
              >
                Create an account
              </span>
            </p>
          </div>
        </div>

        <p
          onClick={() => navigate("/usertype")}
          className="text-center text-slate-500 text-sm mt-6 cursor-pointer hover:text-slate-400 transition-colors"
        >
          ← Back
        </p>
      </div>
    </div>
  );
};

export default Login;
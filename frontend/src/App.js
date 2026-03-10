import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import UserType from "./pages/UserType";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/usertype" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen gradient-bg">
        <Routes>
          <Route path="/usertype" element={<AuthRoute><UserType /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <><Navbar /><Home /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <><Navbar /><Upload /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <><Navbar /><Verify /></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <><Navbar /><Profile /></>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{ background: "#1e293b", border: "1px solid #6366f1" }}
        />
      </div>
    </Router>
  );
}

export default App;
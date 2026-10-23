import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(" ");

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await axios.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error.message);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  };

  fetchUser();
}, []);
  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#1a1a1a] to-[#010101]">
      <Router>
        <Navbar user={user} setUser={setUser} />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" style={{ top: "80px" }} />

        <Routes>
          <Route path="/" element={<Home user={user} error={error} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

//Front-end authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 1) Create the context
const AuthContext = createContext();

// 2) Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // login() lets you set user + persist token
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // logout() clears everything
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // On mount, check for existing token & fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3) Hook for consuming
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

import React, { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("neolearn_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("neolearn_token");
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("neolearn_user", JSON.stringify(res.data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, userData) => {
    localStorage.setItem("neolearn_token", token);
    localStorage.setItem("neolearn_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (identifier, password) => {
    const res = await client.post("/auth/login", { username: identifier, password });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await client.post("/auth/register", payload);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("neolearn_token");
    localStorage.removeItem("neolearn_user");
    setUser(null);
  };

  const refreshUser = (userData) => {
    localStorage.setItem("neolearn_user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

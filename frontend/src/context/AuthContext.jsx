import React, { createContext, useContext, useState } from "react";
import api from "../utils/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // LocalStorage se initial state lazily load
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("rk_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem("rk_user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("rk_token");
    return saved || null;
  });

  const login = async (username, password) => {
    try {
      const res = await api.post("/api/auth/login", { username, password });
      const { token: jwtToken, username: uname, role } = res.data;

      const userData = { username: uname, role };
      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("rk_user", JSON.stringify(userData));
      localStorage.setItem("rk_token", jwtToken);

      return { success: true };
    } catch (err) {
      console.error("Login error", err);
      const msg =
        err.response?.data || "Invalid username or password";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rk_user");
    localStorage.removeItem("rk_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
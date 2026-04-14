import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD USER (AUTO LOGIN)
  useEffect(() => {
    const token = localStorage.getItem("taskly_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch((err) => {
        console.error("Auto login failed:", err);
        localStorage.removeItem("taskly_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔥 LOGIN
  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken, data } = res.data;

      localStorage.setItem("taskly_token", accessToken);
      setUser(data.user);

      return data.user;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  }, []);

  // 🔥 REGISTER
  const register = useCallback(async (formData) => {
    try {
      const res = await api.post("/auth/register", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, data } = res.data;

      localStorage.setItem("taskly_token", accessToken);
      setUser(data.user);

      return data.user;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  }, []);

  // 🔥 LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("taskly_token");
    setUser(null);
  }, []);

  // 🔥 UPDATE PROFILE (optional future)
  const updateUser = useCallback(async (updates) => {
    try {
      const res = await api.put("/auth/update", updates);
      setUser(res.data.data.user);
    } catch (err) {
      console.error("Update user error:", err.response?.data || err.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
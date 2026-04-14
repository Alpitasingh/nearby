import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("taskly_user");
    const token = localStorage.getItem("taskly_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Demo mode — simulate successful login
    const mockUser = {
      id: "u_001",
      name: "Arjun Joshi",
      initials: "AJ",
      email,
      handle: "@arjun.taskly",
      rating: 4.9,
      reviews: 84,
      bio: "Full-stack dev & designer. Quick turnaround, clean code. Bengaluru-based.",
      tasksCompleted: 47,
      earned: 82000,
      completionRate: 98,
      skills: ["React", "Node.js", "UI/UX", "Python", "Figma"],
      joinedDate: "March 2023",
    };
    const mockToken = "mock_jwt_" + Date.now();
    localStorage.setItem("taskly_token", mockToken);
    localStorage.setItem("taskly_user", JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }, []);

  const register = useCallback(async (data) => {
    const mockUser = {
      id: "u_" + Date.now(),
      name: `${data.firstName} ${data.lastName}`,
      initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      email: data.email,
      handle: `@${data.firstName.toLowerCase()}.taskly`,
      rating: 0,
      reviews: 0,
      bio: "New to Taskly — excited to get started!",
      tasksCompleted: 0,
      earned: 0,
      completionRate: 100,
      skills: [],
      joinedDate: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
    const mockToken = "mock_jwt_" + Date.now();
    localStorage.setItem("taskly_token", mockToken);
    localStorage.setItem("taskly_user", JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("taskly_token");
    localStorage.removeItem("taskly_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("taskly_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

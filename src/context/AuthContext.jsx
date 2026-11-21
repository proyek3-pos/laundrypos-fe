import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return {
      token,
      role: localStorage.getItem("userRole") || "staff",
      username: localStorage.getItem("username") || "",
    };
  });

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "admin",
      async login(token, role, username) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("username", username);
        setUser({ token, role, username });
      },
      async logout() {
        // Server mencabut token; kalau gagal, sesi lokal tetap ditutup.
        try {
          await api.post("/logout");
        } catch {
          // abaikan
        }
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/app" replace />;
  }
  return children;
}

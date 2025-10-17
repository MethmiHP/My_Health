import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// If a token was accidentally saved like `"eyJ..."`, unquote it.
// Also handles the case where someone stored JSON.stringify(token).
function unquoteToken(t) {
  if (!t) return "";
  try {
    const parsed = JSON.parse(t);
    if (typeof parsed === "string") return parsed;
  } catch {}
  return String(t).replace(/^"+|"+$/g, "");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  const [token, setToken] = useState(() => unquoteToken(localStorage.getItem("token")));

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Persist token to localStorage (as a raw string)
  useEffect(() => {
    const clean = unquoteToken(token);
    if (clean) localStorage.setItem("token", clean);
    else localStorage.removeItem("token");
  }, [token]);

  // Logout helper
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Bootstrap session from /me when we have a token but no user yet
  useEffect(() => {
    const bootstrap = async () => {
      const clean = unquoteToken(token);
      if (!clean) return;
      try {
        const res = await fetch(`${API}/api/hospital/auth/me`, {
          headers: { Authorization: `Bearer ${clean}` },
        });
        if (!res.ok) {
          logout();
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (data?.user) setUser(data.user);
      } catch {
        // network hiccup — leave current state as-is
      }
    };
    if (token && !user) bootstrap();
  }, [token]); // run when token changes

  // Login (generic for admin/doctor/patient/cashier)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/hospital/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || "Login failed" };
      }

      const clean = unquoteToken(data.token);
      setUser(data.user);
      setToken(clean);

      return { success: true, role: data.user.role, user: data.user, token: clean };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // Ready-to-use Authorization header
  const authHeaders = useMemo(() => {
    const clean = unquoteToken(token);
    return clean ? { Authorization: `Bearer ${clean}` } : {};
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token: unquoteToken(token), login, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

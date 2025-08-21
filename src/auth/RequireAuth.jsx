import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getTokens, isJwtExpired, refreshAccessToken, clearAuth } from "../api/auth";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "redirect"
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const { access, refresh } = getTokens();

      // No tokens at all -> redirect to login
      if (!access && !refresh) {
        if (!cancelled) {
          setRedirectTo("/login");
          setStatus("redirect");
        }
        return;
      }

      // Access token present and still valid -> allow
      if (access && !isJwtExpired(access)) {
        if (!cancelled) setStatus("ok");
        return;
      }

      // Access missing or expired: try to refresh if we have a refresh token
      if (refresh) {
        const res = await refreshAccessToken();
        if (!cancelled) {
          if (res.ok) {
            setStatus("ok");
          } else {
            // Refresh failed -> clear and redirect to login
            try {
              clearAuth();
            } catch {}
            setRedirectTo("/login");
            setStatus("redirect");
          }
        }
        return;
      }

      // Fallback: no usable tokens
      if (!cancelled) {
        setRedirectTo("/login");
        setStatus("redirect");
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
    // Re-run when the path changes (helps re-check on protected route transitions)
  }, [location.pathname]);

  if (status === "checking") {
    // Minimal full-viewport skeleton loader
    const darkMode =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div className="relative">
          <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "redirect") {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // status === "ok"
  return <>{children}</>;
}

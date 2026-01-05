import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getTokens, isJwtExpired, refreshAccessToken } from "@/api/auth";

export default function RedirectIfAuthenticated({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // "checking" | "redirect" | "allow"
  const [redirectTo, setRedirectTo] = useState("/post-login");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const { access, refresh } = getTokens();

      // No tokens at all -> allow access to auth pages
      if (!access && !refresh) {
        if (!cancelled) setStatus("allow");
        return;
      }

      // Access token present and still valid -> redirect
      if (access && !isJwtExpired(access)) {
        if (!cancelled) {
          setRedirectTo("/post-login");
          setStatus("redirect");
        }
        return;
      }

      // Access missing or expired: try to refresh if we have a refresh token
      if (refresh) {
        const res = await refreshAccessToken();
        if (!cancelled) {
          if (res.ok) {
            setRedirectTo("/post-login");
            setStatus("redirect");
          } else {
            // Refresh failed -> allow access to auth pages (user needs to login again)
            setStatus("allow");
          }
        }
        return;
      }

      // Fallback: allow access
      if (!cancelled) setStatus("allow");
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
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

  // status === "allow"
  return <>{children}</>;
}

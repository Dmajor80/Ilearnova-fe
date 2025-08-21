import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTokens } from "../api/auth";

/**
 * Central post-login redirector.
 * Reads persisted user_data and decides where to send the user based on:
 * - first-time login flag
 * - role(s)
 * - organization context (minimal for now; routes to existing pages)
 *
 * This is a minimal first implementation that maps to existing routes:
 * - superadmin → /admin-dashboard/dashboard (current src/admin/*)
 * - org_admin/admin → /dashboard (current src/School-Admin/*)
 * - teacher → /teacher-dashboard
 * - student → /student-dashboard
 * - parent → /home (until a parent dashboard route is mounted)
 * Fallback → /home
 */
export default function PostLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Helper to read user_data from whichever storage holds tokens/user
    const getStoredUser = () => {
      try {
        // Prefer the storage that holds tokens
        const { store } = getTokens();
        const raw =
          store?.getItem("user_data") ||
          window.localStorage.getItem("user_data") ||
          window.sessionStorage.getItem("user_data");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const user = getStoredUser();

    // If no user data, go to /home as a safe fallback (RequireAuth should already guard upstream)
    if (!user) {
      navigate("/home", { replace: true, state: { from: location } });
      return;
    }

    // Support multiple possible backend flags for first-time login
    const isFirstTime =
      user.first_time_user === true;

    if (isFirstTime) {
      navigate("/select-user-type", { replace: true, state: { from: location } });
      return;
    }

    // Normalize roles: allow either user.role (string) or user.roles (array)
    let roles = [];
    if (Array.isArray(user.roles)) {
      roles = user.roles.map((r) => String(r.role?.code || "").toLowerCase());
    } else if (typeof user.role === "string") {
      roles = [String(user.role).toLowerCase()];
    }

    // Role precedence: superadmin > org_admin/admin > teacher > student > parent
    const has = (r) => roles.includes(r);
    if (has("superadmin")) {
      navigate("/admin-dashboard/dashboard", { replace: true });
      return;
    }
    if (has("org_admin") || has("admin")) {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (has("teacher")) {
      navigate("/teacher-dashboard", { replace: true });
      return;
    }
    if (has("student")) {
      navigate("/student-dashboard", { replace: true });
      return;
    }
    if (has("parent")) {
      // Parent dashboard route not currently mounted; use /home for now
      navigate("/home", { replace: true });
      return;
    }

    // Default fallback
    navigate("/home", { replace: true });
  }, [navigate, location]);

  // Minimal full-viewport skeleton while redirecting
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

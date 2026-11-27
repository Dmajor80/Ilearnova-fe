import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTokens } from "../../api/auth";
import { http } from "../../api/baseClient";

/**
 * Central post-login redirector.
 * Reads persisted user_data and decides where to send the user based on:
 * - first-time login flag
 * - role(s)
 * - organization context (minimal for now; routes to existing pages)
 *
 * This is a minimal first implementation that maps to existing routes:
 * - superadmin → /admin-dashboard/dashboard (current src/admin/*)
 * - org_admin/admin → /organization-dashboard (current src/organization/*)
 * - teacher → /teacher-dashboard
 * - student → /student-dashboard
 * - parent → /parent-dashboard
 * - individual_learner → /individual-dashboard
 * Fallback → /home
 */
export default function PostLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectUser = async () => {
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

      let user = getStoredUser();
      if (!user) {
        try {
          user = await http.get("/api/auth/profile/");
          // Store the fetched user data
          const { store } = getTokens();
          if (store && user) {
            store.setItem("user_data", JSON.stringify(user));
          }
        } catch {
          navigate("/home", { replace: true, state: { from: location } });
          return;
        }
      }

      // If no user data, go to /home as a safe fallback (RequireAuth should already guard upstream)
      if (!user) {
        navigate("/home", { replace: true, state: { from: location } });
        return;
      }

      // Support multiple possible backend flags for first-time login
      // const isFirstTime = user.first_time_user === true;

      // if (isFirstTime) {
      //   navigate("/select-user-type", { replace: true, state: { from: location } });
      //   return;
      // }

      // Normalize roles: allow either user.role (string) or user.roles (array)
      let roles = [];
      if (Array.isArray(user.roles)) {
        roles = user.roles.map((r) => {
          const roleCode = r.role?.code || r || "";
          return String(roleCode).toLowerCase();
        });
      } else if (typeof user.role === "string") {
        roles = [String(user.role).toLowerCase()];
      }


      // Role precedence: super_admin > org_admin > teacher > student > parent > individual_learner
      const has = (r) => roles.includes(r);
      // The platform owner is a Django superuser with no school role.
      if (user.is_superuser === true || has("super_admin") || has("superadmin")) {
        navigate("/admin-dashboard/dashboard", { replace: true });
        return;
      }
      if (has("org_admin") || has("admin")) {
        navigate("/organization-dashboard", { replace: true });
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
        navigate("/parent-dashboard", { replace: true });
        return;
      }
      if (has("individual_learner") || has("individual")) {
        navigate("/individual-dashboard", { replace: true });
        return;
      }

      // Default fallback
      navigate("/home", { replace: true });
    };

    redirectUser();
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

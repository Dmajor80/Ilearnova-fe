import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getTokens } from "../api/auth";

/**
 * RoleGate
 * - Guards route trees based on the user's role(s).
 *
 * Props:
 * - anyOf: string | string[]  (user must have at least one of these roles)
 * - fallbackTo?: string       (path to redirect when unauthorized; default: "/home")
 *
 * Notes:
 * - Supports user.roles (array) or user.role (string).
 * - Role matching is case-insensitive.
 * - This is a lightweight client-side UX gate. The backend must still enforce authorization.
 */
export default function RoleGate({ children, anyOf, fallbackTo = "/forbidden" }) {
  const location = useLocation();

  const normalizedRequired = React.useMemo(() => {
    if (!anyOf) return [];
    const arr = Array.isArray(anyOf) ? anyOf : [anyOf];
    return arr.map((r) => String(r || "").toLowerCase());
  }, [anyOf]);

  const user = React.useMemo(() => {
    try {
      const { store } = getTokens();
      const raw =
        store?.getItem("user_data") ||
        window.localStorage.getItem("user_data") ||
        window.sessionStorage.getItem("user_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // If no specific roles are required, just render
  if (!normalizedRequired.length) {
    return <>{children}</>;
  }

  let roles = [];
  if (Array.isArray(user?.roles)) {
    roles = user.roles.map((r) => String(r || "").toLowerCase());
  } else if (typeof user?.role === "string") {
    roles = [String(user.role).toLowerCase()];
  }

  const hasRequired = normalizedRequired.some((req) => roles.includes(req));

  if (!hasRequired) {
    return <Navigate to={fallbackTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

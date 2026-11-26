import { Navigate } from "react-router-dom";
import { getStoredUser } from "@/api/auth";
import { isSuperUser } from "@/lib/roles";

/** Only the platform superadmin may open /admin-dashboard. */
export default function SuperAdminGate({ children }) {
  const user = getStoredUser();
  if (user && !isSuperUser(user)) return <Navigate to="/post-login" replace />;
  return children;
}

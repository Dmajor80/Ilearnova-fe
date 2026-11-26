import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "@/api/auth";
import { useManagedSchool } from "@/lib/manageSchool";
import { isSuperUser, storedRoleCodes } from "@/lib/roles";

/**
 * Guards the org-admin dashboard. A platform superadmin gets in only while
 * managing a school (see lib/manageSchool); without one they go back to
 * the school list. Everyone else is unchanged: the API enforces access.
 */
export default function OrgAdminGate({ children }) {
  const managed = useManagedSchool();
  const location = useLocation();
  const user = getStoredUser();
  const roles = storedRoleCodes(user);
  const isOrgAdmin = roles.includes("org_admin") || roles.includes("admin");
  if (isSuperUser(user) && !managed && !isOrgAdmin) {
    return <Navigate to="/admin-dashboard/organizations" replace state={{ from: location }} />;
  }
  return children;
}

import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useOrganization } from "../context/OrganizationContext";

/**
 * OrgGate
 * - Blocks access to org-scoped areas until an organization context exists.
 * - Minimal skeleton behavior:
 *    - While loading org context: show a lightweight spinner.
 *    - If user has 0 organizations: redirect to /organization-details.
 *    - If user has exactly 1 organization and none selected: auto-select it.
 *    - If user has multiple orgs and none selected: show a blocking screen.
 *    - Otherwise: render children.
 */
export default function OrgGate({ children }) {
  const { loading, orgs, currentOrgId, setCurrentOrgId } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentOrgId && Array.isArray(orgs) && orgs.length === 1) {
      // Auto-pick the only available org
      const only = orgs[0];
      if (only && only.id) {
        setCurrentOrgId(only.id);
      }
    }
  }, [loading, currentOrgId, orgs, setCurrentOrgId]);

  if (loading) {
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

  // No organizations at all -> send user to onboarding to create/link one.
  if (!loading && Array.isArray(orgs) && orgs.length === 0) {
    return <Navigate to="/organization-details" state={{ from: location }} replace />;
  }

  // Multiple orgs but none selected: block with a simple message for now.
  if (!loading && (!currentOrgId || currentOrgId === "")) {
    const darkMode =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center px-6 ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div
          className={`max-w-lg w-full rounded-2xl p-6 shadow-xl ${
            darkMode ? "bg-gray-900/60 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">Organization required</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
            This area requires an organization context. Select an organization to continue.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(orgs || []).map((o) => (
              <button
                key={o?.id || o?.name}
                className="px-3 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                onClick={() => setCurrentOrgId(o?.id)}
              >
                {o?.name || o?.id}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => navigate("/organization-details", { replace: false })}
            >
              Create/Link Organization
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } transition`}
              onClick={() => navigate("/home")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Organization context is available
  return <>{children}</>;
}

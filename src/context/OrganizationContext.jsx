import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getTokens } from "../api/auth";

/**
 * OrganizationContext
 * - Holds the user's organizations and currentOrgId selection
 * - Persists selectedOrgId back to the same storage as user_data
 *
 * Minimal skeleton:
 * - Initializes from user_data in storage
 * - Auto-picks first org if only one exists
 * - Exposes setter to update selection (and persist to storage)
 */

const OrganizationContext = createContext(null);

function readUserDataFromStorage() {
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
}

function writeUserDataToStorage(nextUser) {
  try {
    const { store } = getTokens();
    const json = JSON.stringify(nextUser);
    // Prefer the same store that currently holds tokens
    if (store) {
      store.setItem("user_data", json);
      return;
    }
    // Fallbacks
    window.localStorage.setItem("user_data", json);
    window.sessionStorage.setItem("user_data", json);
  } catch {
    // no-op
  }
}

export function OrganizationProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const [currentOrgId, setCurrentOrgId] = useState(null);

  // Initialize from user_data
  useEffect(() => {
    let cancelled = false;

    function init() {
      const user = readUserDataFromStorage();

      // Debug logging to help identify the issue
      console.log("OrganizationContext: User data loaded:", user);

      // Handle different possible API response structures
      let userOrgs = [];
      if (Array.isArray(user?.organizations)) {
        userOrgs = user.organizations;
      } else if (Array.isArray(user?.orgs)) {
        userOrgs = user.orgs;
      }

      console.log("OrganizationContext: User organizations:", userOrgs);
      console.log("OrganizationContext: Organizations structure:", userOrgs.map(org => ({
        id: org?.organization?.id || org?.id,
        name: org?.organization?.name || org?.name,
        hasOrganization: !!org?.organization,
        rawOrg: org
      })));

      const selectedOrgId = user?.selectedOrgId || null;

      let initialOrgId = selectedOrgId;
      if (!initialOrgId) {
        // If exactly one org, auto-select it
        if (userOrgs.length === 1) {
          // Handle multiple possible API response structures
          const firstOrg = userOrgs[0];
          initialOrgId = firstOrg?.organization?.id ||
                        firstOrg?.id ||
                        (typeof firstOrg === 'string' ? firstOrg : null);
          console.log("OrganizationContext: Auto-selecting organization:", initialOrgId, "from:", firstOrg);
        } else if (userOrgs.length > 1) {
          console.log("OrganizationContext: Multiple organizations found, user needs to select one");
          // For now, auto-select the first one if user has multiple orgs
          const firstOrg = userOrgs[0];
          initialOrgId = firstOrg?.organization?.id ||
                        firstOrg?.id ||
                        (typeof firstOrg === 'string' ? firstOrg : null);
          console.log("OrganizationContext: Auto-selecting first organization:", initialOrgId);
        }
      }

      console.log("OrganizationContext: Final state - orgs:", userOrgs.length, "currentOrgId:", initialOrgId);

      if (!cancelled) {
        setOrgs(userOrgs);
        setCurrentOrgId(initialOrgId || null);
        setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSelectedOrgId = useCallback((orgId) => {
    const user = readUserDataFromStorage();
    if (!user) return;
    const nextUser = {
      ...user,
      selectedOrgId: orgId,
    };
    writeUserDataToStorage(nextUser);
  }, []);

  const setOrgId = useCallback((orgId) => {
    setCurrentOrgId(orgId || null);
    if (orgId) {
      persistSelectedOrgId(orgId);
    }
  }, [persistSelectedOrgId]);

  const value = useMemo(
    () => ({
      loading,
      orgs,
      currentOrgId,
      setCurrentOrgId: setOrgId,
    }),
    [loading, orgs, currentOrgId, setOrgId]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return ctx;
}

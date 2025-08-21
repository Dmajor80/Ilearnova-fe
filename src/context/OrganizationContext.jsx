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
      const userOrgs = Array.isArray(user?.organizations) ? user.organizations : [];
      const selectedOrgId = user?.selectedOrgId || user?.selected_org_id || null;

      let initialOrgId = selectedOrgId;
      if (!initialOrgId) {
        // If exactly one org, auto-select it
        if (userOrgs.length === 1) {
          initialOrgId = userOrgs[0]?.id || null;
        }
      }

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
      selectedOrgId: orgId, // prefer camelCase going forward
      selected_org_id: orgId, // keep snake_case for compatibility if backend expects it back later
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

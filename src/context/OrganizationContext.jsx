import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getTokens } from "../api/auth";
import { http } from "../api/baseClient";

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
  const [user, setUser] = useState(null);

  // Initialize from user_data
  useEffect(() => {
    let cancelled = false;

    function init() {
      const userData = readUserDataFromStorage();

      if (!userData) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      // Handle different possible API response structures
      let userOrgs = [];
      if (Array.isArray(userData?.organizations)) {
        userOrgs = userData.organizations;
      } else if (Array.isArray(userData?.orgs)) {
        userOrgs = userData.orgs;
      }

    
      const selectedOrgId = userData?.selectedOrgId || null;

      let initialOrgId = selectedOrgId;
      if (!initialOrgId) {
        if (userOrgs.length === 1) {
          const firstOrg = userOrgs[0];
          initialOrgId = firstOrg?.organization?.id ||
                        firstOrg?.id ||
                        (typeof firstOrg === 'string' ? firstOrg : null);
        } else if (userOrgs.length > 1) {
          // For now, auto-select the first one if user has multiple orgs
          const firstOrg = userOrgs[0];
          initialOrgId = firstOrg?.organization?.id ||
                        firstOrg?.id ||
                        (typeof firstOrg === 'string' ? firstOrg : null);
        }
      }


      if (!cancelled) {
        setUser(userData);
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
    const userData = readUserDataFromStorage();
    if (!userData) return;
    const nextUser = {
      ...userData,
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

  const refreshUser = useCallback(async () => {
    try {
      const userData = await http.get("/api/auth/profile/");
      if (userData) {
        const newUserData = { ...userData };
        setUser(newUserData);
        // Update user_data in storage
        writeUserDataToStorage(newUserData);
      }
    } catch (error) {
      console.error("OrganizationContext: Error refreshing user data:", error);
    }
  }, []);
  const value = useMemo(
    () => ({
      loading,
      user,
      orgs,
      currentOrgId,
      setCurrentOrgId: setOrgId,
      refreshUser,
    }),
    [loading, user, orgs, currentOrgId, setOrgId, refreshUser]
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

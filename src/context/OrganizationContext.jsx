import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_CHANGED_EVENT, getTokens } from "../api/auth";
import { http } from "../api/baseClient";

const OrganizationContext = createContext(null);

const AUTH_STORAGE_KEYS = ["user_data", "auth_access", "auth_refresh"];

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

  // Load the signed-in account from storage, and again whenever it changes
  // (log in / log out happen without a page reload, or in another tab).
  useEffect(() => {
    let cancelled = false;

    function init() {
      if (cancelled) return;
      const userData = readUserDataFromStorage();

      if (!userData) {
        setUser(null);
        setOrgs([]);
        setCurrentOrgId(null);
        setLoading(false);
        return;
      }

      // Handle different possible API response structures
      let userOrgs = [];
      if (Array.isArray(userData?.organizations)) {
        userOrgs = userData.organizations;
      } else if (Array.isArray(userData?.orgs)) {
        userOrgs = userData.orgs;
      }

      let initialOrgId = userData?.selectedOrgId || null;
      if (!initialOrgId && userOrgs.length > 0) {
        // Auto-select the first org (the only one, or the first of several)
        const firstOrg = userOrgs[0];
        initialOrgId =
          firstOrg?.organization?.id ||
          firstOrg?.id ||
          (typeof firstOrg === "string" ? firstOrg : null);
      }

      setUser(userData);
      setOrgs(userOrgs);
      setCurrentOrgId(initialOrgId || null);
      setLoading(false);
    }

    function onStorage(event) {
      // event.key is null when another tab cleared the whole storage
      if (event.key === null || AUTH_STORAGE_KEYS.includes(event.key)) {
        init();
      }
    }

    init();
    window.addEventListener(AUTH_CHANGED_EVENT, init);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED_EVENT, init);
      window.removeEventListener("storage", onStorage);
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

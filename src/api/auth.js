import { API_BASE_URL, REFRESH_PATH } from "./config";

// Small URL join helper to avoid double slashes
function joinUrl(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

// Choose the storage (localStorage or sessionStorage) based on where tokens exist
export function getAuthStorage() {
  if (typeof window === "undefined") return null;
  const ls = window.localStorage;
  const ss = window.sessionStorage;

  const lsHas = ls.getItem("auth_access") || ls.getItem("auth_refresh");
  const ssHas = ss.getItem("auth_access") || ss.getItem("auth_refresh");

  // Prefer where both exist; fallback to where at least one exists; default to localStorage
  if (lsHas && !ssHas) return ls;
  if (!lsHas && ssHas) return ss;

  // If both or neither, prefer localStorage by default
  return lsHas ? ls : ssHas ? ss : ls;
}

export function getTokens() {
  try {
    const store = getAuthStorage();
    const access = store?.getItem("auth_access") || null;
    const refresh = store?.getItem("auth_refresh") || null;
    return { access, refresh, store };
  } catch {
    return { access: null, refresh: null, store: null };
  }
}

export function setTokens({ access, refresh }, preferStore) {
  try {
    const store = preferStore || getAuthStorage();
    if (!store) return;

    if (typeof access === "string") {
      store.setItem("auth_access", access);
    }
    if (typeof refresh === "string") {
      store.setItem("auth_refresh", refresh);
    }
  } catch {
    // no-op
  }
}

export function clearAuth() {
  try {
    window.localStorage.removeItem("auth_access");
    window.localStorage.removeItem("auth_refresh");
    window.localStorage.removeItem("user_data");
    window.sessionStorage.removeItem("auth_access");
    window.sessionStorage.removeItem("auth_refresh");
    window.sessionStorage.removeItem("user_data");
  } catch {
    // no-op
  }
}

// Decode JWT payload safely
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch {
    return null;
  }
}

// Check if JWT is expired (with small clock skew)
export function isJwtExpired(token, skewSeconds = 15) {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") {
    // If cannot decode or missing exp, assume not expired to avoid logouts for non-JWT tokens
    return false;
  }
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec + skewSeconds;
}

export async function ensureValidAccessToken() {
  const { access } = getTokens();
  if (access && !isJwtExpired(access)) {
    return { ok: true, access };
  }
  return await refreshAccessToken();
}

// Attempt to refresh access token using refresh token
export async function refreshAccessToken() {
  const { refresh, store } = getTokens();
  if (!refresh) {
    return { ok: false, error: "No refresh token" };
  }

  const url = joinUrl(API_BASE_URL, REFRESH_PATH);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      let errMsg = "Failed to refresh token";
      try {
        const data = await res.json();
        errMsg = data?.detail || data?.message || data?.error || errMsg;
      } catch {}
      return { ok: false, error: errMsg };
    }

    const data = await res.json();
    const newAccess = data.access || data.token || data.access_token;
    const newRefresh = data.refresh; // some APIs may rotate refresh tokens

    if (!newAccess) {
      return { ok: false, error: "No access token in refresh response" };
    }

    setTokens({ access: newAccess, refresh: newRefresh || refresh }, store);
    return { ok: true, access: newAccess, refresh: newRefresh || refresh };
  } catch (e) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

// Helper to get an Authorization header
export function getAuthHeader() {
  const { access } = getTokens();
  return access ? { Authorization: `Bearer ${access}` } : {};
}

// Read current org id from persisted user_data (same storage used for tokens)
function getCurrentOrgIdFromStorage() {
  try {
    const store = getAuthStorage();
    const raw =
      store?.getItem("user_data") ||
      window.localStorage.getItem("user_data") ||
      window.sessionStorage.getItem("user_data");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.selectedOrgId || user?.selected_org_id || null;
  } catch {
    return null;
  }
}

export async function authorizedFetch(input, init = {}) {
  // Build headers including Authorization and optional org scoping
  const buildHeaders = (token, orgId) => {
    const base = (init && init.headers) ? init.headers : {};
    let headers = token ? { ...base, Authorization: `Bearer ${token}` } : { ...base };
    if (orgId) {
      headers = { ...headers, "X-Org-Id": orgId };
    }
    return headers;
  };

  // Ensure we have a valid access token before making the request
  await ensureValidAccessToken();
  let { access } = getTokens();
  const orgId = getCurrentOrgIdFromStorage();

  let res = await fetch(input, {
    ...(init || {}),
    headers: buildHeaders(access, orgId),
  });

  // If unauthorized, try to refresh once and retry the original request
  if (res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (refreshed.ok) {
      ({ access } = getTokens());
      res = await fetch(input, {
        ...(init || {}),
        headers: buildHeaders(access, orgId),
      });
    }
  }

  return res;
}

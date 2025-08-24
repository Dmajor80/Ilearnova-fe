import { API_BASE_URL } from "./config";
import { authorizedFetch } from "./auth";

/**
 * Build absolute URL from a relative API path, avoiding double slashes.
 * Examples:
 *  apiUrl("/api/auth/login/")  -> <base>/api/auth/login/
 *  apiUrl("api/auth/login/")   -> <base>/api/auth/login/
 */
export function apiUrl(path) {
  const base = String(API_BASE_URL || "").replace(/\/+$/, "");
  const p = String(path || "");
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${base}${rel}`;
}

/**
 * Core request helper with sensible defaults and optional auth.
 * - Adds Accept: application/json by default
 * - Adds Content-Type: application/json when body is provided (unless overridden)
 * - Uses authorizedFetch when auth=true to attach tokens and handle refresh
 * - Parses JSON when available, falls back to text
 * - Throws Error on non-2xx with { status, data } attached
 */
async function request(method, path, { body, headers, signal, auth = true } = {}) {
  const url = apiUrl(path);
  const baseHeaders = {
    Accept: "application/json",
    ...(body != null ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
  };

  const init = {
    method,
    headers: baseHeaders,
    ...(body != null
      ? { body: typeof body === "string" ? body : JSON.stringify(body) }
      : {}),
    ...(signal ? { signal } : {}),
  };

  const res = auth ? await authorizedFetch(url, init) : await fetch(url, init);

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || data.error)) ||
      res.statusText ||
      "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const http = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, opts) => request("POST", path, opts),
  put: (path, opts) => request("PUT", path, opts),
  patch: (path, opts) => request("PATCH", path, opts),
  del: (path, opts) => request("DELETE", path, opts),
};

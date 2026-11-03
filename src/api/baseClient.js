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
async function request(method, path, {
  body,
  params,
  headers,
  signal,
  auth = true,
  responseType
} = {}) {
  const requestUrl = new URL(apiUrl(path), window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      if (item !== undefined && item !== null && item !== "") {
        requestUrl.searchParams.append(key, String(item));
      }
    });
  });

  const url = requestUrl.toString();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const baseHeaders = {
    Accept: "application/json",
    ...(body != null && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
  };

  if (isFormData) {
    delete baseHeaders["Content-Type"];
  }

  const init = {
    method,
    headers: baseHeaders,
    ...(body != null
      ? { body: isFormData || typeof body === "string" ? body : JSON.stringify(body) }
      : {}),
    ...(signal ? { signal } : {}),
  };

  const res = auth ? await authorizedFetch(url, init) : await fetch(url, init);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (responseType !== "blob") {
    try {
      const preview = isJson ? await res.clone().json() : await res.clone().text();
      if (isJson) {
        console.log("url:", url);
        console.log("response:", preview);
      } else {
        console.log("response:", preview);
      }
    } catch (error) {
      console.warn("Unable to preview API response:", error);
    }
  }

  let data = null;
  try {
    data = responseType === "blob" && res.ok
      ? await res.blob()
      : isJson
        ? await res.json()
        : await res.text();
  } catch {
    data = null;
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

const REQUEST_OPTION_KEYS = ["auth", "body", "headers", "params", "responseType", "signal"];

function getBodyOptions(bodyOrOptions, options) {
  if (options !== undefined) {
    return { ...options, body: bodyOrOptions };
  }

  if (
    bodyOrOptions &&
    typeof bodyOrOptions === "object" &&
    REQUEST_OPTION_KEYS.some((key) => Object.prototype.hasOwnProperty.call(bodyOrOptions, key))
  ) {
    return bodyOrOptions;
  }

  return bodyOrOptions === undefined ? {} : { body: bodyOrOptions };
}

export const http = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, bodyOrOptions, opts) => request("POST", path, getBodyOptions(bodyOrOptions, opts)),
  put: (path, bodyOrOptions, opts) => request("PUT", path, getBodyOptions(bodyOrOptions, opts)),
  patch: (path, bodyOrOptions, opts) => request("PATCH", path, getBodyOptions(bodyOrOptions, opts)),
  del: (path, opts) => request("DELETE", path, opts),
};

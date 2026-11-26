/**
 * "Manage a school" mode for the platform superadmin.
 *
 * While a school is being managed, every authenticated API request carries
 * `X-Org-Id: <school id>` (see api/baseClient.js) and the backend treats the
 * superadmin as that school's org admin. The choice lives in sessionStorage,
 * so it ends with the browser tab.
 */
import { useSyncExternalStore } from "react";

export const MANAGED_SCHOOL_KEY = "ilearnova_managed_school";
export const MANAGED_SCHOOL_EVENT = "ilearnova:managed-school";

let cachedRaw;
let cachedValue = null;

export function getManagedSchool() {
  try {
    const raw = window.sessionStorage.getItem(MANAGED_SCHOOL_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    const parsed = raw ? JSON.parse(raw) : null;
    cachedValue = parsed && parsed.id ? { id: String(parsed.id), name: parsed.name || "this school" } : null;
    return cachedValue;
  } catch {
    return null;
  }
}

function announce() {
  window.dispatchEvent(new CustomEvent(MANAGED_SCHOOL_EVENT));
}

export function startManagingSchool({ id, name }) {
  if (!id) return;
  window.sessionStorage.setItem(MANAGED_SCHOOL_KEY, JSON.stringify({ id: String(id), name: name || "" }));
  announce();
}

export function stopManagingSchool() {
  try {
    window.sessionStorage.removeItem(MANAGED_SCHOOL_KEY);
  } catch {
    // no-op
  }
  announce();
}

function subscribe(callback) {
  window.addEventListener(MANAGED_SCHOOL_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(MANAGED_SCHOOL_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** The school being managed ({ id, name }) or null; re-renders on change. */
export function useManagedSchool() {
  return useSyncExternalStore(subscribe, getManagedSchool, () => null);
}

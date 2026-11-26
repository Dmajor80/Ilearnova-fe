import { useCallback, useEffect, useState } from "react";
import { billingApi, SUBSCRIPTION_BLOCKED_EVENT } from "@/api/billingApi";
import { getTokens } from "@/api/auth";
import { pickStatus } from "./subscriptionUtils";
import { getManagedSchool } from "@/lib/manageSchool";

function selectedOrgId() {
  const managed = getManagedSchool();
  if (managed) return managed.id;
  try {
    const raw = window.localStorage.getItem("user_data") || window.sessionStorage.getItem("user_data");
    const user = raw ? JSON.parse(raw) : null;
    return user?.selectedOrgId || user?.selected_org_id || null;
  } catch {
    return null;
  }
}

/**
 * The signed-in user's subscription status for their school (see
 * subscriptionUtils for the timeline). Reloads when the API refuses a
 * request with 402, so the app reacts as soon as a school gets locked.
 * `refreshKey` (e.g. the route) reloads it too.
 */
export default function useSubscriptionStatus(refreshKey) {
  const [status, setStatus] = useState(null);
  // False until the first answer, so callers can wait before loading data
  // a locked school would refuse.
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!getTokens()?.access) {
      setStatus(null);
      setLoaded(true);
      return;
    }
    try {
      const rows = await billingApi.status();
      setStatus(pickStatus(Array.isArray(rows) ? rows : [], selectedOrgId()));
    } catch {
      // Status is advisory; the API still enforces access on its own.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    window.addEventListener(SUBSCRIPTION_BLOCKED_EVENT, load);
    return () => window.removeEventListener(SUBSCRIPTION_BLOCKED_EVENT, load);
  }, [load]);

  return { status, loaded, reload: load };
}

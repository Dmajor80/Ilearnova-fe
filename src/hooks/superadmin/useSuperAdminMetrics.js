import { useCallback, useEffect, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import { unwrapSuperAdminResponse } from "./superAdminApiUtils";

export default function useSuperAdminMetrics() {
  const { notify, ...notification } = useNotification("info", 5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await http.get("/api/superadmin/dashboard/metrics/", { auth: true });
      setMetrics(unwrapSuperAdminResponse(payload));
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_metrics" });
      setError(appError);
      notify(
        `Super-admin metrics unavailable: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to fetch super-admin metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { loading, error, lastUpdated, metrics, refreshData, notification: { ...notification, notify } };
}

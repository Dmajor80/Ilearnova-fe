import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";

export default function useOrganizationAnalytics() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [performance, setPerformance] = useState(null);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) circuitBreaker.resetAllEndpoints();

    setLoading(true);
    setError(null);

    if (!resetFailures && !circuitBreaker.shouldCallEndpoint("performance")) {
      setLoading(false);
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/dashboard/performance/", {
        auth: true
      });
      setPerformance(payload?.data ?? payload);
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "fetch_organization_analytics" });
      const message = getUserFriendlyMessage(appError);
      circuitBreaker.markEndpointFailed("performance", message);
      setError(appError);
      notification.notify(`Organization analytics unavailable: ${message}`, getNotificationType(appError));
      console.warn("Failed to fetch organization analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [circuitBreaker, notification]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  return {
    loading,
    error,
    lastUpdated,
    performance,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    resetEndpoint: circuitBreaker.resetEndpoint,
    notification
  };
}

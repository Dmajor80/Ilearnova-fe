import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";

export default function useOrganizationOverview() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);

  const refreshData = useCallback(async (resetFailures = false) => {
    console.log(circuitBreaker)
    if (resetFailures) circuitBreaker.resetAllEndpoints();

    setLoading(true);
    setError(null);

    const requests = [
      ["metrics", "/api/admin/school/dashboard/metrics/", setMetrics],
      ["activities", "/api/admin/school/dashboard/activities/", setActivities]
    ].filter(([endpoint]) => resetFailures || circuitBreaker.shouldCallEndpoint(endpoint));

    try {
      if (requests.length === 0) return;
      console.log(requests)
      const results = await Promise.allSettled(
        requests.map(([, path]) => http.get(path, { auth: true }))
      );
      const failures = [];
      let succeeded = false;
      results.forEach((result, index) => {
        console.log(index)
        console.log(result)
        const [endpoint, , setValue] = requests[index];
        if (result.status === "fulfilled") {
          const data = result.value?.data ?? result.value;
          if (endpoint === "activities") {
            const activityList = Array.isArray(data)
              ? data
              : data?.activities ?? data?.recent_activities ?? data?.results ?? [];
            setValue(activityList);
          } else {
            setValue(data?.metrics ?? data?.overview ?? data);
          }
          succeeded = true;
          return;
        }

        const appError = parseError(result.reason, { action: `fetch_organization_${endpoint}` });
        const message = getUserFriendlyMessage(appError);
        circuitBreaker.markEndpointFailed(endpoint, message);
        failures.push(message);
        console.warn(`Failed to fetch organization ${endpoint}:`, result.reason);
      });

      if (failures.length) {
        const appError = parseError(new Error(failures.join("; ")), {
          action: "refresh_organization_overview"
        });
        setError(appError);
        notification.notify(
          `Some organization overview data is unavailable: ${failures.join("; ")}`,
          getNotificationType(appError)
        );
      }

      if (succeeded) setLastUpdated(new Date());
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
    metrics,
    activities,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    resetEndpoint: circuitBreaker.resetEndpoint,
    notification
  };
}

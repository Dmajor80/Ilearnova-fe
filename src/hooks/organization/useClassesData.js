import { useState, useEffect, useCallback, useRef } from "react";
import { http } from "@/api/baseClient";
import { useOrganization } from "@/context/OrganizationContext";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Loads classes from the organization-admin endpoint, scoped to the caller's organization.
 */
export default function useClassesData({ page = 1, search = "" } = {}) {
  const { loading: organizationLoading } = useOrganization();
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const circuitBreakerRef = useRef(circuitBreaker);
  circuitBreakerRef.current = circuitBreaker;
  const {
    resetAllEndpoints
  } = circuitBreaker;
  const { notify } = notification;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [mutating, setMutating] = useState(false);

  const fetchClasses = useCallback(async () => {
    if (organizationLoading) return;

    const endpointName = "classes";
    const { shouldCallEndpoint, endpointErrors, markEndpointFailed } = circuitBreakerRef.current;

    if (!shouldCallEndpoint(endpointName)) {
      throw new Error(endpointErrors[endpointName]?.message || "Classes endpoint is unavailable.");
    }

    try {
      const params = {
        page,
        page_size: 20,
        search: search.trim() || undefined,
      };
      const payload = await http.get("/api/admin/school/classes/", {
        auth: true,
        params
      });
      const data = payload?.data ?? payload;
      const results = Array.isArray(data?.classes)
        ? data.classes
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];
      const pagination = data?.pagination;
      setClasses(results);
      setCount(typeof pagination?.total === "number"
        ? pagination.total
        : typeof data?.count === "number"
          ? data.count
          : results.length);
      setNext(pagination ? Boolean(pagination.has_next) : data?.next ?? null);
      setPrevious(pagination ? Boolean(pagination.has_prev) : data?.previous ?? null);

      setError(null);
      return results;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_classes" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      setError(appError);
      markEndpointFailed(endpointName, userMessage);
      notify(`Classes unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch classes:", err);
      throw appError;
    }
  }, [
    notify,
    page,
    search,
    organizationLoading
  ]);

  const createClass = useCallback(async (classData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/classes/", classData, { auth: true });
      const data = payload?.data ?? payload;

      notify("Class created successfully", "success");
      await fetchClasses();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_class" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notify(`Failed to create class: ${userMessage}`, notificationType);
      console.warn("Failed to create class:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notify, fetchClasses]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (organizationLoading) return;

    if (resetFailures) {
      resetAllEndpoints();
    }
    setLoading(true);
    setError(null);
    try {
      await fetchClasses();
    } catch (err) {
      const appError = parseError(err, { action: "refresh_classes" });
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [fetchClasses, resetAllEndpoints, organizationLoading]);

  useEffect(() => {
    if (!organizationLoading) refreshData();
  }, [organizationLoading, refreshData]);

  return {
    loading,
    error,
    classes,
    count,
    next,
    previous,
    mutating,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createClass,

    notification
  };
}

import { useState, useEffect, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages school class fetching and creation.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * NOTE: /api/admin/classes/ and /api/admin/classes/create/ are documented in the
 * API spec as bare "Legacy admin classes list/create view" endpoints with NO
 * request or response schema at all (not even a fallback one) - so both the
 * shape of a class record and the create payload below (name, grade_level,
 * section, academic_year, capacity) are a best-effort guess and should be
 * confirmed against the actual backend view before relying on this in
 * production. Confirmed via schoolAdminApi.js: this is NOT a duplicate of the
 * class-dropdown helper used elsewhere - getSchoolGrades() calls /api/classes/
 * (no "admin" prefix), a distinct, unrelated endpoint. This hook is the only
 * thing hitting /api/admin/classes/.
 */
export default function useClassesData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [mutating, setMutating] = useState(false);

  const fetchClasses = useCallback(async () => {
    const endpointName = "classes";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping classes call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/classes/", { auth: true });
      const data = payload?.data ?? payload;
      console.log("Classes API response:", data);

      if (Array.isArray(data.results)) {
        setClasses(data.results);
      } else if (Array.isArray(data.classes)) {
        setClasses(data.classes);
      } else if (Array.isArray(data)) {
        setClasses(data);
      } else {
        setClasses([]);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_classes" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Classes unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch classes:", err);
      setClasses([]);
    }
  }, [circuitBreaker, notification]);

  const createClass = useCallback(async (classData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/classes/create/", classData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Class created successfully", "success");
      await fetchClasses();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_class" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to create class: ${userMessage}`, notificationType);
      console.warn("Failed to create class:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchClasses]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
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
  }, [fetchClasses, circuitBreaker]);

  useEffect(() => {
    refreshData();
  }, []);

  return {
    loading,
    error,
    classes,
    mutating,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createClass,

    notification
  };
}

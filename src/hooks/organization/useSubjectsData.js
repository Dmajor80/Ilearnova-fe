import { useState, useEffect, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages fetching the school's subject list.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * NOTE: /api/admin/subjects/ is documented as a bare "Legacy admin subject list
 * view" with NO response schema at all, and the spec defines no corresponding
 * create/update/delete endpoint for subjects - it appears to be read-only from
 * the admin API today. Rendered fields (name, code, description) are a
 * best-effort guess and should be confirmed against the actual backend view.
 */
export default function useSubjectsData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = useCallback(async () => {
    const endpointName = "subjects";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping subjects call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/subjects/", { auth: true });
      const data = payload?.data ?? payload;
      console.log("Subjects API response:", data);

      if (Array.isArray(data.results)) {
        setSubjects(data.results);
      } else if (Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      } else if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        setSubjects([]);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_subjects" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Subjects unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch subjects:", err);
      setSubjects([]);
    }
  }, [circuitBreaker, notification]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }
    setLoading(true);
    setError(null);
    try {
      await fetchSubjects();
    } catch (err) {
      const appError = parseError(err, { action: "refresh_subjects" });
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects, circuitBreaker]);

  useEffect(() => {
    refreshData();
  }, []);

  return {
    loading,
    error,
    subjects,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,

    notification
  };
}

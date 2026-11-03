import { useState, useEffect, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages fetching the platform-wide admin user list (all roles,
 * not just parents/teachers/students individually).
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * NOTE: /api/admin/users/ is documented as a bare "Legacy admin user list view"
 * with NO response schema at all, and the spec defines no corresponding
 * create/update/delete endpoint - it appears to be read-only from the admin
 * API today. Rendered fields (username, email, first_name, last_name, role,
 * is_active) are a best-effort guess based on the AdminUser shape used
 * elsewhere in the spec and should be confirmed against the actual backend view.
 */
export default function useAdminUsersData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    const endpointName = "adminUsers";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping admin users call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/users/", { auth: true });
      const data = payload?.data ?? payload;
      console.log("Admin users API response:", data);

      if (Array.isArray(data.results)) {
        setUsers(data.results);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_admin_users" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Users unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch admin users:", err);
      setUsers([]);
    }
  }, [circuitBreaker, notification]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }
    setLoading(true);
    setError(null);
    try {
      await fetchUsers();
    } catch (err) {
      const appError = parseError(err, { action: "refresh_admin_users" });
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, circuitBreaker]);

  useEffect(() => {
    refreshData();
  }, []);

  return {
    loading,
    error,
    users,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,

    notification
  };
}

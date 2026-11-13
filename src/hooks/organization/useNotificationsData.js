import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages school notification fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * The API documents Notification and BroadcastRequest schemas. The bulk-operation
 * request schema should be confirmed against the backend contract.
 */
export default function useNotificationsData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [mutating, setMutating] = useState(false);

  const fetchNotifications = useCallback(async (params = {}) => {
    const endpointName = "notifications";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping notifications call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: notificationsPerPage,
        search: searchQuery,
        ...params
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const payload = await http.get("/api/admin/school/notifications/", {
        auth: true,
        params: queryParams
      });

      const data = payload?.data ?? payload;
      console.log("Notifications API response:", data);

      if (data.results) {
        setNotifications(data.results || []);
        setTotalNotifications(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications || []);
        setTotalNotifications(data.pagination?.total ?? data.notifications.length);
      } else if (Array.isArray(data)) {
        setNotifications(data || []);
        setTotalNotifications(data?.length || 0);
      } else {
        setNotifications([]);
        setTotalNotifications(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_notifications" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      setError(appError);
      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Notifications unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch notifications:", err);
      setNotifications([]);
      setTotalNotifications(0);
    }
  }, [currentPage, notificationsPerPage, searchQuery, circuitBreaker, notification]);

  /**
   * Create a single notification directly (as opposed to broadcastNotification,
   * which fans a message out to a whole audience via the broadcast/ action).
   */
  const createNotification = useCallback(async (notificationData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/notifications/", notificationData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Notification created successfully", "success");
      await fetchNotifications();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_notification" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to create notification: ${userMessage}`, notificationType);
      console.warn("Failed to create notification:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchNotifications]);

  const updateNotification = useCallback(async (notificationId, data) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/notifications/${notificationId}/`, data, { auth: true });
      const responseData = payload?.data ?? payload;

      await fetchNotifications();
      return responseData;
    } catch (err) {
      const appError = parseError(err, { action: "update_notification" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update notification: ${userMessage}`, notificationType);
      console.warn("Failed to update notification:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchNotifications]);

  const deleteNotification = useCallback(async (notificationId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/notifications/${notificationId}/`, { auth: true });

      notification.notify("Notification removed", "success");
      await fetchNotifications();
    } catch (err) {
      const appError = parseError(err, { action: "delete_notification" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove notification: ${userMessage}`, notificationType);
      console.warn("Failed to delete notification:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchNotifications]);

  /**
   * Broadcast a notification to a role/audience
   * Accepts title/message and optional user_ids, role_codes, notification_type, and priority.
   */
  const broadcastNotification = useCallback(async (broadcastData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/notifications/broadcast/", broadcastData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Broadcast sent successfully", "success");
      await fetchNotifications();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "broadcast_notification" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to send broadcast: ${userMessage}`, notificationType);
      console.warn("Failed to broadcast notification:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchNotifications]);

  /**
   * Perform a bulk operation on a set of notifications
   * (e.g. { action: "mark_read" | "delete", ids: [...] }).
   */
  const bulkOperation = useCallback(async (action, ids) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/notifications/bulk_operations/", {
        action,
        ids
      }, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Bulk action completed", "success");
      setSelectedIds([]);
      await fetchNotifications();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "bulk_notification_operation" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Bulk action failed: ${userMessage}`, notificationType);
      console.warn("Failed to perform bulk notification operation:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchNotifications]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchNotifications();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_notifications" });
      setError(appError);
      console.warn("Failed to refresh notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, circuitBreaker]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const toggleSelectId = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const clearSelectedIds = useCallback(() => {
    setSelectedIds([]);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchNotifications();
    }
  }, [currentPage, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalNotifications / notificationsPerPage);
  }, [totalNotifications, notificationsPerPage]);

  return {
    loading,
    error,
    lastUpdated,
    notifications,
    totalNotifications,
    selectedIds,
    mutating,

    currentPage,
    totalPages,
    notificationsPerPage,
    searchQuery,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createNotification,
    updateNotification,
    deleteNotification,
    broadcastNotification,
    bulkOperation,
    handleSearch,
    handlePageChange,
    toggleSelectId,
    clearSelectedIds,

    notification
  };
}

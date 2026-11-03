import { useCallback, useEffect, useRef, useState } from "react";
import { getStudentAnnouncements } from "@/api/student";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import { getStudentList } from "./studentApiUtils";

export default function useStudentAnnouncements() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { resetAllEndpoints, shouldCallEndpoint, markEndpointFailed } = circuitBreaker;

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    if (!resetFailures && !shouldCallEndpoint("studentAnnouncements")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getStudentAnnouncements();
      setAnnouncements(getStudentList(response, ["announcements"]));
      setLastUpdated(new Date());
    } catch (requestError) {
      const appError = parseError(requestError, { action: "fetch_student_announcements" });
      const message = getUserFriendlyMessage(appError);
      markEndpointFailed("studentAnnouncements", message);
      setError(appError);
      setAnnouncements([]);
      notification.notify(`Announcements unavailable: ${message}`, getNotificationType(appError));
      console.warn("Failed to fetch student announcements:", requestError);
    } finally {
      setLoading(false);
    }
  }, [markEndpointFailed, notification, resetAllEndpoints, shouldCallEndpoint]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  return {
    announcements,
    loading,
    error,
    lastUpdated,
    refreshData,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    notification
  };
}

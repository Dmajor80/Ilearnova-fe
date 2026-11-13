import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import { formatCurrency } from "@/lib/formatters";

/**
 * Hook that manages school dashboard data fetching, caching, and state management.
 * Follows the same patterns as useDashboardData for consistency.
 */
export default function useSchoolDashboardData() {
  const notification = useNotification("info", 5000);

  // Use unified circuit breaker
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000, // 1 minute
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // School metrics state
  const [metrics, setMetrics] = useState({
    students: { value: "—", label: "Students", description: "Total enrolled students", iconType: "users" },
    teachers: { value: "—", label: "Teachers", description: "Active teaching staff", iconType: "userCheck" },
    events: { value: "—", label: "Events", description: "Upcoming school events", iconType: "calendar" },
    financial: { value: "—", label: "Financial", description: "Total financial transactions", iconType: "dollarsign" }
  });

  // School-specific data state
  const [schoolData, setSchoolData] = useState({
    performanceChart: null,
    overviewChart: null,
    calendar: null,
    teachers: [],
    unpaidTuition: []
  });

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([]);



  /**
   * Fetch school metrics from API
   */
  const fetchMetrics = useCallback(async () => {
    const endpointName = "metrics";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping metrics call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/dashboard/metrics/", {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Metrics API response:", data);


      setMetrics(prevMetrics => ({
        ...prevMetrics,
        students: { ...prevMetrics.students, value: String(data?.students?.total ?? prevMetrics.students.value) },
        teachers: { ...prevMetrics.teachers, value: String(data?.teachers?.total ?? prevMetrics.teachers.value) },
        events: { ...prevMetrics.events, value: String(data?.events?.upcoming ?? prevMetrics.events.value) },
        financial: {
          ...prevMetrics.financial,
          value: data?.financial?.total_fees_collected == null
            ? prevMetrics.financial.value
            : formatCurrency(data.financial.total_fees_collected)
        },
      }));
      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_school_metrics" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      // Mark endpoint as failed to prevent repeated calls
      circuitBreaker.markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Metrics unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch school dashboard metrics:", err);
    }
  }, [notification, circuitBreaker]);

  /**
   * Fetch school performance data
   */
  const fetchPerformanceData = useCallback(async () => {
    const endpointName = "performance";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping performance call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/dashboard/performance/", {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Performance API response:", data);

      setSchoolData(prev => ({
        ...prev,
        performanceChart: data.charts
      }));
    } catch (err) {
      circuitBreaker.markEndpointFailed(endpointName, "Performance data unavailable");
      console.warn("Failed to fetch performance data:", err);
    }
  }, [circuitBreaker]);

  /**
   * Fetch teachers data
   */
  const fetchTeachersData = useCallback(async () => {
    const endpointName = "teachers";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping teachers call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/teachers/", {
        auth: true,
        params: { page_size: 10 }
      });
      const data = payload?.data ?? payload;
      console.log("Teachers API response:", data);

      setSchoolData(prev => ({
        ...prev,
        teachers: data.teachers || []
      }));
    } catch (err) {
      circuitBreaker.markEndpointFailed(endpointName, "Teachers data unavailable");
      console.warn("Failed to fetch teachers data:", err);
      setSchoolData(prev => ({
        ...prev,
        teachers: []
      }));
    }
  }, [circuitBreaker]);

  /**
   * Fetch unpaid tuition data
   */
  const fetchUnpaidTuitionData = useCallback(async () => {
    const endpointName = "unpaidTuition";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping unpaid tuition call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/students/unpaid_tuition/", {
        auth: true
      });
      console.log("unpaid tuition data:", payload);

      const data = payload?.data ?? payload;
      const students = Array.isArray(data?.students)
        ? data.students
        : Array.isArray(data)
          ? data
          : data?.id
            ? [data]
            : [];

      setSchoolData(prev => ({
        ...prev,
        unpaidTuition: students
      }));
    } catch (err) {
      circuitBreaker.markEndpointFailed(endpointName, "Unpaid tuition data unavailable");
      console.warn("Failed to fetch unpaid tuition data:", err);
      setSchoolData(prev => ({
        ...prev,
        unpaidTuition: []
      }));
    }
  }, [circuitBreaker]);

  /**
   * Fetch recent school activities
   */
  const fetchRecentActivities = useCallback(async () => {
    const endpointName = "activities";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping activities call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/dashboard/activities/", {
        auth: true,
        params: { limit: 10 }
      });
      const data = payload?.data ?? payload;
      console.log("Activities API response:", data);

      setRecentActivities(data.activities || []);
    } catch (err) {
      circuitBreaker.markEndpointFailed(endpointName, "Activities data unavailable");
      console.warn("Failed to fetch recent activities:", err);
    }
  }, [circuitBreaker]);

  /**
   * Refresh all school dashboard data (with option to reset failed endpoints)
   */
  const refreshData = useCallback(async (resetFailures = false) => {
    setLoading(true);
    setError(null);

    // Reset failed endpoints if requested (for manual retry)
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    try {
      // Only call endpoints that haven't failed (unless we're resetting)
      const promises = [];

      if (resetFailures || circuitBreaker.shouldCallEndpoint("metrics")) {
        promises.push(fetchMetrics());
      }
      if (resetFailures || circuitBreaker.shouldCallEndpoint("performance")) {
        promises.push(fetchPerformanceData());
      }
      if (resetFailures || circuitBreaker.shouldCallEndpoint("teachers")) {
        promises.push(fetchTeachersData());
      }
      if (resetFailures || circuitBreaker.shouldCallEndpoint("unpaidTuition")) {
        promises.push(fetchUnpaidTuitionData());
      }
      if (resetFailures || circuitBreaker.shouldCallEndpoint("activities")) {
        promises.push(fetchRecentActivities());
      }

      await Promise.allSettled(promises);

      setLastUpdated(new Date());

      // Only show success notification if we actually made some calls
      if (promises.length > 0) {
        notification.notify("School dashboard data refreshed successfully", "success");
      }
    } catch (err) {
      console.error("Error refreshing school dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    fetchMetrics,
    fetchPerformanceData,
    fetchTeachersData,
    fetchUnpaidTuitionData,
    fetchRecentActivities,
    notification,
    circuitBreaker
  ]);

  /**
   * Initial data load
   */
  useEffect(() => {
    refreshData();
  }, []); // Remove refreshData dependency to prevent re-renders

  /**
   * Auto-refresh data every 10 minutes (only for endpoints that haven't failed)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        // Only refresh endpoints that haven't failed
        if (circuitBreaker.shouldCallEndpoint("metrics")) {
          fetchMetrics();
        }
        if (circuitBreaker.shouldCallEndpoint("activities")) {
          fetchRecentActivities();
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [loading, fetchMetrics, fetchRecentActivities, circuitBreaker]);

  /**
   * Get metrics as array for easier rendering (memoized for performance)
   */
  const metricsArray = useMemo(() => {
    return Object.entries(metrics).map(([key, metric]) => ({
      id: key,
      value: metric.value,
      label: metric.label,
      description: metric.description,
      iconType: metric.iconType
    }));
  }, [metrics]);

  return {
    // State
    loading,
    error,
    lastUpdated,
    metrics,
    schoolData,
    recentActivities,

    // Error handling (from circuit breaker)
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,

    // Computed values
    metricsArray,

    // Actions
    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    resetEndpoint: circuitBreaker.resetEndpoint,
    getEndpointStatus: circuitBreaker.getEndpointStatus,

    // Notifications
    notification
  };
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import { formatCurrency } from "@/lib/formatters";

/**
 * Hook that manages school dashboard data fetching, caching, and state management.
 * Follows the same patterns as useDashboardData for consistency.
 */
export default function useSchoolDashboardData() {
  const notification = useNotification("info", 5000);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Track failed endpoints to prevent repeated calls
  const [failedEndpoints, setFailedEndpoints] = useState(new Set());
  const [endpointErrors, setEndpointErrors] = useState({});

  // School metrics state
  const [metrics, setMetrics] = useState({
    students: { value: "0", label: "Students", description: "Total enrolled students", iconType: "users" },
    teachers: { value: "0", label: "Teachers", description: "Active teaching staff", iconType: "userCheck" },
    events: { value: "0", label: "Events", description: "Upcoming school events", iconType: "calendar" },
    financial: { value: "0", label: "Financial", description: "Total financial transactions", iconType: "dollarsign" }
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
   * Check if an endpoint should be called (circuit breaker pattern)
   */
  const shouldCallEndpoint = useCallback((endpointName) => {
    return !failedEndpoints.has(endpointName);
  }, [failedEndpoints]);

  /**
   * Mark an endpoint as failed to prevent future calls
   */
  const markEndpointFailed = useCallback((endpointName, error) => {
    setFailedEndpoints(prev => new Set([...prev, endpointName]));
    setEndpointErrors(prev => ({
      ...prev,
      [endpointName]: error
    }));
  }, []);

  /**
   * Reset failed endpoints (for manual retry)
   */
  const resetFailedEndpoints = useCallback(() => {
    setFailedEndpoints(new Set());
    setEndpointErrors({});
  }, []);

  /**
   * Fetch school metrics from API
   */
  const fetchMetrics = useCallback(async () => {
    const endpointName = "metrics";

    // Check circuit breaker
    if (!shouldCallEndpoint(endpointName)) {
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
        financial: { ...prevMetrics.financial, value: formatCurrency(data?.financial?.total_fees_collected ?? 0) },
      }));
      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_school_metrics" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      // Mark endpoint as failed to prevent repeated calls
      markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Metrics unavailable: ${userMessage}`, notificationType);

      // Use fallback data on error
      console.warn("Using fallback school dashboard data due to error:", err);
    }
  }, [notification, shouldCallEndpoint, markEndpointFailed]);

  /**
   * Fetch school performance data
   */
  const fetchPerformanceData = useCallback(async () => {
    const endpointName = "performance";

    // Check circuit breaker
    if (!shouldCallEndpoint(endpointName)) {
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
        performanceChart: data.performance_chart
      }));
    } catch (err) {
      markEndpointFailed(endpointName, "Performance data unavailable");
      console.warn("Failed to fetch performance data:", err);
    }
  }, [shouldCallEndpoint, markEndpointFailed]);

  /**
   * Fetch teachers data
   */
  const fetchTeachersData = useCallback(async () => {
    const endpointName = "teachers";

    // Check circuit breaker
    if (!shouldCallEndpoint(endpointName)) {
      console.log("Skipping teachers call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/teachers/", {
        auth: true,
        params: { limit: 10, include_performance: true }
      });
      const data = payload?.data ?? payload;
      console.log("Teachers API response:", data);

      setSchoolData(prev => ({
        ...prev,
        teachers: data.teachers || []
      }));
    } catch (err) {
      markEndpointFailed(endpointName, "Teachers data unavailable");
      console.warn("Failed to fetch teachers data:", err);
      // Use fallback data
      setSchoolData(prev => ({
        ...prev,
        teachers: getFallbackTeachersData()
      }));
    }
  }, [shouldCallEndpoint, markEndpointFailed]);

  /**
   * Fetch unpaid tuition data
   */
  const fetchUnpaidTuitionData = useCallback(async () => {
    const endpointName = "unpaidTuition";

    // Check circuit breaker
    if (!shouldCallEndpoint(endpointName)) {
      console.log("Skipping unpaid tuition call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/students/unpaid_tuition/", {
        auth: true,
        params: { limit: 10 }
      });
      console.log("unpaid tuition data:", payload);

      const data = payload?.data ?? payload;

      setSchoolData(prev => ({
        ...prev,
        unpaidTuition: data.students || []
      }));
    } catch (err) {
      markEndpointFailed(endpointName, "Unpaid tuition data unavailable");
      console.warn("Failed to fetch unpaid tuition data:", err);
      // Use fallback data
      setSchoolData(prev => ({
        ...prev,
        unpaidTuition: getFallbackUnpaidTuitionData()
      }));
    }
  }, [shouldCallEndpoint, markEndpointFailed]);

  /**
   * Fetch recent school activities
   */
  const fetchRecentActivities = useCallback(async () => {
    const endpointName = "activities";

    // Check circuit breaker
    if (!shouldCallEndpoint(endpointName)) {
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
      markEndpointFailed(endpointName, "Activities data unavailable");
      console.warn("Failed to fetch recent activities:", err);
    }
  }, [shouldCallEndpoint, markEndpointFailed]);

  /**
   * Refresh all school dashboard data (with option to reset failed endpoints)
   */
  const refreshData = useCallback(async (resetFailures = false) => {
    setLoading(true);
    setError(null);

    // Reset failed endpoints if requested (for manual retry)
    if (resetFailures) {
      resetFailedEndpoints();
    }

    try {
      // Only call endpoints that haven't failed (unless we're resetting)
      const promises = [];

      if (resetFailures || shouldCallEndpoint("metrics")) {
        promises.push(fetchMetrics());
      }
      if (resetFailures || shouldCallEndpoint("performance")) {
        promises.push(fetchPerformanceData());
      }
      if (resetFailures || shouldCallEndpoint("teachers")) {
        promises.push(fetchTeachersData());
      }
      if (resetFailures || shouldCallEndpoint("unpaidTuition")) {
        promises.push(fetchUnpaidTuitionData());
      }
      if (resetFailures || shouldCallEndpoint("activities")) {
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
    shouldCallEndpoint,
    resetFailedEndpoints
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
        if (shouldCallEndpoint("metrics")) {
          fetchMetrics();
        }
        if (shouldCallEndpoint("activities")) {
          fetchRecentActivities();
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [loading, fetchMetrics, fetchRecentActivities, shouldCallEndpoint]);

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

    // Error handling
    failedEndpoints,
    endpointErrors,

    // Computed values
    metricsArray,

    // Actions
    refreshData,
    resetFailedEndpoints,

    // Notifications
    notification
  };
}

/**
 * Fallback data for teachers when API fails
 */
function getFallbackTeachersData() {
  return [
    { name: "James", subject: "History", qualification: "B.Com", fees: "$21.70", performance: "Bad" },
    { name: "James Brown", subject: "History", qualification: "B.Com", fees: "$15.70", performance: "Bad" },
    { name: "Hardy", subject: "Basic Algorithm", qualification: "B.E", fees: "$17.70", performance: "Good" },
    { name: "Hanu", subject: "Programming", qualification: "B.Tech", fees: "$217.70", performance: "Good" },
    { name: "Harry", subject: "English", qualification: "B.Tech", fees: "$219.70", performance: "Good" }
  ];
}

/**
 * Fallback data for unpaid tuition when API fails
 */
function getFallbackUnpaidTuitionData() {
  return [
    { id: "ID 1234567811", name: "Jordan Nico", class: "VII B", fees: 52036, rank: "First" },
    { id: "ID 1234567812", name: "Karen Hope", class: "VII A", fees: 53036, rank: "First" },
    { id: "ID 1234567813", name: "Nadila Adja", class: "VII C", fees: 54036, rank: "Second" }
  ];
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";

/**
 * Hook that manages dashboard data fetching, caching, and state management.
 * Follows the same patterns as useLogin/useSignup for consistency.
 */
export default function useDashboardData() {
  const notification = useNotification("info", 5000);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Dashboard metrics state
  const [metrics, setMetrics] = useState({
    totalUsers: { value: "0", label: "Total Users", description: "Registered users across all roles" },
    activeCourses: { value: "0", label: "Active Courses", description: "Courses currently live and accessible" },
    pendingApprovals: { value: "0", label: "Pending Approvals", description: "Awaiting admin action" },
    systemUptime: { value: "0%", label: "System Uptime", description: "Overall system reliability" },
    dailyLogins: { value: "0", label: "Daily Logins", description: "Users logged in today" },
    feedback: { value: "0", label: "Feedback", description: "Unread feedback tickets" }
  });

  // Chart data state
  const [chartData, setChartData] = useState(null);
  
  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([]);

  /**
   * Fetch dashboard metrics from API
   */
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await http.get("/api/admin/dashboard/metrics/", {
        auth: true
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          totalUsers: { ...prevMetrics.totalUsers, value: data.total_users || "0" },
          activeCourses: { ...prevMetrics.activeCourses, value: data.active_courses || "0" },
          pendingApprovals: { ...prevMetrics.pendingApprovals, value: data.pending_approvals || "0" },
          systemUptime: { ...prevMetrics.systemUptime, value: `${data.system_uptime || 0}%` },
          dailyLogins: { ...prevMetrics.dailyLogins, value: data.daily_logins || "0" },
          feedback: { ...prevMetrics.feedback, value: data.unread_feedback || "0" }
        }));
        setError(null);
      } else {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
    } catch (err) {
      const appError = parseError(err, { action: "fetch_dashboard_metrics" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);
      
      setError(userMessage);
      notification.notify(userMessage, notificationType);
      
      // Use fallback data on error
      console.warn("Using fallback dashboard data due to error:", err);
    }
  }, [notification]);

  /**
   * Fetch chart data from API
   */
  const fetchChartData = useCallback(async () => {
    try {
      const response = await http.get("/api/admin/dashboard/charts/", {
        auth: true
      });

      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      } else {
        throw new Error(`Failed to fetch chart data: ${response.status}`);
      }
    } catch (err) {
      console.warn("Failed to fetch chart data:", err);
      // Chart data is optional, so we don't show error notifications
    }
  }, []);

  /**
   * Fetch recent activities from API
   */
  const fetchRecentActivities = useCallback(async () => {
    try {
      const response = await http.get("/api/admin/dashboard/activities/", {
        auth: true,
        params: { limit: 10 }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities || []);
      } else {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }
    } catch (err) {
      console.warn("Failed to fetch recent activities:", err);
      // Activities are optional, so we don't show error notifications
    }
  }, []);

  /**
   * Refresh all dashboard data
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.allSettled([
        fetchMetrics(),
        fetchChartData(),
        fetchRecentActivities()
      ]);
      
      setLastUpdated(new Date());
      notification.notify("Dashboard data refreshed successfully", "success");
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchMetrics, fetchChartData, fetchRecentActivities, notification]);

  /**
   * Initial data load
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Auto-refresh data every 5 minutes
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchMetrics();
        fetchRecentActivities();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, fetchMetrics, fetchRecentActivities]);

  /**
   * Get metrics as array for easier rendering (memoized for performance)
   */
  const metricsArray = useMemo(() => {
    return Object.entries(metrics).map(([key, metric]) => ({
      id: key,
      value: metric.value,
      label: metric.label,
      description: metric.description,
      // Add icon mapping based on metric type
      iconType: getIconType(key)
    }));
  }, [metrics]);

  return {
    // State
    loading,
    error,
    lastUpdated,
    metrics,
    chartData,
    recentActivities,

    // Computed values
    metricsArray,

    // Actions
    refreshData,

    // Notifications
    notification
  };
}

/**
 * Helper function to map metric keys to icon types
 */
function getIconType(metricKey) {
  const iconMap = {
    totalUsers: "users",
    activeCourses: "book",
    pendingApprovals: "clock",
    systemUptime: "activity",
    dailyLogins: "login",
    feedback: "message"
  };
  
  return iconMap[metricKey] || "default";
}

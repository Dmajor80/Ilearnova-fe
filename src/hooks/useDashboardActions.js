import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useNotification from "@/hooks/useNotification";
import { http } from "@/api/baseClient";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";

/**
 * Hook that manages dashboard UI state and user actions.
 * Handles quick actions, navigation, and user interactions.
 */
export default function useDashboardActions() {
  const navigate = useNavigate();
  const notification = useNotification("success", 4000);
  
  // UI state
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Toggle quick actions dropdown
   */
  const toggleQuickActions = useCallback(() => {
    setQuickActionsOpen(prev => !prev);
  }, []);

  /**
   * Close quick actions dropdown
   */
  const closeQuickActions = useCallback(() => {
    setQuickActionsOpen(false);
  }, []);

  /**
   * Navigate to new user creation page
   */
  const handleCreateNewUser = useCallback(() => {
    closeQuickActions();
    navigate("/admin-dashboard/users/new-user");
  }, [navigate, closeQuickActions]);

  /**
   * Navigate to reports page
   */
  const handleViewReports = useCallback(() => {
    closeQuickActions();
    navigate("/admin-dashboard/reports");
  }, [navigate, closeQuickActions]);

  /**
   * Navigate to analytics page
   */
  const handleViewAnalytics = useCallback(() => {
    closeQuickActions();
    navigate("/admin-dashboard/analytics");
  }, [navigate, closeQuickActions]);

  /**
   * Navigate to user management page
   */
  const handleManageUsers = useCallback(() => {
    navigate("/admin-dashboard/users");
  }, [navigate]);

  /**
   * Navigate to course management page
   */
  const handleManageCourses = useCallback(() => {
    navigate("/admin-dashboard/courses");
  }, [navigate]);

  /**
   * Navigate to pending approvals page
   */
  const handleViewPendingApprovals = useCallback(() => {
    navigate("/admin-dashboard/approvals");
  }, [navigate]);

  /**
   * Navigate to feedback management page
   */
  const handleViewFeedback = useCallback(() => {
    navigate("/admin-dashboard/feedback");
  }, [navigate]);

  /**
   * Export user data
   */
  const handleExportUserData = useCallback(async () => {
    setActionLoading(true);
    closeQuickActions();
    
    try {
      const response = await http.get("/api/admin/export/users/", {
        auth: true,
        responseType: "blob"
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        notification.notify("User data exported successfully", "success");
      } else {
        throw new Error(`Export failed: ${response.status}`);
      }
    } catch (err) {
      const appError = parseError(err, { action: "export_user_data" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);
      
      notification.notify(userMessage, notificationType);
    } finally {
      setActionLoading(false);
    }
  }, [notification, closeQuickActions]);

  /**
   * Export system reports
   */
  const handleExportReports = useCallback(async () => {
    setActionLoading(true);
    
    try {
      const response = await http.get("/api/admin/export/reports/", {
        auth: true,
        responseType: "blob"
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `system_reports_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        notification.notify("Reports exported successfully", "success");
      } else {
        throw new Error(`Export failed: ${response.status}`);
      }
    } catch (err) {
      const appError = parseError(err, { action: "export_reports" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);
      
      notification.notify(userMessage, notificationType);
    } finally {
      setActionLoading(false);
    }
  }, [notification]);

  /**
   * Handle metric card click - navigate to relevant page
   */
  const handleMetricClick = useCallback((metricId) => {
    const navigationMap = {
      totalUsers: "/admin-dashboard/users",
      activeCourses: "/admin-dashboard/courses",
      pendingApprovals: "/admin-dashboard/approvals",
      systemUptime: "/admin-dashboard/system",
      dailyLogins: "/admin-dashboard/analytics",
      feedback: "/admin-dashboard/feedback"
    };

    const path = navigationMap[metricId];
    if (path) {
      navigate(path);
    }
  }, [navigate]);

  /**
   * Quick actions configuration
   */
  const quickActions = [
    {
      id: "new-user",
      label: "Add New User",
      icon: "plus",
      action: handleCreateNewUser,
      description: "Create a new user account"
    },
    {
      id: "export-users",
      label: "Export User Data",
      icon: "download",
      action: handleExportUserData,
      description: "Download user data as CSV"
    },
    {
      id: "view-reports",
      label: "View Reports",
      icon: "chart",
      action: handleViewReports,
      description: "Access system reports"
    },
    {
      id: "manage-courses",
      label: "Manage Courses",
      icon: "book",
      action: handleManageCourses,
      description: "Course management panel"
    }
  ];

  return {
    // UI State
    quickActionsOpen,
    actionLoading,
    
    // Actions
    toggleQuickActions,
    closeQuickActions,
    handleCreateNewUser,
    handleViewReports,
    handleViewAnalytics,
    handleManageUsers,
    handleManageCourses,
    handleViewPendingApprovals,
    handleViewFeedback,
    handleExportUserData,
    handleExportReports,
    handleMetricClick,
    
    // Configuration
    quickActions,
    
    // Notifications
    notification
  };
}

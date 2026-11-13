import React, { Suspense } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import DashboardErrorBoundary from "@/components/admin/DashboardErrorBoundary";
import useDashboardActions from "@/hooks/useDashboardActions";
import useAdminUser from "@/hooks/useAdminUser";
import { useSuperAdminMetrics } from "@/hooks/superadmin";
import Loader from "@/components/Loader";

/**
 * Modern admin dashboard component following established patterns.
 * Uses custom hooks for state management and composed components for UI.
 */

const Dashboard = React.memo(function Dashboard() {
  const {
    loading: metricsLoading,
    error: metricsError,
    lastUpdated,
    metrics,
    refreshData,
    notification: dataNotification
  } = useSuperAdminMetrics();

  const {
    quickActionsOpen,
    actionLoading,
    toggleQuickActions,
    closeQuickActions,
    handleViewReports,
    handleMetricClick,
    quickActions,
    notification: actionNotification
  } = useDashboardActions();

  const {
    user,
    displayName,
    welcomeMessage
  } = useAdminUser();
  const notification = dataNotification.show ? dataNotification :
                      actionNotification.show ? actionNotification : null;

  const metricsArray = Object.entries(metrics ?? {}).map(([key, value]) => {
    const label = key.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    const metricValue = value && typeof value === "object"
      ? value.value ?? value.count ?? JSON.stringify(value)
      : value;

    return {
      id: key,
      value: metricValue == null ? "—" : String(metricValue),
      label,
      description: value?.description ?? `Platform-wide ${label.toLowerCase()}.`,
      iconType: /user|student|teacher|parent|organization/i.test(key) ? "users" : "activity"
    };
  });
  const metricsErrorMessage = metricsError?.message ?? metricsError;

  return (
    <Suspense fallback={<Loader />}>
      <DashboardErrorBoundary
        onError={(error, errorInfo) => {
          console.error("Dashboard error:", error, errorInfo);
        }}
        onRetry={refreshData}
      >
        <DashboardLayout
          // User data
          user={{ displayName, ...user }}
          welcomeMessage={welcomeMessage}
          lastUpdated={lastUpdated}

          // Metrics data
          metrics={metricsArray}
          metricsLoading={metricsLoading}
          metricsError={metricsErrorMessage}

          // Actions
          onRefresh={refreshData}
          onViewReports={handleViewReports}
          onMetricClick={handleMetricClick}
          onRetryMetrics={refreshData}

          // Quick actions
          quickActions={quickActions}
          quickActionsOpen={quickActionsOpen}
          onToggleQuickActions={toggleQuickActions}
          onCloseQuickActions={closeQuickActions}

          // Loading states
          refreshLoading={metricsLoading}
          actionLoading={actionLoading}

          // Notifications
          notification={notification}

          // Layout options
          showCharts={false}
          maxWidth="max-w-7xl"
          className="min-h-screen bg-gray-50"
        />
      </DashboardErrorBoundary>
    </Suspense>
  );
});

export default Dashboard;

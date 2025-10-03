import React, { Suspense } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import DashboardErrorBoundary from "@/components/admin/DashboardErrorBoundary";
import useDashboardData from "@/hooks/useDashboardData";
import useDashboardActions from "@/hooks/useDashboardActions";
import useAdminUser from "@/hooks/useAdminUser";
import Loader from "@/components/Loader";

/**
 * Modern admin dashboard component following established patterns.
 * Uses custom hooks for state management and composed components for UI.
 */

const Dashboard = React.memo(function Dashboard() {
  // Custom hooks for data and state management
  const {
    loading: dataLoading,
    error: dataError,
    lastUpdated,
    metricsArray,
    chartData,
    refreshData,
    notification: dataNotification
  } = useDashboardData();

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
  // Combine notifications from different hooks
  const notification = dataNotification.show ? dataNotification :
                      actionNotification.show ? actionNotification : null;

  // Handle retry actions
  const handleRetryMetrics = () => {
    refreshData();
  };

  const handleRetryCharts = () => {
    refreshData();
  };

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
          metricsLoading={dataLoading}
          metricsError={dataError}

          // Charts data
          chartData={chartData}
          chartsLoading={dataLoading}
          chartsError={dataError}

          // Actions
          onRefresh={refreshData}
          onViewReports={handleViewReports}
          onMetricClick={handleMetricClick}
          onRetryMetrics={handleRetryMetrics}
          onRetryCharts={handleRetryCharts}

          // Quick actions
          quickActions={quickActions}
          quickActionsOpen={quickActionsOpen}
          onToggleQuickActions={toggleQuickActions}
          onCloseQuickActions={closeQuickActions}

          // Loading states
          refreshLoading={dataLoading}
          actionLoading={actionLoading}

          // Notifications
          notification={notification}

          // Layout options
          showCharts={true}
          maxWidth="max-w-7xl"
          className="min-h-screen bg-gray-50"
        />
      </DashboardErrorBoundary>
    </Suspense>
  );
});

export default Dashboard;

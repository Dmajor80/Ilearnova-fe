import React, { useMemo } from "react";
import DashboardHeader from "./DashboardHeader";
import MetricsGrid from "./MetricsGrid";
import ChartsSection from "./ChartsSection";
import DashboardSkeleton from "./DashboardSkeleton";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

/**
 * Main dashboard layout component that orchestrates all dashboard sections.
 * Provides consistent layout structure and handles global states.
 */
const DashboardLayout = React.memo(function DashboardLayout({
  // User data
  user,
  welcomeMessage,
  lastUpdated,
  
  // Metrics data
  metrics = [],
  metricsLoading = false,
  metricsError = null,
  
  // Charts data
  chartData,
  chartsLoading = false,
  chartsError = null,
  
  // Actions
  onRefresh,
  onViewReports,
  onMetricClick,
  onRetryMetrics,
  onRetryCharts,
  
  // Quick actions
  quickActions = [],
  quickActionsOpen = false,
  onToggleQuickActions,
  onCloseQuickActions,
  
  // Loading states
  refreshLoading = false,
  actionLoading = false,
  
  // Notifications
  notification,
  
  // Layout options
  showCharts = true,
  maxWidth = "max-w-7xl",
  className = ""
}) {
  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user?.displayName, user?.id]);

  // Memoize metrics to prevent unnecessary re-renders
  const memoizedMetrics = useMemo(() => metrics, [metrics]);

  // Show full loading skeleton on initial load
  if (metricsLoading && metrics.length === 0 && !user) {
    return (
      <div className={`${maxWidth} mx-auto px-4 py-6 ${className}`}>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <ErrorBoundary
      title="Dashboard Error"
      message="Something went wrong while loading the dashboard. Please refresh the page or contact support."
    >
      <div className={`${maxWidth} mx-auto px-4 py-6 ${className}`}>
        {/* Notifications */}
        {notification && (
          <NotificationBar
            show={notification.show}
            type={notification.type}
            message={notification.message}
            onClose={notification.hide}
            position="fixed top-4 right-4 z-50"
          />
        )}

        {/* Dashboard Header */}
        <DashboardHeader
          user={memoizedUser}
          welcomeMessage={welcomeMessage}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
          onViewReports={onViewReports}
          quickActions={quickActions}
          quickActionsOpen={quickActionsOpen}
          onToggleQuickActions={onToggleQuickActions}
          onCloseQuickActions={onCloseQuickActions}
          refreshLoading={refreshLoading}
          actionLoading={actionLoading}
          className="mb-8"
        />

        {/* Main Content */}
        <main className="space-y-8">
          {/* Metrics Section */}
          <section aria-label="Dashboard metrics">
            <MetricsGrid
              metrics={memoizedMetrics}
              loading={metricsLoading}
              error={metricsError}
              onMetricClick={onMetricClick}
              onRetry={onRetryMetrics}
              columns={3}
            />
          </section>

          {/* Charts Section */}
          {showCharts && (
            <ChartsSection
              chartData={chartData}
              loading={chartsLoading}
              error={chartsError}
              onRetry={onRetryCharts}
            />
          )}
        </main>

        {/* Footer */}
        <DashboardFooter className="mt-12" />
      </div>
    </ErrorBoundary>
  );
});

/**
 * Dashboard footer component
 */
const DashboardFooter = React.memo(function DashboardFooter({ className = "" }) {
  return (
    <footer className={`border-t border-gray-200 pt-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-4 md:mb-0">
          <p>© 2024 ILearnova Admin Dashboard. All rights reserved.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            className="hover:text-blue-600 transition-colors"
            onClick={() => window.open('/help', '_blank')}
          >
            Help
          </button>
          <button 
            className="hover:text-blue-600 transition-colors"
            onClick={() => window.open('/support', '_blank')}
          >
            Support
          </button>
          <button 
            className="hover:text-blue-600 transition-colors"
            onClick={() => window.open('/privacy', '_blank')}
          >
            Privacy
          </button>
        </div>
      </div>
    </footer>
  );
});

/**
 * Compact dashboard layout for mobile or embedded views
 */
export const CompactDashboardLayout = React.memo(function CompactDashboardLayout({
  user,
  metrics = [],
  loading = false,
  onRefresh,
  onMetricClick,
  className = ""
}) {
  return (
    <div className={`p-4 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Welcome, {user?.displayName || "Admin"}
          </h1>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Refresh dashboard"
        >
          <svg className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Compact Metrics */}
      <MetricsGrid
        metrics={metrics.slice(0, 4)} // Show only first 4 metrics
        loading={loading}
        onMetricClick={onMetricClick}
        columns={2}
      />
    </div>
  );
});

/**
 * Dashboard layout with custom sections
 */
export const CustomDashboardLayout = React.memo(function CustomDashboardLayout({
  children,
  header,
  sidebar,
  maxWidth = "max-w-7xl",
  className = ""
}) {
  return (
    <div className={`${maxWidth} mx-auto ${className}`}>
      {/* Custom Header */}
      {header && (
        <header className="mb-8">
          {header}
        </header>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 flex-shrink-0">
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
});

export default DashboardLayout;

import React, { useMemo } from "react";
import SchoolDashboardHeader from "./SchoolDashboardHeader";
import SchoolSidebar from "./SchoolSidebar";
import { SchoolStatsGrid } from "./SchoolStatsCard";
import SchoolDataTable from "./SchoolDataTable";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";
import { formatCurrency } from "@/lib/formatters";

/**
 * Main school dashboard layout component that orchestrates all school admin sections.
 * Provides consistent layout structure and handles global states.
 */
const SchoolDashboardLayout = React.memo(function SchoolDashboardLayout({
  // User data
  user,
  schoolName,
  welcomeMessage,
  lastUpdated,
  
  // Navigation
  activeRoute,
  expandedItems,
  sidebarItems,
  onNavigate,
  onToggleExpanded,
  
  // Stats data
  stats = [],
  statsLoading = false,
  statsError = null,
  
  // School data
  schoolData,
  schoolDataLoading = false,
  schoolDataError = null,
  
  // Actions
  onRefresh,
  onViewReports,
  onStatsClick,
  onRetryStats,
  onRetrySchoolData,
  
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
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,

  // Layout options
  showSidebar = true,
  sidebarCollapsed = false,
  className = ""
}) {
  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user?.displayName, user?.id]);
  
  // Memoize stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => stats, [stats]);

  // Memoize school data to prevent unnecessary re-renders
  const memoizedSchoolData = useMemo(() => schoolData, [schoolData]);

  return (
    <ErrorBoundary
      title="School Dashboard Error"
      message="Something went wrong while loading the school dashboard. Please refresh the page or contact support."
    >
      <div className={`min-h-screen bg-gray-50 flex ${className}`}>
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

        {/* Sidebar */}
        {showSidebar && (
          <div className={`${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0 transition-all duration-300`}>
            <SchoolSidebar
              activeRoute={activeRoute}
              expandedItems={expandedItems}
              sidebarItems={sidebarItems}
              onNavigate={onNavigate}
              onToggleExpanded={onToggleExpanded}
              schoolName={schoolName}
              className="h-screen"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <SchoolDashboardHeader
            user={memoizedUser}
            schoolName={schoolName}
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
            notificationCount={notificationCount}
            onNotificationClick={onNotificationClick}
            onProfileClick={onProfileClick}
          />

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto py-4 px-4 md:py-6 md:px-6">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              {/* Stats Section */}
              <section aria-label="School statistics">
                <SchoolStatsGrid
                  stats={memoizedStats}
                  loading={statsLoading}
                  error={statsError}
                  onStatsClick={onStatsClick}
                  onRetry={onRetryStats}
                  variant="default"
                  columns={4}
                />
              </section>

              {/* School Data Tables Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Teachers Table */}
                <SchoolDataTable
                  title="Teachers"
                  data={memoizedSchoolData?.teachers || []}
                  columns={[
                    { 
                      key: "full_name", 
                      label: "Name", 
                      sortable: true,
                      render: (value, row) => {
                        const raw = String(value ?? row?.name ?? "");
                        const title = raw
                          .toLowerCase()
                          .split(/(\s|-|')/)
                          .map(part => (/^[a-z]/.test(part) ? part[0].toUpperCase() + part.slice(1) : part))
                          .join("");
                        return <span className="text-gray-900">{title}</span>;
                      }
                    },
                    { key: "subject", label: "Subject", sortable: true },
                    { key: "qualification", label: "Qualification", sortable: true },
                    { key: "email", label: "Email", sortable: true, align: "right" },
                    { 
                      key: "performance_rating", 
                      label: "Performance", 
                      sortable: true,
                      render: (value) => (
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${value === "Good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        `}>
                          {value}
                        </span>
                      )
                    }
                  ]}
                  loading={schoolDataLoading}
                  error={schoolDataError}
                  itemsPerPage={5}
                  onRowClick={(teacher) => console.log("Teacher clicked:", teacher)}
                />

                {/* Unpaid Tuition Table */}
                <SchoolDataTable
                  title="Unpaid Student Tuition"
                  data={memoizedSchoolData?.unpaidTuition || []}
                  columns={[
                    { key: "id", label: "ID", sortable: true },
                    { 
                      key: "full_name", 
                      label: "Name", 
                      sortable: true,
                      render: (value, row) => {
                        const raw = String(value ?? row?.name ?? "");
                        const title = raw
                          .toLowerCase()
                          .split(/(\s|-|')/)
                          .map(part => (/^[a-z]/.test(part) ? part[0].toUpperCase() + part.slice(1) : part))
                          .join("");
                        return <span className="text-gray-900">{title}</span>;
                      }
                    },
                    { key: "class", label: "Class", sortable: true },
                    {
                       key: "pending_amount",
                       label: "Outstanding Fees",
                       sortable: true,
                       align: "right",
                       render: (value, row) => {
                        const pending = Number(value ?? 0);
                        const total = Number(row?.total_fees ?? 0);
                        const ratio = total > 0 ? pending / total : 0;
                        const overHalf = ratio > 0.5;

                        const badgeClass = `
                          px-2 py-1 rounded-full text-xs font-medium
                          ${overHalf ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}
                        `;


                        return (
                          <span className={badgeClass}>
                            {formatCurrency(pending)} ({Math.round(ratio * 100)}%)
                          </span>
                        );
                      }
                    },
                    { 
                      key: "total_fees", 
                      label: "Total Fees", 
                      sortable: true,
                      align: "right",
                      render: (value) => {
                        const amount = Number(value ?? 0);
                        return (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatCurrency(amount)}
                          </span>
                        );
                      }
                    }
                  ]}
                  loading={schoolDataLoading}
                  error={schoolDataError}
                  itemsPerPage={5}
                  onRowClick={(student) => console.log("Student clicked:", student)}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart Placeholder */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                  <h3 className="text-lg font-bold text-[#303972] mb-4">School Performance</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-sm">Performance chart will be displayed here</p>
                    </div>
                  </div>
                </div>

                {/* Overview Chart Placeholder */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                  <h3 className="text-lg font-bold text-[#303972] mb-4">School Overview</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <p className="text-sm">Overview chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
});

/**
 * Compact school dashboard layout for mobile or embedded views
 */
export const CompactSchoolDashboardLayout = React.memo(function CompactSchoolDashboardLayout({
  user,
  stats = [],
  loading = false,
  onRefresh,
  onStatsClick,
  className = ""
}) {
  return (
    <div className={`p-4 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#303972]">
            Welcome, {user?.displayName || "School Admin"}
          </h1>
          <p className="text-sm text-gray-600">Akademi School</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-[#4D44B5] hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Refresh dashboard"
        >
          <svg className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Compact Stats */}
      <SchoolStatsGrid
        stats={stats.slice(0, 4)} // Show only first 4 stats
        loading={loading}
        onStatsClick={onStatsClick}
        variant="compact"
        columns={2}
      />
    </div>
  );
});

export default SchoolDashboardLayout;

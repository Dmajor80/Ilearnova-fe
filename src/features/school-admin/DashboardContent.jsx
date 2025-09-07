import React from "react";
import SchoolDashboardLayout from "@/components/school-admin/SchoolDashboardLayout";
import useSchoolDashboardData from "@/hooks/useSchoolDashboardData";
import useSchoolAdminActions from "@/hooks/useSchoolAdminActions";
import useSchoolAdminUser from "@/hooks/useSchoolAdminUser";

/**
 * Modern school admin dashboard content component following established patterns.
 * Uses custom hooks for state management and composed components for UI.
 */
export const DashboardContent = React.memo(function DashboardContent() {
  // Custom hooks for data and state management
  const {
    loading: dataLoading,
    error: dataError,
    lastUpdated,
    metricsArray,
    schoolData,
    failedEndpoints,
    endpointErrors,
    refreshData,
    resetFailedEndpoints,
    notification: dataNotification
  } = useSchoolDashboardData();

  const {
    activeRoute,
    expandedItems,
    actionLoading,
    quickActionsOpen,
    toggleExpanded,
    handleNavigation,
    toggleQuickActions,
    closeQuickActions,
    handleMetricClick,
    quickActions,
    sidebarItems,
    notification: actionNotification
  } = useSchoolAdminActions();

  const {
    user,
    displayName,
    welcomeMessage,
    schoolName,
    schoolDetails
  } = useSchoolAdminUser();

  // Combine notifications from different hooks
  const notification = dataNotification.show ? dataNotification : 
                      actionNotification.show ? actionNotification : null;

  // Handle retry actions
  const handleRetryStats = () => {
    refreshData(true); // Reset failed endpoints and retry
  };

  const handleRetrySchoolData = () => {
    refreshData(true); // Reset failed endpoints and retry
  };

  // Handle individual section retries
  const handleRetrySection = (sectionName) => {
    resetFailedEndpoints();
    refreshData(true);
  };

  // Handle view reports action
  const handleViewReports = () => {
    handleNavigation("reports");
  };

  // Handle notification click
  const handleNotificationClick = () => {
    handleNavigation("notifications");
  };

  // Handle profile click
  const handleProfileClick = () => {
    console.log("Profile clicked - implement profile management");
    // TODO: Implement user profile management functionality
  };

  // Only render dashboard content when on Dashboard route
  if (activeRoute !== "Dashboard") {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-[#303972] mb-4">
            {getRouteTitle(activeRoute)}
          </h2>
          <p className="text-gray-600 mb-6">
            This section is under development. The refactored dashboard shows the modern architecture.
          </p>
          <button
            onClick={() => handleNavigation("Dashboard")}
            className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <SchoolDashboardLayout
      // User data
      user={{ displayName, ...user }}
      schoolName={schoolName}
      welcomeMessage={welcomeMessage}
      lastUpdated={lastUpdated}
      
      // Navigation
      activeRoute={activeRoute}
      expandedItems={expandedItems}
      sidebarItems={sidebarItems}
      onNavigate={handleNavigation}
      onToggleExpanded={toggleExpanded}
      
      // Stats data
      stats={metricsArray}
      statsLoading={dataLoading}
      statsError={failedEndpoints.has('metrics') ? endpointErrors.metrics : null}

      // School data
      schoolData={schoolData}
      schoolDataLoading={dataLoading}
      schoolDataError={dataError}

      // Error handling
      failedEndpoints={failedEndpoints}
      endpointErrors={endpointErrors}
      
      // Actions
      onRefresh={refreshData}
      onViewReports={handleViewReports}
      onStatsClick={handleMetricClick}
      onRetryStats={handleRetryStats}
      onRetrySchoolData={handleRetrySchoolData}
      onRetrySection={handleRetrySection}
      
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
      notificationCount={3} // This would come from a notifications hook
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}

      // Layout options
      showSidebar={false} // Sidebar is handled by parent SchoolAdmin component
      className="h-full"
    />
  );
});

/**
 * Get title for different routes
 */
function getRouteTitle(route) {
  const titleMap = {
    "Student": "Student Management",
    "add-student": "Add New Student",
    "teacher-list": "Teacher Management",
    "add-teacher": "Add New Teacher",
    "parent-list": "Parent Management",
    "add-parent": "Add New Parent",
    "menu": "Food Menu Management",
    "add-menu": "Add Menu Item",
    "orders": "Food Orders",
    "calendar-app": "School Calendar",
    "reports": "School Reports",
    "notifications": "Notifications"
  };
  
  return titleMap[route] || "School Admin";
}

export default DashboardContent;

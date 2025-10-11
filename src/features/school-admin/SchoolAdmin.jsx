import React from "react";
import SchoolSidebar from "@/components/school-admin/SchoolSidebar";
import DashboardErrorBoundary from "@/components/admin/DashboardErrorBoundary";
import useSchoolAdminActions from "@/hooks/useSchoolAdminActions";
import useSchoolAdminUser from "@/hooks/useSchoolAdminUser";
import useSchoolDashboardData from "@/hooks/useSchoolDashboardData";
import useProfileManagement from "@/hooks/useProfileManagement";

// Import existing components (these would be refactored later)
import { DashboardContent } from "./DashboardContent";
import { StudentListContent } from "./StudentListContent";
import { StudentDetailContent } from "./StudentDetailContent";
import { AddStudentContent } from "./AddStudentContent";
import { ParentListContent } from "./ParentListContent";
import { TeacherListContent } from "./TeacherListContent";

/**
 * Modern school admin main component following established patterns.
 * Uses custom hooks for state management and composed components for UI.
 */
const SchoolAdmin = React.memo(function SchoolAdmin() {
  // Custom hooks for state management
  const {
    activeRoute,
    expandedItems,
    sidebarItems,
    toggleExpanded,
    handleNavigation,
    notification: actionNotification
  } = useSchoolAdminActions();

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const toggleMobileSidebar = React.useCallback(() => {
    setMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = React.useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const {
    user,
    schoolName,
    schoolDetails,
    organizationLogo,
    organizationInitials,
    currentYear,
    organizationData
  } = useSchoolAdminUser();

  // Profile management hook
  const {
    uploading,
    uploadProgress,
    error: uploadError,
    openLogoFilePicker,
    openProfileFilePicker,
    clearError
  } = useProfileManagement();

  const {
    refreshData,
    notification: dataNotification
  } = useSchoolDashboardData();

  // Combine notifications from different hooks
  const notification = dataNotification.show ? dataNotification : 
                      actionNotification.show ? actionNotification : null;

  // Handle error recovery
  const handleErrorRetry = () => {
    refreshData();
  };

  // Handle organization logo click
  const handleLogoClick = () => {
    if (!organizationData?.id) {
      console.warn("No organization ID available for logo upload");
      return;
    }

    openLogoFilePicker(
      organizationData.id,
      (data) => {
        console.log("Logo uploaded successfully:", data);
        // The hook automatically updates the user data in storage
        // You might want to show a success notification here
      },
      (error) => {
        console.error("Logo upload failed:", error);
        // Error is already set in the hook state
      }
    );
  };

  // Handle user profile click
  const handleProfileClick = () => {
    openProfileFilePicker(
      (data) => {
        console.log("Profile picture uploaded successfully:", data);
        // The hook automatically updates the user data in storage
        // You might want to show a success notification here
      },
      (error) => {
        console.error("Profile picture upload failed:", error);
        // Error is already set in the hook state
      }
    );
  };

  // Render content based on active route
  const renderContent = () => {
    switch (activeRoute) {
      case "Dashboard":
        return <DashboardContent />;
      
      case "Student":
        return <StudentListContent />;
      
      case "student-detail":
        return <StudentDetailContent />;
      
      case "add-student":
        return <AddStudentContent />;
      
      case "teacher-list":
        return <TeacherListContent />;
      
      case "add-teacher":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">Add Teacher</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      case "parent-list":
        return <ParentListContent />;
      
      case "add-parent":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">Add Parent</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      case "menu":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">Food Menu</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      case "add-menu":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">Add Menu Item</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      case "orders":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">Food Orders</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      case "calendar-app":
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#303972] mb-4">School Calendar</h2>
              <p className="text-gray-600 mb-6">This section is under development.</p>
              <button
                onClick={() => handleNavigation("Dashboard")}
                className="px-6 py-3 bg-[#4D44B5] text-white rounded-lg font-medium hover:bg-[#3D34A5] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      default:
        return <DashboardContent />;
    }
  };

  return (
    <DashboardErrorBoundary
      onError={(error, errorInfo) => {
        console.error("School Admin error:", error, errorInfo);
      }}
      onRetry={handleErrorRetry}
      schoolName={schoolName}
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-in-out
          w-64 flex-shrink-0
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}>
          <SchoolSidebar
            activeRoute={activeRoute}
            expandedItems={expandedItems}
            sidebarItems={sidebarItems}
            onNavigate={(route) => {
              handleNavigation(route);
              closeMobileSidebar();
            }}
            onToggleExpanded={toggleExpanded}
            schoolName={schoolName}
            organizationLogo={organizationLogo}
            organizationInitials={organizationInitials}
            currentYear={currentYear}
            onLogoClick={handleLogoClick}
            className="h-full"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 overflow-y-auto min-h-screen">
          {/* Mobile Header with Menu Button */}
          <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </DashboardErrorBoundary>
  );
});

export default SchoolAdmin;

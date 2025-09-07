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
        {/* Fixed Sidebar */}
        <div className="w-64 flex-shrink-0 fixed left-0 top-0 h-screen z-10">
          <SchoolSidebar
            activeRoute={activeRoute}
            expandedItems={expandedItems}
            sidebarItems={sidebarItems}
            onNavigate={handleNavigation}
            onToggleExpanded={toggleExpanded}
            schoolName={schoolName}
            organizationLogo={organizationLogo}
            organizationInitials={organizationInitials}
            currentYear={currentYear}
            onLogoClick={handleLogoClick}
            className="h-full"
          />
        </div>

        {/* Main Content with left margin to account for fixed sidebar */}
        <div className="flex-1 ml-64 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </DashboardErrorBoundary>
  );
});

export default SchoolAdmin;

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
import { ParentListContent } from "./ParentListContent";
import { TeacherListContent } from "./TeacherListContent";
import { FoodMenuContent } from "./FoodMenuContent";
import { FoodOrdersContent } from "./FoodOrdersContent";
import { NotificationsContent } from "./NotificationsContent";
import SchoolCalendar from "./SchoolCalendar";
import { ClassesContent } from "./ClassesContent";
import { SubjectsContent } from "./SubjectsContent";
import { UsersContent } from "./UsersContent";
import { ReportsContent } from "./ReportsContent";
import AddStudentModal from "./AddStudentModal";
import AddNewTeacher from "./AddTeacherModal";
import AddNewParent from "./AddParentModal";

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
        
        // case "student-detail":
        //   return <StudentDetailContent />;
        
      case "add-student":
        return <AddStudentModal/>;
      
      case "teacher-list":
        return <TeacherListContent />;
        
        case "add-teacher":
        return <AddNewTeacher/>;
      
      case "parent-list":
        return <ParentListContent />;
      
      case "add-parent":
        return <AddNewParent/>;
      
      case "menu":
      case "add-menu":
        return <FoodMenuContent />;

      case "orders":
        return <FoodOrdersContent />;

      case "notifications":
        return <NotificationsContent />;
      
      case "calendar-app":
      case "events":
      case "holidays":
      case "add-event":
        return (
          <div className="p-6">
            <SchoolCalendar />
          </div>
        );

      case "classes":
        return <ClassesContent />;

      case "subjects":
        return <SubjectsContent />;

      case "user-management":
        return <UsersContent />;

      case "reports":
        return <ReportsContent />;
      
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
      <div className="h-screen bg-gray-50 flex overflow-hidden">
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
        w-64 flex-shrink-0 overflow-y-auto
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
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
      <div className="flex-1 overflow-y-auto h-screen">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
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
        
        <div className="p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
    </DashboardErrorBoundary>
  );
});

export default SchoolAdmin;

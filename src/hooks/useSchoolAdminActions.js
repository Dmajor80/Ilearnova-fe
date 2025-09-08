import { useState, useCallback, useMemo } from "react";
import useNotification from "@/hooks/useNotification";
import { http } from "@/api/baseClient";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";

/**
 * Hook that manages school admin UI state and user actions.
 * Handles navigation, quick actions, and school-specific interactions.
 */
export default function useSchoolAdminActions() {
  const notification = useNotification("success", 4000);
  
  // UI state
  const [activeRoute, setActiveRoute] = useState("Dashboard");
  const [expandedItems, setExpandedItems] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  /**
   * Toggle sidebar menu expansion
   */
  const toggleExpanded = useCallback((itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  /**
   * Handle navigation between routes
   */
  const handleNavigation = useCallback((routeId) => {
    setActiveRoute(routeId);
    // Close any open quick actions when navigating
    setQuickActionsOpen(false);
  }, []);

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
   * Handle student-related actions
   */
  const handleAddStudent = useCallback(() => {
    handleNavigation("add-student");
    closeQuickActions();
  }, [handleNavigation, closeQuickActions]);

  const handleViewStudents = useCallback(() => {
    handleNavigation("Student");
  }, [handleNavigation]);

  const handleStudentDetail = useCallback((studentId) => {
    // Store student ID for detail view
    setActiveRoute("student-detail");
    // In a real app, you'd also store the student ID in state or context
  }, []);

  /**
   * Handle teacher-related actions
   */
  const handleAddTeacher = useCallback(() => {
    handleNavigation("add-teacher");
    closeQuickActions();
  }, [handleNavigation, closeQuickActions]);

  const handleViewTeachers = useCallback(() => {
    handleNavigation("teacher-list");
  }, [handleNavigation]);

  const handleTeacherDetail = useCallback((teacherId) => {
    // Navigate to teacher detail view
    setActiveRoute("teacher-detail");
  }, []);

  /**
   * Handle parent-related actions
   */
  const handleAddParent = useCallback(() => {
    handleNavigation("add-parent");
    closeQuickActions();
  }, [handleNavigation, closeQuickActions]);

  const handleViewParents = useCallback(() => {
    handleNavigation("parent-list");
  }, [handleNavigation]);

  /**
   * Handle food/meal-related actions
   */
  const handleViewMenu = useCallback(() => {
    handleNavigation("menu");
  }, [handleNavigation]);

  const handleAddMenu = useCallback(() => {
    handleNavigation("add-menu");
    closeQuickActions();
  }, [handleNavigation, closeQuickActions]);

  /**
   * Export student data
   */
  const handleExportStudentData = useCallback(async () => {
    setActionLoading(true);
    closeQuickActions();
    
    try {
      const response = await http.get("/api/admin/school/export/students/", {
        auth: true,
        responseType: "blob"
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        notification.notify("Student data exported successfully", "success");
      } else {
        throw new Error(`Export failed: ${response.status}`);
      }
    } catch (err) {
      const appError = parseError(err, { action: "export_student_data" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);
      
      notification.notify(userMessage, notificationType);
    } finally {
      setActionLoading(false);
    }
  }, [notification, closeQuickActions]);

  /**
   * Export teacher data
   */
  const handleExportTeacherData = useCallback(async () => {
    setActionLoading(true);
    
    try {
      const response = await http.get("/api/admin/school/export/teachers/", {
        auth: true,
        responseType: "blob"
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `teachers_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        notification.notify("Teacher data exported successfully", "success");
      } else {
        throw new Error(`Export failed: ${response.status}`);
      }
    } catch (err) {
      const appError = parseError(err, { action: "export_teacher_data" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);
      
      notification.notify(userMessage, notificationType);
    } finally {
      setActionLoading(false);
    }
  }, [notification]);

  /**
   * Handle metric card click - navigate to relevant section
   */
  const handleMetricClick = useCallback((metricId) => {
    const navigationMap = {
      students: "Student",
      teachers: "teacher-list",
      events: "calendar-app",
      finance: "finance"
    };

    const route = navigationMap[metricId];
    if (route) {
      handleNavigation(route);
    }
  }, [handleNavigation]);

  /**
   * Quick actions configuration for school admin (memoized for performance)
   */
  const quickActions = useMemo(() => [
    {
      id: "add-student",
      label: "Add New Student",
      icon: "plus",
      action: handleAddStudent,
      description: "Register a new student"
    },
    {
      id: "add-teacher",
      label: "Add New Teacher",
      icon: "userPlus",
      action: handleAddTeacher,
      description: "Add a new teacher to staff"
    },
    {
      id: "export-students",
      label: "Export Student Data",
      icon: "download",
      action: handleExportStudentData,
      description: "Download student data as CSV"
    },
    {
      id: "export-teachers",
      label: "Export Teacher Data",
      icon: "download",
      action: handleExportTeacherData,
      description: "Download teacher data as CSV"
    },
    {
      id: "add-menu",
      label: "Add Menu Item",
      icon: "utensils",
      action: handleAddMenu,
      description: "Add new food menu item"
    }
  ], [handleAddStudent, handleAddTeacher, handleExportStudentData, handleExportTeacherData, handleAddMenu]);

  /**
   * Sidebar navigation items (memoized for performance)
   */
  const sidebarItems = useMemo(() => [
    {
      id: "Dashboard",
      icon: "Home",
      label: "Dashboard",
      hasSubmenu: false,
    },
    {
      id: "Student",
      icon: "GraduationCap",
      label: "Student",
      hasSubmenu: true,
      submenu: [
        { id: "Student", label: "Student List", icon: "User" },
        { id: "add-student", label: "Add New Student", icon: "Plus" },
      ],
    },
    {
      id: "teacher",
      icon: "UserSquare",
      label: "Teacher",
      hasSubmenu: true,
      submenu: [
        { id: "teacher-list", label: "Teacher List", icon: "Users" },
        { id: "add-teacher", label: "Add Teacher", icon: "Plus" },
      ],
    },
    {
      id: "Parent",
      icon: "UserSquare",
      label: "Parent",
      hasSubmenu: true,
      submenu: [
        { id: "parent-list", label: "Parent List", icon: "Users" },
        { id: "add-parent", label: "Add Parent", icon: "Plus" },
      ],
    },
    {
      id: "food",
      icon: "Utensils",
      label: "Food",
      hasSubmenu: true,
      submenu: [
        { id: "menu", label: "Menu", icon: "FileText" },
        { id: "orders", label: "Orders", icon: "Calendar" },
        { id: "add-menu", label: "Add Menu", icon: "Plus" },
      ],
    },
    {
      id: "calendar",
      icon: "Calendar",
      label: "Calendar",
      hasSubmenu: true,
      submenu: [
        { id: "calendar-app", label: "School Calendar", icon: "Calendar" },
        { id: "events", label: "Events", icon: "Star" },
        { id: "holidays", label: "Holidays", icon: "Sun" },
        { id: "add-event", label: "Add Event", icon: "Plus" },
      ],
    },
    {
      id: "academics",
      icon: "BookOpen",
      label: "Academics",
      hasSubmenu: true,
      submenu: [
        { id: "subjects", label: "Subjects", icon: "Book" },
        { id: "classes", label: "Classes", icon: "Users" },
        { id: "timetable", label: "Timetable", icon: "Clock" },
        { id: "exams", label: "Exams", icon: "FileText" },
        { id: "results", label: "Results", icon: "Award" },
      ],
    },
    {
      id: "finance",
      icon: "DollarSign",
      label: "Finance",
      hasSubmenu: true,
      submenu: [
        { id: "fees", label: "Fee Management", icon: "CreditCard" },
        { id: "expenses", label: "Expenses", icon: "Receipt" },
        { id: "payroll", label: "Payroll", icon: "Banknote" },
        { id: "reports", label: "Financial Reports", icon: "BarChart" },
      ],
    },
    {
      id: "communication",
      icon: "MessageSquare",
      label: "Communication",
      hasSubmenu: true,
      submenu: [
        { id: "announcements", label: "Announcements", icon: "Megaphone" },
        { id: "messages", label: "Messages", icon: "Mail" },
        { id: "notifications", label: "Notifications", icon: "Bell" },
        { id: "newsletters", label: "Newsletters", icon: "Newspaper" },
      ],
    },
    {
      id: "library",
      icon: "Library",
      label: "Library",
      hasSubmenu: true,
      submenu: [
        { id: "books", label: "Books", icon: "Book" },
        { id: "issue-return", label: "Issue/Return", icon: "RefreshCw" },
        { id: "library-members", label: "Members", icon: "Users" },
        { id: "library-reports", label: "Library Reports", icon: "FileText" },
      ],
    },
    {
      id: "transport",
      icon: "Bus",
      label: "Transport",
      hasSubmenu: true,
      submenu: [
        { id: "routes", label: "Routes", icon: "Map" },
        { id: "vehicles", label: "Vehicles", icon: "Truck" },
        { id: "drivers", label: "Drivers", icon: "User" },
        { id: "transport-fees", label: "Transport Fees", icon: "CreditCard" },
      ],
    },
    {
      id: "inventory",
      icon: "Package",
      label: "Inventory",
      hasSubmenu: true,
      submenu: [
        { id: "items", label: "Items", icon: "Box" },
        { id: "suppliers", label: "Suppliers", icon: "Truck" },
        { id: "purchase", label: "Purchase Orders", icon: "ShoppingCart" },
        { id: "stock", label: "Stock Management", icon: "Warehouse" },
      ],
    },
    {
      id: "reports",
      icon: "BarChart3",
      label: "Reports",
      hasSubmenu: true,
      submenu: [
        { id: "student-reports", label: "Student Reports", icon: "Users" },
        { id: "teacher-reports", label: "Teacher Reports", icon: "UserCheck" },
        { id: "financial-reports", label: "Financial Reports", icon: "DollarSign" },
        { id: "attendance-reports", label: "Attendance Reports", icon: "Calendar" },
        { id: "academic-reports", label: "Academic Reports", icon: "GraduationCap" },
      ],
    },
    {
      id: "settings",
      icon: "Settings",
      label: "Settings",
      hasSubmenu: true,
      submenu: [
        { id: "school-settings", label: "School Settings", icon: "Building" },
        { id: "user-management", label: "User Management", icon: "Users" },
        { id: "permissions", label: "Permissions", icon: "Shield" },
        { id: "backup", label: "Backup & Restore", icon: "Database" },
        { id: "system-logs", label: "System Logs", icon: "FileText" },
      ],
    }
  ], []); // Empty dependency array since this is static data

  return {
    // UI State
    activeRoute,
    expandedItems,
    actionLoading,
    quickActionsOpen,
    
    // Navigation Actions
    toggleExpanded,
    handleNavigation,
    toggleQuickActions,
    closeQuickActions,
    
    // Entity Actions
    handleAddStudent,
    handleViewStudents,
    handleStudentDetail,
    handleAddTeacher,
    handleViewTeachers,
    handleTeacherDetail,
    handleAddParent,
    handleViewParents,
    handleViewMenu,
    handleAddMenu,
    handleExportStudentData,
    handleExportTeacherData,
    handleMetricClick,
    
    // Configuration
    quickActions,
    sidebarItems,
    
    // Notifications
    notification
  };
}

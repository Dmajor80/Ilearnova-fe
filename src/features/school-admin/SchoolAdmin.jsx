import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  Utensils,
  Home,
  GraduationCap,
  UserSquare,
  FolderOpen,
  Grid3X3,
  BarChart3,
  Puzzle,
  Settings,
  Table,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Bell,
  Moon,
  Maximize,
  MessageSquare,
  Plus,
  User,
  FileUser,
} from "lucide-react";
import { DashboardContent } from "./DashboardContent";
import { StudentListContent } from "./StudentListContent";
import { StudentDetailContent } from "./StudentDetailContent";
import { AddStudentContent } from "./AddStudentContent";
// import { TeacherListContent } from "./TeacherListContent";
import { ParentListContent } from "./ParentListContent";
import { TeacherListContent } from "./TeacherListContent";

const SchoolAdmin = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [activeRoute, setActiveRoute] = useState("dashboard");

  const sidebarItems = [
    {
      id: "Dashboard",
      icon: Home,
      label: "Dashboard",
      hasSubmenu: false,
    },
    {
      id: "Student",
      icon: GraduationCap,
      label: "Student",
      hasSubmenu: true,
      submenu: [
        { id: "Student", label: "Student", icon: User },

        { id: "add-student", label: "Add New Student", icon: Plus },
      ],
    },
    {
      id: "teacher",
      icon: UserSquare,
      label: "Teacher",
      hasSubmenu: true,
      submenu: [
        { id: "teacher-list", label: "Teacher List", icon: Users },

        { id: "add-teacher", label: "Add Teacher", icon: Plus },
      ],
    },
    {
      id: "Parent",
      icon: UserSquare,
      label: "Parent",
      hasSubmenu: true,
      submenu: [
        { id: "parent-list", label: "Parent List", icon: Users },
        { id: "add-parent", label: "Add Parent", icon: Plus },
      ],
    },
    {
      id: "food",
      icon: Utensils,
      label: "Food",
      hasSubmenu: true,
      submenu: [
        { id: "menu", label: "Menu", icon: FileText },
        { id: "orders", label: "Orders", icon: Calendar },
        { id: "add-menu", label: "Add Menu", icon: Plus },
      ],
    },
    {
      id: "file-manager",
      icon: FolderOpen,
      label: "File Manager",
      hasSubmenu: true,
      submenu: [
        { id: "documents", label: "Documents", icon: FileText },
        { id: "media", label: "Media", icon: Grid3X3 },
        { id: "upload", label: "Upload", icon: Plus },
      ],
    },
    {
      id: "apps",
      icon: Grid3X3,
      label: "Apps",
      hasSubmenu: true,
      submenu: [
        { id: "calendar-app", label: "Calendar", icon: Calendar },
        { id: "chat", label: "Chat", icon: MessageSquare },
        { id: "email", label: "Email", icon: Bell },
      ],
    },
    {
      id: "charts",
      icon: BarChart3,
      label: "Charts",
      hasSubmenu: true,
      submenu: [
        { id: "bar-charts", label: "Bar Charts", icon: BarChart3 },
        { id: "line-charts", label: "Line Charts", icon: BarChart3 },
        { id: "pie-charts", label: "Pie Charts", icon: BarChart3 },
      ],
    },
    {
      id: "bootstrap",
      icon: Settings,
      label: "Bootstrap",
      hasSubmenu: true,
      submenu: [
        { id: "components", label: "Components", icon: Puzzle },
        { id: "utilities", label: "Utilities", icon: Settings },
        { id: "forms-bootstrap", label: "Forms", icon: FileText },
      ],
    },
    {
      id: "plugins",
      icon: Puzzle,
      label: "Plugins",
      hasSubmenu: true,
      submenu: [
        { id: "installed", label: "Installed", icon: Settings },
        { id: "available", label: "Available", icon: Grid3X3 },
        { id: "updates", label: "Updates", icon: Bell },
      ],
    },
    {
      id: "widget",
      icon: Settings,
      label: "Widget",
      hasSubmenu: true,
      submenu: [
        { id: "widgets-list", label: "Widget List", icon: Grid3X3 },
        { id: "custom-widgets", label: "Custom Widgets", icon: Puzzle },
        { id: "widget-settings", label: "Settings", icon: Settings },
      ],
    },
    {
      id: "forms",
      icon: FileText,
      label: "Forms",
      hasSubmenu: true,
      submenu: [
        { id: "basic-forms", label: "Basic Forms", icon: FileText },
        { id: "advanced-forms", label: "Advanced Forms", icon: Settings },
        { id: "form-validation", label: "Validation", icon: UserCheck },
      ],
    },
    {
      id: "table",
      icon: Table,
      label: "Table",
      hasSubmenu: true,
      submenu: [
        { id: "basic-table", label: "Basic Table", icon: Table },
        { id: "data-table", label: "Data Table", icon: BarChart3 },
        { id: "responsive-table", label: "Responsive Table", icon: Grid3X3 },
      ],
    },
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleNavigation = (routeId) => {
    setActiveRoute(routeId);
  };

  // Content components for different routes
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
      case "parent-list":
        return <ParentListContent />;
      case "menu":
        return <MenuContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#ebebf5]">
      {/* Sidebar */}
      <div className="sidebar w-64 bg-[#4D44B5] text-white overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center p-6 border-b border-indigo-500">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-semibold">Akademi</span>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {/* Main Menu Item */}
              <div
                className={`flex items-center justify-between px-6 py-3 hover:bg-indigo-500 cursor-pointer transition-colors font-poppins font-semibold ${
                  activeRoute === item.id
                    ? "bg-indigo-500 border-r-4 border-white"
                    : ""
                }`}
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleExpanded(item.id);
                  } else {
                    handleNavigation(item.id);
                  }
                }}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.hasSubmenu &&
                  (expandedItems[item.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))}
              </div>

              {/* Submenu */}
              {item.hasSubmenu && expandedItems[item.id] && (
                <div className="bg-indigo-700">
                  {item.submenu.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`flex items-center px-12 py-2 hover:bg-indigo-600 cursor-pointer transition-colors text-sm ${
                        activeRoute === subItem.id
                          ? "bg-indigo-600 border-r-4 border-white"
                          : ""
                      }`}
                      onClick={() => handleNavigation(subItem.id)}
                    >
                      <subItem.icon className="w-4 h-4 mr-3" />
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="   px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Grid3X3 className="w-10 h-10 text-gray-400 mr-2" />
              <h1 className="text-[#303972] font-semibold text-[30px] capitalize">
                {activeRoute.replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Search className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />

              <Moon className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />
              <Maximize className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />
              <MessageSquare className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />
              <Bell className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />
              <Settings className="w-10 h-10 text-gray-400 cursor-pointer hover:text-gray-600 bg-[white] p-[5px]" />
              <div className="w-10 h-10 bg-orange-500 rounded-full cursor-pointer"></div>
            </div>
          </div>
        </header>

        {/* Content Area (Outlet) */}
        <div className="p-6 overflow-y-auto h-full sidebar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Content Components

const MenuContent = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Food Menu</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Today's Menu</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Breakfast</span>
            <span className="text-gray-600">Pancakes & Juice</span>
          </li>
          <li className="flex justify-between">
            <span>Lunch</span>
            <span className="text-gray-600">Rice & Chicken</span>
          </li>
          <li className="flex justify-between">
            <span>Dinner</span>
            <span className="text-gray-600">Pasta & Salad</span>
          </li>
        </ul>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Weekly Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Meals Served</span>
            <span className="font-semibold">1,247</span>
          </div>
          <div className="flex justify-between">
            <span>Students Fed</span>
            <span className="font-semibold">932</span>
          </div>
          <div className="flex justify-between">
            <span>Satisfaction</span>
            <span className="font-semibold">4.5/5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// const DefaultContent = ({ routeName }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm">
//     <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
//       {routeName.replace("-", " ")}
//     </h2>
//     <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
//       <div className="text-center">
//         <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600">
//           Content for {routeName.replace("-", " ")} will be displayed here.
//         </p>
//       </div>
//     </div>
//   </div>
// );

export default SchoolAdmin;

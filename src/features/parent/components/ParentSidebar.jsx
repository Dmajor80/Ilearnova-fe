import React, { useState } from "react";
import {
  User,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  Award,
  ChevronRight,
  Star,
  ClipboardList,
  TrendingUp,
  BarChart3,
  FileBarChart,
  Menu,
  X,
  Users,
  AlertTriangle,
  CheckCircle,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";

function ParentSidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const routes = {
      dashboard: '/parent-dashboard',
      announcement: '/parent-dashboard',
      attendance: '/parent-attendance',
      grades: '/parent-dashboard',
      messages: '/parent-dashboard',
      fees: '/parent-dashboard',
      timetable: '/parent-dashboard',
      reports: '/parent-dashboard',
    };
    navigate(routes[tabId] || '/parent-dashboard');
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuth();
      navigate("/login");
    }
  };

  // Navigation links data based on available page files
  const navLinks = [
    { id: "dashboard", icon: <ClipboardList size={20} />, label: "Dashboard" },
    { id: "announcement", icon: <Bell size={20} />, label: "Announcements" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "grades", icon: <Star size={20} />, label: "Grades & Results" },
    { id: "messages", icon: <FileText size={20} />, label: "Messages" },
    { id: "fees", icon: <TrendingUp size={20} />, label: "Fees & Payments" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "reports", icon: <BarChart3 size={20} />, label: "Reports" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
            <h2 className={`
              font-bold text-[26px] text-blue-900 text-center ml-[1rem] transition-all duration-300
              ${isMobileMenuOpen ? "block" : "hidden md:block"}
            `}>ILEARNOVA</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`w-full flex items-center px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left rounded-lg transition-colors min-h-[48px] ${
                  activeTab === link.id
                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={link.label}
              >
                {link.icon}
                <span className="text-sm sm:text-base truncate">{link.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default ParentSidebar;

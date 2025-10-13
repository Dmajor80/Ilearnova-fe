import React, { useState, useEffect, useRef } from "react";
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

function ParentHeader({ activeTab, setIsMobileMenuOpen, dashboardData }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

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

  // Navigation links data
  const navLinks = [
    { id: "dashboard", icon: <ClipboardList size={20} />, label: "Dashboard" },
    { id: "children", icon: <Users size={20} />, label: "My Children" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "grades", icon: <Star size={20} />, label: "Grades & Results" },
    { id: "messages", icon: <FileText size={20} />, label: "Messages" },
    { id: "fees", icon: <TrendingUp size={20} />, label: "Fees & Payments" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "reports", icon: <BarChart3 size={20} />, label: "Reports" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 m-4 md:m-6 mb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        <div>
            <p className="text-gray-500 text-sm mb-1">Dashboard / Parent</p>
        </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
            >
              <img
                src={dashboardData?.user?.profile_pic || "/default-profile.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
              />
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {/* Dropdown menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 border border-gray-200">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentHeader;

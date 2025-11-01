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
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 m-4 md:m-6 mb-0 border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 md:hidden border border-slate-200"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <p className="text-slate-500 text-sm mb-2 font-medium">Dashboard / Parent</p>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent capitalize">
              {navLinks.find(link => link.id === activeTab)?.label || 'Parent Dashboard'}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group relative">
            <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group">
            <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-slate-200"
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
            >
              <img
                src={dashboardData?.user?.profile_pic || "/default-profile.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-indigo-500 shadow-md"
              />
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
            {/* Dropdown menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 z-20 border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg mx-2"
                >
                  <User className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-medium">Edit Profile</span>
                </button>
                <div className="border-t border-slate-200 my-2"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
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

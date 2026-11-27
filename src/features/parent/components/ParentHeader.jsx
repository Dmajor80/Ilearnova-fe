import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Menu,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";
import { tabOf } from "@/components/navigation/navGroups";
import { PARENT_GROUPS } from "../parentNav";

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


  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 m-4 md:m-6 mb-0 border border-slate-200">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-6">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="shrink-0 inline-flex min-h-10 min-w-10 items-center justify-center p-2 md:p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 md:hidden border border-slate-200"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-slate-500 text-xs md:text-sm mb-1 md:mb-2 font-medium">Dashboard / Parent</p>
            <h1 className="truncate text-xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent capitalize">
              {tabOf(PARENT_GROUPS, activeTab)?.label || 'Parent Dashboard'}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <button type="button" aria-label="Notifications" className="inline-flex min-h-10 min-w-10 items-center justify-center p-2 md:p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group relative">
            <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button type="button" aria-label="Settings" onClick={() => navigate("/profile")} className="hidden sm:inline-flex min-h-10 min-w-10 items-center justify-center p-2 md:p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group">
            <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex min-h-10 items-center gap-1 md:gap-3 p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-slate-200"
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
            >
              {dashboardData?.user?.profile_pic ? (
                <img
                  src={dashboardData.user.profile_pic}
                  alt="Profile"
                  className="h-8 w-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-blue-500 shadow-md"
                />
              ) : (
                <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 border-blue-500 text-blue-600">
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Profile</span>
                </span>
              )}
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

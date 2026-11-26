import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  MessageCircle,
  FileText,
  ClipboardCheck,
  Award,
  LayoutDashboard,
  CreditCard,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import SectionTabs from "@/components/navigation/SectionTabs";
import { groupOf, tabOf } from "@/components/navigation/navGroups";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";

const BASE = "/student-dashboard/";

/** Sidebar groups; pages in a group are tabs of one another. */
const STUDENT_GROUPS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, tabs: [{ id: "overview", label: "Overview" }] },
  { id: "courses", label: "Courses", icon: BookOpen, tabs: [{ id: "courses", label: "Courses" }] },
  {
    id: "classwork",
    label: "Classwork",
    icon: FileText,
    tabs: [
      { id: "assignment", label: "Assignments" },
      { id: "timetable", label: "Timetable" },
      { id: "attendance", label: "Attendance" },
    ],
  },
  {
    id: "exams",
    label: "Exams",
    icon: ClipboardCheck,
    tabs: [
      { id: "exam", label: "Exams" },
      { id: "cbt", label: "CBT exams" },
    ],
  },
  {
    id: "results",
    label: "Results",
    icon: Award,
    tabs: [
      { id: "result", label: "Report cards" },
      { id: "transcript", label: "Online exam scores" },
    ],
  },
  { id: "fees", label: "Fees", icon: CreditCard, tabs: [{ id: "fees", label: "Fees" }] },
  { id: "messages", label: "Messages", icon: MessageCircle, tabs: [{ id: "messages", label: "Messages" }] },
];

// Main application component
export default function StudentDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


  const activeTab = location.pathname.startsWith(BASE)
    ? location.pathname.slice(BASE.length).split("/")[0] || "overview"
    : "overview";
  const activeGroup = groupOf(STUDENT_GROUPS, activeTab);
  const closeOnMobile = () => {
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

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
      // Even if API call fails, clear local auth and redirect
      clearAuth();
      navigate("/login");
    }
  };

  // Mock course data

  // side bar
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white/10 z-40 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-all duration-300 ease-in-out md:translate-x-0 border-r border-slate-200 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 md:p-6 bg-gradient-to-b from-white via-slate-50 to-blue-50 h-full">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <h2 className={`
                font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300
                ${isMobileMenuOpen ? "block" : "hidden md:block"}
              `}>LEARNOVA</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-slate-50 border border-slate-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <nav className="space-y-1">
            {STUDENT_GROUPS.map((g) => ({ ...g, to: g.tabs[0].id, active: activeGroup?.id === g.id })).map((link) => {
              const Icon = link.icon;
              return (
                <div key={link.id} className="relative group">
                  <Link
                    to={link.to}
                    onClick={closeOnMobile}
                    aria-current={link.active ? "page" : undefined}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 min-h-[48px] group ${
                      link.active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02] border border-blue-500"
                        : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md border border-transparent hover:border-blue-200"
                    }`}
                    title={link.label}
                  >
                    <span className={`mr-4 flex-shrink-0 transition-colors duration-200 ${
                      link.active ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                    }`}><Icon size={20} /></span>
                    <span className={`
                      transition-all duration-300 font-medium
                      ${isMobileMenuOpen ? "block" : "hidden md:block"}
                    `}>
                      {link.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64 min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 m-4 md:m-6 mb-0 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 md:hidden border border-slate-200"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-slate-500 text-sm mb-2 font-medium">Dashboard / Student</p>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent capitalize">
                  {tabOf(STUDENT_GROUPS, activeTab)?.label}
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
                  {/* {
                    user.profile_pic?
                    <img
                    src={user.profile_pic || "/default-profile.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-indigo-500 shadow-md"
                  />:
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 shadow-md" aria-label="Profile">
                    <User className="h-5 w-5" />
                  </span>
                  } */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 shadow-md" aria-label="Profile">
                    <User className="h-5 w-5" />
                  </span>
                  
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

        <main className="flex-1 m-4 md:m-6 mt-0 p-6 md:p-8">
          <SectionTabs group={activeGroup} activeId={activeTab} onSelect={(id) => navigate(`${BASE}${id}`)} className="mb-6" />
          <Outlet /> {/* Display nested routes */}
        </main>
      </div>
      {/* Main content area */}
    </div>
  );
  // end of side bar
}

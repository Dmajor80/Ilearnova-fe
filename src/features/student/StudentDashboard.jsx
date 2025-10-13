import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  Clock,
  Award,
  ChevronRight,
  LayoutDashboard,
  CreditCard,
  Menu,
  X,
  Users,
  Video,
  Bell,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";

// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock dashboard data - replace with actual API call
  const [dashboardData, setDashboardData] = useState({
    user: {
      profile_pic: "/default-profile.png"
    }
  });

  // Navigation links data
  const navLinks = [
    {
      id: "overview",
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
      air: "overview",
    },
    {
      id: "courses",
      icon: <BookOpen size={20} />,
      label: "Courses",
      air: "courses",
    },
    {
      id: "id card",
      icon: <CreditCard size={20} />,
      label: "ID Card",
      air: "IDcard",
    },
    {
      id: "attendance",
      icon: <Calendar size={20} />,
      label: "Attendance",
      air: "attendance",
    },
    // {
    //   id: "assignments",
    //   icon: <FileText size={20} />,
    //   label: "Assignments",
    //   air: "assignment",
    // },

    {
      id: "timetable",
      icon: <Clock size={20} />,
      label: "Timetable",
      air: "timetable",
    },
    {
      id: "transcript",
      icon: <Award size={20} />,
      label: "Transcript",
      air: "transcript",
    },
    {
      id: "result",
      icon: <BookOpen size={20} />,
      label: "Result",
      air: "result",
    },
    {
      id: "exam",
      icon: <BookOpen size={20} />,
      label: "Exam",
      air: "exam",
    },
    {
      id: "forums",
      icon: <MessageCircle size={20} />,
      label: "Forums",
      air: "/forums",
      external: true,
    },
    {
      id: "video-calls",
      icon: <Video size={20} />,
      label: "Video Calls",
      air: "/video-calls",
      external: true,
    },
  ];

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
                onClick={() => {
                  setActiveTab(link.id);
                  if (window.innerWidth < 768) {
                    setIsMobileMenuOpen(false); // Close sidebar on mobile after selection
                  }
                }}
                className={`w-full flex items-center px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left rounded-lg transition-colors min-h-[48px] ${
                  activeTab === link.id
                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={link.label}
              >
                <span className="mr-3 flex-shrink-0">{link.icon}</span>
                <Link
                  to={link.air}
                  className={`
                  transition-all duration-300
                  ${isMobileMenuOpen ? "block" : "hidden md:block"}
                `}
                >
                  <span>{link.label}</span>
                </Link>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64 min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 m-4 md:m-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow md:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <p className="text-gray-500 text-sm mb-1">Dashboard / Student</p>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
                  {navLinks.find(link => link.id === activeTab)?.label}
                </h1>
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

        <main className="flex-1">
          <Outlet /> {/* Display nested routes */}
        </main>
      </div>
      {/* Main content area */}
    </div>
  );
  // end of side bar
}

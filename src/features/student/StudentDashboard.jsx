import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  ClipboardCheck,
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

import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";

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
  {
    id: "assignments",
    icon: <FileText size={20} />,
    label: "Assignments",
    air: "assignment",
  },
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
    id: "cbt",
    icon: <ClipboardCheck size={20} />,
    label: "CBT Exams",
    air: "cbt",
  },
  {
    id: "messages",
    icon: <MessageCircle size={20} />,
    label: "Messages",
    air: "messages",
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

// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


  // Mock dashboard data - replace with actual API call
  // const [dashboardData, setDashboardData] = useState({
  //   user: {
  //     profile_pic: "/default-profile.png"
  //   }
  // });

  // Sync activeTab with current route
  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const matchingLink = navLinks.find(link => link.air === currentPath);
    if (matchingLink) {
      setActiveTab(matchingLink.id);
    }
  }, [location.pathname]);

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
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
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
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                <Link
                  to={link.air}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (window.innerWidth < 768) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 min-h-[48px] group ${
                    activeTab === link.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02] border border-blue-500"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md border border-transparent hover:border-blue-200"
                  }`}
                  title={link.label}
                >
                  <span className={`mr-4 flex-shrink-0 transition-colors duration-200 ${
                    activeTab === link.id ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                  }`}>{link.icon}</span>
                  <span className={`
                    transition-all duration-300 font-medium
                    ${isMobileMenuOpen ? "block" : "hidden md:block"}
                  `}>
                    {link.label}
                  </span>
                </Link>

                {/* Tooltip for collapsed state */}
                <div
                  className={`
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-3
                  bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg
                  opacity-0 pointer-events-none transition-opacity duration-200 z-50
                  group-hover:opacity-100
                  ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
                `}
                >
                  {link.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-900"></div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64 min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 m-4 md:m-6 mb-0 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 md:hidden border border-slate-200"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-slate-500 text-sm mb-2 font-medium">Dashboard / Student</p>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent capitalize">
                  {navLinks.find(link => link.id === activeTab)?.label}
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
          <Outlet /> {/* Display nested routes */}
        </main>
      </div>
      {/* Main content area */}
    </div>
  );
  // end of side bar
}

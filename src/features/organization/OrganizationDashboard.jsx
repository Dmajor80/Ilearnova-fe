import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import ClassPerformanceOverview from "@/components/dashboard/ClassPerformanceOverview";
import ClassRosters from "@/components/dashboard/ClassRosters";
import Profile from "../auth/Profile";
import { getEnhancedOrganizationDashboard } from "@/api/dashboardApi";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";
import {
  Bell,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Clock,
  Search,
  User,
  Users,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Settings,
  LineChart,
  BarChart2,
  Percent,
  ChevronRight,
  Home,
  BookOpen,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  GraduationCap,
  Building,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const chartRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getEnhancedOrganizationDashboard();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch organization dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const timer = setTimeout(() => {
        // Animate progress to attendance percentage
        let startProgress = 0;
        const targetProgress = dashboardData.attendance_stats?.percentage || 0;
        const interval = setInterval(() => {
          if (startProgress >= targetProgress) {
            clearInterval(interval);
          } else {
            startProgress += 1;
            setProgress(startProgress);
          }
        }, 20);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [dashboardData]);

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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: UserCheck },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "features", label: "Features", icon: Settings },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "profile", label: "Profile", icon: User },
  ];

  const fadeInUp = (delay) => {
    return {
      animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: "translateY(20px)",
    };
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_students || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="lg:text-[14px] font-medium">Total Students</p>
              </div>

              <div
                className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_teachers || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="lg:text-[14px] font-medium">Total Teachers</p>
              </div>

              <div
                className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_classes || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="lg:text-[14px] font-medium">Total Classes</p>
              </div>

              <div
                className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_subjects || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="lg:text-[14px] font-medium">Total Subjects</p>
              </div>
            </div>

            <ClassPerformanceOverview classPerformance={dashboardData?.class_performance || []} />
            <ClassRosters classRosters={dashboardData?.class_rosters || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <RecentActivityFeed activities={dashboardData?.recent_activity || []} />
              <StudentAlertsPanel alerts={dashboardData?.system_alerts || []} />
            </div>

            <div className="mt-6">
              <QuickActionsGrid actions={dashboardData?.quick_actions || []} />
            </div>
          </>
        );

      case "students":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Student Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Active Students</h4>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.quick_stats?.total_students || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium">New Enrollments</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.new_enrollments || 0}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium">At Risk Students</h4>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData?.at_risk_students || 0}</p>
              </div>
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Teacher Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Active Teachers</h4>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.quick_stats?.total_teachers || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium">New Hires</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.new_teachers || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium">Average Rating</h4>
                <p className="text-2xl font-bold text-purple-600">{dashboardData?.teacher_avg_rating || 0}</p>
              </div>
            </div>
          </div>
        );

      case "classes":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Class Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Total Classes</h4>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.quick_stats?.total_classes || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium">Active Classes</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.active_classes || 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium">Average Class Size</h4>
                <p className="text-2xl font-bold text-orange-600">{dashboardData?.avg_class_size || 0}</p>
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Performance Trends</h4>
                <div className="h-32 bg-white rounded p-2">
                  <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Attendance Overview</h4>
                <div className="h-32 bg-white rounded p-2">
                  <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Reports & Documents</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monthly Performance Report</h4>
                    <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Student Enrollment Report</h4>
                    <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case "alerts":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">System Alerts</h3>
            <StudentAlertsPanel alerts={dashboardData?.system_alerts || []} />
          </div>
        );

      case "profile":
        return <Profile />;

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{dashboardData?.organization?.name || 'Organization'} Dashboard</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 m-6 mb-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Dashboard / Organization</p>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
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

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && dashboardData && (
            <div className="space-y-6">
              {renderContent()}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes growHeight {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizationDashboard;

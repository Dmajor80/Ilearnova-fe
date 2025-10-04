import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import { getParentDashboard, getEnhancedParentDashboard } from "@/api/dashboardApi";

// Main application component
export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    // Get parent ID from user data
    const getParentId = () => {
      try {
        const raw = localStorage.getItem("user_data") ||
                    sessionStorage.getItem("user_data");
        const user = raw ? JSON.parse(raw) : null;
        return user?.id;
      } catch {
        return null;
      }
    };

    const id = getParentId();
    setParentId(id);

    async function fetchDashboard() {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getEnhancedParentDashboard(id);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch enhanced parent dashboard:", error);
        // Fallback to basic dashboard
        try {
          const basicResponse = await getParentDashboard(id);
          setDashboardData(basicResponse.data);
        } catch (basicError) {
          console.error("Failed to fetch basic parent dashboard:", basicError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

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
  ];

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

      <aside>
        {/* Sidebar */}
        <div
          className={`
          w-16 md:w-48 h-[100%] bg-white border-r border-gray-200 pt-4
          fixed md:static inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "w-48" : "w-16"}
        `}
        >
          <div className="px-4 pb-6 border-b border-gray-200 relative">
            <h1
              className={`
              font-bold text-[26px] text-blue-900 text-center ml-[-1rem] transition-all duration-300
              ${isMobileMenuOpen ? "block" : "hidden md:block"}
            `}
            >
              ILEARNOVA
            </h1>
            <div
              className={`
              font-bold text-blue-900 text-center transition-all duration-300
              ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
            `}
            >
              <span className="text-xl text-white">IL</span>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="absolute top-0 right-4 md:hidden p-1 text-blue-900 hover:bg-blue-50 rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="mt-4">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                <button
                  className={`flex items-center px-4 py-3 w-full text-left transition-all duration-200 ${
                    activeTab === link.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="mr-3 flex-shrink-0">{link.icon}</span>
                  <span
                    className={`
                    transition-all duration-300
                    ${isMobileMenuOpen ? "block" : "hidden md:block"}
                  `}
                  >
                    {link.label}
                  </span>
                </button>

                {/* Tooltip for mobile/collapsed state */}
                <div
                  className={`
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                  bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap
                  opacity-0 pointer-events-none transition-opacity duration-200
                  group-hover:opacity-100 z-50
                  ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
                `}
                >
                  {link.label}
                  <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1
                                 border-4 border-transparent border-r-gray-800"
                  ></div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <div className="ml-16 md:ml-0 flex-1 p-4">
        {loading && <p>Loading dashboard data...</p>}
        {!loading && activeTab === "dashboard" && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <QuickStatsCard
                title="My Children"
                value={dashboardData.quick_stats?.children_count || 0}
                icon="users"
                color="blue"
              />
              <QuickStatsCard
                title="Attendance Rate"
                value={`${dashboardData.quick_stats?.attendance_rate || 0}%`}
                icon="calendar"
                color="green"
              />
              <QuickStatsCard
                title="Pending Fees"
                value={`₦${dashboardData.quick_stats?.pending_fees || 0}`}
                icon="alert"
                color="red"
              />
              <QuickStatsCard
                title="Unread Messages"
                value={dashboardData.quick_stats?.unread_messages || 0}
                icon="check"
                color="yellow"
              />
              <QuickStatsCard
                title="Upcoming Events"
                value={dashboardData.quick_stats?.upcoming_events || 0}
                icon="calendar"
                color="purple"
              />
              <QuickStatsCard
                title="Average Grade"
                value={dashboardData.quick_stats?.average_grade || "N/A"}
                icon="book"
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <RecentActivityFeed activities={dashboardData.recent_activity || []} />
              <StudentAlertsPanel alerts={dashboardData.student_alerts || []} />
            </div>

            <div className="mt-6">
              <QuickActionsGrid actions={dashboardData.quick_actions || []} />
            </div>
          </>
        )}

        {activeTab === "children" && <ChildrenComponent />}
        {activeTab === "attendance" && <AttendanceComponent />}
        {activeTab === "grades" && <GradesComponent />}
        {activeTab === "messages" && <MessagesComponent />}
        {activeTab === "fees" && <FeesComponent />}
        {activeTab === "timetable" && <TimetableComponent />}
        {activeTab === "reports" && <ReportsComponent />}
      </div>
    </div>
  );
}

// Placeholder components for other tabs
function ChildrenComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Children</h2>
      <p className="text-gray-600">View and manage your children's information.</p>
    </div>
  );
}

function AttendanceComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
      <p className="text-gray-600">Monitor your children's attendance.</p>
    </div>
  );
}

function GradesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Grades & Results</h2>
      <p className="text-gray-600">View your children's academic performance.</p>
    </div>
  );
}

function MessagesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <p className="text-gray-600">Communicate with teachers and school staff.</p>
    </div>
  );
}

function FeesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Fees & Payments</h2>
      <p className="text-gray-600">Manage school fees and payments.</p>
    </div>
  );
}

function TimetableComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Timetable</h2>
      <p className="text-gray-600">View class schedules and events.</p>
    </div>
  );
}

function ReportsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reports</h2>
      <p className="text-gray-600">Access detailed reports and analytics.</p>
    </div>
  );
}

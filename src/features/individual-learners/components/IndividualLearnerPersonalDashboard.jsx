import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  Award,
  TrendingUp,
  BarChart3,
  Menu,
  X,
  Target,
  Trophy,
  Book,
  CheckCircle,
} from "lucide-react";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import { getIndividualLearnerDashboard } from "@/api/dashboardApi";

// Main application component
export default function IndividualLearnerPersonalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const response = await getIndividualLearnerDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch individual learner dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // Navigation links data
  const navLinks = [
    { id: "dashboard", icon: <BarChart3 size={20} />, label: "Dashboard" },
    { id: "courses", icon: <BookOpen size={20} />, label: "My Courses" },
    { id: "progress", icon: <TrendingUp size={20} />, label: "Progress" },
    { id: "achievements", icon: <Trophy size={20} />, label: "Achievements" },
    { id: "schedule", icon: <Calendar size={20} />, label: "Schedule" },
    { id: "resources", icon: <Book size={20} />, label: "Resources" },
    { id: "goals", icon: <Target size={20} />, label: "Goals" },
    { id: "reports", icon: <FileText size={20} />, label: "Reports" },
  ];

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
                title="Courses Enrolled"
                value={dashboardData.quick_stats?.courses_enrolled || 0}
                icon="book"
                color="blue"
              />
              <QuickStatsCard
                title="Completed Courses"
                value={dashboardData.quick_stats?.courses_completed || 0}
                icon="check"
                color="green"
              />
              <QuickStatsCard
                title="Current Progress"
                value={`${dashboardData.quick_stats?.overall_progress || 0}%`}
                icon="trending"
                color="purple"
              />
              <QuickStatsCard
                title="Achievements"
                value={dashboardData.quick_stats?.achievements || 0}
                icon="award"
                color="yellow"
              />
              <QuickStatsCard
                title="Study Hours"
                value={`${dashboardData.quick_stats?.study_hours || 0}h`}
                icon="clock"
                color="blue"
              />
              <QuickStatsCard
                title="Upcoming Deadlines"
                value={dashboardData.quick_stats?.upcoming_deadlines || 0}
                icon="calendar"
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <RecentActivityFeed activities={dashboardData.recent_activity || []} />
              <StudentAlertsPanel alerts={dashboardData.learning_alerts || []} />
            </div>

            <div className="mt-6">
              <QuickActionsGrid actions={dashboardData.quick_actions || []} />
            </div>
          </>
        )}

        {activeTab === "courses" && <CoursesComponent />}
        {activeTab === "progress" && <ProgressComponent />}
        {activeTab === "achievements" && <AchievementsComponent />}
        {activeTab === "schedule" && <ScheduleComponent />}
        {activeTab === "resources" && <ResourcesComponent />}
        {activeTab === "goals" && <GoalsComponent />}
        {activeTab === "reports" && <ReportsComponent />}
      </div>
    </div>
  );
}

// Placeholder components for other tabs
function CoursesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Courses</h2>
      <p className="text-gray-600">View and manage your enrolled courses.</p>
    </div>
  );
}

function ProgressComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
      <p className="text-gray-600">Track your progress across all courses.</p>
    </div>
  );
}

function AchievementsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <p className="text-gray-600">View your badges and certificates.</p>
    </div>
  );
}

function ScheduleComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Study Schedule</h2>
      <p className="text-gray-600">Manage your learning schedule and deadlines.</p>
    </div>
  );
}

function ResourcesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Learning Resources</h2>
      <p className="text-gray-600">Access study materials and resources.</p>
    </div>
  );
}

function GoalsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Learning Goals</h2>
      <p className="text-gray-600">Set and track your learning objectives.</p>
    </div>
  );
}

function ReportsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Progress Reports</h2>
      <p className="text-gray-600">View detailed analytics and reports.</p>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  BookOpen,
  MessageCircle,
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
  User,
} from "lucide-react";
import Profile from "../auth/Profile";
import Messages from "./Messages";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import Grade from "./Grade";
import Timetable from "./Timetable";
import Resources from "./Resources";
import CoursesComponent from "./components/CourseComponents";
import AttendancePage from "./AttendancePage";
import ClassManagement from "./ClassManagement";
import LearningAnalytics from "../analytics/components/LearningAnalytics";
import TranscriptViewer from "../analytics/components/TranscriptViewer";

import QuickStatsCard from "../../components/dashboard/QuickStatsCard";
import RecentActivityFeed from "../../components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "../../components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "../../components/dashboard/QuickActionsGrid";
import ClassPerformanceOverview from "../../components/dashboard/ClassPerformanceOverview";
import ClassRosters from "../../components/dashboard/ClassRosters";

import { getEnhancedTeacherDashboard } from "../../api/dashboardApi";


// Main application component
export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const response = await getEnhancedTeacherDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch enhanced teacher dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Navigation links data
  const navLinks = [
    { id: "dashboard", icon: <ClipboardList size={20} />, label: "Dashboard" },
    { id: "courses", icon: <ClipboardList size={20} />, label: "Class management" },
    { id: "messages", icon: <MessageCircle size={20} />, label: "Messages" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "attendancePage", icon: <Calendar size={20} />, label: "Attendance Page" },
    { id: "assignments", icon: <TrendingUp size={20} />, label: "Assignments" },
    { id: "resources", icon: <BookOpen size={20} />, label: "Resources" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "grade", icon: <Star size={20} />, label: "Grade" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { id: "transcripts", icon: <FileBarChart size={20} />, label: "Transcripts" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
  ];

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
                title="Total Students"
                value={dashboardData.quick_stats.total_students}
                icon="users"
                color="blue"
              />
              <QuickStatsCard
                title="Total Classes"
                value={dashboardData.quick_stats.total_classes}
                icon="book"
                color="green"
              />
              <QuickStatsCard
                title="Today Attendance"
                value={dashboardData.quick_stats.today_attendance}
                icon="calendar"
                color="yellow"
              />
              <QuickStatsCard
                title="Graded Today"
                value={dashboardData.quick_stats.graded_today}
                icon="check"
                color="purple"
              />
              <QuickStatsCard
                title="Pending Submissions"
                value={dashboardData.quick_stats.pending_submissions}
                icon="alert"
                color="red"
              />
              <QuickStatsCard
                title="Upcoming Exams"
                value={dashboardData.quick_stats.upcoming_exams}
                icon="calendar"
                color="blue"
              />
            </div>

            <ClassPerformanceOverview
              classPerformance={dashboardData.class_performance}
            />

            <ClassRosters classRosters={dashboardData.class_rosters} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <RecentActivityFeed activities={dashboardData.recent_activity} />
              <StudentAlertsPanel alerts={dashboardData.student_alerts} />
            </div>

            <div className="mt-6">
              <QuickActionsGrid actions={dashboardData.quick_actions} />
            </div>
          </>
        )}

        {activeTab === "messages" && <MessagesComponent />}
        {activeTab === "courses" && <ClassManagementComponent />}
        {activeTab === "attendance" && <AttendanceComponent />}
        {activeTab === "attendancePage" && <AttendancePageComponent />}
        {activeTab === "assignments" && <AssignmentsComponent />}
        {activeTab === "timetable" && <TimetableComponent />}
        {activeTab === "grade" && <GradeComponent />}
        {activeTab === "resources" && <ResourcesComponent />}
        {activeTab === "analytics" && <AnalyticsComponent />}
        {activeTab === "transcripts" && <TranscriptsComponent />}
        {activeTab === "profile" && <ProfileComponent />}
      </div>
    </div>
  );
  // end of side bar
}


function ClassManagementComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <ClassManagement />
    </div>
  );
}







// Placeholder components for other tabs
function MessagesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Messages />
    </div>
  );
}

function AttendanceComponent() {
  return (
    <div className="p-4 bg-white rounded shadow" >
      <Attendance />
    </div>
  );
}


function AttendancePageComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <AttendancePage />
    </div>
  );
}

function ResourcesComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Resources />
    </div>
  );
}




function AssignmentsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Assignments />
    </div>
  );
}

function TimetableComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Timetable />
    </div>
  );
}

function GradeComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Grade />
    </div>
  );
}

function AnalyticsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <LearningAnalytics />
    </div>
  );
}

function TranscriptsComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <TranscriptViewer />
    </div>
  );
}

function ProfileComponent() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <Profile />
    </div>
  );
}

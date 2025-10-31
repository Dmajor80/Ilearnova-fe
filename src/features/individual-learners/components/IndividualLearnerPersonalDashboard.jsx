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
import Profile from "../../auth/Profile";
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
    { id: "profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside>
        {/* Sidebar */}
        <div
          className={`
          w-16 md:w-56 h-full bg-white border-r border-slate-200 pt-6 shadow-xl
          fixed md:static inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "w-56" : "w-16"}
          bg-gradient-to-b from-white via-slate-50 to-blue-50
        `}
        >
          <div className="px-4 pb-8 border-b border-slate-200 relative">
            <h1
              className={`
              font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center transition-all duration-300
              ${isMobileMenuOpen ? "block" : "hidden md:block"}
            `}
            >
              ILEARNOVA
            </h1>
            <div
              className={`
              font-bold text-blue-600 text-center transition-all duration-300
              ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
            `}
            >
              <span className="text-lg">IL</span>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="absolute top-4 right-4 md:hidden p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="mt-6 px-2">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group mb-2">
                <button
                  className={`flex items-center px-4 py-3 w-full text-left transition-all duration-200 rounded-lg ${
                    activeTab === link.id
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg"
                      : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="mr-4 flex-shrink-0">{link.icon}</span>
                  <span
                    className={`
                    transition-all duration-300 font-medium
                    ${isMobileMenuOpen ? "block" : "hidden md:block"}
                  `}
                  >
                    {link.label}
                  </span>
                </button>

                {/* Tooltip for mobile/collapsed state */}
                <div
                  className={`
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-3
                  bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg
                  opacity-0 pointer-events-none transition-opacity duration-200
                  group-hover:opacity-100 z-50
                  ${isMobileMenuOpen ? "hidden" : "block md:hidden"}
                `}
                >
                  {link.label}
                  <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1
                                 border-4 border-transparent border-r-slate-900"
                  ></div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <div className="ml-16 md:ml-0 flex-1 p-8">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {!loading && activeTab === "dashboard" && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <RecentActivityFeed activities={dashboardData.recent_activity || []} />
              <StudentAlertsPanel alerts={dashboardData.learning_alerts || []} />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
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
        {activeTab === "profile" && <Profile />}
      </div>
    </div>
  );
}

// Enhanced placeholder components for other tabs with professional styling
function CoursesComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
      </div>
      <p className="text-slate-600 mb-6">View and manage your enrolled courses with detailed progress tracking.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((course) => (
          <div key={course} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Course {course}</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">In Progress</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">Advanced learning module with interactive content.</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-slate-500">60% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-8 h-8 text-indigo-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Learning Progress</h2>
      </div>
      <p className="text-slate-600 mb-6">Track your progress across all courses with detailed analytics.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Overall Progress</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="2"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="75, 100"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">75%</span>
            </div>
          </div>
          <p className="text-center text-slate-600">Overall Completion</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-slate-900">Mathematics</span>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">85%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-indigo-600 mr-3" />
              <span className="font-medium text-slate-900">Science</span>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">60%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-slate-900">History</span>
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementsComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
      </div>
      <p className="text-slate-600 mb-6">View your badges, certificates, and learning milestones.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((achievement) => (
          <div key={achievement} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 text-center border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Achievement {achievement}</h3>
            <p className="text-sm text-slate-600">Completed advanced module with excellence.</p>
            <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Earned on Dec {achievement}, 2023</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <Calendar className="w-8 h-8 text-red-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Study Schedule</h2>
      </div>
      <p className="text-slate-600 mb-6">Manage your learning schedule and upcoming deadlines.</p>
      <div className="space-y-4">
        {[
          { time: "9:00 AM", title: "Mathematics Quiz", type: "Quiz", color: "bg-blue-100 text-blue-800" },
          { time: "2:00 PM", title: "Science Lab Report", type: "Assignment", color: "bg-green-100 text-green-800" },
          { time: "4:30 PM", title: "History Presentation", type: "Presentation", color: "bg-indigo-100 text-indigo-800" },
          { time: "6:00 PM", title: "Study Session", type: "Study", color: "bg-orange-100 text-orange-800" }
        ].map((item, index) => (
          <div key={index} className="flex items-center p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.time} • Today</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <Book className="w-8 h-8 text-indigo-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Learning Resources</h2>
      </div>
      <p className="text-slate-600 mb-6">Access study materials, videos, and learning resources.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: "Video Lectures", count: 24, icon: <BookOpen className="w-6 h-6" />, color: "from-blue-500 to-blue-600" },
          { title: "Practice Tests", count: 12, icon: <FileText className="w-6 h-6" />, color: "from-green-500 to-green-600" },
          { title: "Study Guides", count: 8, icon: <Book className="w-6 h-6" />, color: "from-indigo-500 to-indigo-600" },
          { title: "Interactive Quizzes", count: 16, icon: <Target className="w-6 h-6" />, color: "from-orange-500 to-orange-600" }
        ].map((resource, index) => (
          <div key={index} className={`bg-gradient-to-r ${resource.color} rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center`}>
                {resource.icon}
              </div>
              <span className="text-2xl font-bold">{resource.count}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
            <p className="text-white text-opacity-90 text-sm">Available resources</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <Target className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Learning Goals</h2>
      </div>
      <p className="text-slate-600 mb-6">Set and track your learning objectives and milestones.</p>
      <div className="space-y-6">
        {[
          { goal: "Complete Mathematics Course", progress: 85, deadline: "Dec 31, 2023", status: "On Track" },
          { goal: "Master Science Concepts", progress: 60, deadline: "Jan 15, 2024", status: "In Progress" },
          { goal: "Improve Study Habits", progress: 90, deadline: "Dec 25, 2023", status: "Excellent" }
        ].map((goal, index) => (
          <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{goal.goal}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                goal.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                goal.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {goal.status}
              </span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300`} style={{ width: `${goal.progress}%` }}></div>
              </div>
            </div>
            <p className="text-sm text-slate-600">Deadline: {goal.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsComponent() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center mb-6">
        <FileText className="w-8 h-8 text-slate-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Progress Reports</h2>
      </div>
      <p className="text-slate-600 mb-6">View detailed analytics and performance reports.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Average Score</span>
              <span className="font-semibold text-green-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Courses Completed</span>
              <span className="font-semibold text-blue-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Study Hours</span>
              <span className="font-semibold text-indigo-600">42h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Achievements</span>
              <span className="font-semibold text-yellow-600">5</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {[
              { title: "November Progress Report", date: "Dec 1, 2023", status: "Available" },
              { title: "Mathematics Assessment", date: "Nov 28, 2023", status: "Available" },
              { title: "Science Project Review", date: "Nov 25, 2023", status: "Available" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">{report.title}</h4>
                  <p className="text-xs text-slate-600">{report.date}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

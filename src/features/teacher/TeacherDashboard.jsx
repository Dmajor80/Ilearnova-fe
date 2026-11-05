import { useState, useEffect, useRef } from "react";
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
  ClipboardCheck,
  TrendingUp,
  BarChart3,
  FileBarChart,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/authApi";
import { clearAuth } from "../../api/auth";

import Messages from "./Messages";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import Examinations from "./Examinations";
import TeacherCbt from "../cbt/TeacherCbt";
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

import {
  useTeacherAssignments,
  useTeacherClasses,
  useTeacherExaminations,
  useTeacherStudents
} from "@/hooks/teacher";

// Main application component
export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const classesApi = useTeacherClasses();
  const studentsApi = useTeacherStudents();
  const assignmentsApi = useTeacherAssignments();
  const examinationsApi = useTeacherExaminations();
  const loading = classesApi.loading || studentsApi.loading || assignmentsApi.loading || examinationsApi.loading;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // Navigation links data
  const navLinks = [
    { id: "dashboard", icon: <ClipboardList size={20} />, label: "Dashboard" },
    { id: "courses", icon: <ClipboardList size={20} />, label: "Class management" },
    { id: "messages", icon: <MessageCircle size={20} />, label: "Messages" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "attendancePage", icon: <Calendar size={20} />, label: "Attendance Page" },
    { id: "assignments", icon: <TrendingUp size={20} />, label: "Assignments" },
    { id: "examinations", icon: <FileText size={20} />, label: "Examinations" },
    { id: "cbt", icon: <ClipboardCheck size={20} />, label: "CBT Exams" },
    { id: "resources", icon: <BookOpen size={20} />, label: "Resources" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "grade", icon: <Star size={20} />, label: "Grade" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { id: "transcripts", icon: <FileBarChart size={20} />, label: "Transcripts" },

  ];

  // Mock course data

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
    }
  };

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
           h-dvh bg-white border-r border-gray-200 pt-4
          fixed inset-y-0 left-0 z-50 overflow-y-auto overflow-x-hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "w-48" : "w-18"}
          md:w-48
        `}
        >
          <div className="px-4 flex justify-center items-center pb-6 border-b border-gray-200 ">
            <h1
              className={`
              font-bold md:text-[26px] text-blue-900 text-center transition-all duration-300
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
              className=" top-0 right-4 md:hidden p-1 text-blue-900 hover:bg-blue-50 rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="">
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
      <div className={` flex-1 p-4 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "ml-48" : "ml-18"}
        md:ml-48`}>
          
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div>
                <p className="text-slate-500 text-sm mb-2 font-medium">Dashboard / Teacher</p>
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
                    user.profile_pic !== null ?
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

        {loading && <p>Loading dashboard data...</p>}
        {!loading && activeTab === "dashboard" && (
          <>
            {[classesApi, studentsApi, assignmentsApi, examinationsApi].some((api) => api.error) && (
              <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                Some dashboard data could not be loaded. Check the relevant section and retry.
              </p>
            )}
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <QuickStatsCard
                title="Total Students"
                value={studentsApi.students.length}
                icon="users"
                color="blue"
                trend="+12%"
                trendUp={true}
              />
              <QuickStatsCard
                title="Active Classes"
                value={classesApi.classes.length}
                icon="book"
                color="green"
                trend="+3"
                trendUp={true}
              />
              <QuickStatsCard
                title="Assignments"
                value={assignmentsApi.assignments.length}
                icon="check"
                color="purple"
                trend=""
                trendUp={null}
              />
              <QuickStatsCard
                title="Submissions"
                value={assignmentsApi.assignments.reduce((count, assignment) => count + Number(assignment.submission_count || 0), 0)}
                icon="alert"
                color="red"
                trend=""
                trendUp={null}
              />
              <QuickStatsCard
                title="Upcoming Exams"
                value={examinationsApi.examinations.length}
                icon="calendar"
                color="blue"
                trend="Next: Tomorrow"
                trendUp={null}
              />
              <QuickStatsCard
                title="Average Class Score"
                value="84.5%"
                icon="award"
                color="indigo"
                trend="+2.1%"
                trendUp={true}
              />
              <QuickStatsCard
                title="Student Engagement"
                value="92%"
                icon="trending-up"
                color="teal"
                trend="+8%"
                trendUp={true}
              />
            </div>

            {/* Class Performance Overview with Enhanced Data */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Class Performance Overview</h2>
                <div className="flex items-center space-x-2">
                  <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Classes</option>
                    <option>Grade 8A Mathematics</option>
                    <option>Grade 9B Science</option>
                    <option>Grade 7C English</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    View Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mathematics Class */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Grade 8A Mathematics</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Excellent</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">28/30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium text-green-600">87.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Science Class */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Grade 9B Science</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Good</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">25/26</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium text-blue-600">82.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '82%'}}></div>
                    </div>
                  </div>
                </div>

                {/* English Class */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Grade 7C English</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Needs Attention</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">22/24</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium text-yellow-600">74.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Class Rosters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule & Attendance</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Mark Attendance
                </button>
              </div>

              <div className="space-y-4">
                {/* Morning Classes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Morning Session</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Mathematics - Grade 8A</h4>
                        <span className="text-sm text-gray-500">8:00 AM - 9:00 AM</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600">Present: 27/30</span>
                        <span className="text-red-600">Absent: 3</span>
                        <span className="text-yellow-600">Late: 1</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Science - Grade 9B</h4>
                        <span className="text-sm text-gray-500">9:15 AM - 10:15 AM</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600">Present: 24/26</span>
                        <span className="text-red-600">Absent: 2</span>
                        <span className="text-yellow-600">Late: 0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Afternoon Classes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Afternoon Session</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">English - Grade 7C</h4>
                        <span className="text-sm text-gray-500">1:00 PM - 2:00 PM</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600">Present: 20/24</span>
                        <span className="text-red-600">Absent: 4</span>
                        <span className="text-yellow-600">Late: 2</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">History - Grade 8A</h4>
                        <span className="text-sm text-gray-500">2:15 PM - 3:15 PM</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600">Present: 26/30</span>
                        <span className="text-red-600">Absent: 3</span>
                        <span className="text-yellow-600">Late: 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Activity Feed and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Activity Feed */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Sarah Johnson submitted Mathematics Assignment #3</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Grade 8A Mathematics class completed with 94% attendance</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Mike Chen requested extension for Science project</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New resource uploaded: "Advanced Calculus Notes"</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Emma Davis reported sick - absent from English class</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Alerts Panel */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Student Alerts</h2>
                <div className="space-y-4">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900">Urgent: Low Performance Alert</h4>
                        <p className="text-sm text-red-700">John Smith (Grade 7C) has scored below 60% in 3 consecutive assignments</p>
                        <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm font-bold">⚠</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-yellow-900">Attendance Concern</h4>
                        <p className="text-sm text-yellow-700">Lisa Wong has been absent for 3 consecutive days</p>
                        <p className="text-xs text-yellow-600 mt-1">Follow up required</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">★</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900">Achievement Unlocked</h4>
                        <p className="text-sm text-blue-700">Maria Garcia achieved 95%+ in Mathematics for the entire term</p>
                        <p className="text-xs text-blue-600 mt-1">Consider nomination for honor roll</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Create Assignment</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Schedule Exam</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Upload Resource</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Send Announcement</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-pink-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Grade Submissions</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Update Timetable</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Manage Classes</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "messages" && <Messages />}
        {activeTab === "courses" && <ClassManagement />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "attendancePage" && <AttendancePage />}
        {activeTab === "assignments" && <Assignments />}
        {activeTab === "examinations" && <Examinations />}
        {activeTab === "cbt" && <TeacherCbt />}
        {activeTab === "timetable" && <Timetable />}
        {activeTab === "grade" && <Grade />}
        {activeTab === "resources" && <Resources />}
        {activeTab === "analytics" && <LearningAnalytics />}
        {activeTab === "transcripts" && <TranscriptViewer />}

      </div>
    </div>
  );
  // end of side bar
}

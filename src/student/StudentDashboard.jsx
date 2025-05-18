import { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import Messages from "./Messages";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import Timetable from "./Timetable";
import Grade from "./Grade";

// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");

  // Navigation links data
  const navLinks = [
    { id: "courses", icon: <BookOpen size={20} />, label: "Courses" },
    { id: "messages", icon: <MessageCircle size={20} />, label: "Messages" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "assignments", icon: <FileText size={20} />, label: "Assignments" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "grade", icon: <Award size={20} />, label: "Grade" },
  ];

  // Mock course data
  const courses = [
    {
      id: 1,
      title: "Introduction to Physics",
      teacher: "Teacher A",
      lessons: 15,
      themes: 3,
      dateStarted: "10/01/2024",
      progress: 40,
      image: "/api/placeholder/320/200",
    },
    {
      id: 2,
      title: "Introduction to Chemistry",
      teacher: "Teacher B",
      lessons: 20,
      themes: 4,
      dateStarted: "01/03/2024",
      progress: 50,
      image: "/api/placeholder/320/200",
    },
    {
      id: 3,
      title: "Use Of English",
      teacher: "Teacher C",
      lessons: 30,
      themes: 5,
      dateStarted: "01/01/2024",
      progress: 40,
      image: "/api/placeholder/320/200",
    },
    {
      id: 4,
      title: "Mathematics: Simultaneous Equation",
      teacher: "Teacher A",
      lessons: 15,
      themes: 3,
      dateStarted: "01/01/2024",
      progress: 40,
      image: "/api/placeholder/320/200",
    },
    {
      id: 5,
      title: "Advance Mathematics: DV/DX Solutions",
      teacher: "Teacher B",
      lessons: 20,
      themes: 3,
      dateStarted: "01/03/2024",
      progress: 50,
      image: "/api/placeholder/320/200",
    },
    {
      id: 6,
      title: "Biology: Reproduction",
      teacher: "Teacher C",
      lessons: 30,
      themes: 5,
      dateStarted: "01/01/2024",
      progress: 40,
      image: "/api/placeholder/320/200",
    },
  ];
  // side bar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 pt-4">
        <div className="px-4 pb-6 border-b border-gray-200">
          <h1 className="font-bold text-xl text-blue-900">ILEARNOVA</h1>
        </div>

        <nav className="mt-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`flex items-center px-4 py-3 w-full text-left ${
                activeTab === link.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(link.id)}
            >
              <span className="mr-3">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8">
        {/* Render components based on active tab */}
        {activeTab === "courses" && <CoursesComponent courses={courses} />}
        {activeTab === "messages" && <MessagesComponent />}
        {activeTab === "attendance" && <AttendanceComponent />}
        {activeTab === "assignments" && <AssignmentsComponent />}
        {activeTab === "timetable" && <TimetableComponent />}
        {activeTab === "grade" && <GradeComponent />}
      </div>
    </div>
  );
  // end of side bar
}

// Course card component
function CourseCard({ course }) {
  return (
    <div className="bg-white rounded shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="rounded-t w-full object-cover h-48"
        />
        <button className="absolute inset-0 m-auto w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white">
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2">{course.title}</h3>
        <div className="flex items-center mb-2">
          <img
            src="/api/placeholder/32/32"
            alt={course.teacher}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{course.teacher}</p>
            <p className="text-xs text-gray-500">
              {course.lessons} Lessons - {course.themes} Key Themes
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mt-2">
          <span>Date Started: {course.dateStarted}</span>
          <span className="font-medium text-blue-600">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div
            className="bg-blue-600 h-1 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Course component
function CoursesComponent({ courses }) {
  return (
    <div>
      {/* dashboard nav */}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <p className="text-gray-500 text-xs mt-1">Page/Student Portal</p>
          <h2 className="font-medium mt-2">My Courses</h2>
        </div>
        <div className="flex items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Priscilla"
              className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <div>
            <img
              src="/api/placeholder/32/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
      {/* end of dashboard nav */}

      <div className="grid grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
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
    <div className="p-4 bg-white rounded shadow">
      <Attendance />
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

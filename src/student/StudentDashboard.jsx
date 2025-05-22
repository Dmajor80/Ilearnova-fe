import { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  Clock,
  Award,
  ChevronRight,
  LayoutDashboard,
  IdCard,
} from "lucide-react";

import Messages from "./Messages";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import Timetable from "./Timetable";
import Grade from "./Grade";
import Overview from "./Overview";
import { Link, Outlet } from "react-router-dom";
// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");

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
      icon: <IdCard size={20} />,
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
    { id: "grade", icon: <Award size={20} />, label: "Grade", air: "grade" },
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
  ];

  // Mock course data

  // side bar
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside>
        {/* Sidebar */}
        <div className="w-[246px] h-[100%] bg-white border-r  border-gray-200 pt-4">
          <div className="px-4 pb-6 border-b border-gray-200">
            <h1 className="font-bold text-[26px] text-blue-900 text-center">
              ILEARNOVA
            </h1>
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
                <Link to={link.air}>
                  {" "}
                  <span>{link.label}</span>
                </Link>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="">
        {/* adminnav */}
        <div className="flex items-center justify-between mb-6 w-[1024px] p-[2rem]">
          <div>
            <p className="text-gray-500 text-xs mt-1">Page/Student Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <img
              src="/api/placeholder/32/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
        {/* end of adminnav */}
        {/* <AdminNav /> */}
        <main className="">
          <Outlet /> {/* Display nested routes */}
        </main>
      </div>
      {/* Main content area */}
    </div>
  );
  // end of side bar
}

// Course card component

// Course component

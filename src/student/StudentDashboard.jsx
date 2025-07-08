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
  CreditCard,
  Menu,
  X,
} from "lucide-react";

import { Link, Outlet } from "react-router-dom";

// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          w-16 md:w-[246px] h-[100%] bg-white border-r border-gray-200 pt-4 
          fixed md:static inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "w-[246px]" : "w-16"}
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

      <div className="ml-16 md:ml-0 flex-1">
        {/* adminnav */}
        <div className="flex items-center justify-between mb-6  lg:w-full   p-4 md:p-[2rem]">
          <div>
            <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px]  mt-1">
              Page/Student Portal
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* <div className="relative w-32 sm:w-48 md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10 text-sm"
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
            </div> */}
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

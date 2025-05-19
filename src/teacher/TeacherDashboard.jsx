import { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  Clock,
  Award,
  ChevronRight,
  Star,
  ClipboardList , TrendingUp
} from "lucide-react";
import Messages from "./Messages";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import Grade from "./Grade";
import Timetable from "./Timetable";
import Resources from "./Resources";
import CoursesComponent from "./components/CourseComponents";
import AttendancePage from "./AttendancePage";
import ClassManagement from "./classManagement";


// Main application component
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");

  // Navigation links data
  const navLinks = [
    { id: "courses", icon: <ClipboardList  size={20} />, label: "Class management" },
    { id: "messages", icon: <MessageCircle size={20} />, label: "Messages" },
    { id: "attendance", icon: <Calendar size={20} />, label: "Attendance" },
    { id: "attendancePage", icon: <Calendar size={20} />, label: "Attendance Page" },
    
    { id: "assignments", icon: <TrendingUp size={20} />, label: "Assignments" },
    { id: "resources", icon: <BookOpen size={20} />, label: "Resources" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "grade", icon: <Star size={20} />, label: "Grade" },
  ];

  // Mock course data
  
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
      <div className="flex-1 ">
        {/* Render components based on active tab */}
        {/* {activeTab === "courses" && <CoursesComponent page="Class Management"/>} */}
        {activeTab === "messages" && <MessagesComponent />}
        {activeTab === "courses" && <ClassManagementComponent />}
        {activeTab === "attendance" && <AttendanceComponent />}
        {activeTab === "attendancePage" && <AttendancePageComponent />}
        {activeTab === "assignments" && <AssignmentsComponent />}
        {activeTab === "timetable" && <TimetableComponent />}
        {activeTab === "grade" && <GradeComponent />}
        {activeTab === "resources" && <ResourcesComponent />}
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

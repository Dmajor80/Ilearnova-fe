import React from 'react'
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
import { Link, Outlet } from "react-router-dom";
// import { useState } from 'react';



function SideBar() {
  // const [activeTab, setActiveTab] = useState("Dashboard");
  return (

    <div className="sticky top-0 flex flex-col h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-6 px-4">
        <div className="mb-8">
          <span className="font-bold text-lg text-[#1a237e]">ILEARNOVA</span>
        </div>
        <nav className="flex flex-col gap-2 text-gray-700">
          <a href="/parent-dashboard" className="font-semibold text-[#1a237e] bg-blue-50 rounded px-3 py-2">Dashboard</a>
          <a href="/attendance" className="hover:bg-blue-50 rounded px-3 py-2">Attendance</a>
          <a href="#" className="hover:bg-blue-50 rounded px-3 py-2">Results</a>
          <a href="#" className="hover:bg-blue-50 rounded px-3 py-2">Resources</a>
          <a href="/timetable" className="hover:bg-blue-50 rounded px-3 py-2">Timetable</a>
          <a href="#" className="hover:bg-blue-50 rounded px-3 py-2">Messages</a>
          <a href="#" className="hover:bg-blue-50 rounded px-3 py-2">Payments</a>
          <a href="#" className="hover:bg-blue-50 rounded px-3 py-2">Reports</a>
          <a href="#" className="font-semibold rounded px-3 py-2">Performance</a>
        </nav>
      </aside>
    </div>
  );
}

export default SideBar
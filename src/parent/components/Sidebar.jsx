// import {Link} from 'react-router-dom'
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

    <div className="sticky hidden md:block top-0 flex flex-col h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-6 px-4">
        <div className="mb-8">
          <span className="font-bold text-lg text-[#1a237e]">ILEARNOVA</span>
        </div>
        <nav className="flex flex-col gap-2 text-gray-700">
          <Link to="/parent-dashboard" className="font-semibold text-[#1a237e] bg-blue-50 rounded px-3 py-2">Dashboard</Link>
          <Link to="/attendance" className="hover:bg-blue-50 rounded px-3 py-2">Attendance</Link>
          {/* <Link to="#" className="hover:bg-blue-50 rounded px-3 py-2">Results</Link> */}
          <Link to="#" className="hover:bg-blue-50 rounded px-3 py-2">Resources</Link>
          <Link to="/timetable" className="hover:bg-blue-50 rounded px-3 py-2">Timetable</Link>
          <Link to="#" className="hover:bg-blue-50 rounded px-3 py-2">Messages</Link>
          <Link to="#" className="hover:bg-blue-50 rounded px-3 py-2">Payments</Link>
          <Link to="/result" className="hover:bg-blue-50 rounded px-3 py-2">Results</Link>
          <Link to="#" className="hover:bg-blue-50 rounded px-3 py-2">Performance</Link>
        </nav>
      </aside>
    </div>
  );
}

export default SideBar
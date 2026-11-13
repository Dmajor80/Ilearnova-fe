import { useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileBarChart,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MonitorPlay,
  User,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";
import Attendance from "./Attendance";
import Assignments from "./Assignments";
import ClassManagement from "./ClassManagement";
import Examinations from "./Examinations";
import Grade from "./Grade";
import Messages from "./Messages";
import Resources from "./Resources";
import TeacherDashboardOverview from "./TeacherDashboardOverview";
import Timetable from "./Timetable";
import TeacherCbt from "../cbt/TeacherCbt";
import TeacherAnalytics from "./TeacherAnalytics";
import DirectMessages from "@/features/communication/DirectMessages";

const navigation = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "courses", label: "Class management", Icon: BookOpen },
  { id: "messages", label: "Announcements", Icon: MessageCircle },
  { id: "direct-messages", label: "Direct messages", Icon: MessageCircle },
  { id: "attendance", label: "Attendance", Icon: CalendarCheck },
  { id: "assignments", label: "Assignments", Icon: ClipboardList },
  { id: "examinations", label: "Examinations", Icon: FileText },
  { id: "cbt", label: "CBT exams", Icon: MonitorPlay },
  { id: "resources", label: "Resources", Icon: FolderOpen },
  { id: "timetable", label: "Timetable", Icon: Clock3 },
  { id: "grade", label: "Grade", Icon: Award },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "transcripts", label: "Transcripts", Icon: FileBarChart }
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "courses":
        return <ClassManagement />;
      case "messages":
        return <Messages />;
      case "direct-messages":
        return <DirectMessages />;
      case "attendance":
        return <Attendance />;
      case "assignments":
        return <Assignments />;
      case "examinations":
        return <Examinations />;
      case "cbt":
        return <TeacherCbt />;
      case "resources":
        return <Resources />;
      case "timetable":
        return <Timetable />;
      case "grade":
        return <Grade onNavigate={setActiveTab} />;
      case "analytics":
        return <TeacherAnalytics />;
      case "transcripts":
        return (
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Student transcripts</h2>
            <p className="mt-2 text-sm text-gray-600">
              The API documentation does not define a teacher transcript endpoint, so transcript data cannot be loaded here.
            </p>
          </section>
        );
      default:
        return <TeacherDashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex h-16 items-center justify-between border-b px-5">
          <span className="text-xl font-bold tracking-wide text-blue-900">ILEARNOVA</span>
          <button type="button" className="rounded p-2 text-gray-500 lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Teacher dashboard">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={activeTab === item.id ? "page" : undefined}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                activeTab === item.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
              }`}
            >
              <item.Icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t p-3">
          {logoutError && <p role="alert" className="mb-2 text-sm text-red-700">{logoutError}</p>}
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50">
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-gray-500">Teacher workspace</p>
              <h1 className="text-lg font-semibold text-gray-900">{navigation.find(({ id }) => id === activeTab)?.label}</h1>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700"><User size={16} /></span>
              <span className="hidden sm:inline">Profile</span>
              <ChevronDown size={16} />
            </button>
            {profileMenuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-44 rounded-lg border bg-white p-1 shadow-lg">
                <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }} className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  View profile
                </button>
                <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); handleLogout(); }} className="w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-6">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

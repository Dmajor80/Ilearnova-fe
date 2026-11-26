import {
  Award,
  Banknote,
  BookOpen,
  GraduationCap,
  Home,
  Megaphone,
  MessageCircle,
  SlidersHorizontal,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export const ADMIN_BASE = "/organization-dashboard/";

/** Sidebar groups; pages in the same group are tabs of one another. */
export const ADMIN_GROUPS = [
  { id: "overview", label: "Overview", icon: Home, tabs: [{ id: "overview", label: "Overview" }] },
  { id: "students", label: "Students", icon: GraduationCap, tabs: [{ id: "students", label: "Students" }] },
  { id: "teachers", label: "Teachers", icon: UserCheck, tabs: [{ id: "teachers", label: "Teachers" }] },
  { id: "classes", label: "Classes", icon: BookOpen, tabs: [{ id: "classes", label: "Classes" }] },
  {
    id: "academics",
    label: "Exams & results",
    icon: Award,
    tabs: [
      { id: "exams", label: "Exams" },
      { id: "results", label: "Results" },
      { id: "grading", label: "Grading" },
    ],
  },
  {
    id: "insights",
    label: "Reports",
    icon: TrendingUp,
    tabs: [
      { id: "analytics", label: "Analytics" },
      { id: "reports", label: "Reports" },
    ],
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    tabs: [
      { id: "messages", label: "Messages" },
      { id: "alerts", label: "Alerts" },
    ],
  },
  { id: "announcements", label: "Announcements", icon: Megaphone, tabs: [{ id: "announcements", label: "Announcements" }] },
  { id: "operations", label: "Operations", icon: SlidersHorizontal, tabs: [{ id: "operations", label: "Operations" }] },
  {
    id: "money",
    label: "Fees & billing",
    icon: Banknote,
    tabs: [
      { id: "fees", label: "School fees" },
      { id: "billing", label: "Subscription" },
    ],
  },
];

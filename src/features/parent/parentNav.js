import { Banknote, Calendar, ClipboardList, FileText, MessageCircle, Star, Users } from "lucide-react";

/** Parent sidebar groups; pages in a group are tabs of one another. */
export const PARENT_GROUPS = [
  { id: "dashboard", label: "Dashboard", icon: ClipboardList, tabs: [{ id: "dashboard", label: "Dashboard" }] },
  { id: "children", label: "My Children", icon: Users, tabs: [{ id: "children", label: "My Children" }] },
  {
    id: "school-life",
    label: "Attendance & timetable",
    icon: Calendar,
    tabs: [
      { id: "attendance", label: "Attendance" },
      { id: "timetable", label: "Timetable" },
    ],
  },
  { id: "materials", label: "Course materials", icon: FileText, tabs: [{ id: "materials", label: "Course materials" }] },
  { id: "results", label: "Results", icon: Star, tabs: [{ id: "grades", label: "Results" }] },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    tabs: [
      { id: "messages", label: "Messages" },
      { id: "announcement", label: "Announcements" },
    ],
  },
  { id: "fees", label: "Fees & Payments", icon: Banknote, tabs: [{ id: "fees", label: "Fees & Payments" }] },
];

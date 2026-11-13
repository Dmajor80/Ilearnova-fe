import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  PieChart,
  Plus,
  Target,
  UserCheck
} from "lucide-react";
import {
  useOrganizationCalendar,
  useOrganizationOverview,
} from "@/hooks/organization";

const readMetric = (metrics, key, nestedKey = "total") => {
  const value = metrics?.[key];
  if (value && typeof value === "object") return value[nestedKey] ?? value.count;
  return value;
};

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const getLabel = (item) =>
  item.title ||
  item.message ||
  item.description ||
  item.activity ||
  item.action ||
  item.activity_type ||
  item.event_type ||
  item.name ||
  JSON.stringify(item);

const getTimestamp = (item) =>
  item.timestamp || item.created_at || item.date || item.start_datetime || item.start_time || "";

const OrganizationOverview = () => {
  const navigate = useNavigate();
  const { alertsApi } = useOutletContext();
  const overview = useOrganizationOverview();
  const calendar = useOrganizationCalendar();
  const alerts = alertsApi;
  const metrics = overview.metrics || {};
  const activities = Array.isArray(overview.activities) ? overview.activities : [];
  const notifications = Array.isArray(alerts.notifications) ? alerts.notifications : [];
  const upcomingEvents = calendar.events
    .filter((event) => {
      const date = event.start_datetime || event.start_time || event.start_date || event.date || event.event_date;
      return date && new Date(date) >= new Date(new Date().toDateString());
    })
    .slice(0, 4);

  const stats = [
    {
      label: "Students",
      value: firstValue(
        readMetric(metrics, "students"),
        readMetric(metrics, "total_students"),
        readMetric(metrics, "student_count")
      ) ?? "—",
      icon: GraduationCap,
      theme: "blue"
    },
    {
      label: "Teachers",
      value: firstValue(
        readMetric(metrics, "teachers"),
        readMetric(metrics, "total_teachers"),
        readMetric(metrics, "teacher_count")
      ) ?? "—",
      icon: UserCheck,
      theme: "green"
    },
    {
      label: "Classes",
      value: firstValue(
        readMetric(metrics, "classes"),
        readMetric(metrics, "total_classes"),
        readMetric(metrics, "class_count")
      ) ?? "—",
      icon: BookOpen,
      theme: "purple"
    },
    {
      label: "Upcoming events",
      value: firstValue(readMetric(metrics, "events", "upcoming"), "—"),
      icon: Calendar,
      theme: "orange"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Organization overview</h2>
          <p className="mt-1 text-blue-100">Live school metrics, activities, alerts, and upcoming events.</p>
        </div>
        <button
          onClick={() => {
            overview.refreshData(true);
            calendar.refreshData(true);
            alerts.refreshData(true);
          }}
          className="self-start rounded-lg bg-white/15 px-4 py-2 hover:bg-white/25 sm:self-auto"
        >
          Refresh overview
        </button>
      </div>

      {(overview.error || calendar.error || alerts.error) && (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Some dashboard data could not be loaded. Refresh to retry, or check the affected API request in the browser network panel.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon, theme }) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
              <p className="mt-1 text-xs text-gray-400">
                {overview.loading ? "Loading live data…" : ""}
              </p>
            </div>
            <span className={`rounded-lg p-3 ${theme === "blue" ? "bg-blue-100 text-blue-600" : theme === "green" ? "bg-green-100 text-green-600" : theme === "purple" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"}`}>
              {React.createElement(icon, { className: "h-6 w-6" })}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="space-y-6 xl:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent activities</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            {overview.loading ? <p className="text-sm text-gray-500">Loading activities…</p> : activities.length ? (
              <div className="divide-y">
                {activities.slice(0, 8).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start gap-3 py-3">
                    <span className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600"><Activity className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm text-gray-800">{getLabel(activity)}</p>
                      {getTimestamp(activity) && <p className="mt-1 text-xs text-gray-500">{getTimestamp(activity)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No recent activities reported.</p>}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming events</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            {calendar.loading ? <p className="text-sm text-gray-500">Loading events…</p> : upcomingEvents.length ? (
              <div className="space-y-2">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id || index} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{getLabel(event)}</p>
                      <p className="text-xs text-gray-500">{getTimestamp(event) || "Date not provided"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No upcoming events reported.</p>}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
              <AlertTriangle className="h-5 w-5 text-gray-400" />
            </div>
            {alerts.loading ? <p className="text-sm text-gray-500">Loading alerts…</p> : notifications.length ? (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((alert, index) => (
                  <div key={alert.id || index} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-900">{getLabel(alert)}</p>
                    {getTimestamp(alert) && <p className="mt-1 text-xs text-amber-700">{getTimestamp(alert)}</p>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No alerts.</p>}
            <button onClick={() => navigate("/organization-dashboard/alerts")} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
              View alerts <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick actions</h3>
            <div className="space-y-2">
              <button onClick={() => navigate("/organization-dashboard/students")} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-gray-50">
                <Plus className="h-5 w-5 text-green-600" /><span className="text-sm font-medium">Manage students</span>
              </button>
              <button onClick={() => navigate("/organization-dashboard/analytics")} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-gray-50">
                <PieChart className="h-5 w-5 text-purple-600" /><span className="text-sm font-medium">View analytics</span>
              </button>
              <button onClick={() => navigate("/organization-dashboard/reports")} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-gray-50">
                <FileText className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium">Export reports</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrganizationOverview;

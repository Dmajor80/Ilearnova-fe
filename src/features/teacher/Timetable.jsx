import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, ExternalLink, RefreshCw } from "lucide-react";
import { useTeacherTimetable } from "@/hooks/teacher";

const DAY_KEYS = ["day_name", "day", "name", "weekday"];
const SESSION_KEYS = ["entries", "sessions", "schedule", "slots", "periods", "classes"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getDayName = (day, fallback) => {
  if (typeof day === "string") return day;
  if (Number.isInteger(day)) return WEEKDAYS[day] || fallback;
  for (const key of DAY_KEYS) {
    if (typeof day?.[key] === "string") return day[key];
  }
  if (Number.isInteger(day?.day_of_week)) return WEEKDAYS[day.day_of_week] || fallback;
  const keyedSessions = Object.entries(day || {}).find(([, value]) => Array.isArray(value));
  if (keyedSessions) return keyedSessions[0];
  return fallback;
};

const getDaySessions = (day) => {
  if (Array.isArray(day)) return day;
  if (!day || typeof day !== "object") return [];
  for (const key of SESSION_KEYS) {
    if (Array.isArray(day[key])) return day[key];
  }
  const keyedSessions = Object.values(day).find(Array.isArray);
  if (keyedSessions) return keyedSessions;
  return day.start_time ? [day] : [];
};

const formatTime = (value) => {
  if (!value) return "";
  const [hours, minutes] = String(value).split(":");
  if (!minutes || Number.isNaN(Number(hours))) return String(value);
  const hour = Number(hours);
  return `${hour % 12 || 12}:${minutes.slice(0, 2)} ${hour >= 12 ? "PM" : "AM"}`;
};

export default function Timetable() {
  const timetableApi = useTeacherTimetable();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const days = useMemo(() => {
    const rawDays = Array.isArray(timetableApi.timetable?.days)
      ? timetableApi.timetable.days
      : [];
    return rawDays.map((day, index) => ({
      name: getDayName(day, `Day ${index + 1}`),
      sessions: getDaySessions(day)
    }));
  }, [timetableApi.timetable]);

  const classNames = useMemo(
    () => [...new Set(days.flatMap(({ sessions }) => sessions
      .map((session) => session.class_name || session.class?.name)
      .filter(Boolean)))],
    [days]
  );
  const activeDay = days.find((day) => day.name === selectedDay) || days[0];
  const sessions = (activeDay?.sessions || []).filter((session) =>
    selectedClass === "all" ||
    (session.class_name || session.class?.name) === selectedClass
  );

  useEffect(() => {
    if (!selectedDay && days.length) setSelectedDay(days[0].name);
    if (selectedDay && !days.some((day) => day.name === selectedDay) && days.length) {
      setSelectedDay(days[0].name);
    }
  }, [days, selectedDay]);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly timetable</h2>
          <p className="mt-1 text-sm text-gray-600">Your scheduled subject and class sessions.</p>
        </div>
        <button
          type="button"
          onClick={() => timetableApi.refreshData(true)}
          disabled={timetableApi.loading}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={timetableApi.loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </section>

      {timetableApi.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{timetableApi.error.message}</p>
      )}

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Class
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              <option value="all">All classes</option>
              {classNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>

        {days.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {days.map((day) => (
              <button
                key={day.name}
                type="button"
                onClick={() => setSelectedDay(day.name)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${
                  day.name === activeDay?.name ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
        )}

        {timetableApi.loading && !timetableApi.timetable ? (
          <p className="py-10 text-center text-gray-500">Loading timetable...</p>
        ) : !days.length ? (
          <div className="py-10 text-center">
            <CalendarDays className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="font-medium text-gray-800">No timetable available</p>
            <p className="mt-1 text-sm text-gray-500">Scheduled sessions will appear here when they are assigned.</p>
          </div>
        ) : sessions.length ? (
          <div className="divide-y">
            {sessions.map((session, index) => (
              <article key={session.id || `${activeDay?.name}-${index}`} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex min-w-48 items-center gap-3">
                  <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Clock3 size={18} /></span>
                  <div className="font-medium text-gray-900">
                    {formatTime(session.start_time)}{session.end_time ? ` – ${formatTime(session.end_time)}` : ""}
                  </div>
                </div>
                <div className="min-w-48 flex-1">
                  <p className="font-semibold text-gray-900">{session.subject_name || session.subject?.name || "Class session"}</p>
                  <p className="text-sm text-gray-600">{session.class_name || session.class?.name || "Class"}</p>
                </div>
                <div className="text-sm text-gray-500">{session.room || "Room not specified"}</div>
                {session.meeting_link && (
                  <a href={session.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
                    Join <ExternalLink size={14} />
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600">No sessions are scheduled for {activeDay?.name}.</p>
        )}
      </section>
    </div>
  );
}

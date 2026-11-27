import { CalendarDays, ExternalLink } from "lucide-react";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { slotClassName } from "./slotLabels";

const formatTime = (value) => {
  const [h, m] = String(value || "").split(":");
  const hour = Number(h);
  if (!m || Number.isNaN(hour)) return value || "";
  return `${hour % 12 || 12}:${m.slice(0, 2)} ${hour >= 12 ? "PM" : "AM"}`;
};

/**
 * A read-only week: one card per school day that has lessons, each lesson
 * with its time, subject, class ("No class" for a subject without one),
 * teacher and room. `days` is the
 * `[{day_of_week, day_name, entries}]` list the timetable endpoints return.
 */
export default function WeekTimetable({ days, loading, error, emptyText }) {
  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <ListSkeleton rows={5} label="Loading timetable" />
      </div>
    );
  }
  if (!days?.length) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
        <p className="font-medium text-slate-800">No timetable yet</p>
        <p className="mt-1 text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {days.map((day) => (
        <section key={day.day_of_week} className="rounded-xl bg-white p-5 shadow-sm" aria-label={day.day_name}>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">{day.day_name}</h3>
          <ol className="divide-y">
            {day.entries.map((slot) => (
              <li key={slot.id} className="flex gap-4 py-3">
                <p className="w-24 flex-shrink-0 text-sm font-medium tabular-nums text-blue-700">
                  {formatTime(slot.start_time)}
                  <span className="block text-slate-500">{formatTime(slot.end_time)}</span>
                </p>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-slate-900">{slot.subject_name || slot.course_name}</p>
                  <p className="text-slate-600">
                    {[slot.subject_name && slotClassName(slot), slot.teacher_name, slot.room].filter(Boolean).join(" · ")}
                  </p>
                  {slot.meeting_link && (
                    <a
                      href={slot.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                    >
                      Join online <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

import {
  useTeacherAnalytics,
  useTeacherAssignments,
  useTeacherClasses,
  useTeacherExaminations,
  useTeacherStudents,
  useTeacherTimetable
} from "@/hooks/teacher";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import { RefreshCw } from "lucide-react";
import { ListSkeleton, Skeleton, StatCardsSkeleton } from "@/components/ui/Skeleton";
import { slotClassName } from "@/components/timetable/slotLabels";

const shortTime = (value) => {
  const [h, m] = String(value || "").split(":");
  const hour = Number(h);
  return m && !Number.isNaN(hour) ? `${hour % 12 || 12}:${m.slice(0, 2)} ${hour >= 12 ? "PM" : "AM"}` : value || "";
};

/** Today's lessons, or the next school day's if there are none today. */
function upcomingDay(days, now = new Date()) {
  const today = (now.getDay() + 6) % 7; // backend weeks start Monday = 0
  for (let ahead = 0; ahead < 7; ahead += 1) {
    const dow = (today + ahead) % 7;
    const day = days.find((d) => d.day_of_week === dow && d.entries?.length);
    if (day) return { label: ahead === 0 ? "Today" : ahead === 1 ? "Tomorrow" : day.day_name, entries: day.entries };
  }
  return null;
}

export default function TeacherDashboardOverview({ onNavigate = () => {} }) {
  const classesApi = useTeacherClasses();
  const studentsApi = useTeacherStudents();
  const assignmentsApi = useTeacherAssignments();
  const examinationsApi = useTeacherExaminations();
  const analyticsApi = useTeacherAnalytics();
  const timetableApi = useTeacherTimetable();
  const loading = classesApi.loading || studentsApi.loading || assignmentsApi.loading || examinationsApi.loading;
  const analytics = analyticsApi.analytics && typeof analyticsApi.analytics === "object"
    ? analyticsApi.analytics
    : {};
  const analyticsMetrics = Object.entries(analytics)
    .filter(([, value]) => value === null || ["string", "number", "boolean"].includes(typeof value))
    .slice(0, 4);
  const timetableDays = Array.isArray(timetableApi.timetable?.days)
    ? timetableApi.timetable.days
    : [];
  const nextDay = upcomingDay(timetableDays);
  const submissions = assignmentsApi.assignments.reduce(
    (sum, assignment) => sum + Number(assignment.submission_count || 0),
    0
  );
  const refreshDashboard = () => Promise.all([
    classesApi.refreshData({}, true),
    studentsApi.refreshData({}, true),
    assignmentsApi.refreshData({}, true),
    examinationsApi.refreshData({}, true),
    analyticsApi.refreshData(undefined, true),
    timetableApi.refreshData(true)
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <StatCardsSkeleton label="Loading teacher dashboard" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {["Loading your classes", "Loading recent assignments"].map((label) => (
            <section key={label} className="rounded-xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-4 h-5 w-40" />
              <ListSkeleton rows={4} label={label} />
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button type="button" onClick={refreshDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw size={15} /> Refresh dashboard
        </button>
      </div>
      {[classesApi, studentsApi, assignmentsApi, examinationsApi, analyticsApi, timetableApi].some((api) => api.error) && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          Some teacher dashboard data could not be loaded. Refresh the relevant section to retry.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickStatsCard title="Total Students" value={studentsApi.students.length} icon="users" color="blue" />
        <QuickStatsCard title="Active Classes" value={classesApi.classes.length} icon="book" color="green" />
        <QuickStatsCard title="Assignments" value={assignmentsApi.assignmentPagination?.total ?? assignmentsApi.assignments.length} icon="check" color="purple" />
        <QuickStatsCard title="Examinations" value={examinationsApi.examinationPagination?.total ?? examinationsApi.examinations.length} icon="calendar" color="yellow" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your classes</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{classesApi.classes.length} total</span>
              <button type="button" onClick={() => onNavigate("courses")} className="text-sm font-medium text-blue-700 hover:underline">Manage</button>
            </div>
          </div>
          {classesApi.classes.length ? <ul className="divide-y">
            {classesApi.classes.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <span className="font-medium">{item.name || item.class_name}</span>
                <span className="text-sm text-gray-500">{item.student_count ?? "—"} students</span>
              </li>
            ))}
          </ul> : <p className="text-sm text-gray-500">No assigned classes found.</p>}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent assignments</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{submissions} submissions</span>
              <button type="button" onClick={() => onNavigate("assignments")} className="text-sm font-medium text-blue-700 hover:underline">View all</button>
            </div>
          </div>
          {assignmentsApi.assignments.length ? <ul className="divide-y">
            {assignmentsApi.assignments.slice(0, 6).map((item) => (
              <li key={item.id} className="py-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.subject_name || "Subject"} · {item.submission_count || 0} submissions</p>
              </li>
            ))}
          </ul> : <p className="text-sm text-gray-500">No assignments found.</p>}
        </section>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Examinations</h2>
          <button type="button" onClick={() => onNavigate("examinations")} className="text-sm font-medium text-blue-700 hover:underline">Manage exams</button>
        </div>
        {examinationsApi.examinations.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {examinationsApi.examinations.slice(0, 4).map((exam) => (
              <article key={exam.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{exam.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{exam.subject_name || "Subject"}</p>
                {exam.start_time && <p className="mt-2 text-xs text-gray-500">{new Date(exam.start_time).toLocaleString()}</p>}
              </article>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500">No examinations found.</p>}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Performance analytics</h2>
            <button type="button" onClick={() => onNavigate("analytics")} className="text-sm font-medium text-blue-700 hover:underline">View analytics</button>
          </div>
          {analyticsApi.loading ? <ListSkeleton rows={2} label="Loading analytics" />
            : analyticsMetrics.length ? (
              <dl className="grid grid-cols-2 gap-3">
                {analyticsMetrics.map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{String(value ?? "—")}</dd>
                  </div>
                ))}
              </dl>
            ) : <p className="text-sm text-gray-500">No performance analytics are available yet.</p>}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekly timetable</h2>
            <button type="button" onClick={() => onNavigate("timetable")} className="text-sm font-medium text-blue-700 hover:underline">View timetable</button>
          </div>
          {timetableApi.loading ? <ListSkeleton rows={3} label="Loading timetable" />
            : nextDay ? (
              <>
                <p className="mb-2 text-sm font-medium text-gray-500">{nextDay.label}</p>
                <ul className="divide-y">
                  {nextDay.entries.map((slot) => (
                    <li key={slot.id} className="flex gap-3 py-2 text-sm">
                      <span className="w-20 flex-shrink-0 tabular-nums text-blue-700">{shortTime(slot.start_time)}</span>
                      <span className="text-gray-900">
                        {slot.subject_name || "Class"} <span className="text-gray-500">· {slotClassName(slot)}{slot.room ? ` · ${slot.room}` : ""}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : <p className="text-sm text-gray-500">No timetable is available.</p>}
        </section>
      </div>
    </div>
  );
}

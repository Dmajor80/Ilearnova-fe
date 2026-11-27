import { useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { useTeacherAnalytics, useTeacherClasses } from "@/hooks/teacher";

const percent = (value) => (value === null || value === undefined ? "—" : `${value}%`);

export default function TeacherAnalytics() {
  const analyticsApi = useTeacherAnalytics();
  const classesApi = useTeacherClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const data = analyticsApi.analytics && typeof analyticsApi.analytics === "object"
    ? analyticsApi.analytics
    : {};
  const summary = data.summary || {};
  const subjects = Array.isArray(data.subjects) ? data.subjects : [];

  const refresh = () => analyticsApi.refreshData(selectedClassId || undefined, true);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900"><BarChart3 className="text-blue-700" /> Learning analytics</h2>
          <p className="mt-1 text-sm text-gray-600">Performance by subject for classes you teach.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="analytics-class">Filter by class</label>
          <select id="analytics-class" value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">All classes</option>
            {classesApi.classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>{classItem.name || classItem.class_name || "Class"}</option>
            ))}
          </select>
          <button type="button" onClick={refresh} disabled={analyticsApi.loading} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw size={15} className={analyticsApi.loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </section>

      {classesApi.error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{classesApi.error.message}</p>}
      {analyticsApi.error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{analyticsApi.error.message}</p>}
      {analyticsApi.loading ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500">Loading analytics...</p>
      ) : !Object.keys(data).length ? (
        <section className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-gray-800">No analytics available</p>
          <p className="mt-1 text-sm text-gray-500">Performance data will appear when it is available for your classes.</p>
        </section>
      ) : (
        <>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm text-gray-500">Subjects you teach</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900">{summary.subject_count ?? subjects.length}</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-sm text-gray-500">Students</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900">{summary.student_count ?? "—"}</dd>
            </div>
          </dl>
          <section className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">By subject</h3>
            {subjects.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Subject", "Class", "Students", "Attendance", "Exam average", "Exam pass rate", "Assignments handed in"].map((h) => (
                        <th key={h} scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subjects.map((row) => (
                      <tr key={row.subject_id}>
                        <th scope="row" className="px-3 py-2 text-left font-medium text-gray-900">{row.subject_name}</th>
                        <td className="px-3 py-2 text-gray-700">{row.class_name || "No class"}</td>
                        <td className="px-3 py-2 tabular-nums text-gray-700">{row.student_count}</td>
                        <td className="px-3 py-2 tabular-nums text-gray-900">{percent(row.attendance_rate)}</td>
                        <td className="px-3 py-2 tabular-nums text-gray-700">{percent(row.exams?.average_percentage)}</td>
                        <td className="px-3 py-2 tabular-nums text-gray-700">{percent(row.exams?.pass_rate)}</td>
                        <td className="px-3 py-2 tabular-nums text-gray-700">{percent(row.assignments?.submission_rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No subjects yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

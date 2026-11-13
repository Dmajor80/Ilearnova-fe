import { useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { useTeacherAnalytics, useTeacherClasses } from "@/hooks/teacher";

const labelFor = (value) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function TeacherAnalytics() {
  const analyticsApi = useTeacherAnalytics();
  const classesApi = useTeacherClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const data = analyticsApi.analytics && typeof analyticsApi.analytics === "object"
    ? analyticsApi.analytics
    : {};
  const metrics = Object.entries(data).filter(([, value]) =>
    value === null || ["string", "number", "boolean"].includes(typeof value)
  );
  const collections = Object.entries(data).filter(([, value]) =>
    value && typeof value === "object"
  );

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
          {metrics.length > 0 && (
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(([key, value]) => (
                <article key={key} className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">{labelFor(key)}</p>
                  <p className="mt-2 break-words text-xl font-semibold text-gray-900">{formatValue(value)}</p>
                </article>
              ))}
            </section>
          )}
          {collections.map(([key, value]) => (
            <section key={key} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{labelFor(key)}</h3>
              <pre className="max-h-[28rem] overflow-auto rounded-lg bg-gray-50 p-4 text-xs leading-5 text-gray-700">
                {JSON.stringify(value, null, 2)}
              </pre>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

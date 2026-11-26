import { useEffect, useMemo, useState } from "react";
import { getStudentAttendanceSummary } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { ListSkeleton, StatCardsSkeleton } from "@/components/ui/Skeleton";
import { attendanceBy } from "./attendanceUtils";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

const STATUS = {
  present: { label: "Present", pill: "bg-green-100 text-green-800" },
  late: { label: "Late", pill: "bg-amber-100 text-amber-800" },
  absent: { label: "Absent", pill: "bg-red-100 text-red-800" },
  excused: { label: "Excused", pill: "bg-slate-100 text-slate-700" },
};
const PAGE = 20;

const monthKey = (record) => String(record.date).slice(0, 7);
const monthLabel = (record) =>
  new Date(`${monthKey(record)}-01T00:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" });
const dayLabel = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

/** One labelled bar per group; the number sits beside it, so colour carries nothing alone. */
function Bars({ title, rows, empty }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm" aria-label={title}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      {rows.length ? (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.key} className="grid grid-cols-[minmax(6rem,10rem)_1fr_auto] items-center gap-3 text-sm">
              <span className="truncate text-gray-700" title={row.label}>{row.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <span className="block h-full rounded-full bg-blue-600" style={{ width: `${row.percentage}%` }} />
              </span>
              <span className="w-28 text-right tabular-nums text-gray-900">
                {row.percentage}% <span className="text-gray-500">({row.attended}/{row.total})</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{empty}</p>
      )}
    </section>
  );
}

/**
 * The student's own attendance from GET /api/student/attendance/:
 * a summary, % by subject and by month, and the day-by-day records.
 * Filters (dates, subject) are passed to the API.
 */
export default function Attendance() {
  const [filters, setFilters] = useState({ from: "", to: "", subject_id: "" });
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const [subjects, setSubjects] = useState([]);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    let active = true;
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setState((s) => ({ ...s, loading: true, error: "" }));
    getStudentAttendanceSummary(params)
      .then((payload) => {
        if (!active) return;
        const data = unwrap(payload);
        setState({ loading: false, data, error: "" });
        setShown(PAGE);
        // Keep the subject list from the unfiltered view so choosing one doesn't empty it.
        if (!params.subject_id) {
          setSubjects(attendanceBy(data.records || [], (r) => r.subject_id, (r) => `${r.subject_name} (${r.course_name})`));
        }
      })
      .catch((err) => active && setState({ loading: false, data: null, error: apiErrorDetails(err).messages.join(" ") }));
    return () => {
      active = false;
    };
  }, [filters]);

  const records = useMemo(() => state.data?.records || [], [state.data]);
  const bySubject = useMemo(
    () => attendanceBy(records, (r) => r.subject_id, (r) => r.subject_name).sort((a, b) => a.label.localeCompare(b.label)),
    [records]
  );
  const byMonth = useMemo(() => attendanceBy(records, monthKey, monthLabel).sort((a, b) => a.key.localeCompare(b.key)), [records]);
  const summary = state.data?.summary;
  const setFilter = (name) => (e) => setFilters((f) => ({ ...f, [name]: e.target.value }));
  const filtered = Object.values(filters).some(Boolean);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-2 sm:p-4">
      <header className="flex flex-wrap items-end justify-end gap-4">
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => e.preventDefault()}>
          <div className="text-sm text-gray-600">
            <label htmlFor="att-from">From</label>
            <input id="att-from" type="date" value={filters.from} onChange={setFilter("from")} className="mt-1 block rounded-lg border px-3 py-2" />
          </div>
          <div className="text-sm text-gray-600">
            <label htmlFor="att-to">To</label>
            <input id="att-to" type="date" value={filters.to} onChange={setFilter("to")} className="mt-1 block rounded-lg border px-3 py-2" />
          </div>
          <div className="text-sm text-gray-600">
            <label htmlFor="att-subject">Subject</label>
            <select id="att-subject" value={filters.subject_id} onChange={setFilter("subject_id")} className="mt-1 block rounded-lg border bg-white px-3 py-2">
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          {filtered && (
            <button type="button" onClick={() => setFilters({ from: "", to: "", subject_id: "" })} className="py-2 text-sm font-medium text-blue-700 hover:underline">
              Clear
            </button>
          )}
        </form>
      </header>

      {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

      {state.loading ? (
        <>
          <StatCardsSkeleton count={5} label="Loading attendance summary" className="xl:grid-cols-5" />
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <ListSkeleton rows={5} label="Loading attendance records" />
          </div>
        </>
      ) : summary ? (
        <>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <dt className="text-sm text-gray-600">Attendance</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">{summary.attendance_percentage}%</dd>
            </div>
            {Object.entries(STATUS).map(([key, { label }]) => (
              <div key={key} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <dt className="text-sm text-gray-600">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{summary[key] ?? 0}</dd>
              </div>
            ))}
          </dl>

          {records.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Bars title="By subject" rows={bySubject} empty="No subjects." />
                <Bars title="By month" rows={byMonth} empty="No months." />
              </div>

              <section className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Days</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                        <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Subject</th>
                        <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Class</th>
                        <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {records.slice(0, shown).map((r) => (
                        <tr key={`${r.date}-${r.subject_id}`}>
                          <td className="whitespace-nowrap px-3 py-2 text-gray-900">{dayLabel(r.date)}</td>
                          <td className="px-3 py-2 text-gray-900">{r.subject_name}</td>
                          <td className="px-3 py-2 text-gray-600">{r.course_name}</td>
                          <td className="px-3 py-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[r.status]?.pill || "bg-slate-100"}`}>
                              {STATUS[r.status]?.label || r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {records.length > shown && (
                  <button type="button" onClick={() => setShown((n) => n + PAGE)} className="mt-3 text-sm font-medium text-blue-700 hover:underline">
                    Show {Math.min(PAGE, records.length - shown)} more of {records.length - shown} left
                  </button>
                )}
              </section>
            </>
          ) : (
            <p className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
              {filtered ? "No attendance in this range." : "Your teachers haven't taken attendance yet."}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

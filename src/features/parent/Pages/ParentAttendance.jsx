import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useParentChildAttendance, useParentChildren } from "@/hooks/parent";
import ParentSidebar from "../components/ParentSidebar";
import ParentHeader from "../components/ParentHeader";
import { getParentChildName } from "../components/parentDisplayUtils";

const getRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.attendance)) return data.attendance;
  if (Array.isArray(data?.records)) return data.records;
  return [];
};

const getDisplayValue = (value) => {
  if (value == null || typeof value === "boolean" || typeof value === "number") {
    return value == null ? "—" : String(value);
  }
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return value.name || value.title || value.label || value.id || "—";
};

function ParentAttendance({ isStandalone = true }) {
  const navigate = useNavigate();
  const { id: routeChildId } = useParams();
  const [selectedChildId, setSelectedChildId] = useState(routeChildId || "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const {
    children,
    loading: childrenLoading,
    error: childrenError
  } = useParentChildren();
  const selectedChild = children.find((child) =>
    String(child.id) === String(routeChildId || selectedChildId)
  );
  const params = useMemo(() => ({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined
  }), [dateFrom, dateTo]);
  const {
    attendance,
    loading,
    error,
    refreshData
  } = useParentChildAttendance(selectedChild?.id, params);

  useEffect(() => {
    if (routeChildId) {
      setSelectedChildId(routeChildId);
      return;
    }
    if (!selectedChildId && children.length) setSelectedChildId(children[0].id);
  }, [children, routeChildId, selectedChildId]);

  const records = getRows(attendance);
  const columns = records.length
    ? Object.keys(records[0]).filter((key) =>
      !/^(id|child|student|parent)$/i.test(key)
      && ["string", "number", "boolean"].includes(typeof records[0][key])
    ).slice(0, 6)
    : [];
  const [activeTab, setActiveTab] = useState("attendance");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const content = (
    <section className="space-y-5">
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Attendance</h2>
            <p className="mt-1 text-slate-600">
              Attendance records{selectedChild ? ` for ${getParentChildName(selectedChild)}` : " for a linked child"}.
            </p>
          </div>
          <label className="text-sm font-medium text-slate-700">
            Child
            <select
              className="mt-1 block min-w-56 rounded-lg border border-slate-300 px-3 py-2"
              value={selectedChild?.id || ""}
              onChange={(event) => {
                setSelectedChildId(event.target.value);
                if (isStandalone && event.target.value) {
                  navigate(`/parent-attendance/${event.target.value}`);
                }
              }}
            >
              <option value="" disabled>
                {childrenLoading ? "Loading children…" : "Select a child"}
              </option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>{getParentChildName(child)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm text-slate-600">
            From
            <input
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label className="text-sm text-slate-600">
            To
            <input
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
          <button
            className="self-end rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-60"
            type="button"
            onClick={refreshData}
            disabled={loading || childrenLoading || !selectedChild}
          >
            Refresh
          </button>
        </div>
      </div>
      {childrenError && (
        <p className="text-sm text-red-700" role="alert">Could not load linked children.</p>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {loading && <p className="p-6 text-slate-600">Loading attendance…</p>}
        {!loading && error && (
          <div className="p-6 text-red-700" role="alert">
            Could not load attendance records.
            <button type="button" className="ml-2 underline" onClick={refreshData}>Try again</button>
          </div>
        )}
        {!loading && !error && !childrenLoading && !selectedChild && (
          <p className="p-6 text-slate-600">No linked children are available.</p>
        )}
        {!loading && !error && selectedChild && records.length === 0 && (
          <p className="p-6 text-slate-600">No attendance records were returned for this child.</p>
        )}
        {!loading && !error && records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold capitalize">
                      {column.replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id || `${record.date || record.attendance_date || "record"}-${index}`} className="border-t">
                    {columns.map((column) => (
                      <td key={column} className="px-4 py-3 text-slate-700">
                        {getDisplayValue(record[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );

  if (!isStandalone) return content;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ParentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 md:ml-64">
        <ParentHeader activeTab={activeTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="m-4 mt-0 p-6 md:m-6 md:mt-0 md:p-8">{content}</main>
      </div>
    </div>
  );
}

export default ParentAttendance;

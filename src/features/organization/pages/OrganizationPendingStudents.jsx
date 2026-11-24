import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCheck, RefreshCw, UserCheck, UserRoundX } from "lucide-react";

const nameOf = (entry) => entry?.user?.name || entry?.user?.email || "Unknown student";

/**
 * Students who signed up with the school's code wait here until an admin
 * verifies them; until then they cannot use student features. Several can
 * be verified at once (e.g. a new JSS1 intake).
 */
const OrganizationPendingStudents = () => {
  const { pendingStudentsApi: api } = useOutletContext();
  const [selected, setSelected] = useState(() => new Set());
  const [rejecting, setRejecting] = useState(null);

  const rows = api.pendingStaff;
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggle = (id) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));

  const verifySelected = async () => {
    try {
      await api.bulkVerifyPendingStaff([...selected]);
      setSelected(new Set());
    } catch {
      // The hook reports request errors.
    }
  };

  const verifyOne = async (entry) => {
    try {
      await api.verifyPendingStaff(entry.id);
      setSelected((current) => {
        const next = new Set(current);
        next.delete(entry.id);
        return next;
      });
    } catch {
      // The hook reports request errors.
    }
  };

  const reject = async () => {
    try {
      await api.rejectPendingStaff(rejecting.id);
      setRejecting(null);
    } catch {
      // The hook reports request errors.
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Pending Students</h2>
          <p className="mt-1 text-sm text-gray-600">
            Students who joined with your school code. They can't use student features until you verify them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => api.refreshData()}
          disabled={api.loading}
          aria-label="Refresh pending students"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-lg border bg-amber-50 p-4 sm:flex-row sm:items-center">
        <p className="font-semibold text-amber-900">{api.totalPendingStaff} awaiting verification</p>
        <button
          type="button"
          disabled={!selected.size || api.mutating}
          onClick={verifySelected}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCheck className="h-4 w-4" /> Verify selected ({selected.size})
        </button>
      </div>

      {api.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{api.error.message}</p>
      )}

      {api.loading ? (
        <p className="py-8 text-center text-gray-500">Loading pending students…</p>
      ) : rows.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-10 px-4 py-3">
                  <input type="checkbox" aria-label="Select all on this page" checked={allSelected} onChange={toggleAll} className="h-4 w-4" />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Student</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Email</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Joined</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((entry) => (
                <tr key={entry.id} className={selected.has(entry.id) ? "bg-blue-50" : undefined}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${nameOf(entry)}`}
                      checked={selected.has(entry.id)}
                      onChange={() => toggle(entry.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">{nameOf(entry)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{entry.user?.email || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {entry.assigned_at ? new Date(entry.assigned_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex justify-end gap-3 text-sm">
                      <button type="button" disabled={api.mutating} onClick={() => verifyOne(entry)} className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline disabled:opacity-50">
                        <UserCheck className="h-4 w-4" /> Verify
                      </button>
                      <button type="button" disabled={api.mutating} onClick={() => setRejecting(entry)} className="inline-flex items-center gap-1 text-red-700 hover:underline disabled:opacity-50">
                        <UserRoundX className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500">No students are waiting for verification.</p>
      )}

      {api.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button type="button" disabled={!api.hasPreviousPage} onClick={() => { setSelected(new Set()); api.setCurrentPage((p) => p - 1); }} className="rounded border px-3 py-2 disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm">Page {api.currentPage} of {api.totalPages}</span>
          <button type="button" disabled={!api.hasNextPage} onClick={() => { setSelected(new Set()); api.setCurrentPage((p) => p + 1); }} className="rounded border px-3 py-2 disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="reject-student-title" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 id="reject-student-title" className="text-lg font-semibold text-gray-900">Reject {nameOf(rejecting)}?</h3>
            <p className="mt-2 text-sm text-gray-600">They will not get access to your school. They can ask again later.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setRejecting(null)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={api.mutating} onClick={reject} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50">Reject</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default OrganizationPendingStudents;

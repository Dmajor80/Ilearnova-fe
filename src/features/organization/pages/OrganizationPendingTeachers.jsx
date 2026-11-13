import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RefreshCw, UserCheck, UserRoundX } from "lucide-react";

const getTeacherName = (staff) => staff?.user?.name || staff?.user?.email || "Unknown teacher";

const OrganizationPendingTeachers = () => {
  const { pendingStaffApi } = useOutletContext();
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [rejectingTeacher, setRejectingTeacher] = useState(null);

  const viewTeacher = async (staff) => {
    try {
      const details = await pendingStaffApi.fetchPendingStaffDetails(staff.id);
      setViewingTeacher(details);
    } catch {
      // The hook reports request errors to the organization admin.
    }
  };

  const verifyTeacher = async (staff) => {
    try {
      await pendingStaffApi.verifyPendingStaff(staff.id);
    } catch {
      // The hook reports request errors to the organization admin.
    }
  };

  const rejectTeacher = async () => {
    try {
      await pendingStaffApi.rejectPendingStaff(rejectingTeacher.id);
      setRejectingTeacher(null);
    } catch {
      // The hook reports request errors to the organization admin.
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Pending Teachers</h2>
          <p className="mt-1 text-sm text-gray-600">Review new teacher requests before granting organization access.</p>
        </div>
        <button
          type="button"
          onClick={() => pendingStaffApi.refreshData()}
          disabled={pendingStaffApi.loading}
          aria-label="Refresh pending teachers"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="rounded-lg border bg-amber-50 p-4">
        <p className="font-semibold text-amber-900">{pendingStaffApi.totalPendingStaff} awaiting verification</p>
        <p className="mt-1 text-sm text-amber-800">Teachers remain pending until an organization admin verifies their request.</p>
      </div>

      {pendingStaffApi.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{pendingStaffApi.error.message}</p>
      )}

      {pendingStaffApi.loading ? (
        <p className="py-8 text-center text-gray-500">Loading pending teachers…</p>
      ) : pendingStaffApi.pendingStaff.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Teacher</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Email</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Requested</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pendingStaffApi.pendingStaff.map((staff) => (
                <tr key={staff.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">{getTeacherName(staff)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{staff.user?.email || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {staff.assigned_at ? new Date(staff.assigned_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex justify-end gap-3 text-sm">
                      <button type="button" onClick={() => viewTeacher(staff)} className="text-blue-700 hover:underline">View</button>
                      <button
                        type="button"
                        disabled={pendingStaffApi.mutating}
                        onClick={() => verifyTeacher(staff)}
                        className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline disabled:opacity-50"
                      >
                        <UserCheck className="h-4 w-4" /> Verify
                      </button>
                      <button
                        type="button"
                        disabled={pendingStaffApi.mutating}
                        onClick={() => setRejectingTeacher(staff)}
                        className="inline-flex items-center gap-1 text-red-700 hover:underline disabled:opacity-50"
                      >
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
        <p className="py-8 text-center text-gray-500">There are no pending teacher requests.</p>
      )}

      {pendingStaffApi.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={!pendingStaffApi.hasPreviousPage}
            onClick={() => pendingStaffApi.setCurrentPage((page) => page - 1)}
            className="rounded border px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">Page {pendingStaffApi.currentPage} of {pendingStaffApi.totalPages}</span>
          <button
            type="button"
            disabled={!pendingStaffApi.hasNextPage}
            onClick={() => pendingStaffApi.setCurrentPage((page) => page + 1)}
            className="rounded border px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={() => setViewingTeacher(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pending-teacher-details-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="pending-teacher-details-title" className="text-lg font-semibold">Teacher request details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="font-medium text-gray-500">Name</dt><dd className="text-gray-900">{getTeacherName(viewingTeacher)}</dd></div>
              <div><dt className="font-medium text-gray-500">Email</dt><dd className="text-gray-900">{viewingTeacher.user?.email || "—"}</dd></div>
              <div><dt className="font-medium text-gray-500">Role</dt><dd className="text-gray-900">{viewingTeacher.role || "teacher"}</dd></div>
              <div><dt className="font-medium text-gray-500">Requested</dt><dd className="text-gray-900">{viewingTeacher.assigned_at ? new Date(viewingTeacher.assigned_at).toLocaleString() : "—"}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingTeacher(null)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Close</button>
            </div>
          </section>
        </div>
      )}

      {rejectingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="reject-teacher-title" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 id="reject-teacher-title" className="text-lg font-semibold text-gray-900">Reject teacher request?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Rejecting {getTeacherName(rejectingTeacher)} deactivates the role and does not grant organization access.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setRejectingTeacher(null)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={pendingStaffApi.mutating} onClick={rejectTeacher} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50">
                Reject request
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default OrganizationPendingTeachers;

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ListSkeleton } from "@/components/ui/Skeleton";
import useParentLinkRequests from "@/hooks/organization/useParentLinkRequests";
import { apiErrorDetails, fieldErrorsOf } from "@/lib/apiHelpers";

const personName = (person) =>
  person?.name ||
  person?.full_name ||
  [person?.first_name, person?.last_name].filter(Boolean).join(" ") ||
  person?.email ||
  "Unknown";

const capitalise = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : "—");

const formatDay = (value) => (value ? new Date(value).toLocaleDateString() : "—");

const actionError = (error) => {
  const fields = fieldErrorsOf(error);
  return Object.values(fields).join(" ") || "That didn't work. Try again.";
};

/**
 * Pending "link me to my child" requests from parents. Approving one links
 * the parent to the student and approves the parent's account.
 */
export default function ParentLinkRequests({ onApproved }) {
  const { requests, loading, error, busyId, refresh, approve, reject } = useParentLinkRequests();
  const [message, setMessage] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const handleApprove = async (request) => {
    setMessage(null);
    try {
      await approve(request.id);
      setMessage({
        type: "success",
        text: `${personName(request.parent)} is now linked to ${personName(request.student)} and approved as a parent.`
      });
      onApproved?.();
    } catch (err) {
      setMessage({ type: "error", text: actionError(err) });
    }
  };

  const handleReject = async () => {
    const request = rejectTarget;
    try {
      await reject(request.id);
    } catch (err) {
      throw new Error(actionError(err));
    }
    setMessage({
      type: "success",
      text: `Request from ${personName(request.parent)} for ${personName(request.student)} was rejected.`
    });
  };

  return (
    <section aria-label="Link requests" className="space-y-3 rounded-xl border bg-white p-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Link requests</h3>
          <p className="text-sm text-gray-600">
            Parents asking to be linked to their child. Approving also approves the parent&apos;s account.
          </p>
        </div>
        <button type="button" onClick={refresh} disabled={loading} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">
          Refresh
        </button>
      </div>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}
        >
          {message.text}
        </p>
      )}

      {loading && <ListSkeleton rows={2} label="Loading link requests" />}

      {!loading && error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>Could not load link requests.</p>
          <ul className="list-disc pl-5">
            {apiErrorDetails(error).messages.map((text) => <li key={text}>{text}</li>)}
          </ul>
          <button type="button" onClick={refresh} className="mt-1 underline">Try again</button>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600">No requests waiting.</p>
      )}

      {!loading && !error && requests.length > 0 && (
        <ul className="divide-y">
          {requests.map((request) => {
            const busy = String(busyId) === String(request.id);
            return (
              <li key={request.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-2 text-sm sm:grid-cols-3 md:flex-1">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Parent</p>
                    <p className="font-medium">{personName(request.parent)}</p>
                    <p className="text-gray-600">{request.parent?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Child</p>
                    <p className="font-medium">{personName(request.student)}</p>
                    <p className="text-gray-600">{request.student?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Relationship</p>
                    <p>{capitalise(request.relationship)}</p>
                    <p className="text-gray-600">Requested {formatDay(request.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleApprove(request)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {busy ? "Working…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setMessage(null);
                      setRejectTarget(request);
                    }}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        title="Reject link request?"
        message={
          rejectTarget
            ? `${personName(rejectTarget.parent)} will not be linked to ${personName(rejectTarget.student)}.`
            : ""
        }
        confirmLabel="Reject request"
        variant="danger"
        onConfirm={handleReject}
        onClose={() => setRejectTarget(null)}
      />
    </section>
  );
}

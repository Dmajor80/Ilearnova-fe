import { useState } from "react";
import { Eye, Mail, RefreshCw, RotateCw, Search, X } from "lucide-react";
import { useSuperAdminEmails } from "@/hooks/superadmin";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    sent: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700"
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status || "Unknown"}
    </span>
  );
}

export default function EmailLogs() {
  const {
    loading,
    error,
    emails,
    totalEmails,
    mutating,
    fetchEmails,
    fetchEmailDetails,
    resendEmail,
    notification
  } = useSuperAdminEmails();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const pageSize = 10;
  const totalPages = Math.ceil(totalEmails / pageSize);

  const loadPage = (nextPage, nextSearch = search, nextStatus = status) => {
    setPage(nextPage);
    fetchEmails({
      search: nextSearch.trim(),
      status: nextStatus,
      page: nextPage
    });
  };

  const showDetails = async (email) => {
    setSelectedEmail(email);
    setDetailsLoading(true);
    setDetailsError("");
    try {
      setSelectedEmail(await fetchEmailDetails(email.id));
    } catch (requestError) {
      setDetailsError(requestError.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleResend = async (email) => {
    try {
      await resendEmail(email.id);
    } catch {
      // The hook displays the API error in its notification.
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-semibold text-gray-900">Email Logs</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">Review outbound email delivery and retry eligible messages.</p>
        </div>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            loadPage(1);
          }}
        >
          <label className="sr-only" htmlFor="email-search">Search recipients and subjects</label>
          <input
            id="email-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search recipient or subject"
            className="min-h-10 rounded-lg border px-3 text-sm"
          />
          <label className="sr-only" htmlFor="email-status">Filter by status</label>
          <select
            id="email-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-h-10 rounded-lg border px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
      </section>

      {notification.show && (
        <p role="status" className={`rounded-lg p-3 text-sm ${notification.type === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
          {notification.message}
        </p>
      )}

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <span>{error.message}</span>
          <button type="button" onClick={() => loadPage(page)} className="font-medium underline">Retry</button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-semibold text-gray-900">{totalEmails} email{totalEmails === 1 ? "" : "s"}</h3>
          <button
            type="button"
            onClick={() => fetchEmails({ search: search.trim(), status, page })}
            disabled={loading}
            aria-label="Refresh email logs"
            className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {loading && emails.length === 0 ? (
          <p role="status" className="p-6 text-sm text-gray-600">Loading email logs…</p>
        ) : emails.length === 0 ? (
          <p className="p-6 text-sm text-gray-600">No email logs match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Recipient / subject</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Attempts</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Sent</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emails.map((email) => (
                  <tr key={email.id}>
                    <td className="max-w-sm px-5 py-4">
                      <p className="truncate font-medium text-gray-900">{email.to}</p>
                      <p className="truncate text-xs text-gray-500">{email.subject}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={email.status} /></td>
                    <td className="px-5 py-4">{email.attempts}</td>
                    <td className="px-5 py-4">{formatDate(email.created_at)}</td>
                    <td className="px-5 py-4">{formatDate(email.sent_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => showDetails(email)}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          <Eye className="h-3 w-3" /> Details
                        </button>
                        {email.can_resend && (
                          <button
                            type="button"
                            onClick={() => handleResend(email)}
                            disabled={mutating}
                            className="inline-flex items-center gap-1 rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <RotateCw className="h-3 w-3" /> Resend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-5 py-3 text-sm">
            <span className="text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || loading} onClick={() => loadPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Previous</button>
              <button type="button" disabled={page >= totalPages || loading} onClick={() => loadPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </section>

      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
          <section className="w-full max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="email-detail-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="email-detail-title" className="text-lg font-semibold text-gray-900">Email details</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedEmail.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedEmail(null)} aria-label="Close email details" className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {detailsLoading ? (
              <p role="status" className="text-sm text-gray-600">Loading email details…</p>
            ) : detailsError ? (
              <p role="alert" className="text-sm text-red-700">{detailsError}</p>
            ) : (
              <dl className="grid gap-3 text-sm sm:grid-cols-[120px_1fr]">
                <dt className="text-gray-500">Recipient</dt><dd className="break-all">{selectedEmail.to}</dd>
                <dt className="text-gray-500">Subject</dt><dd>{selectedEmail.subject}</dd>
                <dt className="text-gray-500">Status</dt><dd><StatusBadge status={selectedEmail.status} /></dd>
                <dt className="text-gray-500">Attempts</dt><dd>{selectedEmail.attempts}</dd>
                <dt className="text-gray-500">Last error</dt><dd className="break-words">{selectedEmail.last_error || "—"}</dd>
                <dt className="text-gray-500">Created</dt><dd>{formatDate(selectedEmail.created_at)}</dd>
                <dt className="text-gray-500">Sent</dt><dd>{formatDate(selectedEmail.sent_at)}</dd>
              </dl>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

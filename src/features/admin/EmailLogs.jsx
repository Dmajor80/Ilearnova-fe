import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Eraser, Eye, Mail, RefreshCw, RotateCw, Search, Trash2 } from "lucide-react";
import { asPage, superAdminApi } from "@/api/superAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { toast } from "@/lib/toast";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorAlert, PageCard, Pagination, Pill, formatDateTime } from "@/components/admin/AdminUI";
import useResource from "@/hooks/superadmin/useResource";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 20;
const STATUS = { pending: ["Pending", "amber"], sent: ["Sent", "green"], failed: ["Failed", "red"] };
const errorText = (err) => apiErrorDetails(err).messages.join(" ");

function StatusBadge({ status }) {
  const [label, tone] = STATUS[status] || [status || "Unknown", "gray"];
  return <Pill tone={tone}>{label}</Pill>;
}

function EmailDetails({ email, onClose }) {
  const details = useResource(() => superAdminApi.email(email.id), [email.id]);
  const e = details.data || email;
  return (
    <Modal open onClose={onClose} title="Email details" description={e.subject} size="lg">
      {details.loading && !details.data ? (
        <div role="status" aria-label="Loading email" className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      ) : (
        <>
          {details.error && <ErrorAlert message={errorText(details.error)} onRetry={details.reload} />}
          <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-[120px_1fr]">
            <dt className="text-gray-500">Recipient</dt><dd className="break-all text-gray-900">{e.to}</dd>
            <dt className="text-gray-500">Subject</dt><dd className="text-gray-900">{e.subject}</dd>
            <dt className="text-gray-500">Status</dt><dd><StatusBadge status={e.status} /></dd>
            <dt className="text-gray-500">Attempts</dt><dd className="text-gray-900">{e.attempts ?? "—"}</dd>
            <dt className="text-gray-500">Last error</dt><dd className="break-words text-gray-900">{e.last_error || "—"}</dd>
            <dt className="text-gray-500">Created</dt><dd className="text-gray-900">{formatDateTime(e.created_at)}</dd>
            <dt className="text-gray-500">Sent</dt><dd className="text-gray-900">{formatDateTime(e.sent_at)}</dd>
          </dl>
          {(e.body || e.text_body || e.html_body) && (
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs text-gray-700">{e.body || e.text_body || e.html_body}</pre>
          )}
        </>
      )}
    </Modal>
  );
}

export default function EmailLogs() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [resending, setResending] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [purge, setPurge] = useState(null);
  const query = useDebouncedValue(search.trim(), 300);

  useEffect(() => setPage(1), [query, status]);

  const list = useResource(
    async () => asPage(await superAdminApi.emails({ page, page_size: PAGE_SIZE, search: query || undefined, status: status || undefined })),
    [page, query, status]
  );

  const setStatus = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set("status", value);
    else next.delete("status");
    setParams(next, { replace: true });
  };

  const items = list.data?.items || [];
  const total = list.data?.total || 0;

  return (
    <div className="space-y-5">
      <PageCard title="Email Logs" icon={Mail} description="Every email the platform sends. Resend ones that failed.">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label className="sr-only" htmlFor="email-search">Search recipients and subjects</label>
            <input id="email-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recipient or subject" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
          </div>
          <label className="sr-only" htmlFor="email-status">Filter by status</label>
          <select id="email-status" value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          <button
            type="button"
            onClick={() => setPurge({ status: "", days: "30" })}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:ml-auto"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" /> Clear old emails
          </button>
          <button type="button" onClick={list.reload} disabled={list.loading} aria-label="Refresh email logs" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${list.loading ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </PageCard>

      <ErrorAlert message={list.error && errorText(list.error)} onRetry={list.reload} />

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {list.loading && !list.data ? (
          <TableSkeleton columns={5} label="Loading email logs" />
        ) : !items.length ? (
          <EmptyState icon={Mail} title="No emails match these filters" />
        ) : (
          <div className={`overflow-x-auto transition-opacity ${list.loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3">Recipient / subject</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3 text-right">Attempts</th>
                  <th scope="col" className="px-3 py-3">Created</th>
                  <th scope="col" className="px-3 py-3">Sent</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50/60">
                    <td className="max-w-sm px-5 py-3">
                      <p className="truncate font-medium text-gray-900">{email.to}</p>
                      <p className="truncate text-xs text-gray-500">{email.subject}</p>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={email.status} /></td>
                    <td className="px-3 py-3 text-right tabular-nums">{email.attempts}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">{formatDateTime(email.created_at)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">{formatDateTime(email.sent_at)}</td>
                    <td className="px-3 py-3 text-right">
                      <ActionsMenu
                        label={`Actions for email to ${email.to}`}
                        items={[
                          { id: "details", label: "Details", icon: Eye, onSelect: () => setViewing(email) },
                          { id: "resend", label: "Resend", icon: RotateCw, hidden: !email.can_resend, onSelect: () => setResending(email) },
                          { id: "delete", label: "Delete", icon: Trash2, danger: true, separatorBefore: true, onSelect: () => setDeleting(email) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} disabled={list.loading} />
      </section>

      {viewing && <EmailDetails email={viewing} onClose={() => setViewing(null)} />}
      <ConfirmDialog
        open={Boolean(resending)}
        title="Resend this email?"
        message={resending ? `“${resending.subject}” will be sent to ${resending.to} again.` : ""}
        confirmLabel="Resend"
        onConfirm={async () => {
          try {
            await superAdminApi.resendEmail(resending.id);
          } catch (err) {
            throw new Error(errorText(err));
          }
          toast(`Email to ${resending.to} queued to resend.`);
          list.reload();
        }}
        onClose={() => setResending(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this email log?"
        message={deleting ? `The record of “${deleting.subject}” to ${deleting.to} will be removed. The email itself isn't recalled.` : ""}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          try {
            await superAdminApi.deleteEmail(deleting.id);
          } catch (err) {
            throw new Error(errorText(err));
          }
          toast("Email log deleted.");
          list.reload();
        }}
        onClose={() => setDeleting(null)}
      />
      <ConfirmDialog
        open={Boolean(purge)}
        title="Clear old emails?"
        variant="danger"
        confirmLabel="Clear emails"
        message={
          purge && (
            <div className="space-y-3">
              <p>Permanently delete old email records. Pending emails are never cleared.</p>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">Which emails</span>
                <select
                  aria-label="Which emails"
                  value={purge.status}
                  onChange={(e) => setPurge({ ...purge, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Sent and failed</option>
                  <option value="sent">Sent only</option>
                  <option value="failed">Failed only</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">Older than (days)</span>
                <input
                  aria-label="Older than (days)"
                  type="number"
                  min="0"
                  step="1"
                  value={purge.days}
                  onChange={(e) => setPurge({ ...purge, days: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          )
        }
        onConfirm={async () => {
          const days = Number(purge.days);
          if (!Number.isInteger(days) || days < 0) throw new Error("Enter a whole number of days (0 or more).");
          let result;
          try {
            result = await superAdminApi.purgeEmails({ ...(purge.status ? { status: purge.status } : {}), older_than_days: days });
          } catch (err) {
            throw new Error(errorText(err));
          }
          const n = result?.deleted ?? 0;
          toast(`Cleared ${n} email${n === 1 ? "" : "s"}.`);
          list.reload();
        }}
        onClose={() => setPurge(null)}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Megaphone, Plus, RefreshCw, Trash2 } from "lucide-react";
import { schoolAnnouncementsApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { toast } from "@/lib/toast";
import { formatDate } from "@/features/billing/subscriptionUtils";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal, { Button } from "@/components/ui/Modal";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorAlert, Field } from "@/components/admin/AdminUI";

const errorText = (err) => apiErrorDetails(err).messages.join(" ");
const MAX_TITLE = 200;

function NewAnnouncementModal({ onClose, onPosted }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = title.trim() && message.trim();

  const post = async (event) => {
    event?.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      const row = await schoolAnnouncementsApi.create({ title: title.trim(), message: message.trim() });
      onPosted(row);
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      closeDisabled={busy}
      title="New announcement"
      description="Everyone at the school sees it: students, parents and teachers."
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" loading={busy} disabled={!ready} onClick={post}>
            Post announcement
          </Button>
        </>
      }
    >
      <form onSubmit={post} className="space-y-4">
        <Field label="Title" required>
          <input value={title} maxLength={MAX_TITLE} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mid-term break" />
        </Field>
        <Field label="Message" required>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. School closes on Friday 28th and reopens on Monday 8th."
          />
        </Field>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </form>
    </Modal>
  );
}

/** School admins: post announcements to the whole school and remove old ones. */
export default function OrganizationAnnouncements() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    schoolAnnouncementsApi
      .list()
      .then(setRows)
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Megaphone className="h-5 w-5 text-blue-600" aria-hidden="true" /> Announcements
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Shown on the Announcements page of every student, parent and teacher at your school.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={load} disabled={loading} aria-label="Reload announcements" className="rounded-lg border p-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button type="button" onClick={() => setCreating(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> New announcement
          </button>
        </div>
      </header>

      <ErrorAlert message={error} onRetry={load} />

      {loading && !rows ? (
        <ListSkeleton rows={4} label="Loading announcements" />
      ) : rows?.length ? (
        <ul className="divide-y divide-gray-100">
          {rows.map((a) => (
            <li key={a.id} className="flex items-start gap-3 py-4">
              <article className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-xs text-gray-500">
                  {[formatDate(a.created_at), a.author_name].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{a.message}</p>
              </article>
              <ActionsMenu
                label={`Actions for ${a.title}`}
                items={[{ id: "delete", label: "Delete", icon: Trash2, danger: true, onSelect: () => setDeleting(a) }]}
              />
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <EmptyState icon={Megaphone} title="No announcements yet">
            Post one to tell the whole school about a holiday, an event or a change.
          </EmptyState>
        )
      )}

      {creating && (
        <NewAnnouncementModal
          onClose={() => setCreating(false)}
          onPosted={(row) => {
            setCreating(false);
            if (row?.id != null) setRows((list) => [row, ...(list || [])]);
            else load();
            toast("Announcement posted.");
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete "${deleting?.title}"?`}
        message="It disappears from everyone's Announcements page. This can't be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          try {
            await schoolAnnouncementsApi.remove(deleting.id);
          } catch (err) {
            throw new Error(errorText(err));
          }
          setRows((list) => (list || []).filter((r) => r.id !== deleting.id));
          toast("Announcement deleted.");
        }}
        onClose={() => setDeleting(null)}
      />
    </section>
  );
}

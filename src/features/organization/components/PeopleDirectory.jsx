import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCheck, RefreshCw, Search, Upload } from "lucide-react";
import useSchoolMembers, { MEMBER_STATUSES } from "@/hooks/organization/useSchoolMembers";
import useOrganizationClasses from "@/hooks/organization/useOrganizationClasses";
import GenericModal from "./GenericModal";
import ImportStudentsModal from "./ImportStudentsModal";

const PILL_LABEL = { all: "All", active: "Active", pending: "Pending", suspended: "Suspended" };
const STATUS_TONE = {
  active: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  suspended: "bg-red-100 text-red-800",
};

const COPY = {
  student: {
    title: "Students",
    blurb: "Everyone in your school. Students who joined with your school code wait under Pending until you verify them.",
    detail: (m) => m.class_name || "—",
    detailLabel: "Class",
    empty: {
      all: "No students yet. Add them one by one or import a sheet.",
      active: "No active students.",
      pending: "No students are waiting for verification.",
      suspended: "No suspended students.",
    },
  },
  teacher: {
    title: "Teachers",
    blurb: "Everyone who teaches in your school. Teachers who joined with your school code wait under Pending until you verify them.",
    detail: (m) => m.subject || m.qualification || "—",
    detailLabel: "Subject",
    empty: {
      all: "No teachers yet.",
      active: "No active teachers.",
      pending: "No teachers are waiting for verification.",
      suspended: "No suspended teachers.",
    },
  },
};

const nameOf = (m) => m.full_name || m.email || "Unknown";

/** Add / edit form; students also get the school's classes to pick from. */
function StudentForm(props) {
  const { classes } = useOrganizationClasses({ page: 1 });
  return <GenericModal {...props} availableClasses={classes || []} />;
}

/** Confirm a suspend or reject before it happens. */
function ConfirmDialog({ confirm, busy, onCancel, onConfirm }) {
  if (!confirm) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="people-confirm-title" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 id="people-confirm-title" className="text-lg font-semibold text-gray-900">{confirm.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{confirm.body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50">
            {confirm.action}
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * A school's students or teachers in one list: status pills (all, active,
 * pending, suspended) with counts, search, and pages of 20. Pending people
 * are verified or rejected here; active ones can be suspended and
 * reinstated later. The pill lives in the URL (?status=pending) so other
 * screens can link straight to it.
 */
export default function PeopleDirectory({ kind }) {
  const copy = COPY[kind];
  const MemberForm = kind === "student" ? StudentForm : GenericModal;
  const [params, setParams] = useSearchParams();
  const status = MEMBER_STATUSES.includes(params.get("status")) ? params.get("status") : "all";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null);
  const [editing, setEditing] = useState(null); // null, "new" or a member
  const [showImport, setShowImport] = useState(false);
  const [message, setMessage] = useState(null);

  const api = useSchoolMembers(kind, { status, search, page });

  // A new pill or search starts again from page one with nothing ticked.
  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [status, search]);

  const pendingRows = useMemo(() => api.rows.filter((m) => m.status === "pending"), [api.rows]);
  const allPendingSelected = pendingRows.length > 0 && pendingRows.every((m) => selected.has(m.id));

  const choosePill = (pill) => {
    const next = new URLSearchParams(params);
    if (pill === "all") next.delete("status");
    else next.set("status", pill);
    setParams(next, { replace: true });
  };

  const toggle = (id) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const act = async (request, success) => {
    setMessage(null);
    try {
      await request();
      setMessage({ type: "success", text: success });
      return true;
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      return false;
    }
  };

  const verifySelected = async () => {
    const chosen = pendingRows.filter((m) => selected.has(m.id));
    if (await act(() => api.verifyMany(chosen), `Verified ${chosen.length} ${kind}${chosen.length === 1 ? "" : "s"}.`)) {
      setSelected(new Set());
    }
  };

  const save = async (data) => {
    const ok = editing === "new"
      ? await act(() => api.create(data), `Added ${data.email}.`)
      : await act(() => api.update(editing, data), `Saved ${nameOf(editing)}.`);
    if (ok) setEditing(null);
  };

  const runConfirmed = async () => {
    const done = await act(confirm.run, confirm.success);
    if (done) setConfirm(null);
  };

  const askSuspend = (m) =>
    setConfirm({
      title: `Suspend ${nameOf(m)}?`,
      body: `They lose access to your school until you reinstate them. Their records stay, and their account still works for any other school.`,
      action: "Suspend",
      run: () => api.suspend(m),
      success: `${nameOf(m)} is suspended.`,
    });

  const askReject = (m) =>
    setConfirm({
      title: `Reject ${nameOf(m)}?`,
      body: "They will not get access to your school. They can ask to join again later.",
      action: "Reject",
      run: () => api.reject(m),
      success: `Rejected ${nameOf(m)}.`,
    });

  const { pages = 0, has_next: hasNext, has_prev: hasPrev } = api.pagination;

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">{copy.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">{copy.blurb}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setEditing("new")} className="min-h-[44px] rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Add {kind}
          </button>
          {kind === "student" && (
            <button type="button" onClick={() => setShowImport(true)} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Upload className="h-4 w-4" /> Import
            </button>
          )}
          <button type="button" onClick={api.reload} aria-label={`Refresh ${copy.title.toLowerCase()}`} className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {MEMBER_STATUSES.map((pill) => (
            <button
              key={pill}
              type="button"
              aria-pressed={status === pill}
              onClick={() => choosePill(pill)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                status === pill ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {PILL_LABEL[pill]}
              <span className={`rounded-full px-1.5 text-xs ${status === pill ? "bg-white/20" : pill === "pending" && api.counts.pending ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}>
                {api.counts[pill]}
              </span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search {copy.title.toLowerCase()}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-lg border py-2 pl-9 pr-3"
          />
        </label>
      </div>

      {pendingRows.length > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-lg border bg-amber-50 p-3 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-amber-900">
            {api.counts.pending} waiting for verification. Tick them and verify together, e.g. a whole new intake.
          </p>
          <button
            type="button"
            disabled={!selected.size || api.mutating}
            onClick={verifySelected}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" /> Verify selected ({selected.size})
          </button>
        </div>
      )}

      {message && (
        <p role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}>
          {message.text}
        </p>
      )}
      {api.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{api.error}</p>}

      {api.loading && !api.rows.length ? (
        <p className="py-8 text-center text-gray-500">Loading {copy.title.toLowerCase()}…</p>
      ) : api.rows.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-10 px-3 py-3">
                  {pendingRows.length > 0 && (
                    <input
                      type="checkbox"
                      aria-label="Select all pending on this page"
                      checked={allPendingSelected}
                      onChange={() => setSelected(allPendingSelected ? new Set() : new Set(pendingRows.map((m) => m.id)))}
                      className="h-4 w-4"
                    />
                  )}
                </th>
                <th scope="col" className="px-3 py-3 text-left font-semibold text-gray-600">Name</th>
                <th scope="col" className="hidden px-3 py-3 text-left font-semibold text-gray-600 sm:table-cell">Email</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold text-gray-600">{copy.detailLabel}</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold text-gray-600">Status</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {api.rows.map((m) => (
                <tr key={m.id} className={selected.has(m.id) ? "bg-blue-50" : undefined}>
                  <td className="px-3 py-3">
                    {m.status === "pending" && (
                      <input type="checkbox" aria-label={`Select ${nameOf(m)}`} checked={selected.has(m.id)} onChange={() => toggle(m.id)} className="h-4 w-4" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{nameOf(m)}</td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-gray-600 sm:table-cell">{m.email}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600">{copy.detail(m)}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_TONE[m.status] || "bg-gray-100 text-gray-700"}`}>
                      {PILL_LABEL[m.status] || m.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-end gap-3">
                      {m.status === "pending" && (
                        <>
                          <button type="button" disabled={api.mutating} onClick={() => act(() => api.verify(m), `Verified ${nameOf(m)}.`)} className="font-medium text-green-700 hover:underline disabled:opacity-50">
                            Verify
                          </button>
                          <button type="button" disabled={api.mutating} onClick={() => askReject(m)} className="text-red-700 hover:underline disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                      {m.status === "active" && (
                        <>
                          <button type="button" onClick={() => setEditing(m)} className="text-blue-700 hover:underline">Edit</button>
                          <button type="button" disabled={api.mutating} onClick={() => askSuspend(m)} className="text-red-700 hover:underline disabled:opacity-50">
                            Suspend
                          </button>
                        </>
                      )}
                      {m.status === "suspended" && (
                        <button type="button" disabled={api.mutating} onClick={() => act(() => api.reinstate(m), `${nameOf(m)} is back.`)} className="font-medium text-green-700 hover:underline disabled:opacity-50">
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !api.error && (
          <p className="py-8 text-center text-gray-500">
            {search ? `No ${copy.title.toLowerCase()} match "${search}".` : copy.empty[status]}
          </p>
        )
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-end gap-3 text-sm">
          <button type="button" disabled={!hasPrev || api.loading} onClick={() => { setSelected(new Set()); setPage((p) => p - 1); }} className="rounded border px-3 py-2 disabled:opacity-50">
            Previous
          </button>
          <span>Page {page} of {pages}</span>
          <button type="button" disabled={!hasNext || api.loading} onClick={() => { setSelected(new Set()); setPage((p) => p + 1); }} className="rounded border px-3 py-2 disabled:opacity-50">
            Next
          </button>
        </nav>
      )}

      <ConfirmDialog confirm={confirm} busy={api.mutating} onCancel={() => setConfirm(null)} onConfirm={runConfirmed} />
      {editing !== null && (
        <MemberForm
          item={editing === "new" ? null : editing}
          type={kind}
          saving={api.mutating}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {showImport && <ImportStudentsModal onClose={() => setShowImport(false)} onImported={api.reload} />}
    </div>
  );
}

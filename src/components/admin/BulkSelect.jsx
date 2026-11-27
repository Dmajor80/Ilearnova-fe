import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { superAdminApi } from "@/api/superAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { countLabel } from "@/lib/countLabel";
import Modal, { Button } from "@/components/ui/Modal";
import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

const CHUNK = 500; // the API's limit per call
const chunks = (list) => Array.from({ length: Math.ceil(list.length / CHUNK) }, (_, i) => list.slice(i * CHUNK, (i + 1) * CHUNK));
const errorText = (err) => apiErrorDetails(err).messages.join(" ");
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Header checkbox: checked when the whole page is selected, dash when some are. */
export function SelectPageCheckbox({ selection, pageIds, label }) {
  const ref = useRef(null);
  const selectedOnPage = pageIds.filter((id) => selection.has(id)).length;
  const all = pageIds.length > 0 && selectedOnPage === pageIds.length;
  const some = selectedOnPage > 0 && !all;
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = some;
  }, [some]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={all}
      onChange={() => selection.togglePage(pageIds)}
      disabled={!pageIds.length}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}

export function RowCheckbox({ selection, id, label }) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={selection.has(id)}
      onChange={() => selection.toggle(id)}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}

/**
 * Shown while rows are selected: the count, "Select all N matching" once
 * the whole page is ticked (fetches every matching id), Clear, and Delete.
 */
export function SelectionBar({ selection, pageIds, total, noun, loadAllIds, onDelete }) {
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState("");
  if (!selection.count) return null;

  const pageFullySelected = pageIds.length > 0 && pageIds.every((id) => selection.has(id));
  const canSelectAll = pageFullySelected && selection.count < total;

  const selectAll = async () => {
    setLoadingAll(true);
    setError("");
    try {
      const result = await loadAllIds();
      selection.set(result?.ids || []);
    } catch (err) {
      setError(`Couldn't select them all: ${errorText(err)}`);
    } finally {
      setLoadingAll(false);
    }
  };

  return (
    <div
      role="region"
      aria-label="Selection"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-blue-100 bg-blue-50 px-5 py-2.5 text-sm text-blue-900"
    >
      <span aria-live="polite" className="font-medium">
        {plural(selection.count, noun)} selected
      </span>
      {canSelectAll && (
        <button type="button" onClick={selectAll} disabled={loadingAll} className="font-medium text-blue-700 underline-offset-2 hover:underline disabled:opacity-60">
          {loadingAll ? "Selecting…" : `Select all ${total} ${total === 1 ? noun : `${noun}s`}`}
        </button>
      )}
      <button type="button" onClick={selection.clear} className="text-blue-700 underline-offset-2 hover:underline">
        Clear selection
      </button>
      {error && (
        <span role="alert" className="text-red-700">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-lg bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete selected
      </button>
    </div>
  );
}

function Reasons({ title, items }) {
  if (!items.length) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
      <p className="mb-1.5 font-medium">{title}</p>
      <ul aria-label={title} className="max-h-48 space-y-1 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id}>
            <span className="font-medium">{item.name || "Unknown"}</span>: {item.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Delete a selection. Previews first (what goes with it, which rows are
 * blocked and why), asks for "DELETE" to be typed, then deletes in batches.
 * Blocked rows are skipped by the API with their reason, so the rules for a
 * single delete all still apply. Afterwards it reports what happened.
 */
export function BulkDeleteDialog({ open, resource, ids, noun, warning, onClose, onDone }) {
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const cancelRef = useRef(null);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    if (!open) return undefined;
    setCheck(null);
    setTyped("");
    setBusy(false);
    setResult(null);
    setError("");
    let live = true;
    setLoading(true);
    (async () => {
      const merged = { deletable: 0, blocked: 0, related: {}, items: [] };
      for (const part of chunks(idsRef.current)) {
        const r = await superAdminApi.bulkDeleteCheck(resource, part);
        merged.deletable += r?.deletable || 0;
        merged.blocked += r?.blocked || 0;
        merged.items.push(...(r?.items || []));
        Object.entries(r?.related || {}).forEach(([k, n]) => (merged.related[k] = (merged.related[k] || 0) + n));
      }
      return merged;
    })()
      .then((merged) => live && setCheck(merged))
      .catch((err) => live && setError(`Couldn't check the selection: ${errorText(err)}`))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [open, resource]);

  const many = `${noun}s`;
  const deletable = check?.deletable || 0;
  const blockedItems = (check?.items || []).filter((i) => i.reason);
  const related = Object.entries(check?.related || {}).filter(([, n]) => n > 0);
  const canDelete = !loading && !busy && !result && deletable > 0 && typed === "DELETE";

  const run = async () => {
    if (!canDelete) return;
    setBusy(true);
    setError("");
    const done = { deleted: [], skipped: [] };
    try {
      for (const part of chunks(idsRef.current)) {
        const r = await superAdminApi.bulkDelete(resource, part);
        done.deleted.push(...(r?.deleted || []));
        done.skipped.push(...(r?.skipped || []));
      }
    } catch (err) {
      setError(`Stopped part-way: ${errorText(err)}`);
    }
    setBusy(false);
    setResult(done);
    onDone?.(done);
  };

  const close = () => {
    if (!busy) onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      role="alertdialog"
      size="md"
      title={result ? "Deletion finished" : `Delete ${plural(ids.length, noun, many)} permanently?`}
      hideClose
      closeDisabled={busy}
      initialFocusRef={cancelRef}
      footer={
        result ? (
          <Button ref={cancelRef} variant="primary" onClick={close}>
            Done
          </Button>
        ) : (
          <>
            <Button ref={cancelRef} onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} disabled={!canDelete} onClick={run}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {deletable ? `Delete ${plural(deletable, noun, many)}` : "Delete"}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        {result ? (
          <>
            <p role="status" className="font-medium text-gray-900">
              {plural(result.deleted.length, noun, many)} deleted
              {result.skipped.length ? `, ${result.skipped.length} kept` : ""}.
            </p>
            <Reasons title="Kept, and why" items={result.skipped} />
          </>
        ) : (
          <>
            <div className="flex gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                {warning && <p>{warning}</p>}
                <p className="font-medium text-red-700">This can&apos;t be undone.</p>
              </div>
            </div>

            {loading && (
              <SkeletonRegion label="Checking the selection" className="space-y-2 rounded-lg border border-gray-100 p-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </SkeletonRegion>
            )}

            {check && !loading && (
              <>
                <p className="text-gray-900">
                  <strong>{plural(deletable, noun, many)}</strong> will be deleted
                  {blockedItems.length ? (
                    <>
                      ; <strong>{blockedItems.length}</strong> can&apos;t be and will be kept.
                    </>
                  ) : (
                    "."
                  )}
                </p>
                {related.length > 0 && (
                  <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                    <p className="mb-1.5 font-medium text-gray-900">This also permanently removes:</p>
                    <ul aria-label="What will be deleted" className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
                      {related.map(([label, n]) => (
                        <li key={label} className="tabular-nums">
                          {countLabel(n, label)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Reasons title="Will be kept" items={blockedItems} />
                {deletable > 0 && (
                  <div>
                    <label htmlFor="bulk-delete-confirm" className="mb-1 block text-gray-700">
                      Type <span className="font-mono font-semibold text-gray-900">DELETE</span> to confirm
                    </label>
                    <input
                      id="bulk-delete-confirm"
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && run()}
                      autoComplete="off"
                      spellCheck={false}
                      disabled={busy}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-2 text-red-700">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

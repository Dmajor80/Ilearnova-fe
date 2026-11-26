import { useEffect, useId, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import Modal, { Button } from "./Modal";
import { Skeleton, SkeletonRegion } from "./Skeleton";

const errorReason = (err) => err?.data?.error || err?.data?.detail || err?.message || "That didn't work. Try again.";
const countList = (counts) => Object.entries(counts || {}).filter(([, n]) => n > 0);

/** "1 school role", "1 class", "1 timetable entry"; plural labels come from the API. */
function countLabel(n, label) {
  if (n !== 1) return `${n} ${label}`;
  let one = label;
  if (/ies$/.test(label)) one = label.replace(/ies$/, "y");
  else if (/(ss|ch|sh|x)es$/.test(label)) one = label.replace(/es$/, "");
  else if (/s$/.test(label)) one = label.replace(/s$/, "");
  return `${n} ${one}`;
}

/**
 * Permanent-delete confirmation.
 *
 * - `loadCheck()` (optional) resolves to the API's delete-check
 *   `{ can_delete, reason, blockers, related, note }`: a skeleton shows while
 *   it loads, then the list of what goes with the record.
 * - `confirmText` (optional) must be typed exactly to enable the button.
 * - `onDelete()` does the delete. A 409 (or a check with `can_delete: false`)
 *   switches the dialog to its blocked state: the reason inline, plus
 *   "Deactivate instead" when `onDeactivate` is given.
 * - `onDeleted()` runs after a successful delete, then the dialog closes.
 */
export default function DeleteDialog({
  open,
  title,
  message,
  confirmText,
  loadCheck,
  onDelete,
  onDeleted,
  onDeactivate,
  deactivateLabel = "Deactivate instead",
  confirmLabel = "Delete permanently",
  onClose,
}) {
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(null);
  const [error, setError] = useState("");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef(null);
  const inputId = useId();
  const loadRef = useRef(loadCheck);
  loadRef.current = loadCheck;

  useEffect(() => {
    if (!open) return undefined;
    setCheck(null);
    setBlocked(null);
    setError("");
    setTyped("");
    setBusy(false);
    if (!loadRef.current) return undefined;
    let live = true;
    setLoading(true);
    Promise.resolve(loadRef.current())
      .then((result) => {
        if (!live) return;
        setCheck(result || null);
        if (result && result.can_delete === false) {
          setBlocked({ reason: result.reason || "This can't be deleted.", blockers: result.blockers || {} });
        }
      })
      .catch((err) => live && setError(`Couldn't check what would be deleted: ${errorReason(err)}`))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [open]);

  const close = () => {
    if (busy) return;
    onClose?.();
  };

  const gateOk = !confirmText || typed === confirmText;
  const canDelete = !blocked && !loading && gateOk && !busy;

  const doDelete = async () => {
    if (!canDelete) return;
    setBusy(true);
    setError("");
    try {
      await onDelete?.();
    } catch (err) {
      setBusy(false);
      if (err?.status === 409) setBlocked({ reason: errorReason(err), blockers: err?.data?.blockers || {} });
      else setError(errorReason(err));
      return;
    }
    setBusy(false);
    onDeleted?.();
    onClose?.();
  };

  const doDeactivate = async () => {
    setBusy(true);
    setError("");
    try {
      await onDeactivate();
    } catch (err) {
      setBusy(false);
      setError(errorReason(err));
      return;
    }
    setBusy(false);
    onClose?.();
  };

  const related = countList(check?.related);

  return (
    <Modal
      open={open}
      onClose={close}
      role="alertdialog"
      size="sm"
      title={title}
      hideClose
      closeDisabled={busy}
      initialFocusRef={cancelRef}
      footer={
        <>
          <Button ref={cancelRef} onClick={close} disabled={busy}>Cancel</Button>
          <Button variant="danger" loading={busy && !blocked} disabled={!canDelete} onClick={doDelete}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            {message ? (typeof message === "string" ? <p>{message}</p> : message) : null}
            <p className="font-medium text-red-700">This can't be undone.</p>
          </div>
        </div>

        {loading && (
          <SkeletonRegion label="Checking what will be deleted" className="space-y-2 rounded-lg border border-gray-100 p-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </SkeletonRegion>
        )}

        {!loading && related.length > 0 && (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
            <p className="mb-1.5 font-medium text-gray-900">
              {blocked ? "Linked to this record:" : "This also permanently removes:"}
            </p>
            <ul aria-label="What will be deleted" className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
              {related.map(([label, n]) => (
                <li key={label} className="tabular-nums">
                  {countLabel(n, label)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && check?.note && <p className="text-gray-600">{check.note}</p>}

        {blocked ? (
          <div role="alert" className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <p className="font-medium">Can't delete permanently</p>
            <p>{blocked.reason}</p>
            {countList(blocked.blockers).length > 0 && (
              <ul className="list-inside list-disc">
                {countList(blocked.blockers).map(([label, n]) => (
                  <li key={label}>{countLabel(n, label)}</li>
                ))}
              </ul>
            )}
            {onDeactivate && (
              <Button onClick={doDeactivate} loading={busy} className="mt-1">
                {deactivateLabel}
              </Button>
            )}
          </div>
        ) : (
          confirmText &&
          !loading && (
            <div>
              <label htmlFor={inputId} className="mb-1 block text-gray-700">
                Type <span className="select-all font-mono font-semibold text-gray-900">{confirmText}</span> to confirm
              </label>
              <input
                id={inputId}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") doDelete();
                }}
                autoComplete="off"
                spellCheck={false}
                disabled={busy}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>
          )
        )}

        {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-red-700">{error}</p>}
      </div>
    </Modal>
  );
}

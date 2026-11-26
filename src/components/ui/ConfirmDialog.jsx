import { useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal, { Button } from "./Modal";

/**
 * Confirmation in place of window.confirm.
 *
 * `onConfirm` may return a promise: the confirm button shows a spinner until
 * it settles, the dialog closes on success, and an error is shown inside the
 * dialog on failure. `variant="danger"` paints the action red and focuses
 * Cancel first.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const danger = variant === "danger";

  const close = () => {
    if (busy) return;
    setError("");
    onClose?.();
  };

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm?.();
      setBusy(false);
      onClose?.();
    } catch (err) {
      setBusy(false);
      setError(err?.message || "That didn't work. Try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      role="alertdialog"
      size="sm"
      title={title}
      hideClose
      closeDisabled={busy}
      initialFocusRef={danger ? cancelRef : confirmRef}
      footer={
        <>
          <Button ref={cancelRef} onClick={close} disabled={busy}>{cancelLabel}</Button>
          <Button ref={confirmRef} variant={danger ? "danger" : "primary"} loading={busy} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        {danger && (
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
          </span>
        )}
        <div className="space-y-2 text-sm text-gray-700">
          {typeof message === "string" ? <p>{message}</p> : message}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-red-700">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}

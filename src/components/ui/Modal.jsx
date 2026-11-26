import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SIZES = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

/**
 * Accessible modal dialog: renders in a portal, traps focus, closes on Esc
 * and on a click outside, restores focus to whatever opened it.
 *
 * `role="alertdialog"` for confirmations. `initialFocusRef` picks the
 * element focused on open (default: the first focusable one).
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  role = "dialog",
  initialFocusRef,
  closeDisabled = false,
  hideClose = false,
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = closeDisabled ? null : onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const panel = panelRef.current;
    const first = initialFocusRef?.current || panel?.querySelector(FOCUSABLE) || panel;
    first?.focus?.();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, [open, initialFocusRef]);

  if (!open) return null;

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCloseRef.current?.();
      return;
    }
    if (event.key !== "Tab") return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current?.();
      }}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`flex max-h-[92vh] w-full ${SIZES[size] || SIZES.md} flex-col rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl`}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 pb-4 pt-5">
            <div className="min-w-0">
              {title && <h2 id={titleId} className="text-lg font-semibold text-gray-900">{title}</h2>}
              {description && <p id={descId} className="mt-1 text-sm text-gray-600">{description}</p>}
            </div>
            {!hideClose && (
              <button
                type="button"
                onClick={() => onCloseRef.current?.()}
                disabled={closeDisabled}
                aria-label="Close"
                className="-mr-2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/** Standard modal buttons. */
export function Button({ variant = "secondary", loading = false, children, className = "", disabled, ...props }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500",
  };
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

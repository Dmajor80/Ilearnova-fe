/** Small building blocks shared by the superadmin pages. */
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cloneElement, isValidElement, useId } from "react";

export function formatDay(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function PageCard({ title, description, icon: Icon, actions, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-gray-100 bg-white shadow-sm ${className}`}>
      {(title || actions) && (
        <header className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                {Icon && <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                {title}
              </h2>
            )}
            {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

const PILL = {
  green: "bg-green-50 text-green-700 ring-green-600/20",
  gray: "bg-gray-100 text-gray-600 ring-gray-500/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export function Pill({ tone = "gray", children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PILL[tone] || PILL.gray}`}>
      {children}
    </span>
  );
}

export function ActivePill({ active }) {
  return <Pill tone={active ? "green" : "gray"}>{active ? "Active" : "Inactive"}</Pill>;
}

export const SUBSCRIPTION_STATES = {
  active: ["Active", "green"],
  expiring: ["Ending soon", "blue"],
  expiring_soon: ["Ending soon", "blue"],
  grace: ["Grace period", "amber"],
  read_only: ["Read-only", "red"],
  locked: ["Locked", "red"],
  expired: ["Expired", "red"],
  unmanaged: ["No subscription", "gray"],
  none: ["No subscription", "gray"],
};

export function SubscriptionPill({ state }) {
  const [label, tone] = SUBSCRIPTION_STATES[state] || [state ? String(state).replace(/_/g, " ") : "—", "gray"];
  return <Pill tone={tone}>{label}</Pill>;
}

export function ErrorAlert({ message, onRetry }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
      <span className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        {message}
      </span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-medium underline underline-offset-2">
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {Icon && <Icon className="h-10 w-10 text-gray-300" aria-hidden="true" />}
      <p className="mt-3 font-medium text-gray-900">{title}</p>
      {children && <div className="mt-1 text-sm text-gray-500">{children}</div>}
    </div>
  );
}

export function Pagination({ page, pageSize, total, onPage, disabled }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm">
      <span className="text-gray-500">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
        </button>
        <span className="text-gray-500">
          Page {page} of {pages}
        </span>
        <button type="button" disabled={disabled || page >= pages} onClick={() => onPage(page + 1)} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-40">
          Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 aria-[invalid=true]:border-red-400";

/** Label + control + hint/error, wired with ids for screen readers. */
export function Field({ label, required, hint, error, className = "", children }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
        className: children.props.className || inputClass,
      })
    : children;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      {control}
      {hint && !error && <p id={hintId} className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p id={errorId} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}


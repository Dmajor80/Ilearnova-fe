/**
 * How a school's subscription state shows up in the app.
 *
 * Timeline (backend defaults, set in .env): reminder 7 days before the end,
 * 3 days' grace with full access, 7 days read-only, then locked: admins can
 * only open billing and their profile; everyone else stays read-only.
 */

const SEVERITY = { locked: 4, read_only: 3, grace: 2, expiring: 1, active: 0, unmanaged: 0 };

export const BILLING_PATH = "/organization-dashboard/billing";

export const MODES = { FULL: "full", READ_ONLY: "read_only", BILLING_ONLY: "billing_only" };

/** The row for the selected school, else the most restricted one. */
export function pickStatus(rows = [], selectedOrgId = null) {
  if (!rows.length) return null;
  if (selectedOrgId) {
    const match = rows.find((r) => String(r.organization_id) === String(selectedOrgId));
    if (match) return match;
  }
  return [...rows].sort((a, b) => (SEVERITY[b.state] ?? 0) - (SEVERITY[a.state] ?? 0))[0];
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * `{ tone, text, canRenew }` for the banner, or null when there is nothing to
 * say. Admins are told to renew; others that the school is read-only.
 */
export function bannerFor(status) {
  if (!status) return null;
  const { state, is_admin: isAdmin, organization_name: school } = status;
  const end = formatDate(status.expires_at);
  switch (state) {
    case "expiring": {
      const days = status.days_left;
      const when = days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days (${end})`;
      return isAdmin
        ? { tone: "info", text: `${school}'s subscription ends ${when}. Renew to avoid interruption.`, canRenew: true }
        : null;
    }
    case "grace":
      return isAdmin
        ? {
            tone: "warning",
            text: `${school}'s subscription ended on ${end}. Renew before ${formatDate(status.grace_ends_at)} or the school becomes read-only.`,
            canRenew: true,
          }
        : null;
    case "read_only":
      return {
        tone: "danger",
        text: isAdmin
          ? `${school} is read-only: its subscription ended on ${end}. Renew before ${formatDate(status.locks_at)} to keep access.`
          : `${school} is read-only for now. You can view everything but can't make changes.`,
        canRenew: isAdmin,
      };
    case "locked":
      return {
        tone: "danger",
        text: isAdmin
          ? `${school}'s subscription has expired. Renew to restore access.`
          : `${school} is read-only for now. You can view everything but can't make changes.`,
        canRenew: isAdmin,
      };
    default:
      return null;
  }
}

/** Naira amounts from the API ("120000.00") as "₦120,000". */
export function naira(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export function planLength(days) {
  if (!days) return "No end date";
  if (days % 365 === 0) return days === 365 ? "1 year" : `${days / 365} years`;
  if (days % 30 === 0) return days === 30 ? "1 month" : `${days / 30} months`;
  return `${days} days`;
}

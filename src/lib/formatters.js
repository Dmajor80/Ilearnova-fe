/**
 * Formatting utilities for consistent display across the app
 */

export function formatCurrency(
  value,
  {
    locale = "en-NG",
    currency = "NGN",
    maximumFractionDigits = 0
  } = {}
) {
  const n = Number(value ?? 0);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits
    }).format(n);
  } catch {
    // Fallback: return plain number as string if Intl fails
    return String(n);
  }
}

/**
 * Generic number formatter with thousand separators
 */
export function formatNumber(
  value,
  {
    locale = "en-NG",
    maximumFractionDigits = 0
  } = {}
) {
  const n = Number(value ?? 0);
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits
    }).format(n);
  } catch {
    return String(n);
  }
}

/**
 * Convert a name/string to Title Case while preserving separators
 * - Handles spaces, hyphens, and apostrophes: e.g., "o'neill-smith jr" -> "O'Neill-Smith Jr"
 * - Leaves non-letter segments unchanged
 */
export function titleCase(value) {
  const raw = String(value ?? "");
  return raw
    .toLowerCase()
    .split(/(\s|-|')/)
    .map(part => (/^[a-z]/.test(part) ? part[0].toUpperCase() + part.slice(1) : part))
    .join("");
}

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

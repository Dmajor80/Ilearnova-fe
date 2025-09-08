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


/**
 * Format student ID to show only the first part (before first dash) or use student_id
 */
export function formatStudentId(student) {
  // Prefer student_id if available
  if (student.student_id) {
    return student.student_id;
  }

  // Otherwise, format the full ID to show only first part
  const fullId = student.id || "";
  if (fullId.includes("-")) {
    return fullId.split("-")[0];
  }

  // If no dash, show first 9 characters
  return fullId.length > 9 ? fullId.substring(0, 9) : fullId;
}

/**
 * Format date to show when the student was registered
 */
export function formatRegistrationDate(student) {
  const dateValue = student.created_at;

  if (!dateValue) return "N/A";

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "N/A";

    // Format as "MMM DD, YYYY" (e.g., "Mar 25, 2021")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return "N/A";
  }
}

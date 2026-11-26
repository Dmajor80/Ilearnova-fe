/** Small helpers for talking to the ilearnova-be API. */

/**
 * Pull readable messages out of an API error. The backend sends
 * `{ field_errors: { field: [msgs] }, non_field_errors: [...] }`; for score
 * sheets, `field_errors.rows[0]` maps row number to its problems.
 */
export function apiErrorDetails(error) {
  const data = error?.data || {};
  const fieldErrors = data.field_errors || {};
  let rows = {};
  const messages = [];
  for (const [field, value] of Object.entries(fieldErrors)) {
    if (field === "rows") {
      rows = (Array.isArray(value) ? value[0] : value) || {};
      continue;
    }
    const list = Array.isArray(value) ? value : [value];
    const flat = list.flatMap((v) => (Array.isArray(v) ? v : [v])).map(String);
    if (field === "incomplete") {
      messages.push(`Missing scores: ${flat.join(", ")}`);
    } else if (["detail", "file", "results", "components", "grade_bands"].includes(field)) {
      messages.push(...flat);
    } else {
      messages.push(...flat.map((m) => `${field}: ${m}`));
    }
  }
  messages.push(...(data.non_field_errors || []).map(String));
  if (!messages.length && !Object.keys(rows).length) {
    messages.push(data.error && data.error !== "Request failed" ? data.error : error?.message || "Something went wrong.");
  }
  return { messages, rows };
}

/** Save a Blob as a file (template sheets, PDF report cards). */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Field errors from a failed request as `{ field: "message" }`, plus
 * `_general` for anything not tied to a field. Understands the backend's
 * `{ field_errors, non_field_errors }` and plain DRF `{ field: [msgs] }`,
 * and errors wrapped by lib/errorHandler (context.originalError).
 */
export function fieldErrorsOf(error) {
  const data = error?.data ?? error?.context?.originalError?.data ?? null;
  const out = {};
  if (!data || typeof data !== "object") {
    out._general = error?.message || "Something went wrong.";
    return out;
  }
  const source = data.field_errors || data.errors || data;
  const general = [];
  Object.entries(source).forEach(([field, value]) => {
    if (["success", "code", "status"].includes(field)) return;
    const text = (Array.isArray(value) ? value.flat() : [value])
      .filter((v) => v !== null && v !== undefined && typeof v !== "object")
      .map(String)
      .join(" ");
    if (!text) return;
    if (["non_field_errors", "detail", "error", "message"].includes(field)) general.push(text);
    else out[field] = text;
  });
  (data.non_field_errors || []).forEach((m) => {
    if (!general.includes(String(m))) general.push(String(m));
  });
  if (general.length) out._general = general.join(" ");
  if (!Object.keys(out).length) out._general = error?.message || "Something went wrong.";
  return out;
}

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

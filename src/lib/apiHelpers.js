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

// Wrapper text the backend puts around field errors; never a reason to show.
const PLACEHOLDER = /^(validation failed|request failed|bad request)\.?$/i;
const FALLBACK = "Something went wrong. Please try again.";

const fallbackMessage = (error) => {
  const message = error?.message;
  return message && !PLACEHOLDER.test(message.trim()) ? message : FALLBACK;
};

/**
 * Field errors from a failed request as `{ field: "message" }`, plus
 * `_general` for anything not tied to a field. Understands the backend's
 * `{ field_errors, non_field_errors }` and plain DRF `{ field: [msgs] }`,
 * and errors wrapped by lib/errorHandler (context.originalError).
 */
export function fieldErrorsOf(error) {
  const out = serverErrorsOf(error);
  if (!Object.keys(out).length) out._general = fallbackMessage(error);
  return out;
}

/**
 * `errors` (from fieldErrorsOf) with messages for fields the form doesn't
 * show moved into `_general`, so no reason the server gave is hidden.
 */
export function keepShown(errors, shownFields) {
  const out = {};
  const general = [];
  Object.entries(errors).forEach(([field, message]) => {
    if (!message) return;
    if (field !== "_general" && shownFields.includes(field)) out[field] = message;
    else if (!general.includes(message)) general.push(message);
  });
  const real = general.filter((m) => m !== FALLBACK);
  // The generic fallback only when nothing else explains the failure.
  const shown = real.length ? real : Object.keys(out).length ? [] : general;
  if (shown.length) out._general = shown.join(" ");
  return out;
}

/** Like fieldErrorsOf, but only what the server actually said (may be {}). */
function serverErrorsOf(error) {
  const data = error?.data ?? error?.context?.originalError?.data ?? null;
  const out = {};
  if (!data || typeof data !== "object") return out;
  const source = data.field_errors || data.errors || data;
  const general = [];
  const addGeneral = (text) => {
    if (text && !PLACEHOLDER.test(text.trim()) && !general.includes(text)) general.push(text);
  };
  Object.entries(source).forEach(([field, value]) => {
    if (["success", "code", "status"].includes(field)) return;
    const text = (Array.isArray(value) ? value.flat() : [value])
      .filter((v) => v !== null && v !== undefined && typeof v !== "object")
      .map(String)
      .join(" ");
    if (!text) return;
    if (["non_field_errors", "detail", "error", "message"].includes(field)) addGeneral(text);
    else out[field] = text;
  });
  (Array.isArray(data.non_field_errors) ? data.non_field_errors : []).forEach((m) => addGeneral(String(m)));
  if (general.length) out._general = general.join(" ");
  return out;
}

/**
 * The server's own reason a request was refused, for a banner: its general
 * (non-field) message, else the first field message. Null for network and
 * 5xx errors, or when a 4xx carried nothing usable.
 */
export function serverReasonOf(error) {
  const status = error?.status ?? error?.context?.originalError?.status;
  if (!(status >= 400 && status < 500)) return null;
  const { _general, ...byField } = serverErrorsOf(error);
  return _general || Object.values(byField)[0] || null;
}

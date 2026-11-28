/* Course material uploads are documents only, matching the server's rules
 * (core_app/materials.py): PDF, Word, PowerPoint, Excel, OpenDocument, text
 * and CSV, up to 20 MB. The server has the final say; this only spares a
 * teacher an upload that would be refused. */

export const DOCUMENT_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
  ".odt", ".ods", ".odp", ".txt", ".csv",
];

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "text/plain",
  "text/csv",
];

/** For `<input type="file" accept=...>`. */
export const DOCUMENT_ACCEPT = [...DOCUMENT_EXTENSIONS, ...DOCUMENT_TYPES].join(",");

export const MAX_DOCUMENT_MB = 20;

export const DOCUMENT_HINT = `PDF, Word, PowerPoint, Excel, OpenDocument, text or CSV, up to ${MAX_DOCUMENT_MB} MB.`;

/** Why `file` can't be uploaded, or "" when it looks fine. */
export function documentProblem(file) {
  if (!file) return "";
  const name = String(file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  if (!DOCUMENT_EXTENSIONS.includes(ext)) return `Only documents can be uploaded: ${DOCUMENT_HINT}`;
  if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) return `File is too large: the limit is ${MAX_DOCUMENT_MB} MB.`;
  return "";
}

const NOT_FIELDS = new Set(["success", "error", "message", "detail"]);

/** The server's reason a material was refused, e.g. {"file": ["Only documents..."]}. */
export function materialErrorMessage(error) {
  const data = error?.data ?? error?.context?.originalError?.data;
  if (data && typeof data === "object") {
    const fields = data.field_errors || data;
    const messages = Object.entries(fields)
      .filter(([key]) => data.field_errors || !NOT_FIELDS.has(key))
      .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string");
    if (messages.length) return messages.join(" ");
    const reason = data.error || data.detail || data.message;
    if (typeof reason === "string") return reason;
  }
  return error?.message || "Could not save the material.";
}

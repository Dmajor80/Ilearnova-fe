/** Build CSV text from rows and save it as a file. */
import { saveBlob } from "./apiHelpers";

function cell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** columns: [{ header, value: (row) => any }] */
export function toCsv(rows, columns) {
  const lines = [columns.map((c) => cell(c.header)).join(",")];
  rows.forEach((row) => lines.push(columns.map((c) => cell(c.value(row))).join(",")));
  return lines.join("\r\n");
}

export function downloadCsv(filename, rows, columns) {
  const blob = new Blob([toCsv(rows, columns)], { type: "text/csv;charset=utf-8" });
  saveBlob(blob, filename);
}

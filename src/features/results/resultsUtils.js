/** Helpers shared by the results screens (pure functions, unit-tested). */

export { apiErrorDetails, saveBlob } from "@/lib/apiHelpers";

export const TERMS = [
  { value: "first", label: "First Term" },
  { value: "second", label: "Second Term" },
  { value: "third", label: "Third Term" },
];

/** Academic sessions start in September: Nov 2026 -> "2026/2027". */
export function currentSession(today = new Date()) {
  const year = today.getFullYear();
  const start = today.getMonth() >= 8 ? year : year - 1;
  return `${start}/${start + 1}`;
}

/** This session and the few before it, newest first. */
export function sessionOptions(today = new Date(), count = 4) {
  const [start] = currentSession(today).split("/").map(Number);
  return Array.from({ length: count }, (_, i) => `${start - i}/${start - i + 1}`);
}

/** Numbers from the API arrive as strings ("40.00"); show "40", "7.5". */
export function fmt(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? String(Math.round(n * 100) / 100) : String(value);
}

export const componentsTotal = (components = []) =>
  components.reduce((sum, c) => sum + (Number(c.max) || 0), 0);

/** Live total and percentage for a row being typed. */
export function rowTotals(scores, components) {
  const total = components.reduce((sum, c) => {
    const v = scores?.[c.key];
    return v === "" || v === null || v === undefined ? sum : sum + (Number(v) || 0);
  }, 0);
  const outOf = componentsTotal(components);
  const percentage = outOf ? Math.round((total * 10000) / outOf) / 100 : 0;
  const complete = components.every((c) => {
    const v = scores?.[c.key];
    return v !== "" && v !== null && v !== undefined;
  });
  return { total, outOf, percentage, complete };
}

/** Problems with one typed score, or "" if it is fine (blank is fine). */
export function scoreProblem(value, max) {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "Not a number";
  if (n < 0 || n > Number(max)) return `0 to ${fmt(max)}`;
  return "";
}

export function gradeFor(percentage, bands = []) {
  const band = bands.find((b) => Number(percentage) >= Number(b.min));
  return band ? band.grade : "";
}

export const safeName = (...parts) =>
  parts.filter(Boolean).join("-").replace(/[/\\\s]+/g, "-");

export const MAX_COMPONENTS = 10;
const MAX_TOTAL = 1000;

/** Problems that stop the components from being saved ("" if none). */
export function componentsProblem(components) {
  if (!components.length) return "Add at least one score component.";
  if (components.some((c) => !String(c.label || "").trim())) return "Every component needs a name.";
  if (components.some((c) => !(Number(c.max) > 0))) return "Every component needs a maximum above 0.";
  const total = componentsTotal(components);
  if (total > MAX_TOTAL) return `The total is ${fmt(total)}; the most allowed is ${MAX_TOTAL}.`;
  return "";
}

/** API components -> editable rows (keys kept so saved scores still match). */
export const toEditable = (components = []) =>
  components.map((c) => ({ key: c.key, label: c.label, max: fmt(c.max) }));

/** Editable rows -> request body. */
export const toPayload = (components) =>
  components.map((c) => ({
    ...(c.key ? { key: c.key } : {}),
    label: String(c.label).trim(),
    max: Number(c.max),
  }));

/** "72.5" on the usual out-of-100 card, "75% (150 / 200)" otherwise. */
export function averageText(report) {
  if (report.average === null || report.average === undefined) return "—";
  if (Number(report.average_out_of) === 100) return fmt(report.average);
  const pct = `${fmt(report.average)}%`;
  return report.average_score !== null && report.average_score !== undefined
    ? `${pct} (${fmt(report.average_score)} / ${fmt(report.average_out_of)})`
    : pct;
}

/** Saved results -> editable drafts for every student on the sheet. */
export function draftsFromSheet(sheet) {
  const drafts = {};
  for (const student of sheet.students) {
    const saved = student.result?.scores || {};
    drafts[student.student_id] = {
      scores: Object.fromEntries(sheet.components.map((c) => [c.key, fmt(saved[c.key])])),
      remark: student.result?.remark || "",
    };
  }
  return drafts;
}

/** Request rows for the students whose drafts changed. Blank -> null (clear). */
export function rowsToSave(sheet, drafts, changedIds) {
  return sheet.students
    .filter((s) => changedIds.has(s.student_id))
    .map((s) => {
      const draft = drafts[s.student_id];
      return {
        student_id: String(s.student_id),
        scores: Object.fromEntries(
          sheet.components.map((c) => {
            const v = draft.scores[c.key];
            return [c.key, v === "" || v === undefined ? null : String(v)];
          })
        ),
        remark: draft.remark || "",
      };
    });
}

/** Problems that stop grade bands from being saved ("" if none). */
export function bandsProblem(bands) {
  if (bands.length < 2) return "Add at least two grades.";
  if (bands.some((b) => !String(b.grade).trim())) return "Every band needs a grade letter.";
  const mins = bands.map((b) => Number(b.min));
  if (mins.some((m) => !Number.isFinite(m) || m < 0 || m > 100)) return "Each band starts between 0 and 100%.";
  if (new Set(mins).size !== mins.length) return "Two bands start at the same percentage.";
  if (!mins.includes(0)) return "The lowest band must start at 0%.";
  return "";
}

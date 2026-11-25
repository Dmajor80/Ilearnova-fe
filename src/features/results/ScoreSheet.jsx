import { fmt, gradeFor, rowTotals, scoreProblem } from "./resultsUtils";

/**
 * The class roster with one input per score component. Controlled:
 * `drafts` maps student_id -> { scores: {key: value}, remark }.
 * `rowErrors` maps student_id -> [problems] from the last save.
 */
export default function ScoreSheet({ sheet, drafts, onEdit, rowErrors = {}, bands = [], disabled, republish = new Set() }) {
  const { components, students } = sheet;

  if (!students.length) {
    return <p className="py-8 text-center text-gray-500">No students are enrolled in this class yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="sticky left-0 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700">Student</th>
            {components.map((c) => (
              <th key={c.key} scope="col" className="px-2 py-3 text-center font-semibold text-gray-700">
                {c.label} <span className="font-normal text-gray-500">({fmt(c.max)})</span>
              </th>
            ))}
            <th scope="col" className="px-3 py-3 text-center font-semibold text-gray-700">
              Total ({fmt(sheet.total)})
            </th>
            <th scope="col" className="px-3 py-3 text-center font-semibold text-gray-700">%</th>
            <th scope="col" className="px-3 py-3 text-center font-semibold text-gray-700">Grade</th>
            <th scope="col" className="px-3 py-3 text-left font-semibold text-gray-700">Remark</th>
            <th scope="col" className="px-3 py-3 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {students.map((student) => {
            const draft = drafts[student.student_id] || { scores: {}, remark: "" };
            const totals = rowTotals(draft.scores, components);
            const errors = rowErrors[student.student_id];
            const result = student.result;
            return (
              <tr key={student.student_id} className={errors ? "bg-red-50" : undefined}>
                <th scope="row" className="sticky left-0 bg-inherit px-3 py-2 text-left font-medium text-gray-900">
                  <span className="block whitespace-nowrap">{student.student_name}</span>
                  {errors && (
                    <span role="alert" className="block text-xs font-normal text-red-700">{errors.join("; ")}</span>
                  )}
                </th>
                {components.map((c) => {
                  const value = draft.scores[c.key] ?? "";
                  const problem = scoreProblem(value, c.max);
                  return (
                    <td key={c.key} className="px-2 py-2 text-center">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max={c.max}
                        step="0.5"
                        value={value}
                        disabled={disabled}
                        aria-label={`${student.student_name} ${c.label}`}
                        aria-invalid={problem ? "true" : undefined}
                        title={problem || undefined}
                        onChange={(e) => onEdit(student.student_id, { scores: { ...draft.scores, [c.key]: e.target.value } })}
                        className={`w-20 rounded border px-2 py-1 text-right ${problem ? "border-red-500 bg-red-50" : ""}`}
                      />
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center font-medium">{fmt(totals.total)}</td>
                <td className="px-3 py-2 text-center">{fmt(totals.percentage)}</td>
                <td className="px-3 py-2 text-center font-semibold">{gradeFor(totals.percentage, bands)}</td>
                <td className="px-3 py-2">
                  <input
                    value={draft.remark ?? ""}
                    disabled={disabled}
                    maxLength={255}
                    aria-label={`${student.student_name} remark`}
                    onChange={(e) => onEdit(student.student_id, { remark: e.target.value })}
                    className="w-40 rounded border px-2 py-1"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs">
                  {!result ? (
                    <span className="text-gray-400">Not saved</span>
                  ) : result.is_published ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">Published</span>
                  ) : republish.has(student.student_id) ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800" title="Students and parents see this once you publish again">
                      Edited, publish again
                    </span>
                  ) : totals.complete ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Draft</span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Incomplete</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

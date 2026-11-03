import { useEffect, useMemo, useState } from "react";
import {
  useParentChildExamResult,
  useParentChildGrades,
  useParentChildren
} from "@/hooks/parent";
import { getParentChildName } from "../components/parentDisplayUtils";

const getDisplayValue = (value) => {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (["string", "number"].includes(typeof value)) return String(value);
  if (Array.isArray(value)) return value.map(getDisplayValue).join(", ");
  return value.name || value.title || value.label || value.score || value.value || "—";
};

const getExamId = (grade) =>
  grade.exam_id || grade.exam?.id || grade.examination_id || grade.examination?.id || "";

const getExamLabel = (grade) =>
  grade.exam?.name || grade.exam?.title || grade.examination?.name
  || grade.examination?.title || grade.exam_name || grade.examination_name
  || `Exam ${getExamId(grade)}`;

const getResultRows = (result) => {
  if (Array.isArray(result)) return result;
  for (const key of ["results", "grades", "scores", "subjects"]) {
    if (Array.isArray(result?.[key])) return result[key];
  }
  return result && typeof result === "object" ? [result] : [];
};

function ParentResult({ isStandalone = true }) {
  const { children, loading: childrenLoading, error: childrenError } = useParentChildren();
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const selectedChild = children.find((child) =>
    String(child.id) === String(selectedChildId)
  );
  const {
    grades,
    loading: gradesLoading,
    error: gradesError,
    refreshData
  } = useParentChildGrades(selectedChild?.id);
  const {
    examResult,
    loading: examLoading,
    error: examError
  } = useParentChildExamResult(selectedChild?.id, selectedExamId);
  const gradeRows = Array.isArray(grades) ? grades : getResultRows(grades);
  const exams = useMemo(() => {
    const map = new Map();
    gradeRows.forEach((grade) => {
      const examId = getExamId(grade);
      if (examId) map.set(String(examId), { id: examId, label: getExamLabel(grade) });
    });
    return [...map.values()];
  }, [gradeRows]);

  useEffect(() => {
    if (children.length
      && !children.some((child) => String(child.id) === String(selectedChildId))) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (selectedExamId && !exams.some((exam) => String(exam.id) === String(selectedExamId))) {
      setSelectedExamId("");
    }
  }, [exams, selectedExamId]);

  const columns = gradeRows.length
    ? Object.keys(gradeRows[0]).filter((key) =>
      !/^(id|child|student|parent|exam|examination)$/i.test(key)
    ).slice(0, 7)
    : [];
  const examRows = getResultRows(examResult);
  const examColumns = examRows.length
    ? Object.keys(examRows[0]).filter((key) =>
      !/^(id|child|student|parent|exam|examination)$/i.test(key)
    ).slice(0, 7)
    : [];

  const handleDownload = () => {
    if (!gradeRows.length) return;
    const csvRows = [
      columns,
      ...gradeRows.map((row) => columns.map((column) => getDisplayValue(row[column])))
    ];
    const csv = csvRows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getParentChildName(selectedChild || {}).replaceAll(" ", "_")}_grades.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <section className="space-y-5">
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Grades &amp; results</h2>
            <p className="mt-1 text-slate-600">
              Academic results{selectedChild ? ` for ${getParentChildName(selectedChild)}` : " for a linked child"}.
            </p>
          </div>
          <label className="text-sm font-medium text-slate-700">
            Child
            <select
              className="mt-1 block min-w-56 rounded-lg border border-slate-300 px-3 py-2"
              value={selectedChild?.id || ""}
              onChange={(event) => {
                setSelectedChildId(event.target.value);
                setSelectedExamId("");
              }}
              disabled={childrenLoading}
            >
              <option value="" disabled>
                {childrenLoading ? "Loading children…" : "Select a child"}
              </option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>{getParentChildName(child)}</option>
              ))}
            </select>
          </label>
        </div>
        {childrenError && (
          <p className="mt-3 text-sm text-red-700" role="alert">Could not load linked children.</p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <h3 className="font-semibold text-slate-800">Grades</h3>
          <div className="flex items-center gap-2">
            {exams.length > 0 && (
              <label className="text-sm text-slate-600">
                Exam result
                <select
                  className="ml-2 rounded-lg border border-slate-300 px-3 py-2"
                  value={selectedExamId}
                  onChange={(event) => setSelectedExamId(event.target.value)}
                >
                  <option value="">Select an exam</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>{exam.label}</option>
                  ))}
                </select>
              </label>
            )}
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
              type="button"
              onClick={refreshData}
              disabled={gradesLoading || !selectedChild}
            >
              Refresh
            </button>
            <button
              className="rounded-lg bg-blue-700 px-3 py-2 text-sm text-white disabled:opacity-60"
              type="button"
              onClick={handleDownload}
              disabled={!gradeRows.length}
            >
              Download CSV
            </button>
          </div>
        </div>

        {gradesLoading && <p className="p-6 text-slate-600">Loading grades…</p>}
        {!gradesLoading && gradesError && (
          <div className="p-6 text-red-700" role="alert">
            Could not load grades.
            <button type="button" className="ml-2 underline" onClick={refreshData}>Try again</button>
          </div>
        )}
        {!gradesLoading && !gradesError && !selectedChild && (
          <p className="p-6 text-slate-600">No linked children are available.</p>
        )}
        {!gradesLoading && !gradesError && selectedChild && gradeRows.length === 0 && (
          <p className="p-6 text-slate-600">No grades have been returned for this child.</p>
        )}
        {!gradesLoading && !gradesError && gradeRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold capitalize">
                      {column.replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gradeRows.map((grade, index) => (
                  <tr key={grade.id || `${grade.subject || grade.name || "grade"}-${index}`} className="border-t">
                    {columns.map((column) => (
                      <td key={column} className="px-4 py-3 text-slate-700">
                        {getDisplayValue(grade[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedExamId && (
        <section className="overflow-hidden rounded-xl bg-white shadow">
          <h3 className="border-b p-5 font-semibold text-slate-800">
            {exams.find((exam) => String(exam.id) === String(selectedExamId))?.label || "Exam result"}
          </h3>
          {examLoading && <p className="p-6 text-slate-600">Loading exam result…</p>}
          {!examLoading && examError && (
            <p className="p-6 text-red-700" role="alert">Could not load this exam result.</p>
          )}
          {!examLoading && !examError && examRows.length === 0 && (
            <p className="p-6 text-slate-600">No result details were returned for this exam.</p>
          )}
          {!examLoading && !examError && examRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {examColumns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold capitalize">
                        {column.replaceAll("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {examRows.map((row, index) => (
                    <tr key={row.id || index} className="border-t">
                      {examColumns.map((column) => (
                        <td key={column} className="px-4 py-3 text-slate-700">
                          {getDisplayValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </section>
  );

  if (!isStandalone) return content;
  return <main className="min-h-screen bg-slate-50 p-4 md:p-10">{content}</main>;
}

export default ParentResult;

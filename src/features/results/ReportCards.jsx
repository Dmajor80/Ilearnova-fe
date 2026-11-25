import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { resultsApi } from "@/api/resultsApi";
import { apiErrorDetails, averageText, fmt, safeName, saveBlob, scoreColumns } from "./resultsUtils";

function ReportCard({ report, onDownload, downloading }) {
  const { headings, cells } = scoreColumns(report.subjects);
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
      <header className="flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {report.term_label}, {report.session}
          </h3>
          <p className="text-sm text-gray-600">
            {report.organization_name}
            {report.class_name ? ` · ${report.class_name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDownload(report)}
          disabled={downloading}
          className="inline-flex items-center gap-2 self-start rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </header>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Subject</th>
              {headings.map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap px-3 py-2 text-center font-semibold text-gray-700">{h}</th>
              ))}
              <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">Total</th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">%</th>
              <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">Grade</th>
              <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {report.subjects.map((s, i) => (
              <tr key={s.id}>
                <td className="px-3 py-2 font-medium text-gray-900">{s.subject_name}</td>
                {cells[i].map((cell, j) => (
                  <td key={headings[j]} className="whitespace-nowrap px-3 py-2 text-center text-gray-700">{cell}</td>
                ))}
                <td className="whitespace-nowrap px-3 py-2 text-center">
                  {fmt(s.total)}/{fmt(s.max_total)}
                </td>
                <td className="px-3 py-2 text-center">{fmt(s.percentage)}</td>
                <td className="px-3 py-2 text-center font-semibold">{s.grade}</td>
                <td className="px-3 py-2 text-gray-600">{s.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-gray-500">Subjects</dt>
          <dd className="text-lg font-semibold">{report.subject_count}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-gray-500">Total score</dt>
          <dd className="text-lg font-semibold">
            {fmt(report.total_score)} / {fmt(report.total_possible)}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-gray-500">Average</dt>
          <dd className="text-lg font-semibold">{averageText(report)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-gray-500">Overall grade</dt>
          <dd className="text-lg font-semibold">
            {report.average_grade} <span className="text-sm font-normal text-gray-600">{report.average_remark}</span>
          </dd>
        </div>
      </dl>
    </article>
  );
}

/**
 * Published report cards, newest term first. `childId` shows a parent's
 * child; without it, the signed-in student's own.
 */
export default function ReportCards({ childId, emptyText = "No results have been published yet." }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    (childId ? resultsApi.childReports(childId) : resultsApi.myReports())
      .then((data) => active && setReports(Array.isArray(data) ? data : []))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [childId]);

  const download = async (report) => {
    const period = {
      session: report.session,
      term: report.term,
      organization_id: report.organization_id,
    };
    setDownloading(true);
    try {
      const blob = childId
        ? await resultsApi.childReportCard(childId, period)
        : await resultsApi.myReportCard(period);
      saveBlob(blob, `report-card-${safeName(report.student_name, report.session, report.term)}.pdf`);
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p className="py-8 text-center text-gray-500">Loading results…</p>;

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      {reports.length ? (
        reports.map((report) => (
          <ReportCard
            key={`${report.organization_id}-${report.session}-${report.term}`}
            report={report}
            onDownload={download}
            downloading={downloading}
          />
        ))
      ) : (
        !error && <p className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">{emptyText}</p>
      )}
    </div>
  );
}

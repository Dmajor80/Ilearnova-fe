import { useEffect, useState } from "react";
import { getStudentTranscript } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";

const termLabel = (term) =>
  term === "unassigned" ? "Exams without a term" : `${term.charAt(0).toUpperCase()}${term.slice(1)} term`;

/**
 * The student's graded online (CBT) exams, averaged per subject and term.
 * Report cards from teachers are on the other tab.
 */
export default function OnlineExamScores() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentTranscript()
      .then((payload) => active && setData(payload?.data ?? payload))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")));
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="py-8 text-center text-gray-500">Loading exam scores…</p>;

  const terms = data.terms || [];
  if (!terms.length) {
    return <p className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">No online exams have been graded yet.</p>;
  }

  return (
    <section className="space-y-4">
      {data.overall_average !== null && data.overall_average !== undefined && (
        <p className="text-sm text-gray-600">
          Overall average <strong className="text-gray-900">{data.overall_average}%</strong> ({data.overall_grade})
        </p>
      )}
      {terms.map((term) => (
        <article key={term.term} className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
          <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{termLabel(term.term)}</h3>
            <p className="text-sm text-gray-600">Average {term.average_percentage}% · {term.grade}</p>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-semibold text-gray-700">Subject</th>
                  <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">Exams taken</th>
                  <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">Average %</th>
                  <th scope="col" className="px-3 py-2 text-center font-semibold text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {term.subjects.map((s) => (
                  <tr key={s.subject_id}>
                    <td className="px-3 py-2 font-medium text-gray-900">{s.subject_name}</td>
                    <td className="px-3 py-2 text-center">{s.exams_taken}</td>
                    <td className="px-3 py-2 text-center">{s.average_percentage}</td>
                    <td className="px-3 py-2 text-center font-semibold">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}
    </section>
  );
}

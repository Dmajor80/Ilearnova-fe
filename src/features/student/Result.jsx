import ReportCards from "@/features/results/ReportCards";

/**
 * The student's published term report cards: scores per subject, their
 * average and grade (no class position), with a PDF download.
 */
const Result = () => (
  <section className="space-y-4 p-4 md:p-6">
    <header>
      <h2 className="text-2xl font-bold text-gray-900">My results</h2>
      <p className="text-sm text-gray-600">Results appear here once your teachers publish them.</p>
    </header>
    <ReportCards />
  </section>
);

export default Result;

import { ClipboardCheck, Info } from "lucide-react";

export default function Grade({ onNavigate = () => {} }) {
  return (
    <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-amber-50 p-2 text-amber-700"><Info size={20} /></span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grading</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            The teacher API currently exposes manual grading for submitted CBT answers. It does not document a general assignment or examination gradebook endpoint, so this page does not display placeholder student grades.
          </p>
          <button type="button" onClick={() => onNavigate("cbt")} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            <ClipboardCheck size={17} /> Review CBT answers
          </button>
        </div>
      </div>
    </section>
  );
}

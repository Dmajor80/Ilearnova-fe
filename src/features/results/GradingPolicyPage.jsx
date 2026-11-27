import { useEffect, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { resultsApi } from "@/api/resultsApi";
import ComponentsEditor from "./ComponentsEditor";
import { apiErrorDetails, bandsProblem, componentsProblem, fmt, toEditable, toPayload } from "./resultsUtils";
import { FormSkeleton } from "@/components/ui/Skeleton";

const toBands = (scale = []) =>
  scale.map((b) => ({ grade: b.grade, min: fmt(b.min), remark: b.remark || "" }));

/**
 * School admins set the school's rubric: the score components every subject
 * uses (unless a teacher overrides one) and the grade bands.
 */
export default function GradingPolicyPage() {
  const [policy, setPolicy] = useState(null);
  const [components, setComponents] = useState([]);
  const [bands, setBands] = useState([]);
  const [teachersCanCustomize, setTeachersCanCustomize] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const load = (data) => {
    setPolicy(data);
    setComponents(toEditable(data.components));
    setBands(toBands(data.grade_bands));
    setTeachersCanCustomize(Boolean(data.teachers_can_customize));
  };

  useEffect(() => {
    resultsApi
      .schoolPolicy()
      .then(load)
      .catch((err) => setMessage({ type: "error", lines: apiErrorDetails(err).messages }));
  }, []);

  const save = async (changes, done) => {
    setBusy(true);
    setMessage(null);
    try {
      const data = await resultsApi.saveSchoolPolicy(changes);
      load(data);
      const regraded = data.regraded_results ? ` ${data.regraded_results} draft result(s) were regraded.` : "";
      setMessage({ type: "success", lines: [`${done}.${regraded}`] });
    } catch (err) {
      setMessage({
        type: "error",
        lines: err?.status === 403 ? ["Only school admins can change the grading policy."] : apiErrorDetails(err).messages,
      });
    } finally {
      setBusy(false);
    }
  };

  if (!policy) {
    return message ? (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{message.lines.join(" ")}</p>
    ) : (
      <FormSkeleton fields={6} label="Loading grading policy" className="rounded-xl bg-white p-6 shadow-sm" />
    );
  }

  const componentsError = componentsProblem(components);
  const bandsError = bandsProblem(bands);
  const updateBand = (i, field, value) => setBands((list) => list.map((b, j) => (j === i ? { ...b, [field]: value } : b)));

  return (
    <div className="space-y-6">
      {message && (
        <div role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.lines.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}

      <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
        <header>
          <h2 className="text-xl font-bold text-gray-900">Score components</h2>
          <p className="mt-1 text-sm text-gray-600">
            What makes up each subject's total. Example: CA 1 (10) + CA 2 (10) + CA 3 (10) + Exam (70) = 100, or
            CA 1 (50) + CA 2 (50) + Exam (100) = 200.
            {policy.components_are_default && " You are using the platform default."}
          </p>
        </header>
        <ComponentsEditor components={components} onChange={setComponents} disabled={busy} />
        {componentsError && <p className="text-sm text-red-700">{componentsError}</p>}
        <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
          <input
            type="checkbox"
            checked={teachersCanCustomize}
            disabled={busy}
            onChange={(e) => {
              setTeachersCanCustomize(e.target.checked);
              save({ teachers_can_customize: e.target.checked }, "Teacher setting saved");
            }}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <span className="font-medium text-gray-900">Teachers may set their own components for a subject</span>
            <span className="block text-gray-600">For example a practical subject with a project score.</span>
          </span>
        </label>
        <div className="flex flex-wrap justify-end gap-2">
          {!policy.components_are_default && (
            <button type="button" disabled={busy} onClick={() => save({ components: null }, "Components reset to the default")} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50">
              <RotateCcw className="h-4 w-4" /> Use default
            </button>
          )}
          <button type="button" disabled={busy || Boolean(componentsError)} onClick={() => save({ components: toPayload(components) }, "Score components saved")} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            <Save className="h-4 w-4" /> Save components
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
        <header>
          <h2 className="text-xl font-bold text-gray-900">Grade bands</h2>
          <p className="mt-1 text-sm text-gray-600">
            Percent of the subject total. 150 out of 200 is 75%. Changing bands regrades unpublished results only;
            published report cards keep their grades.
          </p>
        </header>
        <div className="space-y-2">
          {bands.map((band, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input aria-label={`Band ${i + 1} grade`} value={band.grade} maxLength={3} disabled={busy} onChange={(e) => updateBand(i, "grade", e.target.value.toUpperCase())} className="w-16 rounded-lg border px-3 py-2 text-center font-semibold" />
              <span className="text-sm text-gray-600">from</span>
              <input aria-label={`Band ${i + 1} starts at percent`} type="number" min="0" max="100" value={band.min} disabled={busy} onChange={(e) => updateBand(i, "min", e.target.value)} className="w-20 rounded-lg border px-3 py-2 text-right" />
              <span className="text-sm text-gray-600">%</span>
              <input aria-label={`Band ${i + 1} remark`} value={band.remark} maxLength={50} disabled={busy} placeholder="Remark, e.g. Excellent" onChange={(e) => updateBand(i, "remark", e.target.value)} className="min-w-0 flex-1 rounded-lg border px-3 py-2" />
              <button type="button" aria-label={`Remove grade ${band.grade || i + 1}`} disabled={busy || bands.length <= 2} onClick={() => setBands((list) => list.filter((_, j) => j !== i))} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" disabled={busy || bands.length >= 15} onClick={() => setBands((list) => [...list, { grade: "", min: "", remark: "" }])} className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline disabled:opacity-40">
          <Plus className="h-4 w-4" /> Add grade
        </button>
        {bandsError && <p className="text-sm text-red-700">{bandsError}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          {!policy.grade_bands_are_default && (
            <button type="button" disabled={busy} onClick={() => save({ grade_bands: null }, "Grade bands reset to the default")} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50">
              <RotateCcw className="h-4 w-4" /> Use default
            </button>
          )}
          <button
            type="button"
            disabled={busy || Boolean(bandsError)}
            onClick={() => save({ grade_bands: bands.map((b) => ({ grade: b.grade.trim(), min: Number(b.min), remark: b.remark.trim() })) }, "Grade bands saved")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save grade bands
          </button>
        </div>
      </section>
    </div>
  );
}

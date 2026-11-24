import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, EyeOff, RefreshCw, Save, Settings2, Upload } from "lucide-react";
import { resultsApi } from "@/api/resultsApi";
import ScoreSheet from "./ScoreSheet";
import ComponentsEditor from "./ComponentsEditor";
import {
  TERMS,
  apiErrorDetails,
  componentsProblem,
  currentSession,
  draftsFromSheet,
  fmt,
  rowsToSave,
  safeName,
  saveBlob,
  scoreProblem,
  sessionOptions,
  toEditable,
  toPayload,
} from "./resultsUtils";

const SOURCE_LABEL = {
  subject: "This subject's own components",
  school: "Your school's components",
  default: "Platform default (CA 40 + Exam 60)",
};

/**
 * Teachers (and school admins) record term results: pick a subject and term,
 * type or upload scores, then publish them to students and parents.
 */
export default function TeacherResults() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [period, setPeriod] = useState({ session: currentSession(), term: "first" });
  const [sheet, setSheet] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [changed, setChanged] = useState(() => new Set());
  const [rowErrors, setRowErrors] = useState({});
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error"|"success", lines: [] }
  const [editingComponents, setEditingComponents] = useState(null);

  const subject = useMemo(() => subjects.find((s) => String(s.id) === String(subjectId)), [subjects, subjectId]);

  const say = useCallback(
    (type, ...lines) => setMessage({ type, lines: lines.flat().filter(Boolean) }),
    []
  );

  useEffect(() => {
    let active = true;
    Promise.all([resultsApi.mySubjects(), resultsApi.schoolPolicy().catch(() => null)])
      .then(([list, policy]) => {
        if (!active) return;
        setSubjects(list || []);
        setBands(policy?.grade_bands || []);
        if (list?.length) setSubjectId(String(list[0].id));
      })
      .catch((err) => active && say("error", apiErrorDetails(err).messages))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [say]);

  const loadSheet = useCallback(async () => {
    if (!subjectId) return;
    setBusy(true);
    try {
      const data = await resultsApi.scoreSheet(subjectId, period);
      setSheet(data);
      setDrafts(draftsFromSheet(data));
      setChanged(new Set());
      setRowErrors({});
    } catch (err) {
      setSheet(null);
      say("error", apiErrorDetails(err).messages);
    } finally {
      setBusy(false);
    }
  }, [subjectId, period, say]);

  useEffect(() => {
    setMessage(null);
    loadSheet();
  }, [loadSheet]);

  const edit = (studentId, patch) => {
    setDrafts((current) => ({ ...current, [studentId]: { ...current[studentId], ...patch } }));
    setChanged((current) => new Set(current).add(studentId));
  };

  const hasBadInput = sheet?.students.some((s) =>
    sheet.components.some((c) => scoreProblem(drafts[s.student_id]?.scores?.[c.key], c.max))
  );

  const save = async () => {
    const rows = rowsToSave(sheet, drafts, changed);
    if (!rows.length) return say("success", "Nothing has changed.");
    setBusy(true);
    try {
      await resultsApi.saveScores(subjectId, period, rows);
      await loadSheet();
      say("success", `Saved ${rows.length} student(s).`);
    } catch (err) {
      const { messages, rows: byNumber } = apiErrorDetails(err);
      const errors = {};
      for (const [number, problems] of Object.entries(byNumber)) {
        const row = rows[Number(number) - 1];
        if (row) errors[row.student_id] = problems;
      }
      setRowErrors(errors);
      say(
        "error",
        Object.keys(errors).length
          ? "Nothing was saved. Fix the highlighted rows and try again."
          : "Nothing was saved.",
        messages
      );
    } finally {
      setBusy(false);
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const saved = await resultsApi.uploadScores(subjectId, period, file);
      await loadSheet();
      say("success", `Uploaded ${saved?.length ?? 0} student(s) from ${file.name}.`);
    } catch (err) {
      const { messages, rows } = apiErrorDetails(err);
      say(
        "error",
        `Nothing was saved from ${file.name}.`,
        messages,
        // Row 1 of the data is line 2 of the sheet (line 1 is the header).
        Object.entries(rows).map(([n, problems]) => `Sheet line ${Number(n) + 1}: ${problems.join("; ")}`)
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = async (format) => {
    try {
      const blob = await resultsApi.scoreTemplate(subjectId, period, format);
      saveBlob(blob, `${safeName(subject?.class_name, subject?.name, period.session, period.term)}.${format}`);
    } catch (err) {
      say("error", apiErrorDetails(err).messages);
    }
  };

  const publish = async (value) => {
    setBusy(true);
    try {
      const res = await resultsApi.publish(subjectId, period, value);
      await loadSheet();
      say("success", value ? `Published ${res?.updated ?? 0} result(s).` : "Results hidden from students and parents.");
    } catch (err) {
      say("error", value ? "Could not publish." : "Could not unpublish.", apiErrorDetails(err).messages);
    } finally {
      setBusy(false);
    }
  };

  const saveComponents = async (reset = false) => {
    setBusy(true);
    try {
      const data = reset
        ? await resultsApi.resetSubjectAssessment(subjectId)
        : await resultsApi.saveSubjectAssessment(subjectId, toPayload(editingComponents));
      setSubjects((list) =>
        list.map((s) =>
          String(s.id) === String(subjectId)
            ? { ...s, components: data.components, total: data.total, components_source: data.source }
            : s
        )
      );
      setEditingComponents(null);
      await loadSheet();
      say("success", "Score components updated. Scores already saved keep their old breakdown until re-entered.");
    } catch (err) {
      say(
        "error",
        err?.status === 403 ? "Your school sets the score components; ask a school admin." : apiErrorDetails(err).messages
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="py-10 text-center text-gray-500">Loading your subjects…</p>;
  if (!subjects.length) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Results</h2>
        <p className="mt-2 text-gray-600">You are not assigned to any subject yet. Ask your school admin to assign you one.</p>
      </section>
    );
  }

  const published = sheet?.students.filter((s) => s.result?.is_published).length || 0;
  const componentsError = editingComponents ? componentsProblem(editingComponents) : "";

  return (
    <section className="space-y-5 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header className="flex flex-col gap-1 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Results</h2>
        <p className="text-sm text-gray-600">Enter scores as the term goes, then publish them to students and parents.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium text-gray-700">
          Subject
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.class_name} · {s.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Session
          <select value={period.session} onChange={(e) => setPeriod((p) => ({ ...p, session: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2">
            {sessionOptions().map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Term
          <select value={period.term} onChange={(e) => setPeriod((p) => ({ ...p, term: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2">
            {TERMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>

      {subject && (
        <div className="rounded-lg border bg-slate-50 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-gray-700">
              <span className="font-medium">{SOURCE_LABEL[subject.components_source] || "Score components"}:</span>{" "}
              {subject.components.map((c) => `${c.label} (${fmt(c.max)})`).join(" + ")} = {fmt(subject.total)}
            </p>
            {!editingComponents && (
              <button type="button" onClick={() => setEditingComponents(toEditable(subject.components))} className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline">
                <Settings2 className="h-4 w-4" /> Change for this subject
              </button>
            )}
          </div>
          {editingComponents && (
            <div className="mt-3 space-y-3 border-t pt-3">
              <ComponentsEditor components={editingComponents} onChange={setEditingComponents} disabled={busy} />
              {componentsError && <p className="text-sm text-red-700">{componentsError}</p>}
              <div className="flex flex-wrap justify-end gap-2">
                {subject.components_source === "subject" && (
                  <button type="button" disabled={busy} onClick={() => saveComponents(true)} className="rounded-lg border px-3 py-2 hover:bg-white">
                    Use school's components
                  </button>
                )}
                <button type="button" onClick={() => setEditingComponents(null)} className="rounded-lg border px-3 py-2 hover:bg-white">Cancel</button>
                <button type="button" disabled={busy || Boolean(componentsError)} onClick={() => saveComponents(false)} className="rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  Save components
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={busy || !sheet || hasBadInput || !changed.size} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          <Save className="h-4 w-4" /> Save {changed.size ? `(${changed.size})` : ""}
        </button>
        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 ${busy ? "pointer-events-none opacity-50" : ""}`}>
          <Upload className="h-4 w-4" /> Upload sheet
          <input type="file" accept=".csv,.xlsx" className="sr-only" onChange={upload} disabled={busy} />
        </label>
        <button type="button" onClick={() => downloadTemplate("xlsx")} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Excel template
        </button>
        <button type="button" onClick={() => downloadTemplate("csv")} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
          <Download className="h-4 w-4" /> CSV
        </button>
        <span className="flex-1" />
        <button type="button" onClick={loadSheet} disabled={busy} aria-label="Reload scores" className="rounded-lg border p-2 hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className="h-4 w-4" />
        </button>
        {published > 0 && (
          <button type="button" onClick={() => publish(false)} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50">
            <EyeOff className="h-4 w-4" /> Unpublish
          </button>
        )}
        <button type="button" onClick={() => publish(true)} disabled={busy || changed.size > 0 || !sheet?.students.some((s) => s.result)} title={changed.size ? "Save your changes first" : undefined} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">
          <Eye className="h-4 w-4" /> Publish
        </button>
      </div>

      {message && (
        <div role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.lines.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}

      {sheet ? (
        <>
          <p className="text-sm text-gray-600">
            {sheet.students.length} student(s) · {published} published. Blank boxes are fine until you publish.
          </p>
          <ScoreSheet sheet={sheet} drafts={drafts} onEdit={edit} rowErrors={rowErrors} bands={bands} disabled={busy} />
        </>
      ) : (
        busy && <p className="py-8 text-center text-gray-500">Loading scores…</p>
      )}
    </section>
  );
}

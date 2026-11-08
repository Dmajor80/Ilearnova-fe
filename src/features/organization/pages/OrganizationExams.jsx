import React, { useMemo, useState } from "react";
import { ClipboardList, Eye, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import useSchoolExamsData, { describeApiError } from "@/hooks/organization/useSchoolExamsData";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const STATUS_STYLES = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-700",
  archived: "bg-amber-100 text-amber-800"
};

// Fields the backend still accepts once students have attempted an exam.
const LOCKED_EDITABLE = ["title", "description", "instructions", "end_time"];

const emptyForm = {
  title: "",
  description: "",
  instructions: "",
  subject: "",
  start_time: "",
  end_time: "",
  duration_minutes: 60,
  passing_percentage: 50,
  status: "draft"
};

const toLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : null);

const OrganizationExams = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const examsApi = useSchoolExamsData({ page, status, search });

  const [editingExam, setEditingExam] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resultsExam, setResultsExam] = useState(null);
  const [results, setResults] = useState({ loading: false, error: "", items: [] });

  // Subject options: admin subjects endpoint, plus subjects already used by listed exams.
  const subjectOptions = useMemo(() => {
    const options = new Map();
    examsApi.subjects.forEach((subject) => {
      if (subject?.id) options.set(String(subject.id), [subject.class_name || subject.classname_name, subject.name].filter(Boolean).join(" · "));
    });
    examsApi.exams.forEach((exam) => {
      if (exam.subject && !options.has(String(exam.subject))) {
        options.set(String(exam.subject), [exam.class_name, exam.subject_name].filter(Boolean).join(" · ") || String(exam.subject));
      }
    });
    return [...options.entries()].map(([id, label]) => ({ id, label }));
  }, [examsApi.subjects, examsApi.exams]);

  const pagination = examsApi.pagination;
  const total = pagination?.total ?? examsApi.exams.length;
  const locked = Boolean(editingExam?.attempt_count);

  const openForm = (exam = null) => {
    setEditingExam(exam);
    setFormError("");
    setForm(exam ? {
      ...emptyForm,
      title: exam.title || "",
      description: exam.description || "",
      instructions: exam.instructions || "",
      subject: exam.subject ? String(exam.subject) : "",
      start_time: toLocalInput(exam.start_time),
      end_time: toLocalInput(exam.end_time),
      duration_minutes: exam.duration_minutes ?? 60,
      passing_percentage: exam.passing_percentage ?? 50,
      status: exam.status === "published" ? "published" : "draft"
    } : emptyForm);
    setShowForm(true);
  };

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const saveExam = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description,
      instructions: form.instructions,
      subject: form.subject,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
      duration_minutes: Number(form.duration_minutes),
      passing_percentage: Number(form.passing_percentage)
    };
    // Archived exams can't be re-statused via PATCH; leave status untouched for them.
    if (editingExam?.status !== "archived") payload.status = form.status;
    const body = locked
      ? Object.fromEntries(LOCKED_EDITABLE.map((key) => [key, payload[key]]))
      : payload;
    try {
      await examsApi.saveExam(body, editingExam?.id);
      setShowForm(false);
    } catch (err) {
      setFormError(describeApiError(err));
    }
  };

  const confirmDelete = async () => {
    const exam = deleteTarget;
    setDeleteTarget(null);
    try {
      await examsApi.deleteExam(exam);
    } catch {
      // The hook surfaces the failure through its notification.
    }
  };

  const openResults = async (exam) => {
    setResultsExam(exam);
    setResults({ loading: true, error: "", items: [] });
    try {
      setResults({ loading: false, error: "", items: await examsApi.fetchResults(exam.id) });
    } catch (err) {
      setResults({ loading: false, error: describeApiError(err), items: [] });
    }
  };

  const rows = useMemo(() => examsApi.exams.map((exam) => ({
    ...exam,
    displaySubject: [exam.subject_name, exam.class_name].filter(Boolean).join(" · ") || "—",
    displaySchedule: exam.start_time
      ? `${formatDate(exam.start_time)}${exam.end_time ? ` – ${formatDate(exam.end_time)}` : ""}`
      : "Not scheduled",
    displayDuration: exam.duration_minutes != null ? `${exam.duration_minutes} min` : "—",
    displayAttempts: exam.attempt_count ?? 0
  })), [examsApi.exams]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "displaySubject", label: "Subject / Class" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLES[value] || STATUS_STYLES.draft}`}>{value || "draft"}</span>
      )
    },
    { key: "displayDuration", label: "Duration" },
    { key: "displaySchedule", label: "Schedule" },
    { key: "displayAttempts", label: "Attempts", align: "center" },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (_, exam) => (
        <div className="flex gap-1">
          <button type="button" onClick={() => openResults(exam)} aria-label={`View results for ${exam.title}`} className="rounded-lg border p-2 text-gray-700 hover:bg-gray-50"><Eye className="h-4 w-4" /></button>
          <button type="button" onClick={() => openForm(exam)} aria-label={`Edit ${exam.title}`} className="rounded-lg border p-2 text-gray-700 hover:bg-gray-50"><Pencil className="h-4 w-4" /></button>
          {exam.status !== "archived" && (
            <button type="button" onClick={() => setDeleteTarget(exam)} aria-label={`Delete ${exam.title}`} className="rounded-lg border p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Exam Management</h3>
          <p className="text-sm text-gray-600">View and manage exams across your school</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openForm()} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"><Plus className="h-4 w-4" /> New Exam</button>
          <button onClick={() => examsApi.refreshData()} aria-label="Refresh exams" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {examsApi.notification.show && (
        <p role="status" className={`rounded-lg p-3 text-sm ${examsApi.notification.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {examsApi.notification.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 sm:max-w-md">
          <Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Search by title or subject"
            aria-label="Search exams"
            className="min-h-[44px] w-full bg-transparent text-sm outline-none"
          />
        </label>
        <select
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          aria-label="Filter by status"
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {!examsApi.loading && !examsApi.error && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-600">
          <ClipboardList className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <p className="font-medium">No exams found</p>
          <p className="text-sm">{search || status ? "Try a different search or status filter." : "Create the first exam for your school."}</p>
        </div>
      ) : (
        <SchoolDataTable
          data={rows}
          loading={examsApi.loading}
          error={examsApi.error ? describeApiError(examsApi.error) : null}
          columns={columns}
          showPagination={false}
        />
      )}

      {!examsApi.loading && !examsApi.error && rows.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
          <span>Page {pagination?.page ?? page} of {pagination?.pages ?? 1} · {total} exams</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={!pagination?.has_prev} className="min-h-[40px] rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
            <button type="button" onClick={() => setPage((current) => current + 1)} disabled={!pagination?.has_next} className="min-h-[40px] rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveExam} aria-label={editingExam ? "Edit exam" : "Create exam"} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{editingExam ? "Edit exam" : "Create exam"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            {locked && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Students have attempted this exam, so only the title, description, instructions and end time can change.</p>
            )}
            <label className="block text-sm font-medium">Title
              <input required maxLength={200} value={form.title} onChange={updateField("title")} className="mt-1 w-full rounded-lg border p-3 font-normal" />
            </label>
            <label className="block text-sm font-medium">Subject
              <select required disabled={locked} value={form.subject} onChange={updateField("subject")} className="mt-1 w-full rounded-lg border p-3 font-normal disabled:bg-gray-100">
                <option value="">Choose a subject</option>
                {subjectOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
              {!subjectOptions.length && (
                <span className="mt-1 block text-xs font-normal text-gray-500">No subjects available to choose from yet.</span>
              )}
            </label>
            <label className="block text-sm font-medium">Description
              <textarea value={form.description} onChange={updateField("description")} rows="2" className="mt-1 w-full rounded-lg border p-3 font-normal" />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">Start time
                <input required type="datetime-local" disabled={locked} value={form.start_time} onChange={updateField("start_time")} className="mt-1 w-full rounded-lg border p-3 font-normal disabled:bg-gray-100" />
              </label>
              <label className="text-sm font-medium">End time
                <input required type="datetime-local" value={form.end_time} onChange={updateField("end_time")} className="mt-1 w-full rounded-lg border p-3 font-normal" />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="text-sm font-medium">Duration (min)
                <input required type="number" min="1" disabled={locked} value={form.duration_minutes} onChange={updateField("duration_minutes")} className="mt-1 w-full rounded-lg border p-3 font-normal disabled:bg-gray-100" />
              </label>
              <label className="text-sm font-medium">Pass mark (%)
                <input type="number" min="0" max="100" disabled={locked} value={form.passing_percentage} onChange={updateField("passing_percentage")} className="mt-1 w-full rounded-lg border p-3 font-normal disabled:bg-gray-100" />
              </label>
              <label className="text-sm font-medium">Status
                <select disabled={locked || editingExam?.status === "archived"} value={form.status} onChange={updateField("status")} className="mt-1 w-full rounded-lg border p-3 font-normal disabled:bg-gray-100">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">Instructions
              <textarea value={form.instructions} onChange={updateField("instructions")} rows="3" className="mt-1 w-full rounded-lg border p-3 font-normal" />
            </label>
            <p className="text-xs text-gray-500">Questions are authored by teachers; an exam needs at least one question before it can be published.</p>
            {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
            <button disabled={examsApi.mutating} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {examsApi.mutating ? "Saving..." : "Save exam"}
            </button>
          </form>
        </div>
      )}

      {resultsExam && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <section aria-label="Exam results" className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Exam results</h3>
                <p className="text-sm text-gray-500">{resultsExam.title}</p>
              </div>
              <button type="button" onClick={() => setResultsExam(null)} className="text-gray-500">Close</button>
            </div>
            {results.loading && <p className="py-6 text-center text-gray-500">Loading results...</p>}
            {results.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{results.error}</p>}
            {!results.loading && !results.error && !results.items.length && <p className="text-gray-600">No attempts yet.</p>}
            {!results.loading && results.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#ebebf5] text-left text-[#4D44B5]">
                    <tr><th className="px-3 py-2">Student</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Result</th><th className="px-3 py-2">Submitted</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {results.items.map((attempt) => (
                      <tr key={attempt.id}>
                        <td className="px-3 py-2 font-medium">{attempt.student_name || "Student"}</td>
                        <td className="px-3 py-2 capitalize">{String(attempt.status || "—").replace(/_/g, " ")}</td>
                        <td className="px-3 py-2">{attempt.percentage != null ? `${Math.round(attempt.percentage)}%` : attempt.score ?? "—"}</td>
                        <td className="px-3 py-2">{attempt.is_passed == null ? "—" : attempt.is_passed ? "Passed" : "Failed"}</td>
                        <td className="px-3 py-2">{formatDate(attempt.submitted_at) || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          item={{ name: deleteTarget.attempt_count ? `"${deleteTarget.title}" (it has attempts, so it will be archived instead)` : `"${deleteTarget.title}"` }}
          type="exam"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default OrganizationExams;

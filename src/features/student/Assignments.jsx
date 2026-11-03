import { useState } from "react";
import { CalendarDays, FileText, RefreshCw, Upload } from "lucide-react";
import { useStudentAssignments } from "@/hooks/student";

const formatDate = (date) => {
  if (!date) return "No due date";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "No due date"
    : parsedDate.toLocaleString();
};

export default function Assignments() {
  const studentAssignments = useStudentAssignments();
  const [submissions, setSubmissions] = useState({});

  const updateSubmission = (assignmentId, field, value) => {
    setSubmissions((current) => ({
      ...current,
      [assignmentId]: {
        ...current[assignmentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (assignmentId) => {
    const submission = submissions[assignmentId];
    if (!submission?.content?.trim() || !submission.file) return;

    try {
      await studentAssignments.submitAssignment(
        assignmentId,
        submission.content.trim(),
        submission.file
      );
      setSubmissions((current) => ({
        ...current,
        [assignmentId]: { content: "", file: null }
      }));
    } catch {
      // The hook reports submission errors to the user.
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
            <p className="mt-1 text-slate-600">View and submit your assignments.</p>
          </div>
          <button
            type="button"
            onClick={() => studentAssignments.refreshData(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
            aria-label="Refresh assignments"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {studentAssignments.error && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {studentAssignments.error.message}
          </div>
        )}

        {studentAssignments.loading ? (
          <p role="status" className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">
            Loading assignments…
          </p>
        ) : studentAssignments.assignments.length === 0 ? (
          <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">
            No assignments available.
          </p>
        ) : (
          <div className="space-y-4">
            {studentAssignments.assignments.map((assignment) => {
              const isSubmitted = !studentAssignments.pendingAssignments.some(
                (pending) => pending.id === assignment.id
              );
              const submission = submissions[assignment.id] ?? {};

              return (
                <article key={assignment.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-800">{assignment.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {[assignment.subject_name, assignment.class_name].filter(Boolean).join(" · ") || "Assignment"}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                      isSubmitted
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {isSubmitted ? "Submitted" : "Not submitted"}
                    </span>
                  </div>

                  {assignment.description && (
                    <p className="mt-4 whitespace-pre-wrap text-slate-700">{assignment.description}</p>
                  )}

                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="h-4 w-4" />
                    Due {formatDate(assignment.due_date)}
                  </p>

                  {!isSubmitted && (
                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4">
                      <label className="grid gap-1 text-sm font-medium text-slate-700">
                        Submission
                        <textarea
                          value={submission.content ?? ""}
                          onChange={(event) => updateSubmission(assignment.id, "content", event.target.value)}
                          rows={3}
                          className="rounded-lg border border-slate-300 p-3 font-normal"
                          placeholder="Write your submission"
                        />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-700">
                        Attachment
                        <input
                          type="file"
                          onChange={(event) => updateSubmission(assignment.id, "file", event.target.files?.[0] ?? null)}
                          className="rounded-lg border border-slate-300 p-2 font-normal"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={studentAssignments.mutating || !submission.content?.trim() || !submission.file}
                        className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4" />
                        {studentAssignments.mutating ? "Submitting…" : "Submit assignment"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Eye, FileQuestion, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTeacherBankQuestions, useTeacherClasses, useTeacherExaminations } from "@/hooks/teacher";
import { getTeacherList } from "@/hooks/teacher/teacherApiUtils";
import CoursesComponent from "./components/CourseComponents";

const emptyForm = {
  title: "",
  description: "",
  subject: "",
  start_time: "",
  end_time: "",
  duration_minutes: 60,
  instructions: "",
  total_marks: 100,
  is_published: false,
  is_active: true,
  num_of_questions: 0
};

export default function Examinations() {
  const examsApi = useTeacherExaminations();
  const classesApi = useTeacherClasses();
  const questionApi = useTeacherBankQuestions();
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedExam, setSelectedExam] = useState(null);
  const [detailView, setDetailView] = useState("submissions");
  const [questionPayload, setQuestionPayload] = useState("{}");
  const [questionJsonError, setQuestionJsonError] = useState("");
  const [questionDetails, setQuestionDetails] = useState("");
  const [examPage, setExamPage] = useState(1);
  const [submissionPage, setSubmissionPage] = useState(1);

  const fetchSubjects = classesApi.fetchSubjects;
  useEffect(() => {
    let cancelled = false;
    const loadSubjects = async () => {
      const responses = await Promise.all(classesApi.classes.map(async (classItem) => {
        try {
          const response = await fetchSubjects(classItem.id);
          const list = response?.subjects ?? response?.results ?? response;
          return Array.isArray(list) ? list : [];
        } catch {
          return [];
        }
      }));
      if (!cancelled) setSubjects(responses.flat());
    };
    if (classesApi.classes.length) loadSubjects();
    return () => { cancelled = true; };
  }, [classesApi.classes, fetchSubjects]);

  const openForm = (exam = null) => {
    setEditingExam(exam);
    setForm({
      ...emptyForm,
      ...exam,
      start_time: exam?.start_time ? new Date(exam.start_time).toISOString().slice(0, 16) : "",
      end_time: exam?.end_time ? new Date(exam.end_time).toISOString().slice(0, 16) : "",
      subject: exam?.subject || ""
    });
    setShowForm(true);
  };

  const saveExam = async (event) => {
    event.preventDefault();
    try {
      await examsApi.saveExamination({
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
        duration_minutes: Number(form.duration_minutes),
        total_marks: Number(form.total_marks),
        num_of_questions: Number(form.num_of_questions)
      }, editingExam?.id, { page: examPage });
      setShowForm(false);
    } catch {
      // The API hook reports request failures.
    }
  };

  const openDetails = async (exam, view) => {
    setSelectedExam(exam);
    setDetailView(view);
    try {
      if (view === "submissions") {
        setSubmissionPage(1);
        await examsApi.fetchSubmissions(exam.id, { page: 1 });
      }
      else await examsApi.fetchBankQuestions(exam.id);
    } catch {
      // The API hook reports request failures.
    }
  };

  const changeExamPage = (page) => {
    setExamPage(page);
    examsApi.refreshData({ page });
  };

  const changeSubmissionPage = (page) => {
    if (!selectedExam) return;
    setSubmissionPage(page);
    examsApi.fetchSubmissions(selectedExam.id, { page }).catch(() => {});
  };

  const questions = getTeacherList(examsApi.bankQuestions, ["questions", "bank_questions"]);

  const submitQuestionPayload = async (event) => {
    event.preventDefault();
    if (!selectedExam) return;
    try {
      const payload = JSON.parse(questionPayload);
      await examsApi.addBankQuestions(selectedExam.id, payload);
      await examsApi.fetchBankQuestions(selectedExam.id);
      setQuestionJsonError("");
    } catch (error) {
      if (error instanceof SyntaxError) setQuestionJsonError("Enter valid JSON for the endpoint request body.");
    }
  };

  const saveQuestionDetails = async (event) => {
    event.preventDefault();
    if (!questionApi.question?.id) return;
    try {
      const payload = JSON.parse(questionDetails);
      await questionApi.updateQuestion(questionApi.question.id, payload);
      setQuestionJsonError("");
    } catch (error) {
      if (error instanceof SyntaxError) setQuestionJsonError("Enter valid JSON for the question update.");
    }
  };

  return (
    <div className="space-y-6">
      <CoursesComponent page="Examinations" />
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-2xl font-bold">Examinations</h2><p className="text-sm text-gray-600">Create exams, review submissions, and inspect linked question-bank items.</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => examsApi.refreshData({ page: examPage }, true)} aria-label="Refresh examinations" className="rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw size={17} /></button>
            <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"><Plus size={17} /> Create examination</button>
          </div>
        </div>
        {examsApi.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{examsApi.error.message}</p>}
        {classesApi.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{classesApi.error.message}</p>}
        {questionApi.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{questionApi.error.message}</p>}
        {examsApi.loading && <p className="py-8 text-center text-gray-500">Loading examinations...</p>}
        {!examsApi.loading && !examsApi.examinations.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No examinations found.</p>}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!examsApi.loading && examsApi.examinations.map((exam) => (
            <article key={exam.id} className="rounded-xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="font-semibold">{exam.title}</h3><p className="mt-1 text-sm text-gray-600">{exam.subject_name || "Subject"}</p></div>
                <span className={`rounded-full px-2 py-1 text-xs ${exam.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{exam.is_published ? "Published" : "Draft"}</span>
              </div>
              {exam.description && <p className="mt-3 text-sm text-gray-600">{exam.description}</p>}
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                {exam.start_time && <p>Starts {new Date(exam.start_time).toLocaleString()}</p>}
                {exam.end_time && <p>Ends {new Date(exam.end_time).toLocaleString()}</p>}
                {exam.duration_minutes != null && <p>{exam.duration_minutes} minutes · {exam.total_marks ?? "—"} marks</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => openDetails(exam, "submissions")} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"><Eye size={15} className="mr-1 inline" /> Submissions</button>
                <button onClick={() => openDetails(exam, "questions")} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"><FileQuestion size={15} className="mr-1 inline" /> Questions</button>
                <button onClick={() => openForm(exam)} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Edit</button>
                <button onClick={async () => {
                  if (window.confirm(`Delete "${exam.title}"?`)) {
                    try { await examsApi.removeExamination(exam.id, { page: examPage }); } catch { /* Hook reports failures. */ }
                  }
                }} aria-label="Delete examination" className="rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
              </div>
            </article>
          ))}
        </div>
        {examsApi.examinationPagination && (
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-sm text-gray-500">Page {examsApi.examinationPagination.page} · {examsApi.examinationPagination.total} exams</span>
            <div className="flex gap-2">
              <button type="button" disabled={!examsApi.examinationPagination.previous || examPage <= 1} onClick={() => changeExamPage(examPage - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
              <button type="button" disabled={!examsApi.examinationPagination.next} onClick={() => changeExamPage(examPage + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>

      {selectedExam && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <section className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div><h3 className="text-xl font-semibold">{detailView === "submissions" ? "Exam submissions" : "Question bank"}</h3><p className="text-sm text-gray-500">{selectedExam.title}</p></div>
              <button onClick={() => setSelectedExam(null)} className="text-gray-500">Close</button>
            </div>
            {detailView === "submissions" ? (
              examsApi.submissions.length ? <div className="divide-y">{examsApi.submissions.map((submission) => <article key={submission.id} className="py-3"><p className="font-medium">{submission.student_name || submission.student?.name || "Student"}</p><p className="text-sm text-gray-500">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : ""}</p></article>)}</div> : <p className="text-gray-600">No exam submissions found.</p>
            ) : (
              <>
                {questions.length ? <div className="divide-y">{questions.map((question) => <article key={question.id} className="flex items-center justify-between gap-4 py-3"><div><p className="font-medium">{question.question || question.text || question.title || question.id}</p><p className="text-xs text-gray-500">{question.question_type || question.type || ""}</p></div><div className="flex gap-2"><button onClick={async () => { try { const data = await questionApi.fetchQuestion(question.id); setQuestionDetails(JSON.stringify(data, null, 2)); setQuestionJsonError(""); } catch { /* Hook reports failures. */ } }} className="rounded border px-3 py-1.5 text-sm">Load details</button><button onClick={async () => { if (window.confirm("Delete this question?")) { try { await questionApi.removeQuestion(question.id); await examsApi.fetchBankQuestions(selectedExam.id); } catch { /* Hook reports failures. */ } } }} className="rounded border px-3 py-1.5 text-sm text-red-600">Delete</button></div></article>)}</div> : <p className="text-gray-600">No linked bank questions found for this examination.</p>}
                <form onSubmit={submitQuestionPayload} className="mt-5 space-y-2 border-t pt-4">
                  <label className="block text-sm font-medium">Add/link questions (request JSON)
                    <textarea value={questionPayload} onChange={(event) => setQuestionPayload(event.target.value)} className="mt-1 w-full rounded-lg border p-3 font-mono text-sm" rows="3" />
                  </label>
                  <button disabled={examsApi.mutating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Send question request</button>
                </form>
              </>
            )}
            {detailView === "submissions" && examsApi.submissionPagination && (
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-500">Page {examsApi.submissionPagination.page} · {examsApi.submissionPagination.total} submissions</span>
                <div className="flex gap-2">
                  <button type="button" disabled={!examsApi.submissionPagination.previous || submissionPage <= 1} onClick={() => changeSubmissionPage(submissionPage - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
                  <button type="button" disabled={!examsApi.submissionPagination.next} onClick={() => changeSubmissionPage(submissionPage + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
            {detailView === "questions" && questionDetails && <form onSubmit={saveQuestionDetails} className="mt-4 space-y-2 border-t pt-4">
              <label className="block text-sm font-medium">Update question (request JSON)
                <textarea value={questionDetails} onChange={(event) => setQuestionDetails(event.target.value)} className="mt-1 w-full rounded-lg border p-3 font-mono text-xs" rows="8" />
              </label>
              <button disabled={questionApi.mutating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Update question</button>
            </form>}
            {questionJsonError && <p role="alert" className="mt-3 text-sm text-red-600">{questionJsonError}</p>}
          </section>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveExam} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{editingExam ? "Edit examination" : "Create examination"}</h3><button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button></div>
            <input required maxLength={200} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border p-3" />
            <textarea placeholder="Description" value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border p-3" rows="2" />
            <select required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="w-full rounded-lg border p-3"><option value="">Choose a subject</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.class_name || subject.classname || ""} {subject.name}</option>)}</select>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="text-sm">Start time<input required type="datetime-local" value={form.start_time} onChange={(event) => setForm({ ...form, start_time: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm">End time<input required type="datetime-local" value={form.end_time} onChange={(event) => setForm({ ...form, end_time: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label className="text-sm">Duration (min)<input type="number" min="0" value={form.duration_minutes} onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm">Total marks<input type="number" min="0" value={form.total_marks} onChange={(event) => setForm({ ...form, total_marks: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm">Questions<input type="number" min="0" value={form.num_of_questions} onChange={(event) => setForm({ ...form, num_of_questions: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label></div>
            <textarea placeholder="Instructions" value={form.instructions || ""} onChange={(event) => setForm({ ...form, instructions: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.is_published)} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} /> Published</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Active</label>
            <button disabled={examsApi.mutating} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{examsApi.mutating ? "Saving..." : "Save examination"}</button>
          </form>
        </div>
      )}
    </div>
  );
}

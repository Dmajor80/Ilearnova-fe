import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ChevronLeft, ChevronRight, FileUp, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTeacherCbt, useTeacherClasses } from "@/hooks/teacher";

const initialExamForm = {
  title: "",
  description: "",
  instructions: "",
  class_id: "",
  subject: "",
  term: "",
  start_time: "",
  end_time: "",
  duration_minutes: 30,
  passing_percentage: 50,
  status: "draft",
  shuffle_questions: false,
  shuffle_options: false,
  allow_review: true
};

const makeInitialQuestion = () => ({
  question_text: "",
  question_type: "mcq",
  marks: 1,
  explanation: "",
  options: [
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false }
  ]
});

const EXAM_STATUSES = ["", "draft", "published", "archived"];
const QUESTION_TYPES = ["mcq", "mcq_multi", "true_false", "short_answer", "essay", "fill_blank"];
const toDateTimeInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const unwrapList = (response, keys) => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

const pageButtonClass = "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40";

export default function TeacherCbt() {
  const cbtApi = useTeacherCbt();
  const classesApi = useTeacherClasses();
  const [examForm, setExamForm] = useState(initialExamForm);
  const [questionForm, setQuestionForm] = useState(makeInitialQuestion);
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [examPage, setExamPage] = useState(1);
  const [attemptPage, setAttemptPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [detailTab, setDetailTab] = useState("questions");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [gradingDraft, setGradingDraft] = useState({});
  const fetchSubjects = classesApi.fetchSubjects;

  const selectedExam = cbtApi.selectedExam?.id === selectedExamId
    ? cbtApi.selectedExam
    : cbtApi.exams.find((exam) => exam.id === selectedExamId);
  const listedQuestions = useMemo(
    () => unwrapList(cbtApi.questions, ["questions"]),
    [cbtApi.questions]
  );
  const listedAttempts = useMemo(
    () => unwrapList(cbtApi.attempts, ["attempts"]),
    [cbtApi.attempts]
  );
  const examPagination = cbtApi.examPagination;
  const questionPagination = cbtApi.questionPagination;
  const attemptPagination = cbtApi.attemptPagination;

  useEffect(() => {
    if (!examForm.class_id && classesApi.classes.length) {
      setExamForm((current) => ({ ...current, class_id: classesApi.classes[0].id }));
    }
  }, [classesApi.classes, examForm.class_id]);

  useEffect(() => {
    if (!examForm.class_id) {
      setSubjects([]);
      setExamForm((current) => ({ ...current, subject: "" }));
      return;
    }
    let active = true;
    fetchSubjects(examForm.class_id).then((response) => {
      if (!active) return;
      const classSubjects = unwrapList(response, ["subjects"]);
      setSubjects(classSubjects);
      setExamForm((current) => ({
        ...current,
        subject: classSubjects.some((subject) => subject.id === current.subject)
          ? current.subject
          : classSubjects[0]?.id || ""
      }));
    }).catch(() => {
      if (active) {
        setSubjects([]);
        setExamForm((current) => ({ ...current, subject: "" }));
      }
    });
    return () => { active = false; };
  }, [fetchSubjects, examForm.class_id]);

  const handleFilter = async (event) => {
    event.preventDefault();
    setExamPage(1);
    await cbtApi.refreshExams({
      class_id: filterClass || undefined,
      status: filterStatus || undefined,
      page: 1
    });
  };

  const changeExamPage = (page) => {
    setExamPage(page);
    cbtApi.refreshExams({
      class_id: filterClass || undefined,
      status: filterStatus || undefined,
      page
    });
  };

  const editExam = async (exam) => {
    setErrorMessage("");
    try {
      const details = await cbtApi.fetchExam(exam.id);
      const source = details || exam;
      setEditingExamId(exam.id);
      setExamForm({
        ...initialExamForm,
        class_id: source.class_id || exam.class_id || "",
        subject: source.subject || exam.subject || "",
        title: source.title || "",
        description: source.description || "",
        instructions: source.instructions || "",
        term: source.term || "",
        duration_minutes: source.duration_minutes ?? initialExamForm.duration_minutes,
        passing_percentage: source.passing_percentage ?? initialExamForm.passing_percentage,
        status: source.status || "draft",
        start_time: toDateTimeInput(source.start_time),
        end_time: toDateTimeInput(source.end_time),
        shuffle_questions: Boolean(source.shuffle_questions),
        shuffle_options: Boolean(source.shuffle_options),
        allow_review: source.allow_review ?? true
      });
      setShowCreateForm(true);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load CBT exam for editing.");
    }
  };

  const chooseExam = async (examId) => {
    setSelectedExamId(examId);
    setDetailTab("questions");
    setAttemptPage(1);
    setQuestionPage(1);
    setErrorMessage("");
    try {
      await Promise.all([
        cbtApi.fetchExam(examId),
        cbtApi.fetchQuestions(examId, { page: 1 }),
        cbtApi.fetchAttempts(examId, { page: 1 })
      ]);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load CBT exam details.");
    }
  };

  const createExam = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");
    if (!examForm.title.trim() || !examForm.subject) {
      setErrorMessage("Enter an exam title and choose a subject.");
      return;
    }
    if (examForm.status === "published" && (!examForm.start_time || !examForm.end_time)) {
      setErrorMessage("Published exams need a start and end time.");
      return;
    }
    if (examForm.start_time && examForm.end_time &&
      new Date(examForm.start_time) >= new Date(examForm.end_time)) {
      setErrorMessage("The exam end time must be later than its start time.");
      return;
    }

    const payload = {
      title: examForm.title.trim(),
      description: examForm.description.trim() || null,
      instructions: examForm.instructions.trim(),
      subject: examForm.subject,
      term: examForm.term.trim(),
      duration_minutes: Number(examForm.duration_minutes),
      passing_percentage: Number(examForm.passing_percentage),
      shuffle_questions: examForm.shuffle_questions,
      shuffle_options: examForm.shuffle_options,
      allow_review: examForm.allow_review,
      status: examForm.status
    };
    if (examForm.start_time) payload.start_time = new Date(examForm.start_time).toISOString();
    if (examForm.end_time) payload.end_time = new Date(examForm.end_time).toISOString();

    try {
      const savedExam = await cbtApi.saveExam(payload, editingExamId || undefined, {
        class_id: filterClass || undefined,
        status: filterStatus || undefined,
        page: examPage
      });
      setShowCreateForm(false);
      setEditingExamId("");
      setExamForm((current) => ({
        ...initialExamForm,
        class_id: current.class_id,
        subject: current.subject
      }));
      if (savedExam?.id) {
        setSelectedExamId(savedExam.id);
        await Promise.all([
          cbtApi.fetchExam(savedExam.id),
          cbtApi.fetchQuestions(savedExam.id, { page: 1 }),
          cbtApi.fetchAttempts(savedExam.id, { page: 1 })
        ]);
      }
      setNotice(editingExamId ? "CBT exam updated." : "CBT exam saved.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save CBT exam.");
    }
  };

  const updateQuestionOption = (index, field, value) => {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => ({
        ...option,
        [field]: field === "is_correct" && value && ["mcq", "true_false"].includes(current.question_type)
          ? optionIndex === index
          : optionIndex === index ? value : option[field]
      }))
    }));
  };

  const saveQuestion = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");
    if (!selectedExamId || !questionForm.question_text.trim()) {
      setErrorMessage("Select an exam and enter the question text.");
      return;
    }
    const hasOptions = ["mcq", "mcq_multi", "true_false"].includes(questionForm.question_type);
    const options = hasOptions
      ? questionForm.options
        .map((option, index) => ({ ...option, option_text: option.option_text.trim(), order: index }))
        .filter((option) => option.option_text)
      : [];
    if (hasOptions && options.length < 2) {
      setErrorMessage("Add at least two answer options.");
      return;
    }
    if (hasOptions && !options.some((option) => option.is_correct)) {
      setErrorMessage("Mark at least one answer as correct.");
      return;
    }

    try {
      await cbtApi.addQuestion(selectedExamId, {
        question_text: questionForm.question_text.trim(),
        question_type: questionForm.question_type,
        marks: Number(questionForm.marks),
        explanation: questionForm.explanation.trim(),
        ...(hasOptions ? { options } : {})
      });
      setQuestionForm(makeInitialQuestion());
      setNotice("Question added to the exam.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to add question.");
    }
  };

  const importQuestion = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selectedExamId) return;
    setErrorMessage("");
    setNotice("");
    try {
      await cbtApi.importQuestion(selectedExamId, file);
      setNotice("QTI question imported.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to import this QTI item.");
    }
  };

  const changeQuestionPage = (page) => {
    setQuestionPage(page);
    cbtApi.fetchQuestions(selectedExamId, { page });
  };

  const changeAttemptPage = (page) => {
    setAttemptPage(page);
    cbtApi.fetchAttempts(selectedExamId, { page });
  };

  const updateGradeDraft = (answerId, field, value) => {
    setGradingDraft((current) => ({
      ...current,
      [answerId]: { ...current[answerId], [field]: value }
    }));
  };

  const saveGrade = async (answer) => {
    const attemptId = cbtApi.selectedAttempt?.attempt_id || cbtApi.selectedAttempt?.id;
    const questionId = answer.question_id || answer.question?.id;
    if (!attemptId || !questionId) {
      setErrorMessage("This answer is missing an attempt or question identifier.");
      return;
    }
    const draft = gradingDraft[questionId] || {};
    try {
      await cbtApi.gradeAnswer(attemptId, questionId, {
        marks_awarded: Number(draft.marks_awarded ?? answer.marks_awarded ?? 0),
        feedback: draft.feedback ?? answer.feedback ?? ""
      });
      setNotice("Answer grade saved.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save this grade.");
    }
  };

  const pageInfo = (pagination) => pagination
    ? `Page ${pagination.page} · ${pagination.total} total`
    : "";

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Computer-based testing</p>
          <h2 className="mt-1 text-2xl font-bold">CBT exam management</h2>
          <p className="mt-2 text-sm text-blue-100">Create and publish exams, manage questions, review attempts, and grade responses.</p>
        </div>
        <button type="button" onClick={() => {
          if (showCreateForm) {
            setEditingExamId("");
            setExamForm(initialExamForm);
            setShowCreateForm(false);
          } else {
            setShowCreateForm(true);
          }
          setErrorMessage("");
        }} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-50">
          <Plus size={17} /> {showCreateForm ? "Close form" : "Create exam"}
        </button>
      </section>

      {(errorMessage || notice || cbtApi.error) && (
        <div role={errorMessage || cbtApi.error ? "alert" : "status"} className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
          errorMessage || cbtApi.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"
        }`}>
          {errorMessage || cbtApi.error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <Check size={18} className="mt-0.5 shrink-0" />}
          <span>{errorMessage || cbtApi.error?.message || notice}</span>
        </div>
      )}
      {classesApi.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{classesApi.error.message}</p>}

      {showCreateForm && (
        <form onSubmit={createExam} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">{editingExamId ? "Edit CBT exam" : "New CBT exam"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-medium">Title
              <input required maxLength={200} value={examForm.title} onChange={(event) => setExamForm({ ...examForm, title: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Class
              <select value={examForm.class_id} onChange={(event) => setExamForm({ ...examForm, class_id: event.target.value })} className="mt-1 w-full rounded-lg border p-3">
                <option value="">Choose a class</option>
                {classesApi.classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name || classItem.class_name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Subject
              <select required value={examForm.subject} onChange={(event) => setExamForm({ ...examForm, subject: event.target.value })} className="mt-1 w-full rounded-lg border p-3">
                <option value="">Choose a subject</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Term
              <input maxLength={20} placeholder="e.g. 2026-T1" value={examForm.term} onChange={(event) => setExamForm({ ...examForm, term: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Starts at
              <input type="datetime-local" value={examForm.start_time} onChange={(event) => setExamForm({ ...examForm, start_time: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Ends at
              <input type="datetime-local" value={examForm.end_time} onChange={(event) => setExamForm({ ...examForm, end_time: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Duration (minutes)
              <input type="number" min="1" required value={examForm.duration_minutes} onChange={(event) => setExamForm({ ...examForm, duration_minutes: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Passing percentage
              <input type="number" min="0" max="100" step="0.1" value={examForm.passing_percentage} onChange={(event) => setExamForm({ ...examForm, passing_percentage: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium">Status
              <select value={examForm.status} onChange={(event) => setExamForm({ ...examForm, status: event.target.value })} className="mt-1 w-full rounded-lg border p-3">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="text-sm font-medium md:col-span-2">Description
              <textarea rows="2" value={examForm.description} onChange={(event) => setExamForm({ ...examForm, description: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="text-sm font-medium md:col-span-2">Instructions
              <textarea rows="2" value={examForm.instructions} onChange={(event) => setExamForm({ ...examForm, instructions: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            {[
              ["shuffle_questions", "Shuffle questions"],
              ["shuffle_options", "Shuffle options"],
              ["allow_review", "Allow review after the exam"]
            ].map(([field, label]) => (
              <label key={field} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={examForm[field]} onChange={(event) => setExamForm({ ...examForm, [field]: event.target.checked })} />
                {label}
              </label>
            ))}
          </div>
          <button type="submit" disabled={cbtApi.mutating || classesApi.loading} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {cbtApi.mutating ? "Saving..." : editingExamId ? "Save changes" : "Save exam"}
          </button>
        </form>
      )}

      <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Exams</h3>
          <button type="button" onClick={() => cbtApi.refreshExams({ class_id: filterClass || undefined, status: filterStatus || undefined, page: examPage }, true)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
        <form onSubmit={handleFilter} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <select value={filterClass} onChange={(event) => setFilterClass(event.target.value)} aria-label="Filter CBT exams by class" className="rounded-lg border p-3">
            <option value="">All classes</option>
            {classesApi.classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name || classItem.class_name}</option>)}
          </select>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} aria-label="Filter CBT exams by status" className="rounded-lg border p-3">
            {EXAM_STATUSES.map((status) => <option key={status || "all"} value={status}>{status ? status[0].toUpperCase() + status.slice(1) : "All statuses"}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-gray-900 px-4 py-3 font-medium text-white">Apply filters</button>
        </form>
        {cbtApi.loading && <p className="py-4 text-center text-gray-500">Loading CBT exams...</p>}
        {!cbtApi.loading && !cbtApi.exams.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No CBT exams found.</p>}
        <div className="divide-y">
          {cbtApi.exams.map((exam) => (
            <article key={exam.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {exam.subject_name || "Subject"}{exam.class_name ? ` · ${exam.class_name}` : ""}
                  {` · ${exam.question_count ?? exam.questions?.length ?? 0} questions · ${exam.duration_minutes || 0} min`}
                </p>
                <p className="mt-1 text-xs capitalize text-gray-500">{exam.status || "draft"}{exam.attempt_count != null ? ` · ${exam.attempt_count} attempts` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => chooseExam(exam.id)} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Manage</button>
                <button type="button" onClick={() => editExam(exam)} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Edit</button>
                {exam.status !== "archived" && (
                  <button type="button" disabled={cbtApi.mutating} onClick={() => cbtApi.saveExam({
                    status: exam.status === "published" ? "draft" : "published"
                  }, exam.id, {
                    class_id: filterClass || undefined,
                    status: filterStatus || undefined,
                    page: examPage
                  }).catch((error) => setErrorMessage(error.message || "Unable to update exam status."))} className="rounded-lg border px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
                    {exam.status === "published" ? "Move to draft" : "Publish"}
                  </button>
                )}
                <button type="button" onClick={async () => {
                  if (window.confirm(`Delete "${exam.title}"?`)) {
                    try {
                      await cbtApi.removeExam(exam.id, {
                        class_id: filterClass || undefined,
                        status: filterStatus || undefined,
                        page: examPage
                      });
                      if (selectedExamId === exam.id) setSelectedExamId("");
                    } catch (error) {
                      setErrorMessage(error.message || "Unable to delete exam.");
                    }
                  }
                }} aria-label={`Delete ${exam.title}`} className="rounded-lg border px-3 py-2 text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
        {examPagination && (
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-gray-500">{pageInfo(examPagination)}</span>
            <div className="flex gap-2">
              <button type="button" className={pageButtonClass} disabled={!examPagination.previous || examPage <= 1} onClick={() => changeExamPage(examPage - 1)}><ChevronLeft size={15} /> Previous</button>
              <button type="button" className={pageButtonClass} disabled={!examPagination.next} onClick={() => changeExamPage(examPage + 1)}>Next <ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </section>

      {selectedExamId && (
        <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{selectedExam?.title || "Selected exam"}</h3>
              <p className="text-sm text-gray-500">{selectedExam?.subject_name || "CBT exam details"}</p>
            </div>
            <button type="button" onClick={() => setSelectedExamId("")} className="rounded-lg border px-3 py-2 text-sm">Close details</button>
          </div>
          <div className="flex gap-2 border-b">
            {["questions", "attempts"].map((tab) => (
              <button key={tab} type="button" onClick={() => setDetailTab(tab)} className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
                detailTab === tab ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"
              }`}>{tab}</button>
            ))}
          </div>

          {detailTab === "questions" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-semibold">Questions</h4>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                  <FileUp size={15} /> Import QTI item
                  <input type="file" accept=".xml,text/xml,application/xml" onChange={importQuestion} className="sr-only" />
                </label>
              </div>
              {listedQuestions.length ? (
                <div className="divide-y">
                  {listedQuestions.map((question, index) => (
                    <article key={question.id || index} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{question.order != null ? `${question.order + 1}. ` : ""}{question.question_text || "Question"}</p>
                          <p className="mt-1 text-xs capitalize text-gray-500">{question.question_type || "Question"} · {question.marks ?? 1} mark(s)</p>
                        </div>
                      </div>
                      {Array.isArray(question.options) && <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {question.options.map((option, optionIndex) => <li key={option.id || optionIndex}>{option.option_text || option.text || "Option"}{option.is_correct ? " · Correct" : ""}</li>)}
                      </ul>}
                    </article>
                  ))}
                </div>
              ) : <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No questions have been added to this exam.</p>}
              {questionPagination && (
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-gray-500">{pageInfo(questionPagination)}</span>
                  <div className="flex gap-2">
                    <button type="button" className={pageButtonClass} disabled={!questionPagination.previous || questionPage <= 1} onClick={() => changeQuestionPage(questionPage - 1)}><ChevronLeft size={15} /> Previous</button>
                    <button type="button" className={pageButtonClass} disabled={!questionPagination.next} onClick={() => changeQuestionPage(questionPage + 1)}>Next <ChevronRight size={15} /></button>
                  </div>
                </div>
              )}
              <form onSubmit={saveQuestion} className="space-y-3 rounded-lg border-t pt-4">
                <h4 className="font-semibold">Add a question</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-sm font-medium sm:col-span-2">Question text
                    <textarea required value={questionForm.question_text} onChange={(event) => setQuestionForm({ ...questionForm, question_text: event.target.value })} className="mt-1 w-full rounded-lg border p-3" rows="2" />
                  </label>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Question type
                      <select value={questionForm.question_type} onChange={(event) => setQuestionForm({
                        ...questionForm,
                        question_type: event.target.value,
                        options: event.target.value === "true_false"
                          ? [{ option_text: "True", is_correct: false }, { option_text: "False", is_correct: false }]
                          : ["mcq", "mcq_multi"].includes(event.target.value)
                            ? makeInitialQuestion().options
                            : []
                      })} className="mt-1 w-full rounded-lg border p-3">
                        {QUESTION_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
                      </select>
                    </label>
                    <label className="block text-sm font-medium">Marks
                      <input type="number" min="0.01" step="0.01" value={questionForm.marks} onChange={(event) => setQuestionForm({ ...questionForm, marks: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
                    </label>
                  </div>
                </div>
                {questionForm.options.length > 0 && (
                  <div className="space-y-2">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type={questionForm.question_type === "mcq" || questionForm.question_type === "true_false" ? "radio" : "checkbox"} name="cbt-correct-option" checked={option.is_correct} onChange={(event) => updateQuestionOption(index, "is_correct", event.target.checked)} aria-label={`Correct answer option ${index + 1}`} />
                        <input required maxLength={500} value={option.option_text} onChange={(event) => updateQuestionOption(index, "option_text", event.target.value)} className="w-full rounded-lg border p-2" aria-label={`Answer option ${index + 1}`} />
                        {questionForm.question_type !== "true_false" && <button type="button" onClick={() => setQuestionForm((current) => ({ ...current, options: current.options.filter((_, optionIndex) => optionIndex !== index) }))} aria-label={`Remove option ${index + 1}`} className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>}
                      </div>
                    ))}
                    {questionForm.question_type !== "true_false" && <button type="button" onClick={() => setQuestionForm((current) => ({ ...current, options: [...current.options, { option_text: "", is_correct: false }] }))} className="inline-flex items-center gap-1 text-sm font-medium text-blue-700"><Plus size={15} /> Add option</button>}
                  </div>
                )}
                <label className="block text-sm font-medium">Explanation (optional)
                  <textarea value={questionForm.explanation} onChange={(event) => setQuestionForm({ ...questionForm, explanation: event.target.value })} className="mt-1 w-full rounded-lg border p-3" rows="2" />
                </label>
                <button type="submit" disabled={cbtApi.mutating} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{cbtApi.mutating ? "Saving..." : "Add question"}</button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold">Student attempts</h4>
              {listedAttempts.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead><tr className="border-b text-xs uppercase text-gray-500"><th className="py-2 pr-3">Student</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Score</th><th className="py-2 pr-3">Submitted</th><th className="py-2">Review</th></tr></thead>
                    <tbody className="divide-y">
                      {listedAttempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td className="py-3 pr-3">{attempt.student_name || attempt.student_id}</td>
                          <td className="py-3 pr-3 capitalize">{attempt.status}</td>
                          <td className="py-3 pr-3">{attempt.score ?? "—"}{attempt.percentage != null ? ` (${attempt.percentage}%)` : ""}</td>
                          <td className="py-3 pr-3">{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "—"}</td>
                          <td className="py-3"><button type="button" onClick={() => cbtApi.fetchAttempt(attempt.id).catch((error) => setErrorMessage(error.message))} className="rounded border px-2 py-1 text-blue-700 hover:bg-blue-50">Review</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No student attempts found.</p>}
              {attemptPagination && (
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-gray-500">{pageInfo(attemptPagination)}</span>
                  <div className="flex gap-2">
                    <button type="button" className={pageButtonClass} disabled={!attemptPagination.previous || attemptPage <= 1} onClick={() => changeAttemptPage(attemptPage - 1)}><ChevronLeft size={15} /> Previous</button>
                    <button type="button" className={pageButtonClass} disabled={!attemptPagination.next} onClick={() => changeAttemptPage(attemptPage + 1)}>Next <ChevronRight size={15} /></button>
                  </div>
                </div>
              )}
              {cbtApi.selectedAttempt && (
                <div className="space-y-3 rounded-lg border-t pt-4">
                  <div>
                    <h5 className="font-semibold">Attempt review</h5>
                    <p className="text-sm text-gray-500">{cbtApi.selectedAttempt.student_name || cbtApi.selectedAttempt.student?.name || "Student"} · {cbtApi.selectedAttempt.status}</p>
                  </div>
                  {Array.isArray(cbtApi.selectedAttempt.answers) && cbtApi.selectedAttempt.answers.length ? (
                    cbtApi.selectedAttempt.answers.map((answer, index) => {
                      const questionId = answer.question_id || answer.question?.id;
                      const draft = gradingDraft[questionId] || {};
                      return (
                        <article key={answer.id || questionId || index} className="space-y-2 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-medium">{answer.question_text || answer.question?.question_text || `Answer ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">{answer.answer_text || answer.response_text || answer.selected_option_text || "No written response"}</p>
                          {questionId && (
                            <div className="grid gap-2 sm:grid-cols-[140px_1fr_auto]">
                              <label className="text-xs font-medium">Marks awarded
                                <input type="number" min="0" step="0.01" value={draft.marks_awarded ?? answer.marks_awarded ?? 0} onChange={(event) => updateGradeDraft(questionId, "marks_awarded", event.target.value)} className="mt-1 w-full rounded border p-2 text-sm" />
                              </label>
                              <label className="text-xs font-medium">Feedback
                                <input value={draft.feedback ?? answer.feedback ?? ""} onChange={(event) => updateGradeDraft(questionId, "feedback", event.target.value)} className="mt-1 w-full rounded border p-2 text-sm" />
                              </label>
                              <button type="button" onClick={() => saveGrade(answer)} disabled={cbtApi.mutating} className="self-end rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Save grade</button>
                            </div>
                          )}
                        </article>
                      );
                    })
                  ) : <pre className="overflow-auto rounded-lg bg-gray-50 p-3 text-xs">{JSON.stringify(cbtApi.selectedAttempt, null, 2)}</pre>}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

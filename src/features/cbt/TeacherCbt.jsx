import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock3,
  FileUp,
  Plus,
  Save,
  Trash2,
  Users
} from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";
import {
  createId,
  DEMO_CLASSES,
  loadAttempts,
  loadExams,
  saveExams,
  subscribeToCbtUpdates
} from "./cbtStorage";
import { parseQtiXml } from "./qtiImport";

const initialExamForm = {
  title: "",
  subject: "",
  classId: DEMO_CLASSES[0].id,
  durationMinutes: 30,
  availableFrom: "",
  availableUntil: "",
  instructions: "Read each question carefully. You may move between questions and review flagged items before submitting.",
  shuffleQuestions: false,
  shuffleOptions: false
};

const initialQuestion = {
  type: "single",
  prompt: "",
  options: ["", "", "", ""],
  correctOptionIds: [],
  correctText: ""
};

const QTI_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqtiasi_v3p0"
  identifier="sample-item" title="Sample question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse><value>choice-a</value></correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Which planet is known as the Red Planet?</p>
    <choiceInteraction responseIdentifier="RESPONSE" maxChoices="1">
      <simpleChoice identifier="choice-a">Mars</simpleChoice>
      <simpleChoice identifier="choice-b">Venus</simpleChoice>
      <simpleChoice identifier="choice-c">Jupiter</simpleChoice>
    </choiceInteraction>
  </itemBody>
</assessmentItem>`;

function downloadQtiSample() {
  const file = new Blob([QTI_SAMPLE], { type: "application/xml" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ilearnova-qti-sample.xml";
  link.click();
  URL.revokeObjectURL(url);
}

export default function TeacherCbt() {
  const { user } = useOrganization();
  const [exams, setExams] = useState(loadExams);
  const [attempts, setAttempts] = useState(loadAttempts);
  const [examForm, setExamForm] = useState(initialExamForm);
  const [questionDraft, setQuestionDraft] = useState(initialQuestion);
  const [questions, setQuestions] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => subscribeToCbtUpdates(() => {
    setExams(loadExams());
    setAttempts(loadAttempts());
  }), []);

  const selectedClass = DEMO_CLASSES.find((classItem) => classItem.id === examForm.classId) || DEMO_CLASSES[0];
  const publishedCount = useMemo(() => exams.filter((exam) => exam.status === "published").length, [exams]);
  const questionOptions = questionDraft.options.map((text, index) => ({
    id: `option-${index}`,
    text
  }));

  const updateExamField = (event) => {
    const { name, value, type, checked } = event.target;
    setExamForm((form) => ({ ...form, [name]: type === "checkbox" ? checked : value }));
  };

  const updateQuestionType = (type) => {
    setQuestionDraft({
      ...initialQuestion,
      type,
      options: type === "text" ? [] : ["", "", "", ""]
    });
  };

  const updateOption = (index, value) => {
    setQuestionDraft((draft) => ({
      ...draft,
      options: draft.options.map((option, optionIndex) => optionIndex === index ? value : option)
    }));
  };

  const toggleCorrectOption = (optionId) => {
    setQuestionDraft((draft) => {
      if (draft.type === "single") return { ...draft, correctOptionIds: [optionId] };
      const selected = draft.correctOptionIds.includes(optionId)
        ? draft.correctOptionIds.filter((id) => id !== optionId)
        : [...draft.correctOptionIds, optionId];
      return { ...draft, correctOptionIds: selected };
    });
  };

  const addOption = () => {
    setQuestionDraft((draft) => ({ ...draft, options: [...draft.options, ""] }));
  };

  const addQuestion = () => {
    const prompt = questionDraft.prompt.trim();
    if (!prompt) {
      setError("Enter the question text before adding it.");
      return;
    }
    if (questionDraft.type === "text" && !questionDraft.correctText.trim()) {
      setError("Provide the expected answer for an automatically marked text question.");
      return;
    }
    if (questionDraft.type !== "text") {
      const options = questionDraft.options
        .map((text, index) => ({ id: `option-${index}`, text: text.trim() }))
        .filter((option) => option.text);
      if (options.length < 2) {
        setError("Add at least two non-empty answer options.");
        return;
      }
      if (!questionDraft.correctOptionIds.some((id) => options.some((option) => option.id === id))) {
        setError("Mark the correct answer before adding this question.");
        return;
      }
      setQuestions((current) => [...current, {
        id: createId("question"),
        type: questionDraft.type,
        prompt,
        options,
        correctOptionIds: questionDraft.correctOptionIds.filter((id) => options.some((option) => option.id === id)),
        points: 1
      }]);
    } else {
      setQuestions((current) => [...current, {
        id: createId("question"),
        type: "text",
        prompt,
        correctText: questionDraft.correctText.trim(),
        points: 1
      }]);
    }
    setError("");
    setQuestionDraft(initialQuestion);
  };

  const removeQuestion = (questionId) => {
    setQuestions((current) => current.filter((question) => question.id !== questionId));
  };

  const importQtiFiles = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    if (!files.length) return;

    setImporting(true);
    setError("");
    const imported = [];
    const failures = [];
    for (const file of files) {
      try {
        imported.push(...parseQtiXml(await file.text(), file.name));
      } catch (importError) {
        failures.push(`${file.name}: ${importError.message}`);
      }
    }
    if (imported.length) {
      setQuestions((current) => [...current, ...imported]);
      setNotice(`Imported ${imported.length} question${imported.length === 1 ? "" : "s"} from QTI XML.`);
    }
    if (failures.length) setError(failures.join(" "));
    setImporting(false);
  };

  const createExam = (status) => {
    setError("");
    setNotice("");
    if (!examForm.title.trim() || !examForm.subject.trim()) {
      setError("Enter an exam title and subject.");
      return;
    }
    if (!questions.length) {
      setError("Add or import at least one question before saving the exam.");
      return;
    }
    if (examForm.availableFrom && examForm.availableUntil
      && new Date(examForm.availableFrom) >= new Date(examForm.availableUntil)) {
      setError("The exam closing time must be later than its opening time.");
      return;
    }

    const exam = {
      id: createId("exam"),
      title: examForm.title.trim(),
      subject: examForm.subject.trim(),
      classId: selectedClass.id,
      className: selectedClass.name,
      durationMinutes: Math.max(1, Number(examForm.durationMinutes) || 1),
      availableFrom: examForm.availableFrom ? new Date(examForm.availableFrom).toISOString() : null,
      availableUntil: examForm.availableUntil ? new Date(examForm.availableUntil).toISOString() : null,
      instructions: examForm.instructions.trim(),
      status,
      shuffleQuestions: examForm.shuffleQuestions,
      shuffleOptions: examForm.shuffleOptions,
      createdBy: user?.name || user?.full_name || user?.email || "Teacher",
      createdAt: new Date().toISOString(),
      questions
    };
    const nextExams = [exam, ...loadExams()];
    saveExams(nextExams);
    setExams(nextExams);
    setExamForm({ ...initialExamForm });
    setQuestions([]);
    setQuestionDraft(initialQuestion);
    setIsCreating(false);
    setNotice(status === "published" ? "Exam published to the selected class." : "Exam saved as a draft.");
  };

  const updateExamStatus = (exam, status) => {
    const nextExams = loadExams().map((item) =>
      item.id === exam.id ? { ...item, status } : item
    );
    saveExams(nextExams);
    setExams(nextExams);
    setNotice(status === "published" ? "Exam published to its class." : "Exam moved to drafts.");
  };

  const deleteExam = (exam) => {
    if (!window.confirm(`Delete "${exam.title}"? This also removes the demo exam from the student list.`)) return;
    const nextExams = loadExams().filter((item) => item.id !== exam.id);
    saveExams(nextExams);
    setExams(nextExams);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Computer-based testing</p>
        <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Create and manage exams</h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">Build a question set, import QTI items, then publish it to a class roster.</p>
          </div>
          <button
            type="button"
            onClick={() => { setIsCreating((open) => !open); setError(""); setNotice(""); }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            <Plus size={18} /> {isCreating ? "Close builder" : "Create exam"}
          </button>
        </div>
      </section>

      {(error || notice) && (
        <div role={error ? "alert" : "status"} className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
          {error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <Check size={18} className="mt-0.5 shrink-0" />}
          <span>{error || notice}</span>
        </div>
      )}

      {isCreating && (
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Exam details</h3>
            <p className="mt-1 text-sm text-gray-500">The exam will only appear in the selected class's student exam list.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Exam title
              <input name="title" value={examForm.title} onChange={updateExamField} placeholder="e.g. Biology: Cell Structure" className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Subject
              <input name="subject" value={examForm.subject} onChange={updateExamField} placeholder="e.g. Biology" className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Class
              <select name="classId" value={examForm.classId} onChange={updateExamField} className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal">
                {DEMO_CLASSES.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name} ({classItem.students} demo students)</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Duration (minutes)
              <input name="durationMinutes" type="number" min="1" max="300" value={examForm.durationMinutes} onChange={updateExamField} className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Opens at (optional)
              <input name="availableFrom" type="datetime-local" value={examForm.availableFrom} onChange={updateExamField} className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Closes at (optional)
              <input name="availableUntil" type="datetime-local" value={examForm.availableUntil} onChange={updateExamField} className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
              Instructions
              <textarea name="instructions" rows="3" value={examForm.instructions} onChange={updateExamField} className="w-full rounded-lg border border-gray-300 p-3 font-normal" />
            </label>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2"><input name="shuffleQuestions" type="checkbox" checked={examForm.shuffleQuestions} onChange={updateExamField} /> Shuffle questions per attempt</label>
            <label className="inline-flex items-center gap-2"><input name="shuffleOptions" type="checkbox" checked={examForm.shuffleOptions} onChange={updateExamField} /> Shuffle answer options per attempt</label>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Import question files</h4>
                <p className="mt-1 text-xs leading-5 text-gray-600">Import one or more standalone QTI 2.x/3.x XML item files. Choice and text-entry items are supported; packaged ZIP tests and embedded media are not parsed.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={downloadQtiSample} className="min-h-10 rounded-lg border border-indigo-200 bg-white px-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50">Download sample</button>
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700">
                  <FileUp size={16} /> {importing ? "Importing..." : "Choose XML"}
                  <input type="file" accept=".xml,text/xml,application/xml" multiple onChange={importQtiFiles} disabled={importing} className="sr-only" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Add a question</h4>
                <p className="mt-1 text-xs text-gray-500">Single choice, multiple select, and exact-match short answer are supported in this demo.</p>
              </div>
              <select value={questionDraft.type} onChange={(event) => updateQuestionType(event.target.value)} aria-label="Question type" className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm">
                <option value="single">Single choice</option>
                <option value="multi">Multiple select</option>
                <option value="text">Short answer</option>
              </select>
            </div>
            <textarea
              value={questionDraft.prompt}
              onChange={(event) => setQuestionDraft((draft) => ({ ...draft, prompt: event.target.value }))}
              placeholder="Write the question..."
              rows="2"
              className="w-full rounded-lg border border-gray-300 p-3"
              aria-label="Question text"
            />
            {questionDraft.type === "text" ? (
              <label className="block space-y-1 text-sm font-medium text-gray-700">
                Expected answer
                <input value={questionDraft.correctText} onChange={(event) => setQuestionDraft((draft) => ({ ...draft, correctText: event.target.value }))} className="min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal" />
              </label>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Select the correct {questionDraft.type === "single" ? "option" : "options"}.</p>
                {questionOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type={questionDraft.type === "single" ? "radio" : "checkbox"}
                      name="correct-answer"
                      checked={questionDraft.correctOptionIds.includes(option.id)}
                      onChange={() => toggleCorrectOption(option.id)}
                      aria-label={`Mark option ${index + 1} correct`}
                    />
                    <input value={option.text} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} className="min-h-10 flex-1 rounded-lg border border-gray-300 px-3" />
                  </div>
                ))}
                <button type="button" onClick={addOption} className="text-sm font-medium text-indigo-700 hover:underline">+ Add option</button>
              </div>
            )}
            <button type="button" onClick={addQuestion} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-indigo-200 px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              <Plus size={16} /> Add question to exam
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Question list</h4>
              <span className="text-sm text-gray-500">{questions.length} question{questions.length === 1 ? "" : "s"}</span>
            </div>
            {!questions.length && <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Add questions manually or import QTI XML files.</p>}
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{index + 1}. {question.prompt}</p>
                  <p className="mt-1 text-xs capitalize text-gray-500">{question.type === "multi" ? "Multiple select" : question.type === "text" ? "Short answer" : "Single choice"}</p>
                </div>
                <button type="button" onClick={() => removeQuestion(question.id)} aria-label={`Remove question ${index + 1}`} className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
            <button type="button" onClick={() => createExam("draft")} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-4 font-semibold text-gray-700 hover:bg-gray-50">
              <Save size={16} /> Save draft
            </button>
            <button type="button" onClick={() => createExam("published")} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700">
              <BookOpenCheck size={17} /> Publish to {selectedClass.name}
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"><ClipboardList className="text-indigo-600" /><div><p className="text-sm text-gray-500">Total exams</p><p className="text-xl font-bold text-gray-900">{exams.length}</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"><BookOpenCheck className="text-green-600" /><div><p className="text-sm text-gray-500">Published</p><p className="text-xl font-bold text-gray-900">{publishedCount}</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"><Users className="text-blue-600" /><div><p className="text-sm text-gray-500">Demo classes</p><p className="text-xl font-bold text-gray-900">{DEMO_CLASSES.length}</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"><Check className="text-teal-600" /><div><p className="text-sm text-gray-500">Demo submissions</p><p className="text-xl font-bold text-gray-900">{attempts.filter((attempt) => attempt.status === "submitted").length}</p></div></div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your exams</h3>
          <p className="mt-1 text-sm text-gray-500">Drafts are visible only to teachers. Published exams appear to students in the assigned demo class.</p>
        </div>
        {!exams.length && <p className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500">No exams yet. Create an exam to get started.</p>}
        {exams.map((exam) => (
          <article key={exam.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-gray-900">{exam.title}</h4>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${exam.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{exam.status}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{exam.subject} · {exam.className} · {exam.questions.length} questions · {exam.durationMinutes} min</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setExpandedExamId((id) => id === exam.id ? null : exam.id)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 text-sm text-gray-700 hover:bg-gray-50">
                  Questions {expandedExamId === exam.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button type="button" onClick={() => updateExamStatus(exam, exam.status === "published" ? "draft" : "published")} className="min-h-10 rounded-lg border px-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50">
                  {exam.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button type="button" onClick={() => deleteExam(exam)} aria-label={`Delete ${exam.title}`} className="min-h-10 rounded-lg border px-3 text-sm text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            {expandedExamId === exam.id && (
              <div className="space-y-3 border-t bg-gray-50/70 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500"><Clock3 size={14} /> {exam.durationMinutes} minute limit <span>·</span> {exam.questions.length} questions</div>
                <div className="rounded-lg border bg-white p-3">
                  <h5 className="mb-2 text-sm font-semibold text-gray-900">Student attempts</h5>
                  {attempts.filter((attempt) => attempt.examId === exam.id && attempt.status === "submitted").length
                    ? <div className="space-y-2">
                      {attempts.filter((attempt) => attempt.examId === exam.id && attempt.status === "submitted").map((attempt) => (
                        <div key={`${attempt.studentId}-${attempt.examId}`} className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-sm last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-800">{attempt.studentName}</span>
                          <span className="text-gray-600">{attempt.result?.earnedPoints ?? 0}/{attempt.result?.totalPoints ?? 0} points ({attempt.result?.percentage ?? 0}%)</span>
                          <span className="text-xs text-gray-500">{attempt.automatic ? "Auto-submitted" : "Submitted"} · {attempt.focusWarnings || 0} focus warnings</span>
                        </div>
                      ))}
                    </div>
                    : <p className="text-xs text-gray-500">No demo submissions yet.</p>}
                </div>
                {exam.questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border bg-white p-3">
                    <p className="text-sm font-medium text-gray-800">{index + 1}. {question.prompt}</p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600">
                      {question.type === "text"
                        ? <li>Expected: {question.correctText}</li>
                        : question.options.map((option) => <li key={option.id} className={question.correctOptionIds.includes(option.id) ? "font-semibold text-green-700" : ""}>{question.correctOptionIds.includes(option.id) ? "✓ " : ""}{option.text}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
      <p className="text-xs leading-5 text-gray-500">Prototype only: exams and attempts are stored in this browser's localStorage and use the demo class rosters. No real student identity verification, server timing, synchronization, or secure grading is active.</p>
    </div>
  );
}

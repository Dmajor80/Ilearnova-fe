import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  Maximize,
  ShieldAlert,
  XCircle
} from "lucide-react";
import {
  DEMO_STUDENTS,
  loadAttempts,
  loadExams,
  saveAttempts,
  scoreAttempt,
  subscribeToCbtUpdates
} from "./cbtStorage";

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getAvailability(exam) {
  const now = Date.now();
  if (exam.availableFrom && now < new Date(exam.availableFrom).getTime()) return "upcoming";
  if (exam.availableUntil && now > new Date(exam.availableUntil).getTime()) return "closed";
  return "available";
}

function makeAttempt(exam, student) {
  const questions = exam.shuffleQuestions ? shuffle(exam.questions) : exam.questions;
  const optionOrders = {};
  exam.questions.forEach((question) => {
    optionOrders[question.id] = exam.shuffleOptions ? shuffle(question.options.map((option) => option.id)) : question.options.map((option) => option.id);
  });
  const startedAt = Date.now();
  return {
    examId: exam.id,
    studentId: student.id,
    studentName: student.name,
    status: "in_progress",
    startedAt,
    deadlineAt: startedAt + Math.max(1, Number(exam.durationMinutes) || 1) * 60 * 1000,
    answers: {},
    flaggedQuestionIds: [],
    questionOrder: questions.map((question) => question.id),
    optionOrders,
    focusWarnings: 0
  };
}

export default function StudentCbt() {
  const [exams, setExams] = useState(loadExams);
  const [attempts, setAttempts] = useState(loadAttempts);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [screen, setScreen] = useState("list");
  const [studentId, setStudentId] = useState(DEMO_STUDENTS[0].id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [focusWarnings, setFocusWarnings] = useState(0);
  const [warning, setWarning] = useState("");
  const submitRef = useRef(null);
  const student = DEMO_STUDENTS.find((item) => item.id === studentId) || DEMO_STUDENTS[0];
  const exam = exams.find((item) => item.id === selectedExamId);
  const result = attempt?.result;

  useEffect(() => subscribeToCbtUpdates(() => {
    setExams(loadExams());
    setAttempts(loadAttempts());
  }), []);

  const classExams = useMemo(
    () => exams.filter((item) => item.status === "published" && item.classId === student.classId),
    [exams, student.classId]
  );
  const questionOrder = attempt?.questionOrder || exam?.questions.map((question) => question.id) || [];
  const question = exam?.questions.find((item) => item.id === questionOrder[activeIndex]);
  const options = question
    ? (attempt?.optionOrders?.[question.id] || question.options.map((option) => option.id))
      .map((id) => question.options.find((option) => option.id === id))
      .filter(Boolean)
    : [];
  const isUrgent = remainingSeconds <= 60;

  const persistAttempt = useCallback((nextAttempt) => {
    setAttempt(nextAttempt);
    const nextAttempts = loadAttempts().filter((item) =>
      !(item.examId === nextAttempt.examId && item.studentId === nextAttempt.studentId)
    );
    nextAttempts.push(nextAttempt);
    saveAttempts(nextAttempts);
    setAttempts(nextAttempts);
  }, []);

  const submitExam = useCallback((automatic = false) => {
    if (!exam || !attempt || attempt.status !== "in_progress") return;
    const score = scoreAttempt(exam, attempt.answers);
    persistAttempt({
      ...attempt,
      status: "submitted",
      submittedAt: Date.now(),
      automatic,
      result: score
    });
    setShowSubmitConfirmation(false);
    setScreen("results");
  }, [attempt, exam, persistAttempt]);
  submitRef.current = submitExam;

  useEffect(() => {
    if (screen !== "session" || !attempt?.deadlineAt || attempt.status !== "in_progress") return undefined;
    const updateTimer = () => {
      const seconds = Math.max(0, Math.ceil((attempt.deadlineAt - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds === 0) submitRef.current?.(true);
    };
    updateTimer();
    const timerId = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timerId);
  }, [attempt?.deadlineAt, attempt?.status, screen]);

  useEffect(() => {
    if (screen !== "session" || !attempt || attempt.status !== "in_progress") return undefined;
    const warnBeforeLeave = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const warnOnFocusLoss = () => {
      if (document.visibilityState !== "hidden") return;
      setFocusWarnings((count) => {
        const nextCount = count + 1;
        const nextAttempt = {
          ...loadAttempts().find((item) => item.examId === attempt.examId && item.studentId === attempt.studentId) || attempt,
          focusWarnings: nextCount
        };
        persistAttempt(nextAttempt);
        return nextCount;
      });
      setWarning("Leaving the exam tab was recorded for this demo attempt. Your answers are saved locally.");
    };
    window.addEventListener("beforeunload", warnBeforeLeave);
    document.addEventListener("visibilitychange", warnOnFocusLoss);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeLeave);
      document.removeEventListener("visibilitychange", warnOnFocusLoss);
    };
  }, [attempt, persistAttempt, screen]);

  useEffect(() => {
    if (screen === "session") {
      setFocusWarnings(attempt?.focusWarnings || 0);
      setWarning("");
    }
  }, [attempt?.focusWarnings, screen, selectedExamId]);

  const beginExam = () => {
    if (!exam) return;
    const existingAttempt = loadAttempts().find((item) =>
      item.examId === exam.id && item.studentId === student.id
    );
    if (existingAttempt?.status === "submitted") {
      setAttempt(existingAttempt);
      setScreen("results");
      return;
    }
    const nextAttempt = existingAttempt || makeAttempt(exam, student);
    if (!existingAttempt) persistAttempt(nextAttempt);
    setAttempt(nextAttempt);
    setActiveIndex(0);
    setRemainingSeconds(Math.max(0, Math.ceil((nextAttempt.deadlineAt - Date.now()) / 1000)));
    setScreen("session");
  };

  const openExam = (selectedExam) => {
    const savedAttempt = attempts.find((item) =>
      item.examId === selectedExam.id && item.studentId === student.id
    ) || loadAttempts().find((item) =>
      item.examId === selectedExam.id && item.studentId === student.id
    );
    setSelectedExamId(selectedExam.id);
    setAttempt(savedAttempt || null);
    setScreen(savedAttempt?.status === "submitted" ? "results" : "instructions");
  };

  const updateAnswer = (answer) => {
    if (!attempt || !question) return;
    persistAttempt({
      ...attempt,
      answers: { ...attempt.answers, [question.id]: answer }
    });
  };

  const toggleOption = (optionId) => {
    if (!question || !attempt) return;
    const currentAnswer = attempt.answers[question.id] || [];
    if (question.type === "single") {
      updateAnswer([optionId]);
      return;
    }
    updateAnswer(currentAnswer.includes(optionId)
      ? currentAnswer.filter((id) => id !== optionId)
      : [...currentAnswer, optionId]);
  };

  const toggleFlag = () => {
    if (!question || !attempt) return;
    const flagged = attempt.flaggedQuestionIds || [];
    persistAttempt({
      ...attempt,
      flaggedQuestionIds: flagged.includes(question.id)
        ? flagged.filter((id) => id !== question.id)
        : [...flagged, question.id]
    });
  };

  const clearAnswer = () => {
    if (!question || !attempt) return;
    const answers = { ...attempt.answers };
    delete answers[question.id];
    persistAttempt({ ...attempt, answers });
  };

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      setWarning("Fullscreen mode could not be enabled in this browser. You can continue the demo exam.");
    }
  };

  const returnToExamList = () => {
    setScreen("list");
    setSelectedExamId(null);
    setAttempt(null);
    setShowSubmitConfirmation(false);
  };

  if (screen === "list") {
    return (
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-sm sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Student examination centre</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">My CBT exams</h2>
            <p className="mt-2 text-sm text-blue-100">Your demo roster: {student.className}</p>
          </div>
          <label className="space-y-1 text-xs font-medium text-blue-50">
            Demo student profile
            <select value={student.id} onChange={(event) => setStudentId(event.target.value)} className="block min-h-10 rounded-lg border border-white/40 bg-white px-3 text-sm text-gray-900">
              {DEMO_STUDENTS.map((studentItem) => <option key={studentItem.id} value={studentItem.id}>{studentItem.name}</option>)}
            </select>
          </label>
        </section>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
          Prototype mode: this page uses a local demo student and class roster. Real verified enrollment and exam permissions must be enforced by the backend.
        </div>
        {!classExams.length && <div className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500">        There are no published exams for {student.className} yet.</div>}
        <div className="grid gap-4 lg:grid-cols-2">
          {classExams.map((item) => {
            const availability = getAvailability(item);
            const savedAttempt = attempts.find((candidate) =>
              candidate.examId === item.id && candidate.studentId === student.id
            );
            const alreadySubmitted = savedAttempt?.status === "submitted";
            const unavailable = availability !== "available" && !savedAttempt;
            return (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{item.subject}</p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900">{item.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{item.className}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${alreadySubmitted ? "bg-green-100 text-green-800" : unavailable ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-800"}`}>
                    {alreadySubmitted ? "Completed" : savedAttempt?.status === "in_progress" ? "In progress" : availability}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={16} /> {item.durationMinutes} minutes</span>
                  <span>{item.questions.length} questions</span>
                  <span>{item.questions.reduce((total, questionItem) => total + (Number(questionItem.points) || 1), 0)} points</span>
                </div>
                <button type="button" disabled={unavailable} onClick={() => openExam(item)} className="mt-5 min-h-11 w-full rounded-lg bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                  {alreadySubmitted ? "View results" : savedAttempt?.status === "in_progress" ? "Resume exam" : unavailable ? (availability === "upcoming" ? "Not open yet" : "Exam closed") : "View instructions"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  if (!exam) {
    return <div className="rounded-xl border bg-white p-6"><p>That exam is no longer available.</p><button type="button" onClick={returnToExamList} className="mt-4 text-indigo-700 underline">Return to exams</button></div>;
  }

  if (screen === "instructions") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <button type="button" onClick={returnToExamList} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"><ArrowLeft size={16} /> All exams</button>
        <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{exam.subject} · {exam.className}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{exam.title}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Questions</p><p className="mt-1 font-semibold">{exam.questions.length}</p></div>
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Duration</p><p className="mt-1 font-semibold">{exam.durationMinutes} minutes</p></div>
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Maximum score</p><p className="mt-1 font-semibold">{exam.questions.reduce((total, questionItem) => total + (Number(questionItem.points) || 1), 0)} points</p></div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">Instructions</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{exam.instructions || "Answer all questions and submit before the timer reaches zero."}</p>
          </div>
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Your answers and timer are saved on this device for this prototype. Do not close the exam tab; leaving it is recorded as a focus warning.
          </div>
          <button type="button" onClick={beginExam} className="mt-6 min-h-12 w-full rounded-lg bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700">Start exam</button>
        </section>
      </div>
    );
  }

  if (screen === "results" && result) {
    const percent = result.percentage;
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Exam submitted{attempt?.automatic ? " automatically when time expired" : ""}</p>
          <h2 className="mt-2 text-2xl font-bold">{exam.title}</h2>
          <div className="mt-5 flex flex-wrap items-end gap-8">
            <div><p className="text-sm text-blue-100">Score</p><p className="text-4xl font-bold">{result.earnedPoints}/{result.totalPoints}</p></div>
            <div><p className="text-sm text-blue-100">Percentage</p><p className="text-3xl font-bold">{percent}%</p></div>
          </div>
        </section>
        <section className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-bold text-gray-900">Answer review</h3>
          {exam.questions.map((item, index) => {
            const review = result.review.find((entry) => entry.questionId === item.id);
            const answer = attempt.answers[item.id];
            const correctLabel = item.type === "text"
              ? item.correctText
              : item.options.filter((option) => item.correctOptionIds.includes(option.id)).map((option) => option.text).join(", ");
            const answerLabel = item.type === "text"
              ? answer || "No answer"
              : item.options.filter((option) => (answer || []).includes(option.id)).map((option) => option.text).join(", ") || "No answer";
            return (
              <article key={item.id} className={`rounded-lg border p-4 ${review?.correct ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-2">
                  {review?.correct ? <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={18} /> : <XCircle className="mt-0.5 shrink-0 text-red-600" size={18} />}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{index + 1}. {item.prompt}</p>
                    <p className="mt-2 text-sm text-gray-700">Your answer: {answerLabel}</p>
                    {!review?.correct && <p className="mt-1 text-sm font-medium text-green-800">Correct answer: {correctLabel}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        <button type="button" onClick={returnToExamList} className="min-h-11 rounded-lg border border-gray-300 px-4 font-semibold text-gray-700 hover:bg-gray-50">Return to exams</button>
        <p className="text-xs text-gray-500">This score was calculated locally for demonstration; it is not an official grade.</p>
      </div>
    );
  }

  if (!question || !attempt) {
    return <div className="rounded-xl border bg-white p-6"><p>Could not load this exam attempt.</p><button type="button" onClick={returnToExamList} className="mt-4 text-indigo-700 underline">Return to exams</button></div>;
  }

  const currentAnswer = attempt.answers[question.id] || (question.type === "text" ? "" : []);
  const flagged = (attempt.flaggedQuestionIds || []).includes(question.id);
  const answeredCount = questionOrder.filter((id) => {
    const value = attempt.answers[id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
  }).length;
  const confirmSubmit = () => submitExam(false);
  const blockClipboard = (event) => {
    event.preventDefault();
    setWarning("Copy, paste, and the context menu are disabled during this demo exam.");
  };

  return (
    <div
      className="space-y-4"
      onContextMenu={blockClipboard}
      onCopy={blockClipboard}
      onCut={blockClipboard}
      onPaste={blockClipboard}
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(event.key.toLowerCase())) blockClipboard(event);
      }}
    >
      <header className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-indigo-700">{exam.subject} · {exam.className}</p>
          <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600">{answeredCount}/{questionOrder.length} answered</span>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-lg font-bold ${isUrgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-900"}`} role="timer" aria-live="polite">
            <Clock3 size={18} /> {formatTime(remainingSeconds)}
          </div>
          <button type="button" onClick={requestFullscreen} title="Enter fullscreen" className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"><Maximize size={18} /></button>
          <button type="button" onClick={() => setShowSubmitConfirmation(true)} className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">Submit exam</button>
        </div>
      </header>

      {(warning || focusWarnings > 0) && (
        <div role="status" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {warning.includes("recorded") ? <ShieldAlert size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
          <span>{warning || `Focus warning count: ${focusWarnings}. Your answers remain saved.`}</span>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="rounded-xl border bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-indigo-700">Question {activeIndex + 1} of {questionOrder.length}</p>
              <h3 className="mt-3 whitespace-pre-wrap text-lg font-semibold leading-7 text-gray-900">{question.prompt}</h3>
              <p className="mt-2 text-xs text-gray-500">{question.points || 1} point{(question.points || 1) === 1 ? "" : "s"} · {question.type === "multi" ? "Select all that apply" : question.type === "text" ? "Short answer" : "Select one answer"}</p>
            </div>
            <button type="button" onClick={toggleFlag} aria-pressed={flagged} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium ${flagged ? "border-amber-300 bg-amber-100 text-amber-800" : "text-gray-600 hover:bg-gray-50"}`}>
              <Flag size={16} /> {flagged ? "Flagged" : "Flag"}
            </button>
          </div>

          {question.type === "text" ? (
            <label className="block space-y-2 text-sm font-medium text-gray-700">
              Your answer
              <input
                type="text"
                value={currentAnswer}
                onChange={(event) => updateAnswer(event.target.value)}
                placeholder="Type your answer"
                className="min-h-12 w-full rounded-lg border border-gray-300 px-4 text-base font-normal focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          ) : (
            <fieldset className="space-y-3">
              <legend className="sr-only">Answer choices</legend>
              {options.map((option, index) => {
                const selected = currentAnswer.includes(option.id);
                return (
                  <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${selected ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"}`}>
                    <input
                      type={question.type === "multi" ? "checkbox" : "radio"}
                      name={`question-${question.id}`}
                      checked={selected}
                      onChange={() => toggleOption(option.id)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-600">{String.fromCharCode(65 + index)}</span>
                    <span className="text-sm leading-6 text-gray-800">{option.text}</span>
                  </label>
                );
              })}
            </fieldset>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <button type="button" onClick={clearAnswer} disabled={!Array.isArray(currentAnswer) ? !currentAnswer : !currentAnswer.length} className="min-h-10 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40">Clear response</button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0} className="inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"><ArrowLeft size={16} /> Previous</button>
              <button type="button" onClick={() => setActiveIndex((index) => Math.min(questionOrder.length - 1, index + 1))} disabled={activeIndex === questionOrder.length - 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Next <ArrowRight size={16} /></button>
            </div>
          </div>
        </main>

        <aside className="h-fit rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Question palette</h3>
            <span className="text-xs text-gray-500">{answeredCount}/{questionOrder.length}</span>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 xl:grid-cols-4">
            {questionOrder.map((questionId, index) => {
              const value = attempt.answers[questionId];
              const answered = Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
              const isFlagged = attempt.flaggedQuestionIds?.includes(questionId);
              return (
                <button
                  key={questionId}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to question ${index + 1}${answered ? ", answered" : ", unanswered"}${isFlagged ? ", flagged" : ""}`}
                  className={`relative h-10 rounded-lg border text-sm font-semibold ${index === activeIndex ? "border-indigo-600 bg-indigo-600 text-white" : isFlagged ? "border-amber-300 bg-amber-50 text-amber-800" : answered ? "border-green-200 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {index + 1}
                  {isFlagged && <Flag className="absolute -right-1 -top-1 fill-amber-400 text-amber-600" size={12} />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t pt-3 text-xs text-gray-600">
            <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-indigo-600 align-middle" />Current</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-green-100 align-middle" />Answered</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-amber-100 align-middle" />Flagged</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded-sm border bg-white align-middle" />Unanswered</p>
          </div>
        </aside>
      </div>

      {showSubmitConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="cbt-submit-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="cbt-submit-title" className="text-xl font-bold text-gray-900">Submit this exam?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              You have answered {answeredCount} of {questionOrder.length} questions and flagged {attempt.flaggedQuestionIds?.length || 0}. Once submitted, your answers cannot be changed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowSubmitConfirmation(false)} className="min-h-10 rounded-lg border px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">Continue exam</button>
              <button type="button" onClick={confirmSubmit} className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">Confirm submission</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

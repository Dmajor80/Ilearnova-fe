import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Play,
  RefreshCw
} from "lucide-react";
import { useStudentCbt } from "@/hooks/student";

const isFinalized = (attempt) =>
  attempt?.status === "submitted" || attempt?.status === "timed_out";

const formatDateTime = (date) => {
  if (!date) return "Date not specified";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date not specified"
    : parsedDate.toLocaleString();
};

const formatAnswer = (answer, questionType) => {
  if (questionType === "mcq" || questionType === "mcq_multi" || questionType === "true_false") {
    if (Array.isArray(answer)) return answer.length ? `${answer.length} option(s) selected` : "No answer";
    return answer ? "An option was selected" : "No answer";
  }
  if (Array.isArray(answer)) return answer.join(", ");
  return answer === null || answer === undefined || answer === "" ? "No answer" : answer;
};

const StudentCbt = () => {
  const cbt = useStudentCbt();
  const activeAttempt = cbt.attempt;
  const { submitAttempt, recordIntegrityEvent } = cbt;
  const [view, setView] = useState("list");
  const [selectedExam, setSelectedExam] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [busyExamId, setBusyExamId] = useState(null);
  const submitting = useRef(false);

  const setAttemptView = (attempt) => {
    if (!Array.isArray(attempt?.questions) || attempt.questions.length === 0) {
      throw new Error("The exam attempt did not include any questions.");
    }

    setAnswers(Object.fromEntries(
      attempt.questions.map((question) => [question.id, question.answer ?? ""])
    ));
    setQuestionIndex(0);
    setTimeLeft(Number(attempt.time_remaining_seconds) || 0);
    setView("attempt");
  };

  const handleOpenExam = async (exam) => {
    setPageError(null);
    setBusyExamId(exam.id);
    setSelectedExam(exam);
    try {
      const previousAttempt = exam.attempt;
      if (previousAttempt?.id && isFinalized(previousAttempt)) {
        await cbt.getResult(previousAttempt.id);
        setView("result");
      } else if (previousAttempt?.id && previousAttempt.status === "in_progress") {
        const attempt = await cbt.resumeAttempt(previousAttempt.id);
        setAttemptView(attempt);
      } else {
        const details = await cbt.getExam(exam.id);
        setSelectedExam(details);
        setView("instructions");
      }
    } catch (requestError) {
      setPageError(requestError.message || "Unable to open this exam.");
    } finally {
      setBusyExamId(null);
    }
  };

  const handleStartExam = async () => {
    if (!selectedExam) return;
    setPageError(null);
    try {
      const attempt = await cbt.startAttempt(selectedExam.id);
      if (isFinalized(attempt)) {
        setView("result");
      } else {
        setAttemptView(attempt);
      }
    } catch (requestError) {
      setPageError(requestError.message || "Unable to start this exam.");
    }
  };

  const finishAttempt = useCallback(async () => {
    if (!activeAttempt?.id || submitting.current) return;
    submitting.current = true;
    setPageError(null);
    try {
      await submitAttempt(activeAttempt.id);
      setView("result");
    } catch (requestError) {
      setPageError(requestError.message || "Unable to submit this exam.");
    } finally {
      submitting.current = false;
    }
  }, [activeAttempt?.id, submitAttempt]);

  useEffect(() => {
    if (view !== "attempt" || timeLeft === null) return undefined;
    if (timeLeft <= 0) {
      finishAttempt();
      return undefined;
    }

    const timer = setTimeout(() => setTimeLeft((remaining) => remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [finishAttempt, timeLeft, view]);

  useEffect(() => {
    if (view !== "attempt" || !activeAttempt?.id) return undefined;
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      recordIntegrityEvent(activeAttempt.id, {
        type: "tab_hidden",
        client_time: new Date().toISOString(),
        detail: "The exam page became hidden."
      }).catch((requestError) => {
        setPageError(requestError.message || "Unable to record the focus event.");
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [activeAttempt?.id, recordIntegrityEvent, view]);

  const handleAnswerChange = (question, answer) => {
    setAnswers((current) => ({ ...current, [question.id]: answer }));
    if (!cbt.attempt?.id) return;

    cbt.saveAnswer(cbt.attempt.id, question.id, answer).catch((requestError) => {
      setPageError(requestError.message || "Your answer could not be saved.");
    });
  };

  const currentQuestion = cbt.attempt?.questions?.[questionIndex];
  const result = cbt.result;

  if (view === "instructions" && selectedExam) {
    return (
      <section className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <button
          type="button"
          onClick={() => setView("list")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to exams
        </button>
        <h1 className="text-2xl font-bold text-slate-800">{selectedExam.title}</h1>
        <p className="mt-1 text-slate-600">
          {selectedExam.subject_name} · {selectedExam.class_name}
        </p>
        <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-3">
          <p>Duration: {selectedExam.duration_minutes} minutes</p>
          <p>Questions: {selectedExam.question_count}</p>
          <p>Total marks: {selectedExam.total_marks}</p>
          <p>Starts: {formatDateTime(selectedExam.start_time)}</p>
          <p>Ends: {formatDateTime(selectedExam.end_time)}</p>
          <p>Passing: {selectedExam.passing_percentage}%</p>
        </div>
        {selectedExam.description && (
          <p className="mt-5 whitespace-pre-line text-slate-700">{selectedExam.description}</p>
        )}
        {selectedExam.instructions && (
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h2 className="font-semibold text-blue-900">Instructions</h2>
            <p className="mt-2 whitespace-pre-line text-blue-900">{selectedExam.instructions}</p>
          </div>
        )}
        {pageError && <p role="alert" className="mt-4 text-red-700">{pageError}</p>}
        <button
          type="button"
          disabled={cbt.mutating || selectedExam.availability !== "open"}
          onClick={handleStartExam}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {cbt.mutating ? "Starting…" : "Start exam"}
        </button>
      </section>
    );
  }

  if (view === "attempt" && currentQuestion) {
    const questionType = currentQuestion.question_type;
    const options = Array.isArray(currentQuestion.options) ? currentQuestion.options : [];
    const currentAnswer = answers[currentQuestion.id] ?? "";
    const isMultipleChoice = questionType === "mcq" || questionType === "true_false";
    const isMultipleSelect = questionType === "mcq_multi";

    return (
      <section className="mx-auto max-w-4xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{selectedExam?.title}</h1>
            <p className="text-sm text-slate-600">{selectedExam?.subject_name}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800">
            <Clock className="h-4 w-4" />
            {Math.floor((timeLeft ?? 0) / 60)}:{String((timeLeft ?? 0) % 60).padStart(2, "0")}
          </div>
        </header>

        {pageError && (
          <p role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
            {pageError}
          </p>
        )}

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm text-slate-500">
            Question {questionIndex + 1} of {cbt.attempt.questions.length}
          </p>
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{currentQuestion.question_text}</h2>

          {(isMultipleChoice || isMultipleSelect) ? (
            <div className="space-y-3">
              {options.map((option, index) => {
                const checked = isMultipleSelect
                  ? Array.isArray(currentAnswer) && currentAnswer.includes(option.id)
                  : currentAnswer === option.id;
                return (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                  >
                    <input
                      type={isMultipleSelect ? "checkbox" : "radio"}
                      name={`question-${currentQuestion.id}`}
                      checked={checked}
                      onChange={() => {
                        if (!isMultipleSelect) {
                          handleAnswerChange(currentQuestion, option.id);
                          return;
                        }
                        const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
                        const nextAnswer = checked
                          ? selected.filter((optionId) => optionId !== option.id)
                          : [...selected, option.id];
                        handleAnswerChange(currentQuestion, nextAnswer);
                      }}
                    />
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option.option_text}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <textarea
              rows={questionType === "essay" ? 8 : 3}
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(event) => handleAnswerChange(currentQuestion, event.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
              aria-label="Your answer"
            />
          )}
        </article>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={questionIndex === 0}
            onClick={() => setQuestionIndex((index) => index - 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span role="status" className="text-sm text-slate-600">
            {cbt.mutating ? "Saving…" : `${questionIndex + 1} / ${cbt.attempt.questions.length}`}
          </span>
          {questionIndex < cbt.attempt.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setQuestionIndex((index) => index + 1)}
              className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={cbt.mutating}
              onClick={finishAttempt}
              className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
            >
              Submit exam
            </button>
          )}
        </div>
      </section>
    );
  }

  if (view === "result") {
    return (
      <section className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CheckCircle className="mb-3 h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-bold text-slate-800">Exam result</h1>
        <p className="mt-1 text-slate-600">{result?.exam_title || selectedExam?.title}</p>
        {result ? (
          <>
            <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
              <p>Score: {result.score ?? "Pending"} / {result.total_marks}</p>
              <p>
                Percentage: {result.percentage === null || result.percentage === undefined
                  ? "Pending"
                  : `${result.percentage}%`}
              </p>
              <p>
                Status: {result.pending_manual_grading
                  ? "Awaiting manual grading"
                  : result.is_passed === true
                    ? "Passed"
                    : result.is_passed === false ? "Not passed" : "Pending"}
              </p>
            </div>
            {result.review_available && Array.isArray(result.answers) && (
              <div className="mt-6 space-y-3">
                <h2 className="font-semibold text-slate-800">Answer review</h2>
                {result.answers.map((answer, index) => (
                  <article key={answer.question_id} className="rounded-lg border border-slate-200 p-4">
                    <h3 className="font-medium text-slate-800">
                      {index + 1}. {answer.question_text}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Your answer: {formatAnswer(answer.answer, answer.question_type)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Marks: {answer.marks_awarded ?? "Pending"} / {answer.marks}
                    </p>
                    {answer.feedback && <p className="mt-2 text-sm text-blue-800">{answer.feedback}</p>}
                    {answer.explanation && <p className="mt-1 text-sm text-slate-600">{answer.explanation}</p>}
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <p role="status" className="mt-4 text-slate-600">Loading your result…</p>
        )}
        {pageError && <p role="alert" className="mt-4 text-amber-700">{pageError}</p>}
        <button
          type="button"
          onClick={() => {
            setView("list");
            setSelectedExam(null);
            setPageError(null);
            cbt.refreshData();
          }}
          className="mt-6 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          Back to exams
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CBT examinations</h1>
          <p className="mt-1 text-slate-600">View and take exams assigned to your class.</p>
        </div>
        <button
          type="button"
          onClick={cbt.refreshData}
          disabled={cbt.loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {(cbt.error || pageError) && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>{pageError || cbt.error?.message || "Unable to load CBT exams."}</span>
        </div>
      )}

      {cbt.loading ? (
        <p role="status" className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">
          Loading CBT exams…
        </p>
      ) : cbt.exams.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">No CBT exams are available.</p>
      ) : (
        <div className="space-y-3">
          {cbt.exams.map((exam) => {
            const previousAttempt = exam.attempt;
            const canContinue = previousAttempt?.status === "in_progress";
            const isComplete = isFinalized(previousAttempt);
            const canStart = exam.availability === "open";
            return (
              <article
                key={exam.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <h2 className="font-semibold text-slate-800">{exam.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {exam.subject_name} · {exam.class_name} · {exam.question_count} questions · {exam.duration_minutes} min
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatDateTime(exam.start_time)} – {formatDateTime(exam.end_time)}
                  </p>
                  {previousAttempt && (
                    <p className="mt-1 text-sm text-slate-600">
                      Attempt: {previousAttempt.status}
                      {previousAttempt.percentage !== null && previousAttempt.percentage !== undefined
                        ? ` · ${previousAttempt.percentage}%`
                        : ""}
                    </p>
                  )}
                  {!canStart && !canContinue && !isComplete && (
                    <p className="mt-1 text-sm capitalize text-amber-700">{exam.availability}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busyExamId === exam.id || cbt.mutating || (!canStart && !canContinue && !isComplete)}
                  onClick={() => handleOpenExam(exam)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyExamId === exam.id ? "Loading…" : (
                    <>
                      <Play className="h-4 w-4" />
                      {canContinue ? "Resume" : isComplete ? "View result" : "View instructions"}
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default StudentCbt;

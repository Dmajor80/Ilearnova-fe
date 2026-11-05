import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Play, RefreshCw } from "lucide-react";
import { useStudentExams } from "@/hooks/student";

const unwrap = (value) => value?.data ?? value;

const getSessionId = (value) => {
  const data = unwrap(value);
  return data?.session_id ?? data?.session?.id ?? data?.id;
};

const getQuestions = (value) => {
  const data = unwrap(value);
  const session = data?.session ?? data?.exam_session ?? data;
  const questions = session?.questions ?? session?.exam?.questions;
  return Array.isArray(questions) ? questions : [];
};

const getOptions = (question) => {
  const options = question?.options ?? question?.choices ?? question?.answers;
  if (Array.isArray(options)) {
    return options.map((option, index) => ({
      value: option?.id ?? option?.value ?? option?.label ?? String(index),
      label: option?.label ?? String.fromCharCode(65 + index),
      text: option?.text ?? option?.value ?? option?.option ?? String(option)
    }));
  }

  if (options && typeof options === "object") {
    return Object.entries(options).map(([label, text]) => ({
      value: label,
      label,
      text: typeof text === "string" ? text : text?.text ?? String(text)
    }));
  }

  return [];
};

const getQuestionText = (question) =>
  question?.question ?? question?.question_text ?? question?.prompt ?? question?.text ?? "";

const getRecordList = (records) => (Array.isArray(records) ? records : []);

const formatDateTime = (date) => {
  if (!date) return "Date not specified";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date not specified"
    : parsedDate.toLocaleString();
};

const Exam = () => {
  const studentExams = useStudentExams();
  const { getResult, saveAnswer, startExam, submitSession } = studentExams;
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentExam, setCurrentExam] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [sessionError, setSessionError] = useState(null);

  const submittedExamIds = useMemo(
    () => new Set(studentExams.submissions.map((submission) => submission.examination)),
    [studentExams.submissions]
  );
  const availableExams = studentExams.examinations.filter(
    (exam) => !submittedExamIds.has(exam.id) && exam.is_active !== false && exam.is_published !== false
  );

  const handleStartExam = async (exam) => {
    setSessionError(null);
    setExamResult(null);
    setAnswers({});
    setCurrentQuestion(0);
    try {
      const session = await startExam(exam.id);
      const id = getSessionId(session);
      if (!id) {
        throw new Error("The exam session response did not include a session ID.");
      }

      const sessionQuestions = getQuestions(session);
      if (!sessionQuestions.length) {
        throw new Error("The exam session did not include any questions.");
      }

      setSessionId(id);
      setCurrentExam(exam);
      setQuestions(sessionQuestions);
      const sessionData = unwrap(session);
      const duration = Number(sessionData?.time_remaining_seconds);
      setTimeLeft(Number.isFinite(duration) && duration > 0
        ? duration
        : Math.max(Number(exam.duration_minutes) || 0, 1) * 60);
      setCurrentView("exam");
    } catch (error) {
      setSessionError(error.message || "Unable to start this exam.");
    }
  };

  const handleSubmitExam = useCallback(async () => {
    if (!sessionId) return;
    setSessionError(null);
    try {
      await submitSession(sessionId);
      setCurrentView("results");
      try {
        const result = await getResult(sessionId);
        setExamResult(unwrap(result));
      } catch {
        setSessionError("The exam was submitted, but its result is not available yet.");
      }
    } catch (error) {
      setSessionError(error.message || "Unable to submit this exam.");
    }
  }, [getResult, sessionId, submitSession]);

  useEffect(() => {
    if (currentView !== "exam" || timeLeft === null) return undefined;
    if (timeLeft <= 0) {
      handleSubmitExam();
      return undefined;
    }

    const timer = setTimeout(() => setTimeLeft((remaining) => remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [currentView, handleSubmitExam, timeLeft]);

  const handleSelectAnswer = async (question, answer) => {
    const questionId = question.id ?? question.question_id;
    setAnswers((current) => ({ ...current, [questionId]: answer }));

    if (!sessionId || !questionId) return;
    try {
      await saveAnswer(sessionId, { question_id: questionId, answer });
    } catch {
      setSessionError("Your answer could not be saved. Please try selecting it again.");
    }
  };

  const activeQuestion = questions[currentQuestion];
  const activeOptions = activeQuestion ? getOptions(activeQuestion) : [];
  const score = examResult?.score ?? examResult?.percentage ?? examResult?.total_score;

  if (currentView === "exam" && activeQuestion) {
    return (
      <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{currentExam?.title}</h1>
              <p className="text-sm text-slate-600">{currentExam?.subject_name}</p>
            </div>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800">
                <Clock className="h-4 w-4" />
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </div>
            )}
          </div>

          {sessionError && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {sessionError}
            </p>
          )}

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm text-slate-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              {getQuestionText(activeQuestion) || `Question ${currentQuestion + 1}`}
            </h2>
            {activeOptions.length ? (
              <div className="space-y-3">
                {activeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name={`question-${activeQuestion.id ?? currentQuestion}`}
                      value={option.value}
                      checked={answers[activeQuestion.id ?? activeQuestion.question_id] === option.value}
                      onChange={() => handleSelectAnswer(activeQuestion, option.value)}
                    />
                    <span className="font-medium">{option.label}.</span>
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                rows={5}
                value={answers[activeQuestion.id ?? activeQuestion.question_id] ?? ""}
                onChange={(event) => handleSelectAnswer(activeQuestion, event.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3"
                aria-label="Your answer"
              />
            )}
          </article>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((index) => index - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              {studentExams.mutating ? "Saving…" : `${currentQuestion + 1} / ${questions.length}`}
            </span>
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestion((index) => index + 1)}
                className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={studentExams.mutating}
                onClick={handleSubmitExam}
                className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
              >
                Submit exam
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (currentView === "results") {
    return (
      <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <CheckCircle className="mb-3 h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-800">Exam submitted</h1>
          <p className="mt-1 text-slate-600">{currentExam?.title}</p>
          {score !== undefined && score !== null && (
            <p className="mt-4 text-lg font-semibold text-blue-700">Score: {score}</p>
          )}
          {examResult && score === undefined && (
            <p className="mt-4 text-slate-600">Your result has been recorded.</p>
          )}
          {sessionError && <p role="status" className="mt-4 text-amber-700">{sessionError}</p>}
          <button
            type="button"
            onClick={() => {
              setCurrentView("dashboard");
              setSessionId(null);
              setQuestions([]);
              setExamResult(null);
            }}
            className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            Back to exams
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Examinations</h1>
            <p className="mt-1 text-slate-600">View available exams and previous submissions.</p>
          </div>
          <button
            type="button"
            onClick={() => studentExams.refreshData(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {(studentExams.error || sessionError) && (
          <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{sessionError || studentExams.error.message}</span>
          </div>
        )}

        {studentExams.loading ? (
          <p role="status" className="rounded-lg bg-white p-6 text-slate-600 shadow-sm">
            Loading examinations…
          </p>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-slate-800">
                Available exams ({availableExams.length})
              </h2>
              {availableExams.length === 0 ? (
                <p className="rounded-lg bg-white p-5 text-slate-600 shadow-sm">No exams are available.</p>
              ) : (
                <div className="space-y-3">
                  {availableExams.map((exam) => (
                    <article key={exam.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div>
                        <h3 className="font-semibold text-slate-800">{exam.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{exam.subject_name}</p>
                        <p className="mt-2 text-sm text-slate-500">
                          Starts {formatDateTime(exam.start_time)} · Ends {formatDateTime(exam.end_time)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={studentExams.mutating}
                        onClick={() => handleStartExam(exam)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
                      >
                        <Play className="h-4 w-4" />
                        Start exam
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-slate-800">
                Previous submissions ({studentExams.submissions.length})
              </h2>
              {getRecordList(studentExams.submissions).length === 0 ? (
                <p className="rounded-lg bg-white p-5 text-slate-600 shadow-sm">No exam submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {studentExams.submissions.map((submission) => (
                    <article key={submission.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div>
                        <h3 className="font-semibold text-slate-800">{submission.examination_title || "Exam"}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Submitted {formatDateTime(submission.submitted_at)}
                        </p>
                        {submission.graded_at && (
                          <p className="mt-1 text-sm text-green-700">
                            {submission.score === null || submission.score === undefined
                              ? "Graded"
                              : `Score: ${submission.score}`}
                          </p>
                        )}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm ${
                        submission.graded_at ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {submission.graded_at ? "Graded" : "Submitted"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Exam;

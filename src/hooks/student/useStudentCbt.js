import { useCallback, useEffect, useRef, useState } from "react";
import {
  createStudentCbtIntegrityEvent,
  getStudentCbtAttempt,
  getStudentCbtExam,
  getStudentCbtExams,
  getStudentCbtResult,
  saveStudentCbtAnswer,
  startStudentCbtAttempt,
  submitStudentCbtAttempt
} from "@/api/student";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import {
  getStudentListAcrossPages,
  unwrapStudentResponse
} from "./studentApiUtils";

const isFinalized = (attempt) =>
  attempt?.status === "submitted" || attempt?.status === "timed_out";

export default function useStudentCbt() {
  const notification = useNotification("info", 5000);
  const [exams, setExams] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const pendingMutations = useRef(0);
  const answerRequests = useRef(new Map());

  const refreshData = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const records = await getStudentListAcrossPages((page) =>
        getStudentCbtExams({ page })
      );
      if (currentRequestId === requestId.current) setExams(records);
    } catch (requestError) {
      const appError = parseError(requestError, { action: "fetch_student_cbt_exams" });
      if (currentRequestId === requestId.current) {
        setError(appError);
        notification.notify(
          `Unable to load CBT exams: ${getUserFriendlyMessage(appError)}`,
          getNotificationType(appError)
        );
      }
      console.warn("Failed to fetch student CBT exams:", requestError);
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [notification]);

  const runAction = useCallback(async (action, request) => {
    pendingMutations.current += 1;
    setMutating(true);
    setError(null);
    try {
      return unwrapStudentResponse(await request());
    } catch (requestError) {
      const appError = parseError(requestError, { action: `student_cbt_${action}` });
      setError(appError);
      notification.notify(
        `Unable to ${action}: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn(`Failed to ${action}:`, requestError);
      throw appError;
    } finally {
      pendingMutations.current -= 1;
      if (pendingMutations.current === 0) setMutating(false);
    }
  }, [notification]);

  const getExam = useCallback((examId) =>
    runAction("load exam details", () => getStudentCbtExam(examId)), [runAction]);

  const getResult = useCallback(async (attemptId) => {
    const data = await runAction("load exam result", () => getStudentCbtResult(attemptId));
    setResult(data);
    return data;
  }, [runAction]);

  const startAttempt = useCallback(async (examId) => {
    const data = await runAction("start exam", () => startStudentCbtAttempt(examId));
    setAttempt(data);
    setResult(null);
    if (isFinalized(data)) await getResult(data.id);
    return data;
  }, [getResult, runAction]);

  const resumeAttempt = useCallback(async (attemptId) => {
    const data = await runAction("resume exam", () => getStudentCbtAttempt(attemptId));
    setAttempt(data);
    setResult(null);
    if (isFinalized(data)) await getResult(data.id);
    return data;
  }, [getResult, runAction]);

  const saveAnswer = useCallback((attemptId, questionId, answer) => {
    const key = `${attemptId}:${questionId}`;
    const previousRequest = answerRequests.current.get(key) ?? Promise.resolve();
    const request = previousRequest
      .catch(() => undefined)
      .then(() => runAction("save answer", () =>
        saveStudentCbtAnswer(attemptId, questionId, answer)
      ))
      .then((data) => {
        setAttempt((current) => {
          if (current?.id !== attemptId) return current;
          return {
            ...current,
            questions: current.questions.map((question) =>
              question.id === questionId
                ? {
                    ...question,
                    answer: data.answer ?? answer,
                    saved_at: data.saved_at ?? question.saved_at
                  }
                : question
            )
          };
        });
        return data;
      });
    answerRequests.current.set(key, request);
    request.finally(() => {
      if (answerRequests.current.get(key) === request) {
        answerRequests.current.delete(key);
      }
    }).catch(() => undefined);
    return request;
  }, [runAction]);

  const recordIntegrityEvent = useCallback(async (attemptId, eventData) => {
    try {
      return unwrapStudentResponse(
        await createStudentCbtIntegrityEvent(attemptId, eventData)
      );
    } catch (requestError) {
      const appError = parseError(requestError, { action: "student_cbt_integrity_event" });
      setError(appError);
      notification.notify(
        `Unable to record the exam focus event: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to record student CBT integrity event:", requestError);
      throw appError;
    }
  }, [notification]);

  const submitAttempt = useCallback(async (attemptId) => {
    await Promise.all(answerRequests.current.values());
    const data = await runAction("submit exam", () => submitStudentCbtAttempt(attemptId));
    setResult(data);
    setAttempt((current) =>
      current?.id === attemptId
        ? { ...current, status: data.status, submitted_at: data.submitted_at }
        : current
    );
    notification.notify("Exam submitted successfully", "success");
    return data;
  }, [notification, runAction]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  return {
    exams,
    attempt,
    result,
    loading,
    mutating,
    error,
    refreshData,
    getExam,
    startAttempt,
    resumeAttempt,
    saveAnswer,
    recordIntegrityEvent,
    submitAttempt,
    getResult
  };
}

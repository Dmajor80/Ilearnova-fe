import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStudentExamResult,
  getStudentExamSession,
  getStudentExamSubmissions,
  getStudentExaminations,
  saveStudentExamAnswer,
  startStudentExamSession,
  submitStudentExamSession
} from "@/api/student";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
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

export default function useStudentExams() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const [examinations, setExaminations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { resetAllEndpoints, shouldCallEndpoint, markEndpointFailed } = circuitBreaker;

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    setLoading(true);
    setError(null);

    const requests = [
      {
        endpoint: "studentExaminations",
        load: () => getStudentListAcrossPages((page) => getStudentExaminations({ page })),
        update: setExaminations
      },
      {
        endpoint: "studentExamSubmissions",
        load: () => getStudentListAcrossPages((page) => getStudentExamSubmissions({ page })),
        update: setSubmissions
      }
    ].filter(({ endpoint }) => resetFailures || shouldCallEndpoint(endpoint));

    try {
      const results = await Promise.allSettled(requests.map(({ load }) => load()));
      const failures = [];

      results.forEach((requestResult, index) => {
        const { endpoint, update } = requests[index];
        if (requestResult.status === "fulfilled") {
          update(requestResult.value);
          return;
        }

        const appError = parseError(requestResult.reason, {
          action: `fetch_${endpoint}`
        });
        const message = getUserFriendlyMessage(appError);
        markEndpointFailed(endpoint, message);
        failures.push(message);
        console.warn(`Failed to fetch ${endpoint}:`, requestResult.reason);
      });

      if (failures.length) {
        const appError = parseError(new Error(failures.join("; ")), {
          action: "fetch_student_exams"
        });
        setError(appError);
        notification.notify(
          `Some exam data is unavailable: ${failures.join("; ")}`,
          getNotificationType(appError)
        );
      }

      if (results.some((requestResult) => requestResult.status === "fulfilled")) {
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, [markEndpointFailed, notification, resetAllEndpoints, shouldCallEndpoint]);

  const runSessionAction = useCallback(async (action, request, successMessage) => {
    setMutating(true);
    setError(null);
    try {
      const response = await request();
      const data = unwrapStudentResponse(response);
      if (action === "start" || action === "get") setSession(data);
      if (action === "result") setResult(data);
      if (successMessage) notification.notify(successMessage, "success");
      return data;
    } catch (requestError) {
      const appError = parseError(requestError, { action: `student_exam_${action}` });
      setError(appError);
      notification.notify(
        `Unable to ${action} exam: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn(`Failed to ${action} student exam:`, requestError);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification]);

  const startExam = useCallback(async (examId) => {
    const started = await runSessionAction(
      "start",
      () => startStudentExamSession(examId)
    );
    const sessionData = unwrapStudentResponse(started);
    const sessionId = sessionData?.session_id ?? sessionData?.session?.id ?? sessionData?.id;
    if (!sessionId) return sessionData;

    return runSessionAction("get", () => getStudentExamSession(sessionId));
  }, [runSessionAction]);

  const getSession = useCallback((sessionId) =>
    runSessionAction("get", () => getStudentExamSession(sessionId)), [runSessionAction]);

  const saveAnswer = useCallback((sessionId, answerData) =>
    runSessionAction("save answer", () => saveStudentExamAnswer(sessionId, answerData)),
  [runSessionAction]);

  const submitSession = useCallback(async (sessionId) => {
    const response = await runSessionAction(
      "submit",
      () => submitStudentExamSession(sessionId),
      "Exam submitted successfully"
    );
    await refreshData(true);
    return response;
  }, [refreshData, runSessionAction]);

  const getResult = useCallback((sessionId) =>
    runSessionAction("result", () => getStudentExamResult(sessionId)), [runSessionAction]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  return {
    examinations,
    submissions,
    session,
    result,
    loading,
    mutating,
    error,
    lastUpdated,
    refreshData,
    startExam,
    getSession,
    saveAnswer,
    submitSession,
    getResult,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    notification
  };
}

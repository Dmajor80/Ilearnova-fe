import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTeacherCbtExam,
  createTeacherCbtQuestion,
  deleteTeacherCbtExam,
  getTeacherCbtAttempt,
  getTeacherCbtAttempts,
  getTeacherCbtExam,
  getTeacherCbtExams,
  getTeacherCbtQuestions,
  gradeTeacherCbtAnswer,
  importTeacherCbtQti,
  patchTeacherCbtExam
} from "@/api/teacher";
import useTeacherApi, { getTeacherList, getTeacherPagination } from "./teacherApiUtils";

export default function useTeacherCbt() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [examPagination, setExamPagination] = useState(null);
  const [attemptPagination, setAttemptPagination] = useState(null);
  const [questionPagination, setQuestionPagination] = useState(null);

  const refreshExams = useCallback(async (params = {}, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherCbtExams",
        "fetch_teacher_cbt_exams",
        () => getTeacherCbtExams(params),
        { failureMessage: "CBT exams unavailable" }
      );
      if (result !== null) {
        const rows = getTeacherList(result, ["exams"]);
        setExams(rows);
        setExamPagination(getTeacherPagination(result, params.page, rows.length));
      }
      return result;
    } catch {
      setExams([]);
      setExamPagination(null);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const fetchExam = useCallback(async (examId) => {
    setSelectedExam(null);
    const result = await request(
      `teacherCbtExam:${examId}`,
      "fetch_teacher_cbt_exam",
      () => getTeacherCbtExam(examId),
      { failureMessage: "CBT exam unavailable" }
    );
    if (result !== null) setSelectedExam(result);
    return result;
  }, [request]);

  const saveExam = useCallback(async (examData, examId, params = {}) => {
    const isUpdate = Boolean(examId);
    const result = await request(
      isUpdate ? `teacherCbtExam:${examId}` : "teacherCbtExams",
      isUpdate ? "update_teacher_cbt_exam" : "create_teacher_cbt_exam",
      () => isUpdate
        ? patchTeacherCbtExam(examId, examData)
        : createTeacherCbtExam(examData),
      {
        mutation: true,
        successMessage: isUpdate ? "CBT exam updated successfully" : "CBT exam created successfully",
        failureMessage: isUpdate ? "Failed to update CBT exam" : "Failed to create CBT exam"
      }
    );
    if (result !== null) setSelectedExam(result);
    await refreshExams(params);
    return result;
  }, [request, refreshExams]);

  const removeExam = useCallback(async (examId, params = {}) => {
    const result = await request(
      `teacherCbtExam:${examId}`,
      "delete_teacher_cbt_exam",
      () => deleteTeacherCbtExam(examId),
      {
        mutation: true,
        successMessage: "CBT exam deleted successfully",
        failureMessage: "Failed to delete CBT exam"
      }
    );
    setSelectedExam((current) => current?.id === examId ? null : current);
    await refreshExams(params);
    return result;
  }, [request, refreshExams]);

  const fetchAttempts = useCallback(async (examId, params = {}) => {
    setAttempts([]);
    setAttemptPagination(null);
    const result = await request(
      `teacherCbtAttempts:${examId}`,
      "fetch_teacher_cbt_attempts",
      () => getTeacherCbtAttempts(examId, params),
      { failureMessage: "CBT attempts unavailable" }
    );
    if (result !== null) {
      const rows = getTeacherList(result, ["attempts"]);
      setAttempts(rows);
      setAttemptPagination(getTeacherPagination(result, params.page, rows.length));
    }
    return result;
  }, [request]);

  const fetchAttempt = useCallback(async (attemptId) => {
    setSelectedAttempt(null);
    const result = await request(
      `teacherCbtAttempt:${attemptId}`,
      "fetch_teacher_cbt_attempt",
      () => getTeacherCbtAttempt(attemptId),
      { failureMessage: "CBT attempt unavailable" }
    );
    if (result !== null) setSelectedAttempt(result);
    return result;
  }, [request]);

  const gradeAnswer = useCallback(async (attemptId, questionId, gradeData) => {
    const result = await request(
      `teacherCbtAttempt:${attemptId}`,
      "grade_teacher_cbt_answer",
      () => gradeTeacherCbtAnswer(attemptId, questionId, gradeData),
      {
        mutation: true,
        successMessage: "CBT answer graded successfully",
        failureMessage: "Failed to grade CBT answer"
      }
    );
    await fetchAttempt(attemptId);
    return result;
  }, [fetchAttempt, request]);

  const fetchQuestions = useCallback(async (examId, params = {}) => {
    setQuestions([]);
    setQuestionPagination(null);
    const result = await request(
      `teacherCbtQuestions:${examId}`,
      "fetch_teacher_cbt_questions",
      () => getTeacherCbtQuestions(examId, params),
      { failureMessage: "CBT questions unavailable" }
    );
    if (result !== null) {
      const rows = getTeacherList(result, ["questions"]);
      setQuestions(rows);
      setQuestionPagination(getTeacherPagination(result, params.page, rows.length));
    }
    return result;
  }, [request]);

  const addQuestion = useCallback(async (examId, questionData) => {
    const result = await request(
      `teacherCbtQuestions:${examId}`,
      "create_teacher_cbt_question",
      () => createTeacherCbtQuestion(examId, questionData),
      {
        mutation: true,
        successMessage: "CBT question added successfully",
        failureMessage: "Failed to add CBT question"
      }
    );
    await fetchQuestions(examId);
    return result;
  }, [fetchQuestions, request]);

  const importQuestion = useCallback(async (examId, source) => {
    const result = await request(
      `teacherCbtQuestions:${examId}`,
      "import_teacher_cbt_qti",
      () => importTeacherCbtQti(examId, source),
      {
        mutation: true,
        successMessage: "QTI question imported successfully",
        failureMessage: "Failed to import QTI question"
      }
    );
    await fetchQuestions(examId);
    return result;
  }, [fetchQuestions, request]);

  const refreshRef = useRef(refreshExams);
  refreshRef.current = refreshExams;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    exams,
    attempts,
    questions,
    selectedExam,
    selectedAttempt,
    examPagination,
    attemptPagination,
    questionPagination,
    loading,
    mutating,
    error,
    lastUpdated,
    refreshExams,
    fetchExam,
    saveExam,
    removeExam,
    fetchAttempts,
    fetchAttempt,
    gradeAnswer,
    fetchQuestions,
    addQuestion,
    importQuestion,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}

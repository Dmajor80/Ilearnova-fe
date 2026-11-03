import { useCallback, useEffect, useRef, useState } from "react";
import {
  addTeacherExaminationBankQuestions,
  createTeacherExamination,
  deleteTeacherExamination,
  getTeacherExamination,
  getTeacherExaminationBankQuestions,
  getTeacherExaminationSubmissions,
  getTeacherExaminations,
  patchTeacherExamination,
  updateTeacherExamination
} from "@/api/teacher";
import useTeacherApi, { getTeacherList } from "./teacherApiUtils";

export default function useTeacherExaminations() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [examinations, setExaminations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [bankQuestions, setBankQuestions] = useState([]);

  const refreshData = useCallback(async (params = {}, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherExaminations",
        "fetch_teacher_examinations",
        () => getTeacherExaminations(params),
        { failureMessage: "Examinations unavailable" }
      );
      if (result !== null) setExaminations(getTeacherList(result, ["examinations", "exams"]));
      return result;
    } catch {
      setExaminations([]);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const fetchExamination = useCallback((id) => request(
    `teacherExamination:${id}`,
    "fetch_teacher_examination",
    () => getTeacherExamination(id),
    { failureMessage: "Examination unavailable" }
  ), [request]);

  const fetchSubmissions = useCallback(async (id, params = {}) => {
    const result = await request(
      `teacherExaminationSubmissions:${id}`,
      "fetch_teacher_examination_submissions",
      () => getTeacherExaminationSubmissions(id, params),
      { failureMessage: "Examination submissions unavailable" }
    );
    if (result !== null) setSubmissions(getTeacherList(result, ["submissions"]));
    return result;
  }, [request]);

  const fetchBankQuestions = useCallback(async (id) => {
    const result = await request(
      `teacherExaminationBankQuestions:${id}`,
      "fetch_teacher_examination_bank_questions",
      () => getTeacherExaminationBankQuestions(id),
      { failureMessage: "Examination questions unavailable" }
    );
    if (result !== null) setBankQuestions(getTeacherList(result, ["questions", "bank_questions"]));
    return result;
  }, [request]);

  const addBankQuestions = useCallback((id, questionData) => request(
    `teacherExaminationBankQuestions:${id}`,
    "add_teacher_examination_bank_questions",
    () => addTeacherExaminationBankQuestions(id, questionData),
    {
      mutation: true,
      successMessage: "Questions added to examination",
      failureMessage: "Failed to add questions"
    }
  ), [request]);

  const saveExamination = useCallback(async (data, id) => {
    const update = Boolean(id);
    const result = await request(
      update ? `teacherExamination:${id}` : "teacherExaminations",
      update ? "update_teacher_examination" : "create_teacher_examination",
      () => update ? patchTeacherExamination(id, data) : createTeacherExamination(data),
      {
        mutation: true,
        successMessage: update ? "Examination updated successfully" : "Examination created successfully",
        failureMessage: update ? "Failed to update examination" : "Failed to create examination"
      }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const replaceExamination = useCallback(async (id, data) => {
    const result = await request(
      `teacherExamination:${id}`,
      "replace_teacher_examination",
      () => updateTeacherExamination(id, data),
      { mutation: true, successMessage: "Examination updated successfully", failureMessage: "Failed to update examination" }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const removeExamination = useCallback(async (id) => {
    const result = await request(
      `teacherExamination:${id}`,
      "delete_teacher_examination",
      () => deleteTeacherExamination(id),
      { mutation: true, successMessage: "Examination deleted successfully", failureMessage: "Failed to delete examination" }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    examinations,
    submissions,
    bankQuestions,
    loading,
    mutating,
    error,
    lastUpdated,
    refreshData,
    fetchExamination,
    fetchSubmissions,
    fetchBankQuestions,
    addBankQuestions,
    saveExamination,
    replaceExamination,
    removeExamination,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}

import { useCallback, useState } from "react";
import {
  deleteTeacherBankQuestion,
  getTeacherBankQuestion,
  updateTeacherBankQuestion
} from "@/api/teacher";
import useTeacherApi from "./teacherApiUtils";

export default function useTeacherBankQuestions() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const [question, setQuestion] = useState(null);

  const fetchQuestion = useCallback(async (questionId) => {
    const result = await request(
      `teacherBankQuestion:${questionId}`,
      "fetch_teacher_bank_question",
      () => getTeacherBankQuestion(questionId),
      { failureMessage: "Question unavailable" }
    );
    if (result !== null) setQuestion(result);
    return result;
  }, [request]);

  const updateQuestion = useCallback(async (questionId, questionData) => {
    const result = await request(
      `teacherBankQuestion:${questionId}`,
      "update_teacher_bank_question",
      () => updateTeacherBankQuestion(questionId, questionData),
      { mutation: true, successMessage: "Question updated successfully", failureMessage: "Failed to update question" }
    );
    if (result !== null) setQuestion(result);
    return result;
  }, [request]);

  const removeQuestion = useCallback(async (questionId) => {
    const result = await request(
      `teacherBankQuestion:${questionId}`,
      "delete_teacher_bank_question",
      () => deleteTeacherBankQuestion(questionId),
      { mutation: true, successMessage: "Question deleted successfully", failureMessage: "Failed to delete question" }
    );
    setQuestion(null);
    return result;
  }, [request]);

  return {
    question,
    loading,
    mutating,
    error,
    lastUpdated,
    fetchQuestion,
    updateQuestion,
    removeQuestion,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}

import { http } from "@/api/baseClient";

/**
 * Exam Management API functions (CBT - Computer Based Testing)
 */

// Exam CRUD operations
export const getExams = async (params = {}) => {
  return await http.get("/api/exams", { auth: true, params });
};

export const createExam = async (examData) => {
  return await http.post("/api/exams", { auth: true, body: examData });
};

export const getExam = async (examId) => {
  return await http.get(`/api/exams/${examId}`, { auth: true });
};

export const updateExam = async (examId, examData) => {
  return await http.put(`/api/exams/${examId}`, { auth: true, body: examData });
};

export const deleteExam = async (examId) => {
  return await http.del(`/api/exams/${examId}`, { auth: true });
};

// Exam questions management
export const getExamQuestions = async (examId) => {
  return await http.get(`/api/exams/${examId}/questions`, { auth: true });
};

export const addQuestionToExam = async (examId, questionData) => {
  return await http.post(`/api/exams/${examId}/questions`, {
    auth: true,
    body: questionData
  });
};

// Exam submission and results
export const submitExam = async (examId, submissionData) => {
  return await http.post(`/api/exams/${examId}/submit`, {
    auth: true,
    body: submissionData
  });
};

export const getExamResults = async (examId) => {
  return await http.get(`/api/exams/${examId}/results`, { auth: true });
};

// Student exam views
export const getMyExamResults = async () => {
  return await http.get("/api/exams/my-results", { auth: true });
};

// Exam publishing and management
export const publishExam = async (examId) => {
  return await http.post(`/api/exams/${examId}/publish`, { auth: true });
};

export const completeExam = async (examId) => {
  return await http.post(`/api/exams/${examId}/complete`, { auth: true });
};

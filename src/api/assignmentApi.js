import { http } from "@/api/baseClient";

/**
 * Assignment Management API functions
 */

// Assignment CRUD operations
export const getAssignments = async (params = {}) => {
  return await http.get("/api/assignments", { auth: true, params });
};

export const createAssignment = async (assignmentData) => {
  return await http.post("/api/assignments", { auth: true, body: assignmentData });
};

export const getAssignment = async (assignmentId) => {
  return await http.get(`/api/assignments/${assignmentId}`, { auth: true });
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  return await http.put(`/api/assignments/${assignmentId}`, {
    auth: true,
    body: assignmentData
  });
};

export const deleteAssignment = async (assignmentId) => {
  return await http.del(`/api/assignments/${assignmentId}`, { auth: true });
};

// Assignment submissions
export const getAssignmentSubmissions = async (assignmentId) => {
  return await http.get(`/api/assignments/${assignmentId}/submissions`, { auth: true });
};

export const submitAssignment = async (assignmentId, submissionData) => {
  return await http.post(`/api/assignments/${assignmentId}/submit`, {
    auth: true,
    body: submissionData
  });
};

export const gradeAssignment = async (assignmentId, submissionId, gradeData) => {
  return await http.post(`/api/assignments/${assignmentId}/grade`, {
    auth: true,
    body: { submission_id: submissionId, ...gradeData }
  });
};

// Assignment filtering
export const getAssignmentsByClass = async (classId) => {
  return await http.get(`/api/assignments/class/${classId}`, { auth: true });
};

export const getAssignmentsBySubject = async (subjectId) => {
  return await http.get(`/api/assignments/subject/${subjectId}`, { auth: true });
};

// Student assignment views
export const getMyAssignments = async () => {
  return await http.get("/api/assignments/my/assignments", { auth: true });
};

export const getMySubmissions = async () => {
  return await http.get("/api/assignments/my/submissions", { auth: true });
};

import { http } from "@/api/baseClient";

/**
 * Grade Management API functions
 */

// Grade CRUD operations
export const getGrades = async (params = {}) => {
  return await http.get("/api/grades", { auth: true, params });
};

export const createGrade = async (gradeData) => {
  return await http.post("/api/grades", { auth: true, body: gradeData });
};

export const getGrade = async (gradeId) => {
  return await http.get(`/api/grades/${gradeId}`, { auth: true });
};

export const updateGrade = async (gradeId, gradeData) => {
  return await http.put(`/api/grades/${gradeId}`, { auth: true, body: gradeData });
};

export const deleteGrade = async (gradeId) => {
  return await http.del(`/api/grades/${gradeId}`, { auth: true });
};

// Grade filtering and queries
export const getGradesByStudent = async (studentId) => {
  return await http.get(`/api/grades/student/${studentId}`, { auth: true });
};

export const getGradesByClass = async (classId) => {
  return await http.get(`/api/grades/class/${classId}`, { auth: true });
};

export const getGradesBySubject = async (subjectId) => {
  return await http.get(`/api/grades/subject/${subjectId}`, { auth: true });
};

// Class statistics and reports
export const getClassStatistics = async (classId) => {
  return await http.get(`/api/grades/class/${classId}/statistics`, { auth: true });
};

export const getStudentReportCard = async (studentId) => {
  return await http.get(`/api/grades/student/${studentId}/report-card`, { auth: true });
};

// Bulk import
export const bulkImportGrades = async (gradesData) => {
  return await http.post("/api/grades/bulk-import", { auth: true, body: gradesData });
};

// Parent-specific grade endpoints
export const getParentChildren = async () => {
  return await http.get('/api/parent/children', { auth: true });
};

export const getStudentGradesByTerm = async (studentId, term, year = null) => {
  const params = { term };
  if (year) params.year = year;
  return await http.get(`/api/grades/${studentId}`, { auth: true, params });
};

export const getStudentRemarks = async (studentId, term, year = null) => {
  const params = { term };
  if (year) params.year = year;
  return await http.get(`/api/grades/${studentId}/remarks`, { auth: true, params });
};


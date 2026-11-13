import { http } from "@/api/baseClient";

/**
 * Dashboard API functions for different user roles
 */

// Student Dashboard
export const getStudentDashboard = async () => {
  return await http.get("/api/dashboard/student", { auth: true });
};

// Student-specific API functions
export const getStudentCourses = async () => {
  return await http.get("/api/students/profile", { auth: true });
};

export const getStudentAttendance = async () => {
  return await http.get("/api/students/profile/attendance", { auth: true });
};

// Attendance API functions
export const getAttendanceRecords = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return await http.get(`/api/attendance?${queryString}`, { auth: true });
};

export const getStudentAttendanceById = async (studentId) => {
  return await http.get(`/api/students/${studentId}/attendance`, { auth: true });
};

export const createAttendance = async (attendanceData) => {
  return await http.post("/api/attendance", attendanceData, { auth: true });
};

export const updateAttendance = async (attendanceId, attendanceData) => {
  return await http.put(`/api/attendance/${attendanceId}`, attendanceData, { auth: true });
};

export const bulkCreateAttendance = async (attendanceData) => {
  return await http.post("/api/attendance/bulk", attendanceData, { auth: true });
};

export const getStudentGrades = async () => {
  return await http.get("/api/students/profile/grades", { auth: true });
};

export const getStudentExams = async () => {
  return await http.get("/api/exams/my-results", { auth: true });
};

export const getStudentTimetable = async () => {
  return await http.get("/api/students/profile/timetable", { auth: true });
};

export const getStudentResults = async () => {
  return await http.get("/api/students/profile/results", { auth: true });
};

// Teacher Dashboard
export const getTeacherDashboard = async () => {
  return await http.get("/api/dashboard/teacher", { auth: true });
};

export const getEnhancedTeacherDashboard = async () => {
  return await http.get("/api/dashboard/teacher/enhanced", { auth: true });
};

export { getTeacherAnalytics } from "@/api/teacher";

// Parent Dashboard
export const getParentDashboard = async (parentId) => {
  return await http.get(`/api/dashboard/parent/${parentId}`, { auth: true });
};

export const getEnhancedParentDashboard = async (parentId) => {
  return await http.get(`/api/dashboard/parent/${parentId}/enhanced`, { auth: true });
};

// Individual Learner Dashboard
export const getIndividualLearnerDashboard = async () => {
  return await http.get("/api/dashboard/individual-learner", { auth: true });
};

// Admin Dashboard
export const getAdminMetrics = async () => {
  return await http.get("/api/admin/dashboard/metrics", { auth: true });
};

export const getAdminActivities = async () => {
  return await http.get("/api/admin/dashboard/activities", { auth: true });
};

export const getAdminCharts = async () => {
  return await http.get("/api/admin/dashboard/charts", { auth: true });
};

// Organization Dashboard
export const getEnhancedOrganizationDashboard = async () => {
  return await http.get("/api/dashboard/organization/enhanced", { auth: true });
};

import { http } from "@/api/baseClient";

/**
 * Dashboard API functions for different user roles
 */

// Student Dashboard
export const getStudentDashboard = async () => {
  return await http.get("/api/dashboard/student", { auth: true });
};

// Teacher Dashboard
export const getTeacherDashboard = async () => {
  return await http.get("/api/dashboard/teacher", { auth: true });
};

export const getEnhancedTeacherDashboard = async () => {
  return await http.get("/api/dashboard/enhanced-teacher", { auth: true });
};

export const getTeacherAnalytics = async () => {
  return await http.get("/api/dashboard/teacher-analytics", { auth: true });
};

// Parent Dashboard
export const getParentDashboard = async (parentId) => {
  return await http.get(`/api/dashboard/parent/${parentId}`, { auth: true });
};

export const getEnhancedParentDashboard = async (parentId) => {
  return await http.get(`/api/dashboard/enhanced-parent/${parentId}`, { auth: true });
};

// Admin Dashboard
export const getAdminMetrics = async () => {
  return await http.get("/api/dashboard/metrics", { auth: true });
};

export const getAdminActivities = async () => {
  return await http.get("/api/dashboard/activities", { auth: true });
};

export const getAdminCharts = async () => {
  return await http.get("/api/dashboard/charts", { auth: true });
};

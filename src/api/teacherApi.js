import { http } from "@/api/baseClient";

/**
 * Teacher Management API functions
 */

// Teacher CRUD operations
export const getTeachers = async (params = {}) => {
  return await http.get("/api/teachers", { auth: true, params });
};

export const createTeacher = async (teacherData) => {
  return await http.post("/api/teachers", { auth: true, body: teacherData });
};

export const getTeacher = async (teacherId) => {
  return await http.get(`/api/teachers/${teacherId}`, { auth: true });
};

export const updateTeacher = async (teacherId, teacherData) => {
  return await http.put(`/api/teachers/${teacherId}`, { auth: true, body: teacherData });
};

export const deleteTeacher = async (teacherId) => {
  return await http.del(`/api/teachers/${teacherId}`, { auth: true });
};

// Teacher classes and subjects
export const getTeacherClasses = async (teacherId) => {
  return await http.get(`/api/teachers/${teacherId}/classes`, { auth: true });
};

export const getTeacherSubjects = async (teacherId) => {
  return await http.get(`/api/teachers/${teacherId}/subjects`, { auth: true });
};

// Teacher statistics
export const getTeacherStatistics = async (teacherId) => {
  return await http.get(`/api/teachers/${teacherId}/statistics`, { auth: true });
};

// Teacher assignments
export const assignClassToTeacher = async (teacherId, classId) => {
  return await http.post(`/api/teachers/${teacherId}/assign-class`, {
    auth: true,
    body: { class_id: classId }
  });
};

export const assignSubjectToTeacher = async (teacherId, subjectId) => {
  return await http.post(`/api/teachers/${teacherId}/assign-subject`, {
    auth: true,
    body: { subject_id: subjectId }
  });
};

export const removeClassFromTeacher = async (teacherId, classId) => {
  return await http.post(`/api/teachers/${teacherId}/remove-class`, {
    auth: true,
    body: { class_id: classId }
  });
};

export const removeSubjectFromTeacher = async (teacherId, subjectId) => {
  return await http.post(`/api/teachers/${teacherId}/remove-subject`, {
    auth: true,
    body: { subject_id: subjectId }
  });
};

// Bulk operations
export const bulkUpdateTeacherStatus = async (teachersData) => {
  return await http.post("/api/teachers/bulk/update-status", {
    auth: true,
    body: teachersData
  });
};

// Teacher filtering
export const getTeachersByClass = async (classId) => {
  return await http.get(`/api/teachers/class/${classId}`, { auth: true });
};

export const getTeachersBySubject = async (subjectId) => {
  return await http.get(`/api/teachers/subject/${subjectId}`, { auth: true });
};

import { http } from "@/api/baseClient";

/**
 * Student Management API functions
 */

// Student CRUD operations
export const getStudents = async (params = {}) => {
  return await http.get("/api/students", { auth: true, params });
};

export const createStudent = async (studentData) => {
  return await http.post("/api/students", { auth: true, body: studentData });
};

export const getStudent = async (studentId) => {
  return await http.get(`/api/students/${studentId}`, { auth: true });
};

export const updateStudent = async (studentId, studentData) => {
  return await http.put(`/api/students/${studentId}`, { auth: true, body: studentData });
};

export const deleteStudent = async (studentId) => {
  return await http.del(`/api/students/${studentId}`, { auth: true });
};

// Student attendance
export const getStudentAttendance = async (studentId, params = {}) => {
  return await http.get(`/api/students/${studentId}/attendance`, { auth: true, params });
};

// Student grades
export const getStudentGrades = async (studentId, params = {}) => {
  return await http.get(`/api/students/${studentId}/grades`, { auth: true, params });
};

// Student enrollments
export const getStudentEnrollments = async (studentId) => {
  return await http.get(`/api/students/${studentId}/enrollments`, { auth: true });
};

// Student profile management
export const getStudentProfile = async () => {
  return await http.get("/api/students/profile", { auth: true });
};

export const updateStudentProfile = async (profileData) => {
  return await http.put("/api/students/profile", { auth: true, body: profileData });
};

export const uploadStudentPhoto = async (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  return await http.post("/api/students/upload-photo", {
    auth: true,
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Student filtering and queries
export const getStudentsByClass = async (classId) => {
  return await http.get(`/api/students/by-class/${classId}`, { auth: true });
};

export const getStudentsByAcademicYear = async (academicYearId) => {
  return await http.get(`/api/students/by-academic-year/${academicYearId}`, { auth: true });
};

// Student statistics
export const getStudentStatistics = async () => {
  return await http.get("/api/students/statistics", { auth: true });
};

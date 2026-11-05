import { http } from "@/api/baseClient";

/**
 * Academic Management API functions
 * Handles classes, subjects, courses, academic years, and curriculum
 */

// Classes API
export const getClasses = async (params = {}) => {
  return await http.get("/api/classes/", { auth: true, params });
};

export const createClass = async (classData) => {
  return await http.post("/api/classes", { auth: true, body: classData });
};

export const getClass = async (classId) => {
  return await http.get(`/api/classes/${classId}`, { auth: true });
};

export const updateClass = async (classId, classData) => {
  return await http.put(`/api/classes/${classId}`, { auth: true, body: classData });
};

export const deleteClass = async (classId) => {
  return await http.del(`/api/classes/${classId}`, { auth: true });
};

export const getClassStudents = async (classId) => {
  return await http.get(`/api/classes/${classId}/students`, { auth: true });
};

export const getClassTeachers = async (classId) => {
  return await http.get(`/api/classes/${classId}/teachers`, { auth: true });
};

export const getClassSubjects = async (classId) => {
  return await http.get(`/api/classes/${classId}/subjects`, { auth: true });
};

export const getClassCourses = async (classId) => {
  return await http.get(`/api/classes/${classId}/courses`, { auth: true });
};

export const getClassStatistics = async (classId) => {
  return await http.get(`/api/classes/${classId}/statistics`, { auth: true });
};

export const enrollStudentInClass = async (classId, studentId) => {
  return await http.post(`/api/classes/${classId}/enroll-student`, {
    auth: true,
    body: { student_id: studentId }
  });
};

export const unenrollStudentFromClass = async (classId, studentId) => {
  return await http.post(`/api/classes/${classId}/unenroll-student`, {
    auth: true,
    body: { student_id: studentId }
  });
};

export const assignTeacherToClass = async (classId, teacherId) => {
  return await http.post(`/api/classes/${classId}/assign-teacher`, {
    auth: true,
    body: { teacher_id: teacherId }
  });
};

export const removeTeacherFromClass = async (classId, teacherId) => {
  return await http.post(`/api/classes/${classId}/remove-teacher`, {
    auth: true,
    body: { teacher_id: teacherId }
  });
};

export const getClassesByGrade = async (grade) => {
  return await http.get(`/api/classes/grade/${grade}`, { auth: true });
};

export const getClassesByAcademicYear = async (academicYearId) => {
  return await http.get(`/api/classes/academic-year/${academicYearId}`, { auth: true });
};

// Subjects API
export const getSubjects = async (params = {}) => {
  return await http.get("/api/subjects", { auth: true, params });
};

export const createSubject = async (subjectData) => {
  return await http.post("/api/subjects", { auth: true, body: subjectData });
};

export const getSubject = async (subjectId) => {
  return await http.get(`/api/subjects/${subjectId}`, { auth: true });
};

export const updateSubject = async (subjectId, subjectData) => {
  return await http.put(`/api/subjects/${subjectId}`, { auth: true, body: subjectData });
};

export const deleteSubject = async (subjectId) => {
  return await http.del(`/api/subjects/${subjectId}`, { auth: true });
};

export const getSubjectsByCategory = async (category) => {
  return await http.get(`/api/subjects/category/${category}`, { auth: true });
};

export const getCompulsorySubjects = async () => {
  return await http.get("/api/subjects/compulsory/list", { auth: true });
};

export const getElectiveSubjects = async () => {
  return await http.get("/api/subjects/electives/list", { auth: true });
};

export const getSubjectStatistics = async (subjectId) => {
  return await http.get(`/api/subjects/${subjectId}/statistics`, { auth: true });
};

export const bulkUpdateSubjectStatus = async (subjectsData) => {
  return await http.post("/api/subjects/bulk/update-status", {
    auth: true,
    body: subjectsData
  });
};

export const bulkUpdateSubjectSortOrder = async (sortData) => {
  return await http.post("/api/subjects/bulk/update-sort-order", {
    auth: true,
    body: sortData
  });
};

// Courses API
export const getCourses = async (params = {}) => {
  return await http.get("/api/courses", { auth: true, params });
};

export const createCourse = async (courseData) => {
  return await http.post("/api/courses", { auth: true, body: courseData });
};

export const getCourse = async (courseId) => {
  return await http.get(`/api/courses/${courseId}`, { auth: true });
};

export const updateCourse = async (courseId, courseData) => {
  return await http.put(`/api/courses/${courseId}`, { auth: true, body: courseData });
};

export const deleteCourse = async (courseId) => {
  return await http.del(`/api/courses/${courseId}`, { auth: true });
};

export const getCoursesByClass = async (classId) => {
  return await http.get(`/api/courses/class/${classId}`, { auth: true });
};

export const getCoursesByTeacher = async (teacherId) => {
  return await http.get(`/api/courses/teacher/${teacherId}`, { auth: true });
};

export const getActiveCourses = async () => {
  return await http.get("/api/courses/active/list", { auth: true });
};

export const getCourseStatistics = async (courseId) => {
  return await http.get(`/api/courses/${courseId}/statistics`, { auth: true });
};

export const enrollStudentInCourse = async (courseId, studentId) => {
  return await http.post(`/api/courses/${courseId}/enroll`, {
    auth: true,
    body: { student_id: studentId }
  });
};

export const unenrollStudentFromCourse = async (courseId, studentId) => {
  return await http.post(`/api/courses/${courseId}/unenroll`, {
    auth: true,
    body: { student_id: studentId }
  });
};

export const getEnrolledStudents = async (courseId) => {
  return await http.get(`/api/courses/${courseId}/students`, { auth: true });
};

export const bulkUpdateCourseStatus = async (coursesData) => {
  return await http.post("/api/courses/bulk/update-status", {
    auth: true,
    body: coursesData
  });
};

export const getCourseAnalytics = async (courseId) => {
  return await http.get(`/api/courses/${courseId}/analytics`, { auth: true });
};

// Academic Years API
export const getAcademicYears = async (params = {}) => {
  return await http.get("/api/academic-years", { auth: true, params });
};

export const createAcademicYear = async (academicYearData) => {
  return await http.post("/api/academic-years", { auth: true, body: academicYearData });
};

export const getAcademicYear = async (academicYearId) => {
  return await http.get(`/api/academic-years/${academicYearId}`, { auth: true });
};

export const updateAcademicYear = async (academicYearId, academicYearData) => {
  return await http.put(`/api/academic-years/${academicYearId}`, {
    auth: true,
    body: academicYearData
  });
};

export const deleteAcademicYear = async (academicYearId) => {
  return await http.del(`/api/academic-years/${academicYearId}`, { auth: true });
};

export const getCurrentAcademicYear = async () => {
  return await http.get("/api/academic-years/current", { auth: true });
};

export const getActiveAcademicYear = async () => {
  return await http.get("/api/academic-years/active", { auth: true });
};

export const activateAcademicYear = async (academicYearId) => {
  return await http.post(`/api/academic-years/${academicYearId}/activate`, { auth: true });
};

export const deactivateAcademicYear = async (academicYearId) => {
  return await http.post(`/api/academic-years/${academicYearId}/deactivate`, { auth: true });
};

export const getAcademicYearStatistics = async (academicYearId) => {
  return await http.get(`/api/academic-years/${academicYearId}/statistics`, { auth: true });
};

export const getAcademicYearClasses = async (academicYearId) => {
  return await http.get(`/api/academic-years/${academicYearId}/classes`, { auth: true });
};

export const getAcademicYearStudents = async (academicYearId) => {
  return await http.get(`/api/academic-years/${academicYearId}/students`, { auth: true });
};

// Curriculum API
export const getCurriculums = async (params = {}) => {
  return await http.get("/api/curriculums", { auth: true, params });
};

export const createCurriculum = async (curriculumData) => {
  return await http.post("/api/curriculums", { auth: true, body: curriculumData });
};

export const getCurriculum = async (curriculumId) => {
  return await http.get(`/api/curriculums/${curriculumId}`, { auth: true });
};

export const updateCurriculum = async (curriculumId, curriculumData) => {
  return await http.put(`/api/curriculums/${curriculumId}`, {
    auth: true,
    body: curriculumData
  });
};

export const deleteCurriculum = async (curriculumId) => {
  return await http.del(`/api/curriculums/${curriculumId}`, { auth: true });
};

export const getCurriculumByLevel = async (level) => {
  return await http.get(`/api/curriculums/level/${level}`, { auth: true });
};

export const getActiveCurriculums = async () => {
  return await http.get("/api/curriculums/active/list", { auth: true });
};

export const getCurriculumStatistics = async (curriculumId) => {
  return await http.get(`/api/curriculums/${curriculumId}/statistics`, { auth: true });
};

export const bulkUpdateCurriculumStatus = async (curriculumsData) => {
  return await http.post("/api/curriculums/bulk/update-status", {
    auth: true,
    body: curriculumsData
  });
};
// Organizations API (for registration - public access)
export const getOrganizations = async (params = {}) => {
  return await http.get("/api/organizations", { auth: false, params });
};

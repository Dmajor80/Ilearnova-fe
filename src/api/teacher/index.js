import { http } from "@/api/baseClient";

const TEACHER_API = "/api/teacher";
const resourceId = (id) => encodeURIComponent(id);

export const createTeacherAnnouncement = (announcementData) =>
  http.post(`${TEACHER_API}/announcements/create/`, announcementData, { auth: true });

export const getTeacherAssignments = (params = {}) =>
  http.get(`${TEACHER_API}/assignments/`, { auth: true, params });

export const createTeacherAssignment = (assignmentData) =>
  http.post(`${TEACHER_API}/assignments/`, assignmentData, { auth: true });

export const getTeacherAssignment = (assignmentId) =>
  http.get(`${TEACHER_API}/assignments/${resourceId(assignmentId)}/`, { auth: true });

export const updateTeacherAssignment = (assignmentId, assignmentData) =>
  http.put(
    `${TEACHER_API}/assignments/${resourceId(assignmentId)}/`,
    assignmentData,
    { auth: true }
  );

export const patchTeacherAssignment = (assignmentId, assignmentData) =>
  http.patch(
    `${TEACHER_API}/assignments/${resourceId(assignmentId)}/`,
    assignmentData,
    { auth: true }
  );

export const deleteTeacherAssignment = (assignmentId) =>
  http.del(`${TEACHER_API}/assignments/${resourceId(assignmentId)}/`, { auth: true });

export const getTeacherAssignmentSubmissions = (assignmentId, params = {}) =>
  http.get(
    `${TEACHER_API}/assignments/${resourceId(assignmentId)}/submissions/`,
    { auth: true, params }
  );

export const getTeacherBankQuestion = (questionId) =>
  http.get(`${TEACHER_API}/bank-questions/${resourceId(questionId)}/`, { auth: true });

export const updateTeacherBankQuestion = (questionId, questionData) =>
  http.put(
    `${TEACHER_API}/bank-questions/${resourceId(questionId)}/`,
    questionData,
    { auth: true }
  );

export const deleteTeacherBankQuestion = (questionId) =>
  http.del(`${TEACHER_API}/bank-questions/${resourceId(questionId)}/`, { auth: true });

export const getTeacherClasses = (params = {}) =>
  http.get(`${TEACHER_API}/classes/`, { auth: true, params });

export const createTeacherClass = (classData) =>
  http.post(`${TEACHER_API}/classes/`, classData, { auth: true });

export const getTeacherClass = (classId) =>
  http.get(`${TEACHER_API}/classes/${resourceId(classId)}/`, { auth: true });

export const getTeacherClassMaterials = (classId) =>
  http.get(
    `${TEACHER_API}/classes/${resourceId(classId)}/materials/`,
    { auth: true }
  );

export const createTeacherClassMaterial = (classId, materialData) =>
  http.post(
    `${TEACHER_API}/classes/${resourceId(classId)}/materials/`,
    materialData,
    { auth: true }
  );

export const getTeacherClassSubjects = (classId) =>
  http.get(
    `${TEACHER_API}/classes/${resourceId(classId)}/subjects/`,
    { auth: true }
  );

export const createTeacherClassSubject = (classId, subjectData) =>
  http.post(
    `${TEACHER_API}/classes/${resourceId(classId)}/subjects/`,
    subjectData,
    { auth: true }
  );

export const getTeacherExaminations = (params = {}) =>
  http.get(`${TEACHER_API}/examinations/`, { auth: true, params });

export const createTeacherExamination = (examinationData) =>
  http.post(`${TEACHER_API}/examinations/`, examinationData, { auth: true });

export const getTeacherExamination = (examinationId) =>
  http.get(`${TEACHER_API}/examinations/${resourceId(examinationId)}/`, { auth: true });

export const updateTeacherExamination = (examinationId, examinationData) =>
  http.put(
    `${TEACHER_API}/examinations/${resourceId(examinationId)}/`,
    examinationData,
    { auth: true }
  );

export const patchTeacherExamination = (examinationId, examinationData) =>
  http.patch(
    `${TEACHER_API}/examinations/${resourceId(examinationId)}/`,
    examinationData,
    { auth: true }
  );

export const deleteTeacherExamination = (examinationId) =>
  http.del(`${TEACHER_API}/examinations/${resourceId(examinationId)}/`, { auth: true });

export const getTeacherExaminationSubmissions = (examinationId, params = {}) =>
  http.get(
    `${TEACHER_API}/examinations/${resourceId(examinationId)}/submissions/`,
    { auth: true, params }
  );

export const getTeacherExaminationBankQuestions = (examinationId) =>
  http.get(
    `${TEACHER_API}/examinations/${resourceId(examinationId)}/bank-questions/`,
    { auth: true }
  );

export const addTeacherExaminationBankQuestions = (examinationId, questionData) =>
  http.post(
    `${TEACHER_API}/examinations/${resourceId(examinationId)}/bank-questions/`,
    questionData,
    { auth: true }
  );

export const getTeacherStudents = (params = {}) =>
  http.get(`${TEACHER_API}/students/`, { auth: true, params });

export const getTeacherAttendanceReport = (subjectId, params = {}) =>
  http.get(
    `${TEACHER_API}/subjects/${resourceId(subjectId)}/attendance/report/`,
    { auth: true, params }
  );

export const signTeacherAttendance = (subjectId, attendanceData) =>
  http.post(
    `${TEACHER_API}/subjects/${resourceId(subjectId)}/attendance/sign/`,
    attendanceData,
    { auth: true }
  );

export const getTeacherSubjectTopics = (subjectId) =>
  http.get(`${TEACHER_API}/subjects/${resourceId(subjectId)}/topics/`, { auth: true });

export const createTeacherSubjectTopic = (subjectId, topicData) =>
  http.post(
    `${TEACHER_API}/subjects/${resourceId(subjectId)}/topics/`,
    topicData,
    { auth: true }
  );

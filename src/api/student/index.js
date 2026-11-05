import { http } from "@/api/baseClient";

const STUDENT_API = "/api/student";

const resourceId = (id) => encodeURIComponent(id);

export const getStudentAnnouncements = () =>
  http.get(`${STUDENT_API}/announcements/`, { auth: true });

export const getStudentAssignments = (params = {}) =>
  http.get(`${STUDENT_API}/assignments/`, { auth: true, params });

export const enrollStudentInClass = (classId) =>
  http.post(`${STUDENT_API}/classes/${resourceId(classId)}/enroll/`, { auth: true });

export const getStudentClassMaterials = (classId) =>
  http.get(`${STUDENT_API}/classes/${resourceId(classId)}/materials/`, { auth: true });

export const getStudentClassSubjects = (classId) =>
  http.get(`${STUDENT_API}/classes/${resourceId(classId)}/subjects/`, { auth: true });

export const getStudentExamSubmissions = (params = {}) =>
  http.get(`${STUDENT_API}/exam-submissions/`, { auth: true, params });

export const createStudentExamSubmission = (submissionData) =>
  http.post(`${STUDENT_API}/exam-submissions/`, submissionData, { auth: true });

export const getStudentExamSubmission = (examSubmissionId, params = {}) =>
  http.get(`${STUDENT_API}/exam-submissions/${resourceId(examSubmissionId)}/`, {
    auth: true,
    params
  });

export const createStudentExamSubmissionAt = (examSubmissionId, submissionData) =>
  http.post(
    `${STUDENT_API}/exam-submissions/${resourceId(examSubmissionId)}/`,
    submissionData,
    { auth: true }
  );

export const getStudentExaminations = (params = {}) =>
  http.get(`${STUDENT_API}/examinations/`, { auth: true, params });

export const startStudentExamSession = (examId) =>
  http.post(`${STUDENT_API}/exams/${resourceId(examId)}/session/start/`, { auth: true });

export const getStudentExamSession = (sessionId) =>
  http.get(`${STUDENT_API}/exams/session/${resourceId(sessionId)}/`, { auth: true });

export const saveStudentExamAnswer = (sessionId, answerData) =>
  http.put(
    `${STUDENT_API}/exams/session/${resourceId(sessionId)}/answer/`,
    answerData,
    { auth: true }
  );

export const getStudentExamResult = (sessionId) =>
  http.get(`${STUDENT_API}/exams/session/${resourceId(sessionId)}/result/`, { auth: true });

export const submitStudentExamSession = (sessionId) =>
  http.post(`${STUDENT_API}/exams/session/${resourceId(sessionId)}/submit/`, { auth: true });

export const getStudentSubjectTopics = (subjectId) =>
  http.get(`${STUDENT_API}/subjects/${resourceId(subjectId)}/topics/`, { auth: true });

export const getStudentSubmissions = (params = {}) =>
  http.get(`${STUDENT_API}/submissions/`, { auth: true, params });

export const createStudentSubmission = (submissionData) =>
  http.post(`${STUDENT_API}/submissions/`, submissionData, { auth: true });

export const getStudentSubmission = (submissionId, params = {}) =>
  http.get(`${STUDENT_API}/submissions/${resourceId(submissionId)}/`, {
    auth: true,
    params
  });

export const createStudentSubmissionAt = (submissionId, submissionData) =>
  http.post(
    `${STUDENT_API}/submissions/${resourceId(submissionId)}/`,
    submissionData,
    { auth: true }
  );

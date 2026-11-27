import { http } from "@/api/baseClient";

const TEACHER_API = "/api/teacher";
const resourceId = (id) => encodeURIComponent(id);
const pageParams = (params = {}) => ({ page: params?.page });

export const getTeacherAnalytics = (classId) =>
  http.get(`${TEACHER_API}/analytics/`, {
    auth: true,
    params: classId ? { class_id: classId } : {}
  });

export const getTeacherTimetable = () =>
  http.get(`${TEACHER_API}/timetable/`, { auth: true });

export const createTeacherAnnouncement = (announcementData) =>
  http.post(`${TEACHER_API}/announcements/create/`, announcementData, { auth: true });

export const getTeacherAssignments = (params = {}) =>
  http.get(`${TEACHER_API}/assignments/`, { auth: true, params: pageParams(params) });

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
    { auth: true, params: pageParams(params) }
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

export const getTeacherClasses = () =>
  http.get(`${TEACHER_API}/classes/`, { auth: true });

export const createTeacherClass = (classData) =>
  http.post(`${TEACHER_API}/classes/`, classData, { auth: true });

export const getTeacherClass = (classId) =>
  http.get(`${TEACHER_API}/classes/${resourceId(classId)}/`, { auth: true });

export const getTeacherClassMaterials = (classId) =>
  http.get(
    `${TEACHER_API}/classes/${resourceId(classId)}/materials/`,
    { auth: true }
  );

const TEACHER_CLASS_MATERIAL_FIELDS = new Set([
  "title",
  "description",
  "file",
  "link",
  "content_type",
  "topic",
  "order",
  "estimated_duration_minutes",
  "is_published"
]);

const getTeacherClassMaterialBody = (materialData, fields = TEACHER_CLASS_MATERIAL_FIELDS) => {
  if (typeof FormData !== "undefined" && materialData instanceof FormData) {
    const body = new FormData();
    for (const [key, value] of materialData.entries()) {
      if (fields.has(key)) body.append(key, value);
    }
    return body;
  }

  return Object.fromEntries(
    Object.entries(materialData || {}).filter(([key]) => fields.has(key))
  );
};

export const createTeacherClassMaterial = (classId, materialData) =>
  http.post(
    `${TEACHER_API}/classes/${resourceId(classId)}/materials/`,
    getTeacherClassMaterialBody(materialData),
    { auth: true }
  );

const TEACHER_MATERIAL_FIELDS = new Set([...TEACHER_CLASS_MATERIAL_FIELDS, "subject", "class_obj"]);

// Materials of the teacher's subjects (classless ones included) and classes
// they lead. Filters: subject_id, class_id.
export const getTeacherMaterials = (params = {}) =>
  http.get(`${TEACHER_API}/materials/`, { auth: true, params });

// A material for one of the teacher's subjects (`subject`) or a class
// (`class_obj`). Files must be documents; a refusal answers {file: [reason]}.
export const createTeacherMaterial = (materialData) =>
  http.post(
    `${TEACHER_API}/materials/`,
    getTeacherClassMaterialBody(materialData, TEACHER_MATERIAL_FIELDS),
    { auth: true }
  );

export const getTeacherClassSubjects = (classId) =>
  http.get(
    `${TEACHER_API}/classes/${resourceId(classId)}/subjects/`,
    { auth: true }
  );

export const getTeacherExaminations = (params = {}) =>
  http.get(`${TEACHER_API}/examinations/`, { auth: true, params: pageParams(params) });

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
    { auth: true, params: pageParams(params) }
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

export const getTeacherStudents = () =>
  http.get(`${TEACHER_API}/students/`, { auth: true });

// The teacher's subjects, including ones without a class (class_id/class_name
// null), each with student_count.
export const getTeacherSubjects = () =>
  http.get(`${TEACHER_API}/subjects/`, { auth: true });

// Students taking a subject: its class's, or those enrolled in a classless one.
export const getTeacherSubjectStudents = (subjectId) =>
  http.get(`${TEACHER_API}/subjects/${resourceId(subjectId)}/students/`, { auth: true });

// Extra permissions from the school admin (own classes and subjects only):
// { permissions: [codes], available, classes: [{ id, name, leads }] }.
export const getTeacherPermissions = () =>
  http.get(`${TEACHER_API}/permissions/`, { auth: true });

// The school's students to pick from (needs a manage-students permission).
export const searchTeacherSchoolStudents = (q) =>
  http.get(`${TEACHER_API}/students/search/`, { auth: true, params: { q } });

const classStudentsPath = (classId) => `${TEACHER_API}/classes/${resourceId(classId)}/students/`;
const subjectStudentsPath = (subjectId) => `${TEACHER_API}/subjects/${resourceId(subjectId)}/students/`;

export const getTeacherClassStudents = (classId) =>
  http.get(classStudentsPath(classId), { auth: true });

export const addTeacherClassStudents = (classId, studentIds) =>
  http.post(classStudentsPath(classId), { student_ids: studentIds }, { auth: true });

export const removeTeacherClassStudents = (classId, studentIds) =>
  http.del(classStudentsPath(classId), { auth: true, body: { student_ids: studentIds } });

export const enrolTeacherSubjectStudents = (subjectId, studentIds) =>
  http.post(subjectStudentsPath(subjectId), { student_ids: studentIds }, { auth: true });

export const unenrolTeacherSubjectStudents = (subjectId, studentIds) =>
  http.del(subjectStudentsPath(subjectId), { auth: true, body: { student_ids: studentIds } });

// { name, description, classname: a class they lead, or null }.
export const createTeacherSubject = (subjectData) =>
  http.post(`${TEACHER_API}/subjects/`, subjectData, { auth: true });

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

export const getTeacherCbtExams = (params = {}) =>
  http.get(`${TEACHER_API}/cbt/exams/`, {
    auth: true,
    params: {
      page: params?.page,
      class_id: params?.class_id,
      status: params?.status,
      subject_id: params?.subject_id
    }
  });

export const createTeacherCbtExam = (examData) =>
  http.post(`${TEACHER_API}/cbt/exams/`, examData, { auth: true });

export const getTeacherCbtExam = (examId) =>
  http.get(`${TEACHER_API}/cbt/exams/${resourceId(examId)}/`, { auth: true });

export const patchTeacherCbtExam = (examId, examData) =>
  http.patch(`${TEACHER_API}/cbt/exams/${resourceId(examId)}/`, examData, { auth: true });

export const deleteTeacherCbtExam = (examId) =>
  http.del(`${TEACHER_API}/cbt/exams/${resourceId(examId)}/`, { auth: true });

export const getTeacherCbtAttempts = (examId, params = {}) =>
  http.get(`${TEACHER_API}/cbt/exams/${resourceId(examId)}/attempts/`, {
    auth: true,
    params: pageParams(params)
  });

export const getTeacherCbtAttempt = (attemptId) =>
  http.get(`${TEACHER_API}/cbt/attempts/${resourceId(attemptId)}/`, { auth: true });

export const gradeTeacherCbtAnswer = (attemptId, questionId, gradeData) =>
  http.patch(
    `${TEACHER_API}/cbt/attempts/${resourceId(attemptId)}/answers/${resourceId(questionId)}/`,
    gradeData,
    { auth: true }
  );

export const getTeacherCbtQuestions = (examId, params = {}) =>
  http.get(`${TEACHER_API}/cbt/exams/${resourceId(examId)}/questions/`, {
    auth: true,
    params: pageParams(params)
  });

export const createTeacherCbtQuestion = (examId, questionData) =>
  http.post(
    `${TEACHER_API}/cbt/exams/${resourceId(examId)}/questions/`,
    questionData,
    { auth: true }
  );

export const importTeacherCbtQti = (examId, source) => {
  const path = `${TEACHER_API}/cbt/exams/${resourceId(examId)}/qti-import/`;

  if (typeof source === "string") {
    return http.post(path, source, {
      auth: true,
      headers: { "Content-Type": "application/xml" }
    });
  }

  if (typeof FormData !== "undefined" && source instanceof FormData) {
    return http.post(path, source, { auth: true });
  }

  if (typeof Blob === "undefined" || !(source instanceof Blob)) {
    throw new TypeError("Provide XML text, a file, or FormData containing a file.");
  }

  const body = new FormData();
  body.append("file", source);
  return http.post(path, body, { auth: true });
};

import { http } from "@/api/baseClient";

const PARENT_API = "/api/parent";
const resourceId = (id) => encodeURIComponent(id);

export const getParentChildren = () =>
  http.get(`${PARENT_API}/children/`, { auth: true });

export const getParentChildAttendance = (childId, params = {}) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/attendance/`, {
    auth: true,
    params
  });

export const getParentChildExamResult = (childId, examId) =>
  http.get(
    `${PARENT_API}/children/${resourceId(childId)}/exams/${resourceId(examId)}/results/`,
    { auth: true }
  );

export const getParentChildGrades = (childId) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/grades/`, { auth: true });

export const getParentChildProgress = (childId) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/progress/`, { auth: true });

export const linkParentStudent = (requestData) =>
  http.post(`${PARENT_API}/link-student/`, requestData, { auth: true });

export const getParentChildTimetable = (childId) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/timetable/`, { auth: true });

export const getParentAnnouncements = () =>
  http.get(`${PARENT_API}/announcements/`, { auth: true });

// The child's documents, the same ones the child sees.
export const getParentChildMaterials = (childId, params = {}) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/materials/`, { auth: true, params });

// One of those documents' files.
export const downloadParentChildMaterial = (childId, materialId) =>
  http.get(`${PARENT_API}/children/${resourceId(childId)}/materials/${resourceId(materialId)}/download/`, {
    auth: true,
    responseType: "blob",
  });

/**
 * Term results: score components, score sheets, publishing, report cards.
 * Backend: /api/results/ (see ilearnova-be results_app).
 */
import { http } from "./baseClient";

const RESULTS = "/api/results";

/** Most responses are `{ success, data }`; return the `data` part. */
export const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

const savedScores = (payload) => ({
  results: unwrap(payload) || [],
  unpublished: payload?.unpublished ?? 0,
});

const get = async (path, params) => unwrap(await http.get(path, { auth: true, params }));

export const resultsApi = {
  // Rubrics
  defaults: () => get(`${RESULTS}/grading/`),
  schoolPolicy: () => get(`${RESULTS}/school/grading-policy/`),
  saveSchoolPolicy: async (changes) =>
    unwrap(await http.patch(`${RESULTS}/school/grading-policy/`, changes, { auth: true })),
  subjectAssessment: (subjectId) => get(`${RESULTS}/subjects/${subjectId}/assessment/`),
  saveSubjectAssessment: async (subjectId, components) =>
    unwrap(
      await http.put(`${RESULTS}/subjects/${subjectId}/assessment/`, { components }, { auth: true })
    ),
  resetSubjectAssessment: async (subjectId) =>
    unwrap(await http.del(`${RESULTS}/subjects/${subjectId}/assessment/`, { auth: true })),

  // Teachers
  mySubjects: () => get(`${RESULTS}/subjects/`),
  myClasses: () => get(`${RESULTS}/classes/`),
  scoreSheet: (subjectId, period) => get(`${RESULTS}/subjects/${subjectId}/scores/`, period),
  /** Returns { results, unpublished }: `unpublished` counts published
   * results this edit hid again until the teacher republishes. */
  saveScores: async (subjectId, period, results) =>
    savedScores(
      await http.post(`${RESULTS}/subjects/${subjectId}/scores/`, { ...period, results }, { auth: true })
    ),
  uploadScores: async (subjectId, period, file) => {
    const form = new FormData();
    form.append("session", period.session);
    form.append("term", period.term);
    form.append("file", file);
    return savedScores(await http.post(`${RESULTS}/subjects/${subjectId}/upload/`, form, { auth: true }));
  },
  scoreTemplate: (subjectId, period, fileFormat = "xlsx") =>
    http.get(`${RESULTS}/subjects/${subjectId}/template/`, {
      auth: true,
      params: { ...period, file_format: fileFormat },
      responseType: "blob",
    }),
  publish: async (subjectId, period, publish = true) =>
    unwrap(
      await http.post(`${RESULTS}/subjects/${subjectId}/publish/`, { ...period, publish }, { auth: true })
    ),
  broadsheet: (classId, period) => get(`${RESULTS}/classes/${classId}/broadsheet/`, period),

  // Students and parents
  myReports: (period) => get(`${RESULTS}/me/`, period),
  myReportCard: (period) =>
    http.get(`${RESULTS}/me/report-card/`, { auth: true, params: period, responseType: "blob" }),
  childReports: (childId, period) => get(`${RESULTS}/children/${childId}/`, period),
  childReportCard: (childId, period) =>
    http.get(`${RESULTS}/children/${childId}/report-card/`, {
      auth: true,
      params: period,
      responseType: "blob",
    }),
};

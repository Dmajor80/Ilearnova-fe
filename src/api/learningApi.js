import { http } from "@/api/baseClient";

/**
 * Learning Management API functions
 * Handles learning modules, progress, video sessions, and transcripts
 */

// Learning Modules API
export const getLearningModules = async (params = {}) => {
  return await http.get("/api/learning/modules", { auth: true, params });
};

export const createLearningModule = async (moduleData) => {
  return await http.post("/api/learning/modules", { auth: true, body: moduleData });
};

export const getLearningModule = async (moduleId) => {
  return await http.get(`/api/learning/modules/${moduleId}`, { auth: true });
};

export const updateLearningModule = async (moduleId, moduleData) => {
  return await http.put(`/api/learning/modules/${moduleId}`, { auth: true, body: moduleData });
};

export const deleteLearningModule = async (moduleId) => {
  return await http.del(`/api/learning/modules/${moduleId}`, { auth: true });
};

// Student Progress API
export const getStudentProgress = async (params = {}) => {
  return await http.get("/api/learning/progress", { auth: true, params });
};

export const createStudentProgress = async (progressData) => {
  return await http.post("/api/learning/progress", { auth: true, body: progressData });
};

export const getStudentProgressById = async (progressId) => {
  return await http.get(`/api/learning/progress/${progressId}`, { auth: true });
};

export const updateStudentProgress = async (progressId, progressData) => {
  return await http.put(`/api/learning/progress/${progressId}`, { auth: true, body: progressData });
};

export const deleteStudentProgress = async (progressId) => {
  return await http.del(`/api/learning/progress/${progressId}`, { auth: true });
};

export const getProgressByStudent = async (studentId) => {
  return await http.get(`/api/learning/progress/student/${studentId}`, { auth: true });
};

export const getProgressByModule = async (moduleId) => {
  return await http.get(`/api/learning/progress/module/${moduleId}`, { auth: true });
};

// Video Sessions API
export const getVideoSessions = async (params = {}) => {
  return await http.get("/api/learning/video-sessions", { auth: true, params });
};

export const createVideoSession = async (sessionData) => {
  return await http.post("/api/learning/video-sessions", { auth: true, body: sessionData });
};

export const getVideoSession = async (sessionId) => {
  return await http.get(`/api/learning/video-sessions/${sessionId}`, { auth: true });
};

export const updateVideoSession = async (sessionId, sessionData) => {
  return await http.put(`/api/learning/video-sessions/${sessionId}`, { auth: true, body: sessionData });
};

export const deleteVideoSession = async (sessionId) => {
  return await http.del(`/api/learning/video-sessions/${sessionId}`, { auth: true });
};

// Transcripts API
export const getTranscripts = async (params = {}) => {
  return await http.get("/api/learning/transcripts", { auth: true, params });
};

export const createTranscript = async (transcriptData) => {
  return await http.post("/api/learning/transcripts", { auth: true, body: transcriptData });
};

export const getTranscript = async (transcriptId) => {
  return await http.get(`/api/learning/transcripts/${transcriptId}`, { auth: true });
};

export const updateTranscript = async (transcriptId, transcriptData) => {
  return await http.put(`/api/learning/transcripts/${transcriptId}`, { auth: true, body: transcriptData });
};

export const deleteTranscript = async (transcriptId) => {
  return await http.del(`/api/learning/transcripts/${transcriptId}`, { auth: true });
};

// Learning Statistics API
export const getLearningStatistics = async (params = {}) => {
  return await http.get("/api/learning/statistics", { auth: true, params });
};

// SCORM Import/Export API
export const importScormContent = async (scormFile) => {
  const formData = new FormData();
  formData.append('scorm_file', scormFile);
  return await http.post("/api/learning/scorm/import", {
    auth: true,
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const exportScormContent = async (moduleId) => {
  return await http.get(`/api/learning/scorm/export/${moduleId}`, { auth: true });
};

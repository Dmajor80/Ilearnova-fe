import { http } from "@/api/baseClient";

/**
 * Announcement Management API functions
 */

// Announcement CRUD operations
export const getAnnouncements = async (params = {}) => {
  return await http.get("/api/announcements", { auth: true, params });
};

export const createAnnouncement = async (announcementData) => {
  return await http.post("/api/announcements", { auth: true, body: announcementData });
};

export const getAnnouncement = async (announcementId) => {
  return await http.get(`/api/announcements/${announcementId}`, { auth: true });
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  return await http.put(`/api/announcements/${announcementId}`, { auth: true, body: announcementData });
};

export const deleteAnnouncement = async (announcementId) => {
  return await http.del(`/api/announcements/${announcementId}`, { auth: true });
};

// Announcement filtering
export const getAnnouncementsByDate = async (startDate, endDate) => {
  return await http.get("/api/announcements/by-date", {
    auth: true,
    params: { start_date: startDate, end_date: endDate }
  });
};

export const getActiveAnnouncements = async () => {
  return await http.get("/api/announcements/active", { auth: true });
};

export const getAnnouncementsByPriority = async (priority) => {
  return await http.get(`/api/announcements/priority/${priority}`, { auth: true });
};

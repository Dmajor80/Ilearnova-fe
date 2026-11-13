import { http } from "@/api/baseClient";

/**
 * Communication System API functions
 * Handles forums, forum posts, video calls, and messaging
 */

// Forums API
export const getForums = async (params = {}) => {
  return await http.get("/api/forums", { auth: true, params });
};

export const createForum = async (forumData) => {
  return await http.post("/api/forums", { auth: true, body: forumData });
};

export const getForum = async (forumId) => {
  return await http.get(`/api/forums/${forumId}`, { auth: true });
};

export const updateForum = async (forumId, forumData) => {
  return await http.put(`/api/forums/${forumId}`, { auth: true, body: forumData });
};

export const deleteForum = async (forumId) => {
  return await http.del(`/api/forums/${forumId}`, { auth: true });
};

export const getForumPosts = async (forumId) => {
  return await http.get(`/api/forums/${forumId}/posts`, { auth: true });
};

export const toggleForumPin = async (forumId) => {
  return await http.post(`/api/forums/${forumId}/toggle-pin`, { auth: true });
};

export const getForumStatistics = async () => {
  return await http.get("/api/forums/statistics", { auth: true });
};

// Forum Posts API
export const getForumPostsByForum = async (forumId) => {
  return await http.get(`/api/forum-posts/forums/${forumId}`, { auth: true });
};

export const createForumPost = async (forumId, postData) => {
  return await http.post(`/api/forum-posts/forums/${forumId}`, {
    auth: true,
    body: postData
  });
};

export const getForumPost = async (postId) => {
  return await http.get(`/api/forum-posts/${postId}`, { auth: true });
};

export const updateForumPost = async (postId, postData) => {
  return await http.put(`/api/forum-posts/${postId}`, { auth: true, body: postData });
};

export const deleteForumPost = async (postId) => {
  return await http.del(`/api/forum-posts/${postId}`, { auth: true });
};

export const replyToForumPost = async (forumId, postId, replyData) => {
  return await http.post(`/api/forum-posts/forums/${forumId}/posts/${postId}/reply`, {
    auth: true,
    body: replyData
  });
};

export const getForumPostReplies = async (forumId, postId) => {
  return await http.get(`/api/forum-posts/forums/${forumId}/posts/${postId}/replies`, {
    auth: true
  });
};

export const togglePostPin = async (forumId, postId) => {
  return await http.post(`/api/forum-posts/forums/${forumId}/posts/${postId}/toggle-pin`, {
    auth: true
  });
};

export const togglePostLock = async (forumId, postId) => {
  return await http.post(`/api/forum-posts/forums/${forumId}/posts/${postId}/toggle-lock`, {
    auth: true
  });
};

export const getUserPosts = async () => {
  return await http.get("/api/forum-posts/my-posts", { auth: true });
};

// Video Calls API
export const getVideoCalls = async (params = {}) => {
  return await http.get("/api/video-calls", { auth: true, params });
};

export const createVideoCall = async (callData) => {
  return await http.post("/api/video-calls", { auth: true, body: callData });
};

export const getVideoCall = async (callId) => {
  return await http.get(`/api/video-calls/${callId}`, { auth: true });
};

export const updateVideoCall = async (callId, callData) => {
  return await http.put(`/api/video-calls/${callId}`, { auth: true, body: callData });
};

export const deleteVideoCall = async (callId) => {
  return await http.del(`/api/video-calls/${callId}`, { auth: true });
};

export const startVideoCall = async (callId) => {
  return await http.post(`/api/video-calls/${callId}/start`, { auth: true });
};

export const endVideoCall = async (callId) => {
  return await http.post(`/api/video-calls/${callId}/end`, { auth: true });
};

export const cancelVideoCall = async (callId) => {
  return await http.post(`/api/video-calls/${callId}/cancel`, { auth: true });
};

export const joinVideoCall = async (callId) => {
  return await http.post(`/api/video-calls/${callId}/join`, { auth: true });
};

export const leaveVideoCall = async (callId) => {
  return await http.post(`/api/video-calls/${callId}/leave`, { auth: true });
};

export const getVideoCallParticipants = async (callId) => {
  return await http.get(`/api/video-calls/${callId}/participants`, { auth: true });
};

export const getUpcomingVideoCalls = async () => {
  return await http.get("/api/video-calls/upcoming", { auth: true });
};

export const getVideoCallStatistics = async () => {
  return await http.get("/api/video-calls/statistics", { auth: true });
};

// Direct messaging API
export const getMessageContacts = async (params = {}) => {
  return await http.get("/api/messages/contacts/", { auth: true, params });
};

export const getConversations = async () => {
  return await http.get("/api/messages/conversations/", { auth: true });
};

export const getMessages = async (userId, params = {}) => {
  return await http.get(
    `/api/messages/conversations/${encodeURIComponent(userId)}/`,
    { auth: true, params }
  );
};

export const sendMessage = async (recipientId, body) => {
  return await http.post("/api/messages/", {
    recipient_id: recipientId,
    body
  }, { auth: true });
};

// Notification Preferences API
export const getNotificationPreferences = async () => {
  return await http.get("/api/notification-preferences", { auth: true });
};

export const updateNotificationPreference = async (notificationType, preferenceData) => {
  return await http.put(`/api/notification-preferences/${notificationType}`, {
    auth: true,
    body: preferenceData
  });
};

export const deleteNotificationPreference = async (notificationType) => {
  return await http.del(`/api/notification-preferences/${notificationType}`, { auth: true });
};
